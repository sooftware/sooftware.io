---
title: 'Docker - GPU 할당'
author: [Soohwan Kim]
tags: [toolkit, environment]
image: img/docker_gpu.png
date: '2023-03-25T10:00:00.000Z'
draft: false
---

# Docker - GPU 할당
  
도커에서 GPU를 할당하는 방법
  
```
$ docker run -it --runtime=nvidia -e NVIDIA_VISIBLE_DEVICES=1,2,3 $IMAGE_NAME
```
  
