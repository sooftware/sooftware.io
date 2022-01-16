---
title: 'GPT (Generative Pre-trained Transformer)'
author: [Soohwan Kim]
tags: [nlp, parallelism, large-scale, lm]
image: img/gpt.png
date: '2021-11-23T11:00:00.000Z'
draft: false
---

# GPT (Generative Pre-trained Transformer)

![1](https://user-images.githubusercontent.com/54731898/137573333-0e67caea-e8cb-4886-9ed0-46fa610d91d0.PNG)  

gpt1 먼저 알아보고, gpt2에 대해 알아보겠습니다.

***
# GPT1

[Improving Language Understanding by Generative Pre-Training](https://s3-us-west-2.amazonaws.com/openai-assets/research-covers/language-unsupervised/language_understanding_paper.pdf)
## Abstract
- 다양한 라벨링 되지 않은 데이터로 unsupervised pre-training하고, 라벨링 되어있는 데이터로 특정 task에 supervised fine-tuning 하는 self-supervised 학습을 한다.
- 각 task마다 input 형태를 조금씩만 다르게하면 좋은 성능을 보일 수 있는 범용적인 representation을 학습한다.



<br>

## Introduction
- 기존 NLP모델들은 labeled된 데이터를 바탕으로 지도학습을 했다. 하지만 존재하는 데이터는 unlabeled data가 훨씬 많기 때문에, unlabeled data의 정보를 활용한다면 효과적으로 학습할 수 있었다.  
- But, 어떤 objective function이 유용한 text representation을 배우는데 효과적인지 알 수 없었다.
그리고 이전까지는 각각의 task마다 모델을 학습시켰기 때문에 범용적으로 학습된 모델을 다른 NLP task에 어떻게 사용할 것인지 명확한 방법이 존재하지 않았다.  
  
  
이러한 한계점들을 보완하고자 unsupervised pre-training과 supervised fine-tuning을 한 semi-supervised를 사용하였다.  


<br>

## Framework

모델의 학습은 다음과 같이 2단계로 나타낼 수 있다.
1. 라벨링되지 않은 대량 데이터를 이용하여 범용적인 언어모델을 학습
2. 라벨링 데이터를 이용하여 특정 task에 맞춰 모델을 fine-tuning


<br>


### Unsupervised pre-training
라벨링되지 않은 데이터 u가 주어졌을 때, 다음과 같은 likelihood를 최대화 하기위해 language modeling objective funtion을 사용한다.
![image](https://user-images.githubusercontent.com/54731898/137592007-c617d2a3-cdf1-4e1a-a73b-dd027f8f03d5.png)  
k는 context window이고, Θ는 parameter이다.  
  
![image](https://user-images.githubusercontent.com/54731898/137592144-d0adde20-0da4-487c-9217-bd0a7537903b.png)  

language modeling objective funtion을 쉽게 표현하면 다음과 같다. 맞출 단어의 이전 단어들을 보고 해당 단어를 맞추는 것이다. 예를 들어, 위의 사진에서 정답 문장이 "다음 단어를 떠올리면 됩니다." 일 때, 사진에서 정답(ground truth)은 "리면"이 된다. 그래서 모델은 이전 단어인 "다음 단어를 떠올"을 보고 여러 가지 토큰들 중에서 "리면"이 나올 likelihood를 최대화하는 방향으로 학습을 진행한다.


<br>

![image](https://user-images.githubusercontent.com/54731898/137592439-d1e34ad4-ccd7-4bac-ad8b-e17be3398a3a.png)  

또한 GPT는 Transformer의 변형인 multi-layer Transformer decoder를 사용한다.    

![image](https://user-images.githubusercontent.com/54731898/137593453-cf69c0e3-32bf-4361-ae5e-230fce52b9bc.png)


token embedding 값과 position embedding 값을 더해준다. 그리고 transformer_block을 n번 통과하고 vocab 사이즈만큼 linear 해준 후 softmax를 취해준다.
n은 layer의 수, We는 token embedding 행렬, Wp는 position embedding 행렬이다.


<br>


### Supervised fine-tuning  
![image](https://user-images.githubusercontent.com/54731898/137593397-8aa2714c-091d-41de-a1e9-3c0a83ae378e.png)  

위에서 학습한 언어 모델을 task에 맞춰 fine-tuning 한다. 앞서 학습한 pre-trained 모델을 통과하고 label y값을 예측하기 위해 linear 해준 후 softmax를 취해준다.  

또한 fine-tuning 단계에서 학습을 돕기 위해 언어모델을 보조 objective function으로 포함시켰다고 한다. 첫 번째 이유는 supervised 모델의 일반화(범용성)를 향상시키기 위해서이고, 두 번째 이유는 수렴을 빠르게 해주기 때문이다. 

그래서 아래와 같은 목적함수를 최적화한다.  
![image](https://user-images.githubusercontent.com/54731898/137593826-48ce3aa6-a494-48bb-be1a-a0cc0f4dfb89.png)


<br>


### Task-specific input transformations
![image](https://user-images.githubusercontent.com/54731898/137593951-4927546d-9138-4918-b520-bc3d3684973b.png)  
  
위에서 언급한 것 처럼 task에 맞게 input 형태를 적절하게 변형시켜주어야한다.
  
스폐셜 토큰으로는 문장의 시작을 알리는 start 토큰 `<s>`, 문장의 끝을 알리고 BERT의 CLS 토큰 역할을 하는 extract 토큰 `<e>`, BERT의 SEP 토큰처럼 문장을 이어주는 delimeter 토큰 `$`이 있다.

#### Textual entailment
- 전제 p와 가정 h를 delimeter 토큰`$`로 연결하였다.

#### Similarity
- 두 개의 텍스트의 순서가 없으므로 두 개를 다른 순서로 이어붙여 총 2개를 입력으로 쓴다. (data augmentation)
- 이는, Transformer에 각각의 입력으로 들어간다.


#### Question Answering and Commonsense Reasoning (Multiple Choice)
- document context를 z, question을 q, 가능한 답변을 ak라고 하면, context와 question을 이어붙여 위 사진의 Context 부분을 만들고 delimeter 토큰`$`과 answer을 이어준다.    
  수식으로 표현하면 `[z;q;$;ak]` 이러한 형태이고, 각각 독립적으로 모델에 전달된다.



<br>



## Conclusion
당시만해도 pre-training과 fine-tuning이 익숙하지 않았었는데, unsupervised pre-training을 통해 많은 성능 향상이 있었고, 그 모델로 여러가지 nlp task를 푸는데 성공하였다.   

<br>

***
# GPT2

[Language Models are Unsupervised Multitask Learners](https://d4mucfpksywv.cloudfront.net/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
## Abstract
- Only unsupervised pre-training (fine-tuning x)
- Zero-shot으로 downstream task를 진행할 수 있는 General language model을 개발하자.


<br>

## Introduction
여러 NLP task는 특정 task에 맞는 datasets을 가지고 supervised learning을 진행했다. 하지만 저자들은 이러한 모델이 `Narrow Expert` 로서 데이터 분포의 변화 혹은 Task의 변화에 매우 취약하다고 주장한다. Domain과 Task에 특화된 방법이 오히려 모델의 `Generalization` 능력을 저해하기 때문이다.  
또한 Multi-Task learning은 다양한 Domain과 Task를 동시에 수행하며 학습하는 방법으로서, Generalization 성능을 높일 수 있다. 하지만, 이를 위해서는 많은 양질의 학습 데이터를 수집하는 것과 적합한 objective function를 설정하는 것이 필요하다.  
그래서 WebText라고 불리는 수백만 웹 페이지의 데이터로 explicit supervision 없이 language models을 학습하고, Zero-shot downstream task가 가능한 언어 모델 GPT-2를 소개한다.  


<br>

### ❓ `zero-shot`, `few-shot`이 뭐야?
![image](https://user-images.githubusercontent.com/54731898/137766145-e4dd8db8-b74c-4b83-b71d-04f02207296d.png)  
학습에 사용하는 데이터셋을 서포트 데이터, 테스트에 사용하는 데이터셋을 쿼리 데이터라고 한다.   
이러한 퓨샷 러닝 태스크를 `N-way K-shot 문제`라고 부른다. N은 범주의 수, K는 범주별 서포트 데이터의 수를 의미한다.   
위의 사진처럼 2개의 범주(고양이, 자동차), 범주당 5장의 이미지가 주어진 문제를 2-way 5-shot 문제라고 한다. 그러므로 zero-shot은 데이터를 한번도 안보고 테스트 하는 것을 의미한다.  


<br>

## Approach
![image](https://user-images.githubusercontent.com/54731898/137767440-2c38b4c7-f1d4-4a73-9095-14a2d26c71e8.png)  
Language modeling 방법으로 접근하였고, 조건부 확률로 sequential하게 다음 단어를 예측한다. 

### Training Dataset
GPT1에서는 News articles나 Wikipedia 같은 single domain text를 사용했다. 하지만 이번에는 다양한 도메인의 데이터셋을 만들기위해 직접 web crawling을 하여 데이터를 제작하였다.  
Reddit에서 3 karma(페이스북 좋아요 같은 것) 이상을 받은 2017년 12월 전 post만 가져와서 wikipedia와 중복 되는 부분을 삭제하고 40GB text, 총 8 million개의 문서를 생성했다.  

### Input Representation
본 논문에서는 Byte Pair Encoding(BPE) 방식을 채택하였다. BPE는 subword 기반의 인코딩 방법으로, 문자 단위로 단어를 분해하여 vocabulary를 생성하고 반복을 통해 빈도수가 높은 문자 쌍을 지속적으로 vocabulary에 추가하는 방법이다. Byte Pair Encoding(BPE)에 대한 더 자세한 내용은 [링크](https://github.com/sooftware/engineering-is-all-you-need/blob/main/notes/tokenizer.md#bpebyte-pair-encoding)를 참고해주세요!  
유니코드 수준의 BPE는 13만 개 이상의 매우 큰 vocabulary가 필요하다. 하지만 Byte 수준의 BPE는 오직 256개의 vocabulary만을 필요로 한다. 따라서 저자들은 BPE를 유니코드 수준이 아닌, Byte 수준으로 적용하는 시도를 하였다고 한다.

### Model
![image](https://user-images.githubusercontent.com/54731898/137771853-dd00cc8a-a3d3-4984-8dc2-46dc8803e061.png)  
![image](https://user-images.githubusercontent.com/54731898/137771879-4f171263-5705-48d6-886c-005c0d9ae47c.png)  
모델 구조는 GPT-1의 구조와 거의 동일하다. 차이점은 다음과 같다.
- normalization 레이어를 각 하위 블록의 입력으로 이동.
- residual layer의 깊이 N에 따라 1/√N * weights를 사용하여 residual layer의 가중치를 설정.
- vocabulary의 크기가 50,257개로 증가.
- 한번에 입력가능한 context size가 512에서 1024로 증가.

![image](https://user-images.githubusercontent.com/54731898/137774457-a1dd9717-7693-4d4d-8861-646b239262c1.png)  
4가지의 모델 사이즈가 있고, base가 BERT의 라지사이즈와 동일하다.


<br>

## Experiments
![image](https://user-images.githubusercontent.com/54731898/137773933-47a1b4db-79bc-437a-8df7-0b7e1b0ca705.png)  
Fine-tuning을 진행하지 않은 zero-shot 환경임에도 불구하고 8개의 데이터셋중 7개에서 SOTA를 달성하였다.   

### Question Answering  
QA task에서 일반적으로 사용하는 '정확히 일치 하는지' 여부(exact match metric)를 지표로 비교하였을 때에는 4.1%의 정확도로 기존의 모델들보다 5.3배 높은 정확도를 보였다.   

아래의 표는 GPT-2가 질문에 대한 답변을 한 결과이다.   
![image](https://user-images.githubusercontent.com/54731898/137775894-da8f8e21-71a3-4aaf-801b-cf3e70bbfaac.png)  

## Generalization vs Memorization
Train set과 Test set의 과도한 중복(Overlap)은 모델의 memorization을 유도하고 generalization 성능을 왜곡하여 나타낼 수 있다.  
이러한 현상은 저자들이 생성한 WebText 데이터셋에서도 나타날 수 있다.  
다음 표는 벤치마크 데이터 Test set과의 overlap 정도를 보여준다. 8-gram으로 겹치는 정도를 데이터 간에 비교해서 측정했다고 한다.  
보통 1~6% overlap되고, 평균적으로 3.2% overlap된다고 한다. 본 논문에서는 de-duplication 기반의 n-gram overlap 사용을 추천하고 있다.  
![image](https://user-images.githubusercontent.com/54731898/137777245-b93090c8-8d03-4bd2-9d7f-a6e57b07f43b.png)  

<br>  

![image](https://user-images.githubusercontent.com/54731898/137776893-d9db9439-7757-4805-ada4-09acff67767a.png)  
또한 모델의 크기가 커질수록 train과 test 모두 perplexity가 떨어지는 것을 확인할 수 있다. 즉 GPT-2조차 WebText 데이터셋에 아직 underfitting 되어 더 개선될 여지가 있음을 보여준다.  

## Discussion
- Unsupervised task learning 영역도 중요.
- Supervision 없이 task를 배우는 pre-training 기술도 가능성이 있다.
- GPT-2로 많은 zero-shot task에 성능을 측정해보았을 때, 몇 개만 baseline보다 좋은 것이지 각 태스크를 fine-tuning한 모델들이 성능이 더 좋다.
- BERT에서 unidirectional representation은 비효율적이라 했는데 GPT-2가 이런 것을 극복하기에 충분한지 아직 불분명하다.


<br>

## Conclusion
GPT-2는 GPT-1 모델을 기반으로 하여 Unsupervised pre-training 작업을 극대화시킨 pretrained language model이다.   
Zero-shot으로 어느정도 유의미한 결과값을 얻었기 때문에 사이즈가 더 큰 모델과 다양한 데이터셋으로 pre-training하면 성능이 더 좋아질 수 있다.  


<br>

## Reference
- https://openai.com/blog/language-unsupervised
- https://d4mucfpksywv.cloudfront.net/better-language-models/language_models_are_unsupervised_multitask_learners.pdf
- https://www.kakaobrain.com/blog/106
