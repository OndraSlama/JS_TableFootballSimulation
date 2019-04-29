class StrategyA extends BaseStrategy{
    constructor(player, opponent){
        super(player, opponent);   

        this.kickAreaLength = 350;
        this.kickAreaWidth = 250;
        this.kickAreaStart = 350;
        this.kickYSpeedLimit = 2;
        this.kickXSpeedLimit = 7;
        this.advanceFactor = 120;
    }

    process(){
        this.stepTick();

        if (this.ball.state == KNOWN) {
            if (this.ball.vector.x > 0) {	// ball is heading to opponent goal
                this.mode = 1;
            }
            else{						// ball is heading to own goal
                this.mode = 0;
            }
        }

        this.Defend(); // Performs defending action
        this.Attack(); // Performs 1
        this.Block(); // Block if infront of opponent with ball
        this.GoalKeeper(); // Special behaviour for goal keeper
        this.Forward(); // Special behaviour for forwarder

        this.calculateDesiredPosition(); // Calculate where the axis should move based on desired positions of dummies	
    }   

    Defend() {

        if (this.mode == 0 && this.ball.state == KNOWN) {
            this.PyramidDefence();
        }
        else {
            for ( let i = 0; i < 4; i++)	{
                this.NormalDefence(i);
            }
        }
    }

    Attack() {

        for ( let i = 1; i < 4; i++) { // every axis except goalkeeper
            if (this.ball.vector.x > 0 && this.ball.position.x < this.playerAxes[i].x){
                this.RaisedAttack(i);
            }else if (this.ball.state == UNKNOWN && this.ball.position.x - this.ball.radius < this.playerAxes[i].x) {			
                this.RaisedAttack(i);
            }

            this.Kick(i);
        }
    }

    Block(){

        if (this.ball.state == UNKNOWN) {
            for (let i = 1; i < 4; i++)	{		
                this.BlockOpponent(i);
            }
        }
    }

    GoalKeeper() {
        if (this.ball.position.x < this.playerAxes[0].x + 100) {
            this.GetBehindBall(0);
        }
        this.Kick(0);	
    }

    Forward() {
        let axis = 2;
        
        if (this.ball.state == KNOWN)
            return;
        
        if(abs(this.ball.position.y) < 1575)
            return;

        this.playerAxes[axis].desiredIntercept = this.ball.position.y + Math.sign(this.ball.position.y) * 50;	
    }

    BallInArea(i, scale){
        // check if in area of kick
        if (this.ball.position.x > this.playerAxes[i].x + scale*this.kickAreaLength)	
            return false;

        if (this.ball.position.x < this.playerAxes[i].x - this.kickAreaStart) 
            return false;
            
        // check for individual dummy
        for ( let j = 0; j < this.playerAxes[i].axis.dummies.length; j++) {

            if (abs(this.playerAxes[i].axis.dummies[j].position.y - this.ball.position.y) < scale * this.kickAreaWidth) {
                return true;
            }
        }
        
        return false;
    }

    PyramidDefence() {

        let pyrLayer = 0;

        for ( let i = 3; i > 0; i--)	// from forwards to goalkeeper
        {
            let y = this.playerAxes[i]. trajectoryIntercept;
            let sign = Math.sign(y);

            this.playerAxes[i].desiredIntercept = this.ball.position.y;

            if (this.ball.position.x > this.playerAxes[i].x && y != -10000) // If ball is in front of axis and the direction is overlapping with the axis
            {
                switch (pyrLayer)
                {
                case 0:
                    this.playerAxes[i].desiredIntercept = y;
                    break;
                case 1:
                    this.playerAxes[i].desiredIntercept = y - sign * DUMMY_Y;
                    break;
                case 2:
                    this.playerAxes[i].desiredIntercept = y + sign * DUMMY_Y;
                    break;
                case 3:
                    this.playerAxes[i].desiredIntercept = y - 2 * sign *DUMMY_Y;
                    break;
                default:
                    break;
                }
                pyrLayer++;
                this.playerAxes[i].mode = backwardDefense;
            }
        }
        this.playerAxes[0].desiredIntercept = this.playerAxes[0]. trajectoryIntercept;
    }

    NormalDefence(i) {

        this.playerAxes[i].desiredIntercept = this.ball.position.y + this.ball.velocity.y * this.advanceFactor;

        if (this.ball.position.x > this.playerAxes[i].x + (this.playerAxes[i].xDisplacement < -this.kickAreaStart ? -this.kickAreaStart : this.playerAxes[i].xDisplacement)) {
            this.playerAxes[i].mode = forwardDefense;
        } else {
            this.playerAxes[i].mode = backwardDefense;
        }

        if (this.ball.state == UNKNOWN) {
            this.playerAxes[i].mode = straight;
        }
    }

    RaisedAttack(i) {	
        if(!this.BallInArea(i, 1)){
            this.playerAxes[i].mode = raised;
        }
        
        let y;
        let sign = Math.sign(this.ball.position.y);

        if (this.ball.state == KNOWN && this.mode == 1) {
            y = this.playerAxes[i].trajectoryIntercept;
        } else {
            y = this.ball.position.y;
        }

        // to avoid blocking view of the ball
        this.playerAxes[i].desiredIntercept = y + 2 * sign * this.ball.radius;

        if (this.ball.position.x > this.playerAxes[i].x + (this.playerAxes[i].xDisplacement < -this.kickAreaStart ? -this.kickAreaStart : this.playerAxes[i].xDisplacement)) {
            this.playerAxes[i].desiredIntercept = this.ball.position.y + this.ball.velocity.y * this.advanceFactor;
        }
    }

    Kick(i){
        
        // check speed limits
        if (abs(this.ball.velocity.y) > this.kickYSpeedLimit || abs(this.ball.velocity.x) > this.kickXSpeedLimit)
            return;		
        
        if(this.ball.position.x < this.playerAxes[i].x + this.playerAxes[i].xDisplacement)
            return;
            
        if(!this.BallInArea(i, 1))
            return;
        
        this.playerAxes[i].mode = forwardShoot;
    }

    BlockOpponent(i) {
        
        if (abs(this.ball.position.x - this.opponentAxes[i].x) > this.kickAreaLength) {
            return;
        }

        // check for individual dummy
        let gap = abs(this.opponentAxes[i].axis.dummies[0].position.y - this.opponentAxes[i].axis.dummies[1].position.y);

        for ( let j = 0; j < this.opponentAxes[i].axis.dummies.length; j++) {
            if (abs(this.opponentAxes[i].axis.dummies[j].position.y - this.ball.position.y) <= gap/2) {
                this.playerAxes[4 - i].desiredIntercept = this.opponentAxes[i].axis.dummies[j].position.y;
                this.playerAxes[4 - i].mode = backwardDefense;
                break;
            }
        }
    }

    GetBehindBall(i) {

        if (this.ball.position.x < this.playerAxes[i].x + this.playerAxes[i].xDisplacement) {

            this.playerAxes[i].desiredIntercept = this.ball.position.y - 3 * Math.sign(this.ball.position.y) * this.ball.radius;
            this.playerAxes[i].mode = straight;
            
            if (abs(this.playerAxes[i].axis.dummies[0].position.y - this.ball.position.y) > 2 * this.ball.radius){
                this.playerAxes[i].mode = exactAngle;
                this.playerAxes[i].desiredAngle < -270 ? this.playerAxes[i].desiredAngle = -270 : this.playerAxes[i].desiredAngle -= 40;
            }
        }

        if (this.ball.position.x > this.playerAxes[i].x + this.playerAxes[i].xDisplacement) {
            this.playerAxes[i].desiredIntercept = this.ball.position.y;
        }

        if (this.ball.position.x > this.playerAxes[i].x) {
            this.playerAxes[i].mode = straight;
        }
    }
}
