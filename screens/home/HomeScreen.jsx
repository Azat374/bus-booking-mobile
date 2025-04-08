{/***

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { axiosInst } from '../service/axiosInstance';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [stationList, setStationList] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengers, setPassengers] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axiosInst.get('/station/getstations');
      setStationList(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!from || !to || !date || !passengers) {
      alert('Please fill all fields.');
      return;
    }

    navigation.navigate('SearchResult', {
      from,
      to,
      date: date.toISOString().split('T')[0],
      passengers,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B21A8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.welcome}>Hello,{"\n"}Where are you headed?</Text>

        <View style={styles.card}>
          <Text style={styles.label}>From</Text>
          <TextInput
            style={styles.input}
            placeholder="Departure Station"
            value={from}
            onChangeText={setFrom}
          />

          <Text style={styles.label}>To</Text>
          <TextInput
            style={styles.input}
            placeholder="Destination Station"
            value={to}
            onChangeText={setTo}
          />

          <Text style={styles.label}>Passengers</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of Passengers"
            value={passengers}
            onChangeText={setPassengers}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text>{date.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginTop: 10,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#6B21A8',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  datePicker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchBtn: {
    backgroundColor: '#6B21A8',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  searchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

***/}

{/*** 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Platform, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { axiosInst } from '../../service/axiosInstance';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [stationList, setStationList] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengers, setPassengers] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axiosInst.get('/station/getstations');
      setStationList(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!from || !to || !date || !passengers) {
      alert('Please fill all fields.');
      return;
    }

    navigation.navigate('SearchResult', {
      from,
      to,
      date: date.toISOString().split('T')[0],
      passengers,
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B21A8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Hello,{"\n"}Where are you headed?</Text>

      <View style={styles.card}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          placeholder="Departure Station"
          value={from}
          onChangeText={setFrom}
        />

        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="Destination Station"
          value={to}
          onChangeText={setTo}
        />

        <Text style={styles.label}>Passengers</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of Passengers"
          value={passengers}
          onChangeText={setPassengers}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
          <Text>{date.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            onChange={onDateChange}
          />
        )}

        {Platform.OS === 'ios' && showDatePicker && (
          <Modal transparent={true}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="inline"
                  onChange={onDateChange}
                />
                <Button title="Done" onPress={() => setShowDatePicker(false)} />
              </View>
            </View>
          </Modal>
        )}
      </View>

      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginTop: 10,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#6B21A8',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  datePicker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchBtn: {
    backgroundColor: '#6B21A8',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  searchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
});***/} 
import React, { useEffect, useState, useRef  } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  TextInput,
  Easing, Animated
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import BottomNavigation from "./BottomNavigation";
import styles from "./styles";
import { axiosInst } from "../../service/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import FormField from "./FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
const HomeScreen = () => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(500)).current;

  const [stationList, setStationList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [date, setDate] = useState(new Date());
  const [passengers, setPassengers] = useState('1');

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 12,
      duration: 3000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  
  const fetchStations = async () => {
    try {
      const response = await axiosInst.get("/station/getstations");
      const formattedStations = response.data.map((station) => ({
        label: station.station_name,
        value: station.id.toString(),
      }));
      setStationList(formattedStations);
    } catch (error) {
      console.error("Error fetching stations:", error);
      Alert.alert("Error", "Failed to fetch stations.");
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStations();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!from || !to || !date || !passengers) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      //Alert.alert("Info", `Searching for buses from ${from} to ${to} on ${date}`);

      const requestBody = {
        from,
        to,
        date: date.toISOString().split("T")[0],
      };
      const response = await axiosInst.post("/bus/getbuses", requestBody);

      if (response.data.length === 0) {
        Alert.alert("Info", "No buses found.");
      } else {
        navigation.navigate("SearchResult", {
          buses: response.data,
          from,
          to,
          date: requestBody.date,
          passengers,
        });
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      Alert.alert("Error", "Failed to fetch buses.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.inputDesign.container}>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
      }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 160, height: 60, resizeMode: 'contain' }}
        />
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={50} color="#6B21A8" />
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={menuVisible}
        onBackdropPress={() => setMenuVisible(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.3}
        style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'flex-end' }}
      >
        <View style={{
          width: 250,
          height: '100%',
          backgroundColor: '#fff',
          paddingTop: 60,
          paddingHorizontal: 20,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: -4, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}>
          <TouchableOpacity
            onPress={() => { setMenuVisible(false); navigation.navigate("Profile"); }}
            style={{ paddingVertical: 12 }}
          >
            <Text style={{ fontSize: 18, color: '#111' }}>{t('profile')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setMenuVisible(false); navigation.navigate("MyBookings"); }}
            style={{ paddingVertical: 12 }}
          >
            <Text style={{ fontSize: 18, color: '#111' }}>{t('myBookings')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMenuVisible(false)}
            style={{ paddingVertical: 12 }}
          >
            <Text style={{ fontSize: 18, color: 'red' }}>{t('logout')}</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>🌐 {t('language')} </Text>
            <TouchableOpacity onPress={() => i18n.changeLanguage('kk')}>
              <Text style={{ fontSize: 16 }}>Қазақша</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => i18n.changeLanguage('ru')}>
              <Text style={{ fontSize: 16 }}>Русский</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => i18n.changeLanguage('en')}>
              <Text style={{ fontSize: 16 }}>English</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.inputDesign.contentContainer}>
        

          <Text style={styles.inputDesign.greeting}>
            {t("homeScreen.greeting")}
          </Text>

          <Animated.Image
            source={require('../../assets/bus5.png')}
            style={[
              styles.inputDesign.busImage,
              { transform: [{ translateX }] }
            ]}
          />

        
          <View style={styles.inputDesign.formContainer}>
              
          <View style={styles.formField.container}>
            <Image
              source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee5bc20453cdd8e0519eae1058baa51f54c07cbe" }}
              style={styles.formField.icon}
              accessibilityLabel={"Location icon"}
            />
            <View>
              <Text style={styles.formField.label}>{t("homeScreen.from")}</Text>
                <DropDownPicker
                open={openFrom}
                setOpen={setOpenFrom}
                items={stationList}
                value={from}
                setValue={setFrom}
                placeholder={t("homeScreen.from")}
                zIndex={2000}
                style={styles.formField.value}
              />
              <View style={styles.formField.separator} />
            </View>
            </View> 



            <View style={styles.formField.container}>
            <Image
              source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee5bc20453cdd8e0519eae1058baa51f54c07cbe" }}
              style={styles.formField.icon}
              accessibilityLabel={"Select icon"}
            />
            <View>
              <Text style={styles.formField.label}>{t("homeScreen.to")}</Text>
              <DropDownPicker
              open={openTo}
              setOpen={setOpenTo}
              items={stationList.filter((item) => item.value !== from)}
              value={to}
              setValue={setTo}
              placeholder={t("homeScreen.to")}
              zIndex={1000}
              style={{ marginBottom: 15 }}
            />

              <View style={styles.formField.separator} />
            </View>
            </View>
            
            <View style={styles.formField.container}>
              <Image
                source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d987f8fb233906f224470ffb2d833bdbde0d4937" }}
                style={styles.formField.icon}
                accessibilityLabel={"Users icon"}
              />
              <View>
                <Text style={styles.formField.label}>{t("homeScreen.passengers")}</Text>
                <TextInput style={styles.formField.value}  onChangeText={setPassengers} value={passengers}>{''}</TextInput>
                <View style={styles.formField.separator} />
              </View>
            </View>

            <View style={styles.formField.container}>
              <Image
                source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/5569f14e094e429e15972615346e358ec68dad64" }}
                style={styles.formField.icon}
                accessibilityLabel={"Calendar icon"}
              />
              <View>
                <Text style={styles.formField.label}>{t("homeScreen.date")}</Text>
                <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                style={styles.formField.value}
              />
                <View style={styles.formField.separator} />
              </View>
            </View>
            
           

            <TouchableOpacity
              style={styles.inputDesign.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.inputDesign.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      
    </SafeAreaView>
  );
};

export default HomeScreen;
