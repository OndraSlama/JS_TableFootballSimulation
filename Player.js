const forwardDefense = 0
const backwardDefense = 1
const forwardShoot = 2
const backwardShoot = 3
const raised = 4
const straight = 5
const exactAngle = 6

class Player{
    constructor(game, color){
        this.game = game;

        // objects
        this.color = color;
        this.axes = [];
        this.createAxes();
        
        // State
        this.goals = 0;
        this.roundsWon = 0;

        this.strategy;
    }

    setStrategy(){
        if(this.color == "red"){
            this.strategy = new StrategyB(this, this.game.bluePlayer);
        }else{
            this.strategy = new StrategyB(this, this.game.redPlayer);
        }
    }

    createAxes(){   
        let a = new Axis(this.game, 800, this.color, 770, -850);
        a.dummies.push(new Dummy(this.game, a, 0));
        this.axes.push(a);230
        
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
        this.strategy.process();
        for (let i = 0; i < this.strategy.playerAxes.length; i++) {
            this.axes[i].moveTo = this.strategy.playerAxes[i].desiredPosition;              

            switch (this.strategy.playerAxes[i].mode) {
                case forwardDefense:
                this.axes[i].rotateTo = -120;
                    break;

                case backwardDefense:
                    this.axes[i].rotateTo = 200;
                    break;

                case forwardShoot:
                    this.axes[i].shouldKick = 1;
                    this.axes[i].kickPower = this.strategy.playerAxes[i].power;
                    break;
                    
                case backwardShoot:
                    // this.axes[i].shouldKick = 1;
                    this.axes[i].kickPower = this.strategy.playerAxes[i].power;
                    break;
                
                case raised:
                    this.axes[i].rotateTo = -900;
                    break;

                case straight:
                    this.axes[i].rotateTo = 0;
                    break;
                    
                case exactAngle:
                    this.axes[i].rotateTo = this.strategy.playerAxes[i].desiredAngle;
                    break;
            
                default:
                    break;
            }
        }
    }

    draw(){
        for (let a of this.axes) {
            a.draw();
        }
        
        
        this.strategy.draw();
        
    }
}