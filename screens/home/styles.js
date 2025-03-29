import { StyleSheet } from "react-native";

const styles = {
  inputDesign: StyleSheet.create({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    contentContainer: {
      width: "100%",
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 26,
    },
    logo: {
      width: 327,
      height: 77,
      resizeMode: "contain",
    },
    greeting: {
      marginTop: 23,
      fontFamily: "Nunito",
      fontSize: 20,
      fontWeight: "700",
      color: "#000",
    },
    imageContainer: {
      marginTop: 55,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    busImage: {
      width: 290,
      height: 157,
      resizeMode: "contain",
    },
    formContainer: {
      marginTop: 20,
      width: "100%",
      backgroundColor: "#F8F7F7",
      borderRadius: 34,
      padding: 36,
    },
    formFields: {
      display: "flex",
      flexDirection: "column",
      gap: 36,
    },
    searchButton: {
      marginTop: 18,
      width: 218,
      height: 61,
      backgroundColor: "#51259B",
      borderRadius: 126,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    searchButtonText: {
      color: "#FFF",
      fontFamily: "Nunito",
      fontSize: 24,
      fontWeight: "600",
    },
  }),

  formField: StyleSheet.create({
    container: {
      position: "relative",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 10,
      marginTop: 5,
    },
    label: {
      fontFamily: "Nunito",
      fontSize: 22,
      fontWeight: "700",
      color: "#000",
    },
    value: {
      fontFamily: "Nunito",
      fontSize: 20,
      color: "#000",
      marginTop: 12,
    },
    separator: {
      width: 194,
      height: 1,
      marginTop: 1,
      backgroundColor: "#000",
    },
  }),

  bottomNav: StyleSheet.create({
    container: {
      marginTop: "auto",
      borderTopWidth: 1,
      borderColor: "#A39898",
      width: "100%",
    },
    content: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 22,
      paddingRight: 22,
      paddingTop: 15,
      paddingBottom: 15,
    },
    icon: {
      width: 48,
      height: 48,
    },
  }),
};

export default styles;
