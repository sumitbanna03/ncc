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
           card.classList.add('player');
          let name = player.name.slice(0, -1);
          let iconStr = player.role == "Batter"?`<img src="images/cricket-bat.png"  class="role-icon" ></img>`
          :player.role == "Bowler"?` <img src="images/cricket-ball.png" style="padding: 5px;" class="role-icon"></img>`
          :player.role == "Wicket-Keeper"?` <img src="images/keeper.png"  class="role-icon"></img>`
          :` <img src="images/cricket.png"  class="role-icon"></img>`;
          card.innerHTML = `
            
      <div class="player-img-box">  <img src="${ player.img.url }" class="player-img" alt="Player image">`+
     iconStr +
          `
</div>
  <div class="card-body">
    <h5 class="card-title">${name}</h5>
    <p class="card-text">Batting:  ${player.batting} <br>
      Bowling:  ${player.bowling}  <br>
      Age: ${ player.age}  </p>
    <a href="/players/profile/${player._id}" class="btn ">View Profile</a>
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
           card.classList.add('player');
          let name = player.name.slice(0, -1);
          let iconStr = player.role == "Batter"?`<img src="images/cricket-bat.png"  class="role-icon" ></img>`
          :player.role == "Bowler"?` <img src="images/cricket-ball.png" style="padding: 5px;" class="role-icon"></img>`
          :player.role == "Wicket-Keeper"?` <img src="images/keeper.png"  class="role-icon"></img>`
          :` <img src="images/cricket.png"  class="role-icon"></img>`;
          card.innerHTML = `
            
      <div class="player-img-box">  <img src="${ player.img.url }" class="player-img" alt="Player image">`+
     iconStr +
          `
</div>
  <div class="card-body">
    <h5 class="card-title">${name}</h5>
    <p class="card-text">Batting:  ${player.batting} <br>
      Bowling:  ${player.bowling}  <br>
      Age: ${ player.age}  </p>
    <a href="/players/profile/${player._id}" class="btn ">View Profile</a>
  </div>

          `;

          resultsContainer.appendChild(card);
        });
      });
  }, 300);
});