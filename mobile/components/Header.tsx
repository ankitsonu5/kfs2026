import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Header() {

    return (
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Image source={require('@/assets/images/kfslogo.webp')} style={{ width: 150, height: 50, resizeMode: 'contain'}} />
                    </View>

                    <TouchableOpacity style={styles.cartButton} onPress={() => router.push("/(tabs)/profile")}>
                        <Ionicons name='person-circle' size={26} color='white' />
                    </TouchableOpacity>
                </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#00a63e',
        paddingTop: 20,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    logo: {
        width: 200
    },
    cartButton: {
        position: 'relative',
        padding: 5
    },
    
})