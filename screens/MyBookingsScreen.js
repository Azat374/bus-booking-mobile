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
  Image,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { axiosInst } from "../service/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Feather';
import QRCode from 'qrcode';
import {autoTable} from'jspdf-autotable';
import jsPDF from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import RNHTMLtoPDF from 'react-native-html-to-pdf';



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

    const [menuVisible, setMenuVisible] = useState(false);
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

  // Функция для "скачивания" билета. Здесь можно интегрировать генерацию PDF или печать

const downloadTicket = async (booking) => {
  try {
    const qrValue = `Booking ID: ${ticket.id}\nBus: ${ticket.busNo}\nFrom: ${ticket.from} at ${ticket.startTime}\nTo: ${ticket.to} at ${ticket.endTime}`;

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #51259B; text-align: center; }
              .qr { text-align: center; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
            </style>
          </head>
          <body>
            <h1>Dimash Bus Ticket</h1>
            <p><strong>Bus:</strong> ${ticket.busNo}</p>
            <p><strong>Route:</strong> ${ticket.from} → ${ticket.to}</p>
            <p><strong>Date:</strong> ${ticket.date}</p>
            <p><strong>Time:</strong> ${ticket.startTime} - ${ticket.endTime}</p>
            <p><strong>Seats:</strong> ${ticket.selectedSeats.join(', ')}</p>
            <p><strong>Total:</strong> ${ticket.selectedSeats.length * ticket.price} KZT</p>
            <div class="qr">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrValue)}" />
            </div>
            <h3>Terms and Conditions</h3>
            <ul>
              <li>Arrive 30 minutes before departure.</li>
              <li>No refunds after booking.</li>
              <li>Keep your belongings safe.</li>
            </ul>
          </body>
        </html>
      `;

      const file = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `ticket_${ticket.id}`,
        base64: false,
      });

      if (file.filePath) {
        await Sharing.shareAsync(file.filePath);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Ошибка', 'Не удалось сгенерировать билет.');
    }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};

const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString();
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
         <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 10,
          }}>
            <Image
              source={require('../assets/logo.png')}
              style={{ width: 160, height: 60, resizeMode: 'contain' }}
            />
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Icon name="menu" size={50} color="#6B21A8" />
            </TouchableOpacity>
          </View>
    
          <Modal
            isVisible={menuVisible}
            onBackdropPress={() => setMenuVisible(false)}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            backdropOpacity={0.3}
            style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'flex-end' }}
          >
            <View style={{
              width: 250,
              height: '100%',
              backgroundColor: '#fff',
              paddingTop: 60,
              paddingHorizontal: 20,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: -4, height: 0 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <TouchableOpacity
                onPress={() => { setMenuVisible(false); navigation.navigate("Profile"); }}
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ fontSize: 18, color: '#111' }}>👤 Профиль</Text>
              </TouchableOpacity>
    
              <TouchableOpacity
                onPress={() => { setMenuVisible(false); navigation.navigate("MyBookings"); }}
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ fontSize: 18, color: '#111' }}>🎟 Менің билеттерім</Text>
              </TouchableOpacity>
    
              <TouchableOpacity
                onPress={() => setMenuVisible(false)}
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ fontSize: 18, color: 'red' }}>❌ Жабу</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
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
