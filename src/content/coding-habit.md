---
title: 'Sooftware Coding - 좋은 코딩 습관'
author: [Soohwan Kim]
tags: [record]
image: img/coding-habit.png
date: '2022-08-17T17:00:00.000Z'
draft: false
---

# Sooftware Coding - 좋은 코딩 습관 (네이)
  
  
깔끔한 코드를 짜기 위한 제가 생각하는 10가지 습관입니다. 저의 개인적인 주관이 포함된 글입니다.
  
### 1. 변수, 클래스명에는 동사를 넣지 않는다
  
```javascript
class: FeatureExtract (X)
class: FeatureExtractor (O)

var: work (X)
var: worker (O)

var: log (X)
var: logger (O)
```
  
변수, 클래스명은 다음과 같이 count, num_workers, image, user ... 등 숫자, ~을 하는 객체, ~한 여부 (bool) 등이기 때문에 
동사보다는 명사가 가장 잘 어울린다고 생각합니다.  
  
### 2.  함수명에는 동사를 넣는다
  
```javascript
function: id() (X)
function: get_id() (O)

function: trainer() (X)
function: train() (O)
```
  
반면, 함수같은 경우는 ~을 하는 행동을 정의하는 것입니다. id를 받아오는 함수라고 하면, id()보다는 
get_id()과 같이 ~하다라는 의미가 담긴 명명이 잘 어울릴 것입니다.  
  
### 3. 변수명에 굳이 관사를 넣지 않는다.  
  
```javascript
var: a_cat (X)
var: cat (O)
```
  
가장 좋은 변수명은 짧으면서도 효과적으로 의도를 전달하는 변수명입니다.   
굳이 관사를 넣음으로 인해 변수명이 길어질 필요가 없습니다.
  
관사를 넣는다고 의도 전달이 더 명확하게 되는것도 아니기 때문에 변수명, 함수명, 클래스명에 대해서 특수한 경우를 제외하고는 
굳이 관사를 넣어줄 필요는 거의 없다고 생각힙니다.  
  
### 4. 변수명에 전치사는 최대한 생략한다.
  
```javascript
var: the_number_of_worker (X)
var: num_workers (O)
```
  
우리나라 사람들이 많이 하는 실수라고 합니다. number_of_worker 등과 같이, 전치사를 많이 넣습니다.
  
우리나라 말로 옮기자면, the_number_of_worker는 "worker의 수"입니다.
  
하지만, 간단하게 의도만 표현하는데 굳이 문법을 맞춰줄 필요는 없습니다. "worker의 수"보다는 간결하게 "worker수"라는 표현인
  
worker_num과 같은 표현이 더 간결하면서도 의도 전달에 부족하지 않을 것입니다. 참고로, 뭔가를 세거나 숫자를 표시하는 변수는 num_somethings 혹은 count_somethings (cnt_somethings) 와 같은 형식을 많이 사용합니다.
  
```javascript
class: Seq2seq
function: sentence_to_id()
var: char2id
```
  
물론 위와 같이 "to"는 함수, 변수 등 여러모로 자주 쓰입니다. to는 짧으면서도 의도를 효과적으로 전달해주는 단어이기 때문입니다.
  
이와 같이 전치사를 최대한 줄이지만, 전치사를 씀으로, 더 깔끔하고, 효과적으로 의도 전달이 된다면 안 쓸 이유는 없습니다.
  
그리고 to 같은 경우는 2(two)와 발음의 유사성 때문에 char_to_id => char2id와 같이 많이 쓰입니다._to_라는 4개의 글자를 2라는 1개의 글자로 대체함으로써 더 짧은 네이밍이 된다는 장점도 있습니다.
  
### 5. 단수와 복수를 구분한다.

- Example:: Python  
```javascript
items = [1,2,3,4,5]

for item in items:
    print(item)
```
  
우리나라 사람들이 많이들 신경쓰지 않는 부분이라고 합니다. 제가 굉장히 중요하게 생각하는 부분인데요,
  
단수와 복수를 구분해놓으면 코드를 읽기가 굉장히 쉬워집니다.
  
단수형이라면 어떤 값 혹은 객체가 하나인 자료형, 복수형이라면 여러 값 혹은 객체가 들어있는 자료형임을 짐작하게 합니다.
  
실제로 다른 사람이 짠 코드를 볼 때, 단수형 복수형이 명확하게 구분된 코드와 구분이 되지 않은 코드를 읽어보면 그 차이를 선명하게 느낄 수 있습니다.  
  
### 6. 사용하는 언어의 암묵적인 Rule을 지킨다.
  
```javascript
CamelCase: Java
snake_cake: c
Hybrid: python
```
  
어떤 언어를 사용하게 되면, 대부분의 프로그래머들이 암묵적으로 지키는 Rule 혹은 언어에서 권장하는 형식 있습니다.
  
프로그램의 실행이나 결과에는 반영되지 않지만, 다른 사람들이 코드를 더 읽기 쉽게 만들어주는 규칙입니다.
  
<img src="https://user-images.githubusercontent.com/42150335/184926983-b7939920-db95-42db-87e1-df50c6bc0e9e.png" width=400>
  
대표적으로 Java의 CamelCase가 있습니다. c언어나 파이썬은 camelCase와 snake_case를 섞어서 쓰곤 합니다.  
  
아래는 c언어에서 가장 많이 쓰이는 컨벤션이라고 합니다.  
  
```
Struct              TitleCase
Struct Members      lower_case or lowerCase

Enum                ETitleCase
Enum Members        ALL_CAPS or lowerCase

Public functions    pfx_TitleCase (pfx = two or three letter module prefix)
Private functions   TitleCase
Trivial variables   i,x,n,f etc...
Local variables     lower_case or lowerCase
Global variables    g_lowerCase or g_lower_case (searchable by g_ prefix)
```
  
- CamelCase Example
```
var: raiseValueError
var: sentenceToId
```

- snake_case Example
```
var: raise_value_error
var: sentence_to_id
```
  
물론 위와 같은 사항들 모두 권장일 뿐, 꼭 지켜야 하는 것은 아닙니다만, 
아무래도 많은 개발자들이 따르는 규칙을 따른다면 여러모로 편리한 점이 있는 것 같습니다.  
  
### 7. 통상적으로 사용되는 변수명/규칙을 사용한다.
  
```
temp, obj, worker, num_somethings, count_somethings, flag, idx, is_condition, info, freq, token ... 
```
  
어떤 사람의 코드를 보더라도 꼭 등장하는 변수명들이 있습니다. 
temp, flag, obj 등등.. 어디서나 많이 보이는 변수명도 있고, 
num_somethings, count_somethings, is_condition과 같이 일정 형식으로 많이 쓰이는 변수명도 있습니다.
  
예를 들어 "워커의 수"라는 것을 변수명으로 만든다면 `num_workers`와 같은 형식을 많이 사용합니다. 
한 프로젝트에 뭔가의 숫자를 담아두는 변수를 위와 같은 형식으로 통일해둔다면 코드 읽기가 많이 수월해집니다.
  
특정 변수명들은 변수명만으로 어떤 역할을 할지를 예측할 수도 있고, 변수명의 형식을 보고 bool 타입일지, int 타입일지를 예측도 가능하게 해줍니다.
  
자주 사용되는 변수명이나 형식 같은 경우는 어떤 분야인지에 따라서도 차이가 나기 때문에, 같은 분야의 여러 코드를 보게 되면 도움이 많이 됩니다. 
예를 들어 인공지능 분야의 경우에는 인공지능을 `model`이라고 많이 표현하기 때문에, 이왕이면 변수명을 `model`로 만들어주면 
코드를 파악 혹은 검색할 때 수월해집니다.
  
요즘은 microsoft, ibm, google 등 세계적인 대기업들도 오픈소스를 공개하기 때문에, 세계적인 대기업들에서는 어떤 식으로 변수명을 구성하는지를 볼 수도 있습니다.
  
### 8. 상수는 모두 대문자로 표시해준다.
  
```javascript
var: layer_size = 6 (X)
var: L = 6 (O)
var: main_width = 1024 (X)
var: MAIN_WIDTH = 1024 (O)
var: main_height = 768 (X)
var: MAIN_HEIGHT = 768 (O)
```
  
값이 변하지 않는 상수라면, 값이 변하지 않는다는 것을 표시해주는 것이 좋습니다. 
제가 사용하는 언어들에서는 모두 위 규칙을 따르는 것 같은데, 혹시 본인이 사용하는 언어가 
다른 규칙을 따른다면, 해당 규칙을 따라주시면 됩니다.
  
### 9. 로직이 끝나면 한 줄 띄어준다. 
  
같은 함수 내에서라도, 분명 여러 로직이 있습니다.
변수를 선언하는 부분, 혹은 계산하는 부분이 있을 것이고,
for, while 문 같이 반복분을 도는 경우도 있을 것입니다.

하나의 함수는 한 화면안에 모두 들어와야 된다라고 하며 모든 코드를 따닥따닥 붙여놓는 분들이 계십니다.
  
분명 한 화면 안에 들어오는 함수가 좋은 함수지만, 이를 위해서 가독성을 포기해야 한다면, 
저는 한 화면이 넘어가더라도 한 줄씩 띄어줌으로써 로직이 분리되는 코드를 지향합니다.
  
### 10. 코드에 규칙이 있어야 한다.
  
위의 9가지 규칙 다 안 지키더라도, 네이밍과 코드에는 꼭 일정한 규칙이 있어야 합니다.  
  
리스트는 뒤에 _list를 붙이다던지, class는 두 번째 글자만 대문자라던지, 
어떤 규칙이던 규칙적이기만 하면 **그나마** 괜찮습니다.  
  
최악은 모든 네이밍이 지멋대로이고, 어떤 규칙도 찾아볼 수 없다면, 그 코드는 아마 
빠른 시일내에 다시 짜야될 가능성이 굉장히 높습니다.
  
***
  
이상으로 제가 생각하는 깔끔한 코드를 짜는 10가지 규칙이였습니다.
생각나는대로 작성해서 빠트린 부분이 있을수도 있습니다.
  
깔끔한 코드를 짜기 위한 가장 좋은 방법은 역시 좋은 코드를 많이 보는 것 같습니다.
  
요즘은 주요 대기업들에서도 오픈소스를 많이 공개하기 때문에, 깃허브를 조금만 뒤져보면 좋은 코드는 너무나 많이 있는 것 같습니다. 
  
위의 내용 모두 개인적인 견해인 점을 참고해주시면 감사하겠습니다.
  