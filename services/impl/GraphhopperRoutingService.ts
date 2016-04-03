/// <reference path="../RoutingService.ts" />


class GraphhopperRoutingService implements RoutingService {

    private graphhopperUrl: string;

    constructor() {
        // this.graphhopperUrl = ConfigurationService.instance().get("graphhopper.service.url", "http://routing.smallstack.io");
        this.graphhopperUrl = "http://routing.smallstack.io";
    }

    public getRoute(pointA: Point2D, pointB: Point2D, callbackFn: (error: Error, route: Route2D) => void): void {
        if (pointA == undefined)
            callbackFn(new Error("No pointA given!"), undefined);
        if (pointB == undefined)
            callbackFn(new Error("No pointB given!"), undefined);

        // if (!(pointA.x instanceof Number) || !Match.test(pointA.y, Number) || !Match.test(pointB.x, Number) || !Match.test(pointB.y, Number)) {
        //     callbackFn(new Error("Coordinates are malformed!"), undefined);
        // }

        try { 
            $.ajax({
                method: "GET",
                url: this.graphhopperUrl + "/route?point=" + pointA.x + "," + pointA.y + "&point=" + pointB.x + "," + pointB.y + "&vehicle=car&points_encoded=false",
                timeout: 5000,
                error: function(jqXHR: JQueryXHR, textStatus: string, errorThrown: string) {
                    callbackFn(new Error(textStatus + " - " + errorThrown), undefined);
                },
                success: function(data: any, textStatus: string, jqXHR: JQueryXHR) {
                    if (data && data.paths instanceof Array && data.paths.length > 0) {
                        var route: Route2D = new Route2D();
                        _.each(data.paths[0].points.coordinates, function(coord) {
                            route.points.push(Point2D.create2D(coord[1], coord[0]));
                        });

                        callbackFn(undefined, route);
                    } else {
                        callbackFn(new Error("Could not find route in graphhopper!"), undefined);
                    }
                }
            });
        } catch (e) {
            console.error("the raw error from the geolocator service : ", e);
            if (e.code === "ENOTFOUND" || e.code === "ENETUNREACH" || e.code === "ECONNREFUSED" || e.code === "ESOCKETTIMEDOUT") {
                callbackFn(new Error("Could not contact routing service (" + this.graphhopperUrl + ")."), undefined);
            }
            else
                callbackFn(new Error("Error while finding route!" + e), undefined);
        };
    }
}