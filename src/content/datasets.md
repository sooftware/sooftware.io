---
title: 'Huggingface Datasets Methods'
author: [Soohwan Kim]
tags: [record]
image: img/huggingface.png
date: '2022-02-17T10:00:00.000Z'
draft: false
---
  
# Huggingface Datasets Methods
  
자주 사용하는 허깅페이스 datasets의 메서드를 정리합니다.  
  
## load_datasets
  
허깅페이스 서버에 올라가 있는 데이터셋을 다운 받을 때 사용하는 메서드
  
```python
>>> import datasets
>>> dataset = datasets.load_dataset('klue', 'sts')
>>> dataset
DatasetDict({
    train: Dataset({
        features: ['guid', 'source', 'sentence1', 'sentence2', 'labels'],
        num_rows: 11668
    })
    validation: Dataset({
        features: ['guid', 'source', 'sentence1', 'sentence2', 'labels'],
        num_rows: 519
    })
})
```
  
## save_to_disk
  
DatasetDict Object를 디스크에 저장하는 메서드
  
```python
>>> import datasets
>>> dataset = datasets.load_dataset('klue', 'sts')
>>> dataset.save_to_disk('test')
```
  
## load_from_disk
  
위의 `save_to_disk`로 저장한 파일을 이용해서 DatasetDict로 읽어오는 메서드
  
```python
>>> import datasets
>>> dataset = datasets.load_dataset('klue', 'sts')
>>> dataset.save_to_disk("path/of/my/dataset/directory")
>>> reloaded_encoded_dataset = datasets.load_from_disk("path/of/my/dataset/directory")
```
  
## DatasetDict Constructor
  
Dictionary를 바로 DatasetDict Object로 바꿔주는 방법
    
```python
>>> from datasets import DatasetDict
>>> dataset = DatasetDict({
...    "train": {
...        "test1": [1, 2, 3, 4],
...        "test2": [1, 2, 3, 4],
...        "test3": [1, 2, 3, 4],
...    },
...    "validation": {
...        "test1": [1, 2, 3, 4],
...        "test2": [1, 2, 3, 4],
...        "test3": [1, 2, 3, 4],
...    },
...    "test": {
...        "test1": [1, 2, 3, 4],
...        "test2": [1, 2, 3, 4],
...        "test3": [1, 2, 3, 4],
...    }
... })
>>> dataset
DatasetDict({
    train: {'test1': [1, 2, 3, 4], 'test2': [1, 2, 3, 4], 'test3': [1, 2, 3, 4]}
    validation: {'test1': [1, 2, 3, 4], 'test2': [1, 2, 3, 4], 'test3': [1, 2, 3, 4]}
    test: {'test1': [1, 2, 3, 4], 'test2': [1, 2, 3, 4], 'test3': [1, 2, 3, 4]}
})
```
  
## from_json
  
Json 파일로부터 DatasetDict를 로드하는 메서드
  
```python
>>> from datasets import DatasetDict
>>> dataset= DatasetDict.from_json('path_of_json')
>>> dataset
DatasetDict({
    train: Dataset({
        features: ['guid', 'source', 'sentence1', 'sentence2', 'labels'],
        num_rows: 11668
    })
    validation: Dataset({
        features: ['guid', 'source', 'sentence1', 'sentence2', 'labels'],
        num_rows: 519
    })
})
```