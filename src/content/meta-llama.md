---
title: Meta는 왜 LLaMA를 공개할까?
author:
  - Soohwan Kim
tags:
  - news
image: img/meta-llama.jpeg
date: 2024-01-20T10:00:00.000Z
draft: false
---

# Meta는 왜 LLaMA를 공개할까?
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/6dfc9147-fa1e-4dc2-b9ef-2609d23b4dbf" width=500>
    
Meta(구 Facebook)은 FAANG(Facebook, Apple, Amazon, Netflix, Google)라는 용어가 있을 정도로 거대 IT 기업들중 대표적인 기업 중 하나입니다. Meta는 지금 LLM 시대가 열리기 전, [RoBERTa](https://arxiv.org/abs/1907.11692), [Wav2vec 2.0](https://arxiv.org/abs/2006.11477), [Blenderbot](https://arxiv.org/abs/2208.03188) 등 A.I.쪽에 큰 영향력을 끼친 연구들을 공개하며, OpenAI, Google과 함께 대표적인 A.I. 선진 기업이였습니다.   
  
또한, 현재는 많이 쓰이진 않지만, [Fairseq](https://github.com/facebookresearch/fairseq)이라는 오픈소스 툴킷으로 자신들의 연구에 쓰인 코드들을 모두 공개하며, 많은 리서쳐 / 엔지니어들이 본인들의 연구를 활용할 수 있도록 큰 도움을 줬습니다. 이 툴킷은 굉장히 잘 작성된 높은 수준의 코드로, 현재 자연어처리에서 가장 영향력이 높은 오픈소스 기업인 Huggingface에서도 내부 코드를 살펴보면 Fairseq의 코드를 가져다가 쓴 것을 종종 볼 수 있으며, 논문의 Official 코드여서 실제로 모델이 어떻게 작동하는지, 어떻게 학습됐는지를 살펴볼 수 있는 좋은 학습 자료였습니다.

## LLaMA

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/9da0cc81-19c7-4d6f-a58f-67f2bf1e5b0a" width=600>

[LLaMA](https://ai.meta.com/llama/)는 Meta에서 공개한 LLM 모델입니다. 현재 가장 유명하고 좋은 성능을 가진 OpenAI의 ChatGPT나 GPT-4와 다르게, LLaMA-2는 모델 weight를 공개했으며, 상업적으로도 사용이 가능합니다. MAU 7억명 이상인 경우, Meta 측과 협의를 해야하지만, MAU 7억명이 쓸 정도의 서비스가 얼마나 있을까요? 😅 (그 정도 규모의 서비스라면 모델 자체 개발도 가능하지 않을까..)

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/fac535ca-8522-4549-92cb-d5acedd8991e" width=700>

Meta는 LLaMA-1에 이어 2023년 7월 LLaMA-2를 공개했습니다. 모델 사이즈는 7B, 13B, 70B로 상당히 큰 사이즈의 모델들을 공개했습니다. LLM 시대의 시작을 알렸던 GPT-3가 175B이였던걸 감안하면, 70B이라는 크기는 상당한 사이즈입니다. (한국어 모델 중 가장 큰 사이즈의 사전학습 모델은 12.8B의 Polyglot-Ko 모델입니다.) Meta가 LLaMA-2 및 테크니컬 리포트까지 공개하면서 전세계 LLM 연구자들에게 많은 기회의 창을 열어주었습니다. LLaMA-2 공개 이후 국내외로 하루하루 새로운 모델과 논문이 쏟아져 나오고 있으며, 오픈소스 진영이 활활 불타오를 수 있는 기름 역할을 해줬습니다. 🔥🔥 (국내에는 준범님이 공개해준 LLaMA-2-Ko가 대표적입니다.) 이러한 Meta의 행보는 ChatGPT를 만든 OpenAI나 발빠르게 ChatGPT와 유사한 Bard, Gemini를 내놓은 Google의 행보와는 아주 대조적입니다. 🤔
  
## 그렇다면 Meta는 왜 LLaMA를 공개하기로 했을까?
  
<img src="https://github.com/sooftware/sooftware.io/assets/42150335/17ba722e-731c-42c8-a250-fce2645b9b5e" width=550>
    
\* 해당 부분은 개인적은 견해가 섞여있습니다.

그렇다면, Meta는 왜? LLaMA를 공개했을까요?  1B짜리 모델을 pre-training하는데도 상당한 비용이 들며, 모델 사이즈가 커질수록 이 비용은 지수적으로 증가하게 됩니다. 하물며 70B 사이즈의 모델 학습을 위해서는 수백~수천억원의 학습 비용이 들게됩니다. 이러한 비용을 들여서 개발한 모델을, 왜 상업적으로도 이용이 가능하도록 공개했을까요? 저는 아래와 같은 이유들이 있다고 생각합니다.  

### 1. 어차피 지금 Meta가 LLM 시장을 점유하기는 어렵다.
  
지금 LLM 시장은 큰 격차로 OpenAI가 단독 선두로 달리고 있다고 볼 수 있습니다. ChatGPT 등장전, Google, OpenAI, Meta, Microsoft가 비등비등한 상황이였다면, ChatGPT 등장 이후로는 아래와 같은 상황이 됐습니다.  

- OpenAI : 단독 선두
- Microsoft : OpenAI에 투자. OpenAI의 최대주주. 사실상 최대 승리자.
- Google : Bard, Gemini를 내놓으며 OpenAI 따라잡기 진행중
- Meta : 포지션 애매..
  
이러한 상황에서 사실상 Meta가 갑자기 Google과 OpenAI를 제치며 LLM 시장을 점유하는건 사실상 어려워보였습니다. 이미 커져버린 기술적 격차를 어떻게 해소할지에 대해 내부적으로 많은 고민이 있었을 것으로 보입니다.
  
### 2. LLaMA 시리즈를 공개함으로써, OpenAI의 독점을 막을 수 있다.

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/52f804a9-b7a9-41b9-bf03-f5373ed22820" width=350>

어차피 LLM 시장을 Meta가 먹지 못할것이라면, OpenAI와 Microsoft가 이 시장을 독점하지 못하도록 막는것이 최선일 수 있을 겁니다. Meta는 메타버스 세상을 꿈꾸고 있습니다. 만약 이대로 OpenAI가 LLM 시장을 독점하게 된다면, Meta는 본인들이 꿈꾸는 세상을 위해 필요한 LLM 기술을 OpenAI와 Microsoft에게 막대한 비용을 지불하고 사용해야 할 겁니다. 이건 미래의 Meta에게 큰 걸림돌이 되겠죠.

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/2cd2df63-bd47-4f21-983e-c2ac6b2a4b1a" width=400>
  
지금 LLM 시장은 과거의 Desktop PC OS(Operating System) 시장을 보는 것 같기도 합니다. 현재 대표적인 Desktop PC OS 시스템은 Microsoft의 Windows, Apple의 OS X, 그리고 오픈소스 OS인 Linux가 있습니다. 2023년 1월 기준으로 Windows는 74%, OS X는 15%, Linux는 3% 정도를 점유하고 있습니다. 압도적으로 Windows가 장악하고 있는 만큼, Microsoft는 막대한 돈을 벌어들이고 있습니다. Meta 입장에서는 OpenAI가 LLM 시장을 이렇게 장악해버리길 원하지 않을겁니다. Meta가 오픈소스 LLM 진영에 LLaMA를 공개하며 힘을 실어줌으로써, OpenAI의 독주를 견제할 수 있다는 점도 Meta가 LLaMA-2를 공개한 큰 이유 중 하나일 것으로 보입니다. 마치 OS 시장에 오픈소스 OS인 리눅스가 있는 것처럼요.

### 3. 집단지성의 힘을 이용해서 OpenAI와의 기술적 격차를 해소한다.

<img src="https://github.com/sooftware/sooftware.io/assets/42150335/43a1c7c0-75bd-451b-a746-d3bd7bcdf6de" width=300>
  
또한, LLaMA를 공개함으로써 Meta는 OpenAI와의 기술적 격차를 해소할 가능성을 높일 수 있습니다. 집단지성의 힘은 굉장합니다. 실제로 LLaMA 공개 이후 Alpaca, Vicuna, Guanaco 등 다양한 파생 모델이 빠르게 등장했으며, 최근에 핫한 Mistral-AI에서 공개한 Mistral, Mixtral도 LLaMA-2 아키텍처에 기반하여 만들어졌습니다. 이처럼 LLaMA-2를 공개함으로써 오픈소스 LLM 진영의 기술개발에 불이 붙었고, LLM 기술이 필요한 여러 기업들에게 LLaMA-2를 활용하는 선택지가 추가로 주어지게 됐습니다. 
    
실제로 오픈소스 진영의 약진은 무섭게 OpenAI 기술력을 따라잡고 있습니다. 이러한 집단지성의 힘을 이용하여 OpenAI와의 기술력 차이를 해소하고, 현재 상황을 뒤집을 기회를 노리고 있다고도 볼 수 있을 것 같습니다. 실제로 Meta에서 LLaMA를 활용한 연구들을 예의주시하며, 각종 연구 결과들을 참고하여 기술을 더 발전시켜나가고 있다고 합니다. 😎
  
### 4. 우수한 인력 확보

우수한 인력 확보는 기업에게 가장 중요한 일 중 하나입니다. 빅테크 기업들에서 오픈소스를 공개하는 가장 큰 이유가 인재 확보를 위해서라고 하죠. Meta 입장에서도 LLaMA와 같은 모델을 공개하며 오픈소스에 기여한다는 좋은 이미지를 가져감과 함께 OpenAI의 LLM 기술 독점에 불만을 가지고 있는 전세계의 우수한 리서쳐들에게 'Meta에 와서 OpenAI의 독점을 같이 막자!'와 같은 어필을 할 수 있습니다.   

---  

  
여기까지 메타가 왜 LLaMA를 오픈소스로 공개하는지에 대한 제 생각을 서술했습니다. 그렇다면 앞으로의 메타의 행보는 여전히 오픈소스를 향할까요? 🤔

## LLaMA-3 학습중, 그리고 오픈소스 공개?!

몇일 전 메타 CEO인 마크 저커버그의 인터뷰에서 LLaMA-3에 대한 언급이 있었습니다. 내용을 정리하자면 아래와 같습니다.  

- Meta가 AGI 전쟁에 뛰어든다고 합니다.
- LLaMA-3 학습을 시작했다고 합니다.
- LLaMA-3도 오픈소스로 공개할 예정이라고 합니다.
- AGI 전쟁에 뛰어들기 위해 34만대의 H100을 구매 예정이라고 합니다. (약 15조원..)

34만대의 H100 구매는 정말 어메이징하네요.. 어쨌든 LLaMA-3를 오픈소스로 공개한다는걸 다시 한 번 확인해준건 아주 기쁜 소식입니다! 하루 빨리 공개돼서 다시 한 번 오픈소스 LLM 진영에 불을 붙여주면 좋겠네요 :)  

---

여기까지 'Meta는 왜 LLaMA를 공개할까?'라는 주제에 대해 제 생각을 써봤습니다. 위 내용은 제 개인적인 견해이며, 사실과는 많은 차이가 있을 수 있는 점 참고해주시면 감사하겠습니다. 😁   

## Reference
- [LLaMA-2 Paper](https://arxiv.org/abs/2307.09288)
- [Meta begins training Llama 3, reshuffles AI responsibilities](https://www.axios.com/2024/01/18/zuckerberg-meta-llama-3-ai)

