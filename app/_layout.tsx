import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { AdMobService } from "../src/services/admob";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    AdMobService.initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <Stack>
            {/* Tabs(home, saved, exams) */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Quiz */}
            <Stack.Screen
              name="quiz"
              options={{ headerShown: false, presentation: "fullScreenModal" }}
            />

            {/* Result */}
            <Stack.Screen
              name="result"
              options={{ headerShown: false, presentation: "fullScreenModal" }}
            />

            {/* Rule Detail */}
            <Stack.Screen
              name="rules/[id]"
              options={{ headerShown: false, presentation: "card" }}
            />
          </Stack>

          <StatusBar style="auto" />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
