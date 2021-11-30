---
title: 'wandb (Weight & Bias)'
author: [Soohwan Kim]
tags: [toolkit]
image: img/wandb.png
date: '2021-06-13T10:00:00.000Z'
draft: false
---

## wandb (Weight & Bias)
  
![image](https://user-images.githubusercontent.com/42150335/122323318-e1ae3580-cf61-11eb-9db2-64e978b459cf.png)

  
[`wandb`](https://wandb.ai/site) 는 Tensorboard와 같이 log를 보기 쉽게 시각화해주는 툴입니다.  
Tensorflow, PyTorch, transformers, PyTorch-Lightning 등 다양한 프레임워크와 함께 사용 가능한 것이 특징입니다.  
  
## Installation
  
- Command
  
`wandb`는 pip으로 손쉽게 설치 가능합니다.
  
```
$ pip install wandb
```  
  
## Login
    
`wandb`를 사용하기 위해서는 wandb 아이디로 로그인을 해주어야 합니다.  
웹사이트 기반으로 로그가 관리되기 때문입니다.  
회원가입을 해야한다는 불편함이 있지만 진행한 프로젝트들 로그가 한 아이디에서 관리된다는 장점도 있습니다.  
  
```
$ wandb login
wandb: You can find your API key in your browser here: https://app.wandb.ai/authorize
wandb: Paste an API key from your profile and hit enter:
```
  
위와 같이 `wandb login` 명령어를 실행하면 login을 위한 API Key를 입력하라고 나옵니다.  
해당 링크를 타고 들어가면 API Key를 받을 수 있습니다. (ID가 없다면 회원가입을 하고 진행하시면 됩니다.)  
  
## Usage
  
`wandb`는 다음과 같이 쉽게 사용 가능합니다.  
  
- PyTorch
  
```python
import wandb

# 1. Start a new run
wandb.init(project="gpt-3")

# 2. Save model inputs and hyperparameters
config = wandb.config
config.learning_rate = 0.01

# 3. Log gradients and model parameters
wandb.watch(model)

for batch_idx, (data, target) in enumerate(train_loader):
    if batch_idx % args.log_interval == 0:
        # 4. Log metrics to visualize performance
        wandb.log({"loss": loss})
``` 
  
- Huggingface
  
```python
# 1. Import wandb and login
import wandb

wandb.login()

# 2. Define which wandb project to log to and name your run
wandb.init(project="gpt-3", run_name='gpt-3-base-high-lr')

# 3. Add wandb in your Hugging Face `TrainingArguments`
args = TrainingArguments(... , report_to='wandb')

# 4. W&B logging will begin automatically when your start training your Trainer
trainer = Trainer(... , args=args)
trainer.train()
```
  
- Tensorflow
  
```python
import wandb

# 1. Start a W&B run
wandb.init(project='gpt3')

# 2. Save model inputs and hyperparameters
config = wandb.config
config.learning_rate = 0.01

# Model training here
# 3. Log metrics over time to visualize performance
with tf.Session() as sess:

# ...
wandb.tensorflow.log(tf.summary.merge_all())
```
  
- PyTorch Lightning
  
```python
from pytorch_lightning.loggers import WandbLogger  # newline 1
from pytorch_lightning import Trainer

wandb_logger = WandbLogger()  # newline 2
trainer = Trainer(logger=wandb_logger)
```