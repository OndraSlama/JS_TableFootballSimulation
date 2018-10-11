class Field {
    constructor(rest = 0.5) {
        this.color = "red";
        this.width = 12100; // width of the field
        this.height = 7030; // height of the field
        this.goalWidth = 2150; // width of the goal
        this.slopesize = 400; // width of the slope around borders

        this.body;
        this.pos = createVector(width / 2, height / 2);

        // Fixture definition
        b2.fixDef.density = 1.0;
        b2.fixDef.friction = .05;
        b2.fixDef.restitution = 0.5;

        // Body definition
        b2.bodyDef.type = b2.Body.b2_staticBody;
        b2.bodyDef.position = new b2.Vec2(0, 0);
        this.body = b2.world.CreateBody(b2.bodyDef);

        // Shape definition
        // Left wall
        b2.fixDef.shape = new b2.PolygonShape;

        this.vertices = [];
        this.vertices.push(b2.unitsToWorld(0, this.goalWidth / 2));
        this.vertices.push(b2.unitsToWorld(0, this.height / 2));

        this.vertices.push(b2.unitsToWorld(0, this.height / 2));
        this.vertices.push(b2.unitsToWorld(this.width, this.height / 2));

        this.vertices.push(b2.unitsToWorld(this.width, this.height / 2));
        this.vertices.push(b2.unitsToWorld(this.width, this.goalWidth / 2));

        this.vertices.push(b2.unitsToWorld(this.width, -this.goalWidth / 2));
        this.vertices.push(b2.unitsToWorld(this.width, -this.height / 2));

        this.vertices.push(b2.unitsToWorld(this.width, -this.height / 2));
        this.vertices.push(b2.unitsToWorld(0, -this.height / 2));

        this.vertices.push(b2.unitsToWorld(0, -this.height / 2));
        this.vertices.push(b2.unitsToWorld(0, -this.goalWidth / 2));

        for (let i = 0; i < this.vertices.length; i += 2) {
            b2.fixDef.shape.SetAsEdge(this.vertices[i], this.vertices[i + 1]);
            this.body.CreateFixture(b2.fixDef);
        }
    }

    draw() {
        for (let i = 0; i < this.vertices.length; i += 2) {
            strokeWeight(4);
            stroke("blue");
            line(b2.worldToPxl(this.vertices[i]).x, b2.worldToPxl(this.vertices[i]).y, b2.worldToPxl(this.vertices[i+1]).x, b2.worldToPxl(this.vertices[i+1]).y);
        }
    }
}