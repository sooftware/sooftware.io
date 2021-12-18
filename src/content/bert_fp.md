---
title: 'Fine-grained Post-training for Improving Retrieval-based Dialogue Systems Paper Review'
author: [Soohwan Kim]
tags: [nlp, paper]
image: img/bert_fp.png
date: '2021-12-18T10:00:00.000Z'
draft: false
---


# Fine-grained Post-training for Improving Retrieval-based Dialogue Systems Paper Review
  
<img src="https://d3i71xaburhd42.cloudfront.net/9f359007e9af7e49e95b3bba3c8621c6fa2f8cca/4-Figure1-1.png">
  
- Paper: https://aclanthology.org/2021.naacl-main.122/
- Code: https://github.com/hanjanghoon/BERT_FP
  
NAACL 2021에 억셉된 논문이다. 서강대 NLP 연구실, LG AI Research 팀에서 작성했다. Dialogue Retrieval 관련 논문인데, 
방법이 심플하면서도 성능 좋다. (Ubuntu Dialogue 등 몇 데이터셋에서 SOTA를 찍었다)  
  
**Utterance Relevance Classification (URC)** 이 핵심인데, pre-training 된 모델을 가져와서 추가적으로 post-training을 시키는데, 
MLM (Masked Language Modeling) + NSP (Next Sentence Prediction) 중 NSP를 dialogue 태스크에 맞게 조금 변형한다.  
  
[Context + <|sep|> +  Response] 형식의 입력을 주고, 이 Response가 1. Correct Response 2. Random Utterance 3. Random Utterance in the same dialogue 중 
어느 클래스에 속하는지 3개로 분류하는 식으로 학습한다. 이렇게 하면 기존의 Context - Response를 두고 적합한지 (Positive), 
부적합한지 (Negative) 를 판단하는 binary classification 태스크로 문제를 풀 때보다 
주어진 대화 데이터를 더 효과적으 활용한다는 면에서 데이터 오그멘테이션의 효과도 있게 된다. 

이 post-training은 MLM Loss (dynamic masking) + URC Loss로 학습이 되며, 
이후 기존 response selection 태스크로 파인튜닝해서 사용 가능하다.  

