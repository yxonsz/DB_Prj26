
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: '모든 항목을 입력해주세요.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 8자 이상이어야 합니다.'
            });
        }

        // 이메일 중복 확인
        const [users] = await db.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );

        if (users.length > 0) {
            return res.status(409).json({
                success: false,
                message: '이미 사용 중인 이메일입니다.'
            });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 회원 정보 저장
        await db.query(
            `INSERT INTO users (user_name, email, password)
             VALUES (?, ?, ?)`,
            [userName, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다!'
        });

    } catch (error) {
        console.error('회원가입 오류:', error);

        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});


// 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '이메일과 비밀번호를 입력해주세요.'
            });
        }

        // 이메일로 회원 조회
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        const user = users[0];

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            });
        }

        // 로그인 세션 저장
        req.session.user = {
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email
        };

        res.json({
            success: true,
            message: '로그인에 성공했습니다!',
            user: req.session.user
        });

    } catch (error) {
        console.error('로그인 오류:', error);

        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});

module.exports = router;
