import { Text, View, TouchableOpacity, Platform, StyleSheet, ScrollView, Modal } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import * as DocumentPicker from 'expo-document-picker';
import axios from "axios";
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';
import { db } from '@/config/firebase';
import { useAuth } from "@/components/auth-context";
import { collection, addDoc } from 'firebase/firestore';
import ActivityIndicator from "../../components/ActivityIndicator";

const FertilizerRecommendation = () => {
    const [soilReport, setSoilReport] = useState(null);
    const [cropType, setCropType] = useState('');
    const [locationData, setLocationData] = useState('');
    const [convertedAddress, setConvertedAddress] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const { language } = useLanguage();

    useEffect(() => {
        i18n.locale = language || 'en';
    }, [language]);

    const clearData = () => {
        setSoilReport(null);
        setCropType('');
        setLocationData('');
        setConvertedAddress('');
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
            setErrorMsg('Error picking file');
        }
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

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const storePredictionToFirestore = async (prediction) => {
        if (user) {
            try {
                const predictionRef = collection(db, 'history');
                const record = {
                    type: 'Fertilizer',
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

    const getDetails = async () => {
        if (!soilReport || !cropType || !locationData) {
            console('fertilizerRecommendation.provideAllInputs');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');
        setRecommendation('');

        try {
            const [lat, lon] = locationData.split(',').map(coord => parseFloat(coord.trim()));
            let response;

            if (Platform.OS === 'web') {
                const responseBlob = await fetch(soilReport.uri);
                const blob = await responseBlob.blob();
                const base64File = await convertFileToBase64(blob);

                response = await fetch(`https://ecoyieldapi.onrender.com/fertilizer-prediction-64/?lat=${lat}&lon=${lon}&crop_type=${cropType}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ base64_pdf: base64File }),
                });
            } else {
                const formData = new FormData();
                formData.append('file', {
                    uri: soilReport.uri,
                    type: 'application/pdf',
                    name: 'soilreport.pdf',
                });

                response = await fetch(`https://ecoyieldapi.onrender.com/fertilizer-prediction/?lat=${lat}&lon=${lon}&crop_type=${cropType}`, {
                    method: 'POST',
                    headers: { "Content-Type": "multipart/form-data" },
                    body: formData,
                });
            }

            const data = await response.json();
            if (data.recommended_fertilizer) {
                await storePredictionToFirestore(data.recommended_fertilizer);
                setRecommendation(`Recommended Fertilizer: ${data.recommended_fertilizer}`);
                setModalVisible(true);
            } else {
                setErrorMsg("Failed to get fertilizer recommendation.");
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);
            setErrorMsg("Failed to upload PDF.");
        } finally {
            setIsLoading(false);
            clearData();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>{i18n.t('fertilizerRecommendation.title')}</Text>

                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.label}>{i18n.t('fertilizerRecommendation.uploadreport')}</Text>
                            <TouchableOpacity style={styles.button} onPress={selectSoilReport}>
                                <Text style={styles.buttonText}>{i18n.t('fertilizerRecommendation.selectReportBtm')}</Text>
                            </TouchableOpacity>
                            {soilReport && (
                                <View style={styles.fileInfo}>
                                    <Text style={styles.text}>Selected file: {soilReport.name}</Text>
                                    <TouchableOpacity onPress={() => setSoilReport(null)}>
                                        <Text style={styles.removeText}>{i18n.t('fertilizerRecommendation.remove')}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>{i18n.t('fertilizerRecommendation.selectCrop')}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={cropType} onValueChange={setCropType}>
                                    <Picker.Item label={i18n.t('fertilizerRecommendation.cropTypes.select')} value="" />
                                    <Picker.Item label="Maize" value="Maize" />
                                    <Picker.Item label="Sugarcane" value="Sugarcane" />
                                    <Picker.Item label="Cotton" value="Cotton" />
                                    <Picker.Item label="Paddy" value="Paddy" />
                                    <Picker.Item label="Wheat" value="Wheat" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>{i18n.t('fertilizerRecommendation.getLocation')}</Text>
                            <TouchableOpacity style={styles.button} onPress={getLocation}>
                                <Text style={styles.buttonText}>{i18n.t('fertilizerRecommendation.fetchLocation')}</Text>
                            </TouchableOpacity>
                            {locationData && <Text style={styles.text}>{locationData}</Text>}
                            {convertedAddress && <Text style={styles.text}>{convertedAddress}</Text>}
                        </View>

                        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

                        <TouchableOpacity style={styles.submitBtn} onPress={getDetails}>
                            <Text style={styles.buttonText}>{i18n.t('fertilizerRecommendation.getRecommendation')}</Text>
                        </TouchableOpacity>

                        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.recommendationText}>{recommendation}</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Text style={styles.closeText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    scroll: { padding: 20 },
    header: {  fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center', },
    section: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8 },
    button: { backgroundColor: '#007BFF', padding: 12, borderRadius: 10 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
    submitBtn: { backgroundColor: 'green', padding: 12, borderRadius: 10, marginTop: 10 },
    pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
    text: { marginTop: 10, fontSize: 14 },
    removeText: { color: 'red', marginTop: 5 },
    error: { color: 'red', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
    recommendationText: { fontSize: 16, marginBottom: 15 },
    closeText: { color: '#007BFF', fontWeight: 'bold' },
    fileInfo: { marginTop: 10 },
});

export default FertilizerRecommendation;
