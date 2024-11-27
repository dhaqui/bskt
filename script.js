let ball;
let hoop;
let court;
let success = false;
let twoPointAttempts = 0;
let twoPointSuccess = 0;
let threePointAttempts = 0;
let threePointSuccess = 0;

function setup() {
    createCanvas(800, 600, WEBGL);

    // コート、ボール、ゴールを初期化
    court = new Court();
    ball = new Ball();
    hoop = new Hoop(600, -100, 0); // ゴール位置（現実的な高さと位置）
    
    // シュートを一定間隔で実行
    setInterval(() => {
        if (ball.isStationary) {
            launchBall();
        }
    }, 2000); // 2秒ごとにシュート
}

function draw() {
    background(220);

    // 3Dカメラの視点設定
    camera(0, -300, 800, 0, 0, 0, 0, 1, 0);

    // コートを描画
    court.show();

    // ゴールを描画
    hoop.show();

    // ボールを更新・描画
    ball.update();
    ball.show();

    // 成功判定
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

    // ボールが外れた場合
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
    // シュート開始位置（ランダム化）
    ball.x = random(-400, -200); // コート内の適切な範囲
    ball.y = random(-50, 0);
    ball.z = random(-200, 200);

    // シュートターゲット（ゴール周辺）
    const targetX = hoop.x + random(-5, 5);
    const targetY = hoop.y + random(-5, 5);
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
        this.x = -400;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.radius = 15;
        this.isStationary = true;
    }

    launch(targetX, targetY, targetZ) {
        this.vx = (targetX - this.x) / 30;
        this.vy = (targetY - this.y) / 30 - 1.5; // 放物線を作る調整
        this.vz = (targetZ - this.z) / 30;
        this.isStationary = false;
    }

    update() {
        if (!this.isStationary) {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            this.vy += 0.4; // 重力
            this.vx *= 0.99; // 空気抵抗
            this.vz *= 0.99; // 空気抵抗
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
        return this.y > 300 || this.x > 700 || this.z > 300 || this.z < -300;
    }

    isThreePoint() {
        return dist(this.x, 0, this.z, 0, 0, 0) > 225; // 距離で判定
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

// Court class
class Court {
    show() {
        push();
        fill(100, 150, 100);
        noStroke();
        rotateX(HALF_PI);
        plane(1400, 800); // コートサイズ
        pop();
    }
}


