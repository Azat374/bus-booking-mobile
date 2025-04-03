// SignupScreen.jsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import SignupForm from "./SignupForm";            // <-- Подключаем наш SignupForm
import GoogleLoginButton from "../login/GoogleLoginButton"; // <-- Если нужен Google вход (как в LoginScreen)

const SignupScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header: BackButton + логотип */}
      <View style={styles.header}>
        <BackButton />
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Dimash Bus"
        />
      </View>

      {/* Контейнер для формы и Google-кнопки */}
      <View style={styles.content}>
        <SignupForm />
        <View style={styles.googleButtonContainer}>
          <GoogleLoginButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    flexDirection: "column",
    fontFamily: "Nunito, sans-serif",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
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
});
