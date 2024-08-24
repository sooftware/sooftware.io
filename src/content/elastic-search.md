---
layout: post
title: "[ELK] Elastic Search logstash - Nori 토크나이저 설정"
image: img/logstash.jpg
author:
  - Soohwan Kim
date: 2024-08-24T10:00:00.000Z
tags:
  - toolkit
  - web
  - chatgpt
excerpt:
---

# Elastic Search logstash - Nori 토크나이저 설정

<img src="https://github.com/user-attachments/assets/eba59a7d-2ecf-4f47-a15d-e8082a9586e7" width=550>

이번에 회사에서 검색 기능을 구현하면서 Elastic Search를 다루게 됐다. 이 엔진을 다루면서 삽질을 많이 했는데, 다음에는 하지 않도록 기록용으로 남겨둔다.  

## Elastic Search란?

간단히 말하면, 가장 널리 쓰이는 검색 엔진 중 하나이다. 검색 대상이 되는 문서들을 저장하고, 주기마다 인덱싱해고, 검색 쿼리를 날렸을때 사용자가 지정한 토크나이저 등을 이용해서 검색 결과를 반환해주는 엔진이다.  

## Nori 토크나이저

Elasticsearch(이하 ES)는 세계적으로 쓰이는 엔진이므로 당연하게도 한국어에 특화되어 있지 않다. 한국어처럼 특이한 형태소 구조를 가진 언어의 경우, 검색 효율을 높이기 위해 특수한 토크나이저가 필요한데, 많이 쓰이는 토크나이저가 Nori 토크나이저다. (Mecab 기반의 형태소 분석기인데, 이 부분은 생략)

예를 들면 ES에서 기본적으로 제공하는 토크나이저로는 '주웠어'를 검색한다고 하면, 검색 대상 문서에 '주웠다'가 있다고 해도 검색에 걸리지를 않는다. 하지만 Nori 토크나이저로 '주웠어'와 '주웠다'를 형태소 분리하게 되면 아래와 같이 동일하게 분리되므로, '주웠어'라고 검색해도 '주웠다'가 포함된 문서가 검색에 걸리게 된다.   

```
{  
  “tokens” : [  
    {  
      “token” : “주웠“,  
    },  
    {  
      “token” : “줍”,  
    }  
  ]  
}
```  


위 결과를 보면 유추할 수 있듯이, '주웠어'를 토큰화하면 '주웠' 뿐만 아니라 '줍'도 포함되기 때문에 '줍다'를 검색해도 ES의 검색에 걸리게 된다!  

<img src="https://github.com/user-attachments/assets/554d9533-7f72-4cf3-b463-57445bd8222e" width=400>. 

## Logstash

Logstash는 ELK(Elasticsearch, Logstash, Kibana)의 구성요소 중 **L** 에 해당하는데, 쉽게 보면 Elasticsearch를 사용하는데 필요한 툴킷이다. 데이터 파이프라인의 중간 역할을 수행한다고 보면 되는데, 데이터 인덱싱, 필터링, 저장하는 역할을 수행한다.  

Logstash에 특정 인덱스에 Nori 토크나이저를 적용하려면 아래와 같은 `curl` 문을 실행해주면 된다.  

```
curl -X PUT "http://localhost:9200/target_index" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "analysis": {
      "filter": {
        "lowercase_filter": {
          "type": "lowercase"
        },
        "nori_part_of_speech_filter": {
          "type": "nori_part_of_speech",
          "stoptags": ["E","J"]  // 원하는 stoptags 값으로 변경
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "nori_tokenizer",
          "filter": ["lowercase_filter", "nori_part_of_speech_filter"]
        }
      },
      "tokenizer": {
        "nori_tokenizer": {
          "type": "nori_tokenizer",
          "decompound_mode": "mixed"
        }
      }
    },
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "{TARGET_COLUMN}": {
        "type": "text",
        "analyzer": "my_analyzer"
      }
    }
  }
}
'
```

그리고 적용을 원하는 index에 해당하는 설정을 `logstash/pipeline/{TARGET_INDEX}.conf` 를 작성해주면 된다.  

```
input {
	jdbc {
		jdbc_driver_library => "/usr/share/logstash/logstash-core/lib/jars/postgresql.jar" 
		jdbc_driver_class => "org.postgresql.Driver"
		jdbc_connection_string => "${DB_URL}" 
		jdbc_user => "${DB_USER}"
		jdbc_password => "${DB_PASSWORD}"
		schedule => "*/10 * * * *"
		statement => 'SELECT id, {TARGET_COLUMN} FROM {TABLE_NAME}'. # 검색 대상 가져오는 
	}
}
output {
	elasticsearch { 
		hosts => ["http://elasticsearch:9200"]
		index => "target_index"
		document_id => "%{id}"
		doc_as_upsert => true
	}
}
```
