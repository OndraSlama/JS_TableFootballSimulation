// My box2D object
let b2 = new MyBox2D;

// My settings
let canvasWidth = 700;
let canvasHeight = 400;
let setFrameRate = 60;
let speedFactor = 1;

// Global variables
let actualFrameRate = setFrameRate;
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
    b2.frameRate = setFrameRate; // desired framerate
    b2.pixelScale = fieldWidthPxl / 1.21 // pixel to world scale: (pixel dist)/(world dist)
    b2.unitsScale = 10000; // units to world scale: (units dist)/(world dist)
    b2.xOff = b2.pxlToWorld(canvasWidth / 2 - fieldWidthPxl / 2); // offset for user's units in x direction ([0] in units == [0 + offset] in world)
    b2.yOff = b2.pxlToWorld(canvasHeight / 2); // offset for user's units in y direction

    b2.createWorld(0, 0) // gravity

    // Create canvas
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch-holder');
    frameRate(setFrameRate);

    // Create objects
    ball = new Ball(12100 / 2, 1500)
    dummies.push(new Dummy(12100 / 2, 0));
    field = new Field();
}

function draw() {
    background(50);
    b2.update();
    

    for (let d of dummies) {
        d.draw();
    }
    ball.draw();
    field.draw();
    actualFrameRate = frameRate();
}