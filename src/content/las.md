---
title: 'Listen, Attend and Spell Paper Review'
author: [Soohwan Kim]
tags: [speech, paper]
image: img/las.png
date: '2019-09-20T10:00:00.000Z'
draft: false
---

# 「Listen, Attend and Spell」 Review  
  
![title](https://user-images.githubusercontent.com/42150335/134006522-b6c82f01-7912-407a-b6d6-dc4537f859d9.png)  
  
https://arxiv.org/abs/1508.01211  (William Chan et al. 2015)  
  #
## **Introduction**  
  
어텐션 기반 Seq2seq 구조를 음성 인식에 적용한 논문이다.  
  
당시에는 CTC (Connectionist temporal classification) 이 음성 인식 분야를 점유하고 있던 시절이였던 터라, End-to-End 방식으로 본 논문 모델과 같은 성능을 낸 것은 굉장히 혁명적인 일이였다고 한다.  
  
![end-to-end](https://user-images.githubusercontent.com/42150335/134006536-a9b4d4eb-c13b-49c5-aef3-955e7e781350.png)  
  
본 논문 이후 Speech 분야는 CTC와 LAS로 나뉜다고 한다.  
  #
## **Model**
  
모델의 전체적인 구조는 Listener (encoder) 와 Speller (decoder) 로 이루어져 있다.  
  
![las_model](https://user-images.githubusercontent.com/42150335/134006548-2e0f34fd-34e5-472f-8c2c-37601c058c00.png)  

### **Listener**

![listener](https://user-images.githubusercontent.com/42150335/134006557-cfb9ef22-c262-420f-a7c8-bbcf4a08bab1.png)
  
데이터의 피쳐를 입력받는 Encoder  
입력 시퀀스 x를 High level feature인 h로 변형하는 역할을 담당한다  
(더 의미있는 시퀀스로 변형한다)  
  
### **Speller**
  
![speller](https://user-images.githubusercontent.com/42150335/134006565-14cebeeb-2fd6-479d-ab67-caad4db6f2fb.png)  
  
리스너가 변형한 High Level feature인 h를 어텐션을 사용하여 문자로 출력한다. (Decoder)  
  #
### **pBLSTM**  
  
![pBLSTM](https://user-images.githubusercontent.com/42150335/134006706-e8c86aa2-f746-420a-875d-5bb655022cb8.png)  
  
![pblstm_math](https://user-images.githubusercontent.com/42150335/134006716-ce9a6994-c191-41d0-92e6-aa61a9fb55e4.png)  

모델의 첫 번째 특징으로는 Pyrimidal Bidirectional LSTM을 사용했다.  
이전 레이어의 2i, 2i+1 번째 시퀀스를 Concatenate하여 다음 레이어의 i번째 RNN 셀의 입력으로 넣는 구조이다.  
  
상대적으로 매우 긴 시퀀스 길이를 가지는 Speech 모델의 단점을 완화 해주는 역할을 한다.  
  
![blstm_pblstm](https://user-images.githubusercontent.com/42150335/134006731-2115be84-5c7d-4627-9548-2711dbacce8d.png)  
  
위의 그림처럼 기존 BLSTM 구조에 반해, 시퀀스의 길이가 상당히 줄어드는 것을 확인할 수 있다.  
  
pBLSTM 레이어 1층 당 시퀀스 길이가 반씩 줄어들게 되는데, 본 논문에서는 이러한 레이어를 3개를 둠으로써, 총 시퀀스 길이를 8 분의 1로 줄였다고 한다.  
  
이러한 시퀀스 길이의 감소는 디코딩 & 어텐션 과정에서 연산량 감소를 가능하게한다.  
  #
### **Exposure Bias Problem**  
  
Seq2seq에서 티쳐 포싱이라는 개념이 있다.  
티쳐 포싱의 개념은 [이글](https://blog.naver.com/sooftware/221790750668)을 참고하기를 바랍니다.  
  
당시에는 티쳐 포싱은 Seq2seq 아키텍쳐에서 디폴트 100%로 사용됐던 것 같다.  
티쳐 포싱은 학습을 빠르게 해준다는 장점이 있지만, Exposure Bias Problem이란게 존재한다.  
  
티쳐 포싱은 학습 시에 레이블을 제공받지만, 실제 추론 시에는 레이블을 제공 받을 수가 없다.  
이러한 차이점이 실제 추론과 학습시의 성능에 차이가 있을 수 있다는 점이다.  
이를 Exposure Bias Problem이라고 한다.  
  
본 논문에서는 이러한 문제점을 완화 및 실험해보기 위하여 티쳐 포싱 비율이 100%인 모델과 90%인 모델 2개를 학습시켰다고 한다.  
  
( 2019년 5월에 나온 「Exposure Bias for Neural Language Generation」논문에서는 이런 노출 편향 문제가 생각만큼 큰 영향을 미치지는 않는다는 연구 결과를 냈다고 한다 )  
  #
### **Decoding**  
  
본 논문에서는 역시 빔서치를 사용했다고 한다. (빔사이즈 = 32)  
빔서치에 대한 설명은 [이글](https://blog.naver.com/sooftware/221809101199)을 참고하길 바랍니다.  
  
본 논문에서 설명하기를, 기존 음성 인식 모델들은 모든 빔이 <eos>를 만나고 나면, 가장 높은 점수를 받은 빔을 선택한 후, Dictionary (사전) 을 통해 언어 교정을 하는 방식을 많이 사용했다고 한다.  
  
하지만, 본 논문에서 실험시에, 이 DIctionary 방식은 별로 필요가 없다고 주장한다.  
  
본 논문의 모델로 실험해본 결과, 어느 정도 학습 후에는 거의 항상 단어 단위에서는 완벽한 단어를 내놓기 때문에, 이러한 교정 과정이 필요가 없다는 것이다.  
  
### **Rescoring**  
  
그래서 본 논문에서는 Dictionary 방식이 아닌 Rescoring 방식을 제안한다.  
  
![rescoring](https://user-images.githubusercontent.com/42150335/134006752-c4fb0449-9da4-4a84-812c-882cc46f7ba3.png)

빔 사이즈 만큼의 후보를 뽑아놓은 후에, 여기에 Language Model을 이용하여 점수를 매긴 뒤, 기존 점수와 LM에서 나온 점수를 적절히 결합하여 새로 점수를 매기는 것이다.  
해서, 최종적으로 가장 높은 점수를 받은 빔을 최종 선택지로 사용하는 것이다.  
  #
## **Experiments**
  
본 논문에서 진행한 실험 환경은 아래와 같다.  
  
![experiment_environ](https://user-images.githubusercontent.com/42150335/134006766-cd720767-2c86-4705-baac-e426b53a6ea3.png)  
  
위의 환경에서 진행한 실험 결과는 아래와 같다.  
  
![result](https://user-images.githubusercontent.com/42150335/134006787-318572b3-268a-428a-a987-7b6fd86d6946.png)  
  
Language Model을 적용하기 전에는 노이즈가 없는 환경에서는 14.1%의 WER (Word Error Rate), 노이즈가 있는 환경에서는 16.5%의 WER을 기록했다.  
  
결과를 보면, 100%의 티쳐 포싱 비율을 가진 모델보다, 90%의 티쳐 포싱 비율을 가진 모델이 더 좋은 결과를 기록한 것을 알 수 있다.  
  
그리고 본 논문에서 제안한 **Beam Search + Language Model**의 퍼포먼스는 매우 훌륭했다.  
  
모든 면에서 약 4%의 성능을 개선한 것을 확인할 수 있다.   
인식률이 85%가 넘어가는 상황에서의 4%는 엄청난 발전이라고 볼 수 있다.  
  
본 논문은 위의 결과를 통해 새로 제안한 Rescoring 방식이 의미 있는 결과를 냈다는 것을 검증했다.  
  
![sota](https://user-images.githubusercontent.com/42150335/134006971-80b75612-9641-4031-827d-f8a831dcc381.png)  
  
또한, 본 논문의 모델은 당시 SOTA (State-Of-The-Art) 모델인 CLDNN-HMM 모델과 비교하여 2.3% WER 정도만의 차이를 기록했다.  
CTC를 사용하지 않고도 이 정도의 성능을 낼 수 있다는 것을 보여준 셈이다.  
  
본 논문에서는 SOTA 모델과 자신들의 모델의 차이를 Convolution filter의 유무에 의해 생겼다고 추정하고 있다.  
  
  
