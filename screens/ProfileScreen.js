import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { axiosInst } from "../service/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const storedId = await AsyncStorage.getItem("id");
        // Если токен или id отсутствуют, перенаправляем на экран входа
        if (!token || !storedId) {
          navigation.navigate("Login");
          return;
        }
        // Запрос на получение профиля
        const res = await axiosInst.get(`/user/${storedId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.log("Ошибка получения профиля:", error);
        Alert.alert("Ошибка", "Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C2BD9" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Профиль не найден</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Профиль</Text>
        <View style={styles.profileCard}>
          <Text style={styles.label}>Имя:</Text>
          <Text style={styles.value}>{profile.firstName}</Text>
        </View>
        <View style={styles.profileCard}>
          <Text style={styles.label}>Фамилия:</Text>
          <Text style={styles.value}>{profile.lastName}</Text>
        </View>
        <View style={styles.profileCard}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>
        <View style={styles.profileCard}>
          <Text style={styles.label}>Телефон:</Text>
          <Text style={styles.value}>{profile.mobile}</Text>
        </View>
        <View style={styles.profileCard}>
          <Text style={styles.label}>Возраст:</Text>
          <Text style={styles.value}>{profile.age}</Text>
        </View>
        <View style={styles.profileCard}>
          <Text style={styles.label}>Пол:</Text>
          <Text style={styles.value}>{profile.gender}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { profile })}
        >
          <Text style={styles.editButtonText}>Редактировать профиль</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#6C2BD9",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
