import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, } from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface SidebarItemsProps {
    name: string;
    image?: string;
    isSelected?: boolean;
    onPress?: () => void;
}

export default function Sidebar({ name, image, isSelected, onPress }: SidebarItemsProps) {
    return (

        <TouchableOpacity style={[styles.categoryItem, isSelected && styles.selectedItem]} onPress={onPress}>
            {image ? (
                <Image source={{ uri: image }} style={styles.categoryIcon} resizeMode='contain' />
            ) : (
                <Ionicons name="grid-outline" size={22} color={isSelected ? '#00a63e' : '#666'} />
            )}

            <Text style={[styles.categoryText, isSelected && styles.selectedText]} numberOfLines={1}>
                {name}
            </Text>
        </TouchableOpacity>

    );
}


const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderRadius: 8,
        marginVertical: 4,
        backgroundColor: '#ffffff',
    },
    selectedItem: {
        backgroundColor: '#e8f7ee',
        borderLeftWidth: 3,
        borderLeftColor: '#00a63e',
    },
    categoryIcon: {
        width: 26,
        height: 26,
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '600',
        color: "#444",
        textAlign: 'center',
    },
    selectedText: {
        color: '#00a63e',
        fontWeight: 'bold',
    },
});
