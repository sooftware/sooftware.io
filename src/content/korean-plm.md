---
title: '한국어 사전학습 모델 (Korean Pre-trained Language Model)'
author: [Soohwan Kim]
tags: [nlp]
image: img/bear.jpeg
date: '2022-07-12T10:00:00.000Z'
draft: false
---

# 한국어 사전학습 모델 (Korean Pre-trained Language Model)
   
2022.07 기준으로 공개된 한국어 사전학습 모델을 기록합니다.  
크게 아래 3개의 모델로 구분했으며, 모델 사이즈는 정확한 파라미터수보다는 일반적으로 알려진 모델의 파라미터 수로 기록했습니다.  
  
- Encoder Model
- Decoder Model
- Sequence-to-Sequence Model
  
  
## Encoder Model

| Model Name     | Size           |  Link           |
| :------------: | :------------: |  :------------: |
|   TUNiB ELECTRA (Ko)   |   Small (10M)   |      [link](https://huggingface.co/tunib/electra-ko-small)   |
|   TUNiB ELECTRA (Ko-En)   |   Small (10M)   |      [link](https://huggingface.co/tunib/electra-ko-en-small)   |
|   KoELECTRA   |   Small (10M)   |      [link](https://huggingface.co/monologg/koelectra-small-v3-discriminator)   |
|  KcELECTRA   |   Small (10M)   |     [link](https://huggingface.co/beomi/kcelectra-v2022-dev)   |
|   Ko-CHAR-ELECTRA  |   Small (10M)   |     [link](https://huggingface.co/monologg/kocharelectra-small-discriminator)   |
|   KE-T5 (Ko-En)   |   Small (60M)   |      [link](https://huggingface.co/KETI-AIR/ke-t5-small)   |
|   KE-T5 (Ko)   |   Small (60M)   |      [link](https://huggingface.co/KETI-AIR/ke-t5-small-ko)   |
|   T5 Kor  |   Small (60M)   |     [link](https://huggingface.co/kykim/t5-kor-small)   |
|   KoBERT   |   Base (110M)   |      [link](https://huggingface.co/skt/kobert-base-v1)   |
|   KorBERT   |   Base (110M)   |     [link](https://aiopen.etri.re.kr/service_dataset.php)   |
|   HanBERT   |   Base (110M)  |     [link](https://github.com/monologg/HanBert-Transformers)   |
| KcBERT    |   Base (110M)   |     [link](https://huggingface.co/beomi/kcbert-base)   |
|   KLUE-Roberta   |   Base (110M)  |     [link](https://huggingface.co/klue/roberta-base)   |
|   KoELECTRA   |   Base (110M)   |     [link](https://huggingface.co/monologg/koelectra-base-v3-discriminator)   |
|   KcELECTRA   |   Base (110M)   |     [link](https://huggingface.co/beomi/KcELECTRA-base)   |
|   TUNiB-ELECTRA (Ko)   |   Base (110M)   |      [link](https://huggingface.co/tunib/electra-ko-base)   |
|   TUNiB-ELECTRA (Ko-En)   |   Base (110M)   |     [link](https://huggingface.co/tunib/electra-ko-en-base)   |
|   Albert Kor   |   Base (110M)   |      [link](https://huggingface.co/kykim/albert-kor-base)   |
|   Bert Kor   |   Base (110M)  |    [link](https://huggingface.co/kykim/bert-kor-base)   |
|   Funnel Kor   |   Base (110M)   |    [link](https://huggingface.co/kykim/funnel-kor-base)   |
|   ELECTRA Kor   |   Base (110M)   |   [link](https://huggingface.co/kykim/electra-kor-base)   |
|   KalBERT   |   Base (110M)   |     [link](https://github.com/MrBananaHuman/KalBert)   |
|   Distill-KoBERT   |   Base (110M)   |     [link](https://huggingface.co/monologg/kocharelectra-base-discriminator)   |
|   Ko-CHAR-BERT   |   Base (110M)   |     [link](https://github.com/MrBananaHuman/KoreanCharacterBert)   |
|   Ko-CHAR-ELECTRA   |   Base (110M)   |     [link](https://huggingface.co/monologg/kocharelectra-base-discriminator)   |
| KcT5     |   Base (220M)   |     [link](https://huggingface.co/beomi/KcT5-dev)   |
| KE-T5 (Ko-En)    |   Base (220M)   |     [link](https://huggingface.co/KETI-AIR/ke-t5-base)   |
| KE-T5 (Ko)    |   Base (220M)   |     [link](https://huggingface.co/KETI-AIR/ke-t5-basko)   |
| KcBERT     |   Large (340M)   |     [link](https://huggingface.co/beomi/kcbert-large)   |
|   KLUE-Roberta   |   Large (340M)  |   [link](https://huggingface.co/klue/roberta-large)   |  
| KE-T5 (Ko-En)    |   Large (770M)   |     [link](https://huggingface.co/KETI-AIR/ke-t5-large)   |
| KE-T5 (Ko)    |   Large (770M)   |     [link](https://huggingface.co/KETI-AIR/ke-t5-large-ko)   |
  
## Decoder Model
  
| Model Name     | Size           |  Link           |
| :------------: | :------------: |  :------------: |
|   LASSL GPT2   |   Small (20M)   |      [link](https://huggingface.co/lassl/gpt2-ko-small)   |
|   LMKor KoGPT2   |   Base (110M)   |      [link](https://huggingface.co/kykim/gpt3-kor-small_based_on_gpt2)   |
|   SKT KoGPT2   |   Base (110M)   |      [link](https://huggingface.co/skt/kogpt2-base-v2)   |
|   SKT KoGPT2   |   Base (110M)   |      [link](https://huggingface.co/skt/kogpt2-base-v2)   |
|   KakaoBrain KoGPT   |   6B   |      [link](https://huggingface.co/kakaobrain/kogpt)   |
