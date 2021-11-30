---
title: 'Wandb Image Log'
author: [Soohwan Kim]
tags: [toolkit, logging]
image: img/wandb_image.png
date: '2021-10-13T22:00:00.000Z'
draft: false
---

# Wandb (Weights & Bias) Image Log
  
Wandb 라이브러리는 최근에 가장 편리하면서도 파워풀한 logging 라이브러리입니다.  
NLP에서 많이 쓰이는 PyTorch, PyTorch-Lightning, Huggingface Transformers 등에서도 쉽게 사용이 가능합니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/137149370-e8de77b9-83a2-46ea-89ca-d444ba258d80.png" width=800>. 
  
보통 이런 logging 라이브러리는 딥러닝 모델 학습시 Loss 혹은 Metric Score를 모니터링할 때 사용합니다.  
여기서 조금 더 모델 학습을 면밀하게 보기 위해 모델의 어텐션 맵을 그려본다거나, 생성한 Mel-Spectrogram을 그려본다거나 하는 등의 logging 방식도 생각해볼 수 있습니다.  
  
예를 들어 100 스텝마다 모델의 어텐션 맵을 그려보면서 어텐션이 어떻게 학습 되는지를 확인할 수도 있고, 모델이 생성하는 Mel-Spectrogram을 이미지로 보면서 학습 진행 과정을 볼 수도 있습니다.  
  
실제로 well-made 딥러닝 학습 코드의 경우는 이런 어텐션 맵 등을 학습 중간중간 저장하도록 짜여져 있는 경우가 많습니다.  
  
그런데 리눅스 서버에서 학습하는 경우는 일일이 노트북으로 이미지를 옮겨서 확인하는 것도 귀찮습니다.  
  
그렇기 때문에 웹 기반으로 log가 관리되는 wandb의 경우는 이런 이미지를 스텝별로 저장해놓으면 상당히 유용합니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/137151370-5df2fd57-76f3-4351-9166-d98307810b33.png" width="600">
  
위와 같이 모델이 생성한 Mel-Spectrogram, Attention Map 등을 확인해보면 모델이 학습되는 과정을 좀 더 확실하게 알 수 있습니다.  
  
## Wandb Image Log 찍는 법
  
Wandb로 image log를 찍는건 굉장히 간단합니다.  
  
pandas 라이브러리의 DataFrame을 이용해서 Confusion Matrix도 찍을 수 있습니다만, 여기서는 Image 찍는 법만 다루겠습니다.  
  
Image를 찍기 위해서는 matplotlib 라이브러리를 이용해서 이미지를 저장하고 해당 이미지 파일을 넘겨주기만 하면 됩니다.  
  
```python
import wandb
import matplotlib.pyplot as plt

outputs, attention_map = model(inputs)

plt.imshow(attention_map, aspect='auto', origin='lower', interpolation='none')
plt.savefig('attention_map.png', figsize=(16, 4))

wandb.log({
    "Attention Map": [
        wandb.Image('attention_map.png')
    ]
})
```
   
위 코드를 학습하면서 주기적으로 호출해주기만 하면 Attention Map이 어떻게 학습되어 가는지를 확인할 수 있습니다. 
  


