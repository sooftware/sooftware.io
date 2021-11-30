---
title: 'PyTorch Lightning'
author: [Soohwan Kim]
tags: [toolkit]
image: img/pl.png
date: '2021-09-17T10:00:00.000Z'
draft: false
---

## PyTorch Lightning
  
대표적인 딥러닝 프레임워크로 `pytorch`, `tensorflow`가 있습니다. 최근에는 `tensorflow`보다 `pytorch`를 선호하는 유저가 많아지는 것 같습니다. 
PyTorch Lightning 은 PyTorch에 대한 High-level 인터페이스를 제공하는 오픈소스 Python 라이브러리입니다.   
  
`pytorch-lightning`을 사용하면, 코드가 깔끔하고 간결해지며, 주어진 포맷에만 맞게 작성하면 `pytorch-lightning`에서 제공하는 다양한 기능을 사용할 수 있습니다.
  
이번 포스팅에서는 `pytorch-lightning`의 기본적인 사용 방법을 기록합니다.  
  
### Step 0: Install
`pip install pytorch-lightning`  

### Step 1: Define a LightningModule
```python
import torch
from torch import nn
import torch.nn.functional as F
from torchvision import transforms
from torchvision.datasets import MNIST
from torch.utils.data import DataLoader, random_split
import pytorch_lightning as pl


class LitAutoEncoder(pl.LightningModule):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(28 * 28, 128), nn.ReLU(), nn.Linear(128, 3))
        self.decoder = nn.Sequential(nn.Linear(3, 128), nn.ReLU(), nn.Linear(128, 28 * 28))

    def forward(self, x):  # prediction/inference
        embedding = self.encoder(x)
        
        return embedding

    def training_step(self, batch, batch_idx):  # train loop, forward와 독립적으로 실행합니다.
        x, y = batch
        x = x.view(x.size(0), -1)
        z = self.encoder(x)
        x_hat = self.decoder(z)
        loss = F.mse_loss(x_hat, x)
        self.log("train_loss", loss) 
        # 디폴트는 TensorBoardLogger에 기록되는데, WandbLogger로만 바꿔주면 wandb를 사용할 수 있습니다. 
        # loss뿐만 아니라 다른 파라미터도 wandb로 보고 싶으시면 똑같이 log를 찍어주면 됩니다.
        
        return loss
        
    def validation_step(self, batch, batch_idx):
        x, y = batch
        y_hat = self(x)
        val_loss = F.cross_entropy(y_hat, y)
        
        return val_loss
        
    def test_step(self, batch, batch_idx):
        x, y = batch
        y_hat = self(x)
        loss = F.cross_entropy(y_hat, y)
        
        return loss
  
    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
        
        return optimizer
```

## Step 2: Train
```python
dataset = MNIST(os.getcwd(), download=True, transform=transforms.ToTensor())
train, val = random_split(dataset, [55000, 5000])

autoencoder = LitAutoEncoder()
trainer = pl.Trainer()
trainer.fit(autoencoder, DataLoader(train), DataLoader(val))
```

<br>
  
이렇게하면 학습이 시작됩니다. 하지만, 가장 기초적인 방법으로 학습을 진행한 것이기 때문에 기능들을 조금 더 알아보겠습니다.  


<br>


## Define a LightningDataModule
```python
class YourLightningDataModule(pl.LightningDataModule):
    def __init__(self):
        super().__init__()
        
   
    def prepare_data(self):  
       # DDP/TPU에서 모든 process가 prepare_data 메소드를 통과하지 않기 때문에 stage로 나누면 안됩니다.
       # good
       download_data()
       tokenize()
       etc()

       # bad
       self.split = data_split
       self.some_state = some_other_state()
       self.something = else


    def setup(self, stage: Optional[str] = None): 
       # setup은 모든 process에서 호출된다. train, validate, test, and predict로 데이터를 나눈다.
       data = Load_data(...)
       self.dataset['train'] = Dataset(...)
       self.dataset['valid'] = Dataset(...)
       self.dataset['test'] = Dataset(...)
        
    def train_dataloader(self):
        return AudioDataLoader(
            dataset=self.dataset['train'],
            num_workers=4,
            batch_size=32,
        )

    def val_dataloader(self):
        return AudioDataLoader(
            dataset=self.dataset['valid'],
            num_workers=4,
            batch_size=32,
        )

    def test_dataloader(self):
        return AudioDataLoader(
            dataset=self.dataset['test'],
            num_workers=4,
            batch_size=32,
        )
 ```
 
 
 
## pl.Trainer  
아래는 gpu-fp16 Trainer 예시입니다. Trainer에 대한 더 자세한 사용법은 [여기](https://github.com/PyTorchLightning/pytorch-lightning/blob/master/pytorch_lightning/trainer/trainer.py#L91-L344)를 참고하시면 좋습니다.  
  
```python
trainer = pl.Trainer(
              precision=16,                    # Double precision (64), full precision (32) or half precision (16)
              accelerator=dp,                  # Distributed_backend (dp, ddp, etc ...)
              gpus=4,                          # GPU 개수
              accumulate_grad_batches=1,       # Gradient를 몇 개의 배치동안 누적해서 계산할 것인지
              amp_backend="apex",              # mixed precision backend to use (“native” or “apex”)
              auto_select_gpus=True,           # 사용가능한 GPU를 알아서 잡아준다.
              check_val_every_n_epoch=1,       # 몇 개의 epoch마다 validation 할 것 인지
              gradient_clip_val=5.0,           # Gradient clipping을 얼마로 할 것인지
              logger=WandbLogger(project=YOUR_PROJECT_NAME),        # 로그 선택
              auto_scale_batch_size="binsearch",                    # 메모리에 적합한 가장 큰 배치 사이즈를 찾아준다.
              max_epochs=20,                                        # 최대 epoch 수
)
```


## Train
```python
autoencoder = LitAutoEncoder()
data_module = YourLightningDataModule()
trainer = pl.Trainer(...)

trainer.fit(autoencoder, data_module)
```

