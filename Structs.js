const UNKNOWN = 0;
const KNOWN = 1;

class strategyBall {
    constructor(){
        this.radius = BALL_RADIUS;
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.vector = createVector(0,0);
        this.state = UNKNOWN;
        this.trajectory = [];
        this.timeSinceCaptured = b2.timeStep;
    }
}

class Line{
    constructor(pos1, pos2){
        this.x1 = pos1.x;
        this.y1 = pos1.y;
        this.x2 = pos2.x;
        this.y2 = pos2.y;
    }

    copy(){
        return new Line(createVector(this.x1, this.y1), createVector(this.x2, this.y2));
    }
}

class strategyAxis{
    constructor(axis){
        this.axis = axis;
        this.x = axis.relativeX;
        this.xDisplacement = 0;
        this.yDisplacement = axis.relativeY;
        this.desiredIntercept = 0;
        this.trajectoryIntercept = 0;
        this.desiredPosition = 0;
        this.desiredAngle = 0;
        this.power = 80;
        this.mode = 0;
    }      
}

class Filter{
    constructor(th, lg, hg){
        this.threshold = th;
        this.lowGain = lg;
        this.highGain = hg;

        this.raw = 0;
        this.diff = 0;
        this.addition = 0;
        this.prevFiltered = 0;
        this.filtered = 0;
    }

    filterData(data){
        if(data instanceof p5.Vector){
            if(data == data){
                this.raw = data;		
                this.diff = p5.Vector.sub(this.raw, this.prevFiltered);				
                if(abs(this.diff.x) < this.threshold && abs(this.diff.y) < this.threshold){
                    this.addition = createVector();
                    this.addition.x = (1/this.lowGain * abs(this.diff.x)/this.threshold) * this.diff.x;			
                    this.addition.y = (1/this.lowGain * abs(this.diff.y)/this.threshold) * this.diff.y;			
                }else{
                    this.addition = createVector();
                    this.addition.x = 1/this.highGain * this.diff.x;
                    this.addition.y = 1/this.highGain * this.diff.y;
                }
                if(!(this.prevFiltered instanceof p5.Vector)) this.prevFiltered = createVector();
                this.filtered = p5.Vector.add(this.prevFiltered, this.addition);
                this.prevFiltered = this.filtered.copy();
            }
        }else{
            if(data == data){
                if(this.prevFiltered != this.prevFiltered) this.prevFiltered = 0;
                this.raw = data;		
                this.diff = this.raw - this.prevFiltered;				
                if(abs(this.diff) < this.threshold){
                    this.addition = (1/this.lowGain * abs(this.diff)/this.threshold) * this.diff;			
                }else{
                    this.addition = 1/this.highGain * this.diff;
                }
            
                this.filtered = this.prevFiltered + this.addition;		
                this.prevFiltered = this.filtered;
            }
        }
		return this.filtered;
    }
}
