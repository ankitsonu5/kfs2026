import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import Header from '@/components/Header';
import SearchBox from '@/components/SearchBox';
import Categories from '@/components/Categories';
import { Link, useRouter } from "expo-router";
import { BASE_URL } from '@/constants/api';

export default function CategoriesScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const catRes = await fetch(`${BASE_URL}/categories`);
        const catData = await catRes.json();
        if (Array.isArray(catData)) {
          setCategories(catData);
        } else if (catData.success && catData.categories) {
          setCategories(catData.categories);
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
      <View>
        <ActivityIndicator/>
        <Text>KFS Store Categories loading...</Text>
      </View>
    );
  }

  const getCategoryImageUrl = (imageName: string) => {
    if (!imageName) return 'https://cdn-icons-png.flaticon.com/128/5029/5029088.png';
    
    if (imageName.startsWith('http'))
      return imageName;
      return `${BASE_URL}/uploads/categores/${imageName}`;
  };

  return(
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Header />
          <SearchBox />
          
          <View>
            <Text style={styles.allCategoriesText}>All Categories</Text>
          </View>

           {/* Category Grid */}
          <View style={styles.categoriesGrid}>
            {categories.map((item) => (
              <Categories 
              key={item._id}
              name={item.name}
              image={getCategoryImageUrl(item.image)}
              onPress={() => router.push(`/products?category=${item._id}`)}
              />
            ))}
          </View>
          

        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#f7fff9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  categoriesGrid : {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 15,
  },
  allCategoriesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 15,
    paddingTop: 10,
  },
});