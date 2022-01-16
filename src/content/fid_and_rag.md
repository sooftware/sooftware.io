---
title: 'Generation with Retrieval'
author: [Soohwan Kim]
tags: [nlp, paper]
image: img/fid.png
date: '2022-01-04T23:00:00.000Z'
draft: false
---

# Generation with Retrieval
  
이번에 딥마인드에서 [RETRO(Retrieval-Enhanced Transformer)](https://deepmind.com/research/publications/2021/improving-language-models-by-retrieving-from-trillions-of-tokens) 라는 모델을 내놓았습니다. 문서 retrieval + GPT 기반 모델인데, 
7B 모델임에도 불구하고 25배나 큰 모델과 비견될만한 성능을 보여줬습니다. 요즘 트렌드는 검색 + GPT로 가는 것 같습니다.  
  
언어모델이 아무리 크고 많은 데이터를 봤다고 하더라도 세상의 모든 지식을 담을 수는 없습니다. 
그리고 새롭게 생긴 지식이라면 더더욱 언어모델 입장에서는 알 수가 없습니다. 이런 문제를 검색과 결합해서 
풀어보려는 시도가 많이 있었고, 이번 포스팅에서는 그 기반이 된 개념인 **Fusion-in-Decoder(FID)** 와 **Retrieval-Augmented Generation(RAG)** 
를 다뤄보겠습니다.  
  
## Fusion-in-Decoder (FiD)
  
**Fusion-in-Decoder(FID)** 는 생성 모델 입력에 검색 결과를 넣어서 활용합니다. 
아래 그림과 같이 어떤 쿼리가 들어왔을 때 적절한 N개의 문서를 가져오고 이 결과를 언어모델의 인코더에 넣어줍니다. 
그리고 디코더는 이 결과를 활용해서 적절한 응답을 생성하는 방식입니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/148075563-977db2da-5297-41f1-9f11-cfd54f9ffe4a.png" width="300">  
  
FiD 본 논문에서 검색 모델은 BM25, DPR(Dense Passage Retrieval )을 활용했습니다. 생성 모델로는 위에 설명한 바와 같이 
인코더와 디코더가 필요하기 때문에 T5, Bart와 같은 Seq2seq (Sequence-to-Sequence) 기반의 모델을 사용했습니다. 
  
FiD는 이름은 거창하지만 방식 자체는 어렵지 않습니다. 아래 2개의 개념만 알면 됩니다.
    
1. FiD의 인코더 입력 형식  
  
```
Question:  Where was Alan Turing born? 
Context: Alan Turing was a British computer scientist. Born in Maida Vale, London.
```
  
2. FiD의 디코더 입력 형식
  
<img src="https://user-images.githubusercontent.com/42150335/148076695-0fd48602-36dc-4d95-b579-b3c720a32c7d.png" width="450">
  
위 그림과 같이 N개 문서에 대한 각 인코더 아웃풋 벡터를 이어붙여서(concat) 디코더에 넣고 답변을 생성합니다.  
  
FiD 본 논문에서는 프리트레이닝 된 T5 모델로 Question-Answer pair 데이터로 파인튜닝해서 모델을 만들었습니다. 
검색 모델(BM25, DPR)은 따로 학습하지 않았다고 합니다.
  
## Retrieval Augmented Generation (RAG)
  
<img src="https://user-images.githubusercontent.com/42150335/148077292-38acd9d7-e6b7-46aa-821a-4a918ca0f7d8.png" width="450">
  
**Retrieval-Augmented Generation(RAG)** 역시 생성시에 검색 결과를 활용합니다. 
FiD와의 차이점으로는 검색 모델을 따로 학습하지 않은 FiD와는 달리 RAG는 검색 모델 역시 학습한다는 차이가 있습니다. 
(RAG는 Retriever로 bi-encoder 기반의 DPR, Generator로 BART를 사용했습니다.)
  
RAG는 `RAG-Sequence`와 `RAG-Token`라는 2가지의 변형 알고리즘을 만들었습니다.
둘은 계산을 행하는 단위가 문장 전체냐, 토큰이냐의 차이를 가지고 있습니다.
  
### RAG-Sequence
  
<img src="https://user-images.githubusercontent.com/42150335/148079083-bbe3b655-665f-4e46-b76f-7ae91c2ee3a1.png" width="250">
    
1. Retriever로 쿼리와 관련된 K개의 문서를 찾는다.
2. K개 문서 각각을 프롬프트로 하는 시퀀스를 K개 생성한다.
3. 2에서 구한 K개의 시퀀스의 확률 분포를 모두 합친다.
  
위 그림과 같이 관련 있는 문서 K개에 대하여 시퀀스 길이 N까지 예측한 확률 분포 시퀀스를 모두 더한 뒤, 
각 위치에서 가장 높은 확률을 갖는 토큰들을 뽑아내면 됩니다. 
여러개의 생성 모델로 예측한 뒤 합쳐서 토큰을 뽑아내는 앙상블 방식과 유사하다는 생각이 듭니다.  
  
### RAG-Token
  
<img src="https://user-images.githubusercontent.com/42150335/148079562-daff56f3-1fbe-4e33-a66a-6fa649ddade5.png" width="250">
  
1. Retriever로 쿼리와 관련된 K개의 문서를 찾는다.
2. 다음 토큰을 생성할 때 K개 문서 각각에 대해서 구한다.
3. 2에서 구한 확률 분포를 합쳐서 다음 토큰을 결정한다.
4. 이를 시퀀스 길이 N만큼 반복한다.
  
방식 자체는 RAG-Sequence와 크게 다르지 않습니다. 
단지 확률 분포를 언제 합치느냐만 다릅니다. 
다음 토큰을 예측할 때 Acoustic 모델과 Language 모델 2개의 확률분포를 합쳐서 결정하는 
음성인식 시스템과 유사한 방식이라는 생각이 듭니다.  
  
주의할 점은 학습 대상은 DPR의 쿼리인코더와 Generator인 BART이며, DPR의 문서 인코더는 고정해 두었습니다. (bi-encoder 구조 참고!)  
  
그리고 "Retrieval Augmentation Reduces Hallucination in Conversation" 논문에 따르면 RAG로 학습한 검색 모델을 
FiD의 검색 모델로 사용시 FiD의 성능을 높일 수 있다고 합니다 :)
  
## Reference
  
- [ratsgo님 블로그](https://ratsgo.github.io/insight-notes/docs/qa/answerer)
- [Leveraging Passage Retrieval with Generative Models for Open Domain Question Answering](https://arxiv.org/pdf/2007.01282.pdf)  
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/pdf/2005.11401.pdf)
- [Retrieval Augmentation Reduces Hallucination in Conversation](https://arxiv.org/pdf/2104.07567.pdf)
