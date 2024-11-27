let ball;
let hoop;
let success = false;
let twoPointAttempts = 0;
let twoPointSuccess = 0;
let threePointAttempts = 0;
let threePointSuccess = 0;

function setup() {
    createCanvas(800, 600);

    // Initialize the ball and hoop
    ball = new Ball();
    hoop = new Hoop(width - 100, height / 2 - 50);

    // シュートを一定間隔で実行
    setInterval(() => {
        if (ball.isStationary) {
            launchBall();
        }
    }, 2000); // 2秒ごとにシュート
}

function draw() {
    background(200);

    // Draw the hoop
    hoop.show();

    // Update and draw the ball
    ball.update();
    ball.show();

    // Check for score
    if (!success && ball.isScored(hoop)) {
        success = true;
        if (ball.isThreePoint()) {
            threePointAttempts++;
            threePointSuccess++;
        } else {
            twoPointAttempts++;
            twoPointSuccess++;
        }
        updateEvaluation();
        resetBall();
    }

    // Check if ball missed
    if (ball.isOutOfBounds()) {
        success = true;
        if (ball.isThreePoint()) {
            threePointAttempts++;
        } else {
            twoPointAttempts++;
        }
        updateEvaluation();
        resetBall();
    }
}

function launchBall() {
    // ランダムな位置からシュートを発射
    const targetX = random(width - 200, width - 50); // ゴール付近をターゲット
    const targetY = random(height / 4, height / 2); // ゴールの高さ周辺
    ball.launch(targetX, targetY);
    success = false;
}

function updateEvaluation() {
    const twoPointRate = ((twoPointSuccess / twoPointAttempts) * 100).toFixed(2);
    const threePointRate = ((threePointSuccess / threePointAttempts) * 100).toFixed(2);

    document.getElementById('twoPointRate').textContent = `${twoPointRate}%`;
    document.getElementById('threePointRate').textContent = `${threePointRate}%`;
}

function resetBall() {
    ball = new Ball();
}

// Ball class
class Ball {
    constructor() {
        this.x = 100;
        this.y = height / 2;
        this.vx = 0;
        this.vy = 0;
        this.radius = 15;
        this.isStationary = true;
    }

    launch(targetX, targetY) {
        this.vx = (targetX - this.x) / 20;
        this.vy = (targetY - this.y) / 20;
        this.isStationary = false;
    }

    update() {
        if (!this.isStationary) {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.5; // Simulate gravity
        }
    }

    show() {
        fill(255, 150, 0);
        ellipse(this.x, this.y, this.radius * 2);
    }

    isScored(hoop) {
        const d = dist(this.x, this.y, hoop.x, hoop.y);
        return d < this.radius + hoop.radius;
    }

    isOutOfBounds() {
        return this.y > height || this.x > width;
    }

    isThreePoint() {
        return this.x > width / 2;
    }
}

// Hoop class
class Hoop {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
    }

    show() {
        noFill();
        stroke(255, 0, 0);
        ellipse(this.x, this.y, this.radius * 2);
    }
}


