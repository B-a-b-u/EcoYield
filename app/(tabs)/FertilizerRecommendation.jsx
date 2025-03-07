import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const FertilizerRecommendation = () => {
  const [soilReport, setSoilReport] = useState(null);
  const [cropType, setCropType] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [convertedAddress, setConvertedAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const translateY = useSharedValue(1000); // Start from below the screen

  useEffect(() => {
    if (modalVisible) {
      translateY.value = withSpring(0, {
        damping: 10,
        stiffness: 100,
        overshootClamping: true,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      translateY.value = withSpring(1000, {
        damping: 10,
        stiffness: 100,
        overshootClamping: true,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [modalVisible]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const googleMapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
              setLocationData([latitude, longitude]);
              console.log("lat : ", latitude);
              console.log("log:", longitude);
              await fetchAddress(latitude, longitude);
            },
            (error) => {
              setErrorMsg(error.message);
              setLocationData('Error fetching location');
            }
          );
        } else {
          setErrorMsg('Geolocation is not supported by this browser.');
          setLocationData('Geolocation not supported');
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          setLocationData('Location permission denied');
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        const googleMapLink = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
        setLocationData(googleMapLink);
        await fetchAddress(coords.latitude, coords.longitude);
      }
    } catch (error) {
      setErrorMsg('Error getting location');
      setLocationData('Error fetching location');
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.EXPO_PUBLIC_LOC_API}&lat=${lat}&lon=${lon}&format=json`
      );
      const address = response.data.display_name;
      setConvertedAddress(address);
    } catch (error) {
      setErrorMsg('Error converting location to address');
      setConvertedAddress('Error converting location');
    }
  };

  const uploadFileOnPressHandler = async () => {
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (pickedFile.type === 'cancel') {
        console.log('User cancelled the file picker');
        return;
      }

      if (pickedFile.assets && pickedFile.assets.length > 0) {
        const file = pickedFile.assets[0];
        setSoilReport({
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        });
      } else {
        Alert.alert('Error', 'No file was picked');
      }
    } catch (err) {
      Alert.alert('Error', 'Error picking file');
    }
  };

  const showDetails = () => {
    setModalVisible(true);
  };

  const hideDetails = () => {
    setModalVisible(false);
  };

  const openFile = async () => {
    if (soilReport && soilReport.uri) {
      await Linking.openURL(soilReport.uri);
    } else {
      Alert.alert('Error', 'No file available to open');
    }
  };

  const clearData = () => {
    setSoilReport(null);
    setCropType('');
    setLocationData('');
    setConvertedAddress('');
    setErrorMsg(null);
  };

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const send_data = () => {
    console.log("send data called");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Fertilizer Suggestion</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>1. Soil Report</Text>
            <TouchableOpacity onPress={uploadFileOnPressHandler} style={styles.button}>
              <Text style={styles.buttonText}>Pick Soil Report</Text>
            </TouchableOpacity>
            {/* <Button title="Pick Soil Report" onPress={uploadFileOnPressHandler} /> */}
            {soilReport && (
              <View style={styles.fileContainer}>
                <Text style={styles.infoText}>
                  Selected file: {soilReport.name}
                  {Platform.OS === 'web' && soilReport.uri && (
                    <Text style={styles.link} onPress={() => Linking.openURL(soilReport.uri)}>
                      (Download)
                    </Text>
                  )}
                </Text>
                <TouchableOpacity onPress={() => setSoilReport(null)} style={{...styles.button, backgroundColor:'#ee0c0e'}}>
                  <Text style={styles.buttonText}>Remove File</Text>
                </TouchableOpacity>
                {/* <Button title="Remove File" onPress={() => setSoilReport(null)} /> */}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>2. Crop Type</Text>
            <Picker
              selectedValue={cropType}
              style={styles.picker}
              onValueChange={(itemValue) => setCropType(itemValue)}
            >
              <Picker.Item label="Maize" value="Maize" />
              <Picker.Item label="Sugarcane" value="Sugarcane" />
              <Picker.Item label="Cotton" value="Cotton" />
              <Picker.Item label="Tobacco" value="Tobacco" />
              <Picker.Item label="Paddy" value="Paddy" />
              <Picker.Item label="Barley" value="Barley" />
              <Picker.Item label="Wheat" value="Wheat" />
              <Picker.Item label="Millets" value="Millets" />
              <Picker.Item label="Oil seeds" value="Oil seeds" />
              <Picker.Item label="Pulses" value="Pulses" />
              <Picker.Item label="Ground Nuts" value="Ground Nuts" />
            </Picker>

          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>3. Location</Text>
            <TouchableOpacity onPress={getLocation} style={styles.button}>
              <Text style={styles.buttonText}>Get Location</Text>
            </TouchableOpacity>
            {/* <Button title="Get Location" onPress={getLocation} /> */}
            <Text style={styles.infoText} onPress={() => Linking.openURL(locationData)}>
              {convertedAddress}
            </Text>
            {errorMsg && <Text style={styles.infoText}>{errorMsg}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={showDetails && send_data} style={{...styles.button, backgroundColor:'#15A222'}}>
              <Text style={styles.buttonText}>Get Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearData} style={{...styles.button, backgroundColor:'#ee0c0e'}}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            {/* <Button title="Get Details" onPress={showDetails && send_data} style={styles.button} /> */}
            {/* <Button title="Clear" onPress={clearData} /> */}
          </View>

          <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={hideDetails}>
            <Animated.View style={[styles.modalBackground, animatedModalStyle]}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={hideDetails}>
                  <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Details</Text>
                <Text style={styles.infoText}>
                  Selected file: {soilReport ? soilReport.name : 'No file selected'}
                  {Platform.OS === 'web' && soilReport && soilReport.uri && (
                    <Text style={styles.link} onPress={() => Linking.openURL(soilReport.uri)}>
                      (Download)
                    </Text>
                  )}
                </Text>
                <Text style={styles.infoText}>Crop Type: {cropType}</Text>
                <Text style={styles.infoText}>Location Data: </Text>
                <Text style={styles.infoText}>Converted Address: {convertedAddress}</Text>
                <TouchableOpacity onPress={hideDetails}>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.button}>Confirm</Text>
                  </View>
                </TouchableOpacity>
                {/* <Button title="Confirm" onPress={hideDetails} /> */}
              </View>
            </Animated.View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    margin: 10,
    
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  picker: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    margin: 5,
    paddingVertical: 12,
    backgroundColor: '#4EA84E',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FF4C4C',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
});



export default FertilizerRecommendation;