import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import styles from "./styles";

const BottomNavigation = () => {
  return (
    <View style={styles.bottomNav.container}>
      <View style={styles.bottomNav.content}>
        <TouchableOpacity>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/1489f5ae25c528ba84289d797b44c042d25a9fbb",
            }}
            style={styles.bottomNav.icon}
            accessibilityLabel="Search icon"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/352c6bde25d6c653cae573f39d2ae9144c9ce3f2",
            }}
            style={styles.bottomNav.icon}
            accessibilityLabel="Menu icon"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/c145c251432e6a0e1effdab83bd93043b7f8f78e",
            }}
            style={styles.bottomNav.icon}
            accessibilityLabel="User icon"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavigation;
