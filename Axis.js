const WAIT = 0;
const BACKSWING = 10;
const KICK = 20;


class Axis {
    constructor(game, xPosition, color, highLimit, lowLimit) {
        this.game = game;

        // Parameters        
        this.relativeX = xPosition;
        this.color = color;
        if (color == "blue"){
            this.absoluteX = 12100 - xPosition;
        }else{
            this.absoluteX = xPosition;
        }        
        // Limits
        this.highLimit = highLimit;
        this.lowLimit = lowLimit;
        this.maxAngularAcc = 3800000;
        this.maxLinearAcc = 250000;
        this.maxAngularVelocity = 40000;
        this.maxLinearVelocity = 20000;

        // State properties
        this.rotaryState = WAIT;
        this.linearState = WAIT;

        this.angularAcc = 0;
        this.linearAcc = 0;

        this.desiredRelativeY = 0; 
        this.relativeY = 0;
        this.absoluteY = 0;
        this.linearVelocity = 0;

        this.desiredAngle = 0;
        this.relativeAngle = 0;
        this.absoluteAngle = 0;
        this.angularVelocity = 0;        

        this.canInteract = true;
        
        // Controls
        this.shouldKick = false;
        this.moveTo = 0;
        this.rotateTo = 0;

        // Dummies
        this.dummies = [];

        // Debug
        this.maxPos = 0;
    }

    update() {
        // Calculate movement parameters 
        this.behaviours();        
        angleMode(DEGREES);

        // Rotary movement-------------------------------------------------------------------
        if(abs(this.angularAcc) > this.maxAngularAcc) this.angularAcc = Math.sign(this.angularAcc) * this.maxAngularAcc; 
        this.angularVelocity += this.angularAcc * b2.timeStep; // <----- euler integration
        if (abs(this.angularVelocity + this.angularAcc * b2.timeStep) > this.maxAngularVelocity) { // Apply limits
            this.angularAcc = 0;
        }
        this.relativeAngle += this.angularVelocity * b2.timeStep;
        this.absoluteAngle = this.relativeAngle - floor(this.relativeAngle/3600) * 3600;
        if(this.color == "blue"){
            this.absoluteAngle = 3600 - this.absoluteAngle // DODELAT!!
        }
        
        // Turn off collision-------------------------------------------------------------------------
        if (this.absoluteAngle > 400 && this.absoluteAngle < 3200) {
            this.canInteract = false;
        } else {
            this.canInteract = true;
        }

        // Linear movement----------------------------------------------------------------------
        if(abs(this.linearAcc) > this.maxLinearAcc) this.linearAcc = Math.sign(this.linearAcc) * this.maxLinearAcc; 
        this.linearVelocity += this.linearAcc * b2.timeStep; // <----- euler integration
        if (abs(this.linearVelocity + this.linearAcc * b2.timeStep) > this.maxlinearVelocity) { // Apply limits
            this.linearAcc = 0;
        }        
        this.relativeY += this.linearVelocity * b2.timeStep;
        if (this.relativeY + this.linearVelocity * b2.timeStep > this.highLimit && this.linearVelocity > 0){
            this.linearVelocity = 0;
            this.linearAcc = 0;
        }
        if (this.relativeY + this.linearVelocity * b2.timeStep < this.lowLimit && this.linearVelocity < 0){
            this.linearVelocity = 0;
            this.linearAcc = 0;
        } 
        if(this.color == "blue"){
            this.absoluteY = this.relativeY * -1 
        }else{
            this.absoluteY = this.relativeY
        }
        
        // Update dummies -----------------------------------------------------------------------------
        for (let d of this.dummies) {
            d.update();
        }
    }

    behaviours(){
        if(!this.shouldKick) this.desiredAngle = this.rotateTo;
        this.desiredRelativeY = this.moveTo;
        if(this.shouldKick) this.kick();
        this.moveToDesiredPosition();
        this.rorateToDesiredAngle();
    }

    draw() {
        let point1 = b2.u2p(this.absoluteX, this.game.field.height / 2);
        let point2 = b2.u2p(this.absoluteX, -this.game.field.height / 2);

        strokeWeight(1);
        stroke(this.color);
        line(point1.x, point1.y, point2.x, point2.y);
        for (let d of this.dummies) {
            d.draw();
        }

        // Debug
        if (abs(this.relativeY) > abs(this.maxPos)) this.maxPos = this.relativeY;
        textSize(32);
        // text(redAxes[0].maxPos, 30, 50);
    }


    moveToDesiredPosition(){
        // Saturate
        if(this.desiredRelativeY > this.highLimit) this.desiredRelativeY = this.highLimit;
        if(this.desiredRelativeY < this.lowLimit) this.desiredRelativeY = this.lowLimit;
        
        // Determine velocity
        let yDist = this.desiredRelativeY - this.relativeY;
        let yVel = 20*yDist;

        // Determine Acceleration
        if(this.color == "blue"){
            this.linearAcc = (yVel - this.linearVelocity) / b2.timeStep;        
        }else{
            this.linearAcc = (yVel - this.linearVelocity) / b2.timeStep;        
        }
    }

    rorateToDesiredAngle(){
        // Determine velocity
        let angleDist = this.desiredAngle - this.relativeAngle;
        let angleVel = 20*angleDist;

        // Determine Acceleration
        this.angularAcc = (angleVel - this.angularVelocity) / b2.timeStep;          
        
    }

    kick(){
        switch (this.rotaryState) {
            case WAIT:
                this.rotaryState = BACKSWING;
                break;
            case BACKSWING:
                this.desiredAngle = -1400;
                if(this.relativeAngle < -1200){
                    this.rotaryState = KICK;
                }
                break;

            case KICK:
                this.desiredAngle = 1300;
                if(this.relativeAngle > 1100){
                    this.rotaryState = KICK;
                    this.desiredAngle = 0;

                    this.shouldKick = 0;
                    this.rotaryState = WAIT;
                }
                break;
        
            default:
                break;
        }
    }
}