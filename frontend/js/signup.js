
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const userName = document.getElementById('userName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordCheck = document.getElementById('passwordCheck').value;

    // 입력값 확인
    if (userName === '') {
        alert('이름을 입력해주세요.');
        return;
    }

    if (email === '') {
        alert('이메일을 입력해주세요.');
        return;
    }

    if (password.length < 8) {
        alert('비밀번호는 8자 이상 입력해주세요.');
        return;
    }

    if (password !== passwordCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        // 서버에 회원가입 요청
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName,
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            signupForm.reset();
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error('회원가입 요청 오류:', error);
        alert('서버와 연결할 수 없습니다.');
    }
});
