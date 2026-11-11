const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
const userRouter = require('./routes/user');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(express.static(path.join(__dirname, '../frontend')));

// 회원 관련 API
app.use('/api/users', userRouter);

// 기본 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 데이터베이스 연결 테스트
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT NOW() AS currentTime');

        res.json({
            success: true,
            message: 'MySQL 연결 성공!',
            time: rows[0].currentTime
        });

    } catch (error) {
        console.error('DB 오류:', error.message);

        res.status(500).json({
            success: false,
            message: '데이터베이스 연결 실패'
        });
    }
});

app.listen(PORT, () => {
    console.log(`MOIM 서버 실행 중: http://localhost:${PORT}`);
});
