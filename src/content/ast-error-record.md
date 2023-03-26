---
title: 'ast - literal_eval 에러 기록'
author: [Soohwan Kim]
tags: [toolkit, environment]
image: img/testimg-cover.jpg
date: '2023-03-25T10:00:00.000Z'
draft: false
---

# ast - literal_eval 에러 기록
  
ast의 literal_eval을 사용하면 문자열 형태의 자료형을 파이썬 자료형으로 바꿔줄 수 있다.
  
```python
>>> from ast import literal_eval
>>> test_dict = "{'a': 1, 'b': 2}"
>>> literal_eval(test_dict)
{'a': 1, 'b': 2}
```
  
오늘 `ValueError: malformed node or string: <ast.Name object at 0x7f2a381c2fd0>` 이 에러가 났다.  
  
```
{..., 'is_self':false, ...}
```
  
이런 구조였는데, 왜 에러가 나는지 몰랐는데 `literal_eval`말고 `json.loads`를 사용하면 에러 없이 동작한다.  
  
이유는 literal_eval과 json의 포맷이 달라서 그러는데 위 예시에서 false를 False로 수정해주면 literal_eval로도 동작한다.
  
