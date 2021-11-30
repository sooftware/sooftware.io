---
title: 'Uniform Length Batching in PyTorch'
author: [Soohwan Kim]
tags: [nlp]
image: img/ulb.png
date: '2021-09-28T10:00:00.000Z'
draft: false
---

# Uniform Length Batching in PyTorch
  
<img src="https://user-images.githubusercontent.com/42150335/130908773-73f38a84-041c-4c13-b102-3dba09493785.png" width=600>  
  
- 전체 토큰 길이가 비슷한 인풋끼리 배치를 이루어주는 방식
- 그냥 랜덤하게 배치를 묶어주면 길이가 한 데이터를 제외하고는 평균 길이가 10인데 한 데이터 길이가 100인 경우 나머지 데이터들도 모두 100까지 패딩을 채워줘야하는 비효율이 발생함
- 실제로 랜덤하게 배치를 묶어버리면 예시보다도 더 큰 비효율이 발생하는 경우가 많음
- 학습 속도 개선 및 장비 활용도 측면에서 길이가 비슷한 인풋끼리 배치를 묶어주게 되면 많이 개선됨
- 유일한 단점은 배치는 최대한 비빔밥처럼 골고루 섞여야 좋다고 하는데, 길이가 비슷한 놈들끼리 묶인다는 바이어스를 주게되므로 성능에 영향을 미칠수도 있다는 의견도 꽤 있으나 학습 속도 및 장비 활용도 측면에서 상당한 이득을 주기 때문에 많이 사용되는 방식
  
## PyTorch Dataset Class
  
```python
class ExampleDataset(torch.utils.data.Dataset):
    def __init__(self, datas):
        super(ExampleDataset, self).__init__()
        ...
        ...
        self.inputs = datas["inputs"]
        self.labels = datas["labels"]

    def __len__(self):
        return len(self.inputs)

    def __getitem__(self, idx):
        return self.inputs[idx], self.labels[idx]
```
  
- PyTorch Dataset 클래스는 input, label 페어를 `__getitem__()` 메서드로 리턴해주는 역할을 수행
- 여기서 `__getitem__()`은 `idx`를 파라미터로 받게 되는데, 넘겨지는 인덱스에 따라 다른 데이터를 리턴해주는 방식
- 이러한 점을 이용해서 넘겨지는 idx 순서만 셔플해주면 쉽게 데이터를 셔플해서 가져올 수 있음 (이러한 역할을 해주는 놈이 `Sampler` 클래스)
  
```python
# 이렇게 0부터 차례차례 순서로 idx를 건네줄수도 있지만
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

# 단순하게 idx 순서만 셔플함으로써 데이터를 가져오는 순서를 쉽게 셔플할 수 있음
[2, 10, 11, 13, 1, 15, 4, 14, 9, 5, 12, 8, 0, 7, 6, 3]
```

## Bucketing Sampler
  
<img src="https://user-images.githubusercontent.com/42150335/135025302-e762a16b-4eb9-40b9-8908-da502df014db.png" width=500>
  
- 데이터를 완전 무작위하게 셔플하는게 아니라, 어떤 기준으로 버킷에 담아두고 셔플시, 이 버킷을 셔플하는 방식의 Sampler
- 이렇게 하게 되면 묶이는 배치는 유지하면서도 모델 학습에 들어가는 순서는 셔플이 되므로 어떤 기준으로 배치를 묶는 경우 많이 사용되는 방식
- 구현은 아래처럼 간단하게 가능 
  - self.bins를 2차원 list로 만들어서 안에 담긴 list들이 버킷 역할을 함.

```python
class BucketingSampler(Sampler):
    def __init__(self, data_source: torch.utils.data.Dataset, batch_size=1):
        super(BucketingSampler, self).__init__(data_source)
        self.data_source = data_source
        ids = list(range(0, len(data_source)))
        self.bins = [ids[i:i + batch_size] for i in range(0, len(ids), batch_size)]

    def __iter__(self):
        for ids in self.bins:
            yield ids

    def __len__(self):
        return len(self.bins)

    def shuffle(self, epoch):
        np.random.shuffle(self.bins)
```

## Uniform Length Batching Sampler
  
- Uniform Length Batching은 위의 Bucketing Sampler에서 토큰 길이를 기준으로 sorting 로직만 추가해주면 됨.

```python
class UniformLengthBatchingSampler(Sampler):
    def __init__(self, data_source: torch.utils.data.Dataset, batch_size=1):
        super(UniformLengthBatchingSampler, self).__init__(data_source)
        self.data_source = data_source
        #
        # 여기에 토큰 길이 기준으로 sorting하는 로직만 추가해주면 끝
        #
        ids = list(range(0, len(data_source)))
        self.bins = [ids[i:i + batch_size] for i in range(0, len(ids), batch_size)]

    def __iter__(self):
        for ids in self.bins:
            yield ids

    def __len__(self):
        return len(self.bins)

    def shuffle(self, epoch):
        np.random.shuffle(self.bins)
```

## collate_fn
  
- PyTorch에서 배치로 묶인 인풋을 처리하는 로직이 담긴 함수
- 보통 여기서 길이가 다른 인풋들에 대하여 padding을 추가하고 텐서형으로 변환하는 코드가 수행됨.
- Uniform Length Batching을 수행하기 위해서는 `Sampler`에서 묶일 때까지 패딩을 추가하면 안 되기 때문에 `collate_fn`을 정의해주어야함.
- 구현 예시

```python
def collate_fn(batch):
    def seq_length_(p):
        return len(p[0])

    max_seq_sample = max(batch, key=seq_length_)[0]
    max_seq_size = len(max_seq_sample)

    batch_size = len(batch)

    input_ids = torch.zeros(batch_size, max_seq_size).fill_(0).long()
    attention_masks = torch.zeros(batch_size, max_seq_size).fill_(0).long()
    labels = torch.zeros(batch_size, max_seq_size).fill_(0).long()

    for idx in range(batch_size):
        sample = batch[idx]
        sample_input_ids = sample[0]
        sample_attention_masks = sample[1]
        sample_labels = sample[2]

        input_ids[idx].narrow(0, 0, len(sample_input_ids)).copy_(torch.LongTensor(sample_input_ids))
        attention_masks[idx].narrow(0, 0, len(sample_attention_masks)).copy_(torch.LongTensor(sample_attention_masks))
        labels[idx].narrow(0, 0, len(sample_labels)).copy_(torch.LongTensor(sample_labels))

    return {
        "input_ids": input_ids,
        "attention_mask": attention_masks,
        "labels": labels,
    }
```
  
## How to apply?
  
- 이렇게 정의한 `Sampler`와 `collate_fn`은 `DataLoader` 클래스 생성시 넘겨주면 적용이 됨.
  
```python
trainset = ExampleDataset(train_datas)
sampler = UniformLengthBatchingSampler(trainset, batch_size=32)

train_loader = DataLoader(
    dataset=trainset,
    sampler=sampler,
    shuffle=True,
    collate_fn=collate_fn,
)
```