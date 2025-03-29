import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { axiosInst } from '../service/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';  

const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const payload = {
        fullName: name,
        phone,
        email,
        password,
      };
      const response = await axiosInst.post('/user/signup', payload);

      const { jwtToken, userId } = response.data;

      await AsyncStorage.setItem('jwtToken', jwtToken);
      await AsyncStorage.setItem('userId', userId.toString());

      navigation.replace('Home');
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Error signing up. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/bus-icon.png')} style={styles.icon} />
        <Text style={styles.headerText}>Dimash Bus</Text>
      </View>

      <Text style={styles.title}>SIGNUP</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  icon: { width: 40, height: 40, marginRight: 10 },
  headerText: { fontSize: 24, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '600', color: '#6B21A8', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#6B21A8', borderRadius: 25,
    paddingHorizontal: 15, paddingVertical: 10, marginBottom: 15,
  },
  button: {
    backgroundColor: '#6B21A8',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16 },
});
