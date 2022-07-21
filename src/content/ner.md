---
layout: post
title: Sooftware NLP - 문장의 개체명을 분석해보자! 개체명 인식, Named Entity Recognition (NER)
image: img/ner.png
author: [Soohwan Kim]
date: 2022-07-22T10:00:00.000Z
tags: [nlp]
---
  
# Sooftware NLP - 문장의 개체명을 분석해보자! Named Entity Recognition (NER)
  
NLP 기술을 이용하면 꽤나 정교한 텍스트 분석이 가능합니다. 텍스트 분석에서 빼놓으면 섭섭한 녀석이 
개체명 인식(Named Entity Recognition, 이하 NER)입니다. 예를 들어 이런 분석이 필요하다고 생각해보겠습니다. 
**2021년에 나온 한국 소설에서 가장 많이 등장한 이름**을 찾는다고 해봅시다. (2021년에 출간된 한국 소설 
데이터는 주어졌다고 생각합니다.) 그럼 이 주어진 말뭉치를 어떻게 분석해서 **2021년에 나온 한국 소설에서 가장 많이 등장한 이름**을 
알아낼 수 있을까요? 이럴 때 필요한게 개체명 인식(NER)입니다!  
  
<img width="450" alt="image" src="https://user-images.githubusercontent.com/42150335/180271967-da966f2e-273d-4110-8917-d52610b6ef79.png">
  
> 출처: [TUNiB's Text Analytics Demo](https://demo.tunib.ai/text)
  
---
  
위 이미지와 같이 인명, 나이, 날짜, 서비스 용어, 스포츠 단체 등을 자동으로 분석해주는 기술이 제공된다면, 
위의 문제는 쉽게 해결 가능합니다. 이러한 기술을 NER이라고 부르며, 대표적인 NLP 문제이기도 합니다. 
위에서 예시를 든 문제는 간단한 예시였지만, 대량의 텍스트 분석의 상당 부분을 자동화할 수 있습니다.   
  
## NER 시스템은 어떻게 만드나요?  
  
그렇다면 이 NER 시스템은 어떻게 만들어질까요? 몇몇 entity들은 단순한 룰 기반으로도 잡을 수 있습니다. 
예를 들어 요일, 방향, 개수, 신체 부위 등은 용어를 사전 형식으로 등록하거나, 정규식으로 충분히 잡을 수 있습니다. 
하지만, 이름, 기관명 등은 단순히 룰 기반만으로는 잡기가 어렵습니다. 그렇기 때문에 최근의 NER 시스템은 
인공지능 기반으로 만들어지고 있는 추세입니다.  
  
### 데이터셋 구조
  
인공지능 기반 시스템을 만들기 위해서는 학습 데이터가 필요합니다. NER 시스템을 만들기 위해서는 먼저, 
사전에 Entity들이 정의되어야 합니다. 정의가 되었다면, 아래 그림과 같이 텍스트와 해당 텍스트에서 Entity에 해당하는 부분에 
Entity Number를 매핑시킨 형태의 데이터가 필요합니다.
  
<img width="500" alt="image" src="https://user-images.githubusercontent.com/42150335/180276038-bba8cd83-2a70-4096-bb0c-c144f8e36bcb.png">
  
위 그림에서는 '이름'에 해당하는 Entity의 번호는 10번이므로, '해리 케인', '손흥민'이 있는 부분에는 10번으로 매핑된 것을 
확인할 수 있습니다. 이와 같이 학습 데이터를 모두 위와 같은 형식이 될 수 있도록 만든다면 NER 시스템을 학습할 수 있는 
데이터셋이 됩니다.
  
### 모델링
  
다음으로 모델링을 살펴보겠습니다. 사실 모델링을 자세히 알기위해서는 Transformer, BERT 등의 사전 지식이 필요합니다. 
이 포스팅에서는 해당 부분에 대해서는 스킵하겠습니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/180276814-0d7aa44d-5adb-4e22-a338-f4a992e33bc5.png" width="500">
  
위 그림과 같이 NER 모델의 학습은, 모든 토큰을 입력으로 넣고, 아웃풋 단계에서는 각 토큰이 어느 Entity에 해당하는지를 
각각 분류시키고, 이에 대한 결과를 Cross Entropy Loss로 계산을 해서 모델을 학습하게 됩니다. 한국어로 예를 들자면, 
'해리 케인'을 이루는 ['해', '리', '케', '인'] 각 토큰들에 대해 Label을 10으로 모델에게 알려주는 방식입니다.  
  
## NER 시스템을 사용해보고 싶어요!
  
NER 시스템에 흥미가 좀 생기셨나요? 그렇다면 이 시스템을 좀 사용해보고 싶다, 혹은 직접 이 시스템을 
이용해서 어떤 Product를 만들고 싶으신 분들이 계실 것 같습니다.   
  
- 잘 만들어진 NER 시스템을 좀 사용해보고 싶어요! - [TUNiB's Text Analytics Demo](https://demo.tunib.ai/text)
- NER 시스템을 직접 시스템에 넣어보고 싶어요! - [kakaobrain's Pororo NER](https://kakaobrain.github.io/pororo/tagging/ner.html)
  
NER 시스템을 사용해보고 싶으신 분들은 튜닙의 Text Analytics 데모를 사용해보시면 되시고, 
직접 프로그램에 녹여내고 싶으신 분들은 카카오브레인에서 공개한 Pororo를 사용하시면 쉽게 프로토타입 정도의 
NER 시스템을 프로그램에 반영하실 수 있습니다.
  
```python
from pororo import Pororo

ner = Pororo(task="ner", lang="en")
ner("It was in midfield where Arsenal took control of the game, and that was mainly down to Thomas Partey and Mohamed Elneny.")
[('It', 'O'), ('was', 'O'), ('in', 'O'), ('midfield', 'O'), ('where', 'O'), ('Arsenal', 'ORG'), ('took', 'O'), ('control', 'O'), ('of', 'O'), ('the', 'O'), ('game', 'O'), (',', 'O'), ('and', 'O'), ('that', 'O'), ('was', 'O'), ('mainly', 'O'), ('down', 'O'), ('to', 'O'), ('Thomas Partey', 'PERSON'), ('and', 'O'), ('Mohamed Elneny', 'PERSON'), ('.', 'O')]
ner = Pororo(task="ner", lang="ko")
ner("손흥민은 28세의 183 센티미터, 77 킬로그램이며, 현재 주급은 약 3억 원이다.")
[('손흥민', 'PERSON'), ('은', 'O'), (' ', 'O'), ('28세', 'QUANTITY'), ('의', 'O'), (' ', 'O'), ('183 센티미터', 'QUANTITY'), (',', 'O'), (' ', 'O'), ('77 킬로그램', 'QUANTITY'), ('이며,', 'O'), (' ', 'O'), ('현재', 'O'), (' ', 'O'), ('주급은', 'O'), (' ', 'O'), ('약 3억 원', 'QUANTITY'), ('이다.', 'O')]
# `apply_wsd` : for korean, you can use Word Sense Disambiguation module to get more specific tag
ner("손흥민은 28세의 183 센티미터, 77 킬로그램이며, 현재 주급은 약 3억 원이다.", apply_wsd=True)
[('손흥민', 'PERSON'), ('은', 'O'), (' ', 'O'), ('28세', 'AGE'), ('의', 'O'), (' ', 'O'), ('183 센티미터', 'LENGTH/DISTANCE'), (',', 'O'), (' ', 'O'), ('77 킬로그램', 'WEIGHT'), ('이며,', 'O'), (' ', 'O'), ('현재', 'O'), (' ', 'O'), ('주급은', 'O'), (' ', 'O'), ('약 3억 원', 'MONEY'), ('이다.', 'O')]
ner = Pororo(task="ner", lang="zh")
ner("毛泽东（1893年12月26日－1976年9月9日），字润之，湖南湘潭人。中华民国大陆时期、中国共产党和中华人民共和国的重要政治家、经济家、军事家、战略家、外交家和诗人。")
[('毛泽东', 'PERSON'), ('（', 'O'), ('1893年12月26日－1976年9月9日', 'DATE'), ('）', 'O'), ('，', 'O'), ('字润之', 'O'), ('，', 'O'), ('湖南', 'GPE'), ('湘潭', 'GPE'), ('人', 'O'), ('。', 'O'), ('中华民国大陆时期', 'GPE'), ('、', 'O'), ('中国共产党', 'ORG'), ('和', 'O'), ('中华人民共和国', 'GPE'), ('的', 'O'), ('重', 'O'), ('要', 'O'), ('政', 'O'), ('治', 'O'), ('家', 'O'), ('、', 'O'), ('经', 'O'), ('济', 'O'), ('家', 'O'), ('、', 'O'), ('军', 'O'), ('事', 'O'), ('家', 'O'), ('、', 'O'), ('战', 'O'), ('略', 'O'), ('家', 'O'), ('、', 'O'), ('外', 'O'), ('交', 'O'), ('家', 'O'), ('和', 'O'), ('诗', 'O'), ('人', 'O'), ('。', 'O')]
ner = Pororo(task="ner", lang="ja")
ner("豊臣 秀吉、または羽柴 秀吉は、戦国時代から安土桃山時代にかけての武将、大名。天下人、武家関白、太閤。三英傑の一人。")
[('豊臣秀吉', 'PERSON'), ('、', 'O'), ('または', 'O'), ('羽柴秀吉', 'PERSON'), ('は', 'O'), ('、', 'O'), ('戦国時代', 'DATE'), ('から', 'O'), ('安土桃山時代', 'DATE'), ('にかけて', 'O'), ('の', 'O'), ('武将', 'O'), ('、', 'O'), ('大名', 'O'), ('。', 'O'), ('天下', 'O'), ('人', 'O'), ('、', 'O'), ('武家', 'O'), ('関白', 'O'), ('、太閤', 'O'), ('。', 'O'), ('三', 'O'), ('英', 'O'), ('傑', 'O'), ('の', 'O'), ('一', 'O'), ('人', 'O'), ('。', 'O')]
```
  

  