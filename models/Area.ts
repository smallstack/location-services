/// <reference path="Point2D.ts" />

class Area {
    private topLeft: Point2D;
    private bottomRight: Point2D;

    constructor(topLeft: Point2D, bottomRight: Point2D) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }
}