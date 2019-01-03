// My box2D object
let b2 = new B2;

// My settings
let canvasWidth = 700;
let canvasHeight = 400;
let animationFrameRate = 60;
let cameraFrameRate = 90; // <1-200>
let speedFactor = 1; // don't change this below 1 (problems with drag forces)

// Colors
const FIELD_BOUNDARIES = "red";
const SLOPES = 40;
const BALL = "yellow";
const DUMMY_NOT_BLOCKING = 30;

// Global variables
let actualFrameRate = animationFrameRate;
let game;
let dummies = [];
let redAxes = [];
let blueAxes = [];
let ball;
let field;
let fieldWidthPxl = canvasWidth * 0.95;
let fieldHeightPxl = canvasHeight * 0.95;
let gameSpeedSlider;
let canvas;

function setup() {
    // determine field dimensions
    if (fieldWidthPxl * fieldWidthPxl * (703 / 1210) < (fieldHeightPxl * fieldHeightPxl * (1210 / 703))) {
        fieldHeightPxl = fieldWidthPxl * (703 / 1210);
    } else {
        fieldWidthPxl = fieldHeightPxl * (1210 / 703);
    }
    // Create canvas
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch-holder');
    canvas.mousePressed(canvasMousePressed);
    canvas.mouseReleased(canvasMouseReleased);
    frameRate(animationFrameRate);

    // Create other elements
    gameSpeedSlider = createSlider(0.1, 2, 1, .1);

    // Box 2D settings
    b2.speedFactor = speedFactor; // speed of animation (<0)
    b2.frameRate = 1000; // desired framerate
    b2.pixelScale = fieldWidthPxl / 1.21 // pixel to world scale: (pixel dist)/(world dist)
    b2.unitsScaleX = 10000; // units to world scale: (units dist)/(world dist)
    b2.unitsScaleY = -10000; // units to world scale: (units dist)/(world dist)
    b2.xOff = b2.p2w(canvasWidth / 2 - fieldWidthPxl / 2); // offset for user's units in x direction ([0] in units == [0 + offset] in world)
    b2.yOff = b2.p2w(canvasHeight / 2); // offset for user's units in y direction


    // // Create objects
    // field = new Field();
    // ball = new Ball(12100/2, -3300)
    // createAxes();  
    game = new Game();  
}

function draw() {
    if (gameSpeedSlider.value() > 1){
        b2.speedFactor = 1 + (gameSpeedSlider.value() - 1)*10;
    }else{
        b2.speedFactor = gameSpeedSlider.value();
    }
    
    background(50);
    b2.update(function(){
        game.update();
    }, animationFrameRate)
    
    game.draw();

    actualFrameRate = frameRate();
}

function canvasMousePressed(){
    game.ball.bindToTarget();
}

function canvasMouseReleased(){
    game.ball.unbind();
}

// function createAxes(){
//     // Red team
//     a = new Axis(800, "red", 1000, -1000);
//     a.dummies.push(new Dummy(a, 0));
//     redAxes.push(a);
    
//     a = new Axis(2300, "red", 1000, -1000);
//     a.dummies.push(new Dummy(a, 1190));
//     a.dummies.push(new Dummy(a, -1190));
//     redAxes.push(a);

//     a = new Axis(5300, "red", 1000, -1000);
//     a.dummies.push(new Dummy(a, 2380));
//     a.dummies.push(new Dummy(a, 1190));
//     a.dummies.push(new Dummy(a, 0));
//     a.dummies.push(new Dummy(a, -1190));
//     a.dummies.push(new Dummy(a, -2380));
//     redAxes.push(a);

//     a = new Axis(8300, "red", 1000, -1000);
//     a.dummies.push(new Dummy(a, 2080));
//     a.dummies.push(new Dummy(a, 0));
//     a.dummies.push(new Dummy(a, -2080));
//     redAxes.push(a);

//     // Blue team
//     a = new Axis(800, "blue", 1000, -1000);
//     a.dummies.push(new Dummy(a, 0));
//     blueAxes.push(a);
    
//     a = new Axis(2300, "blue", 1000, -1000);
//     a.dummies.push(new Dummy(a, 1190));
//     a.dummies.push(new Dummy(a, -1190));
//     blueAxes.push(a);

//     a = new Axis(5300, "blue", 1000, -1000);
//     a.dummies.push(new Dummy(a, 2380));
//     a.dummies.push(new Dummy(a, 1190));
//     a.dummies.push(new Dummy(a, 0));
//     a.dummies.push(new Dummy(a, -1190));
//     a.dummies.push(new Dummy(a, -2380));
//     blueAxes.push(a);

//     a = new Axis(8300, "blue", 1000, -1000);
//     a.dummies.push(new Dummy(a, 2080));
//     a.dummies.push(new Dummy(a, 0));
//     a.dummies.push(new Dummy(a, -2080));
//     blueAxes.push(a);
// }

