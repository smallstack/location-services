


class Point2D {
    public x: number;
    public y: number;

    static create2D(x: number, y: number) {
        var point: Point2D = new Point2D();
        point.x = x;
        point.y = y;
        return point;
    }

    public equals(point2D: Point2D): boolean {
        return this.x === point2D.x && this.y === point2D.y;
    }
    
}