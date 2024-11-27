let ball;
let hoop;
let court;
let mode = 'auto'; // 'auto' or 'manual'
let success = false;
let twoPointAttempts = 0;
let twoPointSuccess = 0;
let threePointAttempts = 0;
let threePointSuccess = 0;
let autoInterval;

function setup() {
    createCanvas(800, 600, WEBGL);

    // Initialize court, ball, and hoop
    court = new Court();
    ball = new Ball();
    hoop = new Hoop(300, -120, 0); // Goal position

    // Start auto mode by default
    startAutoMode();
}

function draw() {
    background(220);

    // Camera settings
    camera(0, -300, 800, 0, 0, 0, 0, 1, 0);

    // Draw court and 3P line
    court.show();

    // Draw the hoop
    hoop.show();

    // Update and draw the ball
    ball.update();
    ball.show();

    // Check if the ball scores
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

    // Check if the ball is out of bounds
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

function mousePressed() {
    if (mode === 'manual' && ball.isStationary) {
        const targetX = map(mouseX - width / 2, -width / 2, width / 2, -800, 800);
        const targetY = map(mouseY - height / 2, -height / 2, height / 2, 300, -300);
        const targetZ = random(-10, 10);
        ball.launch(targetX, targetY, targetZ);
        success = false;
    }
}

function startAutoMode() {
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(() => {
        if (ball.isStationary) {
            launchBall();
        }
    }, 2000);
}

function stopAutoMode() {
    if (autoInterval) clearInterval(autoInterval);
}

function setMode(newMode) {
    mode = newMode;
    if (mode === 'auto') {
        startAutoMode();
    } else {
        stopAutoMode();
    }
}

function launchBall() {
    // Randomized starting position
    ball.x = random(-400, -200);
    ball.y = random(-100, -50);
    ball.z = random(-150, 150);

    // Randomized target direction near the goal
    const targetX = hoop.x + random(-15, 15);
    const targetY = hoop.y + random(-15, 15);
    const targetZ = hoop.z + random(-10, 10);

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
        this.y = -100;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.radius = 15;
        this.isStationary = true;
    }

    launch(targetX, targetY, targetZ) {
        this.vx = (targetX - this.x) / 30;
        this.vy = (targetY - this.y) / 30 - 1.2; // Slight parabola adjustment
        this.vz = (targetZ - this.z) / 30;
        this.isStationary = false;
    }

    update() {
        if (!this.isStationary) {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            this.vy += 0.35; // Gravity
            this.vx *= 0.99; // Air resistance
            this.vz *= 0.99; // Air resistance
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
        return dist(this.x, 0, this.z, 0, 0, 0) > 225; // Distance-based
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
        translate(0, 100, 0); // Lower the court
        rotateX(HALF_PI);
        plane(1400, 800); // Court size
        pop();

        // Draw 3-point line
        push();
        noFill();
        stroke(255);
        strokeWeight(2);
        translate(0, 100, 0);
        rotateX(HALF_PI);
        ellipse(0, 0, 450 * 2, 450 * 2); // 3-point line
        pop();
    }
}


