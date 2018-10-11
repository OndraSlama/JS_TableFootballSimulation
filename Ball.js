class Ball {
    constructor(x, y) {
        this.diameter = 350;
        this.color = "yellow";
        
        // Body definition
        b2.bodyDef.type = b2.Body.b2_dynamicBody;
        b2.bodyDef.position = b2.unitsToWorld(createVector(x, y));
        b2.bodyDef.linearDamping = .2;
        // b2.bodyDef.linearVelocity.x = b2.unitsToWorld(100);
        // b2.bodyDef.linearVelocity.y = b2.unitsToWorld(-10000);
        
        // Fixture definition
        b2.fixDef.density = 1.0;
        b2.fixDef.friction = .05;
        b2.fixDef.restitution = 0.5;

        // Shape definition
        b2.fixDef.shape = new b2.CircleShape(b2.unitsToWorld(this.diameter/2));

        this.body = b2.world.CreateBody(b2.bodyDef);
        this.body.CreateFixture(b2.fixDef);

        this.body.ApplyImpulse(new b2.Vec2(Math.random()*-.002, Math.random()*-.002), this.body.GetWorldCenter());
    }

    draw(){
        let pos = b2.worldToPxl(this.body.GetPosition())
        rectMode(CENTER);
        fill(this.color);
        noStroke();
        ellipse(pos.x, pos.y, b2.unitsToPxl(this.diameter));
    }

    applyForces(){
        let pos = b2.worldToPxl(this.body.GetPosition())
        let vel = b2.worldToPxl(this.body.GetLinearVelocity)
    }
};
