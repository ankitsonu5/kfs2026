import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default'| 'email-address' | 'numeric';
}

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default'}: InputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TextInput placeholder={placeholder} style={styles.input} value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} keyboardType={keyboardType} autoCapitalize='none' placeholderTextColor='#888' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 15,
        marginTop: 15,
    },
    label: {
        fontWeight: "600",
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
        },
    input: {
        borderWidth: 1, 
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12, 
        fontSize: 15,
        backgroundColor: '#fafafa',
    }
});