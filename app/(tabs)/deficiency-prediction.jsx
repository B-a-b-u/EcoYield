import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';
import { db } from '@/config/firebase';
import { useAuth } from "@/components/auth-context";
import { collection, addDoc } from 'firebase/firestore';
import ActivityIndicator from "../../components/ActivityIndicator"; // Import ActivityIndicator component

const DeficiencyPrediction = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [isloading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    i18n.locale = language ?? 'en';
  }, [language]);

  const storePredictionToFirestore = async (prediction) => {
    if (user) {
      try {
        const predictionRef = collection(db, 'history');
        const record = {
          type: 'Nutrients',
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setPrediction(null);
    }
  };

  const captureImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        selectionLimit: 1,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0]);
        setPrediction(null); 
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPrediction(null);
    setConfidence(0);
  };

  const getPrediction = async () => {
    if (!image) {
      Alert.alert("⚠️", "Please select or capture an image first.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://ecoyieldapi.onrender.com/predict-nutrient-deficiency/', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image.base64 }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.predicted_class_label);
        setConfidence(data.confidence);
        await storePredictionToFirestore(data.predicted_class_label);
      } else {
        console.error('Prediction failed:', data);
        Alert.alert('Prediction failed. Please try again later.');
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', 'Server communication failed.');
    }
    setIsLoading(false);
  };

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
              transition={300}
            />
            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
              <Text style={styles.removeText}>❌ {i18n.t('nutrientsDeficiency.removeImage')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.placeholder}>{i18n.t('nutrientsDeficiency.noImage')}</Text>
        )}

        {isloading && <ActivityIndicator style={{ marginVertical: 20 }} />}

        {prediction && !isloading && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{i18n.t('nutrientsDeficiency.prediction')}: <Text style={{ fontWeight: 'bold' }}>{prediction}</Text></Text>
            <Text style={styles.resultText}>{i18n.t('nutrientsDeficiency.confidence')}: <Text style={{ fontWeight: 'bold' }}>{confidence.toFixed(2)}</Text></Text>
          </View>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: "#2196F3" }]} onPress={getPrediction}>
          <Text style={styles.buttonText}>{i18n.t('nutrientsDeficiency.getPrediction')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#FF5252",
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
    padding: 15,
    backgroundColor: '#DFF0D8',
    borderRadius: 12,
    width: '100%',
  },
  resultText: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default DeficiencyPrediction;
