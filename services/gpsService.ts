import { FloorID } from "../types";

/**
 * Precision Boundaries for Deerfields Mall, Abu Dhabi.
 * Calibrated via Google Maps coordinates (24.5235° N, 54.6711° E).
 */
const MALL_BOUNDS = {
  top: 24.5260,    // North edge
  bottom: 24.5210, // South edge
  left: 54.6680,   // West edge
  right: 54.6740,  // East edge
};

export interface MallLocation {
  x: number;
  y: number;
  floor: FloorID;
  accuracy: number;
}

const mapCoords = (latitude: number, longitude: number, accuracy: number): MallLocation => {
  const xRange = MALL_BOUNDS.right - MALL_BOUNDS.left;
  const yRange = MALL_BOUNDS.top - MALL_BOUNDS.bottom;

  // Linear interpolation with clamping to our 2048 x 1536 canvas
  const xPercent = (longitude - MALL_BOUNDS.left) / xRange;
  const yPercent = (MALL_BOUNDS.top - latitude) / yRange;

  const x = Math.max(0, Math.min(2048, xPercent * 2048));
  const y = Math.max(0, Math.min(1536, yPercent * 1536));

  return {
    x,
    y,
    floor: FloorID.ML, 
    accuracy
  };
};

export const watchBrowserLocation = (
  onSuccess: (loc: MallLocation) => void,
  onError: (errMessage: string) => void
): number => {
  if (!navigator.geolocation) {
    onError("Geolocation is not supported.");
    return -1;
  }

  return navigator.geolocation.watchPosition(
    (pos) => {
      onSuccess(mapCoords(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy));
    },
    (err) => {
      onError(`GPS Error: ${err.message}`);
    },
    { 
      enableHighAccuracy: true, 
      timeout: 10000,
      maximumAge: 2000 
    }
  );
};