import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';


const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')}  style={styles.icon} />
      
      <Text style={styles.welcome}>{t('welcomeScreen.welcome')}</Text>
      <Text style={styles.description}>
        {t('welcomeScreen.description')}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>{t('welcomeScreen.login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.buttonText}>{t('welcomeScreen.signup')}</Text>
        </TouchableOpacity>
      </View>
      <Button title="EN" onPress={() => i18n.changeLanguage('en')} />
      <Button title="RU" onPress={() => i18n.changeLanguage('ru')} />
      <Button title="KZ" onPress={() => i18n.changeLanguage('kk')} />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20
  },
  icon: {
    resizeMode : "contain",
    width: 300,
    height: 300,
    marginTop: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#5b21b6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
