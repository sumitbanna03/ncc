const searchInput1 = document.getElementsByClassName('searchInput')[0];
const searchInput2 = document.getElementsByClassName('searchInput')[1];

const resultsContainer = document.getElementById('results');
const hasUser1 = searchInput1.getAttribute('data-has-user') === 'true';
const hasUser2 = searchInput2.getAttribute('data-has-user') === 'true';
let timeout = null;

//For Desktop Search
searchInput1.addEventListener('keyup', () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    let query = searchInput1.value.trim();

    if (!query) {
      
      query = ".";
      
    }

    fetch(`/matches/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(matches => {
        resultsContainer.innerHTML = '';

        if (matches.length === 0) {
          resultsContainer.innerHTML = '<p>No matches found</p>';
          return;
        }

        matches.forEach(match => {
          const card = document.createElement('div');
          card.classList.add('main-card');
           
            match.t1Name = match.t1Name.slice(0, -1);
            match.t2Name = match.t2Name.slice(0, -1);
            if(!match.date){
              match.date = "-";
            }
          card.innerHTML = `
  <div class="card">
    <div class="card-top">
      <span class="match-date">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        ${match.date}
      </span>
      <span class="match-status status-completed">Completed</span>
    </div>
    <div class="scoreboard">
      <div class="team home">
        <span class="team-name ${match.t1Runs > match.t2Runs ? 'winner' : ''}">${match.t1Name}</span>
        <span class="score ${match.t1Runs > match.t2Runs ? 'winner' : ''}">${match.t1Runs}/${match.t1Wickets}</span>
        <span class="overs">(${match.t1Overs})</span>
      </div>
      <div class="vs-badge">VS</div>
      <div class="team away">
        <span class="team-name ${match.t1Runs < match.t2Runs ? 'winner' : ''}">${match.t2Name}</span>
        <span class="score ${match.t1Runs < match.t2Runs ? 'winner' : ''}">${match.t2Runs}/${match.t2Wickets}</span>
        <span class="overs">(${match.t2Overs})</span>
      </div>
    </div>
    <div class="result-strip ${
      ((match.t1Runs > match.t2Runs && (match.t2Name.trim() === "Nihalwadi")) || 
       (match.t1Runs < match.t2Runs && (match.t1Name.trim() === "Nihalwadi"))) ? 'loss' : ''
    }"> 
      ${match.t1Runs > match.t2Runs 
        ? `${match.t1Name} won by ${match.t1Runs - match.t2Runs} runs` 
        : match.t1Runs < match.t2Runs 
          ? `${match.t2Name} won by ${10 - match.t2Wickets} wickets` 
          : 'Match draw'
      }
    </div>
    <div class="card-footer">
      <div class="potm">
        <div class="potm-icon">⭐</div>
        <div>
          <div class="potm-label">Player of the Match</div>
          <div class="potm-name">${match.motm ? match.motm : 'NA'}</div>
        </div>
      </div>
                ${hasUser2 ? `
                  <form action="/matches/${match._id}?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to delete this match?');">
                    <button class="view-btn"> Delete </button> 
                  </form>
                ` : ''}
    </div>
  </div>
`;

          resultsContainer.appendChild(card);
        });
      });
  }, 300);
});

//For Mobile Search

searchInput2.addEventListener('keyup', () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    let query = searchInput2.value.trim();

    if (!query) {
      query = ".";
    }

    fetch(`/matches/search?q=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(matches => {
        resultsContainer.innerHTML = '';

        if (!matches || matches.length === 0) {
          resultsContainer.innerHTML = '<p>No matches found</p>';
          return;
        }

        matches.forEach(match => {
          const card = document.createElement('div');
          card.classList.add('main-card');
          
          // Safety Check: Only slice if the names actually exist and are strings
          const team1 = match.t1Name ? match.t1Name.slice(0, -1) : 'Unknown';
          const team2 = match.t2Name ? match.t2Name.slice(0, -1) : 'Unknown';
          const matchDate = match.date ? match.date : "-";

          // Safety Check: Safely see if a user object exists globally
          const hasUser = typeof currUser !== 'undefined' && currUser;

          card.innerHTML = `
            <div class="card">
              <div class="card-top">
                <span class="match-date">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  ${matchDate}
                </span>
                <span class="match-status status-completed">Completed</span>
              </div>
              <div class="scoreboard">
                <div class="team home">
                  <span class="team-name ${Number(match.t1Runs) > Number(match.t2Runs) ? 'winner' : ''}">${team1}</span>
                  <span class="score ${Number(match.t1Runs) > Number(match.t2Runs) ? 'winner' : ''}">${match.t1Runs}/${match.t1Wickets}</span>
                  <span class="overs">(${match.t1Overs})</span>
                </div>
                <div class="vs-badge">VS</div>
                <div class="team away">
                  <span class="team-name ${Number(match.t1Runs) < Number(match.t2Runs) ? 'winner' : ''}">${team2}</span>
                  <span class="score ${Number(match.t1Runs) < Number(match.t2Runs) ? 'winner' : ''}">${match.t2Runs}/${match.t2Wickets}</span>
                  <span class="overs">(${match.t2Overs})</span>
                </div>
              </div>
              <div class="result-strip ${
                ((Number(match.t1Runs) > Number(match.t2Runs) && (team2.trim() === "Nihalwadi")) || 
                 (Number(match.t1Runs) < Number(match.t2Runs) && (team1.trim() === "Nihalwadi"))) ? 'loss' : ''
              }"> 
                ${Number(match.t1Runs) > Number(match.t2Runs) 
                  ? `${team1} won by ${Number(match.t1Runs) - Number(match.t2Runs)} runs` 
                  : Number(match.t1Runs) < Number(match.t2Runs) 
                    ? `${team2} won by ${10 - Number(match.t2Wickets)} wickets` 
                    : 'Match draw'
                }
              </div>
              <div class="card-footer">
                <div class="potm">
                  <div class="potm-icon">⭐</div>
                  <div>
                    <div class="potm-label">Player of the Match</div>
                    <div class="potm-name">${match.motm ? match.motm : 'NA'}</div>
                  </div>
                </div>
                ${hasUser2 ? `
                  <form action="/matches/${match._id}?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to delete this match?');">
                    <button class="view-btn"> Delete </button> 
                  </form>
                ` : ''}
              </div>
            </div>
          `;

          resultsContainer.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Search failed:", err);
        resultsContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
      });
  }, 300);
});