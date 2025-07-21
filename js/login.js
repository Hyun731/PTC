document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, password })
        });

        const data = await response.json();
        console.log('서버 응답:', data);

        if (data.status === 'success') {
            window.location.href = "main.html";
        } else {
            showMessage(data.message || '로그인 실패');
        }
    } catch (err) {
        showMessage('서버 통신 오류');
    }
});

function showMessage(msg) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = msg;
    } else {
        alert(msg);
    }
}