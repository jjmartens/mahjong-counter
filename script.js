// Function to retrieve scores from local storage
function getScores() {
  return  JSON.parse(localStorage.getItem('mahjongScores')) || [];
}

function removeScore(index) {
  const scores = getScores();
  scores.splice(index, 1);
  localStorage.setItem('mahjongScores', JSON.stringify(scores));
  displayScores(scores);
}

// Function to display scores on the webpage
function displayScores(scores) {
  const scoreRows = document.getElementById('scoreRows');
  scoreRows.innerHTML = '';
  scores.forEach((score, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td >${index+1}</td>
      <td class="${score.eastWind === 1 ? 'eastWind': ''}">${score.player1} ${score.winner === 1 ? '<i class="fas fa-crown"></i>' : ''}</td>
      <td class="${score.eastWind === 2 ? 'eastWind': ''}">${score.player2} ${score.winner === 2 ? '<i class="fas fa-crown"></i>' : ''}</td>
      <td class="${score.eastWind === 3 ? 'eastWind': ''}">${score.player3} ${score.winner === 3 ? '<i class="fas fa-crown"></i>' : ''}</td>
      <td class="${score.eastWind === 4 ? 'eastWind': ''}">${score.player4} ${score.winner === 4 ? '<i class="fas fa-crown"></i>' : ''}</td>
      <button class="removeBtn" data-index="${index}">
     <i class="fa-solid fa-trash"></i>
  </button>
`;
      scoreRows.appendChild(row);
  });
  // Add event listeners to remove buttons
  const removeButtons = document.querySelectorAll('.removeBtn');
  removeButtons.forEach(button => {
      button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index'));
          removeScore(index);
      });
  }); 
  // Add total scores
  // Calculate total scores per player
const totals = [0, 0, 0, 0];
scores.forEach(score => {
    totals[0] += score.player1;
    totals[1] += score.player2;
    totals[2] += score.player3;
    totals[3] += score.player4;
});

// Display total scores
document.getElementById('totalPlayer1').textContent = totals[0];
document.getElementById('totalPlayer2').textContent = totals[1];
document.getElementById('totalPlayer3').textContent = totals[2];
document.getElementById('totalPlayer4').textContent = totals[3];
}

// Custom function to compute new scores
function computeScore(newPlayerScore) {
  const playerScores = [newPlayerScore.player1, newPlayerScore.player2, newPlayerScore.player3, newPlayerScore.player4];
  const eastWindPlayer = newPlayerScore.eastWind - 1;
  const winner = newPlayerScore.winner - 1;
  const scoreDifferences = [0,0,0,0];

  // Compute differences
  for(let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i !== j) {
        payment = playerScores[i] - playerScores[j];
        if (payment < 0 && i === winner || payment > 0 && j === winner) {
          payment = 0;
        }
        if (i === eastWindPlayer || j === eastWindPlayer) {
          payment *= 2;
        }
        scoreDifferences[i] += payment;
      }
    }
  }
  // Update scores
  return {
    player1: scoreDifferences[0],
    player2: scoreDifferences[1],
    player3: scoreDifferences[2],
    player4: scoreDifferences[3],
    eastWind: newPlayerScore.eastWind,
    winner: newPlayerScore.winner
  };
}


// Function to add a new score
function addScore(event) {
  event.preventDefault();
  
  const player1Score = document.getElementById('player1').value;
  const player2Score = document.getElementById('player2').value;
  const player3Score = document.getElementById('player3').value;
  const player4Score = document.getElementById('player4').value;
  const eastWind = document.getElementById('eastWind').value;
  const winner = document.getElementById('winner').value;

  const newScore = {
      player1: parseInt(player1Score),
      player2: parseInt(player2Score),
      player3: parseInt(player3Score),
      player4: parseInt(player4Score),
      eastWind: parseInt(eastWind),
      winner: parseInt(winner)
   };
  
  const scores = getScores();
  scores.push(computeScore(newScore));

  localStorage.setItem('mahjongScores', JSON.stringify(scores));
  displayScores(scores);
  // Reset form
  document.getElementById('scoreForm').reset();
}

// Event listener for adding a score
document.getElementById('scoreForm').addEventListener('submit', addScore);

// Display initial scores on page load
displayScores(getScores());
