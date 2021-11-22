---
title: 'Large Scale LM (2) Distributed Programming'
author: [Soohwan Kim]
tags: [nlp, parallelism, large-scale, lm]
image: img/big-model2.png
date: '2021-11-22T11:00:00.000Z'
draft: false
---

# Large Scale LM (2) Distributed Programming (작성중)

이 자료는 [[해당 link]](https://github.com/tunib-ai/large-scale-lm-tutorials) 를 참고하며 제 언어로 재작성한 글입니다.  
저의 추가적인 메모나 의견이 삽입되거나 삭제된 내용이 있습니다.  
더 퀄리티가 좋은 자료는 위의 링크를 참고하시길 바랍니다.
  
***
  
Large-Scale 모델은 메모리를 많이 먹기 때문에 어느 정도 커지게 되면 하나의 GPU에 올릴 수가 없습니다. 
Big Model 학습이 어려운 주된 이유죠. 그래서 이런 Large-Scale 모델의 경우 여러대의 GPU에 모델을 쪼개서 올려야 합니다. 
그리고 쪼개진 모델을 받은 GPU들간에 네트워크로 통신을 하면서 값을 주고 받아야 합니다. 이렇게 여러대의 장비로 분산시켜서 
처리하는 작업을 분산처리라고 합니다. 이번 포스트에서는 PyTorch 프레임워크를 이용한 분산 프로그래밍 기초에 대해서 알아보겠습니다.  
  
## Multi-processing with PyTorch
  
분산 프로그래밍의 원활한 이해를 돕기 위해 PyTorch의 Multi-processing 애플리케이션에 대한 튜토리얼을 먼저 살펴보겠습니다.  
  
### Multi-process Terms
  
- Node: 컴퓨터 혹은 서버와 같은 장비를 말합니다. AI 쪽에서는 보통 GPU 여러대가 묶여있는 하나의 컴퓨터 or 서버를 칭합니다.
- Global Rank: 원래는 프로세스의 우선순위를 의미하지만 여기서는 의미는 주로 **GPU의 ID**라고 보면 됩니다.
- Local Rank: 원래는 한 노드내에서의 프로세스 우선순위를 의미하지만, 여기서는 **한 노드내의 GPU ID**라고 보면 됩니다.
- World Size: 프로세스의 개수를 의미합니다. 여기서는 주로 GPU의 개수를 의미합니다.

<img src="https://github.com/tunib-ai/large-scale-lm-tutorials/raw/ca29ff9f945a59abcc3e3f1000c4d83de97973d4/images/process_terms.png" width="500">  
  
### Multi-process Application 실행 방법
  
PyTorch Multi-process 어플리케이션 실행 방법은 두 가지가 있습니다.

1. 으사용자의 코드가 메인 프로세스가 되어 특정 함수를 서브프로세스로 분기한다.
2. PyTorch 런쳐가 메인 프로세스가 되어 사용자 코드 전체를 서브 프로세스로 분기한다.
  
### 1) 사용자의 코드가 메인 프로세스가 되어 특정 함수를 서브프로세스로 분기한다.
  
<img src="https://github.com/tunib-ai/large-scale-lm-tutorials/raw/ca29ff9f945a59abcc3e3f1000c4d83de97973d4/images/multi_process_1.png" width="500"> 
  
일반적으로 `Spawn`과 `Fork` 등 두 가지 방식으로 분기할 수 있습니다.
  
- `Spawn`
  - 메인 프로세스의 자원을 물려주지 않고 필요한 만큼의 자원만 서브프로세스에게 새로 할당
  - 속도가 느리지만 안전한 방식
- `Fork`
  - 메인 프로세스의 모든 자원을 서브 프로세스와 공유하고 프로세스를 시작
  - 속도가 빠르지만 위험한 방식
    
```python
import torch.multiprocessing as mp


def fn(rank, param1, param2):
    print(f"{param1} {param2} - rank: {rank}")


processes = list()
mp.set_start_method("spawn")

for rank in range(4):
    process = mp.Process(target=fn, args=(rank, "A0", "B1"))
    process.daemon = False
    process.start()
    processes.append(process)

for process in processes:
    process.join()
```
  
```
A0 B1 - rank: 0
A0 B1 - rank: 2
A0 B1 - rank: 3
A0 B1 - rank: 1
```

### 2) PyTorch 런처가 부모 프로세스가 되어 사용자 코드 전체를 서브프로세스로 분기한다.
  
<img src="https://github.com/tunib-ai/large-scale-lm-tutorials/raw/ca29ff9f945a59abcc3e3f1000c4d83de97973d4/images/multi_process_2.png" width="500">
  
이 방식은 `python -m torch.distributed.launch --nproc_per_node=n OOO.py`와 같은 방식으로 실행해줘야 동작합니다.  
  
```python
import os

print(f"hello world, {os.environ['RANK']}")
```

```
hello world, 0
hello world, 1
hello world, 2
hello world, 3
```
  
## Distributed Programming with PyTorch
  
#### Concept of Message Passing
  

