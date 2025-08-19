class LuckyWheel {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinButton = document.getElementById('spinButton');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultMessage = document.getElementById('resultMessage');
        this.playAgainButton = document.getElementById('playAgain');
        
        this.segments = 10;
        this.currentRotation = 0;
        this.isSpinning = false;
        
        this.colors = [
            '#ED1A56', '#ff5f82', '#ffd2d2', '#ffe3b2', '#fff1d5',
            '#ED1A56', '#ff5f82', '#ffd2d2', '#ffe3b2', '#fff1d5'
        ];
        
        this.prizes = [
            { number: 1, prize: '🍀 Free Spin', value: 'Try Again!' },
            { number: 2, prize: '🎫 $50 Voucher', value: 'Nice Win!' },
            { number: 3, prize: '🎁 $100 Gift Card', value: 'Great Prize!' },
            { number: 4, prize: '📷 Digital Camera', value: 'Awesome!' },
            { number: 5, prize: '🎮 Gaming Console', value: 'Amazing!' },
            { number: 6, prize: '⌚ Smart Watch', value: 'Fantastic!' },
            { number: 7, prize: '🎧 Premium Headphones', value: 'Excellent!' },
            { number: 8, prize: '📱 Smartphone', value: 'Incredible!' },
            { number: 9, prize: '💻 Notebook', value: 'Outstanding!' },
            { number: 10, prize: '🚗 BRAND NEW CAR!', value: 'JACKPOT!' }
        ];
        
        this.init();
    }
    
    init() {
        this.drawWheel();
        this.spinButton.addEventListener('click', () => this.spin());
        this.playAgainButton.addEventListener('click', () => this.reset());
    }
    
    drawWheel() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 180;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const anglePerSegment = (Math.PI * 2) / this.segments;
        
        for (let i = 0; i < this.segments; i++) {
            // Start drawing from the top (12 o'clock position)
            const startAngle = i * anglePerSegment + this.currentRotation - Math.PI / 2;
            const endAngle = (i + 1) * anglePerSegment + this.currentRotation - Math.PI / 2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            
            this.ctx.fillStyle = this.colors[i];
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(startAngle + anglePerSegment / 2);
            this.ctx.textAlign = 'right';
            // Use dark text color for light segments
            this.ctx.fillStyle = (i >= 2 && i <= 4) || (i >= 7 && i <= 9) ? '#333333' : '#fff';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillText(String(i + 1), radius - 20, 10);
            this.ctx.restore();
        }
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('SPIN', centerX, centerY);
    }
    
    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.resultDisplay.classList.remove('show', 'winner');
        this.resultTitle.textContent = '';
        this.resultMessage.textContent = '';
        this.playAgainButton.style.display = 'none';
        
        const winningSegment = Math.floor(Math.random() * this.segments) + 1;
        const segmentAngle = (Math.PI * 2) / this.segments;
        // Calculate angle to land in the middle of the segment, pointing up
        // The pointer is at the top (0 degrees), so we need to position the segment there
        const targetAngle = -((winningSegment - 1) * segmentAngle + segmentAngle / 2);
        
        const totalRotation = Math.PI * 2 * 5 + targetAngle;
        
        const startTime = Date.now();
        const duration = 4000;
        
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            this.currentRotation = totalRotation * easeOut;
            this.drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.showResult(winningSegment);
            }
        };
        
        animate();
    }
    
    showResult(segment) {
        this.isSpinning = false;
        const prize = this.prizes[segment - 1];
        
        this.resultDisplay.classList.add('show');
        
        if (segment === 10) {
            this.resultDisplay.classList.add('winner');
            this.resultTitle.textContent = '🎊 CONGRATULATIONS! 🎊';
            this.resultMessage.textContent = `You won the ${prize.prize}! ${prize.value}`;
            this.createConfetti();
        } else {
            this.resultTitle.textContent = `You landed on ${segment}!`;
            this.resultMessage.textContent = `You won: ${prize.prize}`;
        }
        
        this.playAgainButton.style.display = 'inline-block';
    }
    
    createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 30);
        }
    }
    
    reset() {
        this.spinButton.disabled = false;
        this.resultDisplay.classList.remove('show', 'winner');
        this.resultTitle.textContent = '';
        this.resultMessage.textContent = '';
        this.playAgainButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LuckyWheel();
});