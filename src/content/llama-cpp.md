---
layout: post
title: llama.cpp (On device llm inference tool)
image: img/llama-cpp.png
author:
  - Soohwan Kim
date: 2024-09-07T10:00:00.000Z
tags:
  - toolkit
  - llama
  - parallelism
  - ondevice
excerpt:
---

# llama.cpp (On device llm inference tool)

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiULtz3uHsF-6HAuU2sAyxlSxP7jRAuNndVA&s" width=400>

최근에 [llama.cpp](https://github.com/ggerganov/llama.cpp)를 사용해봤는데, 상당히 편리하고 미래에 더 많이 쓰일 툴이라는 생각이 들어서 기록해둔다!  

## llama.cpp란?  

대표적인 오픈소스 LLM인 Meta의 llama에서 이름을 따온 이 라이브러리는 llama에만 종속되는게 아닌 오픈소스 LLM들을 순수 C/C++로만 인퍼런스 가능하게 해주는 툴이다. 일반적으로 AI 모델들은 대부분 Python 기반으로 작동하기 때문에 온디바이스 상에서 LLM 구동을 위해서는 제약이 꽤 있는 편이다.  

<img src="https://files.oaiusercontent.com/file-QBBL4OkB96dBuJBvVJu3gVfj?se=2024-09-07T11%3A06%3A10Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D1edcdf1c-53f6-4c76-8b6d-56982f1df0fc.webp&sig=c78xpwKgJwMiqmfwTKsRXTcQv4HQ5jMTO4raNDtKTOE%3D" width=350>

일반적인 리눅스 기반 서버에서는 쉽게 사용 가능한 PyTorch, Hugginface Transformers 등을 온디바이스 상에서 구동하려면 라이브러리 단에서 제공되는 API도 한정적일 뿐더러 연산 대부분이 GPU에 맞춰져 있기 때문에 파이썬 기반으로 llm을 온비다이스에서 구동하기란 상당히 어려운 일이다. (매우 큰 프로젝트가 될 것)

이러한 문제를 해결하기 위해 llama.cpp는 순수 C/C++ 기반으로 LLM 구동을 가능하게 하며, CUDA/ARM/Android/Vulkan 등 여러 하드웨어 기반으로 돌아갈 수 있도록 하는 프로젝트다!  

## llama.cpp 사용법

<img src="https://files.oaiusercontent.com/file-dD3Lc5jvqEkZD0U5KykwtBBQ?se=2024-09-07T11%3A14%3A37Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D972ee912-9ebb-4b5b-b59a-67519ba8660c.webp&sig=5Odwmzh9WrwXBiQfFySwrRziIsfiuKhTYQ1wLWu8lWI%3D" width=400>
  
그럼 llama.cpp 사용법을 살펴보자!
  
### Build llama.cpp 
  
어떤 환경에서 사용하는지에 따라 빌드 방법이 다르기 때문에 [llama.cpp의 공식 How to build 도큐먼트](https://github.com/ggerganov/llama.cpp/blob/master/docs/build.md)를 살펴보는걸 추천한다. 여기서는 linux or Mac 환경에서의 빌드 방법만 다루겠다.

```
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
```

- Using make (linux or Mac)

```
make
```

- Using CMake

```
cmake -B build
cmake --build build --config Release
```

### Download Huggingface Model

프로젝트 build가 되었으면 사용할 허깅페이스 모델을 로컬에 다운받아 놓는다. 여기서 주의할 점은 llama.cpp는 아직 현재진행형 프로젝트이기 때문에 **일부 모델들만 지원**한다는 점이다. llama.cpp의 README.md를 참고하여 내가 사용하려는 모델을 지원하는지를 먼저 꼭 체크해봐야 한다.

```python
from transformers import AutoTokenizer, AutoModelForCausalLM

HF_REPO_NAME = "HF_REPO_NAME"

tokenizer = AutoTokenizer.from_pretrained("HF_REPO_NAME")
model = AutoModelForCausalLM.from_pretrained("HF_REPO_NAME")

tokenizer.save_pretrained('hf_model')
model.save_pretrained('hf_mode')
```

### Convert Huggingface to gguf Format
  
허깅페이스 포맷의 모델을 다운로드 했으면, 이제 llama.cpp 구동 포맷인 `gguf` 포맷으로 모델을 변환해야한다.  
모델 변환을 하는 파일은 `convert_hf_to_gguf.py` 파일을 실행하면 되는데, 기본적으로 지원이 되는 모델이 아니라면 `convert_hf_to_gguf_update.py` 파일을 한 번 수정 & 실행해준 뒤에 모델을 변환해야한다.  

`convert_hf_to_gguf_update.py`의 [`models` 변수가 선언된 부분](https://github.com/ggerganov/llama.cpp/blob/947538acb8617756a092042ff7e58db18dde05ec/convert_hf_to_gguf_update.py#L66C1-L66C7)에 변환하려는 모델을 추가해주어야한다.   

```python
{"name": "exaone",         "tokt": TOKENIZER_TYPE.BPE, "repo": "https://huggingface.co/LGAI-EXAONE/EXAONE-3.0-7.8B-Instruct", },
]
```

위와 같은 형식으로 토크나이저가 BPE인지 SPM(sentencepiece)인지를 표시하고 허깅페이스 레포 주소를 기록한 뒤 아래 커맨드를 실행하면 된다.

```bash
$ python3 convert_hf_to_gguf_update.py $HF_TOKEN
```

이 파일은 `convert_hf_to_gguf`의 `get_base_vocab_pre`라는 메서드를 생성하는 역할을 한다. 해당 과정이 잘 됐으면 `convert_hf_to_gguf` 파일을 실행하면 된다!

```bash
$ python3 convert_hf_to_gguf.py --outfile models/llama-cpp-model.gguf --outtype bf16 --model hf_model
```

### Run

프로젝트 빌드 & 모델 변환까지 잘 되었으면 아래 명령어를 실행해서 `-p` 옵션으로 준 프롬프트에 대해서 모델이 뒤이어서 잘 생성하는지를 확인하면 된다.

```bash
./build/bin/llama-cli -m your_model.gguf -p "I believe the meaning of life is" -n 128

# Output:
# I believe the meaning of life is to find your own truth and to live in accordance with it. For me, this means being true to myself and following my passions, even if they don't align with societal expectations. I think that's what I love about yoga – it's not just a physical practice, but a spiritual one too. It's about connecting with yourself, listening to your inner voice, and honoring your own unique journey.
```

### llama-server

위 llama-cli는 간단한 테스트를 위한 파일이라면 실제로 API 형태로 사용을 위해서는 `llama-server` 파일을 이용하면 된다. 

```bash
$ ./build/bin/llama-server -m your_model.gguf --port 8080

# Basic web UI can be accessed via browser: http://localhost:8080
```

위 명령어가 잘 실행되었으면 아래 같은 curl 등의 커맨드로 요청을 보내면 된다.

```bash
curl --request POST \
--url http://localhost:8080/completion \
--header "Content-Type: application/json" \
--data '{"prompt": "가나다라마바사아자차카타"," n_predict": -1, "stream": true}'
```

llama-server 실행시 여러 옵션을 활용할 수 있는데, 자세한 내용은 [이 문서](https://github.com/ggerganov/llama.cpp/blob/master/examples/server/README.md)를 살펴보면 된다.

## Android에서 llama.cpp 돌려보기

감사하게도 llama.cpp에서는 Android NDK를 이용한 빌드도 지원해준다.  

관련 문서는 [이 문서](https://github.com/ggerganov/llama.cpp/blob/master/docs/android.md)를 참고하면 된다. 아래 영상은 Pixel 5 폰에서 구동한 llama-2 7B 데모 영상이다.

https://user-images.githubusercontent.com/271616/225014776-1d567049-ad71-4ef2-b050-55b0b3b9274c.mp4