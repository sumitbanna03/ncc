const searchInput1 = document.getElementsByClassName('searchInput')[0];
const searchInput2 = document.getElementsByClassName('searchInput')[1];

const resultsContainer = document.getElementById('result');

let timeout = null;

//For Desktop Search
searchInput1.addEventListener('keyup', () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    let query = searchInput1.value.trim();

    if (!query) {
      
      query = ".";
      
    }

    fetch(`/players/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(players => {
        resultsContainer.innerHTML = '';

        if (players.length === 0) {
          resultsContainer.innerHTML = '<p>No players found</p>';
          return;
        }
        
        players.forEach(player => {
          const card = document.createElement('div');
          card.classList.add('card');
          
          let name = player.name.slice(0, -1);
          let  img = player.img.url.replace("/upload", "/upload/h_300,w_300,");
          card.innerHTML = `
          <div class="card-banner">
      <span class="card-number">Ncc</span>
      <span class="role-badge">${player.role}</span>
      <div class="avatar-wrap">
        <div class="avatar-ring">
          <img src="${img}" class="avatar-placeholder"></img>
        </div>
      </div>    
    </div>
    <div class="card-body">
      <h2 class="player-name">${name}</h2>
      <div class="stats">
        <div class="stat"><span class="stat-label">Batting</span><span class="stat-value">${player.batting}</span></div>
        <div class="stat"><span class="stat-label">Bowling</span><span class="stat-value"> ${player.bowling}</span></div>
      </div>
      <div class="sep"></div>
      <div class="meta-row">
        <span class="age-pill">Age ${player.age}</span>
        <span class="status-dot"><span class="dot"></span>Active</span>
      </div>
      <a href="/players/profile/<%= player._id %>" class="btn">View Profile →</a>
    </div>
          `;

          resultsContainer.appendChild(card);
        });
      });
  }, 300);
});

// For Mobile Search
searchInput2.addEventListener('keyup', () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    let query = searchInput2.value.trim();

    if (!query) {
      
      query = ".";
      
    }

    fetch(`/players/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(players => {
        resultsContainer.innerHTML = '';

        if (players.length === 0) {
          resultsContainer.innerHTML = '<p>No players found</p>';
          return;
        }
      
        players.forEach(player => {
         const card = document.createElement('div');
          card.classList.add('card');
          
          let name = player.name.slice(0, -1);
          let  img = player.img.url.replace("/upload", "/upload/h_300,w_300,");
          card.innerHTML = `
          <div class="card-banner">
      <span class="card-number">Ncc</span>
      <span class="role-badge">${player.role}</span>
      <div class="avatar-wrap">
        <div class="avatar-ring">
          <img src="${img}" class="avatar-placeholder"></img>
        </div>
      </div>    
    </div>
    <div class="card-body">
      <h2 class="player-name">${name}</h2>
      <div class="stats">
        <div class="stat"><span class="stat-label">Batting</span><span class="stat-value">${player.batting}</span></div>
        <div class="stat"><span class="stat-label">Bowling</span><span class="stat-value"> ${player.bowling}</span></div>
      </div>
      <div class="sep"></div>
      <div class="meta-row">
        <span class="age-pill">Age ${player.age}</span>
        <span class="status-dot"><span class="dot"></span>Active</span>
      </div>
      <a href="/players/profile/${player._id}" class="btn">View Profile →</a>
    </div>
          `;
          resultsContainer.appendChild(card);
        });
      });
  }, 300);
});