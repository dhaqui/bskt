let ball;
let hoop;
let success = false;
let twoPointAttempts = 0;
let twoPointSuccess = 0;
let threePointAttempts = 0;
let threePointSuccess = 0;

function setup() {
    createCanvas(800, 600, WEBGL);

    // Initialize the ball and hoop
    ball = new Ball();
    hoop = new Hoop(300, -50, 0);

    // シュートを一定間隔で実行
    setInterval(() => {
        if (ball.isStationary) {
            launchBall();
        }
    }, 2000); // 2秒ごとにシュート
}

function draw() {
    background(200);

    // 3Dカメラの視点設定
    camera(400, -200, 800, 0, 0, 0, 0, 1, 0);

    // Draw the court
    drawCourt();

    // Draw the hoop
    hoop.show();

    // Draw XYZ axes
    drawAxes();

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

function drawCourt() {
    push();
    fill(100, 150, 100);
    noStroke();
    rotateX(HALF_PI);
    translate(0, 0, -1);
    plane(600, 400); // コートの平面
    pop();
}

function drawAxes() {
    strokeWeight(2);

    // X軸
    stroke(255, 0, 0);
    line(0, 0, 0, 300, 0, 0);

    // Y軸
    stroke(0, 255, 0);
    line(0, 0, 0, 0, -300, 0);

    // Z軸
    stroke(0, 0, 255);
    line(0, 0, 0, 0, 0, 300);
}

function launchBall() {
    // ランダムな開始地点を設定
    ball.x = random(-300, -100); // 左側のランダムな位置
    ball.y = random(0, 100);    // 縦方向のランダムな位置
    ball.z = random(-100, 100); // 奥行きのランダムな位置

    // ランダムなターゲット方向にシュート
    const targetX = hoop.x + random(-10, 10); // ゴール付近のランダム誤差
    const targetY = hoop.y + random(-10, 10);
    const targetZ = hoop.z + random(-5, 5);

    ball.launch(targetX, targetY, targetZ);
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
        this.x = -300;
        this.y = 50;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.radius = 15;
        this.isStationary = true;
    }

    launch(targetX, targetY, targetZ) {
        this.vx = (targetX - this.x) / 40;
        this.vy = (targetY - this.y) / 40 - 1; // 少し下に曲げる
        this.vz = (targetZ - this.z) / 40;
        this.isStationary = false;
    }

    update() {
        if (!this.isStationary) {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            this.vy += 0.3; // Simulate gravity
        }
    }

    show() {
        push();
        translate(this.x, this.y, this.z);
        fill(255, 150, 0);
        sphere(this.radius);
        pop();
    }

    isScored(hoop) {
        const d = dist(this.x, this.y, this.z, hoop.x, hoop.y, hoop.z);
        return d < this.radius + hoop.radius;
    }

    isOutOfBounds() {
        return this.y > 200 || this.x > 500 || this.z > 300 || this.z < -300;
    }

    isThreePoint() {
        return dist(this.x, this.y, this.z, hoop.x, hoop.y, hoop.z) > 150;
    }
}

// Hoop class
class Hoop {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = 20;
    }

    show() {
        push();
        translate(this.x, this.y, this.z);
        noFill();
        stroke(255, 0, 0);
        strokeWeight(3);
        ellipse(0, 0, this.radius * 2);
        pop();
    }
}


