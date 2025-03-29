import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { axiosInst } from "../service/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Функция для форматирования времени (часы:минуты)
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month} ${hours}:${minutes}`;
};

// Функция для форматирования даты (ГГГГ-ММ-ДД)
const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // При монтировании компонента получаем токен и id текущего пользователя,
  // затем загружаем бронирования с бэкенда
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        const storedId = await AsyncStorage.getItem("userId");
        if (!token) {
          // Если токена нет, перенаправляем на экран логина
          navigation.navigate("Login");
          return;
        }
        // Получаем бронирования пользователя
        const res = await axiosInst.get(`/bookings/getbookings/${storedId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
      } catch (error) {
        console.log("Error fetching bookings:", error);
        Alert.alert("Ошибка", "Не удалось загрузить бронирования");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigation]);

  // Функция для "скачивания" билета. Здесь можно интегрировать генерацию PDF или печать.
  const downloadTicket = async (bookingId) => {
    try {
      // Пример вызова бэкенда для получения деталей бронирования,
      // после чего можно сгенерировать PDF (например, используя expo-print).
      // Здесь просто выводим Alert.
      Alert.alert("Скачать билет", `Билет с ID ${bookingId} будет загружен`);
    } catch (error) {
      console.log("Error downloading ticket:", error);
      Alert.alert("Ошибка", "Не удалось скачать билет");
    }
  };

  // Рендер одной карточки бронирования
  const renderItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.busNo}>Автобус: {item.busNo}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Откуда:</Text>
        <Text style={styles.infoValue}>
          {item.from} ({formatDateTime(item.startTime)})
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Куда:</Text>
        <Text style={styles.infoValue}>
          {item.to} ({formatDateTime(item.endTime)})
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Дата бронирования:</Text>
        <Text style={styles.infoValue}>{formatDate(item.bookingDateTime)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Тариф:</Text>
        <Text style={styles.infoValue}>{item.totalFare} KZT</Text>
      </View>
      <TouchableOpacity
        style={styles.downloadBtn}
        onPress={() => downloadTicket(item.id)}
      >
        <Text style={styles.downloadBtnText}>Скачать билет</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C2BD9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Мои бронирования</Text>
        {bookings.length === 0 ? (
          <Text style={styles.noBookingsText}>Нет бронирований</Text>
        ) : (
          <FlatList
            data={bookings.slice().reverse()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  noBookingsText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    // Тень для iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    // Тень для Android
    elevation: 3,
  },
  busNo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#6C2BD9",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
  },
  infoValue: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  downloadBtn: {
    backgroundColor: "#6C2BD9",
    borderRadius: 28,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 15,
  },
  downloadBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyBookingsScreen;
