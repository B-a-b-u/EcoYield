import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeficiencyPrediction = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);

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
            const result = await ImagePicker.launchCameraAsync(
                {
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                    selectionLimit: 1,
                }
            )

            if (result.cancelled) {
                console.log("User Cancelled Image Capture");
                return;
            }
            else {
                setImage(result.assets[0]);
            }
        }
        catch (error) {
            console.log("Error on capture : ", error);
        }


    }


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
                setPrediction(data.prediction);
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
                <Text style={styles.title}>Nutrient Deficiency Prediction</Text>

                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Text style={styles.buttonText}>📁 Upload Image</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={captureImage}>
                    <Text style={styles.buttonText}>📸 Capture Image</Text>
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
                            <Text style={styles.removeText}>❌ Remove Image</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.placeholder}>No image selected.</Text>
                )}

                {prediction && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Prediction: {prediction}</Text>
                    </View>
                )}


                <TouchableOpacity style={styles.button} onPress={getPrediction}>
                    <Text style={styles.buttonText}>Get Predictions</Text>
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