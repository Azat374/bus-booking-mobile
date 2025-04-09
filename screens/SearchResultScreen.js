import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axiosInst } from "../service/axiosInstance";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
const DashedLine = () => (
  <View style={styles.dashedLineContainer}>
    <View style={styles.dashedLine} />
  </View>
);

const LocationSelector = ({ label, location }) => (
  <View style={styles.locationSelectorContainer}>
    <Text style={styles.locationLabel}>{label}</Text>
    <Text style={styles.locationText}>{location}</Text>
  </View>
);

const DateSeatSelector = ({ date, seats }) => (
  <View style={styles.dateSeatContainer}>
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{date}</Text>
    </View>
    <View style={styles.seatsContainer}>
      <Text style={styles.seatsText}>{seats} {t("searchResultScreen.seat")}</Text>
    </View>
  </View>
);

// Функция форматирования времени
const formatTime = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const RouteCard = ({ bus, passengers, onBook }) => (
  <View style={[styles.routeCardContainer, bus.availableSeats > 0 ? styles.activeContainer : styles.inactiveContainer]}>
    <Text style={[styles.busId, bus.availableSeats > 0 ? styles.activeBusId : styles.inactiveBusId]}>{bus.busNo}</Text>
    <Text style={[styles.busId, bus.availableSeats > 0 ? styles.activeBusId : styles.activeBusId]}>{t("searchResultScreen.class")}: {bus.busClass}</Text>
    <View style={styles.timeLocationRow}>
      <Text style={styles.timeText}>{formatTime(bus.startTime)}</Text>
      <DashedLine />
      <Text style={styles.locationText}>{t("homeScreen.from")}: {bus.from}</Text>
    </View>

    <View style={styles.timeLocationRow}>
      <Text style={styles.timeText}>{formatTime(bus.endTime)}</Text>
      <DashedLine />
      <Text style={styles.locationText}>{t("homeScreen.to")}: {bus.to}</Text>
    </View>

    <View style={styles.footer}>
      <Text style={[styles.priceText, bus.availableSeats > 0 ? styles.activePriceText : styles.inactivePriceText]}>
        {bus.cost} KZT
      </Text>
      <TouchableOpacity
        style={[styles.bookButton, bus.availableSeats > 0 ? styles.activeBookButton : styles.inactiveBookButton]}
        onPress={() => onBook(bus)}
        disabled={bus.availableSeats <= 0}
      >
        <Text style={styles.bookButtonText}>{t("searchResultScreen.bookNow")}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function BusTicketingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { from, to, date, passengers } = route.params;
  const [stationList, setStationList] = useState([]);

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    fetchStations();
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await axiosInst.post("/bus/getbuses", { from, to, date });
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("Error", "Failed to fetch buses");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (bus) => {
    
    navigation.navigate("BusDetail", {
      id: bus.id,
      
      busNo: bus.busNo,
      from: bus.from,
      to: bus.to,
      fromTime: bus.startTime,
      toTime: bus.endTime,
      date,
      passengers,
      price: bus.cost,
      availableSeats: bus.availableSeats,
    });
  };

  const fetchStations = async () => {
    try {
      const response = await axiosInst.get("/station/getstations");
      const formattedStations = response.data.map((station) => ({
        label: station.station_name,
        value: station.id.toString(),
      }));
      setStationList(formattedStations);
    } catch (error) {
      console.error("Error fetching stations:", error);
      Alert.alert("Error", "Failed to fetch stations.");
    }
  };

  const getStationName = (id) => {
    const station = stationList.find((station) => station.value === id);
    return station ? station.label : '';
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.locationContainer}>
          <LocationSelector label={t("homeScreen.from")} location={getStationName(from)} />
          <LocationSelector label={t("homeScreen.to")} location={getStationName(to)} />
        </View>

        <DateSeatSelector date={date} seats={passengers} />

        {loading ? (
          <ActivityIndicator size="large" color="#51259B" style={{ marginTop: 40 }} />
        ) : buses.length === 0 ? (
          <Text style={styles.noBusesText}>{t("searchResultScreen.noBusesFound")}</Text>
        ) : (
          buses.map((bus) => (
            <RouteCard key={bus.id} bus={bus} passengers={passengers} onBook={handleBookNow} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#EBEAEA" },
  content: { padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 32 },
  backButton: { marginRight: 10 },
  backButtonText: { color: "#693BB8", fontSize: 36 },
  logo: { width: 200, height: 60, resizeMode: "contain" },
  locationContainer: { flexDirection: "row", gap: 16, marginTop: 24 },
  locationSelectorContainer: { flex: 1, backgroundColor: "#FAFAFA", borderRadius: 14, padding: 8 },
  locationLabel: { fontSize: 18, fontWeight: "600", color: "#837F7F" },
  locationText: { fontSize: 20, fontWeight: "300", marginTop: 4 },
  dateSeatContainer: { flexDirection: "row", gap: 16, marginTop: 16 },
  dateContainer: { flex: 1, backgroundColor: "#FAFAFA", borderRadius: 17, padding: 8 },
  seatsContainer: { backgroundColor: "#FAFAFA", borderRadius: 17, padding: 8 },
  dateText: { fontSize: 18, fontWeight: "300" },
  seatsText: { color: "#6C6A6A", fontSize: 18, fontWeight: "600" },
  routeCardContainer: { marginTop: 16, borderRadius: 20, padding: 24 },
  activeContainer: { backgroundColor: "#FFFBFB" },
  inactiveContainer: { backgroundColor: "#F8F5F5" },
  busId: { fontSize: 22, fontWeight: "700" },
  activeBusId: { color: "#693BB8" },
  inactiveBusId: { color: "#7C7575" },
  timeLocationRow: { flexDirection: "row", marginTop: 16 },
  timeText: { fontSize: 20, fontWeight: "600", width: 90 },
  footer: { borderTopWidth: 1, borderColor: "#C6BCBC", marginTop: 16, paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priceText: { fontSize: 25, fontWeight: "700" },
  activePriceText: { color: "#693BB8" },
  inactivePriceText: { color: "#7C7575" },
  bookButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 15 },
  activeBookButton: { backgroundColor: "#51259B" },
  inactiveBookButton: { backgroundColor: "#B8B5BC" },
  bookButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  dashedLineContainer: { marginHorizontal: 16, height: 57, justifyContent: "center" },
  dashedLine: { height: "100%", width: 1, borderWidth: 1, borderStyle: "dashed", borderColor: "#000" },
  noBusesText: { fontSize: 18, color: "#E74C3C", textAlign: "center", marginTop: 40 },
});
