import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import * as Location from 'expo-location';

type MapBackgroundProps = {
  /** Radius of the geofence circle in meters. */
  radius?: number;
  children: React.ReactNode;
};

const CIRCLE_FILL = 'rgba(34, 197, 94, 0.15)';
const CIRCLE_STROKE = 'rgba(34, 197, 94, 0.6)';

/**
 * Full-screen native map background for the clock screen.
 * Uses Apple Maps on iOS (no API key) and Google Maps on Android.
 */
export function MapBackground({ radius = 200, children }: MapBackgroundProps) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        mapType="mutedStandard"
        userInterfaceStyle="dark"
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        showsBuildings={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        toolbarEnabled={false}
        region={
          location
            ? {
                ...location,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            : undefined
        }
      >
        {location && (
          <Circle
            center={location}
            radius={radius}
            fillColor={CIRCLE_FILL}
            strokeColor={CIRCLE_STROKE}
            strokeWidth={2}
          />
        )}
      </MapView>
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
