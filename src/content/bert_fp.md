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
방법이 심플하면서도 효과가 좋다. (Ubuntu Dialogue 등 몇 데이터셋에서 SOTA를 찍었다)  
  
**Utterance Relevance Classification (URC)** 이 핵심인데, 기존 retrieval 방식의 경우 주어진 *context*와 *response*가 
적합한지 (Positive), 부적합한지 (Negative) 를 binary classification으로 분류한다. 이 방법을 조금 더 스마트하게 바꿨다고 보면 되는데 방식은 다음과 같다.  
  
[Context + <|sep|> +  Response] 형식의 입력을 주고, 이 Response가 1. Correct Response 2. Random Utterance 3. Random Utterance in the same dialogue 중 
어느 클래스에 속하는지 3개로 분류하는 식으로 학습함으로써 주어진 대화 데이터를 더 스마트하게 활용하는 방법이다.  
  

