import * as React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const SearchButton = () => {
  return (
    <TouchableOpacity style={styles.searchButton}>
      <Text style={styles.searchButtonText}>Search</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    searchButton: {
      borderRadius: 126,
      marginTop: 18,
      width: 218,
      maxWidth: "100%",
      paddingLeft: 70,
      paddingRight: 70,
      paddingTop: 15,
      paddingBottom: 29,
      backgroundColor: "#007AFF", // Added background color for the button
    },
    searchButtonText: {
      fontFamily: "Nunito",
      fontSize: 24,
      color: "rgba(255, 255, 255, 1)",
      fontWeight: "600",
      textAlign: "center",
    },
  });

export default SearchButton;
