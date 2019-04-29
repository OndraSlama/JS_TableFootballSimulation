// My box2D object
let b2 = new B2;

// Fotbal constants
const FIELD_WIDTH = 12100; // width of the field
const FIELD_HEIGHT = 7030; // height of the field
const GOAL_WIDTH = 2150; // width of the goal
const SLOPE_SIZE = 400; // width of the slope around borders
const CORNER_SLOPE_REACH = 1200;
const BALL_RADIUS = 175;
const DUMMY_X = 100;
const DUMMY_Y = 200;
const DUMMY_HEIGHT = 500;

// My settings
let canvasWidth;
let canvasHeight;
let animationFrameRate = 60;
let cameraFrameRate = 90; // <1-200>
let speedFactor = 1; // don't change this below 1 (problems with drag forces)

// Colors
const FIELD_BOUNDARIES = 80;
const FIELD_BACKGROUND = 50;
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
let fieldWidthPxl;
let fieldHeightPxl;
let gameSpeedSlider;
let canvas;

function setup() {
    // determine canvas dimensions
    // canvasWidth = windowWidth*0.9;
    // canvasHeight = min(windowHeight*0.8, canvasWidth * 0.53);
    canvasWidth = 1210;
    canvasHeight = 703;

    // determine field dimensions
    fieldWidthPxl = canvasWidth * 0.95;
    fieldHeightPxl = canvasHeight * 0.95;
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
    b2.frameRate = 150; // desired framerate
    b2.pixelScale = fieldWidthPxl / 1.21 // pixel to world scale: (pixel dist)/(world dist)
    b2.unitsScaleX = 10000; // units to world scale: (units dist)/(world dist)
    b2.unitsScaleY = -10000; // units to world scale: (units dist)/(world dist)
    b2.xOff = b2.p2w(canvasWidth / 2 - fieldWidthPxl / 2); // offset for user's units in x direction ([0] in units == [0 + offset] in world)
    b2.yOff = b2.p2w(canvasHeight / 2); // offset for user's units in y direction


    // // Create objects
    // field = new Field();
    // ball = new Ball(FIELD_WIDTH/2, -3300)
    // createAxes();  
    game = new Game();  
}

function draw() {
    if(gameSpeedSlider.value() == 2){
        b2.speedFactor = 1 + (gameSpeedSlider.value() - 1)*1000;
    }else if (gameSpeedSlider.value() > 1){
        b2.speedFactor = 1 + (gameSpeedSlider.value() - 1)*10;
    }else if(gameSpeedSlider.value() == .1){
        b2.speedFactor = 0.01;
    }else{
        b2.speedFactor = gameSpeedSlider.value();
    }
    
    background(0);
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