---
title: 'GPT-NeoX - DeepSpeed Inference'
author: [Soohwan Kim]
tags: [toolkit, environment]
image: img/neox.png
date: '2023-05-24T10:00:00.000Z'
draft: false
---

# GPT-NeoX - DeepSpeed Inference
  
DeepSpeed Inference를 사용하면 간단하게 모델 추론 성능을 끌어올릴 수 있다.  
Tensor Parallel 등의 최적화를 쉽게 제공하는데, `injection`이라는 기능을 사용하면 더욱 빠르게 할 수 있다.
  
`replace_with_kernel_inject=True`로 넣어주면 Bert, GPT2, GPT-Neo and GPT-J 모델들은 알아서 최적화를 해주는데, 
NeoX는 아직 자동으로 최적화가 안 된다.  
  
그래서 조금 커스텀하게 다음과 같이 적용해서 사용 가능하다.  
  
```python
import deepspeed
import torch
from transformers import AutoModelForCausalLM, GPTNeoXLayer

with deepspeed.OnDevice(dtype=torch.float16, device="cuda"):
    model = AutoModelForCausalLM.from_pretrained('EleutherAI/polyglot-ko-5.8b', torch_dtype=torch.float16, cache_dir='/data/.cache')

model = deepspeed.init_inference(
    model,
    mp_size=2,
    dtype=torch.float16,
    injection_policy={GPTNeoXLayer: ('attention.dense','mlp.dense_4h_to_h')}
).module
```
  