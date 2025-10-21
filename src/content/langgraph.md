---
layout: post
title: LangGraph로 구현하는 RAG 시스템 실습
image: img/langgraph.png
author:
  - Soohwan Kim
date: 2024-05-01T10:00:00.000Z
tags:
  - langchain
  - langgraph
  - openai
  - rag
excerpt:
---
# LangGraph로 구현하는 Self-Correcting RAG 시스템

이번 실습에서는 LangGraph를 활용하여 스스로 품질을 검증하고 개선하는 고급 RAG 시스템을 만듭니다.  
각 단계마다 품질을 체크하고, 문제가 있으면 자동으로 수정하는 시스템입니다!

## 목차

- [0. 환경 설정](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#0-%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95)
- [1. Self-Correcting RAG 개요](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#1-self-correcting-rag-%EA%B0%9C%EC%9A%94)
- [2. 데이터 준비](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#2-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A4%80%EB%B9%84)
- [3. State 정의](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#3-state-%EC%A0%95%EC%9D%98)
- [4. 노드 함수 구현](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#4-%EB%85%B8%EB%93%9C-%ED%95%A8%EC%88%98-%EA%B5%AC%ED%98%84)
- [5. 라우팅 함수 정의](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#5-%EB%9D%BC%EC%9A%B0%ED%8C%85-%ED%95%A8%EC%88%98-%EC%A0%95%EC%9D%98)
- [6. 그래프 구성](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#6-%EA%B7%B8%EB%9E%98%ED%94%84-%EA%B5%AC%EC%84%B1)
- [7. 실행 및 테스트](https://claude.ai/chat/b18974d7-558c-4ce8-a784-a7e50f7b6ba6#7-%EC%8B%A4%ED%96%89-%EB%B0%8F-%ED%85%8C%EC%8A%A4%ED%8A%B8)

---

## 0. 환경 설정

### 필요한 라이브러리 설치

```bash
pip install langgraph langchain langchain-openai langchain-community chromadb openai python-dotenv
```

- `company_info.json`

```json
[
  {
    "id": "company_overview",
    "topic": "회사 소개",
    "content": "테크노바는 2020년에 설립된 AI 기반 솔루션을 제공하는 스타트업입니다. 서울 강남구에 본사를 두고 있으며, 현재 직원 수는 약 50명입니다."
  },
  {
    "id": "main_product",
    "topic": "주력 제품",
    "content": "우리의 주력 제품은 'SmartAssist'라는 AI 챗봇 플랫폼입니다. 고객 서비스 자동화와 업무 효율성 향상을 위한 솔루션을 제공합니다."
  },
  {
    "id": "ceo_info",
    "topic": "대표이사",
    "content": "김철수 대표는 카이스트에서 인공지능을 전공했으며, 이전에 네이버에서 AI 연구원으로 근무했습니다. 10년 이상의 AI 개발 경험을 보유하고 있습니다."
  },
  {
    "id": "office_location",
    "topic": "사무실 위치",
    "content": "본사는 서울특별시 강남구 테헤란로 123에 위치해 있습니다. 지하철 2호선 강남역에서 도보 5분 거리이며, 15층에 사무실이 있습니다."
  },
  {
    "id": "work_hours",
    "topic": "근무 시간",
    "content": "근무 시간은 오전 9시부터 오후 6시까지이며, 코어타임은 오전 10시부터 오후 4시까지입니다. 주 5일 근무제를 시행하고 있습니다."
  },
  {
    "id": "benefits",
    "topic": "복지 제도",
    "content": "직원들에게 최신형 맥북 프로와 듀얼 모니터를 제공하며, 점심 식대 지원, 간식 무제한 제공, 연 1회 워크샵, 도서 구입비 지원 등의 복지를 제공합니다."
  },
  {
    "id": "tech_stack",
    "topic": "기술 스택",
    "content": "백엔드는 Python FastAPI와 Django를 사용하고, 프론트엔드는 React와 TypeScript를 사용합니다. AI 모델 학습에는 PyTorch를 주로 사용합니다."
  },
  {
    "id": "team_structure",
    "topic": "팀 구조",
    "content": "회사는 크게 개발팀, 디자인팀, 영업팀, 마케팅팀으로 구성되어 있습니다. 개발팀이 가장 크며 약 30명의 엔지니어가 근무하고 있습니다."
  },
  {
    "id": "funding",
    "topic": "투자 유치",
    "content": "2023년에 시리즈 A 라운드에서 50억원의 투자를 유치했습니다. 주요 투자사는 카카오벤처스와 네이버 D2SF입니다."
  },
  {
    "id": "clients",
    "topic": "주요 고객사",
    "content": "현재 삼성전자, LG전자, 현대자동차 등 대기업을 포함해 총 100여개의 고객사를 보유하고 있습니다."
  }
]
```

### 라이브러리 Import

```python
import os
import json
from dotenv import load_dotenv
from typing import TypedDict, Literal

# LangChain 관련
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document

# LangGraph 관련
from langgraph.graph import StateGraph, END

# 환경 변수 로드
load_dotenv()

print("✅ 환경 설정 완료!")
```

---

## 1. Self-Correcting RAG 개요

### 일반 RAG vs Self-Correcting RAG

#### 일반 RAG (3강):

```
질문 → 검색 → 답변 생성 → 끝
```

#### Self-Correcting RAG (4강):

```
질문 → 질문 평가 → ❌ → 질문 재작성 → 다시 평가
         ↓ ✅
       검색 → 검색 평가 → ❌ → 쿼리 재작성 → 다시 검색
         ↓ ✅
     답변 생성 → 답변 평가 → ❌ → 문제 진단 → 해당 단계 복귀
         ↓ ✅
       최종 답변
```

### 일반 RAG의 한계

#### 1. 부정확한 검색

- **문제**: "우리 회사 휴가 정책은?" → 근무시간 문서 검색됨
- **원인**: 질문이 모호하거나 임베딩 매칭 실패
- **결과**: 잘못된 문서 기반 답변

#### 2. 관련 없는 문서 검색

- **문제**: 질문과 무관한 문서가 상위 검색됨
- **원인**: 키워드는 유사하지만 맥락이 다름
- **결과**: "문서에서 찾을 수 없습니다" (있는데도!)

#### 3. 불완전한 답변

- **문제**: 검색은 잘 됐는데 답변이 부정확
- **원인**: LLM이 문서를 잘못 해석하거나 환각(Hallucination)
- **결과**: 신뢰할 수 없는 답변

#### 4. 컨텍스트 부족

- **문제**: 여러 문서를 조합해야 하는 질문
- **원인**: Top-K 검색으로 중요한 문서 누락
- **결과**: 불완전한 답변

### Self-Correcting RAG의 해결책

✅ **자동 검증 및 재시도**

- 각 단계마다 품질 검증
- 실패 시 자동으로 재시도
- 최적의 결과 도출

✅ **적응형 검색**

- 검색 실패 시 쿼리 재작성
- 다양한 검색 전략 시도
- 관련성 점수 기반 필터링

✅ **답변 검증**

- 생성된 답변의 정확성 평가
- 문서와의 일치도 확인
- 환각 방지

---

## 2. 데이터 준비

### 벡터 스토어 로드

```python
# JSON 파일에서 데이터 로드
with open('company_info.json', 'r', encoding='utf-8') as f:
    company_data = json.load(f)

# Document 객체로 변환
documents = []
for item in company_data:
    doc = Document(
        page_content=f"주제: {item['topic']}\n내용: {item['content']}",
        metadata={"id": item["id"], "topic": item["topic"]}
    )
    documents.append(doc)

# 임베딩 및 벡터 스토어
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="company_info"
)

retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})

# LLM 초기화
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

print(f"✅ 준비 완료! 문서 수: {vectorstore._collection.count()}")
```

---

## 3. State 정의

Self-Correcting RAG의 모든 상태를 관리하는 State를 정의합니다.

```python
class SelfCorrectingRAGState(TypedDict):
    """Self-Correcting RAG 워크플로우 상태"""
    # 입력
    original_question: str  # 원본 질문
    
    # 질문 처리
    current_question: str  # 현재 처리 중인 질문 (재작성될 수 있음)
    question_quality: str  # "good" or "bad"
    question_rewrite_count: int  # 질문 재작성 횟수
    
    # 검색 처리
    search_query: str  # 검색 쿼리
    retrieved_docs: list  # 검색된 문서들
    retrieval_quality: str  # "relevant" or "irrelevant"
    search_retry_count: int  # 검색 재시도 횟수
    
    # 답변 처리
    answer: str  # 생성된 답변
    answer_quality: str  # "good" or "bad"
    problem_diagnosis: str  # 문제 진단 결과
    
    # 제어
    max_retries: int  # 최대 재시도 횟수
```

---

## 4. 노드 함수 구현

### Step 1: 질문 평가 노드

```python
def evaluate_question(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """질문이 명확하고 구체적인지 평가합니다."""
    question = state["current_question"]
    
    evaluation_prompt = f"""
다음 질문이 명확하고 구체적인지 평가해주세요.

질문: "{question}"

평가 기준:
1. 질문이 무엇을 묻는지 명확한가?
2. 문맥 없이도 이해 가능한가?
3. 회사 정보에 대한 질문인가?

"good" 또는 "bad" 중 하나로만 답변하세요.
""".strip()
    
    response = llm.invoke(evaluation_prompt)
    quality = response.content.strip().lower()
    
    if "good" in quality:
        quality = "good"
    else:
        quality = "bad"
    
    print(f"🔍 [질문 평가] {question}")
    print(f"   결과: {quality}")
    
    return {
        **state,
        "question_quality": quality
    }
```

### Step 2: 질문 재작성 노드

```python
def rewrite_question(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """질문을 더 명확하고 구체적으로 재작성합니다."""
    question = state["current_question"]
    
    rewrite_prompt = f"""다음 질문을 더 명확하고 구체적으로 재작성해주세요.

원본 질문: "{question}"

재작성 시 고려사항:
1. 회사 정보를 묻는 것이 명확하게 드러나도록
2. 애매한 표현 제거
3. 구체적인 정보 요청으로 변환

재작성된 질문만 답변하세요.
"""
    
    response = llm.invoke(rewrite_prompt)
    rewritten = response.content.strip()
    
    print(f"✏️ [질문 재작성]")
    print(f"   원본: {question}")
    print(f"   재작성: {rewritten}")
    
    return {
        **state,
        "current_question": rewritten,
        "question_rewrite_count": state.get("question_rewrite_count", 0) + 1
    }
```

### Step 3: 문서 검색 노드

```python
def retrieve_documents(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """벡터 DB에서 관련 문서를 검색합니다."""
    query = state.get("search_query") or state["current_question"]
    
    docs = retriever.invoke(query)
    
    print(f"📚 [문서 검색] 쿼리: {query}")
    print(f"   검색된 문서 수: {len(docs)}")
    for i, doc in enumerate(docs, 1):
        print(f"   {i}. {doc.metadata.get('topic', 'N/A')}")
    
    return {
        **state,
        "retrieved_docs": docs,
        "search_query": query
    }
```

### Step 4: 검색 결과 평가 노드

```python
def evaluate_retrieval(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """검색된 문서가 질문과 관련있는지 평가합니다."""
    question = state["current_question"]
    docs = state["retrieved_docs"]
    
    docs_content = "\n\n".join([f"문서 {i+1}: {doc.page_content[:100]}..." 
                                 for i, doc in enumerate(docs)])
    
    evaluation_prompt = f"""다음 질문에 대해 검색된 문서들이 관련성이 있는지 평가해주세요.

질문: "{question}"

검색된 문서들:
{docs_content}

평가 기준:
1. 문서에 질문에 답할 수 있는 정보가 포함되어 있는가?
2. 문서와 질문의 주제가 일치하는가?

"relevant" 또는 "irrelevant" 중 하나로만 답변하세요.
"""
    
    response = llm.invoke(evaluation_prompt)
    quality = response.content.strip().lower()
    
    if "relevant" in quality:
        quality = "relevant"
    else:
        quality = "irrelevant"
    
    print(f"✅ [검색 평가] 결과: {quality}")
    
    return {
        **state,
        "retrieval_quality": quality
    }
```

### Step 5: 검색 쿼리 재작성 노드

```python
def rewrite_search_query(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """더 나은 검색 결과를 위해 쿼리를 재작성합니다."""
    question = state["current_question"]
    previous_query = state.get("search_query", question)
    
    rewrite_prompt = f"""검색 결과가 부적절했습니다. 더 나은 검색 결과를 위해 쿼리를 재작성해주세요.

원본 질문: "{question}"
이전 검색 쿼리: "{previous_query}"

재작성 시 고려사항:
1. 핵심 키워드 강조
2. 동의어나 관련 용어 포함
3. 더 구체적인 표현 사용

재작성된 검색 쿼리만 답변하세요.
"""
    
    response = llm.invoke(rewrite_prompt)
    new_query = response.content.strip()
    
    print(f"🔄 [쿼리 재작성]")
    print(f"   이전: {previous_query}")
    print(f"   재작성: {new_query}")
    
    return {
        **state,
        "search_query": new_query,
        "search_retry_count": state.get("search_retry_count", 0) + 1
    }
```

### Step 6: 답변 생성 노드

```python
def generate_answer(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """검색된 문서를 바탕으로 답변을 생성합니다."""
    question = state["current_question"]
    docs = state["retrieved_docs"]
    
    context = "\n\n".join([doc.page_content for doc in docs])
    
    answer_prompt = f"""당신은 회사 정보를 안내하는 전문 AI 어시스턴트입니다.
아래 컨텍스트를 바탕으로 질문에 정확하고 친절하게 답변해주세요.

컨텍스트:
{context}

질문: {question}

답변:"""
    
    response = llm.invoke(answer_prompt)
    answer = response.content
    
    print(f"💬 [답변 생성] 완료")
    
    return {
        **state,
        "answer": answer
    }
```

### Step 7: 답변 평가 노드

```python
def evaluate_answer(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """생성된 답변의 품질을 평가합니다."""
    question = state["current_question"]
    answer = state["answer"]
    
    evaluation_prompt = f"""다음 답변의 품질을 평가해주세요.

질문: "{question}"
답변: "{answer}"

평가 기준:
1. 질문에 직접적으로 답변하는가?
2. 컨텍스트의 정보를 정확히 사용했는가?
3. 답변이 구체적이고 유용한가?
4. 환각(hallucination)이 없는가?

"good" 또는 "bad" 중 하나로만 답변하세요.
"""
    
    response = llm.invoke(evaluation_prompt)
    quality = response.content.strip().lower()
    
    if "good" in quality:
        quality = "good"
    else:
        quality = "bad"
    
    print(f"⭐ [답변 평가] 결과: {quality}")
    
    return {
        **state,
        "answer_quality": quality
    }
```

### Step 8: 문제 진단 노드

```python
def diagnose_problem(state: SelfCorrectingRAGState) -> SelfCorrectingRAGState:
    """답변에 문제가 있을 때, 어디에서 문제가 발생했는지 진단합니다."""
    question = state["current_question"]
    docs = state["retrieved_docs"]
    answer = state["answer"]
    
    docs_summary = "\n".join([f"- {doc.metadata.get('topic', 'N/A')}" for doc in docs])
    
    diagnosis_prompt = f"""답변에 문제가 있습니다. 어디에서 문제가 발생했는지 진단해주세요.

질문: "{question}"
검색된 문서들:
{docs_summary}
생성된 답변: "{answer}"

다음 중 하나를 선택하세요:
1. "question_issue" - 질문 자체에 문제가 있음 (애매하거나 불명확)
2. "retrieval_issue" - 검색된 문서가 부적절함
3. "generation_issue" - 답변 생성 과정에서 문제 발생

진단 결과만 답변하세요 (question_issue, retrieval_issue, generation_issue 중 하나).
"""
    
    response = llm.invoke(diagnosis_prompt)
    diagnosis = response.content.strip().lower()
    
    if "question" in diagnosis:
        diagnosis = "question_issue"
    elif "retrieval" in diagnosis:
        diagnosis = "retrieval_issue"
    else:
        diagnosis = "generation_issue"
    
    print(f"🔧 [문제 진단] {diagnosis}")
    
    return {
        **state,
        "problem_diagnosis": diagnosis
    }
```

---

## 5. 라우팅 함수 정의

각 평가 결과에 따라 어디로 갈지 결정하는 함수들입니다.

```python
def route_after_question_eval(state: SelfCorrectingRAGState) -> str:
    """질문 평가 후 라우팅"""
    if state["question_quality"] == "good":
        return "retrieve"
    elif state.get("question_rewrite_count", 0) >= state.get("max_retries", 2):
        return "retrieve"  # 최대 재시도 도달, 그냥 진행
    else:
        return "rewrite_question"


def route_after_retrieval_eval(state: SelfCorrectingRAGState) -> str:
    """검색 평가 후 라우팅"""
    if state["retrieval_quality"] == "relevant":
        return "generate"
    elif state.get("search_retry_count", 0) >= state.get("max_retries", 2):
        return "generate"  # 최대 재시도 도달, 그냥 진행
    else:
        return "rewrite_query"


def route_after_answer_eval(state: SelfCorrectingRAGState) -> str:
    """답변 평가 후 라우팅"""
    if state["answer_quality"] == "good":
        return "end"
    else:
        return "diagnose"


def route_after_diagnosis(state: SelfCorrectingRAGState) -> str:
    """문제 진단 후 라우팅"""
    diagnosis = state["problem_diagnosis"]
    
    if diagnosis == "question_issue":
        return "rewrite_question"
    elif diagnosis == "retrieval_issue":
        return "rewrite_query"
    else:  # generation_issue
        return "generate"  # 답변만 다시 생성
```

---

## 6. 그래프 구성

모든 노드와 라우팅을 연결하여 완전한 Self-Correcting RAG 그래프를 만듭니다.

```python
from IPython.display import Image, display

# 그래프 생성
workflow = StateGraph(SelfCorrectingRAGState)

# 노드 추가
workflow.add_node("evaluate_question", evaluate_question)
workflow.add_node("rewrite_question", rewrite_question)
workflow.add_node("retrieve", retrieve_documents)
workflow.add_node("evaluate_retrieval", evaluate_retrieval)
workflow.add_node("rewrite_query", rewrite_search_query)
workflow.add_node("generate", generate_answer)
workflow.add_node("evaluate_answer", evaluate_answer)
workflow.add_node("diagnose", diagnose_problem)

# 시작점 설정
workflow.set_entry_point("evaluate_question")

# 엣지 연결
# 1. 질문 평가 → 조건부 분기
workflow.add_conditional_edges(
    "evaluate_question",
    route_after_question_eval,
    {
        "retrieve": "retrieve",
        "rewrite_question": "rewrite_question"
    }
)

# 2. 질문 재작성 → 다시 평가
workflow.add_edge("rewrite_question", "evaluate_question")

# 3. 검색 → 검색 평가
workflow.add_edge("retrieve", "evaluate_retrieval")

# 4. 검색 평가 → 조건부 분기
workflow.add_conditional_edges(
    "evaluate_retrieval",
    route_after_retrieval_eval,
    {
        "generate": "generate",
        "rewrite_query": "rewrite_query"
    }
)

# 5. 쿼리 재작성 → 다시 검색
workflow.add_edge("rewrite_query", "retrieve")

# 6. 답변 생성 → 답변 평가
workflow.add_edge("generate", "evaluate_answer")

# 7. 답변 평가 → 조건부 분기
workflow.add_conditional_edges(
    "evaluate_answer",
    route_after_answer_eval,
    {
        "end": END,
        "diagnose": "diagnose"
    }
)

# 8. 문제 진단 → 조건부 분기 (해당 단계로 복귀)
workflow.add_conditional_edges(
    "diagnose",
    route_after_diagnosis,
    {
        "rewrite_question": "rewrite_question",
        "rewrite_query": "rewrite_query",
        "generate": "generate"
    }
)

# 컴파일
app = workflow.compile()

print("✅ Self-Correcting RAG 그래프 구성 완료!")

display(Image(app.get_graph().draw_mermaid_png()))
```

### 워크플로우 구조:

```
[시작]
  ↓
[질문 평가] → bad? → [질문 재작성] → [질문 평가]
  ↓ good
[문서 검색]
  ↓
[검색 평가] → irrelevant? → [쿼리 재작성] → [문서 검색]
  ↓ relevant
[답변 생성]
  ↓
[답변 평가] → bad? → [문제 진단] → question? → [질문 재작성]
  ↓ good              ↓              retrieval? → [쿼리 재작성]
[종료]                                generation? → [답변 생성]
```

---

## 7. 실행 및 테스트

### 헬퍼 함수

```python
def ask_with_self_correction(question: str, max_retries: int = 2):
    """Self-Correcting RAG로 질문에 답변"""
    print("\n" + "="*80)
    print(f"💭 원본 질문: {question}")
    print("="*80 + "\n")
    
    initial_state = {
        "original_question": question,
        "current_question": question,
        "question_quality": "",
        "question_rewrite_count": 0,
        "search_query": "",
        "retrieved_docs": [],
        "retrieval_quality": "",
        "search_retry_count": 0,
        "answer": "",
        "answer_quality": "",
        "problem_diagnosis": "",
        "max_retries": max_retries
    }
    
    # 실행
    result = app.invoke(initial_state)
    
    print("\n" + "="*80)
    print(f"✨ 최종 답변:")
    print(f"{result['answer']}")
    print("="*80)
    print(f"\n📊 통계:")
    print(f"  - 질문 재작성 횟수: {result['question_rewrite_count']}")
    print(f"  - 검색 재시도 횟수: {result['search_retry_count']}")
    print(f"  - 최종 질문: {result['current_question']}")
    
    return result
```

### 테스트 실행

```python
ask_with_self_correction("테크노바의 근무시간은 어떻게 돼?")
```

---

## 주요 특징

### 1. 다층 검증 시스템

- 질문 품질 검증
- 검색 결과 검증
- 답변 품질 검증

### 2. 자동 복구 메커니즘

- 문제 발생 시 자동 재시도
- 적절한 단계로 자동 복귀
- 최대 재시도 횟수 제한

### 3. 지능형 문제 진단

- 어느 단계에서 문제가 발생했는지 판단
- 문제에 맞는 해결책 적용
- 불필요한 재시도 방지

---

## 장단점

### 장점

✅ 높은 답변 품질  
✅ 자동 오류 수정  
✅ 투명한 프로세스  
✅ 확장 가능한 구조

### 단점

❌ 응답 시간 증가  
❌ 높은 토큰 사용량  
❌ 복잡한 로직  
❌ LLM 호출 빈도 증가

---

## 실전 활용 팁

### 1. 최대 재시도 횟수 조정

- 품질 우선: `max_retries=3`
- 속도 우선: `max_retries=1`

### 2. 평가 기준 커스터마이징

- 도메인별 평가 기준 추가
- 품질 임계값 설정

### 3. 캐싱 활용

- 동일 질문 결과 저장
- 검색 결과 재사용

### 4. 모니터링 추가

- 각 단계별 소요 시간 측정
- 재시도 빈도 분석
- 실패 원인 로깅

---

## 결론

Self-Correcting RAG는 일반 RAG의 한계를 극복하는 강력한 시스템입니다. 자동 검증과 수정 메커니즘을 통해 높은 품질의 답변을 제공하며, LangGraph의 유연한 구조로 쉽게 확장할 수 있습니다.

**핵심 포인트:**

- 각 단계마다 품질을 검증하고 필요시 자동으로 수정
- 문제 발생 지점을 정확히 진단하여 효율적으로 대응
- 최대 재시도 횟수 설정으로 무한 루프 방지
- 투명한 프로세스로 디버깅과 개선이 용이

이 시스템을 기반으로 도메인 특화 평가 기준을 추가하거나, 더 정교한 검색 전략을 구현할 수 있습니다!