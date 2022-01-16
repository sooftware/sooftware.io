---
title: 'Textless NLP'
author: [Soohwan Kim]
tags: [speech, nlp, paper]
image: img/gslm.png
date: '2021-09-19T10:00:00.000Z'
draft: false
---

# Textless NLP: Generating expressive speech from raw audio  
  
- [paper](https://arxiv.org/abs/2102.01192) / [code / pre-train model](https://github.com/pytorch/fairseq/tree/master/examples/textless_nlp/gslm) / [blog](https://ai.facebook.com/blog/textless-nlp-generating-expressive-speech-from-raw-audio)
- Name: Generative Spoken Language Model (GSLM)
  
## Intro
  
- BERT, RoBERTa, GPT-3 등 최근 몇 년간 `텍스트`에 집중된 NLP 모델들이 발전되어 왔음.
- 이건 분명한 한계다. 텍스트에 대한 디펜던시를 깨야한다.
- 언어 == 문자가 아니다. speech가 있다.
- 그래서 우리 GSLM이 텍스트에 대한 디펜던시를 깰 수 있는 가능성을 보였다.
- 음성 프롬프트 시대의 시작을 알린다.
- 음성을 프롬프트로 주면 뒤이어서 인공지능이 말을 계속 이어서 말하는 모델의 등장!
  
## Background
  
- 음성을 입력으로 하는 NLP 어플리케이션들은 ASR => NLP를 거쳐야 했음.
- ASR의 정확도가 100%가 아니기 때문에 분명한 정보의 오류가 존재함.
- 우리는 여기서 ASR + NLP 구조가 아닌 Speech to Speech로 간다.
- Text나 label 없이 only 음성만으로 학습한다.
  
## Textless NLP's benefits
  
- 언어 상관없이 학습이 가능해질 가능성이 높아짐
- 텍스트로 표현이 안되는 말의 뉘앙스, 감정 등의 정보를 반영할 수 있음
- 텍스트 레이블링 혹은 ASR 학습 없이 모델을 학습할 수 있음
- 유아들이 어떻게 언어를 배우고 말을 시작하는지를 알 수 있다(? 과연?)
- 처음으로 텍스트 없이 audio to audio 번역 시스템이 가능해졌다!
  
## Data
  
- 6,000시간의 Libri-Light와 LibriSpeech 데이터셋 (인코더 학습)
- LibriSpeech and LJSpeech (디코더(TTS System) 학습)

## Model
  
<img src="https://user-images.githubusercontent.com/42150335/134018698-f46507a0-c375-4f6f-a67f-63e6ca2a9240.png" width=600>  
  
- Encoder (S2u)
  - Speech를 인풋으로 받아서 discrete unit(pseudo-text라고 부름)으로 인코딩
  - unit은 k-means clustering으로 나눔.
  - 인코더로는 CPC, wav2vec 2.0, HuBERT를 사용 (좋은 acoustic encoder들이라고 보시면 됨)
- uLM
  - unit sequence를 생성   
- Decoder (u2S)
  - TTS System (Tacotron2 사용)
    
- 여기서 unit(pseudo-text)은 letter or phoneme과 매핑되지는 않음. 
- 100 이상의 유닛일 때 좋은 성능을 보였으며 unit은 보통 음소보다 짧은 단위를 인코딩했음.  

<img src="https://scontent-gmp1-1.xx.fbcdn.net/v/t39.2365-6/241223788_398469455180920_2630499539056655858_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=ad8a9d&_nc_ohc=rfiDlgtmTcYAX-EraG5&_nc_ht=scontent-gmp1-1.xx&oh=1c96a38f6af0ada3774380e4fd6110e6&oe=61489C23" width=600>

- 생성한 음성은 pre-trained ASR 모델로 인식해서 성능 측정
- Pre-trained LM으로 텍스트 성능 측정
  
## Result
  
<img src="https://scontent-gmp1-1.xx.fbcdn.net/v/t39.2365-6/241364732_225715579507676_6485051182702467200_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=ad8a9d&_nc_ohc=h45PImsz8SkAX-kM1rz&_nc_ht=scontent-gmp1-1.xx&oh=88949e5b3a057a6e42b8266d03171ac7&oe=61492788" width=600>

- Unit의 수가 모델 성능에 큰 영향을 미침. 
- Unit 수가 커질수록 Acoustic의 성능은 좋아졌음. (PER이 낮아졌다)
- LM 점수도 비슷한 경향이었으나, 너무 많은 unit을 사용하면 오히려 안 좋았음. (NLP에서 vocab의 적당한 사이즈가 좋은 이유와 비슷한 것 같음)
- 어떤 인코더 모델이냐에 따라 다른 결과가 나옴. HuBERT 성능이 가장 좋았음.
- 이렇게 자동으로 측정한 성능이 사람이 평가했을 때와 correlation이 높았음. (좋은 성능 지표)
