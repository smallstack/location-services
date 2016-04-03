/// <reference path="../../typings/main.d.ts" />
/// <reference path="../../models/Address.ts" />
/// <reference path="../../models/Route2D.ts" />
/// <reference path="../GeocoderService.ts" />

import * as $ from "jquery";
import * as _ from "underscore";


class NominatimGeocodingService implements GeocoderService {

    private nominatimUrl: string;

    constructor() {
        // this.nominatimUrl = ConfigurationService.instance().get("nominatim.service.url", "http://nominatim.openstreetmap.org");
        // console.log("Initialized NominatimGeocodingService with url   : ", this.nominatimUrl);

        // for now this is the default url, please do not use in production and read http://wiki.openstreetmap.org/wiki/Nominatim#Usage_Policy
        this.nominatimUrl = "http://nominatim.openstreetmap.org";
    }

    public setNominatimUrl(url: string) {
        this.nominatimUrl = url;
    }


    public getPoint2D(addressSeach: string, callbackFn: (error: Error, point2D: Point2D) => void) {
        try {
            $.get(this.nominatimUrl + "/search?format=json&q=" + addressSeach, {
                timeout: 5000
            }, function(error: Error, result: any) {
                if (error)
                    callbackFn(error, undefined);
                else {
                    if (result.data instanceof Array && result.data.length > 0) {
                        var res = result.data[0];
                        var point2D: Point2D = new Point2D();
                        point2D.x = res.lon;
                        point2D.y = res.lat;
                        callbackFn(undefined, point2D);
                    } else {
                        console.error("result from nominatim : ", result);
                        callbackFn(new Error("Could not find address in nominatim!" + result), undefined);
                    }
                }
            });
        } catch (e) {
            console.error("the raw error from the nominatim service : ", e);
            if (e.code === "ENOTFOUND" || e.code === "ENETUNREACH" || e.code === "ECONNREFUSED" || e.code === "ESOCKETTIMEDOUT") {
                callbackFn(new Error("Could not contact geocoder (nominatim) service (" + this.nominatimUrl + ")."), undefined);
            }
            else
                callbackFn(new Error("Error while finding address!" + e), undefined);
        };
    }


    public getAddress(point: Point2D, callbackFn: (error: Error, address: Address) => void): void {

        try {
            $.get(this.nominatimUrl + "/reverse?format=json&lon=" + point.y + "&lat=" + point.x, {
                timeout: 5000
            }, function(error: Error, result: any) {
                if (error)
                    callbackFn(error, undefined);
                else {
                    if (result.data) {
                        var res = result.data;
                        var address: Address = new Address();
                        address.city = res["address"]["city"];
                        address.coordinates = Point2D.create2D(res["lon"], res["lat"]);
                        address.country = res["address"]["country"];
                        address.housenumber = parseInt(res["address"]["house_number"]);
                        address.postcode = parseInt(res["address"]["postcode"]);
                        address.state = res["address"]["state"];
                        address.street = res["address"]["road"];
                        callbackFn(undefined, address);
                    } else {
                        console.error("result from nominatim : ", result);
                        callbackFn(new Error("Could not find address in nominatim!" + result), undefined);
                    }
                }
            });
        } catch (e) {
            console.error("the raw error from the nominatim service : ", e);
            if (e.code === "ENOTFOUND" || e.code === "ENETUNREACH" || e.code === "ECONNREFUSED" || e.code === "ESOCKETTIMEDOUT") {
                callbackFn(new Error("Could not contact geocoder (nominatim) service (" + this.nominatimUrl + ")."), undefined);
            }
            else
                callbackFn(new Error("Error while finding address!" + e), undefined);
        };
    }

    public getCurrentPosition(callbackFn: (error: Error, point2D: Point2D) => void);
    public getCurrentPosition(continuously: boolean, callbackFn: (error: Error, point2D: Point2D) => void);

    public getCurrentPosition(continuously: any, callbackFn?: any): void {
        if (typeof continuously === 'function') {
            callbackFn = continuously;
            continuously = false;
        }

        if (continuously) {
            navigator.geolocation.getCurrentPosition(function(position: Position) {
                var point: Point2D = Point2D.create2D(position.coords.latitude, position.coords.longitude);
                callbackFn(undefined, point);
            }, function(error: PositionError) {
                callbackFn(new Error(error.code + "Could not locate current position!" + error.message), undefined);
            });
        } else {
            navigator.geolocation.watchPosition(function(position: Position) {
                var point: Point2D = Point2D.create2D(position.coords.latitude, position.coords.longitude);
                callbackFn(undefined, point);
            }, function(error: PositionError) {
                callbackFn(new Error(error.code + "Could not locate current position!" + error.message), undefined);
            });
        }
    };
}