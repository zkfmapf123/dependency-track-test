const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

// 취약점이 있는 패키지들 import
const jwt = require('jsonwebtoken');
const underscore = require('underscore');
const marked = require('marked');
const minimist = require('minimist');
const serialize = require('serialize-javascript');
const forge = require('node-forge');

// 더 많은 취약점이 있는 패키지들
const mem = require('mem');
const tar = require('tar');
const mqtt = require('mqtt');
const decodeUri = require('decode-uri-component');
const postcss = require('postcss');
const handlebars = require('handlebars');
const urlParse = require('url-parse');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory 데이터베이스
let users = [];
let posts = [];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'DependencyTrack 테스트 서버',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      external: '/api/external'
    }
  });
});

// Users API
app.get('/api/users', (req, res) => {
  res.json({
    total: users.length,
    users: _.orderBy(users, ['createdAt'], ['desc'])
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name과 email은 필수입니다.' });
  }
  
  const newUser = {
    id: uuidv4(),
    name,
    email,
    createdAt: moment().toISOString()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/users/:id', (req, res) => {
  const user = _.find(users, { id: req.params.id });
  if (!user) {
    return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  }
  res.json(user);
});

// Posts API
app.get('/api/posts', (req, res) => {
  res.json({
    total: posts.length,
    posts: _.orderBy(posts, ['createdAt'], ['desc'])
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title과 content는 필수입니다.' });
  }
  
  const newPost = {
    id: uuidv4(),
    title,
    content,
    authorId,
    createdAt: moment().toISOString()
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.get('/api/posts/:id', (req, res) => {
  const post = _.find(posts, { id: req.params.id });
  if (!post) {
    return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
  }
  res.json(post);
});

// External API 호출 예제
app.get('/api/external', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    res.json({
      message: '외부 API 호출 성공',
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      error: '외부 API 호출 실패',
      message: error.message
    });
  }
});

// JWT 토큰 생성 (취약점이 있는 jsonwebtoken 사용)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const token = jwt.sign({ username }, 'secret-key');
  res.json({ token });
});

// Markdown 파싱 (취약점이 있는 marked 사용)
app.post('/api/markdown', (req, res) => {
  const { content } = req.body;
  const html = marked(content);
  res.json({ html });
});

// Underscore 사용
app.get('/api/util', (req, res) => {
  const data = [1, 2, 3, 4, 5];
  const result = underscore.shuffle(data);
  res.json({ result });
});

// serialize-javascript 사용 (XSS 취약점)
app.post('/api/serialize', (req, res) => {
  const { data } = req.body;
  const serialized = serialize(data);
  res.json({ serialized });
});

// node-forge 사용 (암호화)
app.post('/api/encrypt', (req, res) => {
  const { message } = req.body;
  const md = forge.md.sha256.create();
  md.update(message);
  const hash = md.digest().toHex();
  res.json({ hash });
});

// decode-uri-component 사용
app.get('/api/decode', (req, res) => {
  const { uri } = req.query;
  const decoded = decodeUri(uri);
  res.json({ decoded });
});

// handlebars 템플릿 사용 (XSS 취약점)
app.post('/api/template', (req, res) => {
  const { template, data } = req.body;
  const compiled = handlebars.compile(template);
  const html = compiled(data);
  res.json({ html });
});

// url-parse 사용
app.get('/api/parse-url', (req, res) => {
  const { url } = req.query;
  const parsed = urlParse(url);
  res.json(parsed);
});

// mem 캐시 사용
const cachedFunc = mem((x) => x * 2);
app.get('/api/cache', (req, res) => {
  const result = cachedFunc(10);
  res.json({ result });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '서버 오류가 발생했습니다.',
    message: err.message
  });
});

// Minimist 사용 (옵션 파싱)
const args = minimist(process.argv.slice(2));

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📝 API 문서: http://localhost:${PORT}/`);
  console.log(`🔐 경로 옵션:`, args);
  
  // 취약점이 있는 패키지들 로드 확인
  console.log('⚠️  취약점 테스트를 위해 다음 패키지들을 사용합니다:');
  console.log('   - jsonwebtoken (버전 8.x.x - 알고리즘 없이 검증 가능)');
  console.log('   - underscore (버전 1.9.x - 오래된 버전)');
  console.log('   - marked (버전 0.8.x - XSS 취약점 존재)');
  console.log('   - minimist (버전 0.2.x - 프로토타입 오염 취약점)');
  console.log('   - serialize-javascript (버전 4.x.x - XSS 취약점)');
  console.log('   - node-forge (버전 0.10.x - 오래된 버전)');
  console.log('   - decode-uri-component (버전 0.2.x - XSS 취약점)');
  console.log('   - handlebars (버전 4.7.x - XSS 취약점)');
  console.log('   - url-parse (버전 1.5.x - 경로 정규화 우회)');
  console.log('   - postcss, tar, mem, mqtt, terser 등 추가 취약점 패키지들...');
});
