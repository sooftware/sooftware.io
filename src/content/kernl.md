---
layout: post
title: 'Sooftware Serving - Kernl'
author: [Soohwan Kim]
tags: ['nlp', 'serving']
image: img/kernl.png
date: '2022-10-30T15:11:55.000Z'
draft: false
---

# Sooftware Serving - Kernl  
  
[ELS-RD (Lefebvre Dalloz Services)](https://github.com/ELS-RD) 라는 단체에서 [Kernl](https://github.com/ELS-RD/kernl) 이라는 좋은 
Inference Enginer을 내주었습니다! PyTorch 기반의 Transformer 모델들의 인퍼런스를 최적화해주는 라이브러리입니다. 
[Open AI Triton](https://openai.com/blog/triton/) 기반으로 짜여져 있다고 하네요.
  
<img src="https://github.com/ELS-RD/kernl/raw/main/resources/images/speedup.png" width="550">
  
위 그림을 보면, 상당히 빨라 보입니다. 많이 쓰이는 ONNX보다는 모든 상황에서 더 빠르고, TensorRT나 DeepSpeed와 비교했을 때는 
상황에 따라 엎치락뒤치락 하는 것 같습니다.  
  
애증의 TensorRT라고 부를 정도로, 속도는 빠르지만 환경설정이 어렵기로 유명한데, 이 라이브러리가 적절한 
대안이 됐으면 좋겠네요.  
  
## Usage
  
```python
import torch
from transformers import AutoModel
from kernl.model_optimization import optimize_model

model = AutoModel.from_pretrained(model_name).eval().cuda()
optimized_model = optimize_model(model)

inputs = ...

with torch.inference_mode(), torch.cuda.amp.autocast():
    outputs = optimized_model(**inputs)
```
  
위의 Usage를 보시다싶이, 사용법이 간단합니다.  
많이들 쓰시는 Huggingface의 Transformers와 쉽게 연동되는 점이 큰 강점인 것 같네요.  
또한 유저들이 편하게 커스터마이징 가능하도록 코드를 최대한 쉽고 짧게 짰다고 합니다.  
  
## Installation
  
```
pip install torch==1.12.1 -U --extra-index-url https://download.pytorch.org/whl/cu116
git clone https://github.com/ELS-RD/kernl && cd kernl
pip install -e .
```
  
설치 커맨드입니다. 주의사항으로, 파이썬 3.9 이상의 버젼만 지원된다고 합니다.  
  
## Reference
  
- Kernl: https://github.com/ELS-RD/kernl
- ELS-RD: https://github.com/ELS-RD
- Open AI Triton: https://openai.com/blog/triton/
  