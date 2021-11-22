---
title: 'Large Scale LM (1) Background'
author: [Soohwan Kim]
tags: [nlp, parallelism, large-scale, lm]
image: img/big-model1.png
date: '2021-11-22T10:00:00.000Z'
draft: false
---

# Large Scale LM (1) Background

이 자료는 [[해당 link]](https://github.com/tunib-ai/large-scale-lm-tutorials) 를 참고하며 제 언어로 재작성한 글입니다.  
저의 추가적인 메모나 의견이 삽입되거나 삭제된 내용이 있습니다.  
더 퀄리티가 좋은 자료는 위의 링크를 참고하시길 바랍니다.
  
## Motivation
  
2020년에 등장한 GPT-3는 역대 최고의 언어모델로 여겨지고 있습니다. 아키텍처보다도 더 많은 데이터, 더 큰 사이즈의 모델이 
가장 중요하다고 여겨지게 만들어준 장본인이죠. 개인적으로는 지금까지 나온 모델 중에는 AGI(Artificial General Intelligence)에 가장 가까운 
모델이라고 생각합니다. 그래서 저는 더 많은 데이터를 모으고, 이런 데이터를 많이 먹을 수 있는 Large-Scale 모델 학습 관련 기술이 굉장히 
중요하다고 생각합니다.
  
## 모델 아키텍처가 그다지 중요하지 않다?
  
지금까지도 많은 논문이 새로운 모델 아키텍처를 도입하기 위한 연구를 많이 해왔습니다. 하지만 아쉽게도 트랜스포머의 등장 이후로는 
큰 아키텍처의 변화보다는 트랜스포머 모델의 최적화가 더 많은 변화를 가져온 것 같습니다. 그리고 최근 연구 결과에 따르면 
모델 아키텍처 자체는 그렇게 중요하지 않다라는 뉘앙스의 논문도 많이 나오고 있습니다. 그리고 이러한 결과를 뒷받침하듯, GPT-3가 아키텍처는 
GPT-2를 유지하면서 많은 데이터와, 파라미터 수를 늘렸더니 엄청난 성능 향상을 보여줘서 전 세계를 놀라게했죠.
    
<img src="https://github.com/tunib-ai/large-scale-lm-tutorials/raw/ca29ff9f945a59abcc3e3f1000c4d83de97973d4/images/arch_is_not_important.png" width="500">  
  
그래서 결국 지금까지의 연구 결과들을 놓고보자면, 관건은 데이터와 모델의 크기가 가장 중요한 것 같습니다. 
단순히 벤치마크 성능만 올라가는게 아니라 Fine-tuning 없이도 번역, 요약, 분류 등의 태스크를 하는 등 새로운 지표를 열어서 
Prompt-Engineering이라는 용어까지 나오며 새로운 트렌드로 자리잡았습니다.  
  
<img src="https://github.com/tunib-ai/large-scale-lm-tutorials/raw/ca29ff9f945a59abcc3e3f1000c4d83de97973d4/images/scale_is_all_you_need.png" width="500">  
  
위의 그래프에서 볼 수 있듯이, 모델 성능에 가장 중요한건 모델의 사이즈, 다음이 데이터의 크기라는 걸 볼 수 있습니다. 
Y축이 log-scale이라는 것을 생각하면 모델의 크기가 성능에 미치는 영향은 실로 엄청납니다.
  
## 이대로 간다면..?
  
<img src="https://github.com/tunib-ai/large-scale-lm-tutorials/raw/ca29ff9f945a59abcc3e3f1000c4d83de97973d4/images/GPT-X.png" width="500">  
  
이대로 간다면 몇년 뒤에는 GPT-3와도 비교도 안 될 만큼 큰 모델들이 등장하며, 더 마법같은 일을 보여주지 않을까 싶습니다. 
한국에서도 네이버가 빠르게 앞장서서 하이퍼클로바라는 모델을 만들어서 한국어 GPT-3를 만들었고, 카카오브레인도 최근에 GPT-6B 모델을 
오픈소스로 공개하며 앞으로 더 큰 모델을 공개하겠다는 포부를 밝혔죠. Large-Scale LM은 이제는 엄연한 트렌드로 받아들여야 할 것 같습니다.  
  
## 장벽  
  
<img src="https://github.com/tunib-ai/large-scale-lm-tutorials/raw/ca29ff9f945a59abcc3e3f1000c4d83de97973d4/images/hard_core_engineering.png" width="500">  
  
하지만 현실적으로 Large-Scale 모델 학습은 굉장히 어렵습니다. 개념적으로도 Megatron-LM, Zero 등을 이해해야하며 
뒤이어 따라오는 엔지니어링 능력은 실로 많은 능력을 필요로합니다. 빅데이터 처리 기술 역시 마찬가지고요. 그래서 Large-Scale LM 학습을 위해 필요한 많은 지식들을 
공부하며 블로그에 기록해보려고 합니다. 모델 학습부터 시작해서 데이터 처리, 이후 배포 등 많은 엔지니어링 기술을 필요로 할텐데 하나하나 공부하며 기록해보겠습니다.