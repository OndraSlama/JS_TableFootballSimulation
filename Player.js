class Player{
    constructor(game, color){
        this.game = game;

        // objects
        this.color = color;
        this.axes = [];
        this.createAxes();
        
        // State
        this.goals = 0;
        
        // Strategy
        this.strategy;
    }

    createAxes(){   
        let a = new Axis(this.game, 800, this.color, 1000, -1000);
        a.dummies.push(new Dummy(this.game, a, 0));
        this.axes.push(a);
        
        a = new Axis(this.game, 2300, this.color, 1000, -1000);
        a.dummies.push(new Dummy(this.game, a, 1190));
        a.dummies.push(new Dummy(this.game, a, -1190));
        this.axes.push(a);

        a = new Axis(this.game, 5300, this.color, 1000, -1000);
        a.dummies.push(new Dummy(this.game, a, 2380));
        a.dummies.push(new Dummy(this.game, a, 1190));
        a.dummies.push(new Dummy(this.game, a, 0));
        a.dummies.push(new Dummy(this.game, a, -1190));
        a.dummies.push(new Dummy(this.game, a, -2380));
        this.axes.push(a);

        a = new Axis(this.game, 8300, this.color, 1000, -1000);
        a.dummies.push(new Dummy(this.game, a, 2080));
        a.dummies.push(new Dummy(this.game, a, 0));
        a.dummies.push(new Dummy(this.game, a, -2080));
        this.axes.push(a);
    }

    update(){
        for (let a of this.axes) {
            a.update();
        }
    }

    draw(){
        for (let a of this.axes) {
            a.draw();
        }
    }
}