class Dummy {
    constructor(x, y) {
        this.width = 120;
        this.height = 210;
        this.playerHeight = 500;
        this.color = "red";

        // Fixture definition
        b2.fixDef.density = 1.0;
        b2.fixDef.friction = .1;
        b2.fixDef.restitution = 0.3;

        // Body definition
        b2.bodyDef.type = b2.Body.b2_staticBody;

        b2.bodyDef.position.x = b2.unitsToWorld(x, "WIDTH");
        b2.bodyDef.position.y = b2.unitsToWorld(y, "HEIGHT");
        b2.bodyDef.linearVelocity.x = 0;
        b2.bodyDef.linearVelocity.y = 0;

        // Shape definition
        b2.fixDef.shape = new b2.PolygonShape;
        b2.fixDef.shape.SetAsBox(b2.unitsToWorld(this.width/2), b2.unitsToWorld(this.height/2));

        this.body = b2.world.CreateBody(b2.bodyDef);
        this.body.CreateFixture(b2.fixDef);
    }

    draw(){
        let pos = b2.worldToPxl(this.body.GetPosition())
        rectMode(CENTER);
        fill(this.color);
        noStroke();
        rect(pos.x, pos.y, b2.unitsToPxl(this.width), b2.unitsToPxl(this.height));
        fill(0);
        ellipse(pos.x, pos.y, 5)
    }
};
