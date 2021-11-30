---
title: 'Docker란?'
author: [Soohwan Kim]
tags: [toolkit, environment]
image: img/docker.png
date: '2021-10-09T10:00:00.000Z'
draft: false
---

# Docker 란? 
도커는 컨테이너 기반의 오픈소스 가상화 플랫폼입니다. 배가 물건을 컨테이너에 넣어 운반하는 것처럼, 도커도 여러 가지 원하는 프로그램들을 컨테이너에 넣어 배포할 수 있다는 점이 비슷합니다.   

<img src="https://user-images.githubusercontent.com/54731898/136175057-671761a9-710d-4c86-a001-02fa7b6ad754.png" width="600"> 

#  Docker 주요 개념
## 1. 이미지(Image)

![1](https://user-images.githubusercontent.com/54731898/136189202-23a30f1d-0668-4f13-ba36-02a88c22413e.PNG)
사진은 [Docker hub](https://hub.docker.com/)에서 가져온 사진입니다.   
위의 사진에 있는 것처럼 각각 하나의 프로그램을 **이미지**라고 부릅니다.  

이미지는 컨테이너 실행에 필요한 파일과 설정 값 등을 포함하고 있고 변하지 않습니다. 즉, 같은 이미지로 여러 개의 컨테이너를 생성할 수 있고, 컨테이너의 상태가 바뀌거나 컨테이너가 삭제되더라도 이미지는 변하지 않고 그대로 존재합니다.   
예를 들어, ubuntu 이미지는 ubuntu를 실행하기 위한 모든 파일을 가지고 있고, MySQL 이미지는 debian을 기반으로 MySQL을 실행하는데 필요한 파일과 실행 명령어, 포트 정보 등을 가지고 있습니다.

이러한 Docker 이미지는 [Docker hub](https://hub.docker.com/)에 등록하거나 Docker Registry 저장소를 직접 만들어서 관리할 수 있습니다. 현재 공개된 도커 이미지는 50만개가 넘고, Docker hub의 이미지 다운로드 수는 80억회에 이른다고 합니다.

<br>

❓ **Docker hub 와  Docker Registry 차이점**  
Docker Hub에서는 이미지를 저장하고 관리해줍니다. 그래서 많은 회사들이 Docker로 소프트웨어를 배포하고, 공개된 이미지들을 공유할 수 있습니다.   
GitHub와 동일하게 Docker Hub를 통해 이미지를 pull하여 사용할 수 있습니다.

Docker Registry는 공개된 방식이 아닌 비공개적으로 격리된 사설 저장소입니다.
Docker Registry 관련하여 더 자세한 내용은 [여기](https://www.redhat.com/ko/topics/cloud-native-apps/what-is-a-container-registry)를 참고해주세요.

<br>

## 2. 컨테이너(Container)
도커의 이미지가 실행된 상태입니다. OS를 가상화하는 것이 아니라 프로세스가 격리된 공간에서 동작하는 기술입니다.   
  
### **Virtual Machine**
![2](https://user-images.githubusercontent.com/54731898/136199998-b7459daf-4878-4362-9208-1411b6af2e1e.PNG)  
호스트 OS위에 게스트 OS를 가상화하여 사용하는 방식입니다.   
이 방식은 여러가지 OS를 가상화 할 수 있고 비교적 사용법이 간단하지만 무겁고 느리다는 단점이 있습니다. 왜냐하면 Virtual Machine이 OS를 자체적으로 가지고 있어야해서 용량이 커지기 때문입니다.  
사진에 있는 Hypervisor는 VMware Workstation, Oracle VirtualBox 같은 것들 입니다.


<br>

### **컨테이너(Container)**
![3](https://user-images.githubusercontent.com/54731898/136199993-874fd26a-6b60-45b4-b71d-a486ec473302.PNG)  
OS레벨은 공유하고, 프로세스를 격리 하는 방식입니다.     
즉, 어플리케이션 레벨에서는 각각의 어플리케이션을 격리해서 실행 할 수 있습니다. 그래서 하나의 서버에 여러개의 컨테이너를 실행하면 서로 영향을 미치지 않고 독립적으로 실행할 수 있고, CPU나 메모리는 프로세스가 필요한 만큼만 추가로 사용하기 때문에 성능적으로도  
거의 손실이 없습니다.  
참고로 리눅스에서는 이 방식을 리눅스 컨테이너(LXC)라고 하고 더 자세한 내용은 [여기](https://linuxcontainers.org/)를 참고해주세요.    
 
<br>


# Docker 설치
- [Window10](https://goddaehee.tistory.com/251)
- [Mac](https://kplog.tistory.com/288)
- [Linux](https://khj93.tistory.com/entry/Docker-Docker-%EC%84%A4%EC%B9%98%EB%B6%80%ED%84%B0-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%8B%A4%ED%96%89%EA%B9%8C%EC%A7%80-%EA%B8%B0%EB%B3%B8-%EC%82%AC%EC%9A%A9%EB%B2%95)

<br>

#  Docker 사용 방법
![4](https://user-images.githubusercontent.com/54731898/136222615-1d1c44ff-a0fe-412c-89cb-79a5a552f233.PNG)
### 1. Image를 Docker hub에서 받아서 컨테이너 생성  
#### Docker Image Pull 받기
```
$ docker pull [Image Name]
```
pytorch_lightning 같은 경우는 ```docker pull pytorchlightning/pytorch_lightning``` 입니다.  
Docker image는 [Docker Hub](https://hub.docker.com/)에서 확인할 수 있고, version 명시가 없을시 latest(최신버전)으로 pull 됩니다.  

<br>

 ![image](https://user-images.githubusercontent.com/54731898/136233888-04cd5df2-6d50-4a01-8c26-fa78e08f714c.png)  

<br>

 사실 run 명령어를 실행했을 때 사용할 이미지가 저장되어 있지 않다면 다운로드(pull)를 한 후, 컨테이너를 생성(create)하고 시작(start)됩니다. 그러면 언제 pull을 사용하는 것일까요?    
 git과 동일하게 최신 버전으로 다시 받을 때 사용합니다.    
 
<br>

### Docker Image list 확인
```
$ docker images


REPOSITORY        TAG                           IMAGE ID       CREATED        SIZE
ubuntu            16.04                         b6f507652425   5 weeks ago    135MB
pytorch/pytorch   1.7.1-cuda11.0-cudnn8-devel   7554ac65eba5   8 months ago   12.9GB
```

### Docker Image 삭제하기
```
$ docker rmi [IMAGE_ID]
```
 
### 컨테이너 실행하기
도커를 실행하는 명령어는 다음과 같습니다.  
```
$ docker run [OPTIONS] [IMAGE] [COMMAND] [ARGS]
```

<br>

**자주 사용하는 옵션들**  
![image](https://user-images.githubusercontent.com/54731898/136239050-c82f7b42-8199-4a95-80c5-1a7657b4ab12.png)    

<br>

```
$ docker run ubuntu:16.04
 
Unable to find image 'ubuntu:16.04' locally
16.04: Pulling from library/ubuntu
58690f9b18fc: Pull complete
b51569e7c507: Pull complete
da8ef40b9eca: Pull complete
fb15d46c38dc: Pull complete
Digest: sha256:454054f5bbd571b088db25b662099c6c7b3f0cb78536a2077d54adc48f00cd68
Status: Downloaded newer image for ubuntu:16.04
```

이렇게 컨테이너를 생성하고 ubuntu:16.04 이미지가 없으면 자동적으로 다운로드(pull)를 하고 컨테이너를 생성합니다. 하지만 컨테이너에 명령어를 전달하지 않았기 때문에 컨테이너는 생성되자마자 종료됩니다.  
왜냐하면 컨테이너는 프로세스이기 때문에, 실행중인 프로세스가 없으면 컨테이너는 종료됩니다.  

<br>

```
$ docker run --rm -it ubuntu:16.04 /bin/bash
```
이번에는 컨테이너 내부에 들어가기 위해 bash 쉘을 실행하고 키보드 입력을 위해 -it 옵션을 주고, 프로세스가 종료되면 컨테이너가 자동으로 삭제되도록 --rm 옵션도 추가해서 실행하였습니다.  
다운로드가 되어있기 때문에 이미지를 다운로드 하는 화면 없이 바로 실행이 되고, exit로 bash 쉘을 종료하면 컨테이너도 같이 종료됩니다.  

<br>

### 컨테이너 목록 확인하기
```
$ docker ps       # 실행중인 컨테이너 목록

CONTAINER ID   IMAGE          COMMAND       CREATED          STATUS         PORTS     NAMES
c818c8466c46   ubuntu:16.04   "/bin/bash"   35 seconds ago   Up 4 seconds             kind_rosalind

<br>

$ docker ps -a    # 실행중인 컨테이너와 종료된 컨테이너 목록

CONTAINER ID   IMAGE                                         COMMAND       CREATED          STATUS                       PORTS     NAMES
c818c8466c46   ubuntu:16.04                                  "/bin/bash"   42 seconds ago   Up 11 seconds                          kind_rosalind
33db0c9e3d20   pytorch/pytorch:1.7.1-cuda11.0-cudnn8-devel   "/bin/bash"   18 minutes ago   Exited (130) 4 minutes ago             patrick
```

<br>

### 컨테이너 중지하기
```
$ docker stop [CONTAINER_ID]
```

### 컨테이너 제거하기
```
$ docker rm [CONTAINER_ID]
$ docker rm -v $(docker ps -a -q -f status=exited)  # 중지된 컨테이너 한번에 삭제
```

### 컨테이너 명령어 실행하기
```
$ docker exec [OPTIONS] [CONTAINER_ID] [COMMAND] [ARGS]
$ docker exec -it [CONTAINER_ID] /bin/bash 
```
run은 컨테이너를 새로 만들어서 실행하고, exec는 실행중인 컨테이너에 명령어를 내린다는 차이점이 있습니다.
그래서 run일 때 [IMAGE] 였던 것이 [CONTAINER_ID]로 바꼈습니다.

<br>

## Docker Compose
지금까지는 도커를 커맨드라인에서 명령어로만 작업을 하였습니다. 지금은 간단한 작업이였지만, 여러 가지 설정이 추가되면 명령어가 금방 복잡해질 것 입니다.  
도커는 복잡한 설정을 쉽게 관리하기 위해 YAML방식의 설정파일을 이용한 [Docker Compose](https://docs.docker.com/compose/)라는 툴을 제공합니다.  

<br>

### 설치
Mac에서 Docker for Mac, Window에서 Docker for Windows를 설치했다면 자동으로 설치가 되고 리눅스의 경우에는 다음 명령어를 입력하여 설치하면 됩니다.
```
$ curl -L "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ chmod +x /usr/local/bin/docker-compose

$ docker-compose version  

docker-compose version 1.9.0, build 2585387
docker-py version: 1.10.6
CPython version: 2.7.9
OpenSSL version: OpenSSL 1.0.1t  3 May 2016
```

<br>

### 사용 방법
```
$ vi docker-compose.yaml

version: '3.5'  # YAML 파일 포맷 버전
services:
  patrick:  # 이름
    image: 'pytorch/pytorch:1.7.1-cuda11.0-cudnn8-devel'
    shm_size: '2gb'
    command: 'nvidia-smi'   # 컨테이너가 실행될 때 수행할 명령어, docker run에 있는 command와 동일
    runtime: nvidia
    volumes:
      - /home/patrick/:/home
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
```

```
docker-compose up
```

<br>

### 정리
Huggingface transformers에서 모델을 쉽게 다운받아 사용할 수 있는 것처럼, docker도 hub에서 image를 쉽게 다운 받아 사용할 수 있습니다.  


<br>

## 2. Image를 직접 만들어서 컨테이너 생성  
Dockerfile이라는 파일 자체 DSL(Domain-specific language)을 이용하여 이미지를 생성합니다.  

<br>


### Dockerfile에 작성되는 명령 옵션
```
FROM : Docker Base Image (기반이 되는 이미지, <이미지 이름>:<태그> 형식으로 설정, ubuntu:18.04)
MAINTAINER : 메인테이너 정보 (작성자 정보)
RUN : Shell Script 또는 명령을 실행
CMD : 컨테이너가 시작될 때마다 실행할 명령어, Dockerfile에서 한번만 사용할 수 있습니다.
LABEL : 라벨 작성 (docker inspect 명령으로 label을 확인할 수 있습니다.)
EXPOSE : 호스트와 연결할 포트 번호를 설정한다.
ENV : 환경변수 설정
ADD : 파일 / 디렉터리 추가
COPY : 파일 복사
ENTRYPOINT : 컨테이너가 시작되었을 때 스크립트 실행
VOLUME : 볼륨 마운트
USER : 명령 실행할 사용자 권한 지정
WORKDIR : "RUN", "CMD", "ENTRYPOINT" 명령이 실행될 작업 디렉터리
ARG : Dockerfile 내부 변수
ONBUILD : 다른 이미지의 Base Image로 쓰이는 경우 실행될 명령 수행
SHELL : Default Shell 지정
```
### 1) Dockerfile 작성
```
$ vi Dockerfile
 
# 1. 우분투 설치
FROM ubuntu:18.04
# 2. 메타데이터 표시
LABEL "purpose"="practice"
# 3. 업데이트
RUN apt-get update
# 4. 호스트에 있는 파일을 복사
COPY test.txt /var/www/html
# 5. 포트 80번 노출 지정
EXPOSE 80
# 6. 컨테이너 시작될 때마다 실행할 명령어
CMD /bin/bash
```

### 2) Dockerfile 빌드(이미지 생성)
```
$ docker build -t mybuild:0.2 ./test_docker

Sending build context to Docker daemon  3.072kB
Step 1/6 : FROM ubuntu:18.04
 ---> 5a214d77f5d7
Step 2/6 : LABEL "purpose"="practice"
 ---> Using cache
 ---> 29c3986addc2
Step 3/6 : RUN apt-get update
 ---> Using cache
 ---> fa3808d331d9
Step 4/6 : COPY test.txt /var/www/html/
 ---> f1430498cfa9
Step 5/6 : EXPOSE 80
 ---> Running in 3cda5f1355bf
Removing intermediate container 3cda5f1355bf
 ---> c3936aca4620
Step 6/6 : CMD /bin/bash
 ---> Running in 4ac0bfe9d777
Removing intermediate container 4ac0bfe9d777
 ---> c789deea53d4
Successfully built c789deea53d4
Successfully tagged mybuild:0.2
```

```
$ docker images

REPOSITORY        TAG                           IMAGE ID       CREATED          SIZE
mybuild           0.2                           c789deea53d4   59 seconds ago   101MB
ubuntu            18.04                         5a214d77f5d7   5 days ago       63.1MB
ubuntu            16.04                         b6f507652425   5 weeks ago      135MB
pytorch/pytorch   1.7.1-cuda11.0-cudnn8-devel   7554ac65eba5   8 months ago     12.9GB
```

### 3) 컨테이너 실행
 
```
$ docker run -it --name patrick_build mybuild:0.2
```

```
$ docker ps -a

CONTAINER ID   IMAGE                                         COMMAND                  CREATED              STATUS                            PORTS     NAMES
8cd50c3112cc   mybuild:0.2                                   "/bin/sh -c /bin/bash"   About a minute ago   Exited (127) About a minute ago             patrick_build
c818c8466c46   ubuntu:16.04                                  "/bin/bash"              52 minutes ago       Up 51 minutes                               kind_rosalind
33db0c9e3d20   pytorch/pytorch:1.7.1-cuda11.0-cudnn8-devel   "/bin/bash"              About an hour ago    Exited (130) 56 minutes ago                 patrick
```


 
 
## Reference
- https://docs.docker.com/get-started/overview/
- https://hub.docker.com
- https://linuxcontainers.org/
