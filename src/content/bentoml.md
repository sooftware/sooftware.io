---
title: 'BentoML'
author: [Soohwan Kim]
tags: [toolkit]
image: img/bentoml.png
date: '2021-09-28T10:00:00.000Z'
draft: false
---

# BentoML

Machine Learning Serving 라이브러리인 BentoML 사용방법에 대해 정리합니다.

![image](https://user-images.githubusercontent.com/54731898/134802579-71c3c3d6-bb96-431a-80fd-ab13595c80d4.png)


## 주요 특징
- Online / Offline Serving
- Flask 기반 모델보다 100배의 처리량을 가지고, Adaptive Micro Batching 메커니즘을 활용
- 모델 관리를 위한 웹 대시보드 존재
- 정말 많은 ML 프레임워크를 지원함(transformers, pytorch-lightning도 지원)

❓ **Online Serving 이란?**
- Online Serving은 API 서빙, 실시간 요청에 따른 반응을 합니다.
- Batch 처리가 불가능하고, 동시 여러 요청에 대한 확장 대책이 필요하다.

❓ **Offline Serving 이란?**
- 특정 주기로 서빙 하는 것을 말한다.
- Batch로 많은 양을 한꺼번에 처리한다.

❓ **Adaptive Micro Batching 이란?**
- 모델 서빙시 개별 추론 요청을 조절할 수 있는 작은 배치 단위로 처리하는 것.
- BentoML은 HTTP 처리 데이터 처리과정까지 Micro batching 지원을 한다.
- 최대 배치 사이즈와 인퍼런스의 latency 제한을 설정할 수 있다.
![image](https://user-images.githubusercontent.com/54731898/134803241-893745bf-191b-47ec-9faa-a54c87c71ab7.png)

그림과 같이 request가 들어올 때 request을 하나씩 처리하는 것이 아니라 여러 개를 한번에 처리하여 응답하고 있는 것을 확인할 수 있다.  
이는 지정한 latency를 넘지 않는 선에서 request들을 합해서 배치 처리한다.  
이후 API로 오는 request는 다음 micro Batch로 받아서 배치간은 비동기식 처리를 진행한다.  
  
`bentoml.api(mb_max_batch_size=1000, mb_max_latency=10000)` 함수를 사용해서 최대 배치 사이즈와 인퍼런스의 latency 제한을 설정할 수 있다.  
위의 값은 디폴트 값이고 latency 단위는 milliseconds이다.  

 
## 설치
```
pip install bentoml
```

## 사용 방법
1. 모델 학습
2. Prediction Service Class 생성
3. Prediction Service에 학습한 모델 저장
4. Serving
5. Prediction Request



### 1. 모델 학습
예시는 transformers 프레임워크를 통해 gpt2 모델을 사용합니다.
코드를 main.py로 저장
```python
from transformers import AutoModelWithLMHead, AutoTokenizer

model_name = "gpt2"
model = AutoModelWithLMHead.from_pretrained("gpt2")
tokenizer = AutoTokenizer.from_pretrained("gpt2")
```

### 2. Prediction Service Class 생성
코드를 gpt.py로 저장
```python
import bentoml
from bentoml.adapters import JsonInput
from bentoml.frameworks.transformers import TransformersModelArtifact


@bentoml.env(pip_packages=["transformers==3.1.0", "torch==1.6.0"])
@bentoml.artifacts([TransformersModelArtifact("gptModel")])
class TransformerService(bentoml.BentoService):
    @bentoml.api(input=JsonInput(), batch=False)
    def predict(self, parsed_json):
        src_text = parsed_json.get("text")

        model = self.artifacts.gptModel.get("model")
        tokenizer = self.artifacts.gptModel.get("tokenizer")

        input_ids = tokenizer.encode(src_text, return_tensors="pt")

        output = model.generate(input_ids, max_length=50)
        output = tokenizer.decode(output[0], skip_special_tokens=True)

        return output
```

- BentoService Class를 상속하여 Prediction Service Class를 생성함.  
- `@api` 데코레이터를 통해 API의 input, output, batch 유무 등을 설정할 수 있음.  
- `@artifacts` 데코레이터에서는 BentoML에서 미리 만든 Artifact를 사용함. `transformers` 프레임워크는 `TransformersModelArtifact`, `Scikit-Learn` 프레임워크는 `SklearnModelArtifact`처럼 프레임워크마다 있다.  
`TransformersModelArtifact("gptModel")` 여기서 ‘gptModel’은 Prediction Service Class에서 부를 이름, 3번 main.py에서도 "gptModel"로 pack하는 것을 볼 수 있다.   
- `@env` 데코레이터를 통해 환경설정을 한다. `env(pip_packages=["transformers==3.1.0", "torch==1.6.0"])`로 패키지 버전을 명시해줄 수도 있고, `@env(infer_pip_packages=True)`로 요구되는 pip dependencies와 버전을 자동적으로 찾게 할 수도 있다. 이를 통해 requirements.txt를 생성해준다. 이외에도 conda/Docker를 활용 할 수도 있다.   
  

### 3. Prediction Service에 학습한 모델 저장
1번에 main.py에 코드 추가.
```python
from transformers import AutoModelWithLMHead, AutoTokenizer
from gpt import TransformerService


model_name = "gpt2"
model = AutoModelWithLMHead.from_pretrained("gpt2")
tokenizer = AutoTokenizer.from_pretrained("gpt2")

service = TransformerService()

artifact = {"model": model, "tokenizer": tokenizer}
service.pack("gptModel", artifact)

saved_path = service.save()
```

- main.py 스크립트 실행
```
python main.py
```

- 실행하면 다음과 같은 메세지가 출력됨
```
[2021-09-26 17:45:55,819] INFO - BentoService bundle 'TransformerService:20210926174550_16DCF9' saved to: C:\Users\sangchun\bentoml\repository\TransformerService\20210926174550_16DCF9
```

bentoml 폴더에 가면 logs, repository 폴더가 생성된다.  
repository로 가면 Prediction Service Class 이름인 TransformerService로 폴더가 있고 안에 Dockerfile, requirements.txt 등이 저장되어있다.  
  
<br>

![image](https://user-images.githubusercontent.com/54731898/134807019-3104f46d-100f-40ea-9342-5cc50c3c4d6f.png)


## 4. Serving
```
bentoml serve TransformerService:latest
```
![image](https://user-images.githubusercontent.com/54731898/134807518-c774b014-567f-4288-a782-fd3fc41677f9.png)  
localhost:5000으로 접근하면 Swagger UI를 확인할 수 있음.


## 5. Prediction Request

1) curl command 사용
```
curl -i \
  --header "Content-Type: application/json" \
  --request POST \
  --data '{"text": "my name is"}' \
  http://localhost:5000/predict
```

2) python requests 라이브러리 사용
```python
import requests
response = requests.post("http://127.0.0.1:5000/predict", json={"text": "my name is"})
print(response.text)
```
![image](https://user-images.githubusercontent.com/54731898/134807328-274b1f43-e9b5-499e-9f76-ea01293ba233.png)

3) browser에서 직접 Prediction  
![image](https://user-images.githubusercontent.com/54731898/134808135-97bdcb96-f315-45a0-9f84-ff14441b71a5.png)
![image](https://user-images.githubusercontent.com/54731898/134808208-ba93182c-b377-4317-a824-db858aad017e.png)

  
<br>
  
<br>


## Yatai 서버
**BentoML**에서는 model serving api만 제공하는 것이 아니라 BentoML에서 실행되는 각종 모델들을 관리해주는 **Yatai** 서비스도 지원한다.

Yatai는 Model Management Component로 Repository에 저장된 모델, 배포된 모델을 보여준다.

```
bentoml yatai-service-start
```  
  
Docker로 실행하려면
```
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v ~/bentoml:/bentoml \
  -p 3000:3000 \
  -p 50051:50051 \
  bentoml/yatai-service:latest
```

localhost:3000에 접근하면 저장된 모델을 확인할 수 있다.

![image](https://user-images.githubusercontent.com/54731898/134808309-a2caa51b-0912-4097-b175-1c51fce11391.png)

Detail을 클릭하면 세부 내용이 나온다.

  
<br>

![image](https://user-images.githubusercontent.com/54731898/134807943-c0208f0f-3e45-40f2-9b5c-95cc41611d8a.png)
  
이렇게 Yatai를 이용하면 모델을 web UI로 쉽게 관리할 수 있다.
