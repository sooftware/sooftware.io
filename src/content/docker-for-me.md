---
title: 'Docker - 공유 디렉토리 연결 (mount)'
author: [Soohwan Kim]
tags: [toolkit, environment]
image: img/docker.png
date: '2023-03-14T10:00:00.000Z'
draft: false
---

# Docker - 공유 디렉토리 연결 (mount)
  
도커를 쓰다보면 코드상에서 뭔가를 저장한다거나 어떤 데이터를 읽어와야 한다던가 하는 
상황이 있는데, 이때 공유 디렉토리를 연결해서 run하면 편하다.  
  
`-v`나 `-volume` 옵션을 이용하면 쉽게 가능하다.
  
```
$ docker run -it -v $HOST_SYSTEM_DIR:$CONTAINER_DIR $IMAGE_NAME
```
  
