import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { axiosInst } from "../../service/axiosInstance";

import busImage from "../../assets/bus9.png";
import logo from "../../assets/logo.png";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BusDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Из предыдущего экрана
  const {
    id,                   // ID автобуса
    passengers = 1,       // Сколько пассажиров максимум
    price = 500,          // Цена за 1 место, если нужно
  } = route.params || {};

  // Данные об автобусе
  const [busNo, setBusNo] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [date, setDate] = useState(""); 
  const [totalSeats, setTotalSeats] = useState(41);

  // Набор занятых (или временно заблокированных) мест
  const [bookedSeats, setBookedSeats] = useState([]);
  // Места, выбранные пользователем
  const [selectedSeats, setSelectedSeats] = useState([]);
  // Данные пассажиров для каждого выбранного места
  // [{ seatNumber, firstName, lastName, age, gender }, ... ]
  const [passengerDetails, setPassengerDetails] = useState([]);

  // --- Запрос: /seats/bus/:id ---
  const fetchBusById = async () => {
    try {
      const res = await axiosInst.get(`/seats/bus/${id}`);
      const data = res.data;
      setBusNo(data.busNo);
      setFrom(data.from);
      setTo(data.to);
      setStartTime(data.startTime);
      setEndTime(data.endTime);
      setTotalSeats(data.totalSeats || 41);
      setBookedSeats(data.bookedSeats || []);
      // Если нужно, можно вычислить date = data.startTime.split("T")[0], и т.п.
    } catch (error) {
      console.error("Error fetchBusById:", error);
      Alert.alert("Ошибка", "Не удалось получить детали автобуса");
    }
  };

  // --- Запрос: /seat/:id (получение временно заблокированных мест) ---
  const fetchSeatsSecondDb = async () => {
    try {
      const res = await axiosInst.get(`/seat/${id}`);
      // res.data = массив, например [11, 12]
      const concurrencySeats = res.data;
      // Объединяем с bookedSeats
      setBookedSeats((prev) => Array.from(new Set([...prev, ...concurrencySeats])));
    } catch (error) {
      console.error("Error fetchSeatsSecondDb:", error);
    }
  };

  // При монтировании
  useEffect(() => {
    fetchBusById();
    fetchSeatsSecondDb();
  }, []);

  // Форматируем время (ч:м)
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const d = new Date(timeString);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // --- Логика нажатия на место ---
  const handleSeatPress = (seatNumber) => {
    // Если уже занято => игнорируем
    if (bookedSeats.includes(seatNumber)) return;

    // Если оно уже выбрано => убираем из выбранных
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatNumber));
      // Удаляем из passengerDetails
      setPassengerDetails((prev) => prev.filter((p) => p.seatNumber !== seatNumber));
    } else {
      // Иначе проверим лимит (passengers)
      if (selectedSeats.length < passengers) {
        setSelectedSeats((prev) => [...prev, seatNumber]);
        // Создаём пустую запись для пассажира
        setPassengerDetails((prev) => [
          ...prev,
          {
            seatNumber,
            firstName: "",
            lastName: "",
            age: "",
            gender: "",
          },
        ]);
      } else {
        Alert.alert("Предупреждение", `Максимум ${passengers} мест.`);
      }
    }
  };

  // Изменение поля одного пассажира
  const updatePassengerField = (seatNumber, field, value) => {
    setPassengerDetails((prev) =>
      prev.map((p) =>
        p.seatNumber === seatNumber ? { ...p, [field]: value } : p
      )
    );
  };

  // Рендер одного «квадратика» кресла
  const renderSeat = (seatNumber) => {
    const isBooked = bookedSeats.includes(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);

    let bgColor = "#ccc"; 
    if (isBooked) {
      bgColor = "#e53935"; // красный
    } else if (isSelected) {
      bgColor = "#6C2BD9"; // фиолетовый
    }

    return (
      <TouchableOpacity
        key={seatNumber}
        style={[styles.seat, { backgroundColor: bgColor }]}
        onPress={() => handleSeatPress(seatNumber)}
        disabled={isBooked}
      >
        <MaterialCommunityIcons name="seat-outline" size={14} color="#fff" />
        <Text style={styles.seatNumber}>{seatNumber}</Text>
      </TouchableOpacity>
    );
  };

  // Формируем колонки: 1..10, 11..20, 21 alone, 22..31, 32..41
  const col1 = [];
  for (let i = 1; i <= 10; i++) col1.push(renderSeat(i));
  const col2 = [];
  for (let i = 11; i <= 20; i++) col2.push(renderSeat(i));
  const col3 = [renderSeat(21)]; // "одинокое" место
  const col4 = [];
  for (let i = 22; i <= 31; i++) col4.push(renderSeat(i));
  const col5 = [];
  for (let i = 32; i <= 41; i++) col5.push(renderSeat(i));

  // --- Кнопка "Брондау" ---
  const handleBook = () => {
    // Проверим заполненность формы пассажиров
    for (const passenger of passengerDetails) {
      if (!passenger.firstName || !passenger.lastName || !passenger.age) {
        Alert.alert("Ошибка", "Заполните все поля пассажиров (имя, фамилию, возраст).");
        return;
      }
    }
    // Всё ок
    navigation.navigate("BookingSummary", {
      id,
      busNo,
      from,
      to,
      startTime,
      endTime,
      date,
      passengers,
      price,
      selectedSeats,
      passengerDetails,
    });
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Шапка */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Image source={logo} style={styles.logo} />
        </View>

        {/* Картинка автобуса */}
        <Image source={busImage} style={styles.busImage} />
        <Text style={styles.busNo}>{busNo}</Text>
        {date ? <Text style={styles.dateText}>{date}</Text> : null}

        {/* Инфа "откуда-куда" */}
        <View style={styles.routeBox}>
          <View style={styles.routeRow}>
            <Text style={styles.placeText}>{from}</Text>
            <Text style={styles.timeText}>{formatTime(startTime)}</Text>
          </View>
          <Text style={styles.arrow}>◉──────────◉</Text>
          <View style={styles.routeRow}>
            <Text style={styles.placeText}>{to}</Text>
            <Text style={styles.timeText}>{formatTime(endTime)}</Text>
          </View>
        </View>

        {/* Блок выбора мест */}
        <View style={styles.seatsBlock}>
          <Text style={styles.seatsBlockTitle}>Орын таңдаңыз</Text>
          <View style={styles.columnsWrapper}>
            <View style={styles.column}>{col1}</View>
            <View style={styles.column}>{col2}</View>
            <View style={styles.columnCenter}>{col3}</View>
            <View style={styles.column}>{col4}</View>
            <View style={styles.column}>{col5}</View>
          </View>

          {/* Легенда */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: "#ccc" }]} />
              <Text>Свободно</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: "#e53935" }]} />
              <Text>Занято</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: "#6C2BD9" }]} />
              <Text>Выбрано</Text>
            </View>
          </View>

          {/* Информация о выбранных местах */}
          {selectedSeats.length > 0 && (
            <View style={styles.selectedSeatsInfo}>
              <Text style={styles.infoText}>
                Места: {selectedSeats.join(", ")}
              </Text>
              <Text style={styles.infoText}>
                Сумма: {selectedSeats.length * price} KZT
              </Text>
            </View>
          )}
        </View>

        {/* Блок с формами для пассажиров */}
        {selectedSeats.length > 0 && (
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerInfoTitle}>
              Данные пассажиров
            </Text>
            
            {passengerDetails.map((p) => (
              <View style={styles.passengerCard} key={p.seatNumber}>
                {/* Заголовок карточки */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderText}>
                    Место №{p.seatNumber}
                  </Text>
                </View>

                {/* Поля ввода: расположим в 2 ряда */}
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Имя"
                    value={p.firstName}
                    onChangeText={(val) =>
                      updatePassengerField(p.seatNumber, "firstName", val)
                    }
                  />
                  <View style={{ width: 12 }} />
                  <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Фамилия"
                    value={p.lastName}
                    onChangeText={(val) =>
                      updatePassengerField(p.seatNumber, "lastName", val)
                    }
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Возраст"
                    keyboardType="numeric"
                    value={String(p.age)}
                    onChangeText={(val) =>
                      updatePassengerField(p.seatNumber, "age", val)
                    }
                  />
                  <View style={{ width: 12 }} />
                  <TextInput
                    style={[styles.inputField, { flex: 1 }]}
                    placeholder="Пол (M/F)"
                    value={p.gender}
                    onChangeText={(val) =>
                      updatePassengerField(p.seatNumber, "gender", val)
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        )}


        {/* Кнопка "Брондау" */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <Text style={styles.bookBtnText}>Брондау</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Стили оформления:
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },

  // Шапка
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

  // Картинка автобуса
  busImage: {
    width: "100%",
    height: 120,
    marginVertical: 10,
    resizeMode: "contain",
  },
  busNo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#6C2BD9",
    paddingVertical: 6,
    textAlign: "center",
    borderRadius: 20,
    marginVertical: 4,
  },
  dateText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginBottom: 8,
  },

  // Блок инфы "откуда-куда"
  routeBox: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  routeRow: {
    alignItems: "center",
    marginBottom: 8,
  },
  placeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C2BD9",
  },
  timeText: {
    fontSize: 16,
    marginTop: 2,
    color: "#333",
  },
  arrow: {
    textAlign: "center",
    color: "#444",
    marginBottom: 8,
    fontSize: 20,
  },

  // Блок с местами
  seatsBlock: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
  },
  seatsBlockTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  columnsWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 4,
  },
  columnCenter: {
    flexDirection: "column-reverse",
    alignItems: "center",
    marginHorizontal: 4,
  },
  seat: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  seatNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
  },

  legend: {
    marginTop: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },

  selectedSeatsInfo: {
    marginTop: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },

  // Блок "Информация о пассажирах"
  passengerInfo: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 16,
  },
  passengerInfoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  passengerCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,

    // Для красоты можно добавить тень (только на iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Для Android тень через elevation
    elevation: 2,
  },
  passengerSeat: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  cardHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 4,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#51259B",
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  inputField: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,

    // Чтобы текст не налипал на верхний край
    // можно добавить textAlignVertical: "center"
    // но оно не всегда нужно
  },

  // Кнопка "Брондау"
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  bookBtn: {
    backgroundColor: "#6C2BD9",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
