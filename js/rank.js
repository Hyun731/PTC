window.addEventListener("DOMContentLoaded", () => {
    const teamBtn = document.querySelectorAll('.type-button')[0];
    const soloBtn = document.querySelectorAll('.type-button')[1];
    const teamDiv = document.getElementById('team');
    const soloDiv = document.getElementById('solo');
    teamDiv.style.display = 'grid';
    soloDiv.style.display = 'none';
    teamBtn.style.backgroundColor = '#2C95FF';
    teamBtn.style.color = 'white';
    soloBtn.style.backgroundColor = '#ffffff';
    soloBtn.style.color = '#2C95FF';
    const topRankTeam = {
        1:"1위 팀이다",
        2:"2위 팀이다",
        3:"3위 팀이다"
    }
    document.getElementById('rank1-name').innerText = topRankTeam[1];
    document.getElementById('rank2-name').innerText = topRankTeam[2];
    document.getElementById('rank3-name').innerText = topRankTeam[3];

    teamBtn.addEventListener('click', () => {
        teamDiv.style.display = 'grid';
        soloDiv.style.display = 'none';
        teamBtn.style.backgroundColor = '#2C95FF';
        teamBtn.style.color = 'white';
        soloBtn.style.backgroundColor = '#ffffff';
        soloBtn.style.color = '#2C95FF';
        const topRankTeam = {
            1:"1위 팀이다",
            2:"2위 팀이다",
            3:"3위 팀이다"
        }
        document.getElementById('rank1-name').innerText = topRankTeam[1];
        document.getElementById('rank2-name').innerText = topRankTeam[2];
        document.getElementById('rank3-name').innerText = topRankTeam[3];
    });

    soloBtn.addEventListener('click', () => {
        soloDiv.style.display = 'grid';
        teamDiv.style.display = 'none';
        soloBtn.style.backgroundColor = '#2C95FF';
        soloBtn.style.color = 'white';
        teamBtn.style.backgroundColor = '#ffffff';
        teamBtn.style.color = '#2C95FF';
        const topRanksolo = {
            1:"1위 개인이다",
            2:"2위 개인이다",
            3:"3위 개인이다"
        }
        document.getElementById('rank1-name').innerText = topRanksolo[1];
        document.getElementById('rank2-name').innerText = topRanksolo[2];
        document.getElementById('rank3-name').innerText = topRanksolo[3];
    });
});