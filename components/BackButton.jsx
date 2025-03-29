import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackButton = ({ onPress }) => {
  const navigator = useNavigation();

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigator.goBack()}>
      <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#693BB8",
    fontSize: 36,
    fontWeight: "700",
  },
});

export default BackButton;
