---
layout: post
title: 'Hugging Face Tokenizers'
author: [Soohwan Kim]
tags: ['huggingface', 'nlp']
image: img/huggingface.png
date: '2021-08-11T15:11:55.000Z'
draft: false
---

최근 NLP 토크나이저를 만드는데 가장 많이 사용되는 `tokenizers` 라이브러와 실제 사용이 가장 많이 되는 `transformers` 라이브러리로의 변환에 대한 코드를 담고 있습니다. 해당 내용은 `tokenizers==0.10.3` 버젼에서 수행되었습니다.  

### Train 
  
아래 코드는 wordpiece, char-bpe, byte-level bpe 방식을 지원합니다.  
센텐스피스의 경우 tokenizers에는 현재 sentencepiece가 불안정하여, 오리지널 sentencepiece 학습 방식으로 학습 후 `tokenizers.SentencePieceUnigramTokenizer.from_spm()` 메서드로 로드하는 방식을 사용하셔야 합니다.
  
- code

```python
import os
import argparse
from tokenizers import (
    BertWordPieceTokenizer, 
    ByteLevelBPETokenizer, 
    CharBPETokenizer, 
    SentencePieceUnigramTokenizer,
)

parser = argparse.ArgumentParser()
parser.add_argument('--corpus_file', type=str, required=True)
parser.add_argument('--vocab_size', type=int, default=0, required=True)
parser.add_argument('--limit_alphabet', type=int, default=0)
parser.add_argument('--tokenizer', type=str, default='sentencepiece')
parser.add_argument('--model_type', type=str, default='gpt')
parser.add_argument('--save_dir', type=str, default='sp')
args = parser.parse_args()

if args.model_type == 'bert':
    special_tokens = ['<|sos|>', '<|eos|>', '<|pad|>', '<|unk|>', '<|mask|>', '<|sep|>', '<|cls|>']
elif args.model_type == 'gpt':
    special_tokens = ['<|endoftext|>', '<|unk|>']
else:
    raise ValueError(f"Unsupported model type: {args.model_type}")

if args.tokenizer.lower() == 'wordpiece':
    tokenizer = BertWordPieceTokenizer(
        clean_text=True,
        handle_chinese_chars=True,
        strip_accents=False,
        lowercase=False,
        wordpieces_prefix='##',
    )
    tokenizer.train(files=[args.corpus_file], limit_alphabet=args.limit_alphabet, vocab_size=args.vocab_size)
elif args.tokenizer.lower() == 'bbpe':
    tokenizer = ByteLevelBPETokenizer(
        lowercase=False,
        add_prefix_space=True,
        unicode_normalizer='nfc',
    )
    tokenizer.train(
        files=[args.corpus_file],
        vocab_size=args.vocab_size,
        special_tokens=special_tokens,
    )
elif args.tokenizer.lower() == 'char-bpe':
    tokenizer = CharBPETokenizer(
        lowercase=False,
        add_prefix_space=True,
        unicode_normalizer='nfc',
    )
    tokenizer.train(
        files=[args.corpus_file],
        vocab_size=args.vocab_size,
        special_tokens=special_tokens,
    )
else:
    raise ValueError("Error")

if not os.path.exists(args.save_dir):
    os.mkdir(args.save_dir)

tokenizer.save("tokenizer.json")
```

### Convert to transformers tokenizer
  
`tokenizers` 라이브러리로 학습한 토크나이저는 아래 코드로 간단하게 `transformers` 토크나이저로 변환이 가능합니다.
  

```python3
from transformers import PreTrainedTokenizerFast

tokenizer = PreTrainedTokenizerFast(tokenizer_file='tokenizer.json')
tokenizer.save_pretrained('SAVE_DIR')
```

- sentencepiece

```python
import sentencepiece as spm

SENTENCEPIECE_MODEL_PREFIX = "SP"
SENTENCEPIECE_MODEL_TYPE = "unigram"

spm.SentencePieceTrainer.Train(
        f"--input=sentencepiece_input.txt "
        f"--model_prefix={SENTENCEPIECE_MODEL_PREFIX} "
        f"--vocab_size={vocab_size} "
        f"--model_type={SENTENCEPIECE_MODEL_TYPE} "
        f"--pad_id=0 "
        f"--bos_id=1 "
        f"--eos_id=2 "
        f"--unk_id=3 "
        f"--user_defined_symbols=[SEP],[CLS],[MASK]")
```

### Add post process
  
토크나이저를 만들게 되면 따로 설정해주지 않으면 아래와 같은 형태로 토크나이징이 진행됩니다.  
  
- code

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained('SAVE_DIR')
tokenizer.tokenize('튜닙은 자연어처리 테크 스타트업이다.')
```

- output

```
['▁', '튜', '닙', '은', '▁자연', '어', '처', '리', '▁테', '크', '▁', '스타', '트', '업', '이다.']
```
  
보통 버트나 일렉트라 같은 모델들은 파인튜닝의 편리함을 위해 아래와 같은 포맷으로 문장이 토크나이징 됩니다.  
  
```
['[CLS]', '▁', '튜', '닙', '은', '▁자연', '어', '처', '리', '▁테', '크', '▁', '스타', '트', '업', '이다.', '[SEP]']
```
  
이러한 포맷으로 자동으로 토크나이징 해주기 위해서는 `post_processor`를 추가해주면 됩니다.  
  
- code

```python
from tokenizers import SentencePieceUnigramTokenizer
from tokenizers.processors import TemplateProcessing
from transformers import PreTrainedTokenizerFast
        
tokenizer = SentencePieceUnigramTokenizer(vocab)      

# '[CLS] SENTENCE [SEP]' format
tokenizer.post_processor = TemplateProcessing(
    single="[CLS] $A [SEP]",
    pair="[CLS] $A [SEP] $B:1 [SEP]:1",
    special_tokens=[
        ("[CLS]", tokenizer.token_to_id("[CLS]")),
        ("[SEP]", tokenizer.token_to_id("[SEP]")),
    ],
)

tokenizer = PreTrainedTokenizerFast(tokenizer_object=tokenizer)
tokenizer.save_pretrained('SAVE_DIR')
```

이렇게 저장한 `transformers` 토크나이저를 아까와 똑같이 로드해서 사용해주면 버트 포맷의 인풋으로 토크나이징 됩니다.
  
- code

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained('SAVE_DIR')
tokenizer.tokenize('튜닙은 자연어처리 테크 스타트업이다.')
```

- output

```
['[CLS]', '▁', '튜', '닙', '은', '▁자연', '어', '처', '리', '▁테', '크', '▁', '스타', '트', '업', '이다.', '[SEP]']
```
