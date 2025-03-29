import * as React from "react";
import { View, StyleSheet } from "react-native";
import FormField from "./FormField";

const SearchForm = () => {
  return (
    <View style={styles.formContainer}>
      {/* From Field */}
      <FormField
        icon="https://cdn.builder.io/api/v1/image/assets/5ce1241109834c779f0eaf58b7b8f168/57c293f765cba9bdb381ef27296df51340eead40?placeholderIfAbsent=true"
        label="From"
        value="Алматы"
        type="from"
      />

      {/* To Field */}
      <FormField
        icon="https://cdn.builder.io/api/v1/image/assets/5ce1241109834c779f0eaf58b7b8f168/aa67d8b0d303bb8511b477c4b0ad95b6f3f0a0dc?placeholderIfAbsent=true"
        label="To"
        value="Каскелен"
        type="to"
        hasConnector={true}
      />

      {/* Passenger Field */}
      <FormField
        icon="https://cdn.builder.io/api/v1/image/assets/5ce1241109834c779f0eaf58b7b8f168/235f057519eaaef785513c0b353b55ecf8ba0bd0?placeholderIfAbsent=true"
        label="Passenger"
        value="2"
        type="passenger"
      />

      {/* Date Field */}
      <FormField
        icon="https://cdn.builder.io/api/v1/image/assets/5ce1241109834c779f0eaf58b7b8f168/5ab362b7f2748de22597b5784bfbda5019ab62e7?placeholderIfAbsent=true"
        label="Date"
        value="2025/3/30"
        type="date"
      />
    </View>
  );
};

const styles = StyleSheet.create({
    formContainer: {
      borderRadius: 34,
      alignSelf: "stretch",
      display: "flex",
      width: "100%",
      paddingLeft: 10,
      paddingRight: 70,
      paddingTop: 13,
      paddingBottom: 13,
      flexDirection: "column",
    },
  });

export default SearchForm;
