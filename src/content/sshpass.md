---
title: 'sshpass'
author: [Soohwan Kim]
tags: [toolkit]
image: img/sshpass.png
date: '2023-05-13T10:00:00.000Z'
draft: false
---

## Sshpass
   
원격 서버에 접속하거나 파일을 주고 받을 때 `ssh`나 `scp` 명령어로 처리할 일이 많은데, 
패스워드를 필요로 하는 원격 서버의 경우 매번 패스워드를 넣어줘야 하는 불편함이 있다.  
  
자주 쓰는 서버의 경우 쉘스크립트로 하나 정의해두고 `./server.sh` 이런 식으로 사용을 하곤 하는데, 
매번 메모장에 있는 패스워드를 치기가 꽤 귀찮아서 방법을 찾았다.  
  
### Install
  
맥북에서는 homebrew를 이용하면 쉽게 설치가 가능하다.  
  
```
brew install hudochenkov/sshpass/sshpass
```
  
### Usage
  
- 접속
    
```
sshpass -p $PASSWORD ssh -p $PORT $ID@$IP
```
  
- 파일 전송
  
```
sshpass -p $PASSWORD scp -r -P $PORT \
$LOCAL_PATH \
$SERVER_PATH
```