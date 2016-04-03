/// <reference path="models/Point2D.ts" />
/// <reference path="models/Area.ts" />

class GPSUtils {

    public static encodeGoogleCoordinates(coordinate: any, factor: number) {
        coordinate = Math.round(coordinate * factor);
        coordinate <<= 1;
        if (coordinate < 0) {
            coordinate = ~coordinate;
        }
        var output = '';
        while (coordinate >= 0x20) {
            output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
            coordinate >>= 5;
        }
        output += String.fromCharCode(coordinate + 63);
        return output;
    }

    public static decodeGoogleCoordinates(str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        while (index < str.length) {

            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    }


    public static getDistance(lon1: number, lat1: number, lon2: number, lat2: number) {
        var R = 6371; // Radius of the earth in km
        var dLat = GPSUtils.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = GPSUtils.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(GPSUtils.deg2rad(lat1)) * Math.cos(GPSUtils.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d * 1000;
    }


    public static getBearing(lat1: number, lng1: number, lat2: number, lng2: number) {
        var dLon = (lng2 - lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = GPSUtils.rad2deg(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360);
    }

    public static deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    public static rad2deg(rad: number) {
        return rad * 180 / Math.PI;
    }


    /**
     * This function assumes that the first value is the longetude and the second the latitude, or that longetude|latitude or lag|lng properties exist
     */
    public static convertLatLngObjectToPoint2D(latLngObject: any) {
        if (latLngObject == undefined)
            throw new Error("Cannot convert a gps coordinate that is undefined, sorry!");

        var point: Point2D = new Point2D();

        if (latLngObject.longetude)
            point.x = latLngObject.longetude;

        if (latLngObject.latitude)
            point.y = latLngObject.latitude;

        if (latLngObject.lat)
            point.y = latLngObject.lat;

        if (latLngObject.lng)
            point.x = latLngObject.lng;

        if (latLngObject[0] && latLngObject[1]) {
            point.y = latLngObject[0];
            point.x = latLngObject[1];
        }

        if (!point.x || !point.y)
            throw new Error("Could not convert gps coordinate : " + latLngObject);

        return point;
    }

    public static latLngBoundsToArea(latLngBounds) {
        return new Area(GPSUtils.convertLatLngObjectToPoint2D(latLngBounds.getNorthWest()), GPSUtils.convertLatLngObjectToPoint2D(latLngBounds.getSouthEast()));
    }

    public calculateSpeed(positionA: Point2D, timeA: number, positionB: Point2D, timeB: number) {
        var distance = GPSUtils.getDistance(positionA.x, positionA.y, positionB.x, positionB.y);
        var deltaTime = timeB - timeA;
        var kmh = (distance / 1000) / ((((deltaTime / 1000) / 60) / 60));
        return kmh;
    };

}