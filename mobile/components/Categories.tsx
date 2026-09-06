import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CategoryProps {
  name: string;
  image?: string;
  onPress?: () => void;
}

export default function CategoryCard({ name, image, onPress }: CategoryProps) {

  return (
          <TouchableOpacity style={styles.categoriesCard} onPress={onPress}>
            {image ? (
                <Image source={{ uri: image }} style={styles.categoryImage} resizeMode="contain" />
            ) : (
            <Ionicons name="grid-outline" size={28} color={"green"} />
        )}
            <Text style={styles.categoryName} numberOfLines={1}>{name}</Text>
          </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  categoriesCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 6,
    width: "31%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryImage: {
    width: 45,
    height: 45,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
