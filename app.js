// Retro Snake Game - Nokia 3210 Style
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        this.startButton = document.getElementById('startButton');
        
        // Game settings
        this.gridSize = 15;
        this.tileCount = 20;
        this.gameSpeed = 150;
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Snake
        this.snake = [
            {x: 10, y: 10}
        ];
        this.dx = 0;
        this.dy = 0;
        
        // Food
        this.food = this.generateFood();
        
        // Initialize
        this.setupEventListeners();
        this.drawGame();
    }
    
    setupEventListeners() {
        // Start button
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Touch controls
        document.getElementById('upBtn').addEventListener('click', () => this.changeDirection(0, -1));
        document.getElementById('downBtn').addEventListener('click', () => this.changeDirection(0, 1));
        document.getElementById('leftBtn').addEventListener('click', () => this.changeDirection(-1, 0));
        document.getElementById('rightBtn').addEventListener('click', () => this.changeDirection(1, 0));
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.changeDirection(0, -1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.changeDirection(0, 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.changeDirection(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.changeDirection(1, 0);
                break;
        }
    }
    
    changeDirection(newDx, newDy) {
        // Prevent reverse direction
        if (this.dx !== -newDx || this.dy !== -newDy) {
            this.dx = newDx;
            this.dy = newDy;
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.food = this.generateFood();
        this.updateScore();
        this.gameOverlay.classList.add('hidden');
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.drawGame();
        
        setTimeout(() => {
            this.gameLoop();
        }, this.gameSpeed);
    }
    
    update() {
        // Only move snake if it's actually moving
        if (this.dx === 0 && this.dy === 0) {
            return;
        }
        
        // Move snake
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision (skip the head itself)
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
            // Increase speed slightly
            this.gameSpeed = Math.max(50, this.gameSpeed - 2);
        } else {
            this.snake.pop();
        }
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (optional - for retro feel)
        this.drawGrid();
        
        // Draw snake
        this.ctx.fillStyle = '#00ff00';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - brighter green
                this.ctx.fillStyle = '#00ff00';
            } else {
                // Body - darker green
                this.ctx.fillStyle = '#00cc00';
            }
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#003300';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= this.tileCount; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gameOverlay.classList.remove('hidden');
        this.gameOverlay.classList.add('game-over');
        this.overlayTitle.textContent = 'GAME OVER';
        this.overlayMessage.textContent = `Score: ${this.score}`;
        this.startButton.textContent = 'PLAY AGAIN';
        
        // Reset game speed
        this.gameSpeed = 150;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});

// Add some retro sound effects (optional)
function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}
