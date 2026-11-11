const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // 입력값 확인
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

        // 비밀번호 해시 처리
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

        // 동시에 같은 이메일로 가입하는 경우도 처리
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: '이미 사용 중인 이메일입니다.'
            });
        }

        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});

module.exports = router;
