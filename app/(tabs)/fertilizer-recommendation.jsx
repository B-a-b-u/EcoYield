import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import * as DocumentPicker from 'expo-document-picker';
import axios from "axios";

const FertilizerRecommendation = () => {
    const [soilReport, setSoilReport] = useState(null);
    const [cropType, setCropType] = useState('');
    const [locationData, setLocationData] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [convertedAddress, setConvertedAddress] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const clearData = () => {
        setSoilReport(null);
        setCropType('');
        setLocationData('');
        setConvertedAddress('');
        setRecommendation('');
    };

    const getDetails = async () => {
        console.log("get Details called");
        console.log("soil report : ", soilReport);
        console.log("crop type :", cropType);
        console.log("location :", locationData);

        if (!soilReport || !cropType || !locationData) {
            setErrorMsg("Please provide all inputs.");
            return;
        }
        const formData = new FormData();
        formData.append("file", {
            uri: soilReport.uri,
            name: soilReport.name,
            type: soilReport.mimeType ||'application/pdf', 
          });
        const [latitude, longitude] = locationData.split(',').map(val => val.trim());
        console.log("report : ",formData);
        console.log("lat :",latitude," long : ",longitude);

        console.log("Prepared file:", {
            uri: soilReport.uri,
            name: soilReport.name,
            type: 'application/pdf',
          });

        try {
            const response = await fetch(
                `https://ecoyieldapi.onrender.com/fertilizer-prediction/?lat=${latitude}&lon=${longitude}&crop_type=${cropType}`,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    // Don't set Content-Type!
                  },
                  body: formData,
                }
              );
            const data = await response.json();
            if (response.ok) {
                console.log("Fertilizer Recommendation:", data.FR);
                setRecommendation(data.FR);
            } else {
                console.error("Error from backend:", data.detail);
                setErrorMsg(data.detail || "Error fetching recommendation");
            }
        } catch (error) {
            console.error("Error sending request:", error);
            setErrorMsg("Failed to fetch recommendation");
        }
    }

    const selectSoilReport = async () => {
        console.log("soil report selected");
        try {
            const pickedFile = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });
            console.log("Picked file : ", pickedFile.assets[0].name);
            if (!pickedFile.canceled && pickedFile.assets.length > 0) {
                setSoilReport(pickedFile.assets[0]);
            }
        } catch (err) {
            setErrorMsg('Error: Error picking file');
        }
    }

    const fetchAddress = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://us1.locationiq.com/v1/reverse.php?key=${process.env.EXPO_PUBLIC_LOC_API}&lat=${lat}&lon=${lon}&format=json`
            );
            setConvertedAddress(response.data.display_name);
        } catch (error) {
            setErrorMsg('Error converting location to address');
        }
    };

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            const { coords } = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = coords;
            setLocationData(`${latitude}, ${longitude}`);
            fetchAddress(latitude, longitude);
        } catch (error) {
            setErrorMsg('Error getting location');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>Fertilizer Recommendation</Text>

                {/* Soil Report */}
                <View style={styles.section}>
                    <Text style={styles.label}>1. Upload Soil Report</Text>
                    <TouchableOpacity style={styles.button} onPress={selectSoilReport}>
                        <Text style={styles.buttonText}>Pick Soil Report</Text>
                    </TouchableOpacity>
                    {soilReport && (
                        <View style={styles.fileInfo}>
                            <Text style={styles.text}>Selected file: {soilReport.name}</Text>
                            <TouchableOpacity onPress={() => setSoilReport(null)}>
                                <Text style={styles.removeText}>Remove File</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Crop Type */}
                <View style={styles.section}>
                    <Text style={styles.label}>2. Select Crop Type</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={cropType} onValueChange={setCropType}>
                            <Picker.Item label="-- Select Crop --" value="" />
                            <Picker.Item label="Maize" value="Maize" />
                            <Picker.Item label="Sugarcane" value="Sugarcane" />
                            <Picker.Item label="Cotton" value="Cotton" />
                            <Picker.Item label="Paddy" value="Paddy" />
                            <Picker.Item label="Wheat" value="Wheat" />
                        </Picker>
                    </View>
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.label}>3. Get Location</Text>
                    <TouchableOpacity style={styles.button} onPress={getLocation}>
                        <Text style={styles.buttonText}>Fetch My Location</Text>
                    </TouchableOpacity>
                    {locationData ? <Text style={styles.text}>Coords: {locationData}</Text> : null}
                    {convertedAddress ? <Text style={styles.text}>Address: {convertedAddress}</Text> : null}
                    {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
                </View>

                {/* Actions */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.submitButton} onPress={getDetails}>
                        <Text style={styles.submitText}>Get Recommendation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.clearButton} onPress={clearData}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9"
    },
    scroll: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#3A3A3A',
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#444',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#28A745',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    clearText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        overflow: 'hidden',
    },
    fileInfo: {
        marginTop: 10,
    },
    text: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
    },
    removeText: {
        color: '#FF3B30',
        marginTop: 5,
    },
    error: {
        color: 'red',
        marginTop: 10,
    }
});

export default FertilizerRecommendation;