---
title: 'LangChain으로 구현하는 RAG 시스템 실습'
author: [Soohwan Kim]
tags: [langchain, rag, ai, llm, python]
image: img/langchain.png
date: '2025-10-10T10:00:00.000Z'
draft: false
---

# LangChain으로 구현하는 RAG 시스템 실습

이번 실습에서는 LangChain을 활용하여 완전한 RAG 시스템을 구축해봅니다.  
회사 정보를 담은 JSON 데이터를 기반으로 질문에 답변하는 AI 챗봇을 만들어볼게요!

## 0. 환경설정

### 필요한 라이브러리 설치

먼저 터미널에서 필요한 패키지들을 설치합니다.

```bash
pip install langchain langchain-openai langchain-community chromadb openai python-dotenv langsmith faiss-cpu
```

### 라이브러리 Import 및 API 키 설정

먼저 .env 파일을 생성하여 API 키를 관리합니다:

```
# .env 파일
OPENAI_API_KEY=sk-your-openai-api-key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls_your-langsmith-api-key
LANGCHAIN_PROJECT=langchain-rag-tutorial
```

```python
import os
import json
from dotenv import load_dotenv
try:
    from langsmith import traceable
    LANGSMITH_AVAILABLE = True
    print("✅ LangSmith 추적 활성화!")
except ImportError:
    LANGSMITH_AVAILABLE = False

# 환경 변수 로드
load_dotenv()

print("✅ 환경 설정 완료!")
```

**출력:**
```
✅ LangSmith 추적 활성화!
✅ 환경 설정 완료!
```

### 💡 LangSmith란?

LangSmith는 LangChain 애플리케이션의 실행을 추적하고 모니터링하는 도구입니다. 각 단계별 실행 시간, 입출력, 비용 등을 시각적으로 확인할 수 있어 디버깅과 최적화에 매우 유용합니다!  
LangSmith API 키는 https://smith.langchain.com에서 무료로 발급받을 수 있습니다.

## 1. 사전 준비 단계

### Document Loader (문서 로드)

이 단계에서는 외부 데이터 소스에서 필요한 문서를 로드하고 초기 처리를 합니다.  
이번 예제에서는 회사 정보를 담은 JSON 파일을 로드해서 진행해보겠습니다.

```python
# JSON 파일에서 데이터 로드
with open('company_info.json', 'r', encoding='utf-8') as f:
    company_data = json.load(f)

print(f"✅ 총 {len(company_data)}개의 데이터 로드 완료!")
print(f"\n첫 번째 데이터 예시:")
print(json.dumps(company_data[0], ensure_ascii=False, indent=2))
```

**출력:**
```
✅ 총 20개의 데이터 로드 완료!

첫 번째 데이터 예시:
{
  "id": "company_overview",
  "topic": "회사 소개",
  "content": "테크노바는 2020년에 설립된 AI 기반 솔루션을 제공하는 스타트업입니다. 서울 강남구에 본사를 두고 있으며, 현재 직원 수는 약 50명입니다."
}
```

### Document 객체로 변환

LangChain에서 사용할 수 있도록 데이터를 Document 형식으로 변환합니다.
Document는 page_content(본문)와 metadata(메타데이터)로 구성됩니다.

```python
from langchain.schema import Document

documents = []

for item in company_data:
    doc = Document(
        page_content=f"Topic: {item['topic']}\nContent: {item['content']}",
        metadata={
            "id": item["id"],
            "topic": item["topic"]
        }
    )
    documents.append(doc)

print(f"✅ {len(documents)}개의 Document 객체 생성 완료!\n")
print("첫 번째 Document 예시:")
print(f"내용: {documents[0].page_content}")
print(f"메타데이터: {documents[0].metadata}")
```

**출력:**
```
✅ 20개의 Document 객체 생성 완료!

첫 번째 Document 예시:
내용: Topic: 회사 소개
Content: 테크노바는 2020년에 설립된 AI 기반 솔루션을 제공하는 스타트업입니다. 서울 강남구에 본사를 두고 있으며, 현재 직원 수는 약 50명입니다.
메타데이터: {'id': 'company_overview', 'topic': '회사 소개'}
```

## 2. Text Splitting (텍스트 분할)

### 왜 텍스트를 분할하나요?

긴 문서를 그대로 사용하면 검색 정확도가 떨어집니다. 큰 책을 작은 챕터로 나누듯이, 문서를 적절한 크기의 청크(chunk)로 분할하면 더 정확한 검색이 가능합니다.

예를 들어, "회사 위치가 어디인가요?"라는 질문에 대해 전체 문서 대신 회사 정보만 담긴 작은 청크를 검색할 수 있습니다.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,      # 청크 하나당 최대 200자
    chunk_overlap=50,    # 청크 간 50자 겹침 (문맥 유지)
    length_function=len
)

splits = text_splitter.split_documents(documents)

print(f"✅ 텍스트 분할 완료!")
print(f"원본 문서 수: {len(documents)}")
print(f"분할 후 청크 수: {len(splits)}")
```

**출력:**
```
✅ 텍스트 분할 완료!
원본 문서 수: 20
분할 후 청크 수: 20
```

💡 **Tip:** 이 예시에서는 문서가 짧아 분할이 크게 일어나지 않지만, 실제로 긴 문서를 다룰 때는 여러 개의 청크로 나뉩니다.

## 3. Embedding (임베딩)

### 임베딩이란?

임베딩은 텍스트를 숫자 벡터로 변환하는 과정입니다. 컴퓨터는 텍스트의 의미를 직접 이해할 수 없기 때문에, 수치로 표현해야 합니다.  
비슷한 의미를 가진 텍스트는 벡터 공간에서 가까운 위치에 배치됩니다.

- "회사 위치" ≈ "사무실 주소"
- "대표 이름" ≈ "CEO는 누구"

```python
from langchain_openai import OpenAIEmbeddings

# OpenAI 임베딩 모델 초기화
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

# 테스트: 샘플 텍스트 임베딩
sample_text = "회사 위치가 어디인가요?"
sample_embedding = embeddings.embed_query(sample_text)

print(f"✅ 임베딩 모델 초기화 완료!")
print(f"\n샘플 텍스트: '{sample_text}'")
print(f"임베딩 벡터 차원: {len(sample_embedding)}")
print(f"임베딩 벡터 일부: {sample_embedding[:5]}")
```

**출력:**
```
✅ 임베딩 모델 초기화 완료!

샘플 텍스트: '회사 위치가 어디인가요?'
임베딩 벡터 차원: 1536
임베딩 벡터 일부: [0.015228848904371262, 0.012781930156052113, 0.05640791356563568, 0.05310242623090744, 0.013790748082101345]
```

## 4. Vector Store (벡터 저장소)

### Chroma DB에 저장하기

임베딩된 벡터들을 저장하고 검색할 수 있는 데이터베이스를 만듭니다.  
도서관의 색인 시스템과 비슷합니다. 책의 내용을 분류하고 저장해두면, 나중에 원하는 정보를 빠르게 찾을 수 있습니다.

```python
from langchain_community.vectorstores import Chroma

# 벡터 스토어 생성
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    collection_name="company_info",
    persist_directory="./chroma_db"  # 로컬에 저장
)

print(f"✅ Chroma 벡터 스토어 생성 완료!")
print(f"저장된 문서 수: {vectorstore._collection.count()}")
```

**출력:**
```
✅ Chroma 벡터 스토어 생성 완료!
저장된 문서 수: 40
```

💡 **Chroma의 장점:** 별도의 저장 명령 없이 persist_directory를 지정하면 자동으로 디스크에 저장됩니다!

⚠️ **주의:** 기존 DB가 있으면 스키마 충돌이 발생할 수 있으니, 처음 실행 시 기존 폴더를 삭제하거나 다른 collection_name을 사용하세요.

## 5. Retriever (검색기)

### 다양한 검색 방식 이해하기

Retriever는 질문과 가장 유사한 문서를 찾아주는 역할을 합니다.  
여러 가지 검색 옵션을 제공합니다.

### 방법 1: 기본 유사도 검색 (Similarity Search)

가장 유사한 상위 k개의 문서를 반환합니다.

```python
# 기본 Retriever 설정
retriever_basic = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}  # 상위 3개 문서 검색
)

print("✅ 기본 Retriever 설정 완료!")

# 테스트
test_query = "회사 팀은 어떻게 구성되어 있나요?"
retrieved_docs = retriever_basic.invoke(test_query)

print(f"\n테스트 질문: '{test_query}'")
print(f"검색된 문서 수: {len(retrieved_docs)}")
print(f"\n가장 관련성 높은 문서:")
print(retrieved_docs[0].page_content)
```

**출력:**
```
✅ 기본 Retriever 설정 완료!

테스트 질문: '회사 팀은 어떻게 구성되어 있나요?'
검색된 문서 수: 3

가장 관련성 높은 문서:
회사는 크게 개발팀, 디자인팀, 영업팀, 마케팅팀으로 구성되어 있습니다. 개발팀이 가장 크며 약 30명의 엔지니어가 근무하고 있습니다.
```

### 방법 2: 유사도 점수 임계값 검색 (Similarity Score Threshold)

일정 유사도 이상인 문서만 검색합니다. 관련성이 낮은 문서를 필터링할 때 유용합니다.

```python
# 유사도 임계값 Retriever
retriever_threshold = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "score_threshold": 0.3,  # 유사도 0.3 이상만 반환
        "k": 5  # 최대 5개까지
    }
)

print("✅ 유사도 임계값 Retriever 설정 완료!")

# 테스트
test_query = "회사의 주요 고객사는 어떻게 되나요?"
retrieved_docs = retriever_threshold.invoke(test_query)

print(f"\n테스트 질문: '{test_query}'")
print(f"유사도 0.3 이상인 문서 수: {len(retrieved_docs)}")
for i, doc in enumerate(retrieved_docs, 1):
    print(f"  [{i}] {doc.metadata.get('topic', 'N/A')}")
```

**출력:**
```
✅ 유사도 임계값 Retriever 설정 완료!

테스트 질문: '회사의 주요 고객사는 어떻게 되나요?'
유사도 0.3 이상인 문서 수: 1
  [1] 주요 고객사
```

### 방법 3: MMR (Maximum Marginal Relevance)

유사도가 높으면서도 다양성을 보장하는 검색 방식입니다. 비슷한 내용의 문서가 중복으로 검색되는 것을 방지합니다.

```python
# MMR Retriever
retriever_mmr = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 4,  # 최종적으로 4개 반환
        "fetch_k": 10,  # 먼저 10개를 가져온 후
        "lambda_mult": 0.5  # 다양성 조절 (0=다양성 우선, 1=유사도 우선)
    }
)

print("✅ MMR Retriever 설정 완료!")

# 테스트
test_query = "회사의 주요 고객사는 어떻게 되나요?"
retrieved_docs = retriever_mmr.invoke(test_query)

print(f"\n테스트 질문: '{test_query}'")
print(f"MMR로 검색된 다양한 문서들:")
for i, doc in enumerate(retrieved_docs, 1):
    print(f"  [{i}] {doc.metadata.get('topic', 'N/A')}")
```

**출력:**
```
✅ MMR Retriever 설정 완료!

테스트 질문: '회사의 주요 고객사는 어떻게 되나요?'
MMR로 검색된 다양한 문서들:
  [1] 주요 고객사
  [2] 팀 구조
  [3] 회사 문화
  [4] 복지 제도
```

### 이번 실습에서는 기본 유사도 검색을 사용하겠습니다.

```python
# 실습용 Retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

print("✅ 실습용 Retriever 설정 완료!")
```

**출력:**
```
✅ 실습용 Retriever 설정 완료!
```

## 6. LLM 초기화 및 프롬프트 작성

### ChatGPT 모델 설정

검색된 문서를 바탕으로 자연스러운 답변을 생성할 LLM을 초기화합니다.

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7
)

print("✅ LLM 모델 초기화 완료!")
```

**출력:**
```
✅ LLM 모델 초기화 완료!
```

### 프롬프트 템플릿 작성

RAG 시스템이 어떻게 답변할지 가이드를 제공하는 프롬프트 템플릿을 작성합니다.

```python
from langchain.prompts import PromptTemplate

prompt_template = """
당신은 회사 정보를 안내하는 친절한 AI 어시스턴트입니다.
제공된 컨텍스트를 기반으로 질문에 답변해주세요.
컨텍스트에 정보가 없다면 "죄송하지만 해당 정보는 제공되지 않았습니다"라고 답변하세요.
답변은 친근하고 따뜻한 톤으로 작성해주세요.

컨텍스트:
{context}

질문: {question}

답변:
""".strip()

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

print("✅ 프롬프트 템플릿 작성 완료!")
```

**출력:**
```
✅ 프롬프트 템플릿 작성 완료!
```

## 7. RAG Chain 구성

### LCEL(LangChain Expression Language)로 체인 만들기

이제 파이프(|) 연산자를 사용하여 RAG 체인을 만들어봅시다.  
파이프 연산자는 데이터가 흐르는 방향을 명확하게 보여줍니다. 마치 공장의 컨베이어 벨트처럼 각 단계를 거쳐 최종 결과물이 만들어집니다!

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# RAG 체인 구성
rag_chain = (
    {
        "context": retriever,  # 질문과 관련된 문서 검색
        "question": RunnablePassthrough()  # 질문을 그대로 전달
    }
    | PROMPT  # 프롬프트 템플릿에 context와 question 삽입
    | llm  # LLM이 답변 생성
    | StrOutputParser()  # 문자열로 파싱
)

print("✅ RAG 체인 구성 완료!")
```

**출력:**
```
✅ RAG 체인 구성 완료!
```

### 데이터 흐름 이해하기:

```
사용자 질문
    ↓
① {"context": 검색된 문서들, "question": 원본 질문}
    ↓
② PROMPT (프롬프트에 context와 question이 들어감)
    ↓
③ LLM (답변 생성)
    ↓
④ StrOutputParser (문자열로 변환)
    ↓
최종 답변
```

💡 **LCEL이란?** LangChain Expression Language의 약자로, | 연산자로 각 단계를 연결하는 직관적인 방식입니다. 각 컴포넌트가 순서대로 실행되며, 앞 단계의 출력이 다음 단계의 입력으로 자동으로 전달됩니다!

### Invoke 메서드로 체인 실행하기

체인을 실행하는 방법은 여러 가지가 있습니다.

### 방법 1: invoke() - 단일 실행

가장 기본적인 실행 방법입니다.

```python
# 단일 질문 실행
question = "회사는 언제 설립되었나요?"
answer = rag_chain.invoke(question)

print(f"질문: {question}")
print(f"답변: {answer}")
```

**출력:**
```
질문: 회사는 언제 설립되었나요?
답변: 테크노바는 2020년에 설립되었습니다! 궁금한 점이 더 있으시면 언제든지 말씀해 주세요.
```

### 방법 2: batch() - 여러 질문 동시 실행

여러 질문을 한 번에 처리할 때 효율적입니다.

```python
# 여러 질문 동시 실행
questions = [
    "주력 제품은 무엇인가요?",
    "사무실은 어디에 있나요?",
    "근무 시간은 어떻게 되나요?"
]

answers = rag_chain.batch(questions)

for q, a in zip(questions, answers):
    print(f"\nQ: {q}")
    print(f"A: {a}")
```

**출력:**
```
Q: 주력 제품은 무엇인가요?
A: 우리의 주력 제품은 'SmartAssist'라는 AI 챗봇 플랫폼입니다. 이 플랫폼은 고객 서비스 자동화와 업무 효율성 향상을 위한 훌륭한 솔루션을 제공합니다. 더 궁금한 점이 있으시면 언제든지 말씀해 주세요!

Q: 사무실은 어디에 있나요?
A: 안녕하세요! 저희 사무실은 서울특별시 강남구 테헤란로 123에 위치해 있습니다. 지하철 2호선 강남역에서 도보로 약 5분 거리에 있으며, 15층에 있습니다. 언제든지 방문해 주세요! 😊

Q: 근무 시간은 어떻게 되나요?
A: 안녕하세요! 근무 시간은 오전 9시부터 오후 6시까지이며, 코어타임은 오전 10시부터 오후 4시까지입니다. 주 5일 근무제를 시행하고 있어요. 궁금한 점이 더 있으면 언제든지 말씀해 주세요!
```

### 방법 3: stream() - 스트리밍 응답

답변이 생성되는 과정을 실시간으로 볼 수 있습니다. ChatGPT처럼 글자가 하나씩 나타나는 효과를 만들 때 유용합니다.

```python
# 스트리밍 실행
question = "회사의 복지 제도는 어떤가요?"
print(f"질문: {question}")
print("답변: ", end="")

for chunk in rag_chain.stream(question):
    print(chunk, end="", flush=True)
print()
```

**출력:**
```
질문: 회사의 복지 제도는 어떤가요?
답변: 회사의 복지 제도는 정말 훌륭해요! 직원들에게 최신형 맥북 프로와 듀얼 모니터를 제공하고, 점심 식대를 지원하며 간식도 무제한으로 제공됩니다. 또한, 연 1회 워크샵과 도서 구입비 지원도 있어 직원들이 더욱 성장할 수 있도록 도와주고 있어요. 정말 든든한 지원이죠!
```

## 8. RAG 시스템 테스트

### 질문 함수 만들기

```python
def ask_question(question):
    """질문에 대한 답변과 출처를 출력하는 함수"""
    print(f"\n{'='*60}")
    print(f"❓ 질문: {question}")
    print(f"{'='*60}")
    
    # 답변 생성
    answer = rag_chain.invoke(question)
    
    # 검색된 문서 확인 (별도로 retriever 호출)
    retrieved_docs = retriever.invoke(question)
    
    print(f"\n💬 답변:\n{answer}")
    print(f"\n📚 참고한 문서:")
    for i, doc in enumerate(retrieved_docs, 1):
        print(f"\n  [{i}] {doc.metadata.get('topic', 'N/A')}")
        print(f"      {doc.page_content[:80]}...")
    
    return answer, retrieved_docs
```

### 다양한 질문으로 테스트

```python
# 테스트 1: 회사 소개
ask_question("회사 팀 구조는 어떻게 되나요?")
```

**출력:**
```
============================================================
❓ 질문: 회사 팀 구조는 어떻게 되나요?
============================================================

💬 답변:
회사의 팀 구조는 크게 개발팀, 디자인팀, 영업팀, 마케팅팀으로 구성되어 있어요. 그중에서도 개발팀이 가장 크며, 약 30명의 엔지니어가 함께 일하고 있답니다. 도움이 더 필요하시면 언제든지 말씀해 주세요!

📚 참고한 문서:

  [1] 팀 구조
      회사는 크게 개발팀, 디자인팀, 영업팀, 마케팅팀으로 구성되어 있습니다. 개발팀이 가장 크며 약 30명의 엔지니어가 근무하고 있습니다....

  [2] 팀 구조
      Topic: 팀 구조
Content: 회사는 크게 개발팀, 디자인팀, 영업팀, 마케팅팀으로 구성되어 있습니다. 개발팀이 가장 크며 약 30명의 ...

  [3] 회사 소개
      Topic: 회사 소개
Content: 테크노바는 2020년에 설립된 AI 기반 솔루션을 제공하는 스타트업입니다. 서울 강남구에 본사를 두고 있...
```

```python
# 테스트 2: 데이터에 있는 정보
ask_question("투자는 얼마나 받았나요?")
```

**출력:**
```
============================================================
❓ 질문: 투자는 얼마나 받았나요?
============================================================

💬 답변:
2023년에 시리즈 A 라운드에서 50억원의 투자를 유치했습니다! 정말 멋진 성과네요!

📚 참고한 문서:

  [1] 투자 유치
      Topic: 투자 유치
Content: 2023년에 시리즈 A 라운드에서 50억원의 투자를 유치했습니다. 주요 투자사는 카카오벤처스와 네이버 D...

  [2] 투자 유치
      2023년에 시리즈 A 라운드에서 50억원의 투자를 유치했습니다. 주요 투자사는 카카오벤처스와 네이버 D2SF입니다....

  [3] 성장 현황
      설립 이후 매년 100% 이상의 성장률을 기록하고 있으며, 2024년 목표 매출은 100억원입니다. 해외 진출도 계획하고 있습니다....
```

## 인터랙티브 채팅

### 대화형 인터페이스

```python
def interactive_chat():
    """사용자와 대화하는 인터랙티브 모드"""
    print("\n" + "="*60)
    print("🤖 RAG 챗봇이 준비되었습니다!")
    print("질문을 입력하세요. (종료하려면 'quit' 입력)")
    print("="*60 + "\n")
    
    while True:
        user_question = input("\n질문: ")
        
        if user_question.lower() in ['quit', 'exit', 'q', '종료']:
            print("\n챗봇을 종료합니다. 감사합니다! 👋")
            break
        
        if not user_question.strip():
            continue
        
        try:
            answer = rag_chain.invoke(user_question)
            print(f"\n🤖 답변: {answer}")
        except Exception as e:
            print(f"\n❌ 오류 발생: {str(e)}")

# 실행
interactive_chat()
```

**출력:**
```
============================================================
🤖 RAG 챗봇이 준비되었습니다!
질문을 입력하세요. (종료하려면 'quit' 입력)
============================================================

질문: 최근 성장 현황이 어떤가요?

🤖 답변: 안녕하세요! 최근 성장 현황에 대해 알려드릴게요. 설립 이후 매년 100% 이상의 성장률을 기록하고 있으며, 2024년 목표 매출은 100억원으로 설정되어 있습니다. 또한 해외 진출도 계획하고 있다는 긍정적인 소식이 있습니다. 더 궁금한 점이 있으시면 언제든지 말씀해 주세요!

질문: 투자쪽은 어때요?

🤖 답변: 안녕하세요! 투자 쪽에 대한 정보가 있어요. 2023년에 시리즈 A 라운드에서 50억원의 투자를 유치했답니다. 주요 투자사로는 카카오벤처스와 네이버 D2SF가 있죠. 더 궁금한 점이 있으시면 언제든지 물어보세요! 😊

질문: quit

챗봇을 종료합니다. 감사합니다! 👋
```

## 마무리

이번 실습에서는 LangChain을 사용하여 완전한 RAG 시스템을 구축해보았습니다. 주요 단계를 요약하면:

1. **Document Loading**: JSON 데이터를 LangChain Document 형식으로 변환
2. **Text Splitting**: 문서를 검색 가능한 청크로 분할
3. **Embedding**: 텍스트를 벡터로 변환
4. **Vector Store**: Chroma DB에 벡터 저장
5. **Retriever**: 유사도 기반 문서 검색
6. **LLM & Prompt**: GPT 모델과 프롬프트 설정
7. **RAG Chain**: LCEL로 전체 파이프라인 구성
8. **Testing**: 다양한 방식으로 시스템 테스트
