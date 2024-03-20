---
title: Terabyte(TB) 단위 데이터 셔플링 - terashuf
author:
  - Soohwan Kim
tags:
  - toolkit
  - environment
image: img/terashuf.png
date: 2024-03-20T10:00:00.000Z
draft: false
---
# Terabyte(TB) 단위 데이터 셔플링 - terashuf  
  
리눅스에서 TB 단위의 데이터를 line 기준으로 셔플링이 필요할 때가 (가끔) 있다. 직접 코딩해서 쓰기에는 메모리, 속도 등을 신경써야해서 생각보다 큰 작업인데, [**terashuf**](https://github.com/alexandres/terashuf) 라는 오픈소스가 있어서 사용해봤더니, 작동도 잘 되고 속도도 빠르다! 👍
  
## Terashuf

- **Installation**

```
$ cd $BASE_DIR
$ git clone https://github.com/alexandres/terashuf.git
$ cd terashuf
$ make
```

- **Usage**

```
$ export TMPDIR=/path/to/large/directory ./terashuf < filetoshuffle.txt > shuffled.txt
```

## Reference
- https://github.com/alexandres/terashuf