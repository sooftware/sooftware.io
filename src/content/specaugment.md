---
title: 'SpecAugment Paper Review'
author: [Soohwan Kim]
tags: [speech, paper]
image: img/specaugment.png
date: '2020-01-12T10:00:00.000Z'
draft: false
---

# SpecAugment:
## 「A Simple Data Augmentation Method for Automatic Speech Recognition」  Review
  
![title](https://user-images.githubusercontent.com/42150335/134007258-2d041cd9-e68c-4339-8417-bb0defcfa33c.png)  
https://arxiv.org/abs/1904.08779  
  
## Abstract
  
모델의 Overfitting을 막기 위해 가장 좋은 방법은 데이터가 많은 것입니다. 하지만 데이터가 뿅! 하고 생기는 것이 아니기 때문에 기존 데이터를 활용하여 새로운 데이터를 만들어내는 Augmentation이라는 기법을 사용합니다. 본 논문에서는 음성인식을 위한 간단한 Data-Augmentation을 제안하고, 이를 SpecAugment라고 명명했습니다. 본 논문은 오디오에서 뽑은 피쳐 벡터 (MFCC or Mel-Spectrogram etc ..) 를 input으로 Time warping, Frequency masking, Time masking 3가지 방법으로 Augmentation을 적용했습니다. 성능 테스트를 위한 모델로는 [「Listen, Attend and Spell」](https://github.com/sh951011/Paper-Review/blob/master/Review/Listen%2C%20Attend%20and%20Spell.md) (LAS) 모델을 사용했으며, Language Model과의 **Shallow Fusion**을 통해 인식률 개선을 이뤄냈다고 밝히고 있습니다. 본 논문의 모델은 [LibriSpeech 960h](http://www.openslr.org/12/) 데이터셋과 [Swichboard 300h](https://catalog.ldc.upenn.edu/LDC97S62) 데이터셋에서 **State-Of-The-Art (SOTA)** 를 달성했습니다. 달성한 결과는 아래 표에 정리했습니다.    
  

|Dataset|LibriSpeech 960h|LibriSpeech 960h|Swichboard 300h|Swichboard 300h|    
|:--:|:--:|:--:|:--:|:--:|    
|Method|No LM|With LM|No LM|With LM|  
|Previous         |-|7.5|-|8.3 / 17.3|   
|**LAS + SpecAugment**|6.8|5.8|7.2 / 14.6|6.8 / 14.1|  
  
  
### Data Augmentation  
  
자세히 들어가기 앞서, Data-Augmentation이 뭔지 부터 살펴봅시다.  
  
![Augmentation](https://user-images.githubusercontent.com/42150335/134007275-48e3b310-5faa-41f7-9979-d824c669bc8e.png)
  
Augmentation이란, 데이터를 부풀려서 모델의 성능을 향상시키는 기법입니다.  
이미지 인식 분야에서 많이 쓰이는 방법으로, 좌우 반전, 사진의 일부 발췌, 밝기 조절 등을 적용하여 한정된 데이터를 조금씩 변형시켜 새로운 데이터처럼 활용하는 방법입니다.  
  
### Augmentation을 하는 이유
  
1. Preprocessing 및 .Augmentation을 하면 대부분의 경우 성능이 향상된다.  
2. 원본 데이터를 활용하여 추가하는 개념이므로 성능이 저하될 염려가 없다.  
3. 방법이 간단하며 패턴이 정해져 있다.  
  
단기간에 성능 향상을 원한다면, Ensemble, Augmentation을 활용하라는 말이 있을 정도로 그 효과가 검증됐다고 합니다.  
저번 네이버 해커톤 - Speech 대회 참여 당시에도, 상위권 팀들은 Ensemble, Augmentation을 거의 모두 적용했었습니다. 또한 Augmentation을 적용하는 방법은 매우 다양하기 때문에, 여러 방법도 적용이 가능하다는 장점이 있습니다.  
  
#

## Introduction
   
딥러닝은 음성인식 분야에 성공적으로 적용이 되었습니다. 하지만, 음성 인식 분야의 연구는 대부분 모델에 초점이 맞춰져서 진행이 되었는데, 본 논문은 이러한 모델들은 쉽게 Overfitting 현상이 발생하며, 많은 양의 데이터를 필요로 한다고 지적하고 있습니다.  
  

### Traditional Data-Augmentation for Audio
  
그리고 본 논문은 기존의 Augmentation이 어떤 방식으로 적용되었었는지에 대한 설명을 간략하게 합니다.  
  
#### Noise injection  
  
![noise-ingection](https://user-images.githubusercontent.com/42150335/134007294-65cd737e-71b8-4217-bb84-c406493dbe18.png)  
  
기존 데이터에 임의의 난수를 더하여 Noise를 추가해주는 방법입니다.  
  
#### Shifting Time  
  
![shiftting-time](https://user-images.githubusercontent.com/42150335/134007299-10b640b0-be3c-4c3a-98bc-beadd3a43667.png)  
  
임의의 값만큼 음성 신호를 좌/우로 shift하고 빈 공간은 0으로 채우는 방법입니다.  
  
#### Changing Pitch
  
![changing-pitch](https://user-images.githubusercontent.com/42150335/134007316-d3b9da34-6d41-479c-9f92-48cbfe843717.png)    
  
기존 음성 신호의 Pitch(음높이, 주파수)를 랜덤하게 변경해주는 방법입니다.  
  
#### Changing Speed
  
![changing-speed](https://user-images.githubusercontent.com/42150335/134007324-d7fb0123-999c-4645-8c61-a80babcdc882.png)

기존 음성 신호의 속도를 빠르게 / 느리게 바꿔주는 방법입니다.  

기존 음성 신호에 대한 Augmentation은 위와 같이 raw audio를 변형하는 방법들이었습니다.  
하지만 본 논문에서는 이와 같이 주장합니다.  
  
```
어차피 사용하는 피쳐는 MFCC / log mel spectrogram인데, 이쪽을 변형하는게 쉽고 빠르지 않아?"
```  
  
또한 이러한 방법을 이와 같이 표현합니다.  
```
This method is simple and computationally cheap to apply.
```  

log mel spectrogram을 이미지처럼 다루는 겁니다. 이렇게 계산 비용이 적게 들기 때문에 학습을 하면서 바로바로 Augmentation을 적용할 수 있었다고 합니다. SpecAugment는 앞에서 언급했듯이 3가지 종류의 변형을 적용했습니다.  
  
1.  Time Warping  
2.  Frequency Masking  
3.  Time Masking  
  
## Augmentation Policy
  
그럼 이제 본 논문에서 제안하는 SpecAugment에 대해 상세하게 알아봅시다.   
별로 어렵지 않은 내용이라, 쉽게 이해가 되실거라 생각합니다.
  
### Time Warping
  
![time-warping](https://user-images.githubusercontent.com/42150335/134007533-9e5ceea1-5c82-4a57-96bb-f6aeefb52d66.png)    
  
Computer Vision에서 사용되는 Image Warping을 응용한 방법입니다.  
축의 중심을 이동한다(?)라고 생각하시면 되는데 아마 감이 잘 안오실 겁니다.  
  
쉽게 생각해보자면 다음과 같습니다.  
  
![cloth-warp](https://user-images.githubusercontent.com/42150335/134007547-012b55df-2837-4d12-a872-acb90f67428a.png)
  
위와 같이 보자기의 중심에 손가락을 가져다가 한쪽으로 밀게되면 우측의 이미지와 같이 보자기가 꾸겨지게 됩니다.   
(보자기가 없어 수건으로 사진을 찍었습니다 ㅎㅎ..)    
  
하지만, 우측 이미지를 보더라도 우리는 보자기라는 것을 알 수 있습니다.  
이러한 점을 이용해서 Vision에서는 Image Warp라는 Augmentation 방법을 성공적으로 적용하였고, 본 논문은 여기에 영감을 받아, log mel spectrogram을 이미지라 생각하고, Time Warp를 적용합니다.  
  
### Frequency Masking
  
![freq-mask](https://user-images.githubusercontent.com/42150335/134007557-fbc56570-8b0c-4563-a6af-f3f8583c4752.png)  
  
굉장히 간단한 방법입니다.  
주파수와 시간 축으로 이루어진 Spectrogram의 주파수 축을 따라 일정 영역을 0으로 마스킹해버립니다.  
  
* code
```python
def freq_masking(feat, F = 20, freq_mask_num = 2):
    feat_size = feat.size(1)
    seq_len = feat.size(0)

    # freq mask
    for _ in range(freq_mask_num):
        f = np.random.uniform(low=0.0, high=F)
        f = int(f)
        f0 = random.randint(0, feat_size - f)
        feat[:, f0 : f0 + f] = 0

    return feat
```

### Time Masking
  
![time-mask](https://user-images.githubusercontent.com/42150335/134007573-e5fcec5d-1ca8-451f-8677-6b1146b70fc6.png)  
  
Frequency Masking과 똑같습니다.  
다만, 주파수 축기 아닌, 시간 축에 대해서 일정 영역을 0으로 마스킹해버립니다.  
  
* code
```python
def time_masking(feat, T = 70, time_mask_num = 2):
    feat_size = feat.size(1)
    seq_len = feat.size(0)

    # time mask
    for _ in range(time_mask_num):
        t = np.random.uniform(low=0.0, high=T)
        t = int(t)
        t0 = random.randint(0, seq_len - t)
        feat[t0 : t0 + t, :] = 0

    return feat
```
  
Frequency Masking과 Time Masking 적용 시 주의점은, 마스킹하는 영역의 범위를 적당하게 지정해주어야 합니다.  
너무 많이 / 적게 적용한다면 Augmentation의 효과가 덜하거나 심한 경우 Noise가 될 수 있습니다.  

![single-apply](https://user-images.githubusercontent.com/42150335/134007673-cd8aa64b-d5d2-4afb-b117-b0dfc6deae52.png)  
  
Figure 1은 위에서 아래 방향으로 기존 Spectrogram, Time Warp, Frequency Mask, Time Mask가 각각 적용된 Spectrogram입니다.  
  
![double-apply](https://user-images.githubusercontent.com/42150335/134007699-fc2e4ea2-c01c-4a73-b166-205a59e2cb82.png)

본 논문은 Frequency Masking과 Time Masking을 동시에 적용하는 것을 고려했다고 합니다. 2 마스킹을 동시에 적용하게 되면 Figure 2와 같은 Spectrogram이 나오게 됩니다. 
  
본 논문은 각각 적용하는 것과 동시에 적용하는 실험을 진행했고, 결과로 나온 파라미터는 다음과 같습니다.  
  
![experiment-table1](https://user-images.githubusercontent.com/42150335/134007708-75d7d338-42bf-44df-9237-2c6fc72475cf.png)  

  
* LB : LibriSpeech Basic
  
* LD : LibriSpeech Doucle
  
* SM : Switchboard Mild 
  
* SS : Switchboard String  
  
Frequency Masking과 Time Masking을 동시에 적용하는 코드는 아래와 같이 사용하시면 됩니다.  
    
* code
```python
def spec_augment(feat, T = 70, F = 20, time_mask_num = 2, freq_mask_num = 2):
    feat_size = feat.size(1)
    seq_len = feat.size(0)

    # time mask
    for _ in range(time_mask_num):
        t = np.random.uniform(low=0.0, high=T)
        t = int(t)
        t0 = random.randint(0, seq_len - t)
        feat[t0 : t0 + t, :] = 0

    # freq mask
    for _ in range(freq_mask_num):
        f = np.random.uniform(low=0.0, high=F)
        f = int(f)
        f0 = random.randint(0, feat_size - f)
        feat[:, f0 : f0 + f] = 0

    return feat
```
  
## Model
  
본 논문은 [「Listen, Attend and Spell」](https://github.com/sh951011/Paper-Review/blob/master/Review/Listen%2C%20Attend%20and%20Spell.md) 모델을 사용했습니다. LAS 모델 같은 경우는 음성 인식 분야에서 end-to-end의 대표적인 모델로써, 구조가 간단하며, 관련 연구도 많이 진행된 구조입니다. 첫번째 절에서 이 모델에 대한 Review 및 파라미터들에 대해 소개하고, 2번째 절에서는 Learning Rate Schedules에 대해 다룹니다. 이 Learning Rate Schedule은 퍼포먼스에 많은 영향을 미쳤다고 소개합니다. 또한 앞에서 언급했던 shallow fusion에 대해서 3번째 절에서 다룹니다.  
  
### LAS Network Architectures
  
본 논문은 LAS Network 중 [「Model Unit Exploration for Sequence-to-Sequence Speech Recognition」](https://arxiv.org/abs/1902.01955)에서 사용된 구조를 사용했다고 밝힙니다. ( 제가 진행하고 있는 한국어 음성인식 프로젝트도 역시 LAS Network를 사용하기 때문에 해당 논문도 읽고 리뷰를 쓸 예정입니다. )  
  
<img src="https://user-images.githubusercontent.com/42150335/134007720-e516809f-96e7-44f5-85d7-178d340d04ad.png" width=500>  

  
해당 논문은 log mel spectrogram을 입력으로 받아, 2-Layer의 maxpooling이 적용된 CNN을 거칩니다. (stride = 2) 그리고 이렇게 CNN을 거쳐서 나온 아웃풋을 인코더의 stacked Bi-LSTM의 입력으로 넣습니다. 그리고 인코딩을 거친 아웃풋을 어텐션 기반의 디코더에 넣어 예측 시퀀스를 뽑아냅니다. (디코더 레이어 사이즈 = 2)
  
### Learning Rate Schedules
  
이 섹션에서는 학습율을 어떻게 관리했는지에 대해서 소개하고 있습니다. 이렇게 하나의 학습율을 사용하는 것이 아닌, 학습 도중 학습율을 조정하면서 사용하는 것을 Multi-step Learning Rate라고 합니다. 본 논문에서는 총 4단계의 Learning Rate Scheduling을 적용했습니다. 

다음 그림으로 보시면 이해가 조금 더 쉬울 겁니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134007891-a3957747-762c-4b07-8090-eaea381b10d0.png" width = 500>  
  
좌측의 lr의 특정 값은 제가 진행하고 있는 프로젝트에서 적용한 값이므로 무시하셔도 좋습니다.   
  
 **Ramp-up**: 학습율이 0부터 시작하여 특정 값까지 급격하게 증가시키는 구간입니다. [0, s_r]   

 **High Plateau**: 특정 값에 다다르면 학습율을 유지시키는 구간이 High Plateau입니다. [s_r, s_i]  
 **Exponential Decay**: 스텝이 s_i에 다다르면, s_f까지 High Plateau에서 사용한 학습율의 1 / 100로 지수적으로 감소시키면서 진행합니다. [s_i, s_f]   
 **Low Plateau**: 이 시점 이후에는 학습률을 계속 유지합니다. [s_f, ~]    
   
High Plateau 구간 중 [s_r, s_noise]까지는 학습율에 deviation이 0.075인 noise를 끼워서 진행하고, s_noise 이후에는 기존 학습율을 유지한다고 합니다. 학습율이 가장 중요한 하이퍼파라미터라는 말답게 상당히 많은 고민을 한 모습입니다.  
  
그리고 본 논문에서는 이러한 구간을 총 3개로 나눠서 실험을 진행했습니다.  
  
1. **B**(asic): (s_r, s_noise, s_i, s_f) = (0.5K, 10K, 20K, 80K)  
2. **D**(ouble): (s_r, s_noise, s_i, s_f) = (0.5K, 20K, 40K, 160K)  
3. **L**(ong): (s_r, s_noise, s_i, s_f) = (1K, 20K, 140K, 320K)  
  
이에 대한 실험의 결과는 뒤에서 살펴보겠습니다.  
  
### Label-Smoothing
  
또한 본 논문은 Label-Smoothing을 적용했다고 밝힙니다. Label-Smoothing은 데이터에 대한 Over-Confidence를 조금 덜어주는 역할을 합니다. 아마 Overfitting은 많이 봤겠지만, Over-Confidence는 생소한 분들이 많으실 겁니다. Over-Confidence란 데이터를 너무 믿는다는 겁니다. 아무래도 레이블링이라는 작업이 결국은 사람이 하는 것이다 보니, 어느 정도의 오류가 있습니다. 이러한 오류가 있는 데이터를 학습하다보면 아무래도 정확한 학습하기가 힘듭니다. 그래서 이러한 Over-Confidence를 줄여주기 위하여 Label-Smoothing이라는 개념이 있습니다.  
  
정확히 말하자면 Label-Smoothing loss입니다. loss를 계산할 때 적용이 됩니다. loss 계산시에, 원-핫 인코딩 되어 있는 레이블링에 의해 정답에 대해서만 loss가 계산되지만, 이때 정답 레이블은 1, 나머지 레이블은 0으로 되어 있는 것이 아니라, 정답 레이블은 confidence, 나머지 레이블은 uncertainty로 바꾸어 loss 계산을 합니다.  
  
confidence + uncertainty = 1.0이 되도록 설정을 합니다.   
  
아래는 이를 PyTorch로 이를 구현한 코드입니다.  
  
```python
class LabelSmoothingLoss(nn.Module):
    def __init__(self, vocab_size, ignore_index, smoothing=0.1, dim=-1):
        super(LabelSmoothingLoss, self).__init__()
        self.confidence = 1.0 - smoothing
        self.smoothing = smoothing
        self.vocab_size = vocab_size
        self.dim = dim
        self.ignore_index = ignore_index

    def forward(self, logit, target):
        with torch.no_grad():
            label_smoothed = torch.zeros_like(logit)
            label_smoothed.fill_(self.smoothing / (self.vocab_size - 1))
            label_smoothed.scatter_(1, target.data.unsqueeze(1), self.confidence)
            label_smoothed[target == self.ignore_index, :] = 0
        return torch.sum(-label_smoothed * logit)

>>> criterion = LabelSmoothingLoss(vocab_size, ignore_index, smoothing=0.1, dim=-1)  
```
  
본 논문은 confidence는 0.9, uncertainty는 0.1을 적용했다고 합니다.  
  
### Shallow Fusion with Language Model
  
Augmentation만으로도 State-Of-The-Art를 달성했지만, 조금 더 개선하기 위해 Language Model과 Shallow Fusion을 진행했다고 합니다.  
  
![shallow-fusion](https://user-images.githubusercontent.com/42150335/134007910-3607daa9-cbea-4b37-934f-6fe2dd3af251.png)  
  
ASR 모델에서 나온 log-probability와 LM 모델에서 나온 log-probability를 적절히 고려해주어서 y_hat을 결정하게 됩니다. 앞에서 언급했었던 성능향상을 위해 적용하는 기법 중 하나인 Ensemble과 비슷한 효과를 내는 방법이라고 합니다.  
  
## Experiments
  
실험 결과에 대한 자세한 설명은 생략하겠습니다.  
아래 표를 참고 혹은 [본 논문](https://arxiv.org/abs/1904.08779)을 참고하시면 자세한 결과를 보실 수 있습니다.  
  
![table-2](https://user-images.githubusercontent.com/42150335/134007927-856a82af-9c96-4c69-897e-16eed90830e4.png)  
  
![table-3](https://user-images.githubusercontent.com/42150335/134007944-7c2756ed-10d2-422e-91a7-96ed6afd539a.png)  
  
![table-4](https://user-images.githubusercontent.com/42150335/134007962-b57d1f9b-7b5a-4b86-93a2-ed5aebd3fd1c.png)  
  
## Discussion

자, 이제 얻어진 결과에 대해 해석해보는 시간입니다.  

### Time waiping contributes, but is not a major factor in improving performance.  
  
제안한 Time Warp, Frequency Masking, Time Masking 중 Time Warp는 계산은 오래 걸리는데 반하여, 성능이 그리 좋지는 않습니다. 그래서 학습시간이 넉넉치 않다면 Frequency Masking, Time Masking만을 적용하더라도 충분한 결과를 얻을 수 있을 것이라고 언급하고 있습니다.  
  
### Label smoothing introduces instability to training.  
  
Label Smoothing은 Augmentation과 같이 적용될 때 눈에 띄는 성과를 냈다고 언급합니다. 그 이유에 대해 추측해보자면, Masking, Warp와 같은 조작이 들어가게 되면 어느 정도의 변형이 된 것이기 때문에 완벽하게 ~~한 데이터라고 표현할 수는 없을 것입니다. 그래서 이러한 Confidence를 줄여주는 Label-Smoothing과 Collaboration이 되면 더 큰 효과를 내는 것이 아닐까 추측해봅니다 ㅎㅎ..
  
### Augmentation converts an over-fitting problem into an under-fitting problem.  
  
Augmentation은 오버피팅 되는 문제를 언더피팅으로 바꿔주는 효과가 있다는 말입니다. Augmentation이 적용 되지 않은 데이터셋으로만 학습을 하게 되면, 아무래도 오버피팅이 날 확률이 높습니다. 하지만, Augmentation을 적용해주게 되면 아무래도 기존의 Training 데이터셋에 대하여 Overfitting이 나기 힘든 환경이 될 것입니다. 본 논문에서는 이를 over-fitting => under-fitting 되는 효과가 있다고 표현했습니다.  
  
### Common methods of addressing under-fitting yield improvements.  
  
그럼 이때 발생하는 under-fitting 문제를 어떻게 해결했는지에 대한 답입니다. 간단합니다. 네트워크를 깊게 만들고 학습을 오래시키면 됩니다. 보통 over-fitting이 문제지, under-fitting이 문제라면 전통적인 방법인 네트워크를 깊게하고, 학습을 오래시키면 해결 가능합니다.
  
## Conclusion
  
다른 논문들은 인식률 개선을 위해 **Network**에 집중할 때, Augmentation, Learning Rate Schedule, Loss 계산 등에 집중해서 **State-Of-The-Art**를 달성한 "기본에 충실하자"라는 깨달음을 준 논문입니다. 또한 제가 진행하고 있는 한국어 음성 인식 프로젝트에 많은 영감을 줬고, 실제로 논문에 등장한 거의 대부분의 내용을 적용하여 학습을 진행중입니다. 기회가 된다면 해당 모델로 나온 결과에 대해서도 리뷰하겠습니다. 읽어주셔서 감사합니다.
