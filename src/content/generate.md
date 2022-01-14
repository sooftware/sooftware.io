---
title: 'Decoding Strategy (디코딩 전략)'
author: [Soohwan Kim]
tags: [nlp]
image: img/decoding.png
date: '2022-01-15T10:00:00.000Z'
draft: false
---

# Decoding Strategy (디코딩 전략)
  
이번 포스팅에서는 자연어처리 모델의 디코딩 전략에 관해서 다뤄보려고 합니다. 디코딩이란 말처럼 디코딩은 디코더에서 
수행하는 작업입니다. 즉, BERT와 같은 인코더 모델에서 사용하는게 아니라 GPT와 같은 디코더 모델 혹은 인코더-디코더를 모두 
가지고 있는 Seq2seq 모델의 디코더에서 수행됩니다. 같은 모델이더라도 이 디코딩 전략을 어떻게 가져가냐에 따라서 
디코딩의 퀄리티와 수행 시간들이 천차만별이므로, 자연어처리를 공부하시는 분들이라면 한 번은 꼭 짚고 넘어가야 하는 개념입니다.  
  
## Greedy Search
  
가장 기본적인 디코딩 전략입니다. 단순하게 매 타임스텝마다 가장 높은 확률을 가지는 토큰을 다음 토큰으로 선택하는 전략입니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/149542712-7c3db121-5bb1-4a26-bfd2-9e32135346ec.png" width="400">
  
Greedy Search는 가장 기본적이면서도 직관적입니다. 시간복잡도 면에서는 훌륭한 방법이지만, 최종 정확도 관점에서는 꽤나 
아쉬운 방법입니다. 특정 시점 t에서 확률 분포 상에서 1등과 2등의 확률 차이가 매우 작더라도 Greedy Search는 1등만 선택할 뿐입니다. 
여기서 문제점은 디코딩이라는 과정은 특정 t 시점에서 끝나는게 아니라, 시퀀스 길이 N만큼의 시점 t가 있다는 점입니다. 
단 한 번이라도 정답 토큰이 아닌 다른 토큰으로 예측하게 되면 뒤의 디코딩에도 영향을 미치기 때문에 정확도 면에서는 많이 아쉬운 전략입니다.  
  
## Beam Search
  
Greedy Search 방법에서 시간복잡도를 조금 포기하고 정확도를 높이기 위해 제안된 방법입니다. 
  
<img src="https://user-images.githubusercontent.com/42150335/149543597-d3d4c079-7938-468b-aae9-ef9774ac4d6c.png" width="400">
  
가장 좋은 디코딩 방법은 가능한 모든 경우의 수를 고려해서 누적 확률이 가장 높은 경우를 선택하는 것이겠지만 이는 시간복잡도 면에서 
사실상 불가능한 방법입니다. 빔서치는 이러한 Greedy Search와 모든 경우의 수를 고려하는 방법의 타협점입니다. 해당 시점에서 
유망하다고 판단되는 빔 K개를 골라서 진행하는 방식입다. Greedy Search가 놓칠 수 있는 시퀀스를 찾을 수 있다는 장점이 있지만, 
시간복잡도 면에서는 더 느리다는 단점도 가지고 있습니다. 또한 빔 개수 K를 몇 으로 설정하냐에 따라서도 결과와 수행시간이 달라지기 때문에 
적절한 K를 찾아야 합니다.  
  
## N-gram Penalty
  
언어모델의 고질적인 문제점 중 하나는 동일한 말을 계속 반복한다는 것입니다. 이러한 현상을 줄여주기 위해 n-gram 패널티를 줄 수 있습니다. 
n-gram 단위의 시퀀스가 두 번 이상 등장할 일이 없도록 확률을 0으로 만드는 전략입니다. 
  
<img src="https://user-images.githubusercontent.com/42150335/149546126-59292e15-cfe9-4ed4-855c-f0a0f54e4fa0.png" width="450">
  
이 전략을 사용하게 되면 동일한 말을 반복하는 현상을 줄일 수 있지만, n-gram으로 설정한 시퀀스가 두 번 이상 등장할 수 없기 때문에 
주의해서 사용해야 합니다.  
  
## Beam search is boring !!
  
최근 연구 결과들에서 빔서치의 단점이 부각되고 있습니다. 기계번역이나 요약 같이 어느 정도 정답이 정해져 있는 태스크에서는 
빔서치가 효과적이지만, dialogue/story generation과 같은 open-ended generation 태스크에서는 적절치 않다는 연구 결과들이 있습니다.  
  
- [Correcting Length Bias in Neural Machine Translation](https://arxiv.org/abs/1808.10006)
- [Breaking the Beam Search Curse: A Study of (Re-)Scoring Methods and Stopping Criteria for Neural Machine Translation](https://arxiv.org/abs/1808.09582)
  
그리고 빔서치의 가장 큰 문제점은 less-surprising 하다는 것입니다. 빔서치는 K개의 빔에서 가장 높은 확률을 가지는 문장을 
선택하게 되는데, 결과를 보게 되면 대체적으로 가장 뻔하게 예측이 되는 문장으로 생성됩니다. 이는 대화/스토리 생성와 같은 
open ended 태스크에서는 치명적인 단점입니다. 예측 가능하고 뻔한 문장이 생성된다는 것은 재미라는 점에서 많은 마이너스 포인트를 가져가게 됩니다. 
아래 그래프가 이러한 경향성에 대해서 아주 잘 보여주고 있습니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/149557583-d636cdf1-5711-4fcb-bb2c-9ae5e844e6b1.png" width="500">
  
그래서 이러한 **지루한** 디코딩을 조금이나마 재밌게 만들기 위해서는 어느 정도의 **랜덤성**이 추가되면 개선이 될 수도 있습니다.
  
## Sampling
  
디코딩 방법에 랜덤성을 추가하는 대표적인 디코딩 전략입니다. 이를 non-deterministic 하다고 표현하는데, 방법은 간단합니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/149557912-9a6d52fb-3829-4606-983d-39d067c42757.png" width="400">
   
위의 그림을 예로 설명하겠습니다. 네모 상자 위에 적힌 숫자는 각 토큰의 해당 시점 t의 확률입니다. 
nice는 0.5, dog은 0.4, car는 0.1 입니다. greedy search라면 바로 nice를 선택하고 이어나가겠지만 sampling은 
이 확률을 그대로 선택될 확률로 사용합니다. 즉, nice라는 토큰이 선택될 확률을 0.5로 줌으로써 다른 토큰들(dog, car)이 
선택될 수 있는 랜덤성을 부여하는 방법입니다.
  
## Top-k Sampling
  
Top-k Sampling은 Sampling 방법을 약간 개조한 전략입니다. 다음 토큰 선택시, 확률이 높은 K개의 토큰들만으로 한정해서 Sampling을 진행하는 방식입니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/149559141-aca96ef5-58a0-4a7b-979d-3972ca234bd9.png" width="500">
  
GPT-2 논문에서 이 전략으로 스토리 생성에서 큰 효과를 봤으나, 이 방법은 모델의 창의성을 저하할 수 있다는 단점을 가지고 있습니다.  
  
## Top-p Sampling (Nucleus Sampling)
  
Top-k Sampling의 문제점을 개선하기 위해 제안된 방법으로, 확률이 높은 K개의 토큰으로부터 샘플링을 하지만, 
**누적 확률이 p 이상이 되는 최소한의 집합**으로부터 샘플링을 하게 하는 전략입니다.
  
<img src="https://user-images.githubusercontent.com/42150335/149561365-545447c8-bed5-4495-ba99-d4e5e85d801a.png" width="500">
  
이론 상으로는 top-p 샘플링이 top-k보다 좋아보이지만, 항상 그렇듯 경우에 따라 더 좋을 때도 아닐때도 있습니다. 
두 전략 모두 꽤 잘 작동하므로 두 전략 모두 사용해보면서 결과를 비교해보는게 가장 좋습니다.  
  

  