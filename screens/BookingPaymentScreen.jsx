import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { axiosInst } from "../service/axiosInstance"; // ваш axios-инстанс
import logo from "../assets/logo.png";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Данные, полученные с предыдущего экрана
  const {
    busId,
    userId,
    selectedSeats = [],
    passengerDetails = [], 
    price = 600,
    busNo = "AB123",
  } = route.params || {};

  // Состояния
  const totalAmount = selectedSeats.length * price;
  const [menuVisible, setMenuVisible] = useState(false);
  const [step, setStep] = useState("SUMMARY");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);

  // -----------------------
  // 1) Создаём сессию Stripe
  // -----------------------
  const handleProceedToPayment = async () => {
    setLoadingPayment(true);
    try {
      const token = await AsyncStorage.getItem("jwtToken"); // Если нужно
      // Параметры для /payment/stripe
      const payload = {
        busId,
        userId,
        amount: totalAmount,
        seatNos: selectedSeats,
      };

      const resp = await axiosInst.post("/payment/stripe", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.data?.checkoutUrl) {
        setCheckoutUrl(resp.data.checkoutUrl);
        setStep("PAYMENT"); // Переходим на этап платежа (WebView)
      } else {
        Alert.alert("Ошибка", "Не удалось создать платежную сессию");
      }
    } catch (error) {
      console.error("Ошибка handleProceedToPayment:", error);
      Alert.alert("Ошибка", "Платеж не инициализирован");
    }
    setLoadingPayment(false);
  };

  // -----------------------------------------
  // 2) Отслеживаем переход на successUrl/cancelUrl
  // -----------------------------------------
  const handleNavChange = async (navState) => {
    const { url } = navState;
    if (url.includes("payment-success")) {
      // 2.1) Если в URL присутствует "payment-success", значит Stripe вернул пользователя
      //      на successUrl. Можно вызывать confirmStripeBooking().
      Alert.alert("Успех", "Платеж прошёл, сохраняем бронь в базе...");
      await confirmStripeBooking();
    } else if (url.includes("payment-cancel")) {
      // 2.2) Оплата отменена
      Alert.alert("Отмена", "Оплата отменена");
      setStep("SUMMARY");
    }
  };

  // ------------------------
  // 3) Сохраняем бронь на бэкенде
  // ------------------------
  const confirmStripeBooking = async () => {
    try {
      const token = await AsyncStorage.getItem("jwtToken");
      // Формируем BookingsDto
      const seatPassengerList = passengerDetails.map((p) => ({
        seatNo: p.seatNumber,
        passenger: {
          firstName: p.firstName,
          lastName: p.lastName,
          gender: p.gender,
          age: p.age,
        },
      }));
      const bookingsDto = {
        busId,
        userId,
        fare: totalAmount,
        seatPassengerList,
        // paymentId - можете добавить, если нужно
      };

      // Запрос на /payment/stripe-verify
      const resp = await axiosInst.post("/payment/stripe-verify", bookingsDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.data.success) {
        Alert.alert("Успешно", "Бронь сохранена! ID: " + resp.data.id);
        navigation.navigate("MyBookings");
      } else {
        Alert.alert("Ошибка", resp.data.message || "Бронь не сохранена");
        // Можно вернуть на "SUMMARY", если нужно
        setStep("SUMMARY");
      }
    } catch (error) {
      console.error("Ошибка confirmStripeBooking:", error);
      Alert.alert("Ошибка", "Не удалось сохранить бронь");
      setStep("SUMMARY");
    }
  };

  // ----------------------------------
  // Рендер экрана "Сводка бронирования"
  // ----------------------------------
  const renderSummary = () => (
    <View style={styles.summarySection}>
      <Text style={styles.sectionTitle}>Сводка бронирования</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Автобус:</Text>
          <Text style={styles.value}>{busNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Места:</Text>
          <Text style={styles.value}>{selectedSeats.join(", ")}</Text>
        </View>
        <View style={[styles.row, { marginTop: 20 }]}>
          <Text style={[styles.label, styles.totalLabel]}>Итого:</Text>
          <Text style={styles.totalValue}>{totalAmount} KZT</Text>
        </View>
        <Text style={styles.perSeat}>Цена за место: {price} KZT</Text>
      </View>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleProceedToPayment}
        disabled={loadingPayment}
      >
        {loadingPayment
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.continueBtnText}>Перейти к оплате</Text>
        }
      </TouchableOpacity>
    </View>
  );

  // ------------------
  // Рендер экрана оплаты
  // ------------------
  const renderPayment = () => (
    <View style={styles.paymentSection}>
      <Text style={styles.sectionTitle}>Оплата</Text>
      <View style={styles.paymentCard}>
        <Text style={styles.paymentLabel}>К оплате:</Text>
        <Text style={styles.paymentAmount}>{totalAmount} KZT</Text>
        <Text style={styles.paymentNote}>
          Пожалуйста, завершите оплату через Stripe Checkout.
        </Text>
      </View>

      {checkoutUrl ? (
        <WebView
          source={{ uri: checkoutUrl }}
          startInLoadingState
          style={styles.webView}
          onNavigationStateChange={handleNavChange}
          // onMessage не нужен, так как мы используем onNavigationStateChange
        />
      ) : (
        <ActivityIndicator size="large" color="#6C2BD9" />
      )}

      <TouchableOpacity
        style={styles.goBackBtn}
        onPress={() => setStep("SUMMARY")}
      >
        <Text style={styles.goBackBtnText}>← Назад к сводке</Text>
      </TouchableOpacity>
    </View>
  );

  // ----------------------------------
  // Основной рендер
  // ----------------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Image source={logo} style={styles.logo} />

          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Icon name="menu" size={44} color="#6B21A8" />
          </TouchableOpacity>
        </View>

        {/* Сайд-меню */}
        <Modal
          isVisible={menuVisible}
          onBackdropPress={() => setMenuVisible(false)}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          backdropOpacity={0.3}
          style={{ margin: 0, justifyContent: "flex-start", alignItems: "flex-end" }}
        >
          <View style={styles.sideMenu}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Profile");
              }}
              style={{ paddingVertical: 12 }}
            >
              <Text style={{ fontSize: 18, color: "#111" }}>👤 Профиль</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("MyBookings");
              }}
              style={{ paddingVertical: 12 }}
            >
              <Text style={{ fontSize: 18, color: "#111" }}>🎟 Менің билеттерім</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              style={{ paddingVertical: 12 }}
            >
              <Text style={{ fontSize: 18, color: "red" }}>❌ Жабу</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text style={styles.screenTitle}>Бронирование и оплата</Text>

        {step === "SUMMARY" ? renderSummary() : renderPayment()}
      </SafeAreaView>
    </ScrollView>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: "#693BB8",
    fontSize: 36,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  // SUMMARY
  summarySection: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  totalLabel: {
    fontWeight: "600",
    fontSize: 18,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6C2BD9",
  },
  perSeat: {
    marginTop: 10,
    color: "#888",
    textAlign: "right",
    fontSize: 14,
  },
  continueBtn: {
    backgroundColor: "#6C2BD9",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // PAYMENT
  paymentSection: {
    marginVertical: 20,
    flex: 1,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  paymentLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6C2BD9",
  },
  paymentNote: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
  webView: {
    height: 400,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  goBackBtn: {
    backgroundColor: "#ddd",
    borderRadius: 28,
    paddingVertical: 10,
    alignItems: "center",
  },
  goBackBtnText: {
    color: "#333",
    fontSize: 14,
  },
  // side menu
  sideMenu: {
    width: 250,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
