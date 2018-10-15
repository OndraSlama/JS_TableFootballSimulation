class Dummy {
    constructor(x, y) {
        this.width = 120;
        this.height = 210;
        this.playerHeight = 500;
        this.color = "red";
        this.axisPosition = field.width/2;

        // Limits
        this.maxAngularVelocity = 40000;
        this.angle = PI/2;

        // State properties
        this.position = createVector();
        this.velocity = createVector();
        this.angle = 0;
        this.angularVelocity = 1000;   
        this.canInteract = true;     

        // Fixture definition
        b2.fixDef.density = 1.0;
        b2.fixDef.friction = .1;
        b2.fixDef.restitution = 0.3;

        // Body definition
        b2.bodyDef.type = b2.Body.b2_kinematicBody;
        b2.bodyDef.position.x = b2.unitsToWorld(x, "WIDTH");
        b2.bodyDef.position.y = b2.unitsToWorld(y, "HEIGHT");
        b2.bodyDef.linearVelocity.x = 0;
        b2.bodyDef.linearVelocity.y = 0;

        // Shape definition
        b2.fixDef.shape = new b2.PolygonShape;
        b2.fixDef.shape.SetAsBox(b2.unitsToWorld(this.width/2), b2.unitsToWorld(this.height/2));

        this.body = b2.world.CreateBody(b2.bodyDef);
        this.body.CreateFixture(b2.fixDef);
        this.body.SetUserData(this);

        // this.body.SetLinearVelocity(0,0);
    }

    update(){
        angleMode(DEGREES);
        // Angle things
        this.angle += this.angularVelocity * b2.timeStep;
        // Rotate
        if(this.angle < 0) this.angle += 3600;
        if(this.angle > 3600) this.angle -= 3600;
        // Turn off collision
        if(this.angle > 400 && this.angle < 3200){
            this.canInteract = false;
        }else{
            this.canInteract = true;
        }

        let xPos = this.playerHeight * sin((this.angle + this.angularVelocity * b2.timeStep)/10) + this.axisPosition;
        
        this.velocity.x = b2.positionToVelocity(b2.unitsToWorld(xPos, 0), this.body).x;
        this.velocity.y = 0;

        this.body.SetAwake(1);
        this.body.m_linearVelocity = this.velocity;

        this.position = b2.worldToUnits(this.body.GetPosition());
        
    }

    draw(){
        let pos = b2.worldToPxl(this.body.GetPosition())
        rectMode(CENTER);
        if(this.canInteract){
            fill(this.color);
        }else{
            fill(DUMMYNOTBLOCKING);
        }
        noStroke();
        rect(pos.x, pos.y, b2.unitsToPxl(this.width), b2.unitsToPxl(this.height));        
    }
};
