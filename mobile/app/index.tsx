import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/(tabs)');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/kfslogo.webp')}
                style={styles.logo}
            />
            <Text style={styles.title}>KFS 24x7</Text>
            <Text style={styles.subtitle}>Kripa Family Store</Text>

            <ActivityIndicator size="large" color="#0a7ea4" style={styles.loader} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00a63e",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#11181c',
        marginTop: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#687876',
        marginTop: 2,
        fontWeight: '500',
    },
    loader: {
        marginTop: 5,
    },
});