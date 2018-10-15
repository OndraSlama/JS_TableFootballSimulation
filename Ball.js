class Ball {
    constructor(x, y) {
        this.diameter = 350;

        // State
        this.position;
        this.velocity;
        this.angle;
        this.angularVelocity;
        this.mass;
        this.timer = 0;
        
        // Body definition
        b2.bodyDef.type = b2.Body.b2_dynamicBody;
        b2.bodyDef.position = b2.unitsToWorld(createVector(x, y));
        b2.bodyDef.linearDamping = 0;
        // b2.bodyDef.linearVelocity.x = b2.unitsToWorld(100);
        // b2.bodyDef.linearVelocity.y = b2.unitsToWorld(-10000);
        
        // Fixture definition
        b2.fixDef.density = 1.0;
        b2.fixDef.friction = .05;
        b2.fixDef.restitution = 0.3;
        b2.fixDef.filter.maskBits = 65535;
        b2.fixDef.filter.categoryBits = 1;

        // Shape definition
        b2.fixDef.shape = new b2.CircleShape(b2.unitsToWorld(this.diameter/2));

        this.body = b2.world.CreateBody(b2.bodyDef);
        this.body.CreateFixture(b2.fixDef);
        this.body.SetUserData(this);

        // this.body.ApplyImpulse(new b2.Vec2(Math.random()*-.002, Math.random()*-.002), this.body.GetWorldCenter());
    }

    draw(){
        let pos = b2.worldToPxl(this.body.GetPosition())
        rectMode(CENTER);
        fill(BALL);
        noStroke();
        ellipse(pos.x, pos.y, b2.unitsToPxl(this.diameter));
        textSize(32);
        text(dummies[0].velocity.x, 30, 50);
        text(dummies[0].angle, 30, 100);
    }

    updateState(){
        this.pos = b2.worldToUnits(this.body.GetPosition());
        this.velocity = b2.worldToUnits(this.body.GetLinearVelocity(),"SCALE");
        this.angle = this.body.GetAngle();
        this.angularVelocity = this.body.GetAngularVelocity();
        this.mass = this.body.GetMass();
        this.body.SetAwake(1);
    }

    applyForces(){
        // Friction
        let force = this.velocity.copy();
        let velMag = p5.Vector.mag(this.velocity);
        let scale = 0.005/b2.timeStep;
        force.normalize();
        force.mult(velMag * -0.01 / scale);
        force.limit(.6 / scale);
        this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));

        // Random stuff
        force.set(map(noise(this.pos.x/1000, this.pos.y/1000), 0, 1, -3, 3), 
                            map(noise(this.pos.x/1000 + 10000, this.pos.y/1000 + 10000), 0, 1, -0.01, 0.01));
        force.limit(.6 / scale);
        if(velMag < 300) force.limit(0.1 / scale);
        this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));
        
        // Blow
        if (velMag < 60){
            this.timer += b2.timeStep;            
        } else{
            this.timer = 0;
        }
        if (this.timer > 2){
            this.timer = 0;
            force.set(-Math.sign(this.pos.x - field.width/2) * random(200,400) * scale, Math.sign(random(-1,1)) * random(200,400) * scale);
            this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));
        }
        
        // Edge slopes
        if(abs(this.pos.y) > (field.height/2 - field.slopesize)){
            force.set(0, -Math.sign(this.pos.y) * 10 / scale);
            this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));
        }
        
        // Corner slopes
        let dy = field.height/2 - field.goalWidth/2;
        let dx = field.cornerSlopeReach;
        let offset = field.goalWidth/2
        let xSide = Math.sign(this.pos.x - field.width/2);
        let ySide = Math.sign(this.pos.y);
        let xSlopeForce = 9 / scale;
        let ySlopeForce = 5 / scale;
        
        // Left 
        if(this.pos.y > (dy/dx)*this.pos.x + offset){
            force.set(-xSide*xSlopeForce, -ySide*ySlopeForce);
            this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));
        }        
        if(this.pos.y < -(dy/dx)*this.pos.x - offset){
            force.set(-xSide*xSlopeForce, -ySide*ySlopeForce);
            this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));
        }

        // Right
        if(this.pos.y > -(dy/dx)*(this.pos.x - field.width) + offset){
            force.set(-xSide*xSlopeForce, -ySide*ySlopeForce);
            this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));
        }
        if(this.pos.y < (dy/dx)*(this.pos.x - field.width) - offset){
            force.set(-xSide*xSlopeForce, -ySide*ySlopeForce);
            this.body.ApplyForce(b2.unitsToWorld(force,"SCALE"), b2.unitsToWorld(this.pos));
        }
        
        // Debug
        // if(b2.worldToUnits(b2.pxlToWorld(mouseY), "HEIGHT") < (dy/dx)*(b2.worldToUnits(b2.pxlToWorld(mouseX), "WIDTH") - field.width) - offset){
        //     ellipse(0,0,200);
        // }

    }
};
