class StrategyB extends BaseStrategy{
    constructor(player, opponent){
        super(player, opponent);        
        this.kickSpeedLimit = 6;
    }

    process(){
        this.stepTick();
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
                axis.mode = raised;
            }else{
                axis.mode = straight;
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
            axis.mode = exactAngle;
            axis.desiredAngle = -350;
        }  
    }

    kick(axis){ 
        axis.shouldKick = 0;    
        if (this.ball.velocity.mag() > this.kickSpeedLimit) return;
        if (this.ball.position.x < axis.x) return;
        if (this.ball.position.x > axis.x + 500) return;      
        for (let dummy of axis.axis.dummies) { 
            if(abs((axis.yDisplacement + dummy.offset) - this.ball.position.y) < BALL_RADIUS){
                axis.mode = forwardShoot;
                return;
            };
        }    
    } 
}