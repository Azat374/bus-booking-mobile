import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const GoogleLoginButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.googleButton} onPress={onPress}>
      <Image
        source={require("../../assets/google-icon.png")}
        style={styles.googleIcon}
        resizeMode="contain"
        accessibilityLabel="Google"
      />
      <View style={styles.textContainer}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    width: "100%",
    height: 52,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#693BB8",
    backgroundColor: "#F8F7F7",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleIcon: {
    width: 26,
    height: 26,
  },
  textContainer: {},
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default GoogleLoginButton;
