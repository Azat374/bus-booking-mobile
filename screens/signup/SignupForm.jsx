// SignupForm.jsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { axiosInst } from "../../service/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
// ВАЖНО: используем поля, аналогичные фронтовой регистрации:
// firstName, lastName, gender, age, mobilenumber, email, password
const SignupForm = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t, i18n } = useTranslation();
  const handleSignup = async () => {
    try {
      const payload = {
        firstName,
        lastName,
        gender,
        age,
        mobile: mobilenumber,
        email,
        password,
      };

      const response = await axiosInst.post("/user/signup", payload);


      navigation.replace("Login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Error signing up. Please try again.");
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder={t("signupScreen.firstName")}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder={t("signupScreen.lastName")}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder={t("signupScreen.gender")}
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder={t("signupScreen.age")}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder={t("signupScreen.mobile")}
        keyboardType="phone-pad"
        value={mobilenumber}
        onChangeText={setMobilenumber}
      />
      <TextInput
        style={styles.input}
        placeholder={t("signupScreen.email")}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t("signupScreen.password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>{t("signupScreen.signupButton")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    maxWidth: 295,
    alignSelf: "center",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#6B21A8",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#6B21A8",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
