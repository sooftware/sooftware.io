---
title: 'LLaMA2'
author: [Soohwan Kim]
tags: [toolkit, environment]
image: img/llama2.png
date: '2023-07-21T10:00:00.000Z'
draft: false
---

# LLaMA2
  
Meta(전 Facebook)가 이번 7월 18일에 LLaMA2를 공개했습니다. 🎉   
LLaMA2 관련 내용이 담긴 [논문](https://arxiv.org/abs/2307.09288) 과 함께 7B, 13B, 70B 모델을 공개했습니다.  
  
이전 LLaMA와 다르게 LLaMA2는 상업적 이용이 가능합니다!  
한국어 성능이 좋았다면 정말 좋은 소식이겠지만, 아쉽게도 학습에 사용된 한국어는 겨우 0.06% 밖에 되지 않아서, 한국어 성능이 
크게 좋지는 않은 것 같습니다. (영어가 약 90%로 대다수를 차지했습니다.)
  
기존 LLaMA보다 40% 가량 더 많은 데이터로 학습했다고 합니다.    
약 80페이지에 이르는 논문인지라 다 살펴보지는 못했지만, 크게 아래의 내용들을 논문에서 다루고 있습니다.  
  
- Pretraining
- Fine-tuning
- Safety
  
개인적으로 잘 학습된 사전학습을 어떻게 하면 더 좋게 사용할 수 있을까를 고민하는 사람으로써, Chapter 3에 해당하는 
Fine-tuning 기법 위주로 살펴봤습니다.  
  
- Supervised Fine-Tuning (SFT)
- Reinforcement Learning with Human Feedback (RLHF)
- System Message for Multi-Turn Consistency
  
Fine-tuning 챕터는 위의 3 주제를 다루고 있습니다.  
  
### Supervised Fine-Tuning (SFT)
  
SFT 쪽에서는 특별한 내용보다는 하이퍼파라미터 공유, **유저 프롬프트쪽은 loss를 0로 주고 response에 해당하는 부분만 
backpropagation을 수행했다는 점** 등의 디테일한 내용을 담고 있습니다.  
  
그냥 pre-training 때와 똑같이 학습하게 된다면, 프롬프트 내의 토큰들을 생성하는 것까지 모두 학습하게 되는데, 
생각해보면 굳이 파인튜닝 단계에서 프롬프트쪽 토큰 생성을 배울 필요는 없습니다.  

실제로 유저들이 사용할때 필요한 LLM의 능력은 어떠한 프롬프트가 주어졌을 때, 그 뒤의 토큰을 적절하게 생성하는 능력이 필요한 것이기 때문이죠.  
  
- Example
  
```
이모지로만 대답하시오.<|SPECIAL_TOKEN|>유저:안녕?<|SPECIAL_TOKEN|>LLaMA2:👋
```
  
위의 예시 데이터에서 '이모지로만 대답하시오.<|SPECIAL_TOKEN|>유저:안녕?<|SPECIAL_TOKEN|>LLaMA2:' 이 부분을 조건으로 줬을 때, 
👋을 생성하는걸 배워야 하는거지, '이모지로만 대답하시오.<|SPECIAL_TOKEN|>유저:안녕?<|SPECIAL_TOKEN|>LLaMA2:👋' 전체를 생성하는걸 배워야 
하는건 아니니깐요.  
  
### RLHF
  
RLHF를 총 5번 진행했다고 하는데, preference data로 reward model을 학습하고, 학습된 모델로 RLHF를 진행하고, 
RLHF 모델로 새로운 데이터를 수집하는 것을 반복하는 과정을 거쳤습니다.  
  
매번 PPO를 진행하지는 않고, 마지막 iteration에 대해서만 PPO를 진행했다고 합니다.  
  
이 외에도 내용이 많은데, 이쪽 파트는 꽤나 자세하게 설명되어 있어서, Allignment 관련해서 디테일하게 살펴볼 수 있다는 의미가 있는 것 같습니다.  
  
### System Message for Multi-Turn Consistency
  
여기서 핵심은 멀티턴 상황에서 프롬프트에 대해 일관되게 답변을 하도록 하기 위해 **GAtt**라는 방법을 적용했다는 건데, 
일관성 유지를 위해 프롬프트에 들어가는 (instruction, user utterance, bot utterance) 이것들을 어떻게 조합하는지에 대해 다룬 것 같습니다. 
(아직 이 부분에 대해서 정확하게 이해를 했다고 생각은 되지 않아서 일단 스킵하겠습니다.)  
  
***
  
제가 관심있던 부분은 위 내용 정도여서 일단 이 정도까지만 정리하겠습니다. 😁
  
### Reference

- [LLaMA2 Paper](https://arxiv.org/abs/2307.09288.pdf)
- [LLaMA2 Recipe GitHub](https://github.com/facebookresearch/llama-recipes)

  

  

  