document.getElementById('signupForm').addEventListener('submit', function (e) {
    const pw = document.getElementById('password').value;
    const cpw = document.getElementById('confirmPassword').value;
    const error = document.getElementById('errorMessage');

    if (pw !== cpw) {
        e.preventDefault();
        error.style.display = 'block';
    } else {
        error.style.display = 'none';
        alert('회원가입 완료 (API 연동 필요)');
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('name').value;
        const userId = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 비밀번호 확인
        if (password !== confirmPassword) {
            errorMessage.style.display = 'block';
            return;
        } else {
            errorMessage.style.display = 'none';
        }

        // 서버로 회원가입 요청
        const data = {
            username: username,       
            id: userId,        
            password: password,        
            profile_image: "default.png", 
            position: "none",        
            age: 0,                  
            active_region: "none",   
            user_introduce: "소개없음" 
        };
        console.log(JSON.stringify(data));

        try {
            const response = await fetch('http://localhost:8000/user/signup', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.text();
            alert(result);
            if (response.ok) {
                location.href = "login.html";
            }
        } catch (err) {
            console.error("회원가입 에러:", err);
            alert("회원가입에 실패했습니다.");
        }
    });
});