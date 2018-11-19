class B2 {
    constructor(pscl = 1000, uscl = 10000) {
        // Box2D things
        this.Vec2 = Box2D.Common.Math.b2Vec2;
        this.BodyDef = Box2D.Dynamics.b2BodyDef;
        this.Body = Box2D.Dynamics.b2Body;
        this.FixtureDef = Box2D.Dynamics.b2FixtureDef;
        this.Fixture = Box2D.Dynamics.b2Fixture;
        this.World = Box2D.Dynamics.b2World;
        this.MassData = Box2D.Collision.Shapes.b2MassData;
        this.PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        this.CircleShape = Box2D.Collision.Shapes.b2CircleShape;
        // this.DebugDraw = Box2D.Dynamics.b2DebugDraw;
        this.ContactListener = Box2D.Dynamics.b2ContactListener;
        this.MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
        this.MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint;

        // Conversion values
        this.pixelScale = pscl; //pixel to world scale
        this.unitsScaleX = uscl; //user's unit to world scale
        this.unitsScaleY = uscl;
        this.xOff = 0; // x offset for user units
        this.yOff = 0; // y offset for user units

        // Animation
        this.speedFactor = 1;
        this.frameRate = 60;
        this.timeStep = 1 / this.frameRate;

        // World objects
        this.world;
        this.fixDef = new this.FixtureDef;
        this.bodyDef = new this.BodyDef;
        this.mouseJointDef = new this.MouseJointDef;
    }

    createWorld(x, y) {
        this.world = new this.World(
            new this.Vec2(x, y) //gravity
            , true //allow sleep
        );
    }

    update(callback, animationFrameRate = 60) {
        this.timeStep = (1 / this.frameRate) * (this.speedFactor < 1 ? this.speedFactor : 1);

        for (let a = 0; a < round(this.frameRate / animationFrameRate); a++) {
            for (let i = 0; i < (this.speedFactor > 1 ? round(this.speedFactor) : 1); i++) {
                
                callback();
            }
        }

        

        

    }

    // Transformation functions
    pos2vel(pos, body) {
        let vel = new this.Vec2(pos.x, pos.y);

        let currentPos = body.GetPosition();
        vel.Subtract(currentPos);
        vel.Multiply(1 / this.timeStep);
        return vel;
    }

    vel2acc(vel, body) {
        let acc = new this.Vec2(vel.x, vel.y);

        let currentVel = body.GetLinearVelocity();
        acc.Subtract(currentVel);
        acc.Multiply(1 / this.timeStep);
        return acc;
    }

    p2w(pos, second = undefined) {
        if ((pos instanceof p5.Vector) || (pos instanceof this.Vec2)) {
            return new this.Vec2(pos.x / this.pixelScale, pos.y / this.pixelScale);
        } else if (second != undefined) {
            return new this.Vec2(pos / this.pixelScale, second / this.pixelScale);
        }
        return pos / this.pixelScale;
    }

    w2p(pos, second = undefined) {
        if ((pos instanceof p5.Vector) || (pos instanceof this.Vec2)) {
            return createVector(pos.x * this.pixelScale, pos.y * this.pixelScale);
        } else if (second != undefined) {
            return createVector(pos * this.pixelScale, second * this.pixelScale);
        }
        return pos * this.pixelScale;
    }

    u2w(first, second = "", third = "") {
        if ((first instanceof p5.Vector) || (first instanceof this.Vec2) || typeof second != "string") {
            let X, Y;
            if (second === "") {
                X = first.x / this.unitsScaleX + this.xOff;
                Y = first.y / this.unitsScaleY + this.yOff;
            } else if (second == "SCALE") {
                X = first.x / this.unitsScaleX;
                Y = first.y / this.unitsScaleY;
            } else if (third === "") {
                X = first / this.unitsScaleX + this.xOff;
                Y = second / this.unitsScaleY + this.yOff;
            } else if (third == "SCALE") {
                X = first / this.unitsScaleX;
                Y = second / this.unitsScaleY;
            }
            return new this.Vec2(X, Y);
        }

        if (second == "WIDTH") {
            return first / this.unitsScaleX + this.xOff;
        } else if (second == "HEIGHT") {
            return first / this.unitsScaleY + this.yOff;
        } else {
            return first / this.unitsScaleX;
        }
    }

    w2u(first, second = "", third = "") {
        if ((first instanceof p5.Vector) || (first instanceof this.Vec2) || typeof second != "string") {
            let X, Y;
            if (second == "") {
                X = (first.x - this.xOff) * this.unitsScaleX;
                Y = (first.y - this.yOff) * this.unitsScaleY;
            } else if (second == "SCALE") {
                X = first.x * this.unitsScaleX;
                Y = first.y * this.unitsScaleY;
            } else if (third == "") {
                X = (first - this.xOff) * this.unitsScaleX;
                Y = (second - this.yOff) * this.unitsScaleY;
            } else if (third == "SCALE") {
                X = first * this.unitsScaleX;
                Y = second * this.unitsScaleY;
            }
            return createVector(X, Y);
        }

        if (second == "WIDTH") {
            return (first - this.xOff) * this.unitsScaleX;
        } else if (second == "HEIGHT") {
            return (first - this.yOff) * this.unitsScaleY;
        } else {
            return first * this.unitsScaleX;
        }
    }

    // function w2u(pos) {
    //     if ((pos instanceof p5.Vector) || (pos instanceof this.Vec2)) {
    //         return createVector(pos.x * 10000, pos.y * 10000);
    //     }
    //     return pos * 10000;
    // }

    u2p(first, second = "", third = "") {
        return this.w2p(this.u2w(first, second, third));
    }
}

