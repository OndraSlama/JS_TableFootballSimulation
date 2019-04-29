class Game {
    constructor(fps = 90){
        this.world = new b2.World(
            new b2.Vec2(0, 0) //gravity
            , true //allow sleep
        );
        this.world.SetContactListener(new MyListener);

        this.redPlayer = new Player(this, "red");
        this.bluePlayer = new Player(this, "blue");
        this.ball = new Ball(this);
        this.field = new Field(this);
        this.camera = new Camera(this, fps);
        this.redPlayer.setStrategy();
        this.bluePlayer.setStrategy();
    }
    
    update(){
        this.world.Step(
            b2.timeStep
            , 10 //velocity iterations
            , 10 //position iterations
        );
        this.world.ClearForces();

        this.ball.update();
        this.camera.update();
        this.updateStrategyData();
        this.redPlayer.update();
        this.bluePlayer.update();

        this.checkGoal();
    }

    checkGoal(){
        if(this.ball.pos.x < 0){
            this.bluePlayer.goals++;
            this.ball = new Ball(this);
        }else if(this.ball.pos.x > FIELD_WIDTH){
            this.redPlayer.goals++;
            this.ball = new Ball(this);
        }
    }


    updateStrategyData(){
        this.redPlayer.strategy.cameraInput(this.camera.ballPosition.x, this.camera.ballPosition.y)
        this.bluePlayer.strategy.cameraInput(FIELD_WIDTH - this.camera.ballPosition.x, -this.camera.ballPosition.y)
        

        for (let i = 0; i < this.redPlayer.strategy.playerAxes.length; i++) {
            this.redPlayer.strategy.playerAxes[i].yDisplacement = this.redPlayer.axes[i].relativeY;
            this.redPlayer.strategy.playerAxes[i].xDisplacement = sin(this.redPlayer.axes[i].relativeAngle/10) * DUMMY_HEIGHT;
            this.redPlayer.strategy.opponentAxes[i].yDisplacement = -this.bluePlayer.axes[i].relativeY;
            this.redPlayer.strategy.opponentAxes[i].xDisplacement = -sin(this.bluePlayer.axes[i].relativeAngle/10) * DUMMY_HEIGHT;
        }
        for (let i = 0; i < this.bluePlayer.strategy.playerAxes.length; i++) {
            this.bluePlayer.strategy.playerAxes[i].yDisplacement = this.bluePlayer.axes[i].relativeY;
            this.bluePlayer.strategy.playerAxes[i].xDisplacement = sin(this.bluePlayer.axes[i].relativeAngle/10) * DUMMY_HEIGHT;
            this.bluePlayer.strategy.opponentAxes[i].yDisplacement = -this.redPlayer.axes[i].relativeY;
            this.bluePlayer.strategy.opponentAxes[i].xDisplacement = -sin(this.redPlayer.axes[i].relativeAngle/10) * DUMMY_HEIGHT;
        }
    }

    draw(){
        this.field.draw();
        this.ball.draw();
        this.redPlayer.draw();
        this.bluePlayer.draw();
        this.camera.draw();

        // Goals
        let myTextSize = 30;
        textSize(32);
        textAlign(CENTER);
        // red player
        fill("red");
        stroke("red")
        let goalTextPos = b2.u2p(-10*myTextSize, 0);
        text(this.redPlayer.goals, goalTextPos.x, goalTextPos.y)
        // blue player
        fill("blue");
        stroke("blue")
        goalTextPos = b2.u2p(FIELD_WIDTH + 10*myTextSize, 0);
        text(this.bluePlayer.goals, goalTextPos.x, goalTextPos.y)

        // Debug
        textSize(32);
        text(this.redPlayer.strategy.ball.velocity.mag().toFixed(2), 100, 60);
    }
}