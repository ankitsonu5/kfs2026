import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import SearchBox from "@/components/SearchBox";
import ProductList from "@/components/ProductList";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/constants/api";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  // 2. Fetch Data from Backend
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Products Fetch
        const prodRes = await fetch(`${BASE_URL}/products`);
        const prodData = await prodRes.json();
        if (prodData.success && prodData.products) {
          setProducts(prodData.products);
        } else if (Array.isArray(prodData)) {
          setProducts(prodData);
        }

        // Categories Fetch
        const catRes = await fetch(`${BASE_URL}/categories`);
        const catData = await catRes.json();
        if (Array.isArray(catData)) {
          setCategories(catData);
        } else if (catData.success && catData.categories) {
          setCategories(catData.categories);
        }

        // Banners Fetch
        const bannerRes = await fetch(`${BASE_URL}/banners/active`);
        const bannerData = await bannerRes.json();
        if (Array.isArray(bannerData)) {
          setBanners(bannerData);
        } else if (bannerData.success && bannerData.banners) {
          setBanners(bannerData.banners);
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a63e" />
        <Text style={styles.loadingText}>KFS Store Load Ho Raha Hai...</Text>
      </View>
    );
  }

  const getBannerImageUrl = (imageName: string) => {
    if (!imageName)
      return "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200";

    if (imageName.startsWith("http")) return imageName;

    return `${BASE_URL}/uploads/banners/${imageName}`;
  };

  const getCategoryImageUrl = (imageName: string) => {
    if (!imageName)
      return "https://cdn-icons-png.flaticon.com/128/5029/5029088.png";
    if (imageName.startsWith("http")) return imageName;
    return `${BASE_URL}/uploads/categories/${imageName}`;
  };

  const getProductImageUrl = (imageName: string) => {
    if (!imageName)
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200";
    if (imageName.startsWith("http")) return imageName;
    return `${BASE_URL}/uploads/products/${imageName}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Header />

        {/* Search Bar */}
        <SearchBox />

        {/* Banners Carousel */}
        {banners.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerContainer}>
            {banners.map((item) => (
              <Image
                key={item._id}
                source={{ uri: getBannerImageUrl(item.image) }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : null}

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Categories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}>
          {categories.map((item) => (
            <TouchableOpacity key={item._id} style={styles.categoryCard}>
              <View style={styles.categoryIconContainer}>
                <Image
                  source={{ uri: getCategoryImageUrl(item.image) }}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Top Selling Products Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          <TouchableOpacity
            onPress={() => router.push("/products")}
            style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={18} color="#00a63e" />
          </TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {products
            .filter((item) => item.isTopSellingProducts === true)
            .slice(0, 6)
            .map((item) => (
              <ProductList
                key={item._id}
                _id={item._id}
                title={item.title}
                images={
                  item.images
                    ? item.images.map((img: string) => getProductImageUrl(img))
                    : []
                }
                price={item.price}
                discountPrice={item.discountPrice}
                stock={item.stock}
              />
            ))}
        </View>

        {/* Deals of the Day Products Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Deals of the Day</Text>
          <TouchableOpacity
          onPress={() => router.push('/products')}
          style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={18} color="#00a63e" />
          </TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {products
          .filter((item) => item.isDealsOfDay === true)
          .slice(0, 6)
          .map((item) => (
            <ProductList
            key={item._id}
            _id={item._id}
            title={item.title}
            images={
              item.images ?
               item.images.map((img: string) =>
                 getProductImageUrl(img))
                : []
              }
            price={item.price}
            discountPrice={item.discountPrice}
            stock={item.stock}
            />
          ))}
        </View>

        {/* Rice Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rice</Text>
            <TouchableOpacity onPress={() => router.push('/products')} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={18} color="#00a63e" />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.filter((item) => item.isRice === true)
            .slice(0, 6)
            .map((item) => (
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

          {/* Atta & Flour Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atta & Flour</Text>
            <TouchableOpacity onPress={() => router.push('/products')} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={18} color="#00a63e" />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.filter((item) => item.isAttaAndFlour === true)
            .slice(0, 6)
            .map((item) => (
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

          {/* Dry Fruites Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dry Fruits</Text>
            <TouchableOpacity onPress={() => router.push('/products')} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={18} color="#00a63e" />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.filter((item) => item.isDryFruites === true)
            .slice(0, 6)
            .map((item) => (
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

          {/* Dal & Pulses Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dal & Pulses</Text>
            <TouchableOpacity onPress={() => router.push('/products')} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={18} color="#00a63e" />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.filter((item) => item.isDalAndPulses === true)
            .slice(0, 6)
            .map((item) => (
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

          {/* Masala Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Masala</Text>
            <TouchableOpacity onPress={() => router.push('/products')} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={18} color="#00a63e" />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.filter((item) => item.isMasala === true)
            .slice(0, 6)
            .map((item) => (
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

          {/* Namkeen & Snacks Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Namkeen & Snacks</Text>
            <TouchableOpacity onPress={() => router.push('/products')} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={18} color="#00a63e" />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.filter((item) => item.isNamkeenAndSnacks === true)
            .slice(0, 6)
            .map((item) => (
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

      </ScrollView>
    </SafeAreaView>
  );
}

const { width: screenwidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  bannerContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: screenwidth - 40, // adjust on real device if needed
    height: 150,
    borderRadius: 12,
    marginRight: 35,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 20,
    width: 75,
  },
  categoryIconContainer: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 35,
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444444",
    marginTop: 8,
    textAlign: "center",
  },
  viewAllButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  viewAllText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  productCard: {
    backgroundColor: "#ffffff",
    width: "48%", // 2 card layout
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 110,
    resizeMode: "contain",
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    height: 40, // fix height for uniform grid
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  sellPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00a63e",
  },
  mrpPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#888888",
    marginLeft: 6,
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#00a63e",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
  },
  addButtonText: {
    color: "#00a63e",
    fontWeight: "bold",
    fontSize: 13,
  },
  outOfStockButton: {
    backgroundColor: "#eeeeee",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
  },
  outOfStockText: {
    color: "#999999",
    fontWeight: "bold",
    fontSize: 11,
  },
});
