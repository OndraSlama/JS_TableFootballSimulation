class Player{
    constructor(game, color){
        this.game = game;

        // objects
        this.color = color;
        this.axes = [];
        this.createAxes();
        
        // State
        this.goals = 0;

        this.strategy;
    }

    setStrategy(){
        if(this.color == "red"){
            this.strategy = new Strategy(this, this.game.bluePlayer);
        }else{
            this.strategy = new Strategy(this, this.game.redPlayer);
        }
    }

    createAxes(){   
        let a = new Axis(this.game, 800, this.color, 770, -850);
        a.dummies.push(new Dummy(this.game, a, 0));
        this.axes.push(a);
        
        a = new Axis(this.game, 2300, this.color, 1150, -1350);
        a.dummies.push(new Dummy(this.game, a, 1190));
        a.dummies.push(new Dummy(this.game, a, -1190));
        this.axes.push(a);

        a = new Axis(this.game, 5300, this.color, 520, -400);
        a.dummies.push(new Dummy(this.game, a, 2380));
        a.dummies.push(new Dummy(this.game, a, 1190));
        a.dummies.push(new Dummy(this.game, a, 0));
        a.dummies.push(new Dummy(this.game, a, -1190));
        a.dummies.push(new Dummy(this.game, a, -2380));
        this.axes.push(a);

        a = new Axis(this.game, 8300, this.color, 870, -780);
        a.dummies.push(new Dummy(this.game, a, 2080));
        a.dummies.push(new Dummy(this.game, a, 0));
        a.dummies.push(new Dummy(this.game, a, -2080));
        this.axes.push(a);
    }

    update(){
        for (let a of this.axes) {
            a.update();
        }
        if (this.color == "red") {
            this.strategy.cameraInput(this.game.camera.ballPosition.x, this.game.camera.ballPosition.y)
        } else {
            this.strategy.cameraInput(FIELD_WIDTH - this.game.camera.ballPosition.x, -this.game.camera.ballPosition.y)
        }

        for (let i = 0; i < this.strategy.playerAxes.length; i++) {
            this.strategy.playerAxes[i].y = this.axes[i].relativeY;
        }
        this.strategy.process();
        for (let i = 0; i < this.strategy.playerAxes.length; i++) {
            this.axes[i].moveTo = this.strategy.playerAxes[i].desiredPosition;
            this.axes[i].rotateTo = this.strategy.playerAxes[i].desiredAngle;
            if(this.strategy.playerAxes[i].shouldKick) this.axes[i].shouldKick = 1;
        }
    }

    draw(){
        for (let a of this.axes) {
            a.draw();
        }
        
        
        this.strategy.draw();
        
    }
}