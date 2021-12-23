---
title: 'Slack Bot'
author: [Soohwan Kim]
tags: [toolkit]
image: img/slack.png
date: '2021-12-23T10:00:00.000Z'
draft: false
---

# Slack Bot

Python과 Slack API를 사용하여, 특정 채널에 자동으로 글을 올리거나 댓글을 달아주는 슬랙봇을 만들어보겠습니다.  
  
두 개의 과정으로 진행되는데,   
첫 번째는 **Slack API에 bot을 등록하는 것**이고  
두 번째는 **등록된 bot을 Python으로 활용하는 것**입니다.  

## Slack API에 bot을 등록하는 것  

[Slack API](https://api.slack.com/apps)에 접속하여 `Create An App`을 클릭합니다.  
  

![image](https://user-images.githubusercontent.com/54731898/147100372-5c1966a6-7ff0-4df3-8aae-70c84c672f8e.png)  

<br>  

`From scratch`를 클릭합니다.     

![image](https://user-images.githubusercontent.com/54731898/147100695-d47f7fc3-b252-4e67-8d95-6c9b8478556d.png)  

<br>

앱 이름을 작성하고, 슬랙 작업 환경을 선택한 후에 `Create App`을 클릭합니다.  
 

![image](https://user-images.githubusercontent.com/54731898/147100979-a4aeabc5-a864-4260-acf1-cce5a0acfe9f.png)    

<br> 

`Bots`를 클릭합니다.   

![image](https://user-images.githubusercontent.com/54731898/147101118-9b1e2594-cd69-4b48-b29b-ccdcf9fedc45.png)  
 
 <br> 

왼쪽 상단에는 입력한 앱 이름이 나오는 것을 확인할 수 있습니다.    
`Review Scopes to Add`를 클릭하여 앱 관련 권한을 설정할 수 있습니다.
  
![image](https://user-images.githubusercontent.com/54731898/147101379-3229204f-7352-43db-b55e-4383f4fab42c.png)  

 <br> 
 
`Install App to Workspace` 버튼이 비활성화 되어있는데 적어도 하나의 권한(Scope)를 설정해야 활성화되는 것을 확인할 수 있습니다.    

![image](https://user-images.githubusercontent.com/54731898/147101859-9d71f523-7d08-42e6-8bc4-11c4cc7e8960.png)    

<br>

스크롤을 내리면 `Scopes`를 설정하는 부분이 나타납니다.  `Bot Token Scopes` 부분에 있는 `Add an OAuth Scope`버튼을 클릭하여 관련 권한을 설정하면 됩니다.  
[Slack API Methods](https://api.slack.com/methods)에 가면 다양한 메소드를 확인하실 수 있습니다. 

![image](https://user-images.githubusercontent.com/54731898/147102209-013a72c2-c929-422f-9093-0cab18689cde.png)  

<br>

예를 들어, [conversations.history](https://api.slack.com/methods/conversations.history)라는 메소드를 클릭한 사진을 가져왔습니다.  
이 메소드를 호출할 때 필요한 권한들이나 1분 동안 몇 번정도 호출할 수 있는지, Arguments, 사용법 등이 자세하게 설명되어 있는 것을 알 수 있습니다.  이 메소드의 경우 `Rate limits`가 Tier 3인데 클릭하면 자세한 정보가 나오고 `50+ per minute` 정도로 제한이 되는 것을 확인하실 수 있습니다.  
이처럼 용도에 맞게 메소드를 선택하시고, 권한을 설정해주시면 될 것 같습니다.  

![image](https://user-images.githubusercontent.com/54731898/147104340-3d4908d7-6a18-48cc-bf21-664f1750f313.png)

<br>

권한을 설정하면 `Install App to Workspace` 버튼이 활성화되고, 클릭하여 `허용` 버튼을 누릅니다.

![image](https://user-images.githubusercontent.com/54731898/147105473-1e2c9f7e-06ef-4b46-93b8-b81a8a38ea64.png)

<br>

`Bot User OAuth Token`이 나오고, 나중에 Slack API를 호출할 때 사용되니 잘 저장해둡니다.    

![image](https://user-images.githubusercontent.com/54731898/147106099-22df28c9-45f6-44fe-a348-95c9a847a132.png)  

<br>

그리고 Slack Bot 앱을 원하는 채널에 추가해주면 됩니다.    

![image](https://user-images.githubusercontent.com/54731898/147106614-7a82d9e1-9817-45e5-9671-0e775cd0f21a.png)

<br>

<br> 

<br>

<br> 
  
    
  

## 등록된 bot을 Python으로 활용하는 것  
  
`slack_sdk` 라이브러리를 사용할 것이기 때문에 터미널에서 아래 명령어로 설치합니다.  

<br>

```python
pip install slack_sdk
```
  
<br>
  
<br> 
  
`__init__`에서 아까 저장했던 token id를 `WebClient` 파라미터로 넣어줍니다.  
`get_channel_id` 메소드는 channel 이름을 파라미터로 넘겨주면 channel id를 리턴해주는 메소드입니다.  
여기서 `conversations_list` 메소드를 사용하는데, types로 "public_channel"을 넘겨주면 public 채널만 검색이 가능하고,
"private_channel"을 넘겨주면 bot이 추가되어있는 private 채널만 검색이 가능합니다.    

<br>  

```python
from slack_sdk import WebClient


class SlackAPI:
    def __init__(self, token, channel_name):
        self.client = WebClient(token)
        self.channel_type = "public_channel"  # or "private_channel"
        self.channel_id = get_channel_id(channel_name)
        
    def get_channel_id(self, channel_name):
        result = self.client.conversations_list(types=[self.channel_type])

        channels = result['channels']
        channel = list(filter(lambda c: c["name"] == channel_name, channels))[0]
        channel_id = channel["id"]

        return channel_id
```

<br>  
 
 
`get_message_ts` 메소드는 `conversations_history` 메소드를 사용하여 메시지의 timestamp(ts)와 text 내용을 파싱하여 리턴해주는 함수입니다. 
파라미터 `oldest`는 메시지 검색을 처음부터 하지말고 해당 시간부터 해달라고하는 파라미터입니다.    
이 `oldest` 값을 계속 수정해주면 봇이 채널의 정보를 계속 가져올 때, 중복되지 않고 새로운 정보만 가져올 수 있도록 할 수 있습니다.  
  

<br>  

```python
def get_message_ts(self, end_ts):
    message_info = list()
    result = self.client.conversations_history(channel=self.channel_id, oldest=end_ts)

    messages = result['messages']        
    for message in messages:
        message_ts = message["ts"]
        message_text = message["text"]
        message_info.append({"ts": message_ts, "text": message_text})

    return message_info
 ```
    
<br>  

`post_thread_message` 메소드는 `chat_postMessage` 메소드를 사용하여 원하는 채널, 원하는 스레드(메시지)에 댓글을 달아주는 함수입니다.  
파라미터로 `thread_ts`를 빼면, 원하는 채널에 스레드(메시지)를 남길 수 있습니다.  
  
<br>  

```python
def post_thread_message(self, message_ts, text):
    self.client.chat_postMessage(
        channel=self.channel_id,
        text=text,
        thread_ts=message_ts
    )
```
  
<br> 


`post_emoji` 메소드는 `reactions_add` 메소드를 사용하여 원하는 채널, 원하는 스레드(메시지)에 이모지를 달아주는 함수입니다.  
위의 `post_thread_message` 메소드와 같이 보통 여기서는 스레드(메시지)를 timestamp로 구분합니다.   
여기서는 이모지 `"smile"`을 사용하였는데, 직접 만든 이모지 뿐만 아니라 등록되어 있는 이모지의 이름을 적어주시면 됩니다.  
   
<br> 
  
```python
def post_emoji(self, message_ts):
    self.client.reactions_add(
        channel=self.channel_id,
        name="smile",
        timestamp=message_ts
    )
```
  
<br> 

최종적으로 다 합친 코드입니다.  
  
<br> 
    
```python
from slack_sdk import WebClient


class SlackAPI:
    def __init__(self, token, channel_name):
        self.client = WebClient(token)
        self.channel_type = "public_channel"  # or "private_channel"
        self.channel_id = get_channel_id(channel_name)
        
    def get_channel_id(self, channel_name):
        result = self.client.conversations_list(types=[self.channel_type])

        channels = result['channels']
        channel = list(filter(lambda c: c["name"] == channel_name, channels))[0]
        channel_id = channel["id"]

        return channel_id
        
    def get_message_ts(self, end_ts):
        message_info = list()
        result = self.client.conversations_history(channel=self.channel_id, oldest=end_ts)
        
        messages = result['messages']        
        for message in messages:
            message_ts = message["ts"]
            message_text = message["text"]
            message_info.append({"ts": message_ts, "text": message_text})

        return message_info

    def post_thread_message(self, message_ts, text):
        self.client.chat_postMessage(
            channel=self.channel_id,
            text=text,
            thread_ts=message_ts
        )
       
    def post_emoji(self, message_ts):
        self.client.reactions_add(
            channel=self.channel_id,
            name="smile",
            timestamp=message_ts
        )
```        
  
<br> 
  

  
# Reference
- https://wooiljeong.github.io/python/slack-bot
- https://api.slack.com/methods
