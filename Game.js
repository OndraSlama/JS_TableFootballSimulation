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
        this.redPlayer.update();
        this.bluePlayer.update();
    }

    draw(){
        this.field.draw();
        this.ball.draw();
        this.redPlayer.draw();
        this.bluePlayer.draw();
        this.camera.draw();
    }
}