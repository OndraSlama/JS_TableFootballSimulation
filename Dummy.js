class Dummy {
    constructor(game, axis, offset) {
        this.game = game;

        this.axis = axis;
        this.width = 120;
        this.height = 210;
        this.playerHeight = DUMMY_HEIGHT;
        this.offset = offset;

        // State properties
        this.position = createVector();
        this.velocity = createVector();

        // Fixture definition
        b2.fixDef.density = 1.0;
        b2.fixDef.friction = .1;
        b2.fixDef.restitution = 0.1;

        // Body definition
        b2.bodyDef.type = b2.Body.b2_kinematicBody;
        b2.bodyDef.position.x = b2.u2w(axis.absoluteX, "WIDTH");
        b2.bodyDef.position.y = b2.u2w(axis.absoluteY + offset, "HEIGHT");
        b2.bodyDef.linearVelocity.x = 0;
        b2.bodyDef.linearVelocity.y = 0;

        // Shape definition
        b2.fixDef.shape = new b2.PolygonShape;
        b2.fixDef.shape.SetAsBox(b2.u2w(this.width/2), b2.u2w(this.height/2));

        this.body = this.game.world.CreateBody(b2.bodyDef);
        this.body.CreateFixture(b2.fixDef);
        this.body.SetUserData(this);
    }

    update(){
        angleMode(DEGREES);       
        let xPos = this.playerHeight * sin((this.axis.absoluteAngle + this.axis.angularVelocity * b2.timeStep)/10) + this.axis.absoluteX;
        let yPos = this.axis.absoluteY + this.offset;
        this.velocity = b2.pos2vel(b2.u2w(xPos, yPos), this.body);

        this.body.SetAwake(1);
        this.body.m_linearVelocity = this.velocity;

        this.position = b2.w2u(this.body.GetPosition());        
    }

    draw(){
        rectMode(CENTER);
        if(this.axis.canInteract){
            fill(this.axis.color);
        }else{
            fill(DUMMY_NOT_BLOCKING);
        }
        noStroke();
        let pos = b2.u2p(this.position)
        rect(pos.x, pos.y, b2.u2p(this.width), b2.u2p(this.height));
    }
};
