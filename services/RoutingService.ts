
/// <reference path="../models/Point2D.ts" />
/// <reference path="../models/Route2D.ts" />



interface RoutingService {
    getRoute(pointA: Point2D, pointB: Point2D, callbackFn: (error: Error, route: Route2D) => void): void;
}