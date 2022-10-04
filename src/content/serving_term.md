---
title: 'Sooftware Serving - Terminology'
author: [Soohwan Kim]
tags: [nlp, serving]
image: img/term.png
date: '2022-10-05T10:00:00.000Z'
draft: false
---

# Sooftware Serving - Terminology 
  
NLP 모델 서빙 관련해서 계속 마주치는 용어들을 정리하는 페이 
  
- `Load Balancer`: 서버에 가해지는 부하(로드)를 분산시켜주는 장치 또는 기술.  
  
<img width="400" alt="image" src="https://user-images.githubusercontent.com/42150335/193868360-da7a4c4c-2a3b-4cd6-ac1b-ee9172451e5b.png">  
    
- `Load Balancing - Round Robin Method`: 서버에 들어온 요청을 순서대로 돌아가며 배정하는 방식
- `Load Balancing - Weighted Round Robin Method`: 각 서버마다 가중치를 매기고 가중치가 높은 서버에 클라이언트 요청을 우선적으로 배분하는 방식
- `Load Balancing - IP Hash Method`: 클라이언트의 IP 주소를 특정 서버로 매핑하여 요청을 처리하는 방식
- `Load Balancing - Least Connection Method`: 요청이 들어온 시점에 가정 적은 연결상태를 보이는 서버에 우선적으로 트래픽을 배분하는 방식
- `Load Balancing - Least Response Time Method`: 서버의 현재 연결 상태와 응답시간을 모두 고려하는 방식. 가장 적은 연결 상태와 가장 짧은 응답시간을 보이는 서버에 우선적으로 배분
  
###  
  
- `Health Check`: 로드밸런싱 서비스를 제공하는 다수의 서버의 상태를 점검하기 위해 사용되는 기술로, 서버의 상태를 주기적으로 체크하여 
서버의 상태가 통신이 불가능할 경우 서버를 서비스에서 제외하여 서비스를 원활하게 제공하기 위해 이용되는 방법
- `Stress Test`:  어플리케이션에 각종 리소스(CPU, RAM, Disk 등)의 허용하는 한도를 넘어서서 비정상적인 높은 부하를 발생시켜보는 테스트. 
한도를 넘어서는 부하가 걸렸을 때의 버그 등을 찾기 위함
- `Load Test`: 적절한 부하를 발생시켜 통계적으로 의미있는 수치를 측정하는 테스트. 1. 장시간 서비스 가능 여부를 확인하는 신뢰성 테스트, 2. 성능 테스트 (Performance Test). 
- `TPS (Transaction Per Second)`: 초당 트랜잭션의 갯수. 서비스 성능의 기준.
- `Saturation Point`: TPS가 더 이상 증가하지 않는 시점.
  
<img width="400" alt="image" src="https://user-images.githubusercontent.com/42150335/193871571-f78af74b-eac1-4381-8dda-e55069a34054.png">
  
###
  
- `WSGI (Web Server Gateway Interface)`: Python 어플리케이션이 웹 서버와 통신하기 위한 인터페이스. 웹 서버에서의 요청을 파싱하여 Python 어플리케이션 쪽으로 넘기는 역할을 수행
- `Uvicorn`: uvloop 및 httptools를 사용하는 *ASGI Web Server
  - `ASGI (Asynchronous Server Gateway Interface)`: 비동기 Python 웹 서버
  - `Asyncio`:  Asyncio는 async / await 구문을 사용하여 비동기(Asynchronous) 코드를 작성하는 라이브러리. **non-blocking**하게 처리함.
  - `uvloop`: asyncio를 대체하기 위해 만들어진 라이브러리. Cython으로 작성되었음. 기타 Python 비동기 프레임워크보다 2배 이상 빠름.
- `Gunicorn`: Python WSGI로 Web Server(Nginx)로부터 요청을 받으면 서버 어플리케이션으로 전달해주는 역할을 수행.  
  
<img width="500" alt="image" src="https://user-images.githubusercontent.com/42150335/193873850-f25635a4-6863-4da9-ad97-7fbcb67c91e6.png">  
  
- `NGINX`: 가벼우면서도 강력한 프로그램을 목표로 개발된 오픈소스 웹 서버 프로그램. Apache보다 동작이 단순하고, 전달자 역할만 하기 때문에 동시접속 처리에 특화되어 있다.