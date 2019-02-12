class Strategy {
    constructor(player, opponent){
        //player
        this.player = player;
        // Axes
        this.playerAxes = [];
        this.opponentAxes = [];
        // Ball
        this.ball = new strategyBall;
        this.ballHistory = [];
        this.ballHistory.push(this.ball);
        this.noOfBounces = 2;
        this.minSpeedLimit = 0;
        this.kickSpeedLimit = 6;

        this.cameraTolerance = 100;
        // Camera
        this.newData = false;

        // Init
        for (let i = 0; i < 20; i++) {
            this.ballHistory.push(new strategyBall);            
        }

        for(let i = 0; i < player.axes.length; i++){
            this.playerAxes.push(new strategyAxis(player.axes[i]));
        }

        for(let i = 0; i < opponent.axes.length; i++){
            this.opponentAxes.push(new strategyAxis(opponent.axes[i]));
        }
    }
    
    cameraInput(x,y){
        if (!this.newData || (x == this.ball.position.x && y == this.ball.position.y)){            
            for (let b of this.ballHistory) {
                b.timeSinceCaptured += b2.timeStep;
            }
            return;
        }
        this.checkState(x,y);
        this.setBall(x,y);
        this.calculateTrajectory();
        this.newData = false;
        this.ball.timeSinceCaptured = 0;
    }

    checkState(x,y){
        let currentStepVector = createVector(x - this.ballHistory[0].position.x, y - this.ballHistory[0].position.y);
        let currentVelocity = p5.Vector.div(currentStepVector, this.ballHistory[0].timeSinceCaptured * 1000);
        let currentPosition = createVector(x,y);

        if (abs(currentVelocity.mag()) < this.minSpeedLimit){
            for(let b of this.ballHistory){
                b.state = UNKNOWN;
            }
            return;
        }

        let predictedPosition = this.ball.position.copy();
        predictedPosition.add(p5.Vector.mult(this.ball.velocity, this.ball.timeSinceCaptured * 1000));
        if(predictedPosition.dist(currentPosition) > this.cameraTolerance){
            for(let b of this.ballHistory){
                b.state = UNKNOWN;
            }
            return;
        }

        this.ball.state = KNOWN;
    }

    setBall(x,y){
        for (let i = this.ballHistory.length - 1; i > 0; i--) {
            this.ballHistory[i].position = this.ballHistory[i-1].position.copy();
            this.ballHistory[i].state = this.ballHistory[i-1].state;
            this.ballHistory[i].timeSinceCaptured = this.ballHistory[i-1].timeSinceCaptured;

        }
        this.ball.position.x = x;
        this.ball.position.y = y;

        let firstKnown = this.ballHistory.length - 1;
        while(this.ballHistory[firstKnown].state != KNOWN){
            firstKnown--;
            if(firstKnown == 1) break;
        }

        let stepVector = createVector(x - this.ballHistory[firstKnown].position.x, y - this.ballHistory[firstKnown].position.y);
        this.ball.velocity = p5.Vector.div(stepVector, this.ballHistory[firstKnown].timeSinceCaptured * 1000);
        this.ball.vector = this.ball.velocity.copy().normalize();
        // this.ball.vector.normalize

    }


    process(){
        for (let axis of this.playerAxes){
            if(this.ball.state == UNKNOWN){
                axis.desiredIntercept = this.ball.position.y;
            }else{
                if(abs(axis.trajectoryIntercept) < FIELD_HEIGHT/2){
                    axis.desiredIntercept = axis.trajectoryIntercept;
                }else{
                    axis.desiredIntercept = this.ball.position.y;
                }
            }

            if(this.ball.position.x < axis.x){
                axis.desiredAngle = -900;
            }else{
                axis.desiredAngle = 0;
            }
            this.slowDown(axis);
            this.kick(axis); 
        }
        
        this.calculateDesiredPosition();   
    }

    slowDown(axis){
        if (this.ball.position.x < axis.x) return;
        if (this.ball.position.x > axis.x + 1500) return;  
        if (abs(this.ball.vector.y) > 0.5) return;
        if (this.ball.velocity.mag() > this.kickSpeedLimit*1.5){
            axis.desiredAngle = -350;
        }  
    }

    kick(axis){ 
        axis.shouldKick = 0;    
        if (this.ball.velocity.mag() > this.kickSpeedLimit) return;
        if (this.ball.position.x < axis.x) return;
        if (this.ball.position.x > axis.x + 500) return;      
        for (let dummy of axis.axis.dummies) { 
            if(abs((axis.y + dummy.offset) - this.ball.position.y) < BALL_RADIUS){
                axis.shouldKick = 1;
                return;
            };
        }
        
    
    } 

    calculateDesiredPosition(){
        for (let a of this.playerAxes) {
            let minDist;
            minDist = Infinity;
            a.desiredPosition = a.desiredIntercept;

            for (let dummy of a.axis.dummies) {
                if (abs(a.desiredIntercept - (a.y + dummy.offset)) < minDist) {
                    if((a.desiredIntercept - dummy.offset) < a.axis.highLimit && (a.desiredIntercept - dummy.offset) > a.axis.lowLimit){
                        minDist = abs(a.desiredIntercept - (a.y + dummy.offset));
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

        this.ball.trajectory.clear();
        let normalizedVector = this.ball.velocity.copy();
        normalizedVector.normalize();
        let point = this.ball.position.copy();
        this.ball.trajectory.points.push(point.copy());
        let yBound = (FIELD_HEIGHT/2 - BALL_RADIUS);

        for (let i = 0; i < this.noOfBounces; i++) {
            let a = normalizedVector.y / normalizedVector.x;
            let b = point.y - a * point.x;

            if (normalizedVector.x == 0){
                point.y = Math.sign(normalizedVector.y) * yBound;                
                normalizedVector.y *= -1;   
            }else{
                point.x = (Math.sign(normalizedVector.y) * yBound - b) / a;
                point.y = Math.sign(normalizedVector.y) * yBound;
                normalizedVector.y *= -1;                
            }
            if (point.x < BALL_RADIUS) {
                point.x = BALL_RADIUS;
                point.y = a*point.x + b;
                normalizedVector.x *= -1;
                normalizedVector.y *= -1;
            }else if(point.x > FIELD_WIDTH - BALL_RADIUS){
                point.x = FIELD_WIDTH - BALL_RADIUS;
                point.y = a*point.x + b;
                normalizedVector.x *= -1;
                normalizedVector.y *= -1;
            }

            for (let ax of this.playerAxes){
                let previousX = this.ball.trajectory.points[i].x;                
                let positionBetweenPoints = (point.x + previousX)/2;
                let distBetweenPoints = abs(point.x - previousX);
                if(abs(positionBetweenPoints - ax.x) < distBetweenPoints/2 && ax.trajectoryIntercept == -10000){
                    ax.trajectoryIntercept = a * (ax.x + BALL_RADIUS)+ b;
                    if(abs(ax.trajectoryIntercept) > FIELD_HEIGHT/2) ax.trajectoryIntercept = Math.sign(ax.trajectoryIntercept) * FIELD_HEIGHT/2;
                }
            }

            this.ball.trajectory.points.push(point.copy());
            if (abs(point.y) < GOAL_WIDTH/2) break;       
        }    
    }

    draw(){
        if(this.player.color == "red"){
            // Speed vector
            let pos = b2.u2p(this.ball.trajectory.points[0]);
            stroke(0, 255, 0, 100);      
            strokeWeight(4);
            line(pos.x, pos.y, pos.x + this.ball.velocity.x, pos.y);
            line(pos.x, pos.y, pos.x, pos.y - this.ball.velocity.y);   

            // Trajectory        
            strokeWeight(1);
            for (let i = 0; i < this.ball.trajectory.points.length - 1; i++) {
                pos = b2.u2p(this.ball.trajectory.points[i]);
                let pos2 = b2.u2p(this.ball.trajectory.points[i + 1]);
                stroke(255, 0, 0, 100);
                line(pos.x, pos.y, pos2.x, pos2.y);            
            }     
            // Ball history   
            noFill();        
            for(let i = 0; i < this.ballHistory.length; i++){     
                pos = b2.u2p(this.ballHistory[i].position);
                let nextPos = b2.u2p(this.ballHistory[min(i + 1, this.ballHistory.length - 1)].position);
                if (this.ballHistory[i].state == UNKNOWN) {
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

const UNKNOWN = 0;
const KNOWN = 1;

class strategyBall {
    constructor(){
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.vector = createVector(0,0);
        this.state = UNKNOWN;
        this.trajectory = new Trajectory;
        this.timeSinceCaptured = b2.timeStep;
    }
}

class strategyAxis{
    constructor(axis){
        this.axis = axis;
        this.x = axis.relativeX;
        this.y = axis.relativeY;
        this.angle = axis.relativeAngle;
        this.desiredIntercept;
        this.trajectoryIntercept;
        this.desiredPosition;
        this.desiredAngle;
        this.shouldKick;
    }      
}

class Trajectory {
    constructor(){
        this.points = [];
    }
    clear(){
        this.points.splice(0, this.points.length);
    }
}

// class strategyAxis {
//     constructor(){
//         this.position;
//         this.velocity;
//         this.trajectory;
//     }
// }
