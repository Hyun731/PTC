const circles = {
  s1: document.getElementById('one'),
  s2: document.getElementById('two'),
  s3: document.getElementById('three')
};
const sections = document.querySelectorAll('section');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-button');
const sug = document.querySelectorAll('.suggestion');
const matchRequestButton = document.getElementById('match-request-button');
const advancedToggle = document.getElementById('advanced-options-toggle');
const advancedOptions = document.getElementById('advanced-options');

function activateCurrentCircle() {
  let currentSection = 's1';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 80 && rect.bottom > 80) {
      currentSection = section.id;
    }
  });
  Object.entries(circles).forEach(([id, el]) => {
    el.classList.toggle('active', id === currentSection);
  });
}

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

function addEventListeners() {
  window.addEventListener('scroll', activateCurrentCircle);
  window.addEventListener('load', activateCurrentCircle);

  sug.forEach(box => {
    if (!modal.contains(box)) {
      box.addEventListener('click', openModal);
    }
  });

  window.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (matchRequestButton) {
    matchRequestButton.addEventListener('click', closeModal);
  }

  if (advancedToggle && advancedOptions) {
    advancedToggle.addEventListener('click', () => {
      advancedOptions.style.display =
        advancedOptions.style.display === 'none' ? 'flex' : 'none';
    });
  }
}

addEventListeners();

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS 연결됨");

  fetch("http://localhost:8000/user/users_inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: 2 }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("서버 응답:", data);
      if (!data || data.length === 0) {
        console.warn("유저 정보 없음");
        return;
      }

      const user = data[0];

      document.querySelector(".profile-name").textContent = user.username;
      const intro = user.user_introduce || "";
      const maxLen = 20; // 최대 글자 수

      const trimmedIntro = intro.length > maxLen
        ? intro.slice(0, maxLen) + "..."
        : intro;

      const quoteElement = document.querySelector(".profile-quote");
      quoteElement.textContent = `"${trimmedIntro}"`;
      quoteElement.title = intro; 
      document.querySelector(".profile-position").textContent = `포지션 : ${user.position}`;

      if (user.profile_image) {
        const imgDiv = document.querySelector(".profile-image");
        imgDiv.style.backgroundImage = `url('${user.profile_image}')`;
        imgDiv.style.backgroundSize = 'cover';
        imgDiv.style.backgroundPosition = 'center';
      }
    })
    .catch((err) => {
      console.error("요청 실패:", err);
    });
});
async function loadTopTeams() {
  const container = document.getElementById("top-teams-container");

  try {
    const res = await fetch("http://localhost:8000/team/top_teams");
    const teams = await res.json();
    console.log("서버 응답:", teams);
    teams.forEach(team => {
      const card = document.createElement("div");
      card.className = "card";
      card.onclick = () => location.href = `team_profile.html?id=${team.id}`;
      card.innerHTML = `
        <h2 style="font-size: 50px; padding: 10px; padding-left: 0;">${team.team_name}</h2>
        <h2 style="font-size: 25px; font-weight: 500;">활동 지역 : ${team.region}</h2>
        <h3 style="font-size: 25px; font-weight: 500;">등급 : ${team.level}</h3>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("팀 불러오기 실패:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadTopTeams);