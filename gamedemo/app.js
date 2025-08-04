// Retro Snake Game - Nokia 3210 Style for standalone demo
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        
        // Game settings
        this.gridSize = 16;
        this.gameSpeed = 150;
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        
        // Snake
        this.snake = [
            {x: Math.floor(this.canvas.width / this.gridSize / 2), y: Math.floor(this.canvas.height / this.gridSize / 2)}
        ];
        this.dx = 1; // Start moving right automatically
        this.dy = 0;
        
        // Food
        this.food = this.generateFood();
        
        // Initialize
        this.setupEventListeners();
        this.drawGame();
        this.startGame();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
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
            case ' ':
                e.preventDefault();
                if (!this.gameRunning) {
                    this.startGame();
                }
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
        console.log('Starting Snake game...');
        this.gameRunning = true;
        this.score = 0;
        this.snake = [{x: Math.floor(this.canvas.width / this.gridSize / 2), y: Math.floor(this.canvas.height / this.gridSize / 2)}];
        this.dx = 1; // Start moving right automatically
        this.dy = 0;
        this.food = this.generateFood();
        this.updateScore();
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
        
        // Check wall collision - ensure it matches the visual boundaries
        const maxTileX = Math.floor(this.canvas.width / this.gridSize);
        const maxTileY = Math.floor(this.canvas.height / this.gridSize);
        
        if (head.x < 0 || head.x >= maxTileX || head.y < 0 || head.y >= maxTileY) {
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
        const maxTileX = Math.floor(this.canvas.width / this.gridSize);
        const maxTileY = Math.floor(this.canvas.height / this.gridSize);
        
        do {
            food = {
                x: Math.floor(Math.random() * maxTileX),
                y: Math.floor(Math.random() * maxTileY)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (optional - for retro feel)
        this.drawGrid();
        
        // Draw snake in retro green
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - bright retro green
                this.ctx.fillStyle = '#39ff14';
            } else {
                // Body - darker retro green
                this.ctx.fillStyle = '#2ecc10';
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
        
        const maxTileX = Math.floor(this.canvas.width / this.gridSize);
        const maxTileY = Math.floor(this.canvas.height / this.gridSize);
        
        for (let i = 0; i <= maxTileX; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= maxTileY; i++) {
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    gameOver() {
        this.gameRunning = false;
        alert(`Game Over! Score: ${this.score}\nPress Space to restart`);
        
        // Reset game speed
        this.gameSpeed = 150;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});