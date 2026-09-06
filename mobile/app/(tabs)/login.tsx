import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Link, useRouter } from "expo-router";
import { BASE_URL } from "@/constants/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {

    //Check Validation
      if(!email.trim() || !password){
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      try {
        setLoading(true);

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        Alert.alert("Success", data.message || "Login successful!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ]);
      } else {
        Alert.alert("Login failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Server not connected. Please check IP and backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Logo Section */}
        <View style={styles.loginSection}>
          <Image
            source={require("@/assets/images/kfslogo.webp")}
            style={{ width: 200, height: 80, resizeMode: "contain" }}
          />
        </View>

        {/* Form Section */}

        <Input
          label="Your Email"
          placeholder="name@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Input
            label="Your Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center" }}>
          <Button title="Sign In" onPress={handleSignIn} />
        </View>

        <Text style={styles.registerText}>
          Don&apos;t have an account?{" "}
          <Link href={"/signup"} asChild>
            <Text style={styles.registerLink}>Sign Up</Text>
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loginSection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  eyeIcon: {
    position: "absolute",
    right: 40,
    top: 53,
  },
  registerText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  registerLink: {
    color: "green",
    fontWeight: "bold",
  },
});
