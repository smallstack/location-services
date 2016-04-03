/// <reference path="../models/Point2D.ts" />
/// <reference path="../models/Route2D.ts" />
/// <reference path="../models/Address.ts" />



interface GeocoderService {

    getPoint2D(addressSeach: string, callbackFn: (error: Error, point2D: Point2D) => void): void;
    getAddress(point: Point2D, callbackFn: (error: Error, address: Address) => void): void;
    getCurrentPosition(callbackFn: (error: Error, point2D: Point2D) => void): void;
    getCurrentPosition(continuously: boolean, callbackFn: (error: Error, point2D: Point2D) => void): void;
}