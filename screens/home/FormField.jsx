import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";

const FormField = ({ iconSource, iconAlt, label, value }) => {
  return (
    <View style={styles.formField.container}>
      <Image
        source={{ uri: iconSource }}
        style={styles.formField.icon}
        accessibilityLabel={iconAlt}
      />
      <View>
        <Text style={styles.formField.label}>{label}</Text>
        <Text style={styles.formField.value}>{value}</Text>
        <View style={styles.formField.separator} />
      </View>
    </View>
  );
};

export default FormField;
