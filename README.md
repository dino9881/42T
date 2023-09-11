<div align="center">
  <img width="440" alt="스크린샷 2023-09-11 오후 2 47 09" src="https://github.com/dino9881/42T/assets/46983641/289c2144-8663-4e4f-b713-66bc66485e4c">
</div>

<h2 align="center">🏃 Developers</h2>
<div align="center">
  <a href="https://github.com/lamPolar">🍟 heeskim</a> | 
  <a href="https://github.com/dino9881">🦖 jonkim</a> | 
  <a href="https://github.com/YH-Yoo">🐚 yyoo</a> | 
  <a href="https://github.com/hani-j">🐹 hjeong</a> | 
  <a href="https://github.com/jjunhyuki">🚬 junhyuki</a>
</div>

## 📖 History
- 23/05/05 - 개발환경 dockerize
- 23/08/17 - 프로젝트 평가 완료
- 23/09/11 - 리팩터링 시작 및 리드미 작성

## 👩‍💻 Tech Stack
<h3 align="center">Common</h3>
<p align="center">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white"/>
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white"/>
</p>
<h3 align="center">FrontEnd</h3>
<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
</p>
<h3 align="center">BackEnd</h3>
<p align="center">
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
</p>

## 🚧 Structure
```
./
├── frontend/
│   ├── public/       # index
│   │   ├── avatar/   # avatar image files
│   │   ├── channel/  # channel icon files
│   │   ├── font/     # font files
│   │   ├── ranking/  # ranking page image files
│   │   └── img/      # image files
│   └── src/
│       ├── channel/  # channel view & logic
│       ├── chat/     # chat view & logic
│       ├── custom/   # custom view & logic
│       ├── dm/       # dm view & logic
│       ├── game/     # game view & logic
│       ├── login/    # login view & logic
│       ├── menu/     # menu view & logic
│       ├── ranking/  # ranking view & logic
│       └── sidebar/  # sidebar view & logic
└── backend/
    ├── prisma/       # database
    └── src/
        ├── auth/     # authentication for login
        ├── channel/  # socket based chat
        ├── config/   # environment variables
        ├── game/     # control game queue & game render
        ├── member/   # manage members
        ├── prisma/   # prisma ORM
        ├── socketIO/ # control socket access
        └── util/     # decorator & mail module & constants
```

</br>

## ❓ Usage

### ☝🏻 Clone git repository
```
$ git clone https://github.com/dino9881/42T.git
```

### ✌🏻 Fill in Environment Variables
You have to fill in the env values and change the file name from .env_sample to .env.
For example..

```
# Node Mailer Options 
MAIL_USER=[YOUR EMAIL ID]
MAIL_PASSWORD=[YOUR EMAIL APP PASSWORD]
MAIL_HOST=[YOUR EMAIL HOST]
MAIL_PORT=[YOUR EMAIL HOST PORT]
MAIL_FROM=[YOUR EMAIL FROM]
```

### 🖐 Execute
To run containers in the background mode...
```
$ make
```

See what is happening in the containers...
```
$ make log
```

## 🤝 Rule
### Commit Rules
```[part][type] : #(issue) title body```
ex) [FE][Fix] : #1234 로그인 페이지- 로그인이 안되는 버그 수정

#### commit part
- [FE] : frontend
- [BE] : backend
- [CM] : common

#### commit type
- [Feat] : 새로운 기능을 추가
- [Fix] : 버그 수정
- [Docs] : 문서 수정
- [Design] : CSS등 사용자 UI디자인 변경
- [Style] : 코드 수정 없이 코드의 포맷 변경(ex 세미콜론 누락)
- [Refactor] : 배포 코드 리팩토링
- [Comment] : 주석 추가 및 변경
- [Merge] : 풀리퀘스트 머지
- [Remove] : 파일 삭제 작업
- [Rename] : 파일 / 폴더 명 변경 또는 위치 이동
- [Test] : 테스트 코드 작성 및 리팩토링
