// src/components/MapView.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { COLORS } from "../constants";

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  zoomLevel?: number;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
  }>;
  style?: any;
}

const MapViewComponent: React.FC<MapViewProps> = ({
  latitude = 37.78825,
  longitude = -122.4324,
  zoomLevel = 0.01,
  markers = [],
  style,
}) => {
  const [region, setRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: zoomLevel,
    longitudeDelta: zoomLevel,
  });

  useEffect(() => {
    setRegion({
      latitude,
      longitude,
      latitudeDelta: zoomLevel,
      longitudeDelta: zoomLevel,
    });
  }, [latitude, longitude, zoomLevel]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title || "Location"}
            description={marker.description || ""}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    width: Dimensions.get("window").width,
    height: 300,
  },
});

export default MapViewComponent;
