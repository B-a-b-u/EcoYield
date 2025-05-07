import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';
import { db } from '@/config/firebase'
import { useAuth } from "@/components/auth-context";
import { collection, addDoc } from 'firebase/firestore';

const DeficiencyPrediction = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [confidence, setConfidence] = useState(0);

    const { user } = useAuth();


    const { language } = useLanguage();
    
        useEffect(() => {
          i18n.locale = language;
        }, [language]);
    
        i18n.locale = i18n.locale ?? 'en'


        const storePredictionToFirestore = async (prediction) => {
        
                if (user) {
                    try {
                        console.log("Firebase db: ", db);
                        console.log('user : ',user);
                        const predictionRef = collection(db, 'history');
                        const record = {
                            type : 'Nutrients',
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
    

    const uploadImage = async () => {
        console.log('upload image called');
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            selectionLimit : 1,
            base64 : true
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }

    const captureImage = async () => {
        console.log('capture image called');
        try {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: 1,
            base64 : true,
          });
      
          if (!result.assets || result.assets.length === 0) {
            console.log("User Cancelled Image Capture");
            return;
          } else {
            setImage(result.assets[0]);
          }
        } catch (error) {
          console.log("Error on capture : ", error);
        }
      };
      


    const removeImage = () => {
        setImage(null);
    }

    const getPrediction = async () => {
        if (!image) {
            Alert.alert("Please select or capture an image first.");
            return;
        }
        else {
            // const fileType = image.uri.split(".").pop(); // jpg, png, etc.

            // const formData = new FormData();
            // // console.log("iage : ",image.uri);
            // formData.append("file", {
            //   uri: image.uri,
            //   name: `image.${fileType}`,
            //   type: `image/${fileType}`,
            // });
            const base64Image = image.base64;
        
        try {
            const response = await fetch('https://ecoyieldapi.onrender.com/predict-nutrient-deficiency/', {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image })
                    });
            console.log("Response : ",response);
            const data = await response.json();
            console.log("data : ",data);

            if (response.ok) {
                setPrediction(data.predicted_class_label);
                await storePredictionToFirestore(data.predicted_class_label);
                setConfidence(data.confidence);
            } else {
                console.error('Prediction failed:', data);
                alert('Prediction failed');
            }
        } catch (error) {
            console.error("Error sending image to backend:", error);
            Alert.alert('Error communicating with server');
        }
    }
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{i18n.t('nutrientsDeficiency.title')}</Text>

                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Text style={styles.buttonText}>📁 {i18n.t('nutrientsDeficiency.uploadImage')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={captureImage}>
                    <Text style={styles.buttonText}>📸 {i18n.t('nutrientsDeficiency.captureImage')}</Text>
                </TouchableOpacity>

                {image ? (
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: image.uri }}
                            contentFit="contain"
                            transition={1000}
                        />
                        <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                            <Text style={styles.removeText}>❌ {i18n.t('nutrientsDeficiency.removeImage')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.placeholder}>{i18n.t('nutrientsDeficiency.noImage')}</Text>
                )}

                {prediction && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>{i18n.t('nutrientsDeficiency.prediction')}: {prediction}</Text>
                        <Text style={styles.resultText}>{i18n.t('nutrientsDeficiency.confidence')}: {confidence}</Text>
                    </View>
                )}


                <TouchableOpacity style={styles.button} onPress={getPrediction}>
                    <Text style={styles.buttonText}>{i18n.t('nutrientsDeficiency.getPrediction')}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 120,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    imageContainer: {
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 250,
        borderRadius: 10,
    },
    removeButton: {
        marginTop: 10,
        backgroundColor: "#e53935",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    removeText: {
        color: "#fff",
        fontWeight: "600",
    },
    placeholder: {
        marginTop: 20,
        color: "#999",
        fontStyle: "italic",
    },
    resultContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e6ffe6',
        borderRadius: 10,
    },
    resultText: {
        fontSize: 18,
        color: '#006400',
        textAlign: 'center',
    },
    
});

export default DeficiencyPrediction;