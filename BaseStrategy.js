class BaseStrategy {
    constructor(player, opponent){
        //player
        this.player = player;

        // Axes
        this.playerAxes = [];
        this.opponentAxes = [];

        // Ball
        this.ball = new strategyBall;
        this.balls = [];
        this.balls.push(this.ball);
        this.noOfBounces = 1;
        this.minSpeedLimit = 0;
        this.angletolerance = 60;
        this.lowAngletolerance = 15;
        this.positionTolerance = 200;        
        this.capturesWithBadAngle = 0;

        // Camera
        this.newData = false;

        // Filter
        this.vectorXFilter = new Filter(0.25, 1, 1);
        this.vectorYFilter = new Filter(0.25, 1, 1);
        this.velocityXFilter = new Filter(3, 2, 2);
        this.velocityYFilter = new Filter(3, 2, 2);

        // Init
        for (let i = 0; i < 40; i++) {
            this.balls.push(new strategyBall);            
        }

        for(let i = 0; i < player.axes.length; i++){
            this.playerAxes.push(new strategyAxis(player.axes[i]));
        }

        for(let i = 0; i < opponent.axes.length; i++){
            this.opponentAxes.push(new strategyAxis(opponent.axes[i]));
        }
    }
    
    cameraInput(x,y){
        if (!this.newData || (x == this.ball.position.x && y == this.ball.position.y)) return;
        this.checkState(x,y);
        this.setBall(x,y);
        this.calculateTrajectory();
        this.newData = false;
    }

    stepTick(){
        for (let b of this.balls) {
            b.timeSinceCaptured += b2.timeStep;
        }
    }

    checkState(x,y){
        let currentStepVector = createVector(x - this.balls[0].position.x, y - this.balls[0].position.y);
        let currentVelocity = p5.Vector.div(currentStepVector, this.balls[0].timeSinceCaptured * 1000);
        let currentPosition = createVector(x,y);

        if (abs(currentVelocity.mag()) < this.minSpeedLimit){
            for(let b of this.balls){
                b.state = UNKNOWN;
            }
            return;
        }

        // let predictedPosition = this.ball.position.copy();
        // predictedPosition.add(p5.Vector.mult(this.ball.velocity, this.ball.timeSinceCaptured * 1000));
        // if(predictedPosition.dist(currentPosition) > this.positionTolerance){
        //     for(let b of this.balls){
        //         b.state = UNKNOWN;
        //     }
        //     return;
        // }

        // Low angle condition
        if(abs(currentStepVector.angleBetween(this.ball.vector)) > this.lowAngletolerance){
            this.capturesWithBadAngle++;
            if(this.capturesWithBadAngle > 2){
                let firstKnown = this.balls.length - 1;
                while(this.balls[firstKnown].state != KNOWN){
                    firstKnown--;
                    if(firstKnown == 1) break;
                }
                for (let i = 0; i < 3; i++) {                    
                    this.balls[firstKnown].state = UNKNOWN;
                    if (firstKnown > 1) firstKnown--;
                }                
            }
        } else{
            this.capturesWithBadAngle = 0;
        }

        // Angle condition
        if(abs(currentStepVector.angleBetween(this.ball.vector)) > this.angletolerance){
            this.capturesWithBadAngle = 0;                     
            
            for(let b of this.balls){
                b.state = UNKNOWN;
            }
        }

        if(abs(this.ball.vector.y) > 0.95){
            for(let b of this.balls){
                b.state = UNKNOWN;
            }
            return;
        }

        this.ball.state = KNOWN;
    }

    setBall(x,y){
        for (let i = this.balls.length - 1; i > 0; i--) {
            this.balls[i].position = this.balls[i-1].position.copy();
            this.balls[i].state = this.balls[i-1].state;
            this.balls[i].timeSinceCaptured = this.balls[i-1].timeSinceCaptured;
        }
        this.ball.position.x = x;
        this.ball.position.y = y;

        let firstKnown = this.balls.length - 1;
        while(this.balls[firstKnown].state != KNOWN){
            firstKnown--;
            if(firstKnown == 1) break;
        }

        let stepVector = createVector(x - this.balls[firstKnown].position.x, y - this.balls[firstKnown].position.y);
        this.ball.velocity = p5.Vector.div(stepVector, this.balls[firstKnown].timeSinceCaptured * 1000);
        this.ball.vector = this.ball.velocity.copy().normalize();

        // Filter velocity and normal vector
        // this.ball.velocity.x = this.vectorXFilter.filterData(this.ball.velocity.x);
        // this.ball.velocity.y = this.vectorYFilter.filterData(this.ball.velocity.y);
        // this.ball.vector.x = this.velocityXFilter.filterData(this.ball.vector.x);
        // this.ball.vector.y = this.velocityYFilter.filterData(this.ball.vector.y);
        
        this.ball.timeSinceCaptured = 0;
    }

    process(){      
    }

    calculateDesiredPosition(){
        for (let a of this.playerAxes) {
            let minDist;
            minDist = Infinity;
            a.desiredPosition = a.desiredIntercept;

            for (let dummy of a.axis.dummies) {
                if (abs(a.desiredIntercept - (a.yDisplacement + dummy.offset)) < minDist) {
                    if((a.desiredIntercept - dummy.offset) < a.axis.highLimit && (a.desiredIntercept - dummy.offset) > a.axis.lowLimit){
                        minDist = abs(a.desiredIntercept - (a.yDisplacement + dummy.offset));
                        a.desiredPosition = a.desiredIntercept - dummy.offset;
                    }
                }
            }
        }
    }

    calculateTrajectory(){
        for (let a of this.playerAxes) {
            a.trajectoryIntercept = -10000;
        }

        this.ball.trajectory.splice(0, this.ball.trajectory.length);
        let yBound = (FIELD_HEIGHT/2 - BALL_RADIUS);
        let tempVector = this.ball.vector.copy();
        let myLine = new Line(this.ball.position.copy(), this.ball.position.copy());
        for (let i = 0; i < this.noOfBounces + 1; i++) {;;
            let a = tempVector.y / tempVector.x;
            let b = myLine.y1 - a * myLine.x1;

            if (tempVector.x == 0){
                myLine.y2 = Math.sign(tempVector.y) * yBound;                
                tempVector.y *= -1;   
            }else{
                myLine.x2 = (Math.sign(tempVector.y) * yBound - b) / a;
                myLine.y2 = Math.sign(tempVector.y) * yBound;
                tempVector.y *= -1;                
            }
            if (myLine.x2 < BALL_RADIUS) {
                myLine.x2 = BALL_RADIUS;
                myLine.y2 = a*myLine.x2 + b;
                tempVector.x *= -1;
                tempVector.y *= -1;
            }else if(myLine.x2 > FIELD_WIDTH - BALL_RADIUS){
                myLine.x2 = FIELD_WIDTH - BALL_RADIUS;
                myLine.y2 = a*myLine.x2 + b;
                tempVector.x *= -1;
                tempVector.y *= -1;
            }

            for (let ax of this.playerAxes){             
                let positionBetweenPoints = (myLine.x2 + myLine.x1)/2;
                let distBetweenPoints = abs(myLine.x2 - myLine.x1);
                if(abs(positionBetweenPoints - ax.x) < distBetweenPoints/2 && ax.trajectoryIntercept == -10000){
                    ax.trajectoryIntercept = a * (ax.x + BALL_RADIUS)+ b;
                    if(abs(ax.trajectoryIntercept) > FIELD_HEIGHT/2) ax.trajectoryIntercept = Math.sign(ax.trajectoryIntercept) * FIELD_HEIGHT/2;
                }
            }

            this.ball.trajectory.push(myLine.copy());
            if (abs(myLine.y2) < GOAL_WIDTH/2) break;  
            myLine.x1 = myLine.x2;
            myLine.y1 = myLine.y2; 
        }
    }

    draw(){
        if(this.player.color == "red"){
            // Speed vector
            let pos = b2.u2p(this.ball.position);
            // stroke(0, 255, 0, 100);      
            // strokeWeight(4);
            // line(pos.x, pos.y, pos.x + this.ball.velocity.x, pos.y);
            // line(pos.x, pos.y, pos.x, pos.y - this.ball.velocity.y);   

            // Trajectory        
            strokeWeight(1);
            for (let myLine of this.ball.trajectory) {
                pos = b2.u2p(myLine.x1, myLine.y1);
                let pos2 = b2.u2p(myLine.x2, myLine.y2);
                stroke(255, 0, 0, 100);
                line(pos.x, pos.y, pos2.x, pos2.y);
            }
        
            // Ball history   
            noFill();        
            for(let i = 0; i < this.balls.length; i++){     
                pos = b2.u2p(this.balls[i].position);
                let nextPos = b2.u2p(this.balls[min(i + 1, this.balls.length - 1)].position);
                if (this.balls[i].state == UNKNOWN) {
                    stroke(255, 0, 0, 150);
                }else{
                    stroke(0, 255, 0, 150);
                }
                ellipse(pos.x, pos.y, 4);
                line(pos.x, pos.y, nextPos.x, nextPos.y);                        
            }
        }

        // Desired pos
        let desired = createVector();
        for (let axis of this.playerAxes) {                
            
            if (this.player.color == "blue"){
                desired = b2.u2p(FIELD_WIDTH - axis.x, -axis.desiredIntercept);
            }else{
                desired = b2.u2p(axis.x, axis.desiredIntercept);
            }        
            stroke("black");
            fill("black");
            ellipse(desired.x, desired.y, 4)
        }
    }
}


// class strategyAxis {
//     constructor(){
//         this.position;
//         this.velocity;
//         this.trajectory;
//     }
// }
