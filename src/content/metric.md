---
title: 'NLP Metrics'
author: [Soohwan Kim]
tags: [nlp, metric]
image: img/cm.png
date: '2021-10-13T10:00:00.000Z'
draft: false
---

# NLP Metrics

## Confusion Matrix

<img src="https://user-images.githubusercontent.com/59256704/136820363-585e74ec-3332-43da-abc3-7445bbb1f7c3.png" width="500">

Confusion Matrix는 분류 모델을 평가할때 모델이 얼마나 정밀한지, 얼마나 실용적인 분류를 해냈는지, 얼마나 정확한 분류를 해냈는지에 대한 모든 내용을 포함하고 있습니다.

Accuracy, Precision, Recall, F1-Score와 같은 성능 지표를 계산할 수 있습니다.


### Accuracy
가장 간단하게 성능을 측정하는 방법인 Accuracy입니다.

ex) Tunib-Eelctra Downstream tasks result

<img src="https://user-images.githubusercontent.com/59256704/136825941-8a8a5d65-4617-45fe-8337-0d8b8cf7557a.png" width="500">

위와 같이 다양한 task에서 accuracy가 사용됩니다.

Accuracy는 올바르게 예측된 데이터의 수를 전체 데이터의 수로 나눈 값입니다.

<img src="https://user-images.githubusercontent.com/59256704/136826193-11d3a8b7-f5a4-4d9e-8a51-f521de663270.png" width="500">
즉 간단하게 예측값 중 일치한게 몇개인지 확인하는 방법입니다.

#### 사용법
```python
>>> import torch
>>> from torchmetrics.functional import accuracy
>>> target = torch.tensor([0, 1, 2, 3])
>>> preds = torch.tensor([0, 2, 1, 3])
>>> accuracy(preds, target)
tensor(0.5000)
```

### Recall
accuracy는 데이터에 따라 잘못된 통계를 나타낼 수도 있습니다. 극단적인 예를 들자면, 정답의 비율이 False와 True가 9:1일 경우, 모두 False로 예측해버리면 True가 많지 않기 때문에 매우 높은 accuracy를 얻을 수 있습니다.

이럴 때 사용하는 방법이 바로 Recall입니다. 
  
<img src="https://user-images.githubusercontent.com/59256704/136832571-70189d00-2e3d-4ab6-b74f-40b4b3289e60.png" width="500">
  
Recall은 실제로 True인 데이터를 모델이 True라고 예측한 데이터의 수입니다. 즉 True에 대한 예측결과값만 계산하는 것입니다.

#### 사용법
```python
>>> from torchmetrics.functional import recall
>>> preds  = torch.tensor([2, 0, 2, 1])
>>> target = torch.tensor([1, 1, 2, 0])
>>> recall(preds, target, average='macro', num_classes=3)
tensor(0.3333)
>>> recall(preds, target, average='micro')
tensor(0.2500)
```
`macro`: 각 클래스에 대한 메트릭을 개별적으로 계산하고 클래스 전체의 metric 평균화
`micro`: 모든 샘플 및 클래스에 대해 전역적으로 metric 계산

### Precision
역시 Recall도 한계가 있습니다. 정답의 비율이 False와 True가 9:1인 데이터를 다시 예시로 들면 모델이 전부 False로 예측한 것을 반대로 전부 True로 예측했다고 가정해보면 Recall이 1이 되는 것을 확인 할 수 있습니다.

이런 경우 precision을 통해 새로운 지표를 얻을 수 있습니다.

이전에 Recall은 `정답`이 True인 데이터중에서 `모델`이 True로 예측한 데이터의 수라면, Precision은 `모델`이 True라고 예측한 데이터 중 `정답`이 True인 데이터의 수입니다.


<img src="https://user-images.githubusercontent.com/59256704/136833856-f031bca2-0014-42ca-936b-14427a46a294.png" width="500">

`Note: Precision과 recall은 서로 trade-off되는 관계입니다.`

### 사용법
```python
>>> from torchmetrics import Precision
>>> preds  = torch.tensor([2, 0, 2, 1])
>>> target = torch.tensor([1, 1, 2, 0])
>>> precision = Precision(average='macro', num_classes=3)
>>> precision(preds, target)
tensor(0.1667)
>>> precision = Precision(average='micro')
>>> precision(preds, target)
tensor(0.2500)
```

### F1 Score

ex) HyperCLOVA Experimental Results

<img src="https://user-images.githubusercontent.com/59256704/136829590-3f31851b-aa42-4921-89a1-0325f7cf253d.png" width="500">

앞선 설명을 통해 정반대의 성격을 가진 Precision과 Recall을 확인 할 수 있었습니다. 이번엔 정 반대의 성격을 가진 두 지표를 응용한 F1 Score입니다.

F1 Score는 precision과 recall의 조화평균입니다.

<img src="https://user-images.githubusercontent.com/59256704/136835253-77b7beeb-7f3e-4cf0-8db7-40c88b3b0097.png" width="500">

일반적인 평균이 아닌 조화 평균을 계산하였는데, 그 이유는 precision과 recall이 `0`에 가까울수록 F1 score도 동일하게 낮은 값을 갖도록 하기 위함입니다.

#### 사용법
```python
>>> from torchmetrics.functional import f1
>>> target = torch.tensor([0, 1, 2, 0, 1, 2])
>>> preds = torch.tensor([0, 2, 1, 0, 0, 1])
>>> f1(preds, target, num_classes=3)
tensor(0.3333)
```

## EM(Exact Match)
EM은 말그대로 정확하게 전부 일치하는지 측정하는 simple한 metric입니다.

모든 character가 일치하면 `EM=1`, 그 외의 경우는 모두 `EM=0`이 됩니다. EM=1인 sample수에 전체 sample수를 나눠 값을 구할 수 있습니다.

## BLEU Score(Bilingual Evaluation Understudy Score)
BLEU는 기계 번역의 성능이 얼마나 뛰어난가를 측정하기 위해 사용되는 대표적인 방법으로 측정 기준은 n-gram과 precision에 기반합니다.

### n-gram
n-gram은 n개의 연속적인 단어 나열을 의미합니다.

ex) **An adorable little boy is spreading smiles**

```
1-gram(unigrams) : an, adorable, little, boy, is, spreading, smiles
2-gram(bigrams) : an adorable, adorable little, little boy, boy is, is spreading, spreading smiles
3-gram(trigrams) : an adorable little, adorable little boy, little boy is, boy is spreading, is spreading smiles
4-grams : an adorable little boy, adorable little boy is, little boy is spreading, boy is spreading smiles
```

### 1. 단어 개수 카운트로 측정하기(Unigram Precision)

단순하게 일치하는 단어의 개수로 성능을 측정하는 방법입니다.

<br>

ex)
번역기로 번역된 문장: Candidate, 사람이 직접 번역한 문장: Reference

<img src="https://user-images.githubusercontent.com/59256704/136810698-9fcee7a2-33b3-4a18-92a7-c8b0eb5ce40a.png" width="700">

### 2. Modified Unigram Precision
- Modified Unigram Precision은 중복되는 단어는 제거하여 측정하는 방법입니다.

```angular2html
Candidate : the the the the the the the

Reference1 : the cat is on the mat

Reference2 : there is a cat on the mat
```
예시의 candidate는 the만 7개나 나오는 말도 안되는 번역이지만 일반 Unigram Precision방법을 사용하면 1이라는 최고의 성능이 나오게 됩니다.

<img src="https://user-images.githubusercontent.com/59256704/136811641-7380d02f-d983-4c68-87d4-4607c3d00ccf.png" width="500">

따라서 Reference에 등장하는 단어의 max_count를 고려합니다.

<img src="https://user-images.githubusercontent.com/59256704/136812473-3df9dfbb-f8df-474c-b160-3457162c3d24.png" width="700">


### 3. n-gram으로 확장
이번엔 단어의 순서를 고려하기 위해 unigram이 아닌 bigram이상의 n-gram을 고려하는 방법입니다.

```angular2html
Candidate2 : the cat the cat on the mat

Reference1 : the cat is on the mat

Reference2 : there is a cat on the mat
```

<img src="https://user-images.githubusercontent.com/59256704/136819439-404d8c8c-944b-4475-b107-288b01844fb3.png" width="500">


결과적으로 ca2의 바이그램 정밀도는 6분의 4가 됩니다.

이렇게 n-gram을 이용해 성능을 평가하는 방법이 BLEU입니다.

### 사용법
<img src="https://user-images.githubusercontent.com/59256704/136819917-8cced83d-e9a0-4587-9fdc-51638e6bd6ff.png" width="500">

```python
>>> from torchtext.data.metrics import bleu_score
>>> candidate_corpus = [['My', 'full', 'pytorch', 'test'], ['Another', 'Sentence']]
>>> references_corpus = [[['My', 'full', 'pytorch', 'test'], ['Completely', 'Different']], [['No', 'Match']]]
>>> bleu_score(candidate_corpus, references_corpus)
    0.8408964276313782
```

## ROUGE(Recall-Oriented Understudy for Gisting Evaluation)
ROUGE는 텍스트 요약, 기계번역과 같은 task를 평가하기 위해 사용되는 대표적인 Metric입니다.

이전에 설명 드렸던 BLEU가 n-gram precision에 기반한 지표라면, ROUGE는 이름 그대로 n-gram Recall에 기반해 계산됩니다.

### 1. ROUGE-N
ROUGE계산시 n-gram에 따라 다르게 계산하는 것이 ROUGE-N기법입니다.

ex) ROUGE-1: unigram

<img src="https://user-images.githubusercontent.com/59256704/136845207-e98238bc-10f5-4d46-9a7c-c0e8e5ab5dd7.png" width="500">

ex) ROUGE-2: bigram

<img src="https://user-images.githubusercontent.com/59256704/136845309-6376c71a-7450-4757-aa31-2ea20378b7db.png" width="500">

### 2. ROUGE-L
가장 긴 Sequence의 recall을 구하며, Sequence는 이어지지 않아도 됩니다.

<img src="https://user-images.githubusercontent.com/59256704/136845529-e57f3563-a40b-494b-b671-8c631d5e0129.png" width="500">

생성된 문장의 예시와 정답문장이 완전히 일치하지는 않지만, 떨어져 있는 Sequence 형태로 정답문장과 일치하기 때문에 1의 ROUGE-L score를 얻을 수 있습니다. 

### 3. ROUGE-W
ROUGE-W는 ROUGE-L의 방법에서 연속적인 매칭(consecutive matches)에 가중치를 주는 방법입니다.

<img src="https://user-images.githubusercontent.com/59256704/136846008-e31e76bb-ae8c-4275-a254-c59cc292130f.png" width="500">

ROUGE-L의 관점에서는 Y_1과 Y_2의 결과가 같지만,ROUGE-W의 관점에서는 consecutive matches로 이루어진 예시인 Y1이 더 좋은 결과가 됩니다. 

### 4. ROUGE-S
ROUGE-S는 최대 2칸(bigram) 내에 위치하는 단어 쌍의 recall을 계산합니다.

<img src="https://user-images.githubusercontent.com/59256704/136846246-741d10f1-5abe-410b-b5f4-f17a59351b42.png" width="500">

### 5. ROUGE-SU
ROUGE-SU는 ROUGE-S의 확장된 버전입니다.

아래 예시의 경우 어순을 바꿨을 뿐, 같은 의미를 가진 문장임에도 ROUGE-S가 0이 되어버립니다.
```angular2html
정답문장 : 류현진이 공을 던졌다.
생성문장 : 던졌다 공을 류현진이
```

ROUGE-SU는 Unigram을 함께 계산하여 이를 보정해줍니다.
```angular2html
정답문장 : ((류현진,공), (류현진,던졌다), (공,던졌다), 류현진, 공, 던졌다)
생성문장 : ((던졌다,공), (던졌다,류현진), (공,류현진), 류현진, 공, 던졌다)
```

<img src="https://user-images.githubusercontent.com/59256704/136846643-e58feaac-857a-4e58-9ae0-2354f60741f4.png" width="500">


### 사용법
```python
>>> targets = "Is your name John".split()
>>> preds = "My name is John".split()
>>> rouge = ROUGEScore()   
>>> from pprint import pprint
>>> pprint(rouge(preds, targets))  
{'rouge1_fmeasure': 0.25,
 'rouge1_precision': 0.25,
 'rouge1_recall': 0.25,
 'rouge2_fmeasure': 0.0,
 'rouge2_precision': 0.0,
 'rouge2_recall': 0.0,
 'rougeL_fmeasure': 0.25,
 'rougeL_precision': 0.25,
 'rougeL_recall': 0.25,
 'rougeLsum_fmeasure': 0.25,
 'rougeLsum_precision': 0.25,
 'rougeLsum_recall': 0.25}
```

## CER(문자 오류율)
CER계산은 `Levenshtein distance`의 개념을 기반으로 합니다.

### Levenshtein distance
Levenshtein distance는 두 문자열 시퀀스 간의 차이를 측정하는 거리 측정법입니다.

<img src="https://user-images.githubusercontent.com/59256704/136838740-658bf758-51b4-41a6-abda-dfc8698694a0.png" width="500">

Levenshtein distance는 위와 같이 세 가지의 오류를 고려합니다.

ex) `mitten` & `fitting`
```angular2html
m itten → f itten ( m 을 f로 대체)
fitt e n → fitt i n ( e 를 i로 대체 )
fittin → fittin g ( 끝에 g 삽입 )
```
한 문자열을 다른 것으로 변환하려면 최소 3번의 과정의 필요하기 때문에 두 문자열간의 Levenshtein distance는 3입니다.

#### CER(공식)

<img src="https://user-images.githubusercontent.com/59256704/136839223-106671a0-7c42-465d-9ede-68dffad95d4b.png" width="500">

```angular2html
S = substitutions
D = deletions
I = insertions
N = 전체 문자 수
```
즉 Levenshtein distance에 전체 문자 수를 나눈 값이 CER입니다.

### WER(단어 오류율)
WER은 문단, 문장에서 사용되며 CER의 단위를 character가 아닌 워드 단위로 계산한 값입니다.

<img src="https://user-images.githubusercontent.com/59256704/136839771-6b3bdf81-d8d7-4287-b7f5-e038b864df85.png" width="500">

즉 한 문장을 다른 문장으로 변환하는데 필요한 단어의 Levenshtein distance에 전체 단어수를 나눈 값입니다.

#### 사용법
```python
>>> predictions = ["this is the prediction", "there is an other sample"]
>>> references = ["this is the reference", "there is another one"]
>>> wer(predictions=predictions, references=references)
tensor(0.5000)
```

## Pearson correlation coefficient
Pearson correlation coefficient는 두 변수의 선형 상관 관계를 계량화한 것 입니다.

결과값을 -1 ~ 1 사이의 값이며, 서로 비슷할수록 1에 가까워지고, 0일경우 연관x, -1에 가까워 질수록 정반대를 뜻합니다.

Pearson 상관 계수는 이상치의 영향을 많이 받습니다. 따라서 이상치가 존재할 경우 상관 계수의 값이 크게 변경될 수 있으므로 사전에 이상치제거가 필요합니다.

#### 사용법
```python
>>> from torchmetrics.functional import pearson_corrcoef
>>> target = torch.tensor([3, -0.5, 2, 7])
>>> preds = torch.tensor([2.5, 0.0, 2, 8])
>>> pearson_corrcoef(preds, target)
tensor(0.9849)
```

## Spearman's correlation coefficient
Spearman's correlation coefficient는 두 변수의 상관 관계를 계량화한 것 입니다.

Pearson과 동일하게 -1 ~ 1 사이의 값을 가지며, 서로 비슷할수록 1에 가까워지고, 0일경우 연관x, -1에 가까워 질수록 정반대를 뜻합니다.

피어슨 상관 계수와의 큰 차이점은 피어슨 상관 계수는 선형 상관 관계이지만 스피어만 상관계수는 그냥 상관 관계에 대한 값입니다. 따라서 두 변수가 꼭 선형적인 관계를 가질 필요가 없습니다.

#### 사용법
```python
>>> from torchmetrics import SpearmanCorrcoef
>>> target = torch.tensor([3, -0.5, 2, 7])
>>> preds = torch.tensor([2.5, 0.0, 2, 8])
>>> spearman = SpearmanCorrcoef()
>>> spearman(preds, target)
tensor(1.0000)
```


## TASK별 metric정리

```angular2html
MNLI (matched or mismatched): Accuracy
MRPC: Accuracy and F1 score
QNLI: Accuracy
QQP: Accuracy and F1 score
RTE: Accuracy
SST-2: Accuracy
STS-B: Pearson Correlation Coefficient and Spearman's_Rank_Correlation_Coefficient
WNLI: Accuracy
```


### Reference
- https://wikidocs.net/31695
- https://eunsukimme.github.io/ml/2019/10/21/Accuracy-Recall-Precision-F1-score/
- https://torchmetrics.rtfd.io/en/latest/
- https://arxiv.org/pdf/2109.04650.pdf
- https://supkoon.tistory.com/26
- https://github.com/tunib-ai/tunib-electra
- https://qa.fastforwardlabs.com/no%20answer/null%20threshold/bert/distilbert/exact%20match/f1/robust%20predictions/2020/06/09/Evaluating_BERT_on_SQuAD.html#Exact-Match
- https://lunch-box.tistory.com/109
