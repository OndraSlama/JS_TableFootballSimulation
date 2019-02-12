class Camera {
    constructor(game, fps){
        this.game = game;

        // this.delay = 0.1; // in seconds
        this.frameRate = fps;
        this.stepsSinceLastCapture = 0;
        this.newData = false;

        this.ballPosition = createVector(0, 0);
        this.positionHistory = [];

        this.xGrid = [];
        this.yGrid = [];
        this.createGrid(35);
    }

    update(){
        let stepsToCapture = round((1/this.frameRate)/b2.timeStep); 
        if (this.stepsSinceLastCapture >= stepsToCapture) {
            this.capture();
            this.game.redPlayer.strategy.newData = true;
            this.game.bluePlayer.strategy.newData = true;
            this.stepsSinceLastCapture = 0;
            this.positionHistory.push(this.ballPosition);
            if(this.positionHistory.length > 10){
                this.positionHistory.splice(0,1);
            }
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
        
        this.yGrid.push(-FIELD_HEIGHT/2);
        i = 0;
        while (this.yGrid[i] < this.game.field.height/2) {
            this.yGrid.push(this.yGrid[i] + step);
            i++;
        }
    }

    capture(){
        this.ballPosition = this.game.ball.pos.copy();
        this.ballPosition.x += randomGaussian(0, 5);
        this.ballPosition.y += randomGaussian(0, 5);

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
        noFill();
        stroke(250, 0, 0, 150);
        ellipse(pos.x, pos.y, b2.u2p(this.game.ball.diameter));

        // noFill();
        // stroke(255, 0, 0, 150);
        // for(let i = 0; i < this.positionHistory.length; i++){     
        //     pos = b2.u2p( this.positionHistory[i]);
        //     let nextPos = b2.u2p(this.positionHistory[min(i + 1, this.positionHistory.length - 1)]);
        //     ellipse(pos.x, pos.y, 4);
        //     line(pos.x, pos.y, nextPos.x, nextPos.y);                        
        // }
    }


}