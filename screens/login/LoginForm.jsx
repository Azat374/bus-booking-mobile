import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { axiosInst } from '../../service/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { t } from "i18next";


const LoginForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t, i18n } = useTranslation();

  const handleLogin = async () => {
      try {
        const response = await axiosInst.post('/user/signin', { email, password });
        const { id, jwt } = response.data;
        print(response.data);
        await AsyncStorage.setItem('jwtToken', jwt);
        await AsyncStorage.setItem('userId', id.toString());
  
        navigation.replace('Home');
      } catch (error) {
        console.error('Login Error:', error);
        alert('Invalid email or password!');
      }
    };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{t('loginScreen.title')}</Text>
      </View>
      <View style={styles.formFields}>
        <EmailField email={email} setEmail={setEmail} />
        <PasswordField password={password} setPassword={setPassword} />
        <LoginButton onPress={handleLogin} />
      </View>
    </View>
  );
};

const EmailField = ({ email, setEmail }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>{t('loginScreen.email')}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="test@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

const PasswordField = ({ password, setPassword }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>{t('loginScreen.password')}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>
    </View>
  );
};

const LoginButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.loginButton} onPress={onPress}>
      <Text style={styles.loginButtonText}>{t('loginScreen.loginButton')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    maxWidth: 343,
    backgroundColor: "#F8F7F7",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#FFF",
    padding: 24,
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    color: "#693BB8",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  formFields: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  labelContainer: {},
  inputLabel: {
    color: "#000",
    fontSize: 24,
    fontWeight: "700",
  },
  inputContainer: {
    width: "100%",
    height: 54,
    borderRadius: 126,
    borderWidth: 1,
    borderColor: "#693BB8",
    backgroundColor: "#FFFAFA",
    paddingLeft: 20,
    paddingRight: 20,
    display: "flex",
    justifyContent: "center",
  },
  textInput: {
    width: "100%",
    fontSize: 18,
    fontWeight: "300",
  },
  loginButton: {
    width: 186,
    height: 48,
    backgroundColor: "#51259B",
    borderRadius: 126,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 24,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
  },
});

export default LoginForm;
