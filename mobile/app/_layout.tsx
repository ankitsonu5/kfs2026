import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CartProvider } from '@/context/CartContext';
// import Cart from "./(tabs)/cart";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        {/* <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        /> */}

        <Stack.Screen name='product/[id]' options={{headerShown: false}}/>

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </CartProvider>
  );
}
