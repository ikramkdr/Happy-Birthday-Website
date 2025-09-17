// 🎬 Animation d'introduction
window.onload = () => {
  const introText = document.getElementById("intro-text");

  // Étape 1
  introText.textContent = "Chuuuut… Éteignez les lumières !!!";
  introText.style.animation = "fadeInOut 3s ease-in-out forwards";

  // Étape 2
  setTimeout(() => {
    introText.textContent = "Elle est là !!!";
    introText.style.animation = "none";
    void introText.offsetWidth; // restart animation
    introText.style.animation = "fadeInOut 3s ease-in-out forwards";
  }, 3000);

  // Étape 3 : Afficher le gâteau
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    document.getElementById("cake-scene").style.display = "block";
    startMic(); // demander accès micro
  }, 6000);
};// 🎆 Lancer feux d’artifice pendant 5 secondes
function startFireworks() {
  const canvas = document.getElementById("fireworks");
  canvas.style.display = "block";

  // Musique
  const song = document.getElementById("happy-song");
  song.play();

  // Démarre l’animation
  launchFireworks();

  // Stop après 5 secondes et montrer la lettre
  setTimeout(() => {
    canvas.style.display = "none";          // cache feux
    document.getElementById("main-content").style.display = "none"; 
    document.getElementById("letter-page").style.display = "flex"; // affiche lettre
  }, 5000);
}
// 🎆 Simulation feux d’artifice
function launchFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  let particles = [];

  function createFirework() {
    let x = random(0, canvas.width);
    let y = random(0, canvas.height / 2);
    for (let i = 0; i < 80; i++) {
      particles.push({
        x,
        y,
        vx: random(-3, 3),
        vy: random(-3, 3),
        life: 100,
        color: `hsl(${random(0,360)},100%,50%)`
      });
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    });

    if (Math.random() < 0.05) createFirework();

    requestAnimationFrame(animate);
  }

  animate();
}


// 🎤 Détection du souffle
function startMic() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new AudioContext();
        const mic = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        mic.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
          analyser.getByteFrequencyData(dataArray);
          let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

          if (volume > 50) { // seuil pour le souffle
            blowOutCandles();
            return;
          }
          requestAnimationFrame(detectBlow);
        }
        detectBlow();
      })
      .catch(err => alert("👉 Active ton micro pour souffler sur les bougies 🎤🎂"));
  }
}

// 🎂 Éteindre les bougies et lancer la fête
function blowOutCandles() {
  // Retirer les flammes
  document.querySelectorAll(".flame").forEach(f => f.style.display = "none");

  // Après 1,5 sec → célébration
  setTimeout(() => {
    document.getElementById("cake-scene").style.display = "none";
    document.body.style.background = "linear-gradient(135deg, #ff9a9e, #fad0c4, #fad390)";
    document.getElementById("main-content").style.display = "block";

    // 🎇 Feux d’artifice + musique
    startFireworks();

    // 🎈 Ballons + 🎊 confettis
    setInterval(createBalloon, 600);
    setInterval(createConfetti, 200);

    // ⏳ Après 5 secondes → afficher la lettre
    setTimeout(() => {
      document.getElementById("fireworks").style.display = "none"; // cacher les feux
      document.getElementById("main-content").style.display = "none"; // cacher le texte
      document.getElementById("letter").style.display = "block"; // montrer la lettre
    }, 5000);

  }, 1500);
}


// 🎈 Ballons
function createBalloon() {
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  balloon.style.left = Math.random() * window.innerWidth + 'px';
  balloon.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
  balloon.style.animationDuration = (5 + Math.random()*5) + 's';
  document.body.appendChild(balloon);
  setTimeout(() => balloon.remove(), 10000);
}

// 🎊 Confettis
function createConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.left = Math.random() * window.innerWidth + 'px';
  confetti.style.background = `hsl(${Math.random()*360}, 90%, 60%)`;
  confetti.style.animationDuration = (3 + Math.random()*2) + 's';
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 5000);
}
