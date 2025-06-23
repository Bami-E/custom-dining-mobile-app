import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

// Mock Data - Replace with actual data from an API or AsyncStorage
const MOCK_MEALS = [
  {
    id: '1',
    name: 'Tofu Bowl',
    restaurant: 'from Green chef, Lagos',
    image: require('../assets/meals/Tofu Rice.png'),
    tags: ['Low-Carb', 'Sugar-free'],
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    id: '2',
    name: 'Chicken Salad',
    restaurant: 'from Herbivore kitchen, Lagos',
    image: require('../assets/meals/Avocado Veggie Bowl.png'),
    tags: ['Low-Carb', 'Plant-Based'],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '3',
    name: 'Okra soup & wheat',
    restaurant: 'from Dammy\'s kitchen, Lagos',
    image: require('../assets/meals/Ofada Rice and Sauce.png'),
    tags: ['Low-Carb', 'Diabetic-Friendly'],
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: '4',
    name: 'Basmati Jollof Rice',
    restaurant: 'from Addys Health Kitchen, Lagos',
    image: require('../assets/meals/Basmati Jollof Rice.png'),
    tags: ['Healthy', 'Spicy'],
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
];

const FILTER_OPTIONS = [
    { label: 'Past 7 days', value: '7' },
    { label: 'Past 30 days', value: '30' },
    { label: 'All time', value: 'all' },
];

export default function MealHistoryScreen() {
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState('7');

    const getFilteredMeals = () => {
        if (selectedFilter === 'all') {
            return MOCK_MEALS;
        }
        const days = parseInt(selectedFilter, 10);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return MOCK_MEALS.filter(meal => meal.date >= cutoffDate);
    };

    const filteredMeals = getFilteredMeals();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meal History</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Filter Dropdown */}
            <View style={styles.filterContainer}>
                <Picker
                    selectedValue={selectedFilter}
                    onValueChange={(itemValue) => setSelectedFilter(itemValue)}
                    style={styles.picker}
                >
                    {FILTER_OPTIONS.map(option => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredMeals.length > 0 ? (
                    filteredMeals.map(meal => (
                        <View key={meal.id} style={styles.mealCard}>
                            <Image source={meal.image} style={styles.mealImage} />
                            <View style={styles.mealDetails}>
                                <Text style={styles.mealName}>{meal.name}</Text>
                                <Text style={styles.mealRestaurant}>{meal.restaurant}</Text>
                                <View style={styles.tagsContainer}>
                                    {meal.tags.map(tag => (
                                        <View key={tag} style={styles.tag}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <TouchableOpacity style={styles.reorderButton}>
                                <Text style={styles.reorderButtonText}>Reorder</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>You haven't logged any meals yet.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: 'white',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
    },
    filterContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    picker: {
        height: 50,
    },
    scrollContent: {
        padding: 16,
    },
    mealCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    mealImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    mealDetails: {
        flex: 1,
        marginLeft: 12,
    },
    mealName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    mealRestaurant: {
        fontSize: 14,
        color: '#777',
        marginVertical: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    tag: {
        backgroundColor: '#E6F4EA',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        color: '#3A7752',
        fontSize: 12,
        fontWeight: '500',
    },
    reorderButton: {
        borderWidth: 1,
        borderColor: '#3A7752',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 8,
    },
    reorderButtonText: {
        color: '#3A7752',
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
}); 