
// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission
document.getElementById('rsvp-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const beerIcon = document.getElementById('beer-icon');
    const name = document.getElementById('name').value;
    const attendance = document.getElementById('attendance').value;

    // Animate beer icon
    beerIcon.classList.add('brindar');
    setTimeout(() => {
        beerIcon.classList.remove('brindar');
    }, 800);

    // Create confetti effect
    createConfetti();

    // Show confirmation message
    setTimeout(() => {
        if (attendance === 'present') {
            alert(`Obrigado, ${name}! Sua presença foi confirmada e estou ansiosos para celebrar com você!`);
        } else {
            alert(`Obrigado, ${name}, por responder. Sentirei sua falta, mas entendo perfeitamente!`);
        }

        // Reset form
        document.getElementById('rsvp-form').reset();

        // Send data to Google Sheets
        sendToGoogleSheets(name, attendance);
    }, 1000);
});

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffd166', '#ffffff'];
    const container = document.body;

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        container.appendChild(confetti);

        const animation = confetti.animate([
            { top: '-20px', opacity: 1, transform: 'rotate(0deg)' },
            { top: Math.random() * 50 + 50 + 'vh', opacity: 1, transform: 'rotate(' + Math.random() * 360 + 'deg)' },
            { top: '100vh', opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

function sendToGoogleSheets(name, attendance) {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyxdFiXNgVhdgZf2bBPTimvkM9sM2tvOuzZR4WmYyBRNyCRLu3u2DHlUyqrYazb4dPD/exec';
  const status = attendance === 'present' ? 'Presente' : 'Ausente';
  
  const formData = new FormData();
  formData.append('name', name);
  formData.append('attendance', status);
  
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => response.json())
    .then(result => {
      console.log('Sucesso:', result);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}
