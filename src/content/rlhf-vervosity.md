---
layout: post
title: RLHF는 수다쟁이를 만든다?! (Does RLHF Breed Verbose Chatterboxes?!)
author:
  - Soohwan Kim
tags:
  - nlp
  - rlhf
image: img/rlhf-verbose.png
date: 2024-03-13T01:11:55.000Z
draft: false
---
# RLHF는 수다쟁이를 만든다?! (Does RLHF Breed Verbose Chatterboxes?!)

RLHF(*Reinforcement Learning from Human Feedback*)는 OpenAI의 ChatGPT를 만드는데 사용됐다고 알려지며 LLM(*Large-scaled Language Model*)의 새로운 연구분야로 자리잡은 기술입니다. RLHF는 이름에서 알 수 있듯이 사람의 피드백을 사용하여 AI 모델을 학습시키는 방법입니다. RLHF가 자리잡기 전까지는 Pre-training → SFT(*Supervised Fine-Tuning*)으로 이루어지는 파이프라인이 정석이였다면, 현재는 Pre-training → SFT → RLHF 파이프라인이 정석으로 자리잡게 되었습니다.
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/99ae9556-430d-4903-a2c1-fba58a14fec5" width=400>

RLHF가 인기를 끌면서, RLAIF(*Reinforcement Learning from AI Feedback*), DPO(*Direct Preference Optimization*) 등의 RLHF 기반하여 나온 파생 학습법들이 등장하게 됐습니다. 저희를 포함한 국내﹒해외 LLM 기업들은 이런 RLHF 류의 학습법을 적용하면서 LLM의 성능을 끌어올리고 있습니다.   

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/8a8b79a5-9b8b-4952-ac19-f2b7c7572276" width=400>
  
RLHF는 LLM이 생성한 답변에 대해서 사람의 피드백(좋다, 나쁘다)을 받아서 학습을 하기 때문에, 학습 이후 생성되는 답변을 보면 "오? 답변이 좋아졌는데?!" 싶을 정도로, 실제 사람이 느낄 정도로 꽤나 큰 효과를 내고 있습니다. 하지만 RLHF의 문제점이 하나 있는데요, 바로 RLHF가 AI 모델을 투 머치 토커(too much talker)로 만든다는 것입니다!  

## RLHF와 답변 길이의 상관관계?  

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/b800288a-282c-4855-bd9b-5d4c34a07828" width=350>

RLHF(or DPO 등) 학습 전후를 비교해본 NLP 연구자분들은 가장 직접적으로 달라진 점을 느끼는 부분이 '응답 길이'일 것입니다. SFT만 한 모델과 RLHF까지 적용한 모델을 비교해보면 눈에 띄게 응답 길이가 길어진 것을 볼 수 있는데요, 아래는 [A Long Way to Go: Investigating Length Correlations in RLHF](https://arxiv.org/abs/2310.03716) 논문에서 같은 질문에 대해 응답 길이를 비교한 예시입니다.
  
<img width="400" alt="image" src="https://github.com/sooftware/sooftware.io/assets/42150335/014b0b84-a42b-46ed-92e7-e3c076f2e372">
  
내용 자체는 비슷하지만, RLHF를 적용한 모델이 약 4배나 더 길게 생성한 것을 볼 수 있습니다.   

<img width="700" alt="image" src="https://github.com/sooftware/sooftware.io/assets/42150335/c77d6eca-095f-4cd6-8223-f0434bbd2327">
  
위 그래프를 나온것처럼 RLHF 적용 전후를 비교했을 때, 응답 길이에 분명한 차이가 있는 것을 볼 수 있습니다.

이 외의 연구들에서도 RLHF가 응답 길이를 길어지게 한다는 연구 결과를 볼 수 있는데요, [Is Stack Overflow Obsolete? An Empirical Study of the Characteristics of ChatGPT Answers to Stack Overflow Questions](https://arxiv.org/abs/2308.02312)에서는 ChatGPT 응답 중 77%가 verbose 하다고 평가했으며, [Iterative Preference Learning from Human Feedback: Bridging Theory and Practice for RLHF under KL-Constraint](https://arxiv.org/abs/2312.11456)에서는 DPO iterate마다 응답 길이가 2.5배씩 길어진다는 연구 결과도 리포트 됐습니다.

## AI가 말을 길게 하면 좋은거 아닌가?  

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/8a3ce021-df65-42ea-ad2d-b29cfc7a1e9f" width=400>

LLM이 응답을 길게길게하면 좋은거 아닐까요? 실제로 RLHF 나오기 이전에는 LLM의 응답이 짧은게 큰 골칫거리였습니다. 😮‍💨 그리고 실제로 사람들은 AI가 길게 답변을 해주면 더 좋은 답변이라고 느끼는 경향이 있다고 합니다! 😲 그런데 이제 RLHF가 나오면서 말이 길어졌다고 하니, 좋은거 아닌가? 하는 분들도 있으실 것 같습니다.  

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/8d1fd586-1f60-4cd6-b705-b49f9a40aff6" width=400>
  
하지만, 뭐든지 그때그때 "알맞게" 답변해주는 것이 가장 이상적입니다. '네', '아니오' 정도의 응답만 필요한데, '네 그것은 어쩌고저쩌고 .......' 와 같이 항상 길게 답변을 해준다면, 읽는 사람 입장에서 피로감을 유발하게 됩니다. 그런 관점에서, LLM의 응답이 전체적으로 길어지는 현상은 마냥 좋다고 볼 수는 없습니다. 또한, 현재 RLHF를 적용한 모델의 경향성을 보면, 응답 길이의 평균 자체가 상당히 높아져서 오히려 짧은 답변을 못한다고 봐야될 정도입니다.  

## 그렇다면 해결방법은?  
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/3a6679b2-b4ec-42bc-84be-13145402182f" width=400>
  
그렇다고 RLHF를 적용 안 할 수도 없는 노릇인데.. 어떻게 해야될까요?   
  
아직 명확한 답은 없지만, 최근 1-2개월 사이의 연구들에서 다양한 방식으로 이 문제를 해결하기 위한 방법들을 내놓고 있습니다. 다양한 방법들이 나오고 있는 만큼 조만간 이 문제에 대해서도 해결되지 않을까 기대해보고 있습니다! 관심 있으신 분들을 위해 관련 논문 2편 추천드리고 이번 포스팅은 여기에서 마무리하도록 하겠습니다! 😎  

1. [Arithmetic Control of LLMs for Diverse User Preferences: Directional Preference Alignment with Multi-Objective Rewards](https://arxiv.org/abs/2402.18571)

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/7108c7d6-d435-4654-9457-81e63d51783f" width=500>

DPA(Directional Preference Alignment)라는 방법을 제시하며 multi-objective reward를 통해 LLM의 응답 길이 및 기타 문제들을 완화하는 방법을 제안

2. [ODIN: Disentangled Reward Mitigates Hacking in RLHF](https://arxiv.org/abs/2402.07319)

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/3b271b64-8b0f-463d-916d-48dea2d7f132" width=500>

ODIN이라는 방식을 제안. 기존 loss에서 length와 quality 관련된 수식을 추가함.

## Reference

- [A Long Way to Go: Investigating Length Correlations in RLHF](https://arxiv.org/abs/2310.03716)
- [Arithmetic Control of LLMs for Diverse User Preferences: Directional Preference Alignment with Multi-Objective Rewards](https://arxiv.org/abs/2402.18571)
- [Is Stack Overflow Obsolete? An Empirical Study of the Characteristics of ChatGPT Answers to Stack Overflow Questions](https://arxiv.org/abs/2308.02312)
- [Iterative Preference Learning from Human Feedback: Bridging Theory and Practice for RLHF under KL-Constraint](https://arxiv.org/abs/2312.11456)
- [ODIN: Disentangled Reward Mitigates Hacking in RLHF](https://arxiv.org/abs/2402.07319)

