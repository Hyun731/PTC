document.addEventListener("DOMContentLoaded", () => {
    const userId = 2;

    fetch("http://localhost:8000/user/users_inquiry", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (!data || data.length === 0) return;

            const user = data[0];

            // 사용자 이름
            document.querySelector(".user-name").textContent = user.username;

            // 소개
            document.querySelector(".intro").innerHTML = user.user_introduce
                .replace(/\n/g, "<br>"); // 줄바꿈 지원

            // 프로필 이미지
            if (user.profile_image) {
                const profilePic = document.querySelector(".user-profile-pic");
                profilePic.style.backgroundImage = `url('${user.profile_image}')`;
                profilePic.style.backgroundSize = 'cover';
                profilePic.style.backgroundPosition = 'center';
            }
            const h2Tag = document.querySelector(".review-box h2");
            if (h2Tag) {
                h2Tag.innerHTML = `
                <span class="highlight">${user.position || "포지션 없음"}</span>
                <span class="tagline">| 나이: ${user.age || "-"}세 | 활동 지역: ${user.active_region || "-"}</span>
                `;
            }

            // 배너 이미지
            if (user.user_banner) {
                const banner = document.querySelector(".banner");
                banner.style.backgroundImage = `url('${user.user_banner}')`;
                banner.style.backgroundSize = 'cover';
                banner.style.backgroundPosition = 'center';
            }
            console.log(user.team_id)
            if (user.team_id) {
                fetch("http://localhost:8000/team/teams_inquiry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: user.team_id }),
                })
                    .then((res) => res.json())
                    .then((teamData) => {
                        console.log("팀 API 응답:", teamData);
                        if (!Array.isArray(teamData) || teamData.length === 0) {
                            console.warn("팀 정보가 없습니다.");
                            return;
                        }

                        const team = teamData[0];

                        // team_logo 읽기 전에도 항상 존재 확인!
                        if (team.team_image) {
                            const logoDiv = document.querySelector(".team-logo");
                            logoDiv.style.backgroundImage = `url('${team.team_image}')`;
                            logoDiv.style.backgroundSize = "cover";
                            logoDiv.style.backgroundPosition = "center";
                        }

                        const teamNameH3 = document.querySelector(".team-box h3");
                        teamNameH3.textContent = team.team_name || "소속팀 없음";
                    })
                    .catch((err) => {
                        console.error("팀 정보 요청 실패:", err);
                    });
            }
        })

        .catch((err) => {
            console.error("유저 정보 불러오기 실패:", err);
        });
});
