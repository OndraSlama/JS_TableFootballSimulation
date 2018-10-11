class MyBox2D {
    constructor(pscl = 1000, uscl = 10000) {
        // Box2D things
        this.Vec2 = Box2D.Common.Math.b2Vec2,
            this.BodyDef = Box2D.Dynamics.b2BodyDef,
            this.Body = Box2D.Dynamics.b2Body,
            this.FixtureDef = Box2D.Dynamics.b2FixtureDef,
            this.Fixture = Box2D.Dynamics.b2Fixture,
            this.World = Box2D.Dynamics.b2World,
            this.MassData = Box2D.Collision.Shapes.b2MassData,
            this.PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
            this.CircleShape = Box2D.Collision.Shapes.b2CircleShape,
            this.DebugDraw = Box2D.Dynamics.b2DebugDraw;

        // Conversion values
        this.pixelScale = pscl; //pixel to world scale
        this.unitsScale = uscl; //user's unit to world scale
        this.xOff = 0; // x offset for user units
        this.yOff = 0; // y offset for user units

        // Animation
        this.speedFactor = 1;
        this.frameRate = 60;

        // World objects
        this.world;
        this.fixDef = new this.FixtureDef;
        this.bodyDef = new this.BodyDef;
    }

    createWorld(x, y) {
        this.world = new this.World(
            new this.Vec2(x, y) //gravity
            , true //allow sleep
        );
    }

    update() {
        for (let i = 0; i < (this.speedFactor > 1 ? Math.round(this.speedFactor) : 1); i++) {
            this.world.Step(
                1 / this.frameRate * (this.speedFactor < 1 ? this.speedFactor : 1) //frame-rate
                , 10 //velocity iterations
                , 10 //position iterations
            );
            this.world.ClearForces();
        }
    }

    pxlToWorld(pos, second = undefined) {
        if ((pos instanceof p5.Vector) || (pos instanceof this.Vec2)) {
            return new this.Vec2(pos.x / this.pixelScale, pos.y / this.pixelScale);
        } else if (second != undefined){
            return new this.Vec2(pos / this.pixelScale, second / this.pixelScale);
        }
        return pos / this.pixelScale;
    }

    worldToPxl(pos, second = undefined) {
        if ((pos instanceof p5.Vector) || (pos instanceof this.Vec2)) {
            return createVector(pos.x * this.pixelScale, pos.y * this.pixelScale);
        } else if (second != undefined){
            return createVector(pos * this.pixelScale, second * this.pixelScale);
        }
        return pos * this.pixelScale;
    }

    unitsToWorld(first, second = "", third = "") {
        if ((first instanceof p5.Vector) || (first instanceof this.Vec2) || typeof second != "string") {
            let X, Y;
            if (second == "") {
                X = first.x / this.unitsScale + this.xOff;
                Y = first.y / this.unitsScale + this.yOff;
            } else if (second == "SCALE") {
                X = first.x / this.unitsScale;
                Y = first.y / this.unitsScale;
            } else if (third == "") {
                X = first / this.unitsScale + this.xOff;
                Y = second / this.unitsScale + this.yOff;
            } else if (third == "SCALE") {
                X = first / this.unitsScale;
                Y = second / this.unitsScale;
            }
            return new this.Vec2(X, Y);
        }

        if (second == "WIDTH") {
            return first / this.unitsScale + this.xOff;
        } else if (second == "HEIGHT") {
            return first / this.unitsScale + this.yOff;
        } else{
            return first / this.unitsScale;
        }
    }

    worldToUnits(first, second = "", third = "") {
        if ((first instanceof p5.Vector) || (first instanceof this.Vec2) || typeof second != "string") {
            let X, Y;
            if (second == "") {
                X = (first.x - this.xOff) * this.unitsScale;
                Y = (first.y - this.yOff) * this.unitsScale;
            } else if (second == "SCALE") {
                X = first.x * this.unitsScale;
                Y = first.y * this.unitsScale;
            } else if (third == "") {
                X = (first  - this.xOff) * this.unitsScale;
                Y = (second - this.yOff) * this.unitsScale;
            } else if (third == "SCALE") {
                X = first * this.unitsScale;
                Y = second * this.unitsScale;
            }
            return createVector(X, Y);
        }

        if (second == "WIDTH") {
            return (first - this.xOff) * this.unitsScale; 
        } else if (second == "HEIGHT") {
            return (first - this.yOff) * this.unitsScale;
        } else{
            return first * this.unitsScale;
        }
    }

    // function worldToUnits(pos) {
    //     if ((pos instanceof p5.Vector) || (pos instanceof this.Vec2)) {
    //         return createVector(pos.x * 10000, pos.y * 10000);
    //     }
    //     return pos * 10000;
    // }

    unitsToPxl(first, second = "", third = "") {
        return this.worldToPxl(this.unitsToWorld(first, second, third));
    }
}