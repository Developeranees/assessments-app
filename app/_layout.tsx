import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { PortalProvider, TamaguiProvider } from "tamagui";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import config from "../tamagui.config";
import { useCallback, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "config/baseUrl";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

axios.defaults.baseURL = API_BASE_URL;

const queryClient = new QueryClient();

export default function AppLayout() {
  const [appIsReady] = useState(true);

  const [loaded] = useFonts({
    "Inter-Thin": require("@tamagui/font-inter/otf/Inter-Thin.otf"),
    "Inter-ExtraLight": require("@tamagui/font-inter/otf/Inter-ExtraLight.otf"),
    "Inter-Light": require("@tamagui/font-inter/otf/Inter-Light.otf"),
    "Inter-Regular": require("@tamagui/font-inter/otf/Inter-Regular.otf"),
    "Inter-Medium": require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    "Inter-SemiBold": require("@tamagui/font-inter/otf/Inter-SemiBold.otf"),
    "Inter-Bold": require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    "Inter-ExtraBold": require("@tamagui/font-inter/otf/Inter-ExtraBold.otf"),
    "Inter-Black": require("@tamagui/font-inter/otf/Inter-Black.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <TamaguiProvider config={config}>
          <PortalProvider>
            <SafeAreaProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
              </Stack>
            </SafeAreaProvider>
          </PortalProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
