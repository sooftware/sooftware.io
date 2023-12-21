---
layout: post
title: 'What is MoE? (Mixture of Experts) - 1'
author: [Soohwan Kim]
tags: ['nlp', 'mixtral']
image: img/moe.png
date: '2023-12-22T01:11:55.000Z'
draft: false
---

# What it MoE? (Mixture of Experts) - 1
  
현존 최강 LLM인 GPT-4에서 "MoE (Mixture of Experts)" 방식을 채택하여 사용하고 있다고 알려졌는데요, 최근 AI계의 뜨거운 감자 Mistral AI에서 [Mistral-7B](https://huggingface.co/mistralai/Mistral-7B-v0.1)라는 좋은 성능의 모델을 오픈소스로 공개한지 몇 달이 채 되지 않았는데 몇일 전, Mixtral이라는 46.7B 모델을 오픈소스로 공개했습니다!  
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/40a24753-386e-4271-bf4b-eb7ab90e8dbe" height=280>

모델 사이즈도 사이즈지만, Mixtral이 "MoE" 방식을 채택해서 사용했으며, LLaMA-2 70B를 상회하는 성능을 보여서 더욱 주목을 받고 있습니다. (Inference 속도는 6배나 빠르다고 합니다 🫢)  
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/cafd232f-c846-4502-b185-3db1ad06d21a" height=300>

Mixtral은 총 46.7B개의 파라미터 사이즈를 가지고 있찌만, 실제 인퍼런스할때는 12.9B의 추론 속도를 보여준다고 하는데요, 이게 어떻게 가능한 걸까요? 🤔  
  
이를 이해하기 위해서는 "MoE" 개념을 이해해야 합니다!
  
## MoE (Mixture of Experts)
  
모델 파라미터 수가 많을수록, 모델 성능이 올라간다는 것은 이미 여러 연구를 통해 Scaling-Law가 입증되었습니다. 그래서 모델의 성능을 파악할때 파라미터 수는 가장 중요한 요소중 하나입니다. 하지만 모두가 OpenAI, Google, Meta 같은 빅테크 기업들처럼 컴퓨팅 자원을 자유롭게 사용할수는 없기에, 현실적으로 제한된 컴퓨팅 자원으로 모델 학습/서빙을 해야합니다.  
  
모델 사이즈가 커질수록 학습/서빙 비용은 늘어날 수 밖에 없는데, MoE는 학습/서빙 비용은 유지하면서도 모델 사이즈를 키울 수 있는 방법입니다!
  
그럼 이제 본격적으로 MoE에 대해 살펴보겠습니다.   

- **Sparse MoE Layers** : 기존 트랜스포머의 feed-forward network (FFN) 레이어를 N개의 `expert`로 나눠서 사용하는 개념입니다. 이 `expert`는 FFN이지만, 특정 **토큰**들을 담당한다고 생각하면 됩니다.

- **Gate Network (Router)** : 각 토큰이 어떤 `expert`에 소속되는지를 결정하는 network. 
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/72ea18a1-d0b9-4d06-ace7-78c013658136" height=400>
  
[Switch Transformer](https://arxiv.org/abs/2101.03961)에 아주 좋은 예씨 Figure가 있어서 가져왔습니다. 위 그림처럼 Transformer Block은 Attention -> Add + Norm -> FFN -> Add + Norm과 같은 형태로 이루어져 있습니다. (순서는 아키텍처마다 다를 수 있습니다만 여기서는 넘어가겠습니다.) 여기서 MoE는 **FFN**에 해당하는 layer를 기존과 다르게 사용하는데요, 그림에서처럼 "More"라는 토큰 하나가 들어왔을 때, 이 토큰을 Gate Network (Router)를 거쳐서 N번째 `expert`에 할당되면, 해당 토큰은 다른 `experts`은 제외한 할당된 `expert`에 해당하는 FFN을 통과하게 됩니다. (밑에서 살펴보겠지만, 위 예시에서는 1개의 `expert`만을 할당받았지만, 실제로는 2개 이상의 `expert`도 보낼 수 있습니다. 😎)
  
### Sparsity
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/d207e623-2e89-4791-a7b3-55d6da7c2bfa" height=200>

여기서 **Sparsity**에 대해 보고 넘어가겠습니다. 일반적인 트랜스포머 모델은 dense한 모델입니다. (모든 입력에 대해 모든 입력이 사용되는 모델) 반면에 Sparsity한 모델이란, 모델 파라미터의 일부만 사용할 수 있는 모델을 의미합니다. 즉, 이 MoE 아키텍처는 Sparsity하다고 할 수 있겠죠!
  
### 1개가 아닌 K개의 Expert에게 보내려면 어떻게 해야할까?
  
위에서 `Expert`를 2개 이상에 보낼수도 있다고 했습니다. Mixtral도 1개가 아닌 2개의 `Expert`에 보내는 방식으로 학습되었는데요, 어떻게 동작하는지 살펴보겠습니다.  
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/e6c0e658-f46f-4b40-859c-2c9c13ca731a" height=200>

총 8개의 `Expert`가 있고, 여기서 1개의 `Expert`로 보내는 문제를 먼저 보겠습니다. 굉장히 간단한 **Classification** 문제죠. PyTorch 코드로 구현한다면 아래와 같겠네요.
  
```python
import torch.nn as nn

# inputs는 dim 차원을 가진 tensor
dim, num_experts = 512, 8
gate = nn.Linear(dim, num_experts)
nth_expert = F.softmax(gate(inputs), dim=-1).argmax()
```
  
이렇게 위와 같이 Linear layer + Softmax 조합으로 간단하게 `Expert`를 특정할 수 있고, 해당 토큰은 특정된 `Expert`로 포워딩해주면 됩니다.
  
그렇다면, 만약에 1개 이상의 K개의 `Expert`에게 gating을 해주고 싶다면 어떻게 해야할까요? 🤔
  
여러 방법이 있겠지만, Mixtral에서 사용한 Top-k Gating 방식을 소개드리겠습니다. gate network의 linear layer를 H(x)라고 하고, K개의 `Expert`에게 보내고 싶다면, 아래와 같은 수식으로 표현할 수 있습니다.
  
<img height="100" alt="image" src="https://github.com/sooftware/sooftware.io/assets/42150335/68702730-e153-4a7d-b39f-5eb7c6606f01">
  
(이해를 위해 K=2를 예시로 들겠습니다.) Linear layer의 결과로 나온 logits에 top 2개의 logits을 뽑고 이 2개의 logits에 대해서 Softmax 함수를 적용합니다. 그럼 이 2개의 expert에 대한 weight 값이 나오게 됩니다!   
  
A라는 Expert에게 0.7, B라는 Expert에게 0.3과 같은 식으로 말이죠. 이렇게 나온 weight를 A와 B Expert를 거쳐서 나온 결과값에 곱해서 사용하게 됩니다. 
  
아래는 실제 Mixtral에 사용된 MoE Layer의 구현 코드입니다. 해당 코드에 제가 위에 설명한 내용들에 대해 주석으로 달아놨으니 참고하면서 하나하나 이해해보시는걸 추천드립니다!
    
(참고) MoE 구현체는 [이곳](https://github.com/mistralai/mistral-src/blob/main/mistral/moe.py)에서 확인 가능합니다. 그리 길지 않아서 코드를 바로 가져왔습니다.
  
### MoE Implementation (by Mistral)

```python
import dataclasses
from typing import List

import torch
import torch.nn.functional as F
from simple_parsing.helpers import Serializable
from torch import nn


@dataclasses.dataclass
class MoeArgs(Serializable):
    num_experts: int
    num_experts_per_tok: int


class MoeLayer(nn.Module):
    def __init__(self, experts: List[nn.Module], gate: nn.Module, moe_args: MoeArgs):
        super().__init__()
        assert len(experts) > 0
        self.experts = nn.ModuleList(experts)
        self.gate = gate
        self.args = moe_args

    def forward(self, inputs: torch.Tensor):
        # Step 1 : Expert로 보내기 위한 gate linear layer 통과
        gate_logits = self.gate(inputs)
        # Step 2 : gate logits에 대해 Top-K개 Expert 뽑기
        weights, selected_experts = torch.topk(gate_logits, self.args.num_experts_per_tok)
        # Step 3 : Top-K개의 experts에 대한 weights 구하기 (by softmax)
        weights = F.softmax(weights, dim=1, dtype=torch.float).to(inputs.dtype)
        results = torch.zeros_like(inputs)

        # N개의 experts 돌면서 순회
        for i, expert in enumerate(self.experts):
            # Step 4 : i_th expert에 해당하는 tokens 뽑기
            batch_idx, nth_expert = torch.where(selected_experts == i)
            # Step 5 : i_th expert에 해당하는 token들 i_th expert에 통과
            # Step 6 : 통과된 결과값에 expert weight 반영
            results[batch_idx] += weights[batch_idx, nth_expert, None] * expert(
                inputs[batch_idx]
            )
        return results
```
  
게이트가 여러 `Expert`에게 라우팅하는 방법을 학습하게 하기 위해서 이렇게 2개 이상의 `Expert`에게 보내도록 학습을 시켰다고 합니다.  
  

이번 포스팅은 여기서 마치고, 보다 자세한 내용은 'What is MoE? (Mixture of Experts) - 2' 포스팅에서 다루도록 하겠습니다!
  
  
## Reference

- https://mistral.ai/news/mixtral-of-experts/
- https://huggingface.co/blog/moe
- https://github.com/mistralai/mistral-src
