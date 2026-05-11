const searchInput1 = document.getElementsByClassName('searchInput')[0];
const searchInput2 = document.getElementsByClassName('searchInput')[1];

const resultsContainer = document.getElementById('results');

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
          card.classList.add('match');
           
            match.t1Name = match.t1Name.slice(0, -1);
            match.t2Name = match.t2Name.slice(0, -1);
            if(!match.date){
              match.date = "-";
            }
          card.innerHTML = 
          `           
    <div class="t-name"><h3>${match.t1Name}</h3><h3>${match.t2Name}</h3></div>
    <div class="scores">
      <p class="score">
      ${match.t1Runs}/${match.t1Wickets} (${match.t1Overs})
      </p>
      <p class="score">
         ${match.t2Runs}/ ${match.t2Wickets}(${match.t2Overs})
        </p>
      </div>
      `;

       card.innerHTML +=  match.t1Runs>match.t2Runs?
      `<p class="winLine">
        ${match.t1Name} won by ${match.t1Runs - match.t2Runs} runs </p>`
        :(match.t1Runs<match.t2Runs)?
           ` <p class="winLine"> 
           ${match.t2Name} won by ${10 - match.t2Wickets} wickets </p>`
        :
          `<p class="winLine">
            Match draw
           
        </p>`;

        card.innerHTML +=  `  <div class="potm">POTM:- ${match.motm} <span class="date">${match.date}</span></div>
    
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
      .then(res => res.json())
      .then(matches => {
        resultsContainer.innerHTML = '';

        if (matches.length === 0) {
          resultsContainer.innerHTML = '<p>No matches found</p>';
          return;
        }

        matches.forEach(match => {
          const card = document.createElement('div');
          card.classList.add('match');
           
            match.t1Name = match.t1Name.slice(0, -1);
            match.t2Name = match.t2Name.slice(0, -1);
            if(!match.date){
              match.date = "-";
            }
          card.innerHTML = 
          `           
    <div class="t-name"><h3>${match.t1Name}</h3><h3>${match.t2Name}</h3></div>
    <div class="scores">
      <p class="score">
      ${match.t1Runs}/${match.t1Wickets} (${match.t1Overs})
      </p>
      <p class="score">
         ${match.t2Runs}/ ${match.t2Wickets}(${match.t2Overs})
        </p>
      </div>
      `;

       card.innerHTML +=  match.t1Runs>match.t2Runs?
      `<p class="winLine">
        ${match.t1Name} won by ${match.t1Runs - match.t2Runs} runs </p>`
        :(match.t1Runs<match.t2Runs)?
           ` <p class="winLine"> 
           ${match.t2Name} won by ${10 - match.t2Wickets} wickets </p>`
        :
          `<p class="winLine">
            Match draw
           
        </p>`;

        card.innerHTML +=  `  <div class="potm">POTM:- ${match.motm} <span class="date">${match.date}</span></div>
    
          `;

          resultsContainer.appendChild(card);
        });
      });
  }, 300);
});
