class Strategy {
    constructor(player, opponent){
        this.player = player;
        this.opponentAxes = opponent;
        this.ball = new strategyBall;
        this.newData = false;

        // this.desiredY = 0;
        // this.desiredAngle = 0;
    }
    
    cameraInput(x,y){
        if (!this.newData) return;

        this.ball.position.x = x;
        this.ball.position.y = y;

        this.newData = false;
    }

    process(){
        this.player.axes.forEach(axis => {
            axis.desiredIntercept = this.ball.position.y;
        });
    }
}

class strategyBall {
    constructor(){
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.trajectory;
    }
}

// class strategyAxis {
//     constructor(){
//         this.position;
//         this.velocity;
//         this.trajectory;
//     }
// }
