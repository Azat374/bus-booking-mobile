import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { axiosInst } from '../../service/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import LoginForm from './LoginForm';
import GoogleLoginButton from './GoogleLoginButton';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <BackButton />
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Dimash Bus"
      />
    </View>
    <View style={styles.content}>
      <LoginForm />
      <View style={styles.googleButtonContainer}>
        <GoogleLoginButton />
      </View>
    </View>
  </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    flexDirection: "column",
    fontFamily: "Nunito, sans-serif",
    width: "100%", },
  header: {
    flexDirection: 'row',
    display: "flex",
    alignItems: "center",
    padding: 24,
    gap: 12, },

    logo: {
      alignSelf: "flex-start",
      width: 277,
      height: 65,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: 24,
      paddingRight: 24,
    },
    googleButtonContainer: {
      marginTop: 40,
      width: "100%",
      maxWidth: 295,
      alignSelf: "center",
    },


  icon: { width: 100, height: 100, marginRight: 100 },
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B21A8',
    borderRadius: 25,
    padding: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { color: '#000' },
});

{/***
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Image source={require('../../assets/bus-icon.png')} style={styles.icon} />
        <Text style={styles.headerText}>Dimash Bus</Text>
      </View>

      <Text style={styles.title}>LOGIN</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require('../../assets/google-icon.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>
    </View>***/}