class Field {
    constructor(game, rest = .2) {
        this.game = game;
        this.width = FIELD_WIDTH; // width of the field
        this.height = FIELD_HEIGHT; // height of the field
        this.goalWidth = GOAL_WIDTH; // width of the goal
        this.slopesize = SLOPE_SIZE; // width of the slope around borders
        this.cornerSlopeReach = 1200;

        this.body;
        this.pos = createVector(width / 2, height / 2);

        // Fixture definition
        b2.fixDef.density = 1.0;
        b2.fixDef.friction = .05;
        b2.fixDef.restitution = rest;

        // Body definition
        b2.bodyDef.type = b2.Body.b2_staticBody;
        b2.bodyDef.position = new b2.Vec2(0, 0);
        this.body = this.game.world.CreateBody(b2.bodyDef);
        this.body.SetUserData(this);

        // Shape definition
        // Left wall
        
        b2.fixDef.shape = new b2.PolygonShape;

        this.vertices = [];
        this.vertices.push(b2.u2w(0, this.goalWidth / 2));
        this.vertices.push(b2.u2w(0, this.height / 2));

        this.vertices.push(b2.u2w(0, this.height / 2));
        this.vertices.push(b2.u2w(this.width, this.height / 2));

        this.vertices.push(b2.u2w(this.width, this.height / 2));
        this.vertices.push(b2.u2w(this.width, this.goalWidth / 2));

        this.vertices.push(b2.u2w(this.width, -this.goalWidth / 2));
        this.vertices.push(b2.u2w(this.width, -this.height / 2));

        this.vertices.push(b2.u2w(this.width, -this.height / 2));
        this.vertices.push(b2.u2w(0, -this.height / 2));

        this.vertices.push(b2.u2w(0, -this.height / 2));
        this.vertices.push(b2.u2w(0, -this.goalWidth / 2));

        for (let i = 0; i < this.vertices.length; i += 2) {
            b2.fixDef.shape.SetAsEdge(this.vertices[i], this.vertices[i + 1]);
            this.body.CreateFixture(b2.fixDef);
        }
    }

    draw() {
        // Draw slopes ---------------------------
        rectMode(CORNER)
        fill(SLOPES);
        noStroke(); 
        
        // top
        let corner = b2.u2p(0, this.height/2);
        rect(corner.x, corner.y, b2.u2p(this.width, "SCALE"), b2.u2p(SLOPE_SIZE))
        
        // bottom
        corner = b2.u2p(0, -this.height/2 + this.slopesize);
        rect(corner.x, corner.y, b2.u2p(this.width, "SCALE"), b2.u2p(SLOPE_SIZE));
        
        // Top left triangle
        let points = [];
        points.push(b2.u2p(0, this.height/2));
        points.push(b2.u2p(0, this.goalWidth/2));
        points.push(b2.u2p(this.cornerSlopeReach, this.height/2));
        triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
        
        // Bottom left triangle
        points.splice(0, points.length);
        points.push(b2.u2p(0, -this.height/2));
        points.push(b2.u2p(0, -this.goalWidth/2));
        points.push(b2.u2p(this.cornerSlopeReach, -this.height/2));
        triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
        
        // Bottom left triangle
        points.splice(0, points.length);
        points.push(b2.u2p(this.game.field.width, this.height/2));
        points.push(b2.u2p(this.game.field.width, this.goalWidth/2));
        points.push(b2.u2p(this.game.field.width - this.cornerSlopeReach, this.height/2));
        triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
        
        // Bottom left triangle
        points.splice(0, points.length);
        points.push(b2.u2p(this.game.field.width, -this.height/2));
        points.push(b2.u2p(this.game.field.width, -this.goalWidth/2));
        points.push(b2.u2p(this.game.field.width - this.cornerSlopeReach, -this.height/2));
        triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
        
        // Draw boundaries -----------------------------
        for (let i = 0; i < this.vertices.length; i += 2) {
            strokeWeight(4);
            stroke(FIELD_BOUNDARIES);
            line(b2.w2p(this.vertices[i]).x, b2.w2p(this.vertices[i]).y, b2.w2p(this.vertices[i+1]).x, b2.w2p(this.vertices[i+1]).y);
        }

    }
}