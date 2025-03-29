import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { totalAmount } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Payment</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.label}>Total Payment:</Text>
        <Text style={styles.amount}>{totalAmount} KZT</Text>
        <Text style={styles.note}>please select one of the payment method below</Text>
      </View>

      <Text style={styles.paymentLabel}>Payment Method</Text>

      {/* Credit Card */}
      <TouchableOpacity style={styles.paymentOption}>
        <View style={styles.row}>
          <Text style={styles.paymentTitle}>Credit Card</Text>
          <Text style={styles.select}>SELECT</Text>
        </View>
        <View style={styles.iconsRow}>
          <Image source={require('../assets/mastercard.png')} style={styles.icon} />
          <Image source={require('../assets/amex.png')} style={styles.icon} />
          <Image source={require('../assets/visa.png')} style={styles.icon} />
        </View>
      </TouchableOpacity>

      {/* Bank Transfer */}
      <TouchableOpacity style={styles.paymentOption}>
        <View style={styles.row}>
          <Text style={styles.paymentTitle}>Bank Transfer</Text>
          <Text style={styles.select}>SELECT</Text>
        </View>
        <View style={styles.iconsRow}>
          <Image source={require('../assets/googlepay.png')} style={styles.icon} />
          <Image source={require('../assets/card.png')} style={styles.icon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  back: {
    fontSize: 20,
    color: '#6C2BD9',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6C2BD9',
  },
  note: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  paymentLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  paymentOption: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  select: {
    color: '#6C2BD9',
    fontWeight: '600',
  },
  iconsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  icon: {
    width: 40,
    height: 28,
    marginRight: 12,
    resizeMode: 'contain',
  },
});
