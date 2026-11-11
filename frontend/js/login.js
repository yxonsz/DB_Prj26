
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
    }

    try {
        // 서버에 로그인 요청
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('로그인 성공! 메인 화면으로 이동합니다.');
            window.location.replace('/index.html');
        } else {
            alert(result.message);
        }       

    } catch (error) {
        console.error('로그인 요청 오류:', error);
        alert('서버와 연결할 수 없습니다.');
    }
});
