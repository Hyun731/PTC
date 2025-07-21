document.addEventListener("DOMContentLoaded", () => {
    loadTeams();

    document.getElementById("apply-conditions").addEventListener("click", async () => {
        const teamName = document.getElementById("team-name").value.trim();
        const region = document.getElementById("region-select").value;
        const level = document.getElementById("level-select").value;

        const body = {
            team_name: teamName !== "" ? teamName : null,
            region: region !== "" ? region : null,
            level: level !== "" ? level : null,
        };
        console.log(body)
        try {
            const res = await fetch("http://localhost:8000/team/team_search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error(`서버 응답 오류: ${res.status}`);
            }

            const teams = await res.json();
            renderTeams(teams);
        } catch (error) {
            console.error("팀 불러오기 실패:", error);
        }
    });
});

async function loadTeams() {
    try {
        const res = await fetch("http://localhost:8000/team/team_search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

        if (!res.ok) {
            throw new Error(`서버 응답 오류: ${res.status}`);
        }

        const teams = await res.json();
        renderTeams(teams);
    } catch (error) {
        console.error("초기 팀 불러오기 실패:", error);
    }
}

function renderTeams(teams) {
    const container = document.querySelector(".box");
    container.innerHTML = "";

    if (!Array.isArray(teams) || teams.length === 0) {
        container.innerHTML = "<p>조건에 맞는 팀이 없습니다.</p>";
        return;
    }

    teams.forEach((team) => {
        const teamDiv = document.createElement("div");
        teamDiv.className = "smallbox";
        teamDiv.innerHTML = `
        <div class="isb" style="text-align: left;">
            <div class="text">
            <h2>${team.team_name}</h2>
            <p>활동 지역 : ${team.region}</p>
            <p>등급 : ${team.level}</p>
            </div>
        </div>
        `;
        container.appendChild(teamDiv);
    });
}