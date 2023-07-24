---
layout: post
title: 'Huggingface PEFT (Parameter-Efficient Fine-Tuning)'
author: [Soohwan Kim]
tags: ['huggingface', 'nlp', 'lora']
image: img/peft.png
date: '2023-03-31T15:11:55.000Z'
draft: false
---

# Huggingface PEFT (Parameter-Efficient Fine-Tuning)
  
허깅페이스에서 나온 [PEFT](https://github.com/huggingface/peft)라는 라이브러리인데 [LoRA](https://arxiv.org/pdf/2106.09685.pdf), [Prefix Tuning](https://aclanthology.org/2021.acl-long.353/), [P-Tuing](https://arxiv.org/pdf/2103.10385.pdf), [Prompt Tuning](https://arxiv.org/pdf/2104.08691.pdf)
과 같은 기법들을 쉽게 사용하도록 나온 라이브러리다. P-Tuning, Prefix Tuning, Prompt Tuning은 처음 나왔을때 직접 논문 보면서 구현해서 적용했었는데 이렇게 쉽게 가능하니 감회가 새롭다.  
  
특히 최근 각광받는 LoRA를 쉽게 사용 가능하다는 점에서 굉장히 좋다.  
  
## Usage
  
```python
from transformers import AutoModelForCausalLM
from peft import get_peft_config, get_peft_model, LoraConfig, TaskType
model_name_or_path = "bigscience/mt0-large"
tokenizer_name_or_path = "bigscience/mt0-large"

peft_config = LoraConfig(
    task_type="CAUSAL_LM", inference_mode=False, r=8, lora_alpha=32, lora_dropout=0.1
)

model = AutoModelForCausalLM.from_pretrained(model_name_or_path)
model = get_peft_model(model, peft_config)
model.print_trainable_parameters()
# output: trainable params: 2359296 || all params: 1231940608 || trainable%: 0.19151053100118282
```
위 코드로 PEFT 모델로 변경해준 뒤 사용하면 된다.  
그리고 모델을 저장하면 base_model 파라미터를 제외한 Adapter 부분만 저장이 된다.
  
## Reference
  
- https://github.com/huggingface/peft
  
