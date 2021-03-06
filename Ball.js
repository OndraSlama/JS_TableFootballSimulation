class Ball {
    constructor(game, x = FIELD_WIDTH/2, y = -3300) {
        this.game = game;        
        this.diameter = BALL_RADIUS*2;

        // State
        this.pos;
        this.velocity;
        this.angle;
        this.angularVelocity;
        this.mass;
        this.timer = 0;

        // Box2D things -----------------------------------------

        // Body definition
        b2.bodyDef.type = b2.Body.b2_dynamicBody;
        b2.bodyDef.position = b2.u2w(createVector(x, y));
        b2.bodyDef.linearDamping = 0.15;
        // b2.bodyDef.linearVelocity.x = b2.u2w(100);
        // b2.bodyDef.linearVelocity.y = b2.u2w(-10000);


        // Fixture definition
        b2.fixDef.density = 1.1;
        b2.fixDef.friction = .05;
        b2.fixDef.restitution = 0;
        b2.fixDef.filter.maskBits = 65535;
        b2.fixDef.filter.categoryBits = 1;

        // Shape definition
        b2.fixDef.shape = new b2.CircleShape(b2.u2w(this.diameter / 2));

        this.body = this.game.world.CreateBody(b2.bodyDef);
        this.body.CreateFixture(b2.fixDef);
        this.body.SetUserData(this);

        this.body.ApplyImpulse(b2.vel2acc(new b2.Vec2(random(b2.u2w(-0.005, "SCALE"), b2.u2w(0.005, "SCALE")), random(b2.u2w(.5, "SCALE"), b2.u2w(1.5, "SCALE"))), this.body), this.body.GetWorldCenter());

        // Mouse joint definition
        this.target = createVector();
        b2.mouseJointDef.bodyA = this.game.world.GetGroundBody();
        b2.mouseJointDef.bodyB = this.body;
        b2.mouseJointDef.target = this.body.GetPosition();
        b2.mouseJointDef.maxForce = 10;
        b2.mouseJointDef.dampingRatio = 0.5;

        this.mouseJoint = false;
    }

    draw() {
        let pos = b2.w2p(this.body.GetPosition())
        rectMode(CENTER);
        fill(BALL);
        noStroke();
        ellipse(pos.x, pos.y, b2.u2p(this.diameter));
        
        // text(dummies[0].angle, 30, 100);
    }

    update() {
        this.pos = b2.w2u(this.body.GetPosition());
        this.velocity = b2.w2u(this.body.GetLinearVelocity(), "SCALE");

        this.angle = this.body.GetAngle();
        this.angularVelocity = this.body.GetAngularVelocity();

        this.mass = this.body.GetMass();
        this.body.SetAwake(1);

        this.target.set(mouseX, mouseY);
        if (this.mouseJoint) {
            this.mouseJoint.SetTarget(b2.p2w(this.target));
        }

        this.applyForces();
    }

    applyForces() {
        // Friction
        let magnitude = 0.001;
        let max = 0.2
        let force = this.velocity.copy();
        let velMag = p5.Vector.mag(this.velocity);
        let scale = 0.005 / b2.timeStep;
        force.normalize();
        force.mult(velMag * -magnitude);
        force.limit(max);
        this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));

        // Random stuff
        let softness = 3000
        magnitude = 1
        force.set(  map(noise(this.pos.x / softness, this.pos.y / softness), 0, 1, -magnitude, magnitude),
                    map(noise(this.pos.x / softness + 1000, this.pos.y / softness + 1000), 0, 1, -magnitude, magnitude));
        if (velMag < 300) force.limit(0.1);
        this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));

        // Blow
        if (velMag < 120) {
            this.timer += b2.timeStep;
        } else {
            this.timer = 0;
        }
        if (this.timer > 3) {
            this.timer = 0;
            force.set(-Math.sign(this.pos.x - this.game.field.width / 2) * random(200, 400) * scale, Math.sign(random(-1, 1)) * random(200, 400) * scale);
            this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));
        }

        // Edge slopes
        if (abs(this.pos.y) > (this.game.field.height / 2 - this.game.field.slopesize)) {
            force.set(0, -Math.sign(this.pos.y) * 40);
            this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));
        }

        // Corner slopes
        let dy = this.game.field.height / 2 - this.game.field.goalWidth / 2;
        let dx = this.game.field.cornerSlopeReach;
        let offset = this.game.field.goalWidth / 2
        let xSide = Math.sign(this.pos.x - this.game.field.width / 2);
        let ySide = Math.sign(this.pos.y);
        let xSlopeForce = 9;
        let ySlopeForce = 5;

        // Left 
        if (this.pos.y > (dy / dx) * this.pos.x + offset) {
            force.set(-xSide * xSlopeForce, -ySide * ySlopeForce);
            this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));
        }
        if (this.pos.y < -(dy / dx) * this.pos.x - offset) {
            force.set(-xSide * xSlopeForce, -ySide * ySlopeForce);
            this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));
        }

        // Right
        if (this.pos.y > -(dy / dx) * (this.pos.x - this.game.field.width) + offset) {
            force.set(-xSide * xSlopeForce, -ySide * ySlopeForce);
            this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));
        }
        if (this.pos.y < (dy / dx) * (this.pos.x - this.game.field.width) - offset) {
            force.set(-xSide * xSlopeForce, -ySide * ySlopeForce);
            this.body.ApplyForce(b2.u2w(force, "SCALE"), b2.u2w(this.pos));
        }

        // Debug
        // if(b2.w2u(b2.p2w(mouseY), "HEIGHT") < (dy/dx)*(b2.w2u(b2.p2w(mouseX), "WIDTH") - field.width) - offset){
        //     ellipse(0,0,200);
        // }

    }

    bindToTarget() {
        if (!this.mouseJoint) {
            this.mouseJoint = this.game.world.CreateJoint(b2.mouseJointDef);
        }
    }

    unbind() {
        if (this.mouseJoint) {
            this.game.world.DestroyJoint(this.mouseJoint);
            this.mouseJoint = false;
        }
    }
};
