// Selecting from DOM

const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const canvas = document.getElementById('canvas');

const figureParts = document.querySelectorAll('.figure-part');
const lineStroke = document.querySelector('.figure-container')

//Defining Neccessary Variables

let notPlayable = false;

const words = ['hangman', 'lockdown', 'sirish', 'computer', 'engineering', 'programing', 'windows'];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];
let lifes = figureParts.length;

notification.innerHTML = `You have <span style="color:#fab1a0"> Already Entered </span> this letter`;
//Show hidden words
const displayWord = () => {
  wordEl.innerHTML = `
  ${selectedWord
    .split('')
    .map(
      el => `
        <div class="letter">
          ${correctLetters.includes(el) ? el : '' }
        </div>

    `).join('')}
    `;

  const innerWord = wordEl.innerText.replace(/\n/g, '');

  if (innerWord === selectedWord) {
    // canvas.style.display = 'block';
    canvas.style.opacity = '1';
    notPlayable = true;
    finalMessage.innerHTML = ` Well Done 🏆 You <span style="color:#fab1a0">Won</span> 💪`;
    popup.style.display = 'flex';
  }
}

// Update wrong letters
function updateWrongLettersEl() {
  //Display Wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? `<p style="font-size:1.3rem;"> <s style="color:#fab1a0";>Wrong</s> Letters | ${lifes} </p> <hr style="border: 1px dashed #1a23ef99;">`: ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`).join(', ')
  }`;

  // Display Parts
  figureParts.forEach((part, index) => {
    const maxErrors = wrongLetters.length;

    if (index < maxErrors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none'
    }
  });

  if (wrongLetters.length === figureParts.length - 4) {
    lineStroke.style.stroke = 'yellow';
    notification.innerHTML = `Only <span style="color:yellow">4</span> Chances Left`;
    showNotification();
    setTimeout(function () {
      notification.innerHTML = `You have <span style="color:#fab1a0"> Already Entered </span> this letter`;
    }, 2300);
  }

  if (wrongLetters.length === figureParts.length - 1) {
    lineStroke.style.stroke = 'coral';
    notification.innerHTML = `Only <span style="color:#f78970">1</span> Chances Left`;
    showNotification();
    setTimeout(function () {
      notification.innerHTML = `You have <span style="color:#fab1a0"> Already Entered </span> this letter`;
    }, 2300);
  }

  //Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerHTML = `Sorry, You <span style="color:#fab1a0">Loose</span> this time 😑`;
    popup.style.display = 'flex';
  }
}

// Show Notification
function showNotification() {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000)
}

// canvas.style.display = 'none';
canvas.style.opacity = '0';

//Keydown letter pressed
window.addEventListener('keydown', function (e) {
  if (!notPlayable) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key;

      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);

          displayWord();
        } else {
          showNotification();
        }
      } else {

        if (!wrongLetters.includes(letter)) {
          lifes--;
          if (lifes <= 0) {
            notPlayable = true;
          }

          wrongLetters.push(letter);
          updateWrongLettersEl();
        } else {
          showNotification();
        }
      }
    }
  } else {
    console.log('Do nothing');
    return;
  }
});

//Restart Game | Play Again
playAgainBtn.addEventListener('click', function () {

  notPlayable = false;
  //Empty both arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  //Set Random Words
  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayWord();

  //Clears the Wrong words as wrongLetters.length = 0
  updateWrongLettersEl();

  // Removes the Popup
  popup.style.display = 'none';
  lineStroke.style.stroke = 'greenyellow';

  lifes = figureParts.length;

  canvas.style.opacity = '0';
});

//For Game Initialization
displayWord();

// Checking for Mobile devices
const w = window.innerWidth;
const body = document.getElementById('body');
if (w <= 600) {
  body.innerHTML = `

    <h5 style="disply:flex; justify-content:center;">
 Sorry, Doesnot Support for Mobile Devices</h5>

  `;
}


//Particle Effect
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');
const particles = [];

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function draw() {
  const particle = {
    x: canvas.width / canvas.width,
    y: canvas.height,
    xvel: Math.random() * 2,
    yvel: Math.random() * 2,
    size: random(0, 8),
    color: `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`,
  };

  particles.push(particle);

  if (particles.length > 500)
    particles.shift();

  context.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    context.fillStyle = p.color;
    context.fillRect(p.x, p.y, p.size, p.size);
    p.x += p.xvel * 2;
    p.y -= p.yvel;
  });
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);