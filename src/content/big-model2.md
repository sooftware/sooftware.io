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
  
OS 과목에서 배우는 개념이죠. 몇 년 전에 OS 과목을 배울 때 Message Passing은 분산 환경에서 주로 사용된다고 배운 기억이 있습니다. 
Message Passing이란 Shared Memory(공유 메모리) 없이 프로세스간에 데이터를 주고 받는 방법입니다. 
특정 태그가 달린 데이터를 네트워크에 보내면 다른 프로세스간 해당 데이터를 리시브를 하도록 하는 방식입니다. 
코드 레벨에서 특정 태그를 이용하여 프로그래밍 해두면 원하는대로 원하는 프로세스에 데이터를 전달할 수 있습니다. 
Large-scale 모델 개발시 이용되는 분산 통신 역시 대부분 이런 Message Passing 기법이 사용됩니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/147876208-04481ccb-e115-41c4-9722-9639c185c498.png" width="400">  
  
#### MPI (Message Passing Interface)
  
MPI는 Message Passing에 대한 표준 인터페이스입니다. MPI는 Message Passing에 사용되는 여러 연산 (e.g. broadcast, reduce, scatter, gather, ...) 
등이 정의되어 있으며 대표적으로 OpenMPI라는 오픈소스가 존재합니다.   
  
https://www.open-mpi.org/  
  
#### NCCL & GLOO
  
하지만 실제 사용에서는 openmpi보다는 nccl이나 gloo 같은 라이브러리를 많이 사용합니다.
  
- NCCL (NVIDIA COllective Communication Library)
  - NVIDIA에서 개발한 GPU 특화 Message Passing 라이브러리 (`nickel`라고 읽는다고 합니다.)
  - NVIDIA GPU에서 사용시, 다른 라이브러리에 비해 월등히 빠르다고 알려져 있습니다.
- GLOO (Facebook's Collective Communication Library)
  - Facebook에서 개발된 Message Passing 라이브러리입니다.
  - `torch`에서 주로 CPU 분산 처리에 사용됩니다.
- 일반적으로는 CPU는 GLOO, GPU는 NCCL을 사용하면 됩니다.

#### torch.distributed 패키지
  
torch.distributed 패키지는 gloo, nccl, openmpi 등을 하이레벨에서 래핑하고 있기 때문에, 
일반적으로는 torch.distributed를 이용해서 프로그래밍을 하게 됩니다.  
  
#### Process Group
  
프로세스가 많은 경우, 관리하기가 어렵습니다. 이럴때는 보통 프로세스 그룹을 만들어서 관리를 합니다. 
`torch.distributed`의 `init_process_group`을 호출하면 전체 프로세스가 속한 default group이 만들어집니다. 
  
주의할 점은 `init_process_group` 함수는 반드시 서브프로세스에서 실행되어야 하며, 추가로 사용자가 원하는 프로세스들만 모아서 
그룹을 생성하려면 `new_group`을 호출해야 합니다.  
  
- 예제 1
  
```python
import os
import torch.distributed as dist

os.environ["RANK"] = "0"
os.environ["LOCAL_RANK"] = "0"
os.environ["WORLD_SIZE"] = "1"

os.environ["MASTER_ADDR"] = "localhost"
os.environ["MASTER_PORT"] = "29500"

dist.init_process_group('nccl', rank=0, wirld_size=1)
process_group = dist.new_group([0])
```
  
- 예제 2
  
```python
import os
import torch.multiprocessing as mp
import torch.distributed as dist


def fn(rank, world_size):
    dist.init_process_group('nccl', rank=rank, world_size=world_size)
    group = dist.new_group([i for i in range(world_size)])


os.environ["MASTER_ADDR"] = "localhost"
os.environ["MASTER_PORT"] = "29500"
os.environ["WORLD_SIZE"] = "4"

mp.spawn(
  fn=fn,
  args=(4, 1),
  nprocs=4,
  join=True,
  daemon=False,
  start_method="spawn",
)
```
  
위 코드의 경우 python3 ***.py와 같이 실행하면 됩니다.  
  
- 예제 3

```python
import torch.distributed as dist

dist.init_process_group(backend="nccl")
group = dist.new_group([i for i in range(dist.get_world_size())])
```
  
위 코드는 python3 -m torch.distributed.launch --nproc_per_node=N ***.py와 같이 실행할 수 있습니다.  
  
#### P2P Communication (Point to Point)
  
<img src="https://user-images.githubusercontent.com/42150335/147877032-e1439e42-8db2-451a-9098-43063ac914e1.png" width="300">  
  
P2P 통신은 특정 프로세스에서 다른 프로세스로 데이터를 전송하는 통신입니다. torch.distributed 패키지의 `send`, `recv` 함수를 활용하여 통신할 수 있습니다.  
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("gloo")

if dist.get_rank() == 0:
    tensor = torch.randn(2, 2)
    dist.send(tensor, dst=1)

elif dist.get_rank() == 1:
    tensor = torch.zeros(2, 2)
    print(f"rank 1 before: {tensor}\n")
    dist.recv(tensor, src=0)
    print(f"rank 1 after: {tensor}\n")

else:
    raise RuntimeError("wrong rank")
```
  
`send`, `recv`는 동기적으로 통신합니다. 비동기 방식 (non-blocking)으로 사용하려면 `isend`, `irecv`를 사용해야 합니다. 
비동기 방식에서는 `wait()` 메서드를 통해 다른 프로세스의 통신이 끝날때까지 기다린 뒤에 접근해야 합니다. 
멀티스레딩 프로그래밍 할 때가 기억나네요 😅
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("gloo")

if dist.get_rank() == 0:
    tensor = torch.randn(2, 2)
    request = dist.isend(tensor, dst=1)
elif dist.get_rank() == 1:
    tensor = torch.zeros(2, 2)
    request = dist.irecv(tensor, src=0)
else:
    raise RuntimeError("wrong rank")

request.wait()

print(f"rank {dist.get_rank()}: {tensor}")
```
  
### Collective Communication
  
Collective Communication은 여러 프로세스가 참여하는 통신을 의미합니다. 다양한 연산들이 있지만 기본적으로 
아래 4개의 연산이 중요합니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/147877159-26b24204-de88-416b-9ad0-5c1061a82c26.png" width="450">
  
여기 4개에 추가로 `all-reduce`, `all-gather`, `reduce-scatter` 등의 복합 연산과 동기화 연산인 `barrier`까지 총 8개 연산에 대해 아래에서 알아보겠습니다.  
  
#### Broadcast
  
Broadcast는 특정 프로세스의 데이터를 그룹내의 모든 프로세스에 복사하는 연산입니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/147877187-10e16fb5-620f-496f-b52f-04769d47ad69.png" width="400">  
  
`torch.distributed.broadcast`로 사용 가능합니다. `broadcast`는 상황에 따라서 P2P 통신 용도로도 사용 가능합니다. 
  
- 참고 예제 (deepspeed/runtime/pipe/p2p.py)
  
```python
def send(tensor, dest_stage, async_op=False):
    global _groups
    assert async_op == False, "Doesnt support async_op true"
    src_stage = _grid.get_stage_id()
    _is_valid_send_recv(src_stage, dest_stage)

    dest_rank = _grid.stage_to_global(stage_id=dest_stage)
    if async_op:
        global _async
        op = dist.isend(tensor, dest_rank)
        _async.append(op)
    else:

        if can_send_recv():
            return dist.send(tensor, dest_rank)
        else:
            group = _get_send_recv_group(src_stage, dest_stage)
            src_rank = _grid.stage_to_global(stage_id=src_stage)
            return dist.broadcast(tensor, src_rank, group=group, async_op=async_op)
```
  
#### Reduce
  
Reduce는 각 프로세스가 가진 데이터로 특정 연산을 수행해서 출력을 하나의 디바이스로 모아주는 연산입니다. 
주로 sum, max, min 등의 연산을 수행합니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/147877296-57e4f5e4-9d50-4424-a674-08e3d5ecc20a.png" width="400">  
  
- Reduce sum 예시
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("nccl")
rank = dist.get_rank()
torch.cuda.set_device(rank)

tensor = torch.ones(2, 2).to(torch.cuda.current_device()) * rank
# rank==0 => [[0, 0], [0, 0]]
# rank==1 => [[1, 1], [1, 1]]
# rank==2 => [[2, 2], [2, 2]]
# rank==3 => [[3, 3], [3, 3]]

dist.reduce(tensor, op=torch.distributed.ReduceOp.SUM, dst=0)

if rank == 0:
    print(tensor)

# tensor([[6., 6.],
#         [6., 6.]]
```
  
#### Scatter
  
Scatter는 여러 element를 쪼개서 각 device에 뿌려주는 연산입니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/147877358-f444a3e4-de35-4bd9-bb1d-9825b505add2.png" width="400">
  
- 예시  
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("gloo")
# nccl은 scatter를 지원하지 않습니다.
rank = dist.get_rank()
torch.cuda.set_device(rank)


output = torch.zeros(1)
print(f"before rank {rank}: {output}\n")

if rank == 0:
    inputs = torch.tensor([10.0, 20.0, 30.0, 40.0])
    inputs = torch.split(inputs, dim=0, split_size_or_sections=1)
    # (tensor([10]), tensor([20]), tensor([30]), tensor([40]))
    dist.scatter(output, scatter_list=list(inputs), src=0)
else:
    dist.scatter(output, src=0)

print(f"after rank {rank}: {output}\n")

# before rank 0: tensor([0.])
# before rank 3: tensor([0.])
# after rank 3: tensor([40.])
# before rank 1: tensor([0.])
# before rank 2: tensor([0.])
# after rank 0: tensor([10.])
# after rank 1: tensor([20.])
# after rank 2: tensor([30.])
```
  
`nccl`에서는 scatter 연산이 지원되지 않아서 아래 같은 방법으로 scatter 연산을 수행합니다.  
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("nccl")
rank = dist.get_rank()
torch.cuda.set_device(rank)

inputs = torch.tensor([10.0, 20.0, 30.0, 40.0])
inputs = torch.split(tensor=inputs, dim=-1, split_size_or_sections=1)
output = inputs[rank].contiguous().to(torch.cuda.current_device())
print(f"after rank {rank}: {output}\n")

# after rank 2: tensor([30.], device='cuda:2')
# after rank 3: tensor([40.], device='cuda:3') 
# after rank 0: tensor([10.], device='cuda:0')
# after rank 1: tensor([20.], device='cuda:1')
```
  
- Megatron-LM Scatter 예시
  
```python
def _split(input_):
    """Split the tensor along its last dimension and keep the
    corresponding slice."""

    world_size = get_tensor_model_parallel_world_size()
    # Bypass the function if we are using only 1 GPU.
    if world_size==1:
        return input_

    # Split along last dimension.
    input_list = split_tensor_along_last_dim(input_, world_size)

    # Note: torch.split does not create contiguous tensors by default.
    rank = get_tensor_model_parallel_rank()
    output = input_list[rank].contiguous()

    return output

class _ScatterToModelParallelRegion(torch.autograd.Function):
    """Split the input and keep only the corresponding chuck to the rank."""

    @staticmethod
    def symbolic(graph, input_):
        return _split(input_)

    @staticmethod
    def forward(ctx, input_):
        return _split(input_)

    @staticmethod
    def backward(ctx, grad_output):
        return _gather(grad_output)
```
  
#### Gather
  
Gather는 여러 디바이스에 존재하는 텐서를 하나로 모아주는 연산입니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/147877443-3e479d6f-c7e0-4da4-9f77-723e7e3208a6.png" width="400">
  
- gather 예시
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("gloo")
# nccl은 gather를 지원하지 않습니다.
rank = dist.get_rank()
torch.cuda.set_device(rank)

input = torch.ones(1) * rank
# rank==0 => [0]
# rank==1 => [1]
# rank==2 => [2]
# rank==3 => [3]

if rank == 0:
    outputs_list = [torch.zeros(1), torch.zeros(1), torch.zeros(1), torch.zeros(1)]
    dist.gather(input, gather_list=outputs_list, dst=0)
    print(outputs_list)
else:
    dist.gather(input, dst=0)

# [tensor([0.]), tensor([1.]), tensor([2.]), tensor([3.])]
```
  
#### All-reduce  
  
이름 앞에 All이 붙은 연산들은 해당 연산을 수행한 뒤, 결과를 모든 디바이스로 broadcast하는 연산입니다. 
아래 그림은 All-reduce의 예시입니다.
  
<img src="https://user-images.githubusercontent.com/42150335/147877565-20269bae-5962-4fbb-a392-77999b0812a2.png" width="400">
  
- All-reduce sum 예시

```python
import torch
import torch.distributed as dist

dist.init_process_group("nccl")
rank = dist.get_rank()
torch.cuda.set_device(rank)

tensor = torch.ones(2, 2).to(torch.cuda.current_device()) * rank
# rank==0 => [[0, 0], [0, 0]]
# rank==1 => [[1, 1], [1, 1]]
# rank==2 => [[2, 2], [2, 2]]
# rank==3 => [[3, 3], [3, 3]]

dist.all_reduce(tensor, op=torch.distributed.ReduceOp.SUM)

print(f"rank {rank}: {tensor}\n")

# rank 1: tensor([[6., 6.],
#         [6., 6.]], device='cuda:1')
# rank 2: tensor([[6., 6.],
#         [6., 6.]], device='cuda:2')
# rank 0: tensor([[6., 6.],
#         [6., 6.]], device='cuda:0')
# rank 3: tensor([[6., 6.],
#         [6., 6.]], device='cuda:3')
```
  
#### All-gather
  
All-gather는 gather를 수행한 뒤, 모아진 결과를 모든 디바이스로 복사합니다. 
All-reduce와 비슷해보이지만 결과를 보면 다른 연산인 것을 알 수 있습니다.  
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("nccl")
rank = dist.get_rank()
torch.cuda.set_device(rank)

input = torch.ones(1).to(torch.cuda.current_device()) * rank
# rank==0 => [0]
# rank==1 => [1]
# rank==2 => [2]
# rank==3 => [3]

outputs_list = [
    torch.zeros(1, device=torch.device(torch.cuda.current_device())),
    torch.zeros(1, device=torch.device(torch.cuda.current_device())),
    torch.zeros(1, device=torch.device(torch.cuda.current_device())),
    torch.zeros(1, device=torch.device(torch.cuda.current_device())),
]

dist.all_gather(tensor_list=outputs_list, tensor=input)
print(outputs_list)

# [tensor([0.], device='cuda:1'), tensor([1.], device='cuda:1'), tensor([2.], device='cuda:1'), tensor([3.], device='cuda:1')]
# [tensor([0.], device='cuda:0'), tensor([1.], device='cuda:0'), tensor([2.], device='cuda:0'), tensor([3.], device='cuda:0')]
# [tensor([0.], device='cuda:2'), tensor([1.], device='cuda:2'), tensor([2.], device='cuda:2'), tensor([3.], device='cuda:2')]
# [tensor([0.], device='cuda:3'), tensor([1.], device='cuda:3'), tensor([2.], device='cuda:3'), tensor([3.], device='cuda:3')]
```
  
#### Reduce-scatter
  
Reduce scatter는 Reduce를 수행한 뒤, 결과를 쪼개서 디바이스에 반환합니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/147877668-57d1728c-1451-4f6a-a37a-6c59bcb42d68.png" width="400">
  
- Reduce scatter 예제  
  
```python
import torch
import torch.distributed as dist

dist.init_process_group("nccl")
rank = dist.get_rank()
torch.cuda.set_device(rank)

input_list = torch.tensor([1, 10, 100, 1000]).to(torch.cuda.current_device()) * rank
input_list = torch.split(input_list, dim=0, split_size_or_sections=1)
# rank==0 => [0, 00, 000, 0000]
# rank==1 => [1, 10, 100, 1000]
# rank==2 => [2, 20, 200, 2000]
# rank==3 => [3, 30, 300, 3000]

output = torch.tensor([0], device=torch.device(torch.cuda.current_device()),)

dist.reduce_scatter(
    output=output,
    input_list=list(input_list),
    op=torch.distributed.ReduceOp.SUM,
)

print(f"rank {rank}: {output}\n")

# rank 0: tensor([6], device='cuda:0')
# rank 2: tensor([600], device='cuda:2')
# rank 1: tensor([60], device='cuda:1')
# rank 3: tensor([6000], device='cuda:3')
```
  
#### Barrier
  
Barrier는 프로세스 동기화를 위해 사용됩니다. 먼저 barrier에 도착한 프로세스는 모든 프로세스가 해당 지점까지 실행되는 것을 기다립니다. 
  
```python
import time
import torch.distributed as dist

dist.init_process_group("nccl")
rank = dist.get_rank()

if rank == 0:
    seconds = 0
    while seconds <= 3:
        time.sleep(1)
        seconds += 1
        print(f"rank 0 - seconds: {seconds}\n")

print(f"rank {rank}: no-barrier\n")
dist.barrier()
print(f"rank {rank}: barrier\n")

# rank 2: no-barrier
# rank 1: no-barrier
# rank 3: no-barrier
# rank 0 - seconds: 1
# rank 0 - seconds: 2
# rank 0 - seconds: 3
# rank 0 - seconds: 4
# rank 0: no-barrier
# rank 0: barrier
# rank 1: barrier
# rank 3: barrier
# rank 2: barrier
```