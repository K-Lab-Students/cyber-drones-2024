import {TelemetryData} from "../Entity/TelemetryData";

export interface Drone {
    lat: number;
    lng: number;
    height: number;
    telemetryData: TelemetryData;
    ip: string;
}