import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import ProductList from "@/components/ProductList";
import Sidebar from "@/components/Sidebar";
import { BASE_URL } from "@/constants/api";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Products() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const prodRes = await fetch(`${BASE_URL}/products`);
        const prodData = await prodRes.json();
        if (prodData.success && prodData.products) {
          setProducts(prodData.products)
        } else if (Array.isArray(prodData)) {
          setProducts(prodData);
        }

        const catRes = await fetch(`${BASE_URL}/categories`);
        const catData = await catRes.json();
        if (Array.isArray(catData)) {
          setCategories(catData);
        } else if (catData.success && catData.categories) {
          setCategories(catData.categories);
        }

      } catch (error) {
        console.error("Backend Error:", error);
      } finally {
        setLoading(false);
      }
    } 
    loadData();
  }, []);

  if (loading) {
    return  (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a63e"/>
        <Text style={styles.loadingText}>KFS Store Products are loading...</Text>
      </View>
    );
  }

  const getProductImageUrl = (imageName: string) => {
    if (!imageName) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600';

    if (imageName.startsWith('http'))
      return imageName;
    return `${BASE_URL}/uploads/products/${imageName}`;
  };

  const getCategoryImageUrl = (imageName: string) => {
    if (!imageName) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600';

    if (imageName.startsWith('http'))
      return imageName;
    return `${BASE_URL}/uploads/categories/${imageName}`;
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Header />
        <SearchBox />
        <View>
          <Text style={styles.allProductsText}>All Products</Text>
        </View>

        
        <View style={styles.mainLayout}>
          {/* Left Column - Sidebar */}
          <View style={styles.sidebarColumn}>
            <Sidebar
            name="All"
            onPress={() => router.push('/products')}
            />

          {/* Dynamic Categories */}
          {categories.map((item) => (
            <Sidebar
            key={item._id}
            name={item.name}
            image={getCategoryImageUrl(item.image)}
            onPress={() => router.push(`/products?category=${item._id}`)}
            />
          ))}
          </View>

          {/* Right Column - Products List/Grid */}
          <View style={styles.productsGrid}>
            {products.map((item) => (
              <ProductList
              key={item._id}
              _id={item._id}
              title={item.title}
              images={item.images ? item.images.map((img: string) => getProductImageUrl(img)) : []}
              price={item.price}
              discountPrice={item.discountPrice}
              stock={item.stock}
            />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#f7fff9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  allProductsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    paddingLeft: 15,
    paddingTop: 10,
  },
  mainLayout: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10
},
sidebarColumn: {
    width: 80,
    backgroundColor: '#fffff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginRight: 8,
},
productsGrid: {
    flex: 1, 
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    paddingLeft: 8,
},

});
