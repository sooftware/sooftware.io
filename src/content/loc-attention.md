---
title: 'Attention-Based Models for Speech Recognition Paper Review'
author: [Soohwan Kim]
tags: [speech, paper]
image: img/loc-attention.png
date: '2020-01-20T10:00:00.000Z'
draft: false
---

# Attention-Based Models for Speech Recognition Paper Review  

![title](https://user-images.githubusercontent.com/42150335/134008551-c7b29862-1cf1-4ffc-98d0-36186a61dd39.png)  
  
http://papers.nips.cc/paper/5847-attention-based-models-for-speech-recognition.pdf

## Introduction  

본 논문에서는 최근 도입된 (당시는 최근이였음) 어텐션 매커니즘이 여러 분야에서 좋은 성능을 보였지만, 음성 인식 분야의 특성을 충분히 반영한 매커니즘은 없었다고 주장한다.  
  
음성 인식은 NMT 등의 task에 비해 상당히 긴 input sequence를 가진다.  
 단어 단위로 수개에서 수십개의 인풋을 가지는 NMT에 비해 음성 인식에서는 20 ~ 40ms로 자른 프레임들이 수백~수천개의 인풋으로 들어가게 된다  
   
 본 논문은 이러한 음성 인식 분야의 특성에 맞게 새로운 어텐션 매커니즘을 제안한다.  
   #
![2paper](https://user-images.githubusercontent.com/42150335/134008561-29ab5819-3617-4fa6-8502-c0c61b2874d1.png)  
  
참고로 본 논문은 2015년 당시 음성 인식 분야에서 "Listen, Attend and Spell" 논문과 함께 Innovation이라고 불릴만큼 큰 파장을 준 논문이였다. 
 기존 CTC 방식이 압도적이였던 당시에, End-to-End 방식의 포문을 열어준 논문이였기 때문이다.  
   #
## General Framework
  
![base_attention](https://user-images.githubusercontent.com/42150335/134008574-b70ac298-d51f-4588-9777-d2362600815f.png)  
  
기본적인 어텐션에 대한 큰 그림이다.  
 (본 논문에서는 α는 alignment, g는 glimpse라고 칭함 )  
   
어떠한 매커니즘을 거쳐서 alignment (α) 를 구하고 나면, alignment와 인코더의 아웃풋들을 곱해서 glimpse를 구한다.  
#
### Attention의 개념

본 논문에서는 나와 있지 않지만 간단하게 개념을 정리하고 가자면, "alignment는 어떤 인코더를 고려해야 할까?"를 수치화해준 벡터이고, glimpse는 수치화 된 alignment와 인코더의 아웃풋들을 각각 곱해서 현재 디코딩에 필요한 인코더의 정보를 압축한 벡터이다. 그리고 glimpse와 디코더의 아웃풋을 고려해서 현재 스텝의 값을 예측한다.  
#
![alignment](https://user-images.githubusercontent.com/42150335/134008583-eff08f57-d0d3-4241-b5cd-39aa3b407a3c.png)  
  
그럼 alignment는 어떻게 구하지?  
란 물음에 답해주는 부분이다.  
  
특정 방식으로 Score를 구한 뒤, 해당 점수를 Softmax 함수에 넣어서 전체 값을 0~1의 값으로, 전체 합을 1로 만들어 준다.  
=> 각 인코더 아웃풋을 얼마씩 참고할지를 수치화하는 것이다.  
  
그럼 Score를 구하는 특정 방식은 무엇이냐?? 
  
![score_func](https://user-images.githubusercontent.com/42150335/134008595-d555ad41-1e2d-4aa3-bf30-54a1d6ce45ed.png)  
  
어텐션 스코어를 구하는 방법은 위와 같이 다양하다. 사실 위는 정말 몇 개만 뽑아온 것이다.  
  
어텐션 매커니즘의 종류는 이 스코어 함수가 무엇이냐에 따라 달라진다.  
  
그리고, 본 논문은 새로운 "스코어 함수"를 제안한 논문인 것이다.  
  #
본 논문에서는 2가지 어텐션 방식에 주목했다.  
  
1. Content-Based Attention  
2. Location-Based Attention  
  
## Content-Based Attention  
  
![content-based](https://user-images.githubusercontent.com/42150335/134008607-25acb65f-6277-4cb1-868a-151c70f3ab18.png)


아마 어텐션을 처음 공부할 때에 대부분 Dot-Product Attention으로 배웠을 것이다.  
  
해당 스텝의 디코더의 출력과 인코더의 모든 출력들을 내적하여 어텐션 스코어를 구하는 방식이다.  
  
Content-Based Attention은 Dot-Product보다 조금 더 복잡한 수식으로 점수를 낸다.  
  
단순한 내적이 아닌, 해당 스텝의 디코더의 출력과 인코더의 모든 출력들에 웨이트를 준다.

그리고 편향 및 Hyperbolic tangent를 걸어주고, 마지막으로 웨이트를 다시 걸어준다.  
  
Dot-Product Attention에 비해서는 진보된 방법이지만, Content-Based 방식의 문제점은 시퀀스에서의 자신의 위치에 상관없이 스코어링을 한다는 점이다.  
이를 "similar speech fragments" 문제라고 한다고 한다.  
  
## Location-Based Attention 
  
![location-based](https://user-images.githubusercontent.com/42150335/134008621-a79409c0-e98e-4d2e-8af9-7728cfdb867a.png)
  
 그럼 이번에는 Location-Based 방식을 살펴보자.  
 이 방식은 alignment 계산시, 해당 스텝 디코어의 출력과, 이전 alignment를 고려해줌으로써, 현재 시퀀스에서 어느 위치인지를 알 수 있게끔 해주는 방식이다.  

하지만 이 방식은 인코더의 아웃풋을 전혀 고려하지 않고, 디코더의 아웃풋만을 가지고 예측하기 때문에 분명한 한계점이 존재한다.  

## Hybrid Attention 
  
![hybrid](https://user-images.githubusercontent.com/42150335/134008627-84e04a75-7ebe-43df-ba03-ba3133215c53.png)  
  
 본 논문은 이러한 2 방식의 어텐션을 적절히 결합한 음성 인식용 어텐션을 제안한다.  
   
( 해당 어텐션을 Hybrid, Location-Aware, Location-Sensitive 등 여러 이름으로 불린다 )  
  
![hybrid-attention](https://user-images.githubusercontent.com/42150335/134008637-9fbf2912-0ad8-4814-85af-ce79d71b9dbe.png)  
  
기존 Content-Based 방식에서 약간의 수식만이 추가됐을 뿐이다.    
   
기존 Content-Based 방식에서 이전 스텝의 alignment를 고려해준다.  
  
이때 이전 alignment에 웨이트를 주기 이전에, Convolution으로 1xC의 형상에서 KxC의 형상으로 늘려준다. (C: Classfication Number)  
  
그리고 해당 행렬에 웨이트를 주어서 Content + location 방식을 완성한다.  
  
## 3 Potential Issue  
  
![Eq6](https://user-images.githubusercontent.com/42150335/134008657-11650c58-d6a0-49e1-b91d-20fae065606c.png)  
  
앞에서 살펴봤던 위의 수식에는 3가지의 이슈가 있다.
  
1. 인풋 시퀀스가 길다면, glimpse에는 노이즈가 섞여있을 가능성이 크다.  
  
만약 인풋 시퀀스가 길다면, 어떤 시점 t에서 멀리 떨어져 있는 t + k라는 시점에서의 음성과는 서로 관련이 없을 것이다. 하지만 Softmax 함수 특성상, 모든 인풋들에 값을 부여한다. 이러한 Softmax의 특성에 의해 많은 관련없는(irrelevant) 인코더의 출력들이 고려될 것이다. 이는 Noise로 작용된다. 
  
2. 시간 복잡도가 크다.  

인풋 시퀀스의 길이가 L이라고 할 때, 디코더는 매 타임 스텝마다 이 L개의 frame을 고려해주어야 한다. 그리고, 디코딩 길이를 T라 할 때, 위의 과정을 T만큼 반복하게 된다.  이는 O(LT) 라는 높은 시간 복잡도를 만들게 된다.  
  
3. Softmax 함수는 Single Vector에만 집중 (focus) 하는 경향이 있다.  
  
이러한 경향은 top-score를 받은 여러 프레임을 고려할 수 없게 한다.  
  
### **Sharpening** & **Windowing**
   
본 논문은 위의 문제를 간단하게 해결하기 위해 "Sharpening"이라는 개념의 제안했다. Softmax 수식을 약간 수정하는 것이다.  
![sharpening](https://user-images.githubusercontent.com/42150335/134008662-bffb507a-d196-4742-ae3f-474e707e042c.png)  
when, β > 1  
  
본 논문에서는 inverse temperature를 걸어준다고 표현했다.  
위의 수식이 왜 1번 문제를 해결해 주는지에 대해서는 아직 이해를 하지 못하였다.  
  
그리고 본 논문은 위의 방식이거나, top-k개의 프레임만을 뽑아서 re-normalization을 해주는 방식으로도 해결 가능하다고 말한다.  
하지만, 위의 2 방식 모두 2번째 시간복잡도의 문제는 해결하지 못했으며, 2번째 방법의 경우는 오히려 시간 복잡도를 더 늘리게 된다.  
  
그리고 Windowing이라는 방법이 나오게 되는데, 이전 alignment의 중간값(median)을 기준으로 윈도우 크기 만큼만 고려해주는 방식이다. 해당 방법은 O(L+T)로 시간 복잡도를 낮춰준다.  
  #
Sharpening은 long-utterance (긴 발화)에서의 퍼포먼스는 개선했지만, 전체적인 퍼포먼스면에서는 좋지 못한 결과로 이어졌다.   
(짧은 발화에서는 퍼포먼스가 별로였다)  
 하지만 해당 실험은 최상위 점수를 받은 프레임들을 선택하여 집계하는 방식이 좋을 것이라는 가정을 하도록 만들었다고 한다.

  
### **Smoothing**
  
그래서 나오게 된 방법이 Smoothing 방법이다.  
![smoothing](https://user-images.githubusercontent.com/42150335/134008674-f43e28a6-18ee-4ea4-aa4a-59e5ca666ef9.png)  
  
위의 식처럼 기존 Softmax 식에 Sigmoid를 추가해준 방식이다.  
Sigmoid로 Top-k frame과 아닌 frame들을 구분해주는 방식이라고 나는 이해했다.  
이러한 방식은 다양성을 가져온다고 본 논문은 말한다.  
  
## Result
  
![result](https://user-images.githubusercontent.com/42150335/134008689-030fae61-b92c-4a5b-8bb9-61b7a29e097b.png)  
   
본 논문에서 진행한 실험의 결과이다.  
기본 모델보다는 Convolution을 적용한 모델이 더 좋은 결과를 내었고,  
Smoothing까지 적용한 모델이 최상의 성적을 내었다.  
