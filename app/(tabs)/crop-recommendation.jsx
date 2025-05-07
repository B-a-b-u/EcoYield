import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import * as DocumentPicker from 'expo-document-picker';
import axios from "axios";
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';
import { db } from '@/config/firebase';
import { useAuth } from "@/components/auth-context";
import { collection, addDoc } from 'firebase/firestore';
import ActivityIndicator from "../../components/ActivityIndicator";

const CropRecommendation = () => {
    const [soilReport, setSoilReport] = useState(null);
    const [locationData, setLocationData] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [convertedAddress, setConvertedAddress] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { language } = useLanguage();
    const { user } = useAuth();

    useEffect(() => {
        i18n.locale = language;
    }, [language]);

    const storePredictionToFirestore = async (prediction) => {
        if (user) {
            try {
                const predictionRef = collection(db, 'history');
                const record = {
                    type: 'Crop',
                    prediction,
                    userId: user.uid,
                    timestamp: new Date().toISOString(),
                };
                await addDoc(predictionRef, record);
                console.log('Prediction saved to Firestore:', record);
            } catch (error) {
                console.error('Error storing prediction in Firestore:', error);
            }
        }
    };

    const selectSoilReport = async () => {
        try {
            const pickedFile = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });
            if (!pickedFile.canceled && pickedFile.assets.length > 0) {
                setSoilReport(pickedFile.assets[0]);
            }
        } catch (err) {
            setErrorMsg('Error: Error picking file');
        }
    };

    const clearData = () => {
        setSoilReport(null);
        setLocationData('');
        setConvertedAddress('');
    };

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

    const get_recommendation = async () => {
        if (!soilReport || !locationData) {
            setErrorMsg("Fill All Fields");
            return;
        }
        try {
            setErrorMsg('');
            setRecommendation('');
            setIsLoading(true);
            const [lat, lon] = locationData.split(',').map(coord => parseFloat(coord.trim()));
            const formData = new FormData();
            formData.append('file', {
                uri: soilReport.uri,
                type: 'application/pdf',
                name: 'soilreport.pdf',
            });

            const response = await fetch(`https://ecoyieldapi.onrender.com/crop-prediction/?lat=${lat}&lon=${lon}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data) {
                setRecommendation(data.recommended_crop);
                await storePredictionToFirestore(data.recommended_crop);
                setIsLoading(false);
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error uploading Data:", error);
            setErrorMsg("Failed to upload Data.");
        } finally {
            clearData();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>{i18n.t('cropRecommendation.title')}</Text>

                {
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <>
                            <View style={styles.section}>
                                <Text style={styles.label}>{i18n.t('cropRecommendation.uploadreport')}</Text>
                                <TouchableOpacity style={styles.button} onPress={selectSoilReport}>
                                    <Text style={styles.buttonText}>{i18n.t('cropRecommendation.selectReportBtm')}</Text>
                                </TouchableOpacity>
                                {soilReport && (
                                    <View style={styles.fileInfo}>
                                        <Text style={styles.text}>Selected file: {soilReport.name}</Text>
                                        <TouchableOpacity onPress={() => setSoilReport(null)}>
                                            <Text style={styles.removeText}>{i18n.t('cropRecommendation.remove')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>{i18n.t('cropRecommendation.getLocation')}</Text>
                                <TouchableOpacity style={styles.button} onPress={getLocation}>
                                    <Text style={styles.buttonText}>{i18n.t('cropRecommendation.fetchLocation')}</Text>
                                </TouchableOpacity>
                                {locationData ? <Text style={styles.text}>{locationData}</Text> : null}
                                {convertedAddress ? <Text style={styles.text}>Address: {convertedAddress}</Text> : null}
                                {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
                            </View>

                            <View style={styles.section}>
                                <TouchableOpacity style={styles.submitButton} onPress={get_recommendation}>
                                    <Text style={styles.submitText}>{i18n.t('cropRecommendation.getRecommendation')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.clearButton} onPress={clearData}>
                                    <Text style={styles.clearText}>{i18n.t('cropRecommendation.clear')}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                }

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>{i18n.t('cropRecommendation.title')}</Text>
                            <Text style={styles.modalText}>{recommendation}</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>{i18n.t('cropRecommendation.close')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff", 
    },
    scroll: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
        padding: 15,
          },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    button: {
        backgroundColor: '#4CAF50', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#007BFF', 
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    clearButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    clearText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    fileInfo: {
        marginTop: 10,
    },
    removeText: {
        color: '#FF3B30',
        marginTop: 5,
    },
    text: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    error: {
        color: '#d9534f', 
        marginTop: 10,
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#28A745', 
    },
    modalText: {
        color: '#000',
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "#FF3B30",
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default CropRecommendation;
