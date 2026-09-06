import React,{ useState }  from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, Image, ScrollView, TouchableOpacity, Alert,
    ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Link, useRouter  } from 'expo-router';
import { BASE_URL } from '@/constants/api';

export default function Signup() {
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async () => {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName: name.trim(), email: email.trim(), password: password, confirmPassword: confirmPassword,}),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', data.message || 'Account created successfully!', [{
                    text: 'OK',
                    onPress: () => router.replace('/login'),
                },
            ]);
            } else {
                Alert.alert('Signup Failed', data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            Alert.alert('Error', 'Server not connected. Please check backend and IP address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
            <Image source={require('@/assets/images/kfslogo.webp')} style={{ width: 200, height: 80, resizeMode: "contain" }} />
        </View>

        <Text style={styles.heading}>Create Your Account</Text>

        <Input label='Full Name' placeholder='Enter your name' value={name} onChangeText={setName} />

        <Input label='Email Address' placeholder='Enter your email' value={email} onChangeText={setEmail} keyboardType="email-address" />
        
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Input label='Create Password' placeholder='Enter your password' value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
        </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Input label='Confirm Password' placeholder='Confirm your password' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword}/>
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color='#999' />
        </TouchableOpacity>
        </View>

        <View style={{alignItems: 'center',  marginTop: 10}}>
            {loading ? (
                <ActivityIndicator size="large" color="#00a63e"/>
            ) : (
            <Button title='Sign Up' onPress={handleSignUp} />
            )}
        
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
            <Text style={{color: '#444'}}>Already have an account? {' '}</Text>
            <Link href="/login" asChild>
                <TouchableOpacity>
                <Text style={{color: '#00a63e', fontWeight: '600'}}>Login</Text>
                </TouchableOpacity>
            </Link>
        </View>
        </ScrollView>
        </SafeAreaView>
    );
}   

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight: 0
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

    heading: {
        fontSize: 26,
        fontWeight: "700",
        color: '#111',
        marginTop: 20,
        alignSelf: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 40,
        top: 53,
    }
});