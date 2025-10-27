const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

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

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '서버 오류가 발생했습니다.',
    message: err.message
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📝 API 문서: http://localhost:${PORT}/`);
});

