// My box2D object
let b2 = new MyBox2D;

// My settings
let canvasWidth = 700;
let canvasHeight = 400;
let animationFrameRate = 60;
let simulationFrameRate = 200; // don't change this (problems with drag forces)
let speedFactor = 1; // don't change this below 1 (problems with drag forces)

// Colors
const FIELDBOUNDARIES = "red";
const SLOPES = 40;
const BALL = "yellow";
const DUMMYNOTBLOCKING = 30;

// Global variables
let actualFrameRate = animationFrameRate;
let dummies = [];
let ball;
let field;
let fieldWidthPxl = canvasWidth * 0.95;
let fieldHeightPxl = canvasHeight * 0.95;

function setup() {
    // determine field dimensions
    if (fieldWidthPxl * fieldWidthPxl * (703 / 1210) < (fieldHeightPxl * fieldHeightPxl * (1210 / 703))) {
        fieldHeightPxl = fieldWidthPxl * (703 / 1210);
    } else {
        fieldWidthPxl = fieldHeightPxl * (1210 / 703);
    }

    // Box 2D settings
    b2.speedFactor = speedFactor; // speed of animation (<0)
    b2.frameRate = simulationFrameRate; // desired framerate
    b2.pixelScale = fieldWidthPxl / 1.21 // pixel to world scale: (pixel dist)/(world dist)
    b2.unitsScaleX = 10000; // units to world scale: (units dist)/(world dist)
    b2.unitsScaleY = -10000; // units to world scale: (units dist)/(world dist)
    b2.xOff = b2.pxlToWorld(canvasWidth / 2 - fieldWidthPxl / 2); // offset for user's units in x direction ([0] in units == [0 + offset] in world)
    b2.yOff = b2.pxlToWorld(canvasHeight / 2); // offset for user's units in y direction

    b2.createWorld(0, 0) // gravity
    b2.world.SetContactListener(new myListener);

    // Create canvas
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch-holder');
    frameRate(animationFrameRate);

    // Create objects
    field = new Field();
    dummies.push(new Dummy(12100 / 2, 0));
    ball = new Ball(5400, 0)
}

function draw() {
    background(50);
    for (let a = 0; a < round(simulationFrameRate / animationFrameRate); a++) {
        for (let i = 0; i < (speedFactor > 1 ? Math.round(speedFactor) : 1); i++) {
            b2.update();
            ball.updateState();
            ball.applyForces();
            for (let d of dummies) {
                d.update();
            }
        }
    }

    for (let d of dummies) {
        d.draw();
    }
    field.draw();
    ball.draw();
    actualFrameRate = frameRate();
}

class myListener extends b2.ContactListener {
    PreSolve(contact, manifold) {
        let objects = [];
        objects.push(contact.m_fixtureA.GetBody().GetUserData());
        objects.push(contact.m_fixtureB.GetBody().GetUserData());

        for (let o of objects) {
            if (o instanceof Dummy) {
                if (!o.canInteract) {
                    contact.SetEnabled(0);
                }
            }
        }
    }
}