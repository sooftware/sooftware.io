---
title: 'Mac iTerm2 + ZSH 세팅'
author: [Soohwan Kim]
tags: [software, environment]
image: img/iterm_zsh.png
date: '2020-12-02T10:00:00.000Z'
draft: false
---

# Mac iTerm2 + ZSH 세팅    
  
개발환경에서 가장 중요한 소프트웨어 중 하나는 쉘입니다. 어떤 OS에서 작업하냐에 따라서 어떤 쉘을 쓰는지 등이 달라질텐데요, Mac OS에서 가장 많이 사용되는 iTerm2와 ZSH를 설치하는 방법에 대해 포스팅해보겠습니다.  
  
***
    
## iTerm2 설치  
  
[링크](https://iterm2.com/)로 가게 되면 iTerm2를 설치할 수 있습니다. iTerm는 Mac의 기본 터미널보다 좀 더 확장된 기능을 제공해주는 소프트웨어입니다.   
  
***
  
## iTerm2 Color-Scheme 설치  

개인적으로 개발할 때 IDE 혹은 쉘이 이뻐야 개발할 맛이 나서 저는 상당히 신경을 씁니다 ㅎㅎ..  
대표적으로 [링크](https://github.com/mbadolato/iTerm2-Color-Schemes)를 가시면 다양한 Color-Scheme을 다운받으실 수 있습니다.  
  
다운받은 후 iTerm2 > Preference > Profile > colors로 들어가게 되면 아래와 같은 화면을 볼 수 있습니다.  
  
![image1](https://miro.medium.com/max/1126/1*3eqvqUKzz84yJljncRWOAA.png)  
  
Color Presets를 눌러서 임의의 color-scheme을 import 후 설정해주면 됩니다.  
위에 걸어놓은 링크 외에도 iTerm Color Scheme라고만 구글에 쳐도 상당히 많은 수의 테마들이 나오게 됩니다.  
저는 dracula라는 테마를 사용중입니다. dracula 테마는 [링크](https://github.com/dracula/dracula-theme)에서 다운로드 가능합니다. 
  
***
  
## homebrew 설치  
  
기존 리눅스에서의 apt-get과 같은 역할이라고 보시면 됩니다. 여러 소프트웨어를 손쉽게 다운받을 수 있게 해주는 프로그램입니다.  
iTerm2에서 아래 명령어를 실행해주세요.
  
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install.master/install)"
```
    
***
  
## ZSH 설치  
  
제트쉘이라고 불리는 ZSH를 설치합니다. ZSH이란 일반적으로 사용한 쉘 보다 높은 수준의 기능들을 제공해주는 쉘입니다. 기본 쉘은 기능이 제한적이기 때문에 Z Shell을 이용한다면 더 강력하게 사용할 수 있습니다. 여기에 Oh My ZSH를 추가적으로 설치한다면 더 많은 추가기능을 사용할 수 있습니다.  
  
* zsh 설치

```
brew install zsh
```
  
* Oh My ZSH 설치  
  
```
sh -C "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```
  
***

## 기능 설정  
  
여기까지 설치했다면 기본적인 설치는 끝났습니다. 이제 쉘을 더 강력하게 만들기 위해서는 아래 과정을 진행해야 합니다.  
  
***

### agnoster 테마 설치  
  
![agnoster]({{site.baseurl}}/images/agnoster.png)

agnoster 테마는 현재 디렉토리의 Git 상태를 알려줍니다. 현재 마스터브랜치인지 혹은 다른 브랜치인지, 커밋을 했는지 등을 알려줍니다.  
  
### zshrc 파일 수정  
  
아래 명령어로 .zshrc 파일에 진입합니다.   

```
vi ~/.zshrc
```
  
***
    
### agnoster 적용

위쪽에서 10번째쯤 줄에 ZSH_THEME="robyrussell"라고 되어 있는 부분을 ZSH\_THEME="agnoster"로 수정해줍니다.  
  
***

### MacBok-Pro 지우기  
  
아마 따로 설정을 해주지 않으셨다면 위의 이미지와 다르게 쉘에 MacBook-Pro라고 입력란 앞쪽에 떠 있을겁니다. 이 부분이 거슬리는 분들은 zshrc 파일 하단에 아래 내용을 추가해줍니다.  

```
prompt_context() {
  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
    prompt_segment black default "%(!.%{%F{yellow}%}.)$USER"
  fi
}
```
  
***

### New Line 적용
  
터미널에서 작업을 하다보면 경로가 복잡한 경우 이미 많은 텍스트 내용 때문에 명령어를 칠 경우 화면에서 벗어나서 보기 이쁘지 않은 경우가 많습니다. 명령어를 다음 줄에서 입력받도록 해주는 New Line을 적용해보겠습니다.  
  
```
build_prompt() {
  RETVAL=$?
  prompt_status
  prompt_virtualenv
  prompt_context
  prompt_dir
  prompt_git
  prompt_bzr
  prompt_hg
  prompt_newline //이부분을 추가 꼭 순서 지켜서
  prompt_end
}
```

zshrc 파일에서 build_prompt를 찾아 prompt_end 위에 prompt_newline을 추가합니다. 다음 아래 코드를 추가합니다.    

```
prompt_newline() {
  if [[ -n $CURRENT_BG ]]; then
    echo -n "%{%k%F{$CURRENT_BG}%}$SEGMENT_SEPARATOR
%{%k%F{blue}%}$SEGMENT_SEPARATOR"
  else
    echo -n "%{%k%}"
  fi

  echo -n "%{%f%}"
  CURRENT_BG=''
}
```
  
저장을 해준 후 iTerm2에서 아래 명령어로 zshrc 파일의 수정사항을 반영해줍니다.  
  
```
source ~/.zshrc
```  
  
여기까지 적용했다면 보통의 경우 위의 사진과 다르게 폰트가 깨지는 모습을 볼 수 있습니다. 깨지지 않는 폰트 사용을 위해 네이버에서 제공하는 D2Coding 폰트를 사용합니다. (https://github.com/naver/d2codingfont)  

위 링크로 들어가셔서 폰트를 설치하신 후 Preference > Profile > Text로 들어가셔서 폰트를 수정해주시면 됩니다.  
d2coding 폰트는 최신 폰트로 사용하셔야 폰트가 깨지지 않습니다.  
  
***  
  
## 마치며
  
이상으로 Mac OS에서 iTerm2 + ZSH 세팅에 대해 간단하게 살펴봤습니다.  
개발할 때 이런 툴의 사소한 기능 하나하나가 은근히 큰 차이를 만들어 내는 것 같습니다.  
처음 세팅할때 제대로 해놓으면 이후 개발할 때 편하게 사용할 수 있을 겁니다. 😎 😎  
  



  
