import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export const unstable_settings = {
  // Ensure any route can link back to (tabs) onboarding
  initialRouteName: "index",
};
