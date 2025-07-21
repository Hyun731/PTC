const tabs = document.querySelectorAll('.sidebar .bx');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-tab');

        contents.forEach(c => {
            if (c.id === target) {
                if (target === "management") {
                    c.style.display = "flex";
                    c.style.flexDirection = "row";
                } else {
                    c.style.display = "flex";
                    c.style.flexDirection = "column";
                }
            } else {
                c.style.display = "none";
            }
        });
    });
});

let members = [];
let selectedIndex = null;
const memberList = document.getElementById('memberList');
const memberDetail = document.getElementById('memberDetail');

function fetchMemberList() {
    fetch("http://localhost:8000/team/member_list")
        .then(res => res.json())
        .then(data => {
            console.log("팀원 목록:", data);
            members = data.map(m => ({
                id : m.id,
                name: m.username || "이름없음",     
                position: m.position || "미입력",    
                foot: m.strongfoot || "미입력",           
                feature: m.feature || "없음",       
                image: m.profile_image || "https://via.placeholder.com/100"
            }));
            renderMemberList();
        })
        .catch(err => {
            console.error("팀원 불러오기 실패:", err);
        });
}

function renderMemberList() {
    memberList.innerHTML = '';
    members.forEach((m, i) => {
        const card = document.createElement('div');
        card.className = 'member-card';

        const info = document.createElement('div');
        info.className = 'info';
        info.innerHTML = `
            <img src="${m.image}" alt="팀원 프로필" />
            <div><strong>${m.name}</strong><br><small>${m.position}</small></div>
        `;
        info.onclick = () => showMemberDetail(i);

        const actions = document.createElement('div');
        actions.innerHTML = `
            <button onclick="editMember(${i}); event.stopPropagation();">수정</button>
            <button onclick="deleteMember(${i}); event.stopPropagation();">삭제</button>
        `;

        card.appendChild(info);
        card.appendChild(actions);
        memberList.appendChild(card);
    });
}

function showMemberDetail(index) {
    selectedIndex = index;
    const m = members[index];
    memberDetail.innerHTML = `
                <div style="text-align: center;">
                    <img src="${m.image}" alt="프로필" />
                </div>
                <div class="profile-field"><strong>이름:</strong> ${m.name}</div>
                <div class="profile-field"><strong>포지션:</strong> ${m.position}</div>
                <div class="profile-field"><strong>주발:</strong> ${m.foot}</div>
                <div class="profile-field"><strong>특징:</strong> ${m.feature}</div>
            `;
}

function addMember() {
    const member_id = prompt('추가할 유저 ID 입력');
    if (!member_id) return;

    const newMember = {
        team_id: 1,
        member_id: member_id,
        role: "member",
        feature: "미입력"
    };

    fetch("http://localhost:8000/team/add_member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember)
    })
    .then(res => {
        if (!res.ok) throw new Error("추가 실패");
        return res.json();
    })
    .then(() => {
        alert("팀원이 추가되었습니다.");
        fetchMemberList();
    })
    .catch(err => {
        console.error("추가 실패:", err);
        alert("팀원 추가 중 오류 발생");
    });
}

function editMember(index) {
    const m = members[index];
    const role = prompt('역할 수정', m.role || 'member');
    const feature = prompt('특징 수정', m.feature || '없음');

    console.log(m)
    const updated = {
        team_id: 1,
        member_id: m.id,
        role: role || m.role,
        feature: feature || m.feature
    };

    fetch("http://localhost:8000/team/update_member", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
    })
    .then(res => {
        if (!res.ok) throw new Error("수정 실패");
        return res.json();
    })
    .then(() => {
        alert("수정 완료");
        fetchMemberList();
    })
    .catch(err => {
        console.error("수정 실패:", err);
        alert("수정 중 오류 발생");
    });
}

function deleteMember(index) {
    const m = members[index];
    if (!confirm(`정말 ${m.name}을 삭제하시겠습니까?`)) return;

    fetch("http://localhost:8000/team/delete_member", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            team_id: 1,
            member_id: m.id   // 👈 여기도 member_id
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("삭제 실패");
        return res.json();
    })
    .then(() => {
        alert("삭제 완료");
        fetchMemberList();
        memberDetail.innerHTML = '<p style="color: gray;">왼쪽에서 팀원을 선택하세요.</p>';
    })
    .catch(err => {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류 발생");
    });
}
renderMemberList();

const matches = [
    { id: 1, opponent: '부투SC', result: 'scheduled', score: '', date: '2025-08-01', location: '화명생태공원 축구장 C', note: '첫 경기 예정' },
];

function renderMatches() {
    const matchList = document.getElementById('matchList');
    const matchInfo = document.getElementById('matchInfo');
    let win = 0, draw = 0, lose = 0;
    let scorers = [];

    matchList.innerHTML = '';
    matches.forEach((m, i) => {
        const div = document.createElement('div');
        div.className = 'match-item ' + m.result;
        div.innerHTML = `<div>VS ${m.opponent}</div><div>${m.result === 'scheduled' ? '예정' : m.score}</div>`;
        div.onclick = () => {
            matchInfo.innerHTML = `
                <h3>📋 경기 상세 정보</h3>
                <p><strong>상대 팀:</strong> ${m.opponent}</p>
                <p><strong>결과:</strong> ${m.result === 'scheduled' ? '예정' : m.score}</p>
                <p><strong>날짜:</strong> ${m.date}</p>
                <p><strong>장소:</strong> ${m.location}</p>
                <p><strong>요약:</strong> ${m.note}</p>
            `;

            const scoreInputSection = document.getElementById('scoreInputSection');
            scoreInputSection.innerHTML = '';

            if (m.result === 'scheduled') {
                scoreInputSection.innerHTML = `
                    <hr style="margin: 20px 0;">
                    <h3>⚽ 경기가 끝나셨나요?</h3>
                    <div><label>우리 팀 점수: <input type="number" id="ourScore" min="0" style="width: 60px;"></label></div>
                    <div><label>상대 팀 점수: <input type="number" disabled placeholder="상대팀이 입력합니다" style="width: 160px;"></label></div>
                    <br>
                    <button onclick="submitOurScore(${i})" class="btn">제출</button>
                `;
                scorers = [];
            }
        };
        matchList.appendChild(div);

        if (m.result === 'win') win++;
        else if (m.result === 'lose') lose++;
        else if (m.result === 'draw') draw++;
    });

    document.getElementById('totalMatches').textContent = `총 경기 수: ${matches.length}`;
    document.getElementById('wins').textContent = `승: ${win}`;
    document.getElementById('draws').textContent = `무: ${draw}`;
    document.getElementById('losses').textContent = `패: ${lose}`;
    const rate = matches.length > 0 ? Math.round((win / matches.length) * 100) : 0;
    document.getElementById('winRate').textContent = `승률: ${rate}%`;
}

renderMatches();

let matchRequests = [
    {
        id: 1,
        teamName: "부투SC",
        date: "2025-08-10 15:00",
        message: "이번 주 토요일 오후에 경기 신청합니다."
    }
];

const matchRequestsList = document.getElementById('matchRequestsList');

function acceptRequest(id) {
    alert(`매치 신청 #${id} 수락했습니다.`);
    removeRequest(id);
}

function rejectRequest(id) {
    if (confirm(`매치 신청 #${id} 거절하시겠습니까?`)) {
        removeRequest(id);
    }
}

function removeRequest(id) {
    matchRequests = matchRequests.filter(r => r.id !== id);
    renderRequests();
}

function renderRequests() {
    matchRequestsList.innerHTML = '';
    if (matchRequests.length === 0) {
        matchRequestsList.innerHTML = '<p class="empty-message">현재 매치 신청이 없습니다.</p>';
        return;
    }

    matchRequests.forEach(r => {
        const div = document.createElement('div');
        div.className = 'match-request';
        div.innerHTML = `
                <div class="match-info">
                    <div class="match-team">${r.teamName}</div>
                    <div class="match-date">${r.date}</div>
                    <div class="match-message">${r.message}</div>
                </div>
                <div class="btn-group">
                    <button class="btn-accept" onclick="acceptRequest(${r.id})">수락</button>
                    <button class="btn-reject" onclick="rejectRequest(${r.id})">거절</button>
                </div>
                `;
        matchRequestsList.appendChild(div);
    });
}

function submitOurScore(index) {
    const ourScore = document.getElementById('ourScore').value;
    if (ourScore === '' || isNaN(ourScore)) {
        alert("점수를 입력해주세요.");
        return;
    }

    alert(`우리 팀 점수 (${ourScore})가 등록되었습니다.\n상대 팀 점수 입력 후 경기 결과가 확정됩니다.`);
}
renderRequests();

document.addEventListener("DOMContentLoaded", () => {
    console.log("JS 연결됨");

    fetch("http://localhost:8000/team/teams_inquiry", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: 1 }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("서버 응답:", data);
            if (!data || data.length === 0) {
                console.warn("유저 정보 없음");
                return;
            }

            const team = data[0];

            document.querySelector(".team-name").textContent = team.team_name;
            const intro = team.team_introduce || "";

            const quoteElement = document.querySelector(".intro-box p");
            quoteElement.textContent = `"${intro}"`;

            if (team.team_image) {
                const imgDiv = document.querySelector(".profile-pic");
                imgDiv.style.backgroundImage = `url('${team.team_image}')`;
                imgDiv.style.backgroundSize = 'cover';
                imgDiv.style.backgroundPosition = 'center';
            }
            if (team.team_banner) {
                const imgDiv = document.querySelector(".banner");
                imgDiv.style.backgroundImage = `url('${team.team_banner}')`;
                imgDiv.style.backgroundSize = 'cover';
                imgDiv.style.backgroundPosition = 'center';
            }
            document.getElementById("region").textContent = team.region;
            document.getElementById("level").textContent = team.level;
            document.getElementById("score").textContent = team.score;
            document.getElementById("header").textContent = team.header;
        })
        .catch((err) => {
            console.error("요청 실패:", err);
        });
    fetchMemberList();
});
