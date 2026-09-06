import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

interface ProductListProps {
    _id: string;
    title: string;
    images: string[];
    price: number;
    discountPrice: number;
    stock: number;
} 

export default function ProductList({ _id, title, images, price, discountPrice, stock}: ProductListProps) {
    const router = useRouter();
    const { addToCart } = useCart();

    const displayImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200';

    const handlePress = () => {
        if (_id) {
            router.push(`/product/${_id}`);
        }
    };

    const handleAddToCart = () => {
        addToCart({ _id, title, images, price, discountPrice, stock}, 1);
        Alert.alert('Success', `${title} added to cart!`);
    };

    return (
        <TouchableOpacity style={styles.container}
        activeOpacity={0.8}
        onPress={handlePress}>
            <Image 
                source={{ uri:displayImage }}
                style={styles.productImage}/>

            
            <Text style={styles.productTitle} numberOfLines={2}>{title}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.sellPrice}>₹{price}</Text>
                {discountPrice > price && (
                    <Text style={styles.mrpPrice}>₹{discountPrice}</Text>
                )}
            </View>
            {stock === 0 ? (
                <TouchableOpacity style={styles.outOfStockButton} disabled>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                </TouchableOpacity>
            ) : (
            <TouchableOpacity style={styles.addToCartButton}
            onPress={(e) => {
                e.stopPropagation();
                handleAddToCart();
            }}>
                <Text style={styles.addToButtonText}>Add to Cart</Text> 
            </TouchableOpacity>
            )}
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        width: '48%',
        borderRadius: 12,
        padding: 12,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 110,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        height: 40,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 10,
        fontSize: 14,
    },
    sellPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00a63e',
        marginLeft: 12,
    },
    mrpPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: '#888888',
        marginLeft: 6,
    },
    outOfStockButton: {
        backgroundColor: "#eeeeee",
        borderRadius: 6,
        paddingVertical: 6,
        alignItems: 'center',
        marginTop: 20,
    },
    outOfStockText: {
        color: '#999999',
        fontWeight: 'bold',
        fontSize: 11,
    },
    addToCartButton: {
        backgroundColor: "#f2f4f6",
        borderRadius: 10,
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
        borderColor: '#00a63e',
        borderWidth: 1,
    },
    addToButtonText: {
        color: '#00a63e',
        fontSize: 14,
        fontWeight: 'bold',
    }
});