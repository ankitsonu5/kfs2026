import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';

export default function Cart() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSavings,
  } = useCart();

  const totalAmount = getCartTotal();
  const savings = getCartSavings();
  const deliveryCharge = totalAmount > 499 || totalAmount === 0 ? 0 : 40;
  const finalPayable = totalAmount + deliveryCharge;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={90} color="#cbd5e1" style={styles.emptyCartIcon} />
            <Text style={styles.emptyCartText}>Your Cart is Empty!</Text>
            <Text style={styles.emptyCartSub}>Add items that you want to buy</Text>
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => router.push('/products')}
            >
              <Text style={styles.shopNowBtnText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container}>
            {/* Header Title with Clear Button */}
            <View style={styles.cartHeaderRow}>
              <Text style={styles.cartTitle}>My Cart ({cartItems.length} items)</Text>
              <TouchableOpacity onPress={clearCart}>
                <Text style={styles.clearCartText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <View key={item._id} style={styles.cartItemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    {item.discountPrice > item.price && (
                      <Text style={styles.itemMrp}>₹{item.discountPrice}</Text>
                    )}
                  </View>

                  {/* Quantity Controller & Delete */}
                  <View style={styles.cardActionsRow}>
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <Feather name="minus" size={14} color="#333" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Feather name="plus" size={14} color="#333" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removeFromCart(item._id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Bill Summary */}
            <View style={styles.billCard}>
              <Text style={styles.billTitle}>Bill Details</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Total</Text>
                <Text style={styles.billValue}>₹{totalAmount}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Partner Fee</Text>
                <Text style={styles.billValue}>
                  {deliveryCharge === 0 ? (
                    <Text style={{ color: '#00a63e', fontWeight: 'bold' }}>FREE</Text>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </Text>
              </View>
              {savings > 0 && (
                <View style={styles.billRow}>
                  <Text style={styles.savingsLabel}>Total Discount Savings</Text>
                  <Text style={styles.savingsValue}>- ₹{savings}</Text>
                </View>
              )}
              <View style={[styles.billRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>To Pay</Text>
                <Text style={styles.totalValue}>₹{finalPayable}</Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => Alert.alert('Checkout', `Total Payable: ₹${finalPayable}`)}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout • ₹{finalPayable}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    padding: 16,
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  emptyCartIcon: {
    marginBottom: 15,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  emptyCartSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },
  shopNowBtn: {
    backgroundColor: '#00a63e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shopNowBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  clearCartText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00a63e',
    marginRight: 6,
  },
  itemMrp: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    padding: 2,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    paddingHorizontal: 10,
  },
  deleteBtn: {
    padding: 6,
  },
  billCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  savingsLabel: {
    fontSize: 14,
    color: '#00a63e',
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00a63e',
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00a63e',
  },
  checkoutBtn: {
    backgroundColor: '#00a63e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
