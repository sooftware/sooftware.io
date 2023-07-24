---
layout: post
title: 'Sooftware Serving - Huggingface Optimum'
author: [Soohwan Kim]
tags: ['huggingface', 'nlp', 'serving']
image: img/optimum.png
date: '2022-10-05T15:11:55.000Z'
draft: false
---

# Sooftware Serving - Huggingface Optimum  
  
허깅페이스에서 나온 Transformers의 Extension 라이브러리이다. 목적은 모델 학습 및 인퍼런스를 더욱 빠르게 해주기 위한 라이브러리이다. 
  
## Exporting Transformers models to ONNX
  
모델 서빙을 위해서는 많이들 Transformers 모델을 ONNX로 컨버팅하곤 한다.  
ONNX(Open Neural Network Exchange)는 쉽게 말하면, Tensorflow, PyTorch와 같이 서로 다른 딥러닝 프레임워크 환경에서 만들어진 모델들을 
서로 호환해서 사용할 수 있도록 도와주는 오픈소스이다.  
  
원래 Transformers 모델을 ONNX로 모델로 컨버팅하는게 마냥 간단하지만은 않았는데, 이 Optimum 라이브러리로 아래 코드로 쉽게 컨버팅 가능해졌다. 
아마 Optimum을 가장 많이 쓰게되는 이유일 것 같다.  
  
```python
from optimum.onnxruntime import ORTModelForSequenceClassification

pretrain_model_name_or_path = "pretrain_model_name_or_path"
save_directory = "tmp/onnx/"

# Load a model from transformers and export it to ONNX
ort_model = ORTModelForSequenceClassification.from_pretrained(pretrain_model_name_or_path, from_transformers=True)

# Save the onnx model
ort_model.save_pretrained(save_directory)
```
  
## Quantization
  
Model Quantization도 이 라이브러리로 쉽게 가능하다! Huggingface 만세!  
  
```python
from optimum.onnxruntime.configuration import AutoQuantizationConfig
from optimum.onnxruntime import ORTQuantizer

# Define the quantization methodology
qconfig = AutoQuantizationConfig.arm64(is_static=False, per_channel=False)
quantizer = ORTQuantizer.from_pretrained(ort_model)

# Apply dynamic quantization on the model
quantizer.quantize(save_dir=save_directory, quantization_config=qconfig)
```
  
### Example of how to load an ONNX Runtime model and generate predictions with Optimum 🤗:  
  
```python
from optimum.onnxruntime import ORTModelForSequenceClassification
from transformers import pipeline, AutoTokenizer

model = ORTModelForSequenceClassification.from_pretrained(save_directory, file_name="model_quantized.onnx")
tokenizer = AutoTokenizer.from_pretrained(save_directory)

cls_pipeline = pipeline("text-classification", model=model, tokenizer=tokenizer)

results = cls_pipeline("I love burritos!")
```
  
## Graph Optimization
  
Graph Optimization을 통해 모델 인퍼런스를 더욱 빠르게도 가능하다.  
  
```python
from optimum.onnxruntime import ORTModelForSequenceClassification, ORTOptimizer

ort_model = ORTModelForSequenceClassification.from_pretrained(pretrain_model_name_or_path, from_transformers=True)
optimizer = ORTOptimizer.from_pretrained(ort_model)

# Optimize the model
optimizer.optimize(save_dir=save_directory, optimization_config=optimization_config)
```
  
이렇게 라이브러리를 통해 간단하게, Quantization, Optimization이 가능해졌다. 정말 가뭄의 단비같은 라이브러리다.  
  
## Training
  
인퍼런스 용도 외에도, ONNX를 이용하여 학습에도 적용 가능하다고 한다. 개인적으로는 Transformers에서 제공하는 Trainer를 잘 
사용하진 않는데, Transformers의 Trainer를 사용하는 코드라면 적용해보고 학습 속도를 비교해보고 싶다.
  
<img width="440" alt="image" src="https://user-images.githubusercontent.com/42150335/193879406-6b86724b-98de-4bf0-8346-33cd497d82ac.png">

  
### Reference
- Optimum github: https://github.com/huggingface/optimum
- ONNX: https://github.com/onnx/onnx
  
