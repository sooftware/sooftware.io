---
title: 'Sooftware Serving - Triton Inference Server'
author: [Soohwan Kim]
tags: [nlp, serving]
image: img/triton.png
date: '2022-09-20T10:00:00.000Z'
draft: false
---

# Sooftware Serving - Triton Inference Server 
  
- Triton Inference Server는 인공지능 모델의 인퍼런스를 도와주는 오픈소스 소프트웨어다.
- 다양한 프레임워크(TensorRT, TensorFlow, PyTorch ,ONNX, 등)를 지원한다.
- 해당 내용은 [Triton Inference Server Docs](https://github.com/triton-inference-server/server/tree/main/docs) 를 공부하며 적은 내용으로, 
대부분의 내용이 해당 문서와 유사합니다.
  
## Quickstart
  
Triton 사용시에는 pre-built 된 [Docker image](https://catalog.ngc.nvidia.com)를 사용하는게 좋다.  
이번 Quickstart에서 다룰 내용:  
  
- Creating a Model Repository
- Launching Triton
- Send an Inference Request
  
### Model Repository
  
- 가장 먼저 Model Repository를 구성해야 한다.
- Model Repository에는 체크포인트와 입출력 configuration 파일이 포함되어야 한다.
- `tritonserver --model-repository=경로`와 같이 실행할 때 경로를 지정해준다.
- Model Repository 구조
```
model_repository/
    |
    |___model1/
    |     |___config.pbtxt
    |     |___version/
    |     |     |___model-files
    |     |___version/
    |     |     |___model-files
    |     |___...
    |___model2/
    |     |___config.pbtxt
    |     |___version/
    |     |     |___model-files
    |     |___version/
    |     |     |___model-files
    |     |___...
    |___...
```
  
- Model Repository 주의할 
  - 모델명 폴더 아래에 버젼으로 된 폴더가 존재해야한다. (버젼은 반드시 INT여야 함)
  - 버젼 폴더 아래에 모델의 체크포인트 및 관련 파일이 위치한다.
  - 모델 체크포인트는 `model.***`여야 한다. (***은 bin 등 플랫폼에 따라 상이)점
   
## `config.pbtxt`

- 모델 관련된 설정을 저장한다.
- 트리톤 서버에서 이 정보를 기반으로 모델을 서빙한다.  
- 예시
```
name: "simple"
platform: "tensorflow_graphdef"
max_batch_size: 8
input [
  {
    name: "INPUT0"
    data_type: TYPE_INT32
    dims: [ 16 ]
  },
  {
    name: "INPUT1"
    data_type: TYPE_INT32
    dims: [ 16 ]
  }
]
output [
  {
    name: "OUTPUT0"
    data_type: TYPE_INT32
    dims: [ 16 ]
  },
  {
    name: "OUTPUT1"
    data_type: TYPE_INT32
    dims: [ 16 ]
  }
]
```
- Parameters:
  - `platform`: 모델 플랫폼 (tensorrt, onns, pytorch, tensorflow 등)
  - `max_batch_size`: 최대 배치사이즈
  - `input (list[dict])`: 입력 텐서들의 정보
    - `name (str)`: 입력 이름
    - `data_type (enum)`: 타입 정보
        - 타입정보는 [https://github.com/triton-inference-server/server/blob/main/docs/model_configuration.md#datatypes](https://github.com/triton-inference-server/server/blob/main/docs/model_configuration.md#datatypes) 여기서 확인.
    - `dims (list[int])`: 텐서 쉐입
        - 다이내믹 차원인 경우는 -1로 기록.
- `output`: 출력 텐서들의 정보
    - 입력텐서와 동일한 구조이다.
  
## 유용한 기능들

(작성중)
  
## Reference

- [Triton Inference Server Docs](https://github.com/triton-inference-server/server/tree/main/docs)