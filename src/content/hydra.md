---
title: 'Hydra'
author: [Soohwan Kim]
tags: [toolkit]
image: img/hydra.png
date: '2020-12-28T10:00:00.000Z'
draft: false
---
  
## Hydra: framework for elegantly configuring complex applications
  
Facebook Research에서 공개한 오픈소스. 복잡한 Configuration을 간단하고 깔끔하게 정리할 수 있는 장점이 있습니다.  
히드라(Hydra)라는 이름은 여러개의 유사한 작업을 수행할 수 있다는 점에서 하나의 몸에 여러 머리를 가진 히드라라는 이름으로 명명됐습니다.   

## Installation  
  
- Install Command
  
```
pip install hydra-core --upgrade
```
***

## Tutorials  
  
***
    
### A simple command-line app  
  
가장 간단한 버젼의 hydra 사용법입니다.  
  
- my_app.py
  
```python
from omegaconf import DictConfig, OmegaConf
import hydra

@hydra.main()
def my_app(cfg: DictConfig) -> None:
    print(OmegaConf.to_yaml(cfg))

if __name__ == "__main__":
    my_app()
```
    
위의 예제 같이 다른 설정없이 실행한다면, Hydra는 아무것도 담지 않은 `cfg` 객체를 반환합니다.  
  
`+` 인자로 기존에 없던 config를 커맨드라인에서 추가해서 사용할 수 있습니다.    
  
```
$ python my_app.py +db.driver=mysql +db.user=omry +db.password=secret
db:
  driver: mysql
  user: omry
  password: secret
```

***  
  
### Specifying a config file  
  
위의 방법과 같이 모든 아규먼트를 일일이 타이핑하는 것은 굉장히 지루하고 실수하기 쉬운 방법입니다. 이런 불편함을 해소하기 위해 YAML 포맷으로 config를 관리하는 방법이 있습니다.  
  
- config.yaml
  
```yaml
db: 
  driver: mysql
  user: omry
  password: secret
```
    
yaml 포맷을 이용하는 경우 아까 위의 예제에서 `@hydra,main()`에 `config_name` 인자에 경로만 넘겨주면 됩니다.  
  
- my_app.py
  
```
@hydra.main(config_name='config')
def my_app(cfg):
    print(OmegaConf.to_yaml(cfg))
```
  
이렇게 config 파일 경로만 설정해주면 `config.yaml` 파일이 자동으로 로드되어 프로그램이 실행됩니다.  
  
```
$ python my_app.py
db:
  driver: mysql
  user: omry
  password: secret
```
  
***
  
### Using the config object
  
Hydra를 통해 얻은 `cfg`는 omegaconf 모듈의 DictConfig 객체입니다. 아래는 이러한 DictConfig를 다루는 간단한 예제입니다.  
  
- config.yaml
  
```yaml
node:                         # Config is hierarchical
  loompa: 10                  # Simple value
  zippity: ${node.loompa}     # Value interpolation
  do: "oompa ${node.loompa}"  # String interpolation
  waldo: ???                  # Missing value, must be populated prior to access
```
  
- my_app.py
  
```python
@hydra.main(config_name="config")
def my_app(cfg: DictConfig):
    assert cfg.node.loompa == 10          # attribute style access
    assert cfg["node"]["loompa"] == 10    # dictionary style access

    assert cfg.node.zippity == 10         # Value interpolation
    assert isinstance(cfg.node.zippity, int)  # Value interpolation type
    assert cfg.node.do == "oompa 10"      # string interpolation

    cfg.node.waldo                        # raises an exception
```
  
Outputs:
  
```
$ python my_app.py 
Missing mandatory value: waldo
        full_key: waldo
        reference_type=Optional[Dict[Any, Any]]
        object_type=dict
```
  
***
  
### Puttuing it all together
  
소프트웨어가 복잡할수록 configuraion의 구조도 역시 복잡해집니다. 예를 들면 아래와 같은 구조가 있을 수 있습니다.  
  
- Directory layout
  
```
├── conf
│   ├── config.yaml
│   ├── db
│   │   ├── mysql.yaml
│   │   └── postgresql.yaml
│   ├── schema
│   │   ├── school.yaml
│   │   ├── support.yaml
│   │   └── warehouse.yaml
│   └── ui
│       ├── full.yaml
│       └── view.yaml
└── my_app.py
```
  
위 구조는 총 12가지의 가능한 조합이 있습니다. composition이 없다면 이런 복잡한 소프트웨어의 configs를 관리하는건 굉장히 복잡하지만, hydra에서는 아래와 같이 간단하게 선택하여 사용할 수 있습니다.  
  
- config.yaml
  
```
defaults:
  - db: mysql
  - ui: full
  - schema: school
```
  
***
  
### Multi-run  
  
어떤 함수나 프로그램을 config 별로 실험을 해야할 때 유용하게 쓸 수 있는 방법입니다. Parameter sweep이라고 하는 이 기능은 `--multirun` or `-m` 플래그로 사용할 수 있습니다.  
  
```
$ python my_app.py -m schema=warehouse,support,school
```
  
위와 같이 -m 옵션을 주고 `,`로 분리된 리스트를 넘겨주면 해당 파라미터에 대해 sweep을 진행합니다.
  
```
 $ python my_app.py schema=warehouse,support,school db=mysql,postgresql -m
[2019-10-01 14:44:16,254] - Launching 6 jobs locally
[2019-10-01 14:44:16,254] - Sweep output dir : multirun/2019-10-01/14-44-16
[2019-10-01 14:44:16,254] -     #0 : schema=warehouse db=mysql
[2019-10-01 14:44:16,321] -     #1 : schema=warehouse db=postgresql
[2019-10-01 14:44:16,390] -     #2 : schema=support db=mysql
[2019-10-01 14:44:16,458] -     #3 : schema=support db=postgresql
[2019-10-01 14:44:16,527] -     #4 : schema=school db=mysql
[2019-10-01 14:44:16,602] -     #5 : schema=school db=postgresql
```
  
***
  
### Output / Working directory
  
프로그램을 돌리게되면 프로그램의 결과 혹은 로그를 저장하기 위해 output 경로를 지정해주는게 일반적인데, Hydra는 따로 지정해주지 않아도 매번 `YYYY-MM-DD/H-M-S` 형식으로 output 디렉토리에 저장해줍니다.    
  
- 프로그램의 output 저장
- Hydra output 저장 (Configuration, logs, etc..)
  
```python
import os
from omegaconf import DictConfig

@hydra.main()
def my_app(cfg: DictConfig) -> None:
    print("Working directory : {}".format(os.getcwd()))

$ python my_app.py
Working directory : /home/omry/dev/hydra/outputs/2019-09-25/15-16-17

$ python my_app.py
Working directory : /home/omry/dev/hydra/outputs/2019-09-25/15-16-19
```
  
Ouput:

```
$ tree outputs/2019-09-25/15-16-17
outputs/2019-09-25/15-16-17
├── .hydra
│   ├── config.yaml
│   ├── hydra.yaml
│   └── overrides.yaml
└── my_app.log
```
  
Output / Working directory 기능을 사용하지 않으려면 `hydra.output_subdir`를 `null`로 지정하면 됩니다.  
  
***
  
### Logging
  
많은 사람들이 log 설정하기가 귀찮아서 파이썬에서 로그 기능을 사용하지 않는 경우가 많은데, hydra에서는 이러한 로그의 기본 설정을 이미 해뒀기 때문에 아래와 같이 손쉽게 사용 가능합니다.
  
```python
import logging
from omegaconf import DictConfig
import hydra
  
# A logger for this file
log = logging.getLogger(__name__)

@hydra.main()
def my_app(_cfg: DictConfig) -> None:
    log.info("Info level message")
    log.debug("Debug level message")

if __name__ == "__main__":
    my_app()

$ python my_app.py
[2019-06-27 00:52:46,653][__main__][INFO] - Info level message
``` 

