class Camera {
    constructor(game, fps){
        this.game = game;

        this.frameRate = fps;
        this.stepsSinceLastCapture = 0;
        this.ballPosition = createVector(0, 0);

        this.xGrid = [];
        this.yGrid = [];
        this.createGrid(35);
    }

    update(){
        let stepsToCapture = round((1/this.frameRate)/b2.timeStep); 
        if (this.stepsSinceLastCapture >= stepsToCapture) {
            this.capture();
            this.stepsSinceLastCapture = 0;
        }
        this.stepsSinceLastCapture++;
    }

    createGrid(step){
        this.xGrid.push(0);
        let i = 0;
        while (this.xGrid[i] < this.game.field.width) {
            this.xGrid.push(this.xGrid[i] + step);
            i++;
        }
        
        this.yGrid.push(-7030/2);
        i = 0;
        while (this.yGrid[i] < this.game.field.height/2) {
            this.yGrid.push(this.yGrid[i] + step);
            i++;
        }
    }

    capture(){
        this.ballPosition = this.game.ball.pos.copy();
        // this.ballPosition.x += random(-10,10);
        // this.ballPosition.y += random(-10,10);

        let tempPos = 0;
        this.xGrid.forEach(element => {
            if (abs(this.ballPosition.x - element) < abs(this.ballPosition.x - tempPos)){
                tempPos = element
            }            
        });
        this.ballPosition.x = tempPos;

        tempPos = 0;
        this.yGrid.forEach(element => {
            if (abs(this.ballPosition.y - element) < abs(this.ballPosition.y - tempPos)){
                tempPos = element
            }            
        });
        this.ballPosition.y = tempPos;

    }

    draw(){
        let pos = b2.u2p(this.ballPosition)
        rectMode(CENTER);
        fill(0,0,250,100);
        noStroke();
        ellipse(pos.x, pos.y, b2.u2p(this.game.ball.diameter));
    }


}