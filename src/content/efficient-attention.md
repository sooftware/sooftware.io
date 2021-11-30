---
title: 'Efficient Attention Paper Review'
author: [Soohwan Kim]
tags: [nlp, paper]
image: img/efficient_attention.png
date: '2021-07-17T10:00:00.000Z'
draft: false
---
  
# Efficient Attention: Attention with Linear Complexities
  
- Shen Zhuoran et al. 

## Abstract
- Dot-product attention은 들어오는 인풋 길이에 따라 memory & computation cost가 quadratically하게 증가함
- 어텐션 매커니즘을 조금 수정해서 memory & computation cost를 상당히 줄이는 방법 제안

## Method
  
<img src="https://www.pragmatic.ml/content/images/2020/06/image-13.png">
  
- 기존 Dot-product로 similarty를 구하는 방식과 다르게, Key와 value를 곱하는 방식 사용
- Dot-product: 
  
<img src="https://user-images.githubusercontent.com/42150335/121996703-0da3ac80-cde4-11eb-9870-e710b6b13c53.png">
  
- Efficient: 
  
<img src="https://user-images.githubusercontent.com/42150335/121996782-2f9d2f00-cde4-11eb-8c73-823f775a42f7.png">


## Experiment
  
<img src="https://user-images.githubusercontent.com/42150335/121996832-4774b300-cde4-11eb-8050-b0f7e00f343d.png">
  
- 기존 attention과 제안된 attention 비교 => 상당히 효율적으로 변한것을 확인 가능
  
<img src="https://user-images.githubusercontent.com/42150335/121997009-90c50280-cde4-11eb-9387-4b4819fcb251.png">
  
- 성능 면에서도 더 좋은 결과가 나왔다는 표
