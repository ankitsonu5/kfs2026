import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/api";

interface UserData {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        await AsyncStorage.removeItem("userToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching profile", error);
      Alert.alert("Error", "Profile fetch failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          setUser(null);
          router.replace("/login");
        },
      },
    ]);
  };

  const menuItems = [
    { id: "1", title: "My Order", icon: "bag-handle-outline", route: "orders" },
    {
      id: "2",
      title: "Saved Addresses",
      icon: "location-outline",
      route: "addresses",
    },
    {
      id: "3",
      title: "Payment Methods",
      icon: "card-outline",
      route: "payments",
    },
    {
      id: "4",
      title: "Notifications",
      icon: "notifications-outline",
      route: "notifications",
    },
    {
      id: "5",
      title: "Help & Support",
      icon: "headset-outline",
      route: "support",
    },
    {
      id: "6",
      title: "Terms & Privacy",
      icon: "document-text-outline",
      route: "privacy",
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00a63e" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={{ color: "#666" }}>No user logged in.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {user ? (
          <View style={styles.userCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.fullName || "user"}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userPhone}>
                {user.phone || "Phone not added"}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={18} color="#00a63e" />
            </TouchableOpacity>
          </View>
        ) : (
          /* If not Logged In */
          <View style={styles.loginPromptCard}>
            <Ionicons name="person-circle-outline" size={60} color="#999" />
            <Text style={styles.notLoggedInText}>You are not logged in</Text>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/login")}>
              <Text style={styles.loginBtnText}>Login / Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.quickStatsContainer}>
          <TouchableOpacity style={styles.statBox}>
            <Ionicons name="cube-outline" size={24} color="#00a63e" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statBox}>
            <Ionicons name="heart-outline" size={24} color="#00a63e" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Whislist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statBox}>
            <Ionicons name="wallet-outline" size={24} color="#f4a261" />
            <Text style={styles.statNumber}>₹250</Text>
            <Text style={styles.statLabel}>Wallet</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon as any} size={20} color="#333" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </TouchableOpacity>
          ))}

          {user && (
            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#ffebe6" }]}>
                  <Ionicons name="log-out-outline" size={20} color="#e63946" />
                </View>
                <Text style={[styles.menuItemText, { color: "#e63946" }]}>
                  Logout
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#e63946" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fff9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e5e7eb",
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  userPhone: {
    fontSize: 13,
    color: "#10b981",
    marginTop: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#eaf7ed",
    borderRadius: 20,
  },
  loginPromptCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 14,
  },
  loginBtn: {
    backgroundColor: "#00a63e",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  quickStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 15,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
});
