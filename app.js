// Game Manager - Handles switching between Pac-Man and Snake
class GameManager {
    constructor() {
        this.currentGame = null;
        this.currentMode = 'pacman';
        
        // UI elements
        this.pacmanBtn = document.getElementById('pacmanModeBtn');
        this.snakeBtn = document.getElementById('snakeModeBtn');
        this.tetrisBtn = document.getElementById('tetrisModeBtn');
        this.gameTitle = document.getElementById('gameTitle');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        this.startButton = document.getElementById('startButton');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.livesDisplay = document.getElementById('livesDisplay');
        this.gameInfo = document.getElementById('gameInfo');
        this.gameOverlay = document.getElementById('gameOverlay');
        
        // Setup event listeners
        this.pacmanBtn.addEventListener('click', () => this.switchMode('pacman'));
        this.snakeBtn.addEventListener('click', () => this.switchMode('snake'));
        this.tetrisBtn.addEventListener('click', () => this.switchMode('tetris'));
        // BULLETPROOF start button handler
        if (this.startButton) {
            console.log('Start button found, attaching handler...');
            this.startButton.onclick = () => {
                console.log('START BUTTON CLICKED!');
                
                // Always ensure we have a current game
                if (!this.currentGame) {
                    console.log('No current game, creating PacManGame...');
                    this.currentGame = new PacManGame();
                }
                
                // Start the game
                if (this.currentGame && typeof this.currentGame.startGame === 'function') {
                console.log('Starting game...');
                this.currentGame.startGame();
                    console.log('Game started successfully!');
            } else {
                    console.error('startGame method not found!');
                }
            };
            console.log('Start button handler attached successfully');
        } else {
            console.error('START BUTTON NOT FOUND!');
        }
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyPress(e);
        });
        
        // Mobile touch gesture support
        this.setupTouchGestures();
        
        // Initialize with Dot Muncher
        console.log('Initializing GameManager...');
        this.switchMode('pacman');
        
        // Setup help toggle
        this.setupHelpToggle();
        
        console.log('GameManager fully initialized');
        console.log('Current game:', this.currentGame);
        console.log('Start button ready');
    }
    
    switchMode(mode) {
        const wasGameRunning = this.currentGame && this.currentGame.gameRunning;
        
        // Stop and cleanup current game
        if (this.currentGame) {
            if (this.currentGame.stop) {
            this.currentGame.stop();
            }
            // Remove event listeners to prevent conflicts
            if (this.currentGame.cleanup) {
                this.currentGame.cleanup();
            }
        }
        
        // Reset overlay state and ensure it's visible
        this.gameOverlay.classList.remove('hidden');
        this.gameOverlay.classList.remove('game-over');
        
        // Update UI
        this.pacmanBtn.classList.remove('active');
        this.snakeBtn.classList.remove('active');
        this.tetrisBtn.classList.remove('active');
        
        if (mode === 'pacman') {
            this.pacmanBtn.classList.add('active');
            this.gameTitle.textContent = 'DOT MUNCHER';
            this.overlayTitle.textContent = 'DOT MUNCHER';
            this.overlayMessage.textContent = 'Use arrow keys to move';
            this.startButton.textContent = 'START GAME';
            this.scoreElement.textContent = '0';
            this.highScoreElement.textContent = localStorage.getItem('pacmanHighScore') || '0';
            this.gameInfo.textContent = 'CLASSIC MAZE GAME';
            this.livesDisplay.style.display = 'flex';
            this.currentMode = 'pacman';
            
            // Restore canvas to original size for Pac-Man
            const canvas = document.getElementById('gameCanvas');
            canvas.width = 448;
            canvas.height = 496;
            
            console.log('Creating new DotMuncherGame...');
            this.currentGame = new PacManGame();
            console.log('DotMuncherGame created successfully');
        } else if (mode === 'snake') {
            this.snakeBtn.classList.add('active');
            this.gameTitle.textContent = 'SNAKE';
            this.overlayTitle.textContent = 'SNAKE GAME';
            this.overlayMessage.textContent = 'Use arrow keys to move';
            this.startButton.textContent = 'START GAME';
            this.scoreElement.textContent = '0';
            this.highScoreElement.textContent = localStorage.getItem('snakeHighScore') || '0';
            this.gameInfo.textContent = 'NOKIA 3210 STYLE';
            this.livesDisplay.style.display = 'none';
            this.currentMode = 'snake';
            
            // Resize canvas for Snake (25% smaller)
            const canvas = document.getElementById('gameCanvas');
            canvas.width = 336;
            canvas.height = 372;
            
            console.log('Creating new SnakeGame...');
            this.currentGame = new SnakeGame();
            console.log('SnakeGame created:', this.currentGame);
        } else if (mode === 'tetris') {
            this.tetrisBtn.classList.add('active');
            this.gameTitle.textContent = 'BLOCK FALL';
            this.overlayTitle.textContent = 'BLOCK FALL';
            this.overlayMessage.textContent = 'Arrows to move/rotate, Space to drop';
            this.startButton.textContent = 'START GAME';
            this.scoreElement.textContent = '0';
            this.highScoreElement.textContent = localStorage.getItem('tetrisHighScore') || '0';
            this.gameInfo.textContent = 'PUZZLE BLOCK GAME';
            this.livesDisplay.style.display = 'none';
            this.currentMode = 'tetris';
            
            // Restore canvas to original size for Tetris
            const canvas = document.getElementById('gameCanvas');
            canvas.width = 448;
            canvas.height = 496;
            
            console.log('Creating new BlockFallGame...');
            this.currentGame = new TetrisGame();
            console.log('BlockFallGame created:', this.currentGame);
        }
        
        // Auto-start the new game immediately if the previous game was running
        if (wasGameRunning) {
            setTimeout(() => {
                if (this.currentGame && this.currentGame.startGame) {
                    this.currentGame.startGame();
                }
            }, 50);
        }
    }
    
    handleGlobalKeyPress(e) {
        // Only handle global shortcuts if a game is active and running
        if (!this.currentGame) return;
        
        switch(e.key.toLowerCase()) {
            case 'r':
                e.preventDefault();
                this.handleRestart();
                break;
            case 'p':
            case 'escape':
                e.preventDefault();
                this.handlePause();
                break;
        }
    }
    
    handleRestart() {
        if (!this.currentGame || !this.currentGame.gameRunning) return;
        
        const gameTitle = this.gameTitle.textContent;
        if (confirm(`Are you sure you want to restart ${gameTitle}?`)) {
            if (this.currentGame.restartGame) {
                this.currentGame.restartGame();
            } else if (this.currentGame.startGame) {
                this.currentGame.startGame();
            }
        }
    }
    
    handlePause() {
        if (!this.currentGame) return;
        
        if (this.currentGame.pauseGame) {
            this.currentGame.pauseGame();
        } else if (this.currentGame.togglePause) {
            this.currentGame.togglePause();
        }
    }
    
    setupTouchGestures() {
        let touchStartX = null;
        let touchStartY = null;
        let touchStartTime = null;
        const minSwipeDistance = 50;
        const maxSwipeTime = 500;
        
        const canvas = document.getElementById('gameCanvas');
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (!this.currentGame || !this.currentGame.gameRunning || touchStartX === null || touchStartY === null) {
                return;
            }
            
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;
            const touchEndTime = Date.now();
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const deltaTime = touchEndTime - touchStartTime;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Check if it's a valid swipe
            if (distance >= minSwipeDistance && deltaTime <= maxSwipeTime) {
                const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
                
                // Determine swipe direction
                let direction = null;
                if (angle >= -45 && angle <= 45) {
                    direction = 'right';
                } else if (angle >= 45 && angle <= 135) {
                    direction = 'down';
                } else if (angle >= 135 || angle <= -135) {
                    direction = 'left';
                } else if (angle >= -135 && angle <= -45) {
                    direction = 'up';
                }
                
                // Handle swipe based on current game
                if (direction) {
                    this.handleSwipeGesture(direction);
                }
            } else if (distance < 20 && deltaTime < 300) {
                // Handle tap (for Block Fall rotation)
                if (this.currentMode === 'tetris' && this.currentGame.rotatePiece) {
                    this.currentGame.rotatePiece();
                }
            }
            
            // Reset touch tracking
            touchStartX = null;
            touchStartY = null;
            touchStartTime = null;
        }, { passive: false });
    }
    
    handleSwipeGesture(direction) {
        if (!this.currentGame) return;
        
        switch(this.currentMode) {
            case 'pacman':
                if (this.currentGame.setPacmanDirection) {
                    const directionMap = {
                        'up': 3,
                        'down': 1,
                        'left': 2,
                        'right': 0
                    };
                    this.currentGame.setPacmanDirection(directionMap[direction]);
                }
                break;
                
            case 'snake':
                if (this.currentGame.changeDirection) {
                    const directionMap = {
                        'up': [0, -1],
                        'down': [0, 1],
                        'left': [-1, 0],
                        'right': [1, 0]
                    };
                    const [dx, dy] = directionMap[direction];
                    this.currentGame.changeDirection(dx, dy);
                }
                break;
                
            case 'tetris':
                if (this.currentGame.movePiece) {
                    switch(direction) {
                        case 'left':
                            this.currentGame.movePiece(-1, 0);
                            break;
                        case 'right':
                            this.currentGame.movePiece(1, 0);
                            break;
                        case 'up':
                            if (this.currentGame.rotatePiece) {
                                this.currentGame.rotatePiece();
                            }
                            break;
                        case 'down':
                            this.currentGame.movePiece(0, 1);
                            break;
                    }
                }
                break;
        }
    }
    
    setupHelpToggle() {
        const helpToggle = document.getElementById('helpToggle');
        const helpContent = document.getElementById('helpContent');
        
        if (helpToggle && helpContent) {
            helpToggle.addEventListener('click', () => {
                helpContent.classList.toggle('show');
            });
        }
    }
}

// Pac-Man Game (Display name: Dot Muncher for copyright)
class PacManGame {
    constructor() {
        console.log('🎯 CREATING PACMAN GAME...');
        
        // Get DOM elements
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.livesElement = document.getElementById('lives');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        this.startButton = document.getElementById('startButton');
        
        // Game settings
        this.tileSize = 16;
        this.mazeWidth = 28;
        this.mazeHeight = 31;
        this.gameSpeed = this.isMobile() ? 180 : 150; // Slightly slower on mobile
        
        // Game state
        this.gameRunning = false;
        this.paused = false;
        this.score = 0;
        this.lives = 3;
        this.highScore = localStorage.getItem('pacmanHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Pac-Man
        this.pacman = {
            x: 14,
            y: 23,
            direction: 0, // 0: right, 1: down, 2: left, 3: up
            nextDirection: 0,
            mouthAngle: 0,
            mouthOpen: true
        };
        
        // Enemy sprites - positioned outside center area for immediate action
        this.ghosts = [
            { x: 13, y: 10, color: '#DDA0DD', direction: 0, mode: 'chase', target: { x: 0, y: 0 }, personality: 'aggressive', lastPositions: [], stuckCounter: 0, exitDelay: 0 }, // Plum - starts outside
            { x: 14, y: 10, color: '#98FB98', direction: 1, mode: 'chase', target: { x: 0, y: 0 }, personality: 'ambush', lastPositions: [], stuckCounter: 0, exitDelay: 15 },   // Pale Green - slight delay
            { x: 15, y: 10, color: '#F4A460', direction: 2, mode: 'chase', target: { x: 0, y: 0 }, personality: 'patrol', lastPositions: [], stuckCounter: 0, exitDelay: 30 },   // Sandy Brown - more delay
            { x: 12, y: 10, color: '#FFD700', direction: 3, mode: 'chase', target: { x: 0, y: 0 }, personality: 'random', lastPositions: [], stuckCounter: 0, exitDelay: 45 }    // Khaki - most delay
        ];
        
        // Power mode
        this.powerMode = false;
        this.powerModeTimer = 0;
        this.powerModeDuration = 60; // frames
        
        // Maze layout (0: wall, 1: pellet, 2: power pellet, 3: empty)
        this.maze = this.createMaze();
        this.pellets = this.createPellets();
        
        // Initialize
        this.setupEventListeners();
        this.drawGame();
        
        console.log('✅ PACMAN GAME READY - startGame method:', typeof this.startGame);
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    }
    
    createMaze() {
        // Classic Pac-Man maze layout based on the reference image
        const maze = [];
        
        // Initialize with pellets
        for (let y = 0; y < this.mazeHeight; y++) {
            maze[y] = [];
            for (let x = 0; x < this.mazeWidth; x++) {
                maze[y][x] = 1; // pellet
            }
        }
        
        // Add walls around the edges
        for (let x = 0; x < this.mazeWidth; x++) {
            maze[0][x] = 0; // wall
            maze[this.mazeHeight - 1][x] = 0; // wall
        }
        for (let y = 0; y < this.mazeHeight; y++) {
            maze[y][0] = 0; // wall
            maze[y][this.mazeWidth - 1] = 0; // wall
        }
        
        // Create dynamic maze structure like reference image
        // Top horizontal walls - more dynamic
        for (let x = 2; x < 26; x++) {
            if (x < 6 || x > 22 || (x > 10 && x < 18)) {
                maze[2][x] = 0;
            }
        }
        
        // Bottom horizontal walls - more dynamic
        for (let x = 2; x < 26; x++) {
            if (x < 6 || x > 22 || (x > 10 && x < 18)) {
                maze[28][x] = 0;
            }
        }
        
        // Left vertical walls - more dynamic
        for (let y = 2; y < 28; y++) {
            if (y < 6 || y > 22 || (y > 10 && y < 18)) {
                maze[y][2] = 0;
            }
        }
        
        // Right vertical walls - more dynamic
        for (let y = 2; y < 28; y++) {
            if (y < 6 || y > 22 || (y > 10 && y < 18)) {
                maze[y][25] = 0;
            }
        }
        
        // Inner maze structure - smaller, accessible areas
        // Top left area - smaller and accessible
        for (let y = 6; y < 9; y++) {
            for (let x = 6; x < 10; x++) {
                if (y === 6 || y === 8 || x === 6 || x === 9) {
                    maze[y][x] = 0; // wall
                } else {
                    maze[y][x] = 3; // clear interior - no pellets
                }
            }
        }
        
        // Top right area - smaller and accessible
        for (let y = 6; y < 9; y++) {
            for (let x = 18; x < 22; x++) {
                if (y === 6 || y === 8 || x === 18 || x === 21) {
                    maze[y][x] = 0; // wall
                } else {
                    maze[y][x] = 3; // clear interior - no pellets
                }
            }
        }
        
        // Bottom left area - smaller and accessible
        for (let y = 20; y < 23; y++) {
            for (let x = 6; x < 10; x++) {
                if (y === 20 || y === 22 || x === 6 || x === 9) {
                    maze[y][x] = 0; // wall
                } else {
                    maze[y][x] = 3; // clear interior - no pellets
                }
            }
        }
        
        // Bottom right area - smaller and accessible
        for (let y = 20; y < 23; y++) {
            for (let x = 18; x < 22; x++) {
                if (y === 20 || y === 22 || x === 18 || x === 21) {
                    maze[y][x] = 0; // wall
                } else {
                    maze[y][x] = 3; // clear interior - no pellets
                }
            }
        }
        
        // Center ghost pen - with clear exit
        // Ghost pen walls (leaving top open for exit)
        for (let x = 12; x < 16; x++) {
            maze[12][x] = 0; // bottom wall
            // Leave top open for ghost exit - no wall at y=16
        }
        maze[13][12] = 0; // left wall
        maze[14][12] = 0;
        maze[15][12] = 0;
        maze[13][15] = 0; // right wall
        maze[14][15] = 0;
        maze[15][15] = 0;
        
        // Ensure clear exit path above ghost pen
        maze[11][13] = 3;
        maze[11][14] = 3;
        
        // Clear ghost pen interior - ensure no pellets in the middle
        maze[13][13] = 3;
        maze[13][14] = 3;
        maze[14][13] = 3;
        maze[14][14] = 3;
        
        // Also clear the immediate surrounding area to prevent any isolated pellets
        maze[12][13] = 3;
        maze[12][14] = 3;
        maze[15][13] = 3;
        maze[15][14] = 3;
        
        // Add tunnels on left and right sides
        for (let y = 14; y < 16; y++) {
            maze[y][0] = 3; // tunnel entrance
            maze[y][27] = 3; // tunnel entrance
        }
        
        // Add power pellets at corners (only in accessible areas)
        maze[3][3] = 2;
        maze[3][24] = 2;
        maze[25][3] = 2;
        maze[25][24] = 2;
        
        // Add some additional maze structure for variety
        // Horizontal barriers in the middle
        for (let x = 8; x < 20; x++) {
            if (x !== 13 && x !== 14) { // Leave gaps for passage
                maze[8][x] = 0;
                maze[20][x] = 0;
            }
        }
        
        // Vertical barriers
        for (let y = 8; y < 20; y++) {
            if (y !== 13 && y !== 14) { // Leave gaps for passage
                maze[y][8] = 0;
                maze[y][19] = 0;
            }
        }
        
        // Clear any areas that might be completely walled off
        // Check for isolated areas and clear them
        for (let y = 1; y < this.mazeHeight - 1; y++) {
            for (let x = 1; x < this.mazeWidth - 1; x++) {
                // If a cell is surrounded by walls on all sides, clear it
                if (maze[y][x] === 1) { // if it's a pellet
                    const isWalled = 
                        maze[y-1][x] === 0 && // wall above
                        maze[y+1][x] === 0 && // wall below
                        maze[y][x-1] === 0 && // wall left
                        maze[y][x+1] === 0;   // wall right
                    
                    if (isWalled) {
                        maze[y][x] = 3; // clear inaccessible pellet
                    }
                }
            }
        }
        
        // Clear Pac-Man starting position
        maze[23][14] = 3;
        
        return maze;
    }
    
    createPellets() {
        const pellets = [];
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                // Only place pellets in accessible areas (maze value 1 or 2)
                if (this.maze[y][x] === 1) {
                    pellets.push({ x, y, type: 'pellet' });
                } else if (this.maze[y][x] === 2) {
                    pellets.push({ x, y, type: 'power' });
                }
                // Skip inaccessible areas (maze value 3 = empty space)
            }
        }
        return pellets;
    }
    
    setupEventListeners() {
        // Store bound function references for cleanup
        this.boundKeyHandler = (e) => this.handleKeyPress(e);
        this.boundUpHandler = () => this.setPacmanDirection(3);
        this.boundDownHandler = () => this.setPacmanDirection(1);
        this.boundLeftHandler = () => this.setPacmanDirection(2);
        this.boundRightHandler = () => this.setPacmanDirection(0);
        
        // Keyboard controls
        document.addEventListener('keydown', this.boundKeyHandler);
        
        // Touch controls
        document.getElementById('upBtn').addEventListener('click', this.boundUpHandler);
        document.getElementById('downBtn').addEventListener('click', this.boundDownHandler);
        document.getElementById('leftBtn').addEventListener('click', this.boundLeftHandler);
        document.getElementById('rightBtn').addEventListener('click', this.boundRightHandler);
    }
    
    cleanup() {
        // Remove event listeners to prevent conflicts
        document.removeEventListener('keydown', this.boundKeyHandler);
        document.getElementById('upBtn').removeEventListener('click', this.boundUpHandler);
        document.getElementById('downBtn').removeEventListener('click', this.boundDownHandler);
        document.getElementById('leftBtn').removeEventListener('click', this.boundLeftHandler);
        document.getElementById('rightBtn').removeEventListener('click', this.boundRightHandler);
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.setPacmanDirection(3);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setPacmanDirection(1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.setPacmanDirection(2);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.setPacmanDirection(0);
                break;
        }
    }
    
    setPacmanDirection(direction) {
        this.pacman.nextDirection = direction;
    }
    
    startGame() {
        console.log('🎮 PACMAN STARTGAME CALLED!');
        
        try {
        this.gameRunning = true;
            this.paused = false;
        this.score = 0;
        this.lives = 3;
        this.pacman = { x: 14, y: 23, direction: 0, nextDirection: 0, mouthAngle: 0, mouthOpen: true };
        this.ghosts = [
                { x: 13, y: 11, color: '#DDA0DD', direction: 0, mode: 'chase', target: { x: 0, y: 0 }, personality: 'aggressive', lastPositions: [], stuckCounter: 0 },
                { x: 14, y: 11, color: '#98FB98', direction: 0, mode: 'chase', target: { x: 0, y: 0 }, personality: 'ambush', lastPositions: [], stuckCounter: 0 },
                { x: 15, y: 11, color: '#F4A460', direction: 0, mode: 'chase', target: { x: 0, y: 0 }, personality: 'patrol', lastPositions: [], stuckCounter: 0 },
                { x: 16, y: 11, color: '#F0E68C', direction: 0, mode: 'chase', target: { x: 0, y: 0 }, personality: 'random', lastPositions: [], stuckCounter: 0 }
        ];
        this.pellets = this.createPellets();
        this.powerMode = false;
        this.powerModeTimer = 0;
        this.updateScore();
        this.updateLives();
        this.gameOverlay.classList.add('hidden');
        this.gameLoop();
            console.log('✅ PACMAN GAME STARTED SUCCESSFULLY!');
        } catch (error) {
            console.error('💥 ERROR IN PACMAN STARTGAME:', error);
        }
    }
    
    stop() {
        this.gameRunning = false;
        this.paused = false;
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.paused = !this.paused;
        
        if (this.paused) {
            this.overlayTitle.textContent = 'PAUSED';
            this.overlayMessage.textContent = 'Press P to resume';
            this.gameOverlay.classList.remove('hidden');
        } else {
            this.gameOverlay.classList.add('hidden');
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        if (!this.paused) {
        this.update();
        }
        this.drawGame();
        
        setTimeout(() => {
            this.gameLoop();
        }, this.gameSpeed);
    }
    
    update() {
        this.updatePacman();
        this.updateGhosts();
        this.updatePowerMode();
        this.checkCollisions();
        this.checkWinCondition();
    }
    
    updatePacman() {
        // Check if next direction is valid
        if (this.canMove(this.pacman.x, this.pacman.y, this.pacman.nextDirection)) {
            this.pacman.direction = this.pacman.nextDirection;
        }
        
        // Move Pac-Man
        if (this.canMove(this.pacman.x, this.pacman.y, this.pacman.direction)) {
            const newPos = this.getNextPosition(this.pacman.x, this.pacman.y, this.pacman.direction);
            this.pacman.x = newPos.x;
            this.pacman.y = newPos.y;
        }
        
        // Handle tunnel teleportation for Pac-Man
        if (this.pacman.x <= 0) {
            this.pacman.x = this.mazeWidth - 2;
        } else if (this.pacman.x >= this.mazeWidth - 1) {
            this.pacman.x = 1;
        }
        
        // Animate mouth
        this.pacman.mouthAngle += 0.3;
        if (this.pacman.mouthAngle >= Math.PI) {
            this.pacman.mouthAngle = 0;
            this.pacman.mouthOpen = !this.pacman.mouthOpen;
        }
        
        // Check for pellets
        this.checkPelletCollection();
    }
    
    updateGhosts() {
        this.ghosts.forEach((ghost, index) => {
            // Handle exit delay - ghosts wait before leaving center
            if (ghost.exitDelay > 0) {
                ghost.exitDelay--;
                return;
            }
            
            // Simple but effective ghost AI
            const validMoves = [];
            
            // Check all 4 directions
                for (let dir = 0; dir < 4; dir++) {
                    const nextPos = this.getNextPosition(ghost.x, ghost.y, dir);
                
                // Check bounds and walls
                if (nextPos.x >= 0 && nextPos.x < this.mazeWidth && 
                    nextPos.y >= 0 && nextPos.y < this.mazeHeight &&
                    this.maze[nextPos.y] && this.maze[nextPos.y][nextPos.x] !== 0) {
                    
                    // Don't move into other ghosts (with some tolerance)
                        let blocked = false;
                        for (let i = 0; i < this.ghosts.length; i++) {
                            if (i !== index && this.ghosts[i].x === nextPos.x && this.ghosts[i].y === nextPos.y) {
                                blocked = true;
                                break;
                            }
                        }
                    
                        if (!blocked) {
                        const distanceToPacman = Math.sqrt(
                            (nextPos.x - this.pacman.x) ** 2 + (nextPos.y - this.pacman.y) ** 2
                        );
                        validMoves.push({
                            direction: dir,
                            x: nextPos.x,
                            y: nextPos.y,
                            distance: distanceToPacman
                        });
                    }
                }
            }
            
            // If no valid moves, force movement (ignore other ghosts)
            if (validMoves.length === 0) {
                for (let dir = 0; dir < 4; dir++) {
                    const nextPos = this.getNextPosition(ghost.x, ghost.y, dir);
                    if (nextPos.x >= 0 && nextPos.x < this.mazeWidth && 
                        nextPos.y >= 0 && nextPos.y < this.mazeHeight &&
                        this.maze[nextPos.y] && this.maze[nextPos.y][nextPos.x] !== 0) {
                        
                        const distanceToPacman = Math.sqrt(
                            (nextPos.x - this.pacman.x) ** 2 + (nextPos.y - this.pacman.y) ** 2
                        );
                        validMoves.push({
                            direction: dir,
                            x: nextPos.x,
                            y: nextPos.y,
                            distance: distanceToPacman
                        });
                    }
                }
            }
            
            if (validMoves.length > 0) {
                let chosenMove;
                
                if (this.powerMode) {
                    // Run away - pick the move that maximizes distance from Pac-Man
                    chosenMove = validMoves.reduce((best, move) => 
                        move.distance > best.distance ? move : best
                    );
                        } else {
                    // Chase Pac-Man - pick the move that minimizes distance (with some randomness)
                    if (Math.random() < 0.85) {
                        // 85% of the time, move toward Pac-Man
                        chosenMove = validMoves.reduce((best, move) => 
                            move.distance < best.distance ? move : best
                        );
                        } else {
                        // 15% of the time, move randomly for unpredictability
                        chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                    }
                }
                
                // Execute the move
                ghost.x = chosenMove.x;
                ghost.y = chosenMove.y;
                ghost.direction = chosenMove.direction;
            }
            
            // Handle tunnel teleportation
            if (ghost.x <= 0) {
                ghost.x = this.mazeWidth - 2;
            } else if (ghost.x >= this.mazeWidth - 1) {
                ghost.x = 1;
            }
        });
    }
    
    updatePowerMode() {
        if (this.powerMode) {
            this.powerModeTimer++;
            if (this.powerModeTimer >= this.powerModeDuration) {
                this.powerMode = false;
                this.powerModeTimer = 0;
            }
        }
    }
    
    canMove(x, y, direction, ghostIndex = -1) {
        const nextPos = this.getNextPosition(x, y, direction);
        
        // Check if position is out of bounds or a wall
        if (!this.maze[nextPos.y] || this.maze[nextPos.y][nextPos.x] === 0) {
            return false;
        }
        
        // Check if another ghost is already at this position
        for (let i = 0; i < this.ghosts.length; i++) {
            if (i !== ghostIndex && this.ghosts[i].x === nextPos.x && this.ghosts[i].y === nextPos.y) {
                return false;
            }
        }
        
        return true;
    }
    
    getNextPosition(x, y, direction) {
        switch(direction) {
            case 0: return { x: x + 1, y: y }; // right
            case 1: return { x: x, y: y + 1 }; // down
            case 2: return { x: x - 1, y: y }; // left
            case 3: return { x: x, y: y - 1 }; // up
            default: return { x, y };
        }
    }
    
    checkPelletCollection() {
        const pelletIndex = this.pellets.findIndex(pellet => 
            pellet.x === this.pacman.x && pellet.y === this.pacman.y
        );
        
        if (pelletIndex !== -1) {
            const pellet = this.pellets[pelletIndex];
            this.pellets.splice(pelletIndex, 1);
            
            if (pellet.type === 'pellet') {
                this.score += 10;
            } else if (pellet.type === 'power') {
                this.score += 50;
                this.powerMode = true;
                this.powerModeTimer = 0;
            }
            
            this.updateScore();
        }
    }
    
    checkCollisions() {
        this.ghosts.forEach(ghost => {
            if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
                if (this.powerMode) {
                    // Eat ghost
                    this.score += 200;
                    this.updateScore();
                    // Reset ghost to starting position
                    ghost.x = 13 + Math.floor(Math.random() * 4);
                    ghost.y = 11;
                } else {
                    // Immediate death when caught by ghost
                    this.loseLife();
                    return; // Exit immediately after losing life
                }
            }
        });
    }
    
    loseLife() {
        this.lives--;
        this.updateLives();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset positions
            this.pacman = { x: 14, y: 23, direction: 0, nextDirection: 0, mouthAngle: 0, mouthOpen: true };
            this.ghosts = [
                { x: 13, y: 11, color: '#ff0000', direction: 0, mode: 'chase', target: { x: 0, y: 0 } },
                { x: 14, y: 11, color: '#ffb8ff', direction: 0, mode: 'chase', target: { x: 0, y: 0 } },
                { x: 15, y: 11, color: '#00ffff', direction: 0, mode: 'chase', target: { x: 0, y: 0 } },
                { x: 16, y: 11, color: '#ffb852', direction: 0, mode: 'chase', target: { x: 0, y: 0 } }
            ];
        }
    }
    
    checkWinCondition() {
        if (this.pellets.length === 0) {
            this.gameWin();
        }
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        this.drawMaze();
        
        // Draw pellets
        this.drawPellets();
        
        // Draw Pac-Man
        this.drawPacman();
        
        // Draw ghosts
        this.drawGhosts();
    }
    
    drawMaze() {
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                if (this.maze[y][x] === 0) {
                    this.ctx.fillStyle = '#0066ff';
                    this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }
    
    drawPellets() {
        this.pellets.forEach(pellet => {
            if (pellet.type === 'pellet') {
                this.ctx.fillStyle = '#ffff00'; // Bright yellow for pellets
                this.ctx.beginPath();
                this.ctx.arc(
                    pellet.x * this.tileSize + this.tileSize / 2,
                    pellet.y * this.tileSize + this.tileSize / 2,
                    2,
                    0,
                    2 * Math.PI
                );
                this.ctx.fill();
            } else if (pellet.type === 'power') {
                this.ctx.fillStyle = '#ff00ff'; // Bright magenta for power pellets
                this.ctx.beginPath();
                this.ctx.arc(
                    pellet.x * this.tileSize + this.tileSize / 2,
                    pellet.y * this.tileSize + this.tileSize / 2,
                    6,
                    0,
                    2 * Math.PI
                );
                this.ctx.fill();
            }
        });
    }
    
    drawPacman() {
        const centerX = this.pacman.x * this.tileSize + this.tileSize / 2;
        const centerY = this.pacman.y * this.tileSize + this.tileSize / 2;
        const radius = this.tileSize / 2 - 2;
        
        this.ctx.fillStyle = this.powerMode ? '#ffffff' : '#ffff00'; // Bright yellow for pacman
        this.ctx.beginPath();
        
        if (this.pacman.mouthOpen) {
            // Draw Pac-Man with mouth
            const mouthAngle = Math.PI / 4;
            const startAngle = this.pacman.direction * Math.PI / 2 + mouthAngle;
            const endAngle = this.pacman.direction * Math.PI / 2 - mouthAngle;
            
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.lineTo(centerX, centerY);
            this.ctx.fill();
        } else {
            // Draw full circle
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawGhosts() {
        this.ghosts.forEach(ghost => {
            const centerX = ghost.x * this.tileSize + this.tileSize / 2;
            const centerY = ghost.y * this.tileSize + this.tileSize / 2;
            const radius = this.tileSize / 2 - 2;
            
            // Draw ghost body
            const ghostColor = this.powerMode ? '#0000ff' : ghost.color;
            this.ctx.fillStyle = ghostColor;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI);
            this.ctx.fillRect(centerX - radius, centerY, radius * 2, radius);
            this.ctx.fill();
            
            // Draw ghost eyes
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX - 3, centerY - 2, 2, 0, 2 * Math.PI);
            this.ctx.arc(centerX + 3, centerY - 2, 2, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Draw pupils
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(centerX - 3, centerY - 2, 1, 0, 2 * Math.PI);
            this.ctx.arc(centerX + 3, centerY - 2, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('pacmanHighScore', this.highScore);
        }
    }
    
    updateLives() {
        this.livesElement.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            lifeIcon.textContent = '●';
            this.livesElement.appendChild(lifeIcon);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gameOverlay.classList.remove('hidden');
        this.gameOverlay.classList.add('game-over');
        this.overlayTitle.textContent = 'GAME OVER';
        this.overlayMessage.textContent = `Score: ${this.score}`;
        this.startButton.textContent = 'PLAY AGAIN';
    }
    
    gameWin() {
        this.gameRunning = false;
        this.gameOverlay.classList.remove('hidden');
        this.overlayTitle.textContent = 'YOU WIN!';
        this.overlayMessage.textContent = `Score: ${this.score}`;
        this.startButton.textContent = 'PLAY AGAIN';
    }
}

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
        
        // Game settings - match PacMan dimensions
        this.gridSize = 16;
        this.tileCountX = 28;  // Match PacMan maze width
        this.tileCountY = 31;  // Match PacMan maze height
        this.gameSpeed = this.isMobile() ? 180 : 150; // Slightly slower on mobile
        
        // Game state
        this.gameRunning = false;
        this.paused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Snake
        this.snake = [
            {x: Math.floor(this.tileCountX / 2), y: Math.floor(this.tileCountY / 2)}
        ];
        this.dx = 0;
        this.dy = 0;
        
        // Food
        this.food = this.generateFood();
        
        // Initialize
        this.setupEventListeners();
        this.drawGame();
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    }
    
    setupEventListeners() {
        // Store bound function references for cleanup
        this.boundKeyHandler = (e) => this.handleKeyPress(e);
        this.boundUpHandler = () => this.changeDirection(0, -1);
        this.boundDownHandler = () => this.changeDirection(0, 1);
        this.boundLeftHandler = () => this.changeDirection(-1, 0);
        this.boundRightHandler = () => this.changeDirection(1, 0);
        
        // Keyboard controls
        document.addEventListener('keydown', this.boundKeyHandler);
        
        // Touch controls
        document.getElementById('upBtn').addEventListener('click', this.boundUpHandler);
        document.getElementById('downBtn').addEventListener('click', this.boundDownHandler);
        document.getElementById('leftBtn').addEventListener('click', this.boundLeftHandler);
        document.getElementById('rightBtn').addEventListener('click', this.boundRightHandler);
    }
    
    cleanup() {
        // Remove event listeners to prevent conflicts
        document.removeEventListener('keydown', this.boundKeyHandler);
        document.getElementById('upBtn').removeEventListener('click', this.boundUpHandler);
        document.getElementById('downBtn').removeEventListener('click', this.boundDownHandler);
        document.getElementById('leftBtn').removeEventListener('click', this.boundLeftHandler);
        document.getElementById('rightBtn').removeEventListener('click', this.boundRightHandler);
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
        console.log('Starting Snake game...');
        this.gameRunning = true;
        this.paused = false;
        this.score = 0;
        this.snake = [{x: Math.floor(this.tileCountX / 2), y: Math.floor(this.tileCountY / 2)}];
        this.dx = 1; // Start moving right automatically
        this.dy = 0;
        this.food = this.generateFood();
        this.updateScore();
        this.gameOverlay.classList.add('hidden');
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
        this.paused = false;
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.paused = !this.paused;
        
        if (this.paused) {
            this.overlayTitle.textContent = 'PAUSED';
            this.overlayMessage.textContent = 'Press P to resume';
            this.gameOverlay.classList.remove('hidden');
        } else {
            this.gameOverlay.classList.add('hidden');
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        if (!this.paused) {
        this.update();
        }
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
        
        // Check wall collision - use fixed dimensions to match PacMan
        const maxTileX = this.tileCountX;
        const maxTileY = this.tileCountY;
        
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
        const maxTileX = this.tileCountX;
        const maxTileY = this.tileCountY;
        
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
        this.ctx.fillStyle = '#000000';
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
        
        // Use fixed dimensions to match PacMan
        const maxTileX = this.tileCountX;
        const maxTileY = this.tileCountY;
        
        for (let i = 0; i <= maxTileX; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, maxTileY * this.gridSize);
            this.ctx.stroke();
        }
            
        for (let i = 0; i <= maxTileY; i++) {
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(maxTileX * this.gridSize, i * this.gridSize);
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

// Tetris Game (Display name: Block Fall for copyright)
class TetrisGame {
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
        this.blockSize = 22;
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.gameSpeed = this.isMobile() ? 900 : 800; // Slightly slower on mobile
        
        // Game state
        this.gameRunning = false;
        this.paused = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.highScore = localStorage.getItem('tetrisHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Game board - 0 = empty, 1 = filled
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        
        // Current piece
        this.currentPiece = null;
        this.currentX = 0;
        this.currentY = 0;
        this.currentRotation = 0;
        
        // Tetromino shapes
        this.tetrominoes = {
            I: [
                [[1,1,1,1]],
                [[1],[1],[1],[1]]
            ],
            O: [
                [[1,1],[1,1]]
            ],
            T: [
                [[0,1,0],[1,1,1]],
                [[1,0],[1,1],[1,0]],
                [[1,1,1],[0,1,0]],
                [[0,1],[1,1],[0,1]]
            ],
            S: [
                [[0,1,1],[1,1,0]],
                [[1,0],[1,1],[0,1]]
            ],
            Z: [
                [[1,1,0],[0,1,1]],
                [[0,1],[1,1],[1,0]]
            ],
            J: [
                [[1,0,0],[1,1,1]],
                [[1,1],[1,0],[1,0]],
                [[1,1,1],[0,0,1]],
                [[0,1],[0,1],[1,1]]
            ],
            L: [
                [[0,0,1],[1,1,1]],
                [[1,0],[1,0],[1,1]],
                [[1,1,1],[1,0,0]],
                [[1,1],[0,1],[0,1]]
            ]
        };
        
        this.tetrominoTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        // Toned down color scheme for Block Fall
        this.tetrominoColors = {
            I: '#B19CD9', // Light Purple
            O: '#F39C73', // Soft Orange  
            T: '#85C1A5', // Soft Green
            S: '#7FB3D3', // Soft Blue
            Z: '#F1948A', // Soft Red
            J: '#F8C471', // Light Orange
            L: '#7DCEA0'  // Light Turquoise
        };
        
        // Initialize
        this.setupEventListeners();
        this.drawGame();
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    }
    
    setupEventListeners() {
        // Store bound function references for cleanup
        this.boundKeyHandler = (e) => this.handleKeyPress(e);
        this.boundUpHandler = () => this.rotatePiece(); // Up button rotates
        this.boundDownHandler = () => this.movePiece(0, 1); // Down button soft drop
        this.boundLeftHandler = () => this.movePiece(-1, 0); // Left button moves left
        this.boundRightHandler = () => this.movePiece(1, 0); // Right button moves right
        
        // Keyboard controls
        document.addEventListener('keydown', this.boundKeyHandler);
        
        // Touch controls
        document.getElementById('upBtn').addEventListener('click', this.boundUpHandler);
        document.getElementById('downBtn').addEventListener('click', this.boundDownHandler);
        document.getElementById('leftBtn').addEventListener('click', this.boundLeftHandler);
        document.getElementById('rightBtn').addEventListener('click', this.boundRightHandler);
    }
    
    cleanup() {
        // Remove event listeners to prevent conflicts
        document.removeEventListener('keydown', this.boundKeyHandler);
        document.getElementById('upBtn').removeEventListener('click', this.boundUpHandler);
        document.getElementById('downBtn').removeEventListener('click', this.boundDownHandler);
        document.getElementById('leftBtn').removeEventListener('click', this.boundLeftHandler);
        document.getElementById('rightBtn').removeEventListener('click', this.boundRightHandler);
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0); // Move left
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0); // Move right
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece(); // Rotate piece
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1); // Soft drop (move down)
                break;
            case ' ':
                e.preventDefault();
                this.hardDrop(); // Hard drop
                break;
        }
    }
    
    startGame() {
        console.log('Starting Block Fall game...');
        this.gameRunning = true;
        this.paused = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        this.spawnPiece();
        this.updateScore();
        this.gameOverlay.classList.add('hidden');
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
        this.paused = false;
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.paused = !this.paused;
        
        if (this.paused) {
            this.overlayTitle.textContent = 'PAUSED';
            this.overlayMessage.textContent = 'Press P to resume';
            this.gameOverlay.classList.remove('hidden');
        } else {
            this.gameOverlay.classList.add('hidden');
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        if (!this.paused) {
            this.update();
        }
        this.drawGame();
        
        setTimeout(() => {
            this.gameLoop();
        }, Math.max(300, this.gameSpeed - (this.level - 1) * 80));
    }
    
    update() {
        // Try to move piece down
        if (!this.movePiece(0, 1)) {
            // Piece can't move down, lock it in place
            this.lockPiece();
            this.clearLines();
            this.spawnPiece();
            
            // Check game over
            if (!this.isValidPosition(this.currentX, this.currentY, this.currentRotation)) {
                this.gameOver();
            }
        }
    }
    
    spawnPiece() {
        const type = this.tetrominoTypes[Math.floor(Math.random() * this.tetrominoTypes.length)];
        this.currentPiece = { type, color: this.tetrominoColors[type] };
        this.currentX = Math.floor(this.boardWidth / 2) - 1;
        this.currentY = 0;
        this.currentRotation = 0;
    }
    
    movePiece(dx, dy) {
        const newX = this.currentX + dx;
        const newY = this.currentY + dy;
        
        if (this.isValidPosition(newX, newY, this.currentRotation)) {
            this.currentX = newX;
            this.currentY = newY;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        const shapes = this.tetrominoes[this.currentPiece.type];
        const newRotation = (this.currentRotation + 1) % shapes.length;
        
        if (this.isValidPosition(this.currentX, this.currentY, newRotation)) {
            this.currentRotation = newRotation;
        }
    }
    
    hardDrop() {
        // Drop the piece as far down as possible
        while (this.movePiece(0, 1)) {
            // Keep moving down until it can't move anymore
        }
        // The piece will be locked in the next update cycle
    }
    
    isValidPosition(x, y, rotation) {
        const shapes = this.tetrominoes[this.currentPiece.type];
        const shape = shapes[rotation];
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.boardWidth || 
                        newY >= this.boardHeight || 
                        (newY >= 0 && this.board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    lockPiece() {
        const shapes = this.tetrominoes[this.currentPiece.type];
        const shape = shapes[this.currentRotation];
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = this.currentX + col;
                    const y = this.currentY + row;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                // Line is full, clear it
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.level = Math.floor(this.lines / 10) + 1;
            
            // Score based on lines cleared (more lines = exponentially more points)
            const basePoints = [0, 40, 100, 300, 1200];
            this.score += basePoints[linesCleared] * this.level;
            this.updateScore();
        }
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board outline
        this.ctx.strokeStyle = '#39ff14';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            (this.canvas.width - this.boardWidth * this.blockSize) / 2 - 1,
            (this.canvas.height - this.boardHeight * this.blockSize) / 2 - 1,
            this.boardWidth * this.blockSize + 2,
            this.boardHeight * this.blockSize + 2
        );
        
        // Calculate offset to center the board
        const offsetX = (this.canvas.width - this.boardWidth * this.blockSize) / 2;
        const offsetY = (this.canvas.height - this.boardHeight * this.blockSize) / 2;
        
        // Draw placed pieces
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(
                        offsetX + x * this.blockSize,
                        offsetY + y * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            const shapes = this.tetrominoes[this.currentPiece.type];
            const shape = shapes[this.currentRotation];
            
            this.ctx.fillStyle = this.currentPiece.color;
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        this.ctx.fillRect(
                            offsetX + (this.currentX + col) * this.blockSize,
                            offsetY + (this.currentY + row) * this.blockSize,
                            this.blockSize - 1,
                            this.blockSize - 1
                        );
                    }
                }
            }
        }
        
        // Draw level and lines info
        this.ctx.fillStyle = '#39ff14';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`Level: ${this.level}`, 35, 30);
        this.ctx.fillText(`Lines: ${this.lines}`, 35, 50);
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('tetrisHighScore', this.highScore);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gameOverlay.classList.remove('hidden');
        this.gameOverlay.classList.add('game-over');
        this.overlayTitle.textContent = 'GAME OVER';
        this.overlayMessage.textContent = `Score: ${this.score} | Level: ${this.level}`;
        this.startButton.textContent = 'PLAY AGAIN';
    }
}

        // Initialize game manager when page loads - bulletproof version
document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, creating GameManager...');
            
            // Check if start button exists
            const startBtn = document.getElementById('startButton');
            console.log('Start button exists:', !!startBtn);
            
            if (!startBtn) {
                console.error('CRITICAL: Start button not found!');
                return;
            }
            
            try {
                window.gameManager = new GameManager();
                console.log('GameManager created successfully');
                
                // Test the button handler
                setTimeout(() => {
                    console.log('Testing button handler...');
                    if (startBtn.onclick) {
                        console.log('Button has onclick handler');
                    } else {
                        console.error('Button has NO onclick handler!');
                    }
                }, 100);
                
            } catch (error) {
                console.error('Error creating GameManager:', error);
            }
});
