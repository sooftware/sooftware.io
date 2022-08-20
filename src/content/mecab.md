---
layout: post
title: Sooftware NLP - Mecab 설치 & 사용자 정의 사전 추가
image: img/mecab.png
author: [Soohwan Kim]
date: 2022-08-20T10:00:00.000Z
tags: [nlp, environment]
---
  
# Mecab 설치 & 사용자 정의 사전 추가
  
Mecab은 대표적인 형태소 분석기입니다. 한국어 형태소 분석기로 유명합니다만, 
Mecab은 본래 일본의 Taku Kudo라는 분이 알고리즘은 개발해서 일본어 형태소 분석기로 만들어졌습니다. 
이 알고리즘에 한국어를 적용한 버젼이 여러분이 잘 아시는 Mecab입니다.  
  
근데 이 Mecab이 널리 사용되는데, 설치가 잘 되지 않기로 유명합니다. 특히 윈도우 환경을 쓰시는 
분들중에 Mecab을 사용하시려는 분들이 꽤나 고생하시는 것으로 알고 있습니다.  
  
C++로 된 프로그램을 파이썬에 바인딩해서 사용하다보니, 아무래도 설치가 쉽지는 않습니다.
  
그래서 개인적인 기록겸, Mecab 설치 커맨드와 Mecab에 사용자 정의 사전 추가하는 방법을 포스팅하려 합니다.  
  
## ◾️ Mecab 설치 커맨드 (for Linux)
  
가장 쉽게 Mecab을 설치하는 방법은 아래 커맨드를 이용하는 겁니다.  
  
```
$ pip install -v python-mecab-ko==1.0.9
```
  
[python-mecab-ko](https://github.com/jonghwanhyeon/python-mecab-ko) 는 mecab을 파이썬에 바인딩해놓은 패키지입니다.  
  
이 패키지 덕분에 mecab 설치가 한결 간편해졌는데, 1.0.10 버젼 이후로는 Mac OS 이외에는 
빌드가 되지 않는 [이슈](https://github.com/jonghwanhyeon/python-mecab-ko/issues/5#issuecomment-913127321) 가 있어서 
버젼을 낮춰서 설치하는 것을 권장드립니다.  
  
그냥 `pip install -v python-mecab-ko`로 설치시, `pybind11::init(): factory function returned nullptr`라는 에러가 발생한다고 하네요.  
  
**But**, 버젼을 낮춰서 설치했는데도 `TypeError: pybind11::init(): factory function returned nullptr` 에러가 발생하는 경우가 있습니다.  
  
이런 경우는 아래 커맨드를 실행해주면 해결됩니다. (환경에 따라 아닐수도 있음)

```
$ bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh)
```
  
## 📚 사용자 정의 사전 추가
  
Mecab에 사용자 정의 사전을 추가해야 하는 경우가 있습니다.  
  
```python
>>> import mecab
>>> m = mecab.MeCab()
>>> m.pos('쪽바리')
[('쪽', 'MAG'), ('바리', 'NNG')]
```
  
위와 같이 `쪽바리`를 그냥 mecab으로 분절하게 되면, `[('쪽', 'MAG'), ('바리', 'NNG')]`와 같이 2개로 분절됩니다. 
그런데 내가 `쪽바리`를 `[('쪽바리', 'NNG')]`와 같이 하나로 분절되게 하고 싶다면 어떻게 해야 할까요?  
  
**`쪽바리`를 사용자 정의 사전에 추가하면 됩니다.**  
  
사용자 정의 사전에 추가하기 위해서는 mecab 폴더 위치를 찾아야 하는데, 환경마다 경로가 달라서 
이 위치를 찾는데 애를 먹는 경우가 있습니다. 그래서 이를 좀 더 간단하게 하기 위해 아래 커맨드로 
Mecab을 설치합니다.  
  
```
wget https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz
tar xzvf mecab-0.996-ko-0.9.2.tar.gz
cd mecab-0.996-ko-0.9.2
./configure
make
sudo make install

wget https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz
tar xvfz mecab-ko-dic-2.1.1-20180720.tar.gz
cd mecab-ko-dic-2.1.1-20180720
./configure
make
sudo make install

pip install -v python-mecab-ko==1.0.9
bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh)
```
  
위 커맨드가 정상적으로 실행됐다면 `mecab-0.996-ko-0.9.2` 폴더가 생성되어 있을겁니다.  
  
```
$ cd mecab-0.996-ko-0.9.2/mecab-ko-dic-2.1.1-20180720
```

위 명령어를 통해 폴더를 이동해줍니다.  
  
`ls` 명령어를 쳐보면 많은 파일과 폴더가 보일겁니다. 여기서 사용자 정의 사전 추가를 위해서는 
`user-dic/nnp.csv`를 수정해줘야 한다. 파일을 열어보면 다음 같은 형식으로 되어 있다.  
  
```
대우,,,,NNP,*,F,대우,*,*,*,*,*
구글,,,,NNP,*,T,구글,*,*,*,*,*
```
  
`쪽바리`를 하나로 잘리게 하려면 아래와 같이 추가해주면 된다.  
```
대우,,,,NNP,*,F,대우,*,*,*,*,*
구글,,,,NNP,*,T,구글,*,*,*,*,*
쪽바리,,,0,NNP,*,F,쪽바리,*,*,*,*,*
```
  
대우, 구글처럼 형식은 맞춰주되, 우선순위에 해당하는 4번째 컬럼은 0(최우선순위)으로 바꿔준다.  
  
그리고 나서는 다음 커맨드를 실행해주면 된다.  

```
$ mecab-ko-dic-2.1.1-20180720/tools/add-userdic.sh
$ make install
```
  
잘 설치가 됐다면 아래 파이썬 코드로 테스트해보면 아래와 같이 하나로 잘리는 것을 확인할 수 있다.
  
```python
>>> import mecab
>>> m = mecab.MeCab()
>>> m.pos('쪽바리')
[(('쪽바리', 'NNG')]
```
  
    
## Reference

- [python-mecab-ko](https://github.com/jonghwanhyeon/python-mecab-ko)
- [python-mecab-ko issue #15](https://github.com/jonghwanhyeon/python-mecab-ko/issues/15)
- [kss issue #26](https://github.com/hyunwoongko/kss/issues/26)
  