/// <reference path="Point2D.ts" />




class Point3D extends Point2D {
	public z: number;

	static create3D(x: number, y: number, z: number) {
		var point: Point3D = new Point3D();
		point.x = x;
		point.y = y;
		point.z = z;
		return point;
	}
}