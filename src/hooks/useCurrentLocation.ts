/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE CURRENT LOCATION HOOK
 * ═══════════════════════════════════════════════════════════════
 *
 * Manages device GPS location for the spray screen header.
 *   - checks & requests location permission via react-native-permissions
 *   - fetches current coordinates via @react-native-community/geolocation
 *   - reverse geocodes to a human-readable place name (Nominatim)
 */

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

export interface CurrentLocation {
  name: string;
  latitude: number;
  longitude: number;
}

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

interface GeoPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkPermission = useCallback(async () => {
    if (!LOCATION_PERMISSION) {
      setPermissionStatus(RESULTS.UNAVAILABLE);
      return;
    }
    const result = await check(LOCATION_PERMISSION);
    setPermissionStatus(result);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!LOCATION_PERMISSION) {
      setPermissionStatus(RESULTS.UNAVAILABLE);
      return RESULTS.UNAVAILABLE;
    }
    const result = await request(LOCATION_PERMISSION);
    setPermissionStatus(result);
    return result;
  }, []);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    try {
      const position = await new Promise<GeoPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (pos) => resolve(pos as GeoPosition),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode using OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'BaagichaApp/1.0',
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      const address = data.address || {};

      const locality =
        address.village ||
        address.town ||
        address.city ||
        address.county ||
        address.state_district ||
        'Unknown';

      const state = address.state || '';
      const displayName = state ? `${locality}, ${state}` : locality;

      setLocation({
        name: displayName,
        latitude,
        longitude,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[useCurrentLocation] Failed to fetch location:', err);
      // Leave location null so consumer can fall back to API data
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocation = useCallback(async () => {
    if (permissionStatus === RESULTS.GRANTED) {
      await fetchLocation();
    } else if (
      permissionStatus === RESULTS.DENIED ||
      permissionStatus === RESULTS.LIMITED ||
      permissionStatus === null
    ) {
      const result = await requestPermission();
      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        await fetchLocation();
      }
    }
    // BLOCKED or UNAVAILABLE — can't do anything
  }, [permissionStatus, requestPermission, fetchLocation]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Auto-fetch when permission is already granted
  useEffect(() => {
    if (
      (permissionStatus === RESULTS.GRANTED || permissionStatus === RESULTS.LIMITED) &&
      !location &&
      !loading
    ) {
      fetchLocation();
    }
  }, [permissionStatus, location, loading, fetchLocation]);

  return { location, permissionStatus, loading, getLocation };
}
