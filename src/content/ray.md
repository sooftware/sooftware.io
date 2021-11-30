---
title: 'Ray: multi-processing library'
author: [Soohwan Kim]
tags: [toolkit]
image: img/ray.png
date: '2021-07-03T10:00:00.000Z'
draft: false
---

## Ray: multi-processing library  
   
`ray`는 파이썬 멀티프로세싱 라이브러리입니다. 파이썬에서 기본적으로 제공되는 `multiprocessing` 라이브러리가 있지만, 
그보다 더 간단하고 더 빠른 멀티프로세싱을 제공하기 위해 제작되고 있는 오픈소스 프로젝트입니다.  
  
- `ray`는 cpu 수가 많은 환경일수록 더 빠르다고 알려져 있음
- 로컬 환경, 클라우드의 쿠버네티스(AWS, GCP, Azure) 환경, 온프레미스 쿠버네티스 등 다양한 환경에서 사용할 수 있음  
- 사용법이 쉬
- 프로젝트 링크: https://github.com/ray-project/ray  
  
## Installation
  
```
$ pip install ray
```
  
## Quick Start
  
`ray`는 아래 코드와 같이 간단하게 사용 가능합니다.
  
```python
import ray
import psutil

num_workers = psutil.cpu_count()
ray.init(num_cpus=num_workers)

@ray.remote
def f(x):
    return x * x

futures = [f.remote(i) for i in range(4)]
print(ray.get(futures))
```

위 코드와 같이 기존 함수를 `@ray.remote` 데코레이터로 감싸고 호출시 [FUNC_NAME].remote()로 호출하면 됩니다.  
주의할 점은 `remote()` 호출 이후 `get()`을 꼭 호출해야 원하는 결과값을 얻을 수 있습니다.  
  
- 주의할 점  
  
`get()` 호출은 최대한 적게하는 것이 좋습니다. for문 안에서 `remote()` 호출 할때마다 `get()`을 호출하게 되면 프로그램 실행속도가 상당히 느려지게 됩니다.  
  
***  
  
이 외에오 ray 대쉬보드, class에서의 ray 사용 등 다룰 것은 많지만 개인적으로 함수를 데코레이터로 감싸서 쓰는 방식이 가장 간단하면서 쓰임이 좋아서 여기까지만 작성하겠습니다.