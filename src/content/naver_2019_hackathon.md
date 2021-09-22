---
title: '네이버 2019 해커톤 - Speech 결선진출'
author: [Soohwan Kim]
tags: [speech, competition]
image: img/2019_hackathon.png
date: '2019-11-21T10:00:00.000Z'
draft: false
---

## 네이버 2019 해커톤 - Speech 결선진출  
  
<img src="https://user-images.githubusercontent.com/42150335/134181220-509b6452-468c-4455-b1fd-d35d7fd56752.png" width="600">
  
네이버  2019 해커톤 - Speech 대회 예선전에서 100 팀 중 11위를 기록하며 예선전을 통과했다 !!  
오늘 아침까지만 해도 10위여서 Top 10 으로 결선을 갈 수 있겠구나 하며 팀원들과 기대하고 있었는데,   
'행복코딩' 팀이 8위로 급상승하면서 11위로 내려와서 Top 10은 들어가지 못해서 꽤나 아쉬웠다 ㅋㅋㅋㅋ  
  
<img src="https://user-images.githubusercontent.com/42150335/134181345-fdb7c896-c19c-46bf-90a4-5fef10228812.png" width="400">
    
실력은 아직 많이 부족해서 우리 팀은 시간 투자를 많이했다.  위의 사진에서 Count란의 숫자를 보게 되면 압도적으로 높은 140이 우리의 모델 Submit 횟수이다.  처음부터 50, 60 점 가까이 맞아가는 다른 팀들을 보면서 아직 멀었구나라는 사실을 다시 한번 느꼈지만, 우리 팀은 4점부터 시작해서 17점 35점 41점 50점 ,52, 56, 58, 59, 61 .....  70점까지 빠득빠득 올라갔다 ㅋㅋㅋ 역시 뭐든지 시간을 때려박으면 되는 것 같다.
  
팀이름 Kai.Lib는 현재 우리가 진행하고 있는 1년간의 졸업과제 프로젝트 팀이름이기도 한데,  
우리가 재학중인 학교이름을 넣어서 Kwangwoon A.I Library 라는 뜻으로 만들었다 ㅋㅋㅋ
나중에 최종적으로 만든 소스코드 및 모델을 오픈소스 라이브러리 형태로 배포하자는 포부에서 만든 팀명이다.  
  
위의 Score는 CRR이라고 하여 Character Recognition Rate . 즉 문자 단위로 점수를 계산하는 방식이다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134181601-38750dae-e398-4195-a5eb-bb4eca5ff078.png" width="400">
  
데이터는 네이버에서 제공한 100시간 한국어 전화망 DB만을 사용하여 학습을 진행했다.  
그리고 음성인식의 모델 학습 같은 경우는 네이버에서 만든 NSML이라는 플랫폼을 이용하여  
우리가 소스코드를 짜서 NSML 프로그램으로 run을 하면, 네이버측에서 gpu와 cpu를 이용해서 학습을 진행해주었다.  
   
<img src="https://user-images.githubusercontent.com/42150335/134181692-c5be8679-3b36-423f-ab7f-ae845945af8e.png" width="500">
  
그래픽 카드는 Tesla p40 으로 초고사양의 그래픽 카드로 학습을 할 수가 있었고, 한 번에 최대 gpu 2개 cpu 8개로 한 모델을 학습시킬 수가 있었다.  대회 초기에는 제한이 많이 안 걸려서 한 번에 모델 6개를 학습시키도 했던 것 같다 ㅎㅎㅎ  
  
그리고 학습시킨 모델을 submit하게 되면 네이버에서 가지고 있는 테스트셋으로 결과를 계산해서 점수를 알려주고 바로 랭킹에 반영하는 방식으로 대회가 진행되었다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134181844-8b9a3242-0aa0-417a-9117-e4e908bd0c69.png" width="400">
  
예선전 같은 경우는 단순 인식률 (CRR) 만을 보고서 진행이 됐지만,  
결선은 이제 모델 사이즈, 인식 속도, 인식률 이 3가지를 종합해서 고려하여 랭킹을 매긴다고 한다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134181862-ca4e34b7-65a7-4231-8c42-c1ec8c5013e3.png" width="400">
  
오프라인 결선 날짜 같은 경우는 네이버측의 사정으로 날짜가 추후 공지된다고 한다.  
결선 진행 장소인 춘천에 있는 '네이버 커넥트원' 이라는 곳을 가보는 것 또한 기대가 된다 ㅎㅎ  
  
<img src="https://user-images.githubusercontent.com/42150335/134182054-d7eea886-30e5-4328-8260-7b40f0510822.png" width="400">
  
우리 팀은 목표를 결선에서 Top 10 안에 드는 것을 목표로 뒀다.  
수상을 하면 좋겠지만 워낙 쟁쟁한 분들이 많기에 목표를 조금 낮췄다 ㅎㅎ..  
앞으로 남은 온라인 결선 및 오프라인 결선에서 더 나은 모델이 나오기를 바란다.  
  
(추가) 네이버 결선 관련 공지
  
<img src="https://user-images.githubusercontent.com/42150335/134182125-db727e23-19fb-471d-9ddd-96ed90625092.png" width="400">  
  
예선 팀들이 기대 이상으로 매우 높은 인식률을 달성해줬다고 한다.
그 중 한 팀이 우리 팀이란 생각에 기분이 좋다 ^.^
  
