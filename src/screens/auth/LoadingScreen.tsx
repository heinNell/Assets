// src/screens/auth/LoadingScreen.tsx
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: SPACING.lg,
  },
  text: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: "500",
  },
});

export default LoadingScreen;
