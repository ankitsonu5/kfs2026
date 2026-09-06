import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function SearchBox() {
    return (
        <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.searchButton}>
                <Ionicons name='search-outline' size={20} color="#687876" style={styles.searchIcon} />
                <TextInput placeholder='Search groceries, rice, dry fruits...' placeholderTextColor="#888" style={styles.searchInput} ></TextInput>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginTop: -18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#333333"
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    }
})