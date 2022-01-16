---
title: '정규표현식 (regex)'
author: [Soohwan Kim]
tags: [nlp]
image: img/regex.png
date: '2021-09-08T10:00:00.000Z'
draft: false
---

# 정규 표현식
 - 정규표현식(regular expression)은 일종의 문자를 표현하는 공식으로, 특정 규칙이 있는 문자열 집합을 추출할 때 자주 사용되는 기법입니다.
 - 주로 Prograaming Language나 Text Editor등에서 문자열의 검색과 치환을 위한 용도로 쓰이고 있습니다.

<br>

### 메타문자
```
. ^ $ * + ? {} [] \ | ()
```
 - 메타문자는 문자를 설명하기 위한 문자로, 문자의 구성을 설명하기 위해 원래의 의미가 아닌 다른 의미로 쓰이는 문자를 말합니다.
 - 정규표현식에서는 위와 같은 메타문자를 사용합니다.

<br>

### 정규표현식: `[]`
- 문자 클래스인 `[]`는 `"[] 사이의 문자들과 매치"`라는 의미를 가지며, `[]`사이에는 어떤 문자도 들어갈 수 있습니다.
  - `[abc]`라면 이 표현식의 의미는 `"a, b, c 중 한 개의 문자와 매치"`를 뜻합니다.


- 예시) `[abc]`가 `"a", "before", "dude"`와 어떻게 매치되는지 살펴보겠습니다.
  - `a`는 정규식과 일치하는 문자인 `a`가 있으므로 매치
  - `before`는 정규식과 일치하는 문자인 `b`가 있으므로 매치
  - `dude`는 정규식과 일치하는 문자인 `a, b, c`중 어느 하나도 포함하고 있지 않으므로 매치되지 않음

<br>

### 정규표현식: `하이픈(-), 캐럿(^)`
- 하이픈(-)은 두 문자 사이의 범위(from - to)를 의미, 캐럿(^)은 반대를 의미합니다.
  - `[a-zA-Z]`: 알파벳 모두 매치
  - `[0-9]`: 숫자 매치
  - `[^0-9]`: 숫자가 아닌 문자만 매치
    - `[]`안에서는 부정의 의미로 사용
    - `[]`가 없으면 문자열의 처음을 뜻함(끝은 $로 표시)


- 문자클래스`[]`안에는 어떤 문자나 메타 문자도 사용할 수 있지만 `^`는 반대(not)의 의미로 사용되기 때문에 조심해야합니다.

<br>

### 정규표현식: `\역슬래쉬`
- `[0-9]`또는 `[a-zA-Z]`와 같은 정규표현식은 `\역슬래쉬`를 이용해 간단하게 표현할 수 있습니다. 이번엔 `\역슬래쉬`를 사용한 별도의 표기법들에 대해 알아보겠습니다.


-
  - `\d` - 숫자와 매치, `[0-9]`와 동일한 표현식이다.
  - `\D` - 숫자가 아닌 것과 매치, `[^0-9]`와 동일한 표현식이다.
  - `\s` - whitespace 문자와 매치, `[ \t\n\r\f\v]`와 동일한 표현식이다. 맨 앞의 빈 칸은 공백문자(space)를 의미한다.
  - `\S` - whitespace 문자가 아닌 것과 매치, `[^\t\n\r\f\v]`와 동일한 표현식이다.
  - `\w` - 문자+숫자(alphanumeric)와 매치, `[a-zA-Z0-9_]`와 동일한 표현식이다.
  - `\W` - 문자+숫자(alphanumeric)가 아닌 문자와 매치, `[^a-zA-Z0-9_]`와 동일한 표현식이다.
  - `\s` - 스페이스(공백문자), 탭과 매치, `[\t\n\f\r]`과 동일한 표현식이다.
  - `\S` - 스페이스 외 문자와 매치, `[^\t\n\f\r]`과 동일한 표현식이다.


- 대문자로 사용된 것은 소문자의 반대임을 추측할 수 있습니다.
- 또한 정규식 상의 특별한 의미가 있는 문자들을 문자 그대로 쓸 때 앞에 붙혀 사용됩니다.

<br>

### 정규표현식: 'Dot(.)'
- 줄바꿈 문자인 `\n`을 제외한 모든 문자와 매치됨을 의미합니다.

다음 정규식을 보겠습니다.
```angular2html
a.b
```
위 정규식의 의미는 `"a + 모든문자 + b"`와 같습니다.
- 즉 a와b라는 문자 사이에 어떤 문자가 들어가도 모두 매치가 된다는 의미입니다.
  - 예시로 `"aab", "a0b", "abc"`를 보겠습니다.
    - `aab`는 가운데 문자 `a`가 모든 문자를 의미하는 `.`과 일치하므로 정규식과 매치됩니다.
    - `a0b`도 동일하게 가운데 문자 `0`이 모든 문자를 의미하는 `.`과 일치하므로 정규식과 매치됩니다.
    - `abc`는 `a`와 `b`사이에 어떤 문자가 존재하지 않기 때문에 위 정규식과 매치되지 않습니다.

그렇다면 이 정규식은 어떨까요?
```angular2html
a[.]b
```
앞서 설명드렸다 싶이 문자클래스`[]`는 내부에 메타문자가 들어가더라도 문자 그대로 인식해주는 특징을 갖고 있습니다.
따라서 `a.b`와 매치되고 `a0b`와 같은 문자열은 매치되지 않습니다.

<br>

### 정규표현식: 반복 관련 메타 문자 `* + ? {}`
- 반복(*)
  - 메타문자 `*`은 `*`바로 앞에 있는 문자가 0부터 무한대로 반복될 수 있다는 의미입니다.
```angular2html
ca*t
```
- 위 정규식은 `c + a(0번 이상 반복) + t`라는 것을 알 수 있습니다.
  - `ct`, `cat`, `caaaat` 모두 매치됩니다.


- 반복(+)
  - 반복을 나타내는 또 다른 문자인 `+`입니다. `+`는 `*`과 달리 최소 1번 이상 반복될 때 사용합니다. 즉 `*`은 반복횟수가 0부터 시작, `+`는 반복횟수가 1부터 시작됩니다.
  - `ct`, `cat`, `caaat`중 `ct`는 매치되지 않습니다.


- 반복({m,n})
  - `{}`는 원하는 반복횟수를 지정하고 싶을 때 사용됩니다. m에서 n까지 반복, m이상인 경우, n이하인 경우 등 자유롭게 원하는 만큼 조절이 가능합니다.
    1. `{m}`: 반드시 m번 반복
       - `ca{2}t`: "c + a(반드시 2번 반복) + t"
    2. `{m, n}`: m~n회 반복
       - `ca{2, 5}t`: "c + a(2~5회 반복) + t"
    3. `{m,}, {,n}`: m회 이상 반복, n회 이하 반복
  

- 반복(?)
  - `?`는 반복은 아니지만 비슷한 개념으로 `{0, 1}`과 같은 의미를 지닙니다. 즉, 문자가 있거나 없거나 둘 다 매치 되는 경우입니다.
  - `ab?c` : "a + b(있어도 되고 없어도 된다) + c"
  

`*`, `+`, `?`메타 문자는 모두 `{m, n}` 형태로 고쳐 쓰는 것이 가능하지만 가급적 이해하기 쉽고 간결한 `*`, `+`, `?`메타 문자를 사용하는 것이 좋습니다.

<br>

### ex) 주민등록번호 정규표현식
```angular2html
/^\d{2}[0-1]\d{1}[0-3]\d{1}\-[1-4]\d{6}$/
```
- `^`: Start of String
- `\d{3}`: 1-2번째(년도) 숫자 0-9
- `[0-1]`: 3번째(월도 앞자리) 0,1
- `\d{1}`: 4번째(월도 뒷자리) 숫자 0-9
- `[0-3]`: 5번째(일자 앞자리) 0,1,2,3
- `\d{1}`: 6번째(일자 뒷자리) 숫자 0-9
- `\-` : 7번째(구분자) -
- `[1-4]`: 8번째(성별) 90년대생 1,2 2000년대생 3,4
- `\d{6}`: 9-14번째(뒷자리 6자리) 숫자 0-9
- `$`: End of String

<br>

## 파이썬과 정규표현식
파이썬은 정규 표현식을 지원하기 위해 re(regular expression)모듈을 제공합니다.

Usage
```angular2html
import re
pattern = re.compile("정규식")
```
re.compile을 사용하여 정규 표현식을 컴파일합니다. re.compile의 결과인 객체 `pattern`에 입력한 정규식의 대한 정보가 담겨있습니다.

이제 `pattern`객체를 이용해 문자열 검색을 수행해보겠습니다. 컴파일된 패턴 객체는 다음과 같은 4가지 메서드를 제공합니다.
![image](https://user-images.githubusercontent.com/59256704/133471058-446759bb-eeeb-4000-b6ef-6ca795be12df.png)

```angular2html
import re
p = re.compile('[a-z]+')
```
위 코드를 실행해 생성된 객체 `p`로 메서드를 살펴보겠습니다.

<br>

### match
- match 메서드는 문자열의 처음부터 정규식과 매치되는지 조사하며, 반환값으로 match 객체를 돌려줍니다.
```angular2html
>>> m = p.match("python")
>>> print(m)
<_sre.SRE_Match object at 0x01F3F9F8>
```
`python`문자열은 `[a-z]+`정규식에 부합되므로 match 객체를 돌려줍니다.

따라서 파이썬 정규식 프로그램은 다음과 같이 작성해 매치 여부를 확인합니다.
```angular2html
p = re.compile(정규표현식)
m = p.match(문자열)

if m:
    print("정규식 일치")
else:
    print("정규식 불일치")
```

<br>

### search
동일하게 컴파일된 객체 p를 갖고 이번엔 search 메서드를 수행해보겠습니다. 예시를 통해 match와의 차이점을 확인해보시면 좋을 것 같습니다.
```angular2html
>>> m = p.search("3 python")
>>> print(m)
<_sre.SRE_Match object at 0x01F3FA30>
```
`3 python`문자열은 첫번째 문자가 숫자이므로 match메서드에서는 None을 반환합니다. 하지만 search메서드는 문자열의 처음부터 검색하는 것이 아니라 문자열 전체를 검색하기 때문에 "python"문자열과 매치돼서 match객체를 반환하게 됩니다.

<br>

### findall
`findall` 메서드는 이름 그대로 문자열에서 정규식과 일치하는 부분을 찾아 리스트로 반환시켜줍니다.
```angular2html
>>> result = p.findall("life is too short")
>>> print(result)
['life', 'is', 'too', 'short']
```
정규식과 일치하는 부분인 각 단어들이 반환되는 것을 확인할 수 있습니다.

<br>

### finditer
finditer는 findall과 동일하지만 그 결과로 반복 가능한 객체를 돌려줍니다.
```angular2html
>>> result = p.finditer("life is too short")
>>> print(result)
<callable_iterator object at 0x01F5E390>
>>> for r in result: print(r)
...
<_sre.SRE_Match object at 0x01F3F9F8>
<_sre.SRE_Match object at 0x01F3FAD8>
<_sre.SRE_Match object at 0x01F3FAA0>
<_sre.SRE_Match object at 0x01F3F9F8>
```
반복 가능한 객체가 포함하는 각각의 요소는 match 객체입니다.

<br>

## match 객체의 메서드
계속 반환받아왔던 match객체를 써먹어야겠죠? 이번엔 match객체의 메서드들에 대해 알아보겠습니다.

![image](https://user-images.githubusercontent.com/59256704/133474331-97272bd8-2286-45c7-b026-db5e6948cb8f.png)

다음 예시로 살펴보겠습니다.
```angular2html
>>> m = p.match("python")
>>> m.group()
'python'
>>> m.start()
0
>>> m.end()
6
>>> m.span()
(0, 6)
```
예상된 결과값입니다. 만약 match메서드를 사용해 반환된 match메서드라면 start()의 결과값은 항상 0일 것입니다. match메서드는 항상 문자열의 시작부터 조사하기 때문이죠.

만약 search 메서드를 사용했다면 start()값은 다르게 나올 것입니다.
```angular2html
>>> m = p.search("3 python")
>>> m.group()
'python'
>>> m.start()
2
>>> m.end()
8
>>> m.span()
(2, 8)
```
이처럼 문자열에서 정규식이 해당되는 부분의 첫 시작지점이 나오게 됩니다.

※ 모듈 단위로 수행
```angular2html
>>> m = re.match('[a-z]+', "python")
```
다음과 같이 축약된 형태로도 사용가능합니다.

<br>

## 컴파일 옵션
정규식을 컴파일할 때 다음 옵션을 사용할 수 있습니다.
- DOTALL(S) - . 이 줄바꿈 문자를 포함하여 모든 문자와 매치할 수 있도록 한다.
- IGNORECASE(I) - 대소문자에 관계없이 매치할 수 있도록 한다.
- MULTILINE(M) - 여러줄과 매치할 수 있도록 한다. (^, $ 메타문자의 사용과 관계가 있는 옵션이다)
- VERBOSE(X) - verbose 모드를 사용할 수 있도록 한다. (정규식을 보기 편하게 만들수 있고 주석등을 사용할 수 있게된다.)

옵션을 사용할 때는 `re.DOTALL`처럼 전체 옵션이름을 써도 되고, `re.S`처럼 약어를 써도 됩니다.

<br>

### DOTALL, S
`.`메타 문자가 줄바꿈 문자`\n`도 포함시키도록 하고 싶다면 `re.DOTALL`또는 `re.S`옵션을 사용해 정규식을 컴파일하면 됩니다.
```angular2html
>>> p = re.compile('a.b', re.DOTALL)
>>> m = p.match('a\nb')
>>> print(m)
<_sre.SRE_Match object at 0x01FCF3D8>
```
`re.DOTALL`옵션으로 `\n`도 매치시키는 것을 확인할 수 있습니다.

<br>

### IGNORECASE, I
`re.IGNORECASE` 또는 `re.I` 옵션은 대소문자 구별 없이 매치를 수행할 때 사용하는 옵션입니다.
```angular2html
>>> p = re.compile('[a-z]', re.I)
>>> p.match('python')
<_sre.SRE_Match object at 0x01FCFA30>
>>> p.match('Python')
<_sre.SRE_Match object at 0x01FCFA68>
>>> p.match('PYTHON')
<_sre.SRE_Match object at 0x01FCF9F8>
```
`[a-z]` 정규식은 소문자만을 의미하지만 re.I옵션으로 대소문자 구별없이 매치되는 것을 볼 수 있습니다.

<br>

### MULTILINE, M
`^`은 문자열의 처음, `$`은 문자열의 마지막을 의미합니다. 자세한 설명 전에 다음 예시를 살펴보겠습니다.
```angular2html
import re
p = re.compile("^python\s\w+")

data = """python one
life is too short
python two
you need python
python three"""

print(p.findall(data))
```
결과
```angular2html
['python one']
```
결과를 보면 알겠지만 `^`메타 문자에 의해 python이라는 문자열을 사용한 첫 번째 줄만 매치된 것을 알 수 있습니다.

하지만 `^`메타 문자를 문자열 전체의 처음이 아니라 각 라인의 처음으로 인식시키고 싶은 경우가 있을 것입니다. 이럴 때 사용하는 옵션이 바로 `re.MULTILINE` 옵션입니다.

위 코드에 `re.MULTILINE`옵션을 추가해보겠습니다.
```
import re
p = re.compile("^python\s\w+", re.MULTILINE)

data = """python one
life is too short
python two
you need python
python three"""

print(p.findall(data))
```
결과
```angular2html
['python one', 'python two', 'python three']
```
다음과 같이 `^`메타 문자가 문자열의 각 줄마다 적용되는 것을 확인할 수 있습니다.

<br>

### VERBOSE, X
여태 봐왔듯이 정규식은 굉장히 가독성이 안좋은 것을 알 수 있습니다. 이런 정규식의 가독성을 조금이나마 해결해주기 위한 옵션이 바로 `VERBOSE`입니다.
```angular2html
charref = re.compile(r'&[#](0[0-7]+|[0-9]+|x[0-9a-fA-F]+);')
```
```angular2html
charref = re.compile(r"""
 &[#]                # Start of a numeric entity reference
 (
     0[0-7]+         # Octal form
   | [0-9]+          # Decimal form
   | x[0-9a-fA-F]+   # Hexadecimal form
 )
 ;                   # Trailing semicolon
""", re.VERBOSE)
```

첫 번째와 두 번째 예를 비교해보면 패턴 객체인 `charref`는 모두 동일한 역할을 합니다. 하지만 두번째처럼 주석을 적고 여러 줄로 표현하는 것이 가독성이 좋은 것을 알 수 있습니다.

`re.VERBOSE`옵션은 문자열에 사용된 whitespace가 컴파일시 제거되며, #을 이용해 주석문을 달 수 있습니다.

<br>

## 백슬래시 문제
정규표현식을 파이썬에서 사용할 때 혼란을 주는 요소가 있습니다. 바로 백슬래시인데요.

예를들어 `\section` 문자열을 찾기 위한 정규식을 만든다고 가정해봅시다.

우리의 의도와 달리 `\s`문자가 whitespace로 해석되어 의도한 대로 매치가 이루어지지 않습니다.
```angular2html
[ \t\n\r\f\v]ection
```
즉 이 것과 같은 의미를 가지게 됩니다.

우리가 의도한 결과를 얻기 위해선 다음과 같이 변경해줘야 됩니다.
```
\\section
```
그런데 파이썬에서는 파이썬 문자열 리터럴 규칙에 따라 `\\`이 `\`로 변경되어 `\section`이 전달됩니다.

따라서 우리가 원하는 결과를 얻기위해서 무려 `\\\\`처럼 백슬래시를 4개나 사용해야됩니다.

이러한 문제를 해결하기 위해 파이썬 정규식에는 Raw String 규칙이 생겨났습니다.
```angular2html
p = re.compile(r'\\section')
```
다음과 같이 `r`을 문자열 앞에 붙혀 Raw String임을 알려줄 수 있습니다.

<br>

### 정규표현식: 그룹
그룹화는 말 그대로 그룹으로 묶어주는 것입니다. 지금까지 사용했던 정규식들은 한 문자에만 적용됐습니다.
```angular2html
>>> re.findall('12+', '12 1212 1222')
['12', '12', '12', '1222']
```
`1212`와 같은 문자를 찾고 싶은데, `12`혹은 `1222`만 찾아지는 경우입니다. 즉 메타문자 `+`가 `2`에만 적용된 것입니다.

만약 우리가 `12`가 반복되는 문자를 찾고싶다면 `12`를 소괄호로 그룹화 시켜주면 됩니다.
```angular2html
print(re.match('(12)+', '1212'))
print(re.search('(12)+', '1212'))
print(re.findall('(12)+', '1212'))
print(re.fullmatch('(12)+', '1212'))
```
결과
```angular2html
<_sre.SRE_Match object; span=(0, 4), match='1212'>
<_sre.SRE_Match object; span=(0, 4), match='1212'>
['12']
<_sre.SRE_Match object; span=(0, 4), match='1212'>
```
우리가 원하는 `1212`를 잘 찾은 것을 볼 수 있습니다.
그런데 re.findall의 결과가 이상합니다. 어째서 `['12']`가 나온 것일까요??

이는 바로 괄호가 가진 다른 기능인 캡처 때문입니다.

<br>

### 정규표현식: 캡처
캡처란 원하는 부분만을 추출하고 싶을 때 사용하는 것입니다. 예를들어 `yyyy-mm-dd`와 같이 날짜를 나타내는 문자열 중 월, 일을 각각 따로 빼서 쓰고 싶다면 `mm`과 `dd`부분에 캡처기능을 사용하면 됩니다.

```angular2html
print(re.findall('\d{4}-(\d\d)-(\d\d)', '2028-07-28'))
print(re.findall('\d{4}-(\d\d)-(\d\d)', '1999/05/21 2018-07-28 2019.01.01'))
```
결과
```angular2html
[('07', '28')]
[('07', '28')]
```
정규식의 내용과 일치하고, 월과 일에 해당하는 부분만 따로 빠졌음을 알 수 있습니다.

<br>

### groups()
기존에 match객체에서 일치되는 문자열을 반환하는 `group()`메서드를 알아봤었습니다.
`group()`과는 다르게 `groups()`메서드는 명시적으로 캡처(`()`로 감싼 부분)한 부분을 반환합니다.

```angular2html
>>> m = re.search('\d{4}-(\d?\d)-(\d?\d)', '1868-12-10')
>>> print(m)
<_sre.SRE_Match object; span=(0, 10), match='1868-12-10'>
>>> print(m.group())
1868-12-10
>>> print(m.groups())
('12', '10')
```
이처럼 캡처시킨 부분을 반환시키는 것을 볼 수 있습니다. 또한 `group()`메서드로 부터 캡처된 내용을 추출할 수도 있습니다.
```angular2html
m.group(): 1868-12-10
m.group(0): 1868-12-10
m.group(1): 12
m.group(2): 10
m.groups(): ('12', '10')
```

<br>

### 비 캡처 그룹
그렇다면 그룹화를 위해 소괄호를 반드시 써야 되는데, 굳이 캡처하고 싶지는 않을 때가 있습니다. 그럴 경우에 바로 비캡쳐그룹을 사용합니다.

비캡처그룹은 `(?:<regex>)`와 같이 사용됩니다. 아까 원하는 결과였던 `1212`대신 `12`가 출력됐던 예제를 다시 가져와 적용시켜보겠습니다.

기존 코드
```angular2html
>>> print(re.findall('(12)+', '1212'))
['12']
```
변경 코드
```angular2html
>>> print(re.findall('(?:12)+', '1212'))
['1212']
```
이런 식으로 비 캡처 그룹을 생성시켜 원하는 결과를 얻을 수 있습니다.

<br>

### \(숫자): 앞서 일치된 문자열을 다시 비교
앞뒤가 똑같은 세글자 단어를 찾아봅시다. ex)토마토, ABA

이를 위해선 조금 전 사용했던 캡처가 꼭 필요합니다. 하지만 캡처된 문자열을 접근하기 위해선 한번의 match 과정이 필요했습니다.

하지만 정규식 내에서 캡처된 그룹에 접근하는 방법도 존재합니다. 바로 `\(숫자)`입니다.
`\ `이후에 등장하는 숫자번호(N)가 바로 캡처 그룹의 번호로 즉 N번째의 그룹을 재참조한다는 의미입니다.

예시를 하나 살펴보겠습니다.
```angular2html
>>> print(re.search(r'(\w)\w\1', '토마토 ABC aba xyxy ').group())
토마토
>>> print(re.findall(r'(\w)\w\1', '토마토 ABC aba xyxy '))
['토', 'a', 'x']
```
첫번째는 우리가 원하는 답이지만 search는 하나밖에 찾지 못하므로 완벽한 답이 아닙니다.

두번째 또한 `()`에 의해서 캡처 그룹만을 반환돼 우리가 원하지 않는 결과를 보입니다.

이런 문제를 해결하기 위해서 캡처를 하나 더 만들어 줍니다.
```angular2html
>>> print(re.findall(r'((\w)\w\2)', '토마토 ABC aba xyxy '))
['토마토', 'aba', 'xyx']
```
여기서 재참조부가 `\2`인 이유는 우리가 참조해야될 `(\w)`그룹이 바깥 괄호로 인해 두번째 그룹으로 변경됐기 때문입니다.
따라서 우리는 `\1`이 아닌 `\2`를 입력해줘야 됩니다.

이러한 `\1`, `\2`와 같은 것들을 비 명명 그룹이라고 합니다.

<br>

### 명명 그룹
`\(숫자)`와 같은 방법은 간편하지만 눈에 잘 들어오지 않습니다.

많은 프로그래밍 언어의 정규표현식은 명명 그룹 기능을 지원합니다.
언어마다 쓰는 방법이 다르지만, 파이썬 기준으로는 `(?P<name>regex)`형식으로 씁니다.

이번에도 예시를 하나 살펴보겠습니다.
```angular2html
match_obj = re.match(
    r'(?P<year>\d{4})-(?P<month>\d\d)-(?P<day>\d\d) (?P=year)\.(?P=month)\.(?P=day)',
    '2018-07-28 2018.07.28')

print(match_obj.group())
print(match_obj.groups())
print(match_obj.group(1))
```
결과
```angular2html
2018-07-28 2018.07.28
('2018', '07', '28')
2018
```
이런 식으로 기존 비명명 방식은 그룹의 번호를 지정해줘야 됐지만, 명명그룹은 하나의 변수처럼 그룹을 정의해 재참조해가며 사용할 수 있습니다.

<br>

### 정규표현식: 치환
파이썬의 `replace`메서드는 정규식 패턴에 대응하는 문자열을 찾아주지 못합니다. 따라서 `re.sub`메서드가 필요합니다.
```angular2html
>>> print(re.sub(pattern='Gorio', repl='Ryan', count=2, \
             string='Gorio, Gorio, Gorio keep a straight face.'))
Ryan, Ryan, Gorio keep a straight face.
```
`re.sub`메서드의 파라미터를 살펴보겠습니다. 
```angular2html
pattern: 매치시킬 패턴 
repl: 변경할 문자
string: 적용 문자열
count: 치환개수(최대값)
```
번외로 `re.subn`메서드는 치환된 문자열과 더불어 치환된 개수의 튜플을 반환합니다.
```angular2html
('Ryan, Ryan, Gorio keep a straight face.', 2)
```

`re.sub`에 이전에 보았던 `\(숫자)`를 이용할 수도 있습니다.
```angular2html
>>> print(re.sub('(\d{4})-(\d{2})-(\d{2})', 
             r'\1.\2.\3',
             '1900-01-01'))
1900.01.01
```
yyyy-mm-dd 형식을 yyyy.mm.dd 형식으로 변경됐습니다. 비명명방식이 된다면 명명방식도 가능하겠죠??

```angular2html
>>> print(re.sub('(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})',
             '\g<year>.\g<month>.\g<day>',
             '1900-01-01'))
1900.01.01
```

<br>

### 정규표현식: split
`re.sub`말고도 유용한 함수인 `re.split`입니다. 이 메서드는 파이썬 문자열의 기본 메서드인 `split`과 매우 유사합니다.
```angular2html
>>> print(re.split('<[^<>]*>',
               '<html> Wow <head> header </head> <body> Hey </body> </html>'))
['', ' Wow ', ' header ', ' ', ' Hey ', ' ', '']
```
정규식에 일치하는 부분을 기준으로 split이 되는 것을 볼 수 있습니다.

<br>

### 정규표현식: 연산을 섞은 치환
`re.sub`를 쓸 때 일치부에 나타나지도 않고, literal text에도 나타나지 않는 문자열로 치환하고 싶은 경우가 있을 수 있습니다.

`re.sub`는 인자 repl을 받을때 함수로도 받을 수 있습니다. 함수는 인자로 match 객체를 받으며 문자열을 반환해야 합니다.

예를 들어 소수로 표현된 숫자를 찾은다음 퍼센티지로 변환하는 것을 정규식으로 써보겠습니다.
```angular2html
def convert_percentage(match_obj):
    number = float(match_obj.group())
    return str(number * 100) + '%'

print(re.sub(pattern=r'\b0\.\d+\b',
             repl=convert_percentage,
             string='Red 0.250, Green 0.001, Blue 0.749, Black 1.5'))
```
결과
```angular2html
Red 25.0%, Green 0.1%, Blue 74.9%, Black 1.5
```

<br>

### 정규표현식: 조건문
정규표현식도 까다롭지만 조건문을 만들어 줄 수 있습니다. 정규표현식에서의 조건문은 다음과 같습니다.

조건문은, 캡처 그룹을 사용해 앞에서 문자열이 일치되었는지 아닌지에 따라 다음 부분에서는 다른 일치 조건을 제시해야 할 때 쓰입니다.
```angular2html
(?(숫자)맞으면|아니면)
```
여기서 숫자는 캡처와 비슷합니다. 앞에서 재참조부를 쓸 때 `\1`과 같이 썼는데, 조건문에서는 단지 `(1)`로 바뀐 것입니다.

예시로, `(a)?b(?(1)c|d)`를 살펴보겠습니다. 이건 `abc|bd`와 같습니다.
1. 먼저 `a`를 검사합니다. 만약 찾는 문자열에 ‘a’가 있으면 첫 번째 명시적 캡처에는 ‘a’가 들어가고, ‘a’가 없으면, 빈 문자열이 (1)에 저장됩니다.
2. 다음으로 `b`입니다. 만약 'b'가 없으면 정규식은 일치하지 않습니다. 'b'가 있다고 가정하겠습니다.
3. `(?(1)c|d)` 이 조건문은 (1)에 값이 존재하면 c, 존재하지 않으면 d를 뜻합니다. 즉 a가 존재했었다면 `abc`가 완성되고, a가 존재하지 않았다면 `bd`가 완성됩니다.

<br>

# reference
- https://greeksharifa.github.io/  
- https://wikidocs.net/4308
