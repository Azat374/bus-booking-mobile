import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { axiosInst } from "../service/axiosInstance";
import logo from "../assets/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const BookingPaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Параметры, переданные с предыдущего экрана
  const {
    busNo = "AB1234",
    selectedSeats = [],
    price = 600,
    userId = 42,
    busId = 1001,
  } = route.params || {};

  // Итоговая сумма (например, в KZT)
  const totalAmount = selectedSeats.length * price;

  // Локальный стейт для переключения между этапами "SUMMARY" и "PAYMENT"
  const [step, setStep] = useState("SUMMARY");
  // URL платежной сессии Stripe Checkout
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  // Флаг загрузки платежной сессии
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Функция для создания платежной сессии через Stripe (через ваш сервер)
  const handleProceedToPayment = async () => {
    setLoadingPayment(true);
    try {
      // Получаем JWT-токен (если он используется)
      const token = await AsyncStorage.getItem("jwtToken");
      // Формируем payload для создания платежной сессии
      const payload = {
        busId,
        userId,
        amount: totalAmount, // Если требуется, умножьте на 100, если сумма должна быть в центах
        seatNos: selectedSeats,
      };

      const response = await axiosInst.post("/payment/stripe", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Предположим, сервер возвращает { checkoutUrl: "https://checkout.stripe.com/pay/..." }
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        setCheckoutUrl(checkoutUrl);
        setStep("PAYMENT");
      } else {
        Alert.alert("Ошибка", "Не удалось создать платежную сессию");
      }
    } catch (error) {
      console.log("Ошибка создания сессии Stripe:", error);
      Alert.alert("Ошибка", "Платеж не инициализирован");
    }
    setLoadingPayment(false);
  };

  // Обработка сообщений из WebView. Предполагается, что Stripe Checkout после успешной оплаты отправляет сообщение в формате JSON, например: { "success": true }
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.success) {
        Alert.alert("Успех", "Оплата прошла успешно!");
        // Навигация на экран "Мои билеты"
        navigation.navigate("MyBookings");
      } else if (data.cancelled) {
        Alert.alert("Отмена", "Оплата отменена");
        setStep("SUMMARY");
      }
    } catch (error) {
      console.log("Ошибка обработки сообщения из WebView:", error);
    }
  };

  // Функция для возврата к сводке бронирования
  const goBackToSummary = () => {
    setStep("SUMMARY");
  };

  // Рендер сводки бронирования
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
        {loadingPayment ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueBtnText}>Перейти к оплате</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // Рендер этапа оплаты через WebView (Stripe Checkout)
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
          onMessage={handleWebViewMessage}
          startInLoadingState={true}
          style={styles.webView}
        />
      ) : (
        <ActivityIndicator size="large" color="#6C2BD9" />
      )}
      <TouchableOpacity style={styles.goBackBtn} onPress={goBackToSummary}>
        <Text style={styles.goBackBtnText}>← Назад к сводке</Text>
      </TouchableOpacity>
    </View>
  );

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
        </View>
        <Text style={styles.screenTitle}>Бронирование и оплата</Text>
        {step === "SUMMARY" ? renderSummary() : renderPayment()}
      </SafeAreaView>
    </ScrollView>
  );
};

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
    height: 60,
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
  // --- SUMMARY ---
  summarySection: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 20,
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
  // --- PAYMENT ---
  paymentSection: {
    marginVertical: 20,
    flex: 1,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
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
});

export default BookingPaymentScreen;
