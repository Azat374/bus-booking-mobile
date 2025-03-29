import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const totalSeats = 20;
const reservedSeats = [1, 5, 12, 15];

const SeatSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { price, passengers } = route.params;

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((n) => n !== seatNumber));
    } else {
      if (selectedSeats.length < passengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const getSeatStatus = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return 'reserved';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const handleBook = () => {
    navigation.navigate('BookingSummary', {
      ...route.params,
      selectedSeats,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Choose Seat</Text>

      {/* Сетка мест */}
      <View style={styles.seatGrid}>
        {Array.from({ length: totalSeats }).map((_, index) => {
          const seatNumber = index + 1;
          const status = getSeatStatus(seatNumber);

          return (
            <TouchableOpacity
              key={seatNumber}
              style={[
                styles.seat,
                status === 'reserved' && styles.reserved,
                status === 'available' && styles.available,
                status === 'selected' && styles.selected,
              ]}
              onPress={() => toggleSeat(seatNumber)}
              disabled={status === 'reserved'}
            />
          );
        })}
      </View>

      {/* Легенда */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.circle, styles.reserved]} />
          <Text>Reserved</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.circle, styles.available]} />
          <Text>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.circle, styles.selected]} />
          <Text>Selected Seat</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={handleBook}
        disabled={selectedSeats.length !== passengers}
      >
        <Text style={styles.bookBtnText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SeatSelectionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  back: {
    alignSelf: 'flex-start',
    fontSize: 20,
    color: '#6C2BD9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 20,
  },
  seatGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seat: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  reserved: {
    backgroundColor: '#ccc',
  },
  available: {
    backgroundColor: '#eee',
  },
  selected: {
    backgroundColor: '#6C2BD9',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
  },
  legendItem: {
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 6,
  },
  bookBtn: {
    backgroundColor: '#6C2BD9',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
