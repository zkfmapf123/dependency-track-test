# DependencyTrack 테스트 서버

DependencyTrack을 테스트하기 위한 간단한 Node.js Express 서버입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 서버 실행
npm start

# 개발 모드 (nodemon 사용)
npm run dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 1. 메인 페이지
```
GET /
```
서버 정보와 사용 가능한 엔드포인트 목록을 반환합니다.

### 2. 사용자 API
```
GET    /api/users      - 모든 사용자 조회
POST   /api/users      - 새 사용자 생성
GET    /api/users/:id  - 특정 사용자 조회
```

**POST 요청 예시:**
```json
{
  "name": "홍길동",
  "email": "hong@example.com"
}
```

### 3. 게시글 API
```
GET    /api/posts      - 모든 게시글 조회
POST   /api/posts      - 새 게시글 생성
GET    /api/posts/:id  - 특정 게시글 조회
```

**POST 요청 예시:**
```json
{
  "title": "제목",
  "content": "내용",
  "authorId": "user-id"
}
```

### 4. 외부 API 호출
```
GET    /api/external   - 외부 API 호출 예제
```

## 의존성 패키지

이 프로젝트는 다음 패키지들을 사용합니다:

- **express** - 웹 프레임워크
- **body-parser** - 요청 본문 파싱
- **cors** - CORS 지원
- **helmet** - 보안 헤더 설정
- **morgan** - HTTP 로깅
- **axios** - HTTP 클라이언트
- **lodash** - 유틸리티 라이브러리
- **moment** - 날짜 처리
- **uuid** - UUID 생성
- **bcryptjs** - 패스워드 해싱
- **dotenv** - 환경변수 관리
- **nodemon** - 개발용 자동 재시작

## DependencyTrack 설정

1. Docker로 DependencyTrack 실행:
```bash
docker run -d \
  --name dependency-track \
  -p 8080:8080 \
  -v ~/dependency-track:/data \
  --ulimit nofile=8192:8192 \
  dependencytrack/apiserver
```

2. DependencyTrack UI 접속: `http://localhost:8080`
3. 프로젝트 생성 및 SBOM 업로드

## 참고사항

이 서버는 테스트 목적으로 만들어진 간단한 예제입니다.
실제 프로덕션 환경에서는 데이터베이스, 인증, 에러 핸들링 등을 추가로 구현해야 합니다.

