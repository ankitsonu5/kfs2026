import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { BASE_URL } from '@/constants/api';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

interface ProductType {
  _id: string;
  title: string;
  price: number;
  discountPrice: number;
  description?: string;
  images: string[];
  stock: number;
  category?: any;
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Single Product
      const res = await fetch(`${BASE_URL}/products/${id}`);
      const data = await res.json();

      if (data.success && data.product) {
        setProduct(data.product);
      } else if (data.product) {
        setProduct(data.product);
      } else {
        setProduct(data);
      }

      // 2. Fetch Related Products
      try {
        const relRes = await fetch(`${BASE_URL}/products/related/${id}`);
        const relData = await relRes.json();
        if (relData.success && relData.products) {
          setRelatedProducts(relData.products);
        }
      } catch {
        // Optional: Ignore related products error
      }
    } catch (error) {
      console.error('Error loading product details:', error);
      Alert.alert('Error', 'Product details load nahi ho paaye.');
    } finally {
      setLoading(false);
    }
  };

  const getProductImageUrl = (imageName: string) => {
    if (!imageName) {
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600';
    }
    if (imageName.startsWith('http')) {
      return imageName;
    }
    return `${BASE_URL}/uploads/products/${imageName}`;
  };

  const calculateDiscount = (sellingPrice: number, mrp: number) => {
    if (!mrp || mrp <= sellingPrice) return null;
    const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
    return `${discount}% OFF`;
  };

  const handleIncreaseQty = () => {
    if (product && quantity < (product.stock || 10)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    Alert.alert('Success', `${quantity}x ${product?.title} cart me add ho gaya!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push('/(tabs)/cart');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a63e" />
        <Text style={styles.loadingText}>Product details load ho rahi hai...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color="#ff4d4f" />
        <Text style={styles.errorText}>Product nahi mila!</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Wapas Jayein</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imagesList =
    product.images && product.images.length > 0
      ? product.images.map((img) => getProductImageUrl(img))
      : ['https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600'];

  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const isOutOfStock = product.stock === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Custom Navigation Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.iconCircleBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Product Details
        </Text>
        <View style={styles.headerRightBtns}>
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => setIsWishlisted(!isWishlisted)}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={isWishlisted ? '#e11d48' : '#1f2937'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={imagesList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.imageSlide}>
                <Image source={{ uri: item }} style={styles.productMainImage} />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />

          {/* Dots Indicator */}
          {imagesList.length > 1 && (
            <View style={styles.dotsContainer}>
              {imagesList.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    activeImageIndex === idx ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Discount Badge */}
          {discountPercent && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{discountPercent}</Text>
            </View>
          )}
        </View>

        {/* Product Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>{product.title}</Text>

          {/* Price & MRP */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.discountPrice > product.price && (
              <Text style={styles.mrp}>₹{product.discountPrice}</Text>
            )}
            {discountPercent && (
              <View style={styles.saveTag}>
                <Text style={styles.saveTagText}>Save ₹{product.discountPrice - product.price}</Text>
              </View>
            )}
          </View>

          {/* Stock Status */}
          <View style={styles.stockRow}>
            <View
              style={[
                styles.stockBadge,
                { backgroundColor: isOutOfStock ? '#fee2e2' : '#dcfce7' },
              ]}
            >
              <Text
                style={[
                  styles.stockBadgeText,
                  { color: isOutOfStock ? '#ef4444' : '#15803d' },
                ]}
              >
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
              </Text>
            </View>
            {!isOutOfStock && product.stock <= 5 && (
              <Text style={styles.hurryText}>Hurry, only {product.stock} left!</Text>
            )}
          </View>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionLabel}>Quantity</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[styles.qtyBtn, quantity === 1 && styles.qtyBtnDisabled]}
                  onPress={handleDecreaseQty}
                  disabled={quantity === 1}
                >
                  <Feather name="minus" size={16} color={quantity === 1 ? '#9ca3af' : '#111827'} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    quantity >= (product.stock || 10) && styles.qtyBtnDisabled,
                  ]}
                  onPress={handleIncreaseQty}
                  disabled={quantity >= (product.stock || 10)}
                >
                  <Feather
                    name="plus"
                    size={16}
                    color={quantity >= (product.stock || 10) ? '#9ca3af' : '#111827'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Trust Badges */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <MaterialIcons name="verified" size={20} color="#00a63e" />
              <Text style={styles.featureText}>100% Genuine</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="local-shipping" size={20} color="#00a63e" />
              <Text style={styles.featureText}>Fast Delivery</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="payments" size={20} color="#00a63e" />
              <Text style={styles.featureText}>COD Available</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.descriptionText}>
              {product.description ||
                'KFS Store delivers high-quality farm-fresh produce and daily grocery items directly to your doorstep.'}
            </Text>
          </View>
        </View>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedList}>
              {relatedProducts.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.relatedCard}
                  onPress={() =>
                    router.push({
                      pathname: '/product/[id]',
                      params: { id: item._id },
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        item.images && item.images.length > 0
                          ? getProductImageUrl(item.images[0])
                          : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300',
                    }}
                    style={styles.relatedImage}
                  />
                  <Text style={styles.relatedName} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.relatedPrice}>₹{item.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.cartBtn, isOutOfStock && styles.disabledBtn]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <Ionicons name="cart-outline" size={20} color="#00a63e" />
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buyBtn, isOutOfStock && styles.disabledBtn]}
          onPress={handleBuyNow}
          disabled={isOutOfStock}
        >
          <Text style={styles.buyBtnText}>{isOutOfStock ? 'Out of Stock' : 'Buy Now'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 10,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#00a63e',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRightBtns: {
    flexDirection: 'row',
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  carouselContainer: {
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  imageSlide: {
    width: width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  productMainImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    width: '100%',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#00a63e',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#cbd5e1',
  },
  discountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00a63e',
    marginRight: 8,
  },
  mrp: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  saveTag: {
    backgroundColor: '#e6f7ec',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveTagText: {
    fontSize: 12,
    color: '#00a63e',
    fontWeight: '600',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  hurryText: {
    fontSize: 12,
    color: '#ea580c',
    fontWeight: '600',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    backgroundColor: '#f3f4f6',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0fdf4',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
    marginTop: 4,
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    marginTop: 6,
  },
  relatedSection: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  relatedTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  relatedList: {
    flexDirection: 'row',
  },
  relatedCard: {
    width: 130,
    marginRight: 12,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  relatedImage: {
    width: '100%',
    height: 90,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  relatedName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    height: 32,
  },
  relatedPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00a63e',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#00a63e',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  cartBtnText: {
    color: '#00a63e',
    fontWeight: '700',
    fontSize: 14,
  },
  buyBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00a63e',
    borderRadius: 10,
    paddingVertical: 12,
  },
  buyBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  disabledBtn: {
    backgroundColor: '#e5e7eb',
    borderColor: '#e5e7eb',
  },
});
