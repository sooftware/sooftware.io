---
title: 'React 기반 개인 웹페이지 배포하기 (gatsby)'
author: [Soohwan Kim]
tags: [toolkit, web]
image: img/gatsby.png
date: '2021-09-22T10:00:00.000Z'
draft: false
---
  
## React 기반 개인 웹페이지 배포하기  
  
이번 글에서는 react를 이용해서 개인 웹페이지 제작부터 웹페이지 배포, 그리고 자신이 원하는 도메인 이름으로 적용까지를 다뤄보겠습니다.  
지금 보시는 `sooftware.io`와 같은 홈페이지를 제작하는 방법이라고 생각하시면 될 것 같습니다.  
  
## React 기반 오픈소스 찾기  
  
<img src="https://user-images.githubusercontent.com/42150335/134343629-3e301e42-50de-43e5-ba18-ab13582e931c.png" width="400">
  
리액트는 자바스크립트 라이브러리의 하나로서 간단히 말하면 react 기반으로 웹페이지를 만들면 
스마트폰 어플리케이션에서도 보기 좋게 나오게 해주는 좋은 라이브러리라고 보시면 됩니다.  
  
코드를 하나만 짜면 웹, 앱이 한 번에 해결되기 때문에 최근에는 많은 분들이 react 기반으로 웹페이지를 제작하는 경우가 많은 것 같습니다.  
  
react를 잘 다루시는 개발자라면 개인 웹페이지 만드는것쯤은 뚝-딱 만드시겠지만, 꼭 웹개발자 분들만 개인 웹페이지를 만들고 싶으신 건 아니기 때문에, 
react를 하나도 모르더라도 지금 보시는 페이지와 같은 개인 웹페이지를 만드는 방법에 대해 알아볼까 합니다.  
  
다행히도 깃허브에 `react-blog` 정도의 키워드만 검색하더라도 상당히 많은 코드를 볼 수 있습니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134343925-24160a6a-5d85-4954-a38a-f32289376680.png" width="500">  
  
저희는 이 중 [`gatsby-casper`](https://github.com/scttcper/gatsby-casper) 라는 오픈소스를 이용해보겠습니다.  
  
많은 블로그 테마를 찾아봤는데, 디자인이 마음에 안 들거나, 커스터마이징이 어렵거나, 이미지 삽입이 어렵다거나 하는 애로사항이 있었는데, 
이 테마는 디자인, 커스터마이징, 이미지 삽입 등이 손쉽다는 장점이 있습니다.  
  
특히 몇몇 테마는 이미지 삽입시 400x400 사이즈만 지원한다던가 하는 등 기능적으로 아쉬운 부분이 많았는데, 해당 테마는 어떤 사이즈의 이미지던지 
알아서 조절해주는 점 등이 편리했습니다.  
  
해당 테마는 [이곳](https://gatsby-casper.netlify.app/) 에서 데모 사이트를 구경하실 수 있습니다.  
  
이 외에도 개인적으로 마음에 들었던 사이트들을 아래에 정리했습니다.  
  
- https://mldangelo.com/about/
- https://gatsby-starter-personal-blog.greglobinski.com/
- https://riyazweb.dev/
- https://www.ryan-floyd.com/
- https://www.mehdibha.codehub.tn/
  
## 환경설정
  
해당 테마를 적용하기 위해서는 `nodejs`와 `npm` 설치가 필요합니다.   
  
- Nodejs & NPM 정의
  
```
Node.js®는 Chrome V8 JavaScript 엔진으로 빌드된 JavaScript 런타임입니다.
Node.js는 이벤트 기반, Non 블로킹 I/O 모델을 사용해 가볍고 효율적입니다. 
Node.js의 패키지 생태계인 npm은 세계에서 가장 큰 오픈 소스 라이브러리 생태계이기도 합니다.
```
  
위와 같이 정의가 되어 있긴 한데, 쉽게 말하면 `nodejs`는  JavaScript 기반으로 구성된 서버 사이드 서비스를 JavaScript로 구현할 수 있게 만든 런타임이고, `npm`은 `nodejs` 기반의 모듈을 모아둔 집합 저장소이다.
  
### Nodejs & NPM 설치
  
`Nodejs`와 `npm`은 [여기](https://nodejs.org/en/)서 다운로드 가능합니다.  
  
- Node js & npm 설치 확인
  
```
$ node -v
v14.17.6
$ npm -v
6.14.15
```
  
위 명령어를 실행했을 때, 정상적으로 버젼이 나오면 설치가 완료된 겁니다.
  
### Gatsby 설치
  
`Gatsby`란 React 기반의 정적 페이지 생성 프레임워크입니다. 여기서는 지금 당장 필요한 라이브러리 중 하나 정도로 생각하고 넘어갑시다.
  
```
$ npm install -g gatsby-cli
```
  
해당 명령어 실행시 가끔 npm audit 어쩌고 하는 글이 나오면서 설치가 실패할 수가 있습니다.  
그러면 아래 명령어로 실행하면 됩니다.  
  
```
$ npm install -g gatsby-cli --no-audit
```
  
## Quick Start
  
환경설정이 완료됐으면, 이제 실제로 코드를 실행해봅시다.  
  
먼저 git을 이용해서 해당 코드를 clone 합니다. (git 설치는 스킵)  
  
```
$ cd $WORKING_DIRECTORY
$ git clone https://github.com/scttcper/gatsby-casper.git
$ cd gatsby-casper
```
  
다음은 해당 웹페이지 구성에 필요한 requirements를 설치합니다.  
  
```
$ npm install --no-audit
```
  
설치가 완료되면 웹페이지를 실행합니다.  
  
```
$ npm start
```
  
해당 명령어까지 문제없이 실행됐다면 http://localhost:8000/ 로 접속하면 아래와 같은 화면을 볼 수 있습니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134347816-a5bd9336-dda5-4b90-8935-2355675391a2.png" width="700">
  
## Customizing
  
이제는 해당 웹페이지를 본인 스타일로 커스터마이징 해봅시다.  
  
### 1. 대문 이미지 & 글 수정
  
<img src="https://user-images.githubusercontent.com/42150335/134353098-994b95e9-6a61-45f8-9955-57779101cbe5.png" width="600">
  
먼저 저 `ghost`, `The professional publishing platform`라고 써져 있는 부분을 커스터마이징 해봅시다.  
  
`$CASPER_GATSBY_DIR/src/website-config.ts` 파일을 엽니다.  
아래로 내리다보면 아래 같은 코드가 있습니다.  
  
```javascript
const config: WebsiteConfig = {
  title: 'Ghost',
  description: 'The professional publishing platform',
  coverImage: 'img/blog-cover.png',
  logo: 'img/ghost-logo.png',
  lang: 'en',
  siteUrl: 'https://gatsby-casper.netlify.com',
  facebook: 'https://www.facebook.com/ghost',
  twitter: 'https://twitter.com/tryghost',
  showSubscribe: true,
  mailchimpAction:
    'https://twitter.us19.list-manage.com/subscribe/post?u=a89b6987ac248c81b0b7f3a0f&amp;id=7d777b7d75',
  mailchimpName: 'b_a89b6987ac248c81b0b7f3a0f_7d777b7d75',
  mailchimpEmailFieldName: 'MERGE0',
  googleSiteVerification: 'GoogleCode',
  footer: 'is based on Gatsby Casper',
  showAllTags: true,
};
```
  
- `title`: 웹 페이지 탭에 뜨는 텍스트
- `description`: 대문에 나오는 description 텍스트
- `coverImage`: 대문 배경 이미지
- `logo`: description 위에 있는 이미지 (ghost라고 써져 있는 이미지)

등등 위 내용을 본인이 원하는대로 수정해주시면 됩니다.  
  
### 2. NavBar 수정  
  
<img src="https://user-images.githubusercontent.com/42150335/134353166-00a2913d-d72a-4281-a640-bbd73818353e.png" width="600">  
  
페이지 상단에 있는 메뉴를 커스터마이징 해봅시다.  
해당 내용은 `$CASPER_GATSBY_DIR/src/header/SiteNav.tsx`에서 수정 가능합니다.  
  
해당 파일에서 `nav-current`를 검색하면 아래 코드들이 나옵니다.  
  
```javascript
<li role="menuitem">
  <Link to="/" activeClassName="nav-current">
    Home
  </Link>
</li>
<li role="menuitem">
  <Link to="/about" activeClassName="nav-current">
    About
  </Link>
</li>
<li role="menuitem">
  <Link to="/tags/getting-started/" activeClassName="nav-current">
    Getting Started
  </Link>
</li>
```
  
딱 보면 아시겠지만, 위에 있는 Home, About, Getting Started를 눌렀을 때 어느 링크로 보낼지에 대한 내용이 있는 코드입니다.  
`/`는 베이스 링크 기준이므로 `/about`은 베이스링크 + about 링크입니다. (제 사이트에서는 sooftware.io/about/)  
  
저 링크에 www.google.com 등 어떤 링크를 넣어도 동작합니다.
  
### 3. Social Link 수정
  
<img src="https://user-images.githubusercontent.com/42150335/134353245-c9549b8e-ace0-4c34-b5e9-3ac4487401db.png" width="600">
  
이 테마를 보면 페이스북, 트위터 favicon을 볼 수 있습니다.  
해당 favicon을 누르면 정해진 링크로 이동됩니다.  
이 링크를 깃허브, 페이스북, 링크드인으로 바꿔보겠습니다.  
  
`$CASPER_GATSBY_DIR/src/website-config.ts` 파일을 수정합시다.  
`WebsiteConfig` 클래에 github, linkedin을 추가하고 twitter는 날려버립시다.    
  
- Before
  
```typescript
export interface WebsiteConfig {
    ...
    facebook?: string;
    /**
     * full url, no username
     */
    twitter?: string;
    ...
}
```

- After

```typescript
export interface WebsiteConfig {
    ...
    facebook?: string;
    /**
    * full url, no username
    */
    github?: string;
    /**
    * full url, no username
    */
    linkedin?: string;
    ...
}
```
  
그리고 같은 파일 아래쪽에 `WebsiteConfig` 변수를 다음과 같이 수정합니다.  
```typescript
const config: WebsiteConfig = {
  ...
  facebook: 'https://www.facebook.com/sooftware95',
  github: 'https://www.github.com/sooftware',
  linkedin: 'https://www.linkedin.com/in/Soo-hwan/',
  ...
};
```
  
먼저 favicon을 쉽게 가져오기 위해 `react-icons`를 설치합니다.  
  
```
$ npm install react-icons --no-audit
```
  
`$CASPER_GATSBY_DIR/src/header/SiteNav.tsx`의 아래 코드를 수정합니다.  
  
- Before
```javascript
import { Facebook } from '../icons/facebook';
import { Twitter } from '../icons/twitter';
```
  
- After
```javascript
import { FaFacebook, FaGithub, FaLinkedinIn } from 'react-icons/fa';
```
  
그리고 밑으로 내려서 아래 코드를 다음과 같이 수정합시다.
  
- Before
  
```typescript
{config.twitter && (
    <a
      css={SocialLink}
      href={config.twitter}
      title="Twitter"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Twitter />
    </a>
)}
```
  
- After
  
```typescript
{config.github && (
    <a
      css={SocialLink}
      href={config.github}
      title="Github"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaGithub />
    </a>
)}
```
  
그럼 아래같이 깃허브, 링크드인이 추가된 것을 볼 수 있습니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134356415-3459fecd-5dc2-4085-9d8a-621cf23ebf91.png" width="600">  
  
이러한 favicon들은 https://react-icons.github.io/react-icons/ 가면 제공되는 icon들을 확인할 수 있습니다.
  
<img src="https://user-images.githubusercontent.com/42150335/134357055-838e95b0-f7e7-4192-ba8e-efd46fe721d3.png" width="600">
    
### 4. 포스트 수정
  
<img src="https://user-images.githubusercontent.com/42150335/134357244-b605c591-4fec-4a3d-9979-a51b03cf4291.png" width="600">  
  
다음으로 포스팅을 추가/수정 해봅시다.  
  
`$CASPER_GATSBY_DIR/src/content/`에 가면 현재 올라와있는 포스트 관련한 마크다운 파일과 이미지 폴더가 있습니다.  
  
해당 마크다운 파일 맨 위에 아래와 같은 형식만 유지하고 아래는 기존 마크다운 문법을 유지해서 글을 작성하면 됩니다.  
  
```
---
title: '2020년 회고'
author: [Soohwan Kim]
tags: [retrospect]
image: img/2020.png
date: '2020-12-31T10:00:00.000Z'
draft: false
---
```
  
위 형식에는 포스트의 타이틀, 작성자 및 작성 날짜와 대표 이미지 등을 설정할 수 있습니다.
  
## Github 업로드
  
커스터마이징까지 완료했으면 해당 파일들을 깃허브에 업로드합니다.  
꼭 깃허브에 업로드해야되는 것은 아닙니다만, 현재 글에서는 배포와 업데이트의 편리을 위해 깃허브 업로드를 추천드립니다.    
  
  
깃허브 업로드는 생략하겠습니다.
    
## Deployment (배포)
  
커스터마이징까지 완료했으면 이제 해당 페이지를 배포해봅시다.  
자신이 가진 컴퓨터로 블로그 서버를 이용해도 되지만 일반적으로는 cpu 서버를 대여해서 배포합니다.  
  
AWS, GCP 등이 대표적입니다만, 최근에는 [Netlify](https://app.netlify.com/)라는 서비스를 이용하면 쉽게 웹페이지 배포가 가능합니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134358858-20d8cdba-5a8c-4577-ab01-2f86cca8fd45.png" width="500">
  
Netlify 홈페이지에서 우측 상단에 Sign up 버튼을 눌러 회원가입을 합니다.  
이미 회원이신 분들은 Log in 버튼으로 로그인하시면 되겠습니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134358989-ffc79e5a-6e70-477f-8a3e-70b179e44aa5.png" width="500">  
  
이 때 깃허브 아이디와 연동해서 가입하면 여러가지로 편리하기 때문에 깃허브 아이디가 있으시다면 깃허브와 연동하는 것을 추천합니다.  
  
가입 및 이메일 인증까지 끝내가 netlify로 들어가게 되면 아래 화면으로 접속됩니다.
  
<img src="https://user-images.githubusercontent.com/42150335/134359237-05cae5a6-145b-48d8-bfa9-aafae9b9b367.png" width="600">  
  
저기서 우리는 New site from Git 버튼을 눌러줍니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134359972-c02b0bca-490b-451f-b5a1-da1c17ab0820.png" width="500">  
  
그러면 위와 같은 화면이 뜨게 됩니다.  
여기서 GitHub를 선택하고 레포를 선택해줍니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134360288-adfeb583-ecac-4db1-b0ec-ec7a5a35f0e4.png" width="500">  
  
그렇게 설정을 하고 다시 netlify 기본 페이지로 돌아오면 위와 같은 deploy 목록에 하나가 뜨게 됩니다.  
  
오른쪽 `>` 버튼을 누르면 deploy 진행 상황에 대한 log를 볼 수 있습니다.  
  
log에서 아래와 같이 `Netlify Build Complete`가 뜨게 되면 성공적으로 배포에 성공한겁니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134361914-d75e2f7d-dc1d-4830-987b-1ae5980f7313.png" width="400">  
  
배포에 성공하고 deploy한 프로젝트에 들어가면 아래 화면의 `https://sooftware.io`가 적혀있는 쪽에 본인만의 사이트 링크가 있을겁니다.  
저는 커스텀 도메인을 적용했기 때문에 저런 링크가 뜨지만 따로 적용하지 않은 경우 `https://[PROJECT_NAME].netlify.app` 형식으로 웹페이지 주소가 형성됩니다.
  
<img src="https://user-images.githubusercontent.com/42150335/134362178-74d1c716-464e-4007-a6c0-6f5cfceab1f4.png" width="400">

  
## Custom Domain
  
이제 배포한 웹페이지 주소를 커스텀 도메인으로 설정해봅시다.  
도메인을 사용하기 위해서는 도메인 구입이 필요합니다.  
  
저는 hosting.kr이라는 사이트에서 도메인을 구입했습니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134363042-35854d97-6d71-41f3-a290-428dcd881bb2.png" width="600">  
  
위 사이트의 `검색할 도메인을 입력하세요` 쪽에 원하는 도메인을 입력하면 해당 도메인 사용여부 및 가격이 나오게 됩니다.  
  
아래는 sooftware를 검색했을 때의 결과입니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134363258-4ade15f5-b221-4fb3-86bb-59637c33f3c8.png" width="400">  
  
원하는 도메인을 구입하고 나면 다시 netlify로 돌아갑니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134363707-9f2e0b3c-ee59-4af5-a233-5cff179d98fe.png" width="500">  
  
위 페이지에서 `Domatin setting`을 들어갑니다.  
  
<img src="https://user-images.githubusercontent.com/42150335/134363947-7b4d54ee-4567-4b42-90aa-a4f65b389728.png" width="500">  
  
여기서 Add domain alias로 구입한 도메인 링크를 추가하고 몇 가지 인증 절차만 수행해주게 되면 sooftware.io 와 같은 커스텀 도메인이 적용이 되게됩니다.
    
## Reference

- https://github.com/scttcper/gatsby-casper