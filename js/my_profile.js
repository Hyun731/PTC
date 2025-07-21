document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('name').value;
        const userId = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            errorMessage.style.display = 'block';
            return;
        } else {
            errorMessage.style.display = 'none';
        }

        const data = {
            id: userId,
            password: password,
            username: username,
            profile_image: "string",
            position: "string",
            age: 0,
            active_region: "string",
            user_introduce: "string"
        };

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