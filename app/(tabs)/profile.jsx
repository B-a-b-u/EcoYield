import { Text, View, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-context";
import LanguageSelector from "@/components/LanguageSelector";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';

const Profile = () => {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState([]);

      const { language } = useLanguage();
  

      useEffect(() => {
        if (!user) return;
    
        const q = query(collection(db, "history"), where("userId", "==", user.uid));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHistory(data);
        }, (error) => {
          console.error("Error fetching history:", error);
        });
    
        return () => unsubscribe();
      }, [user]);
      

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
       <View style={styles.languageCard}>
          <Text style={styles.label}>🌐 {i18n.t('profile.appLanguage')}</Text>
          <LanguageSelector />
        </View>
      <View style={styles.container}>
        <Text style={styles.heading}>👤 {i18n.t('profile.title')}</Text>

        {user ? (
          <View style={styles.userCard}>
            <Text style={styles.label}>{i18n.t('profile.email')}</Text>
            <Text style={styles.value}>{user.email}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>{i18n.t('profile.logout')}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>{i18n.t('profile.yourHistory')}:</Text>
            {history.length > 0 ? (
              history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View>
                    <Text style={styles.value}>🧠 {item.prediction}</Text>
                    <Text style={styles.timestamp}>
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>{i18n.t('profile.noHistory')}</Text>
            )}
          </View>
        ) : (
          <View style={styles.guestContainer}>
            <Text style={styles.infoText}>{i18n.t('profile.notLoggedIn')}.</Text>
            <Link href="/sign-in" style={styles.linkButton}>
              <Text style={styles.linkText}>{i18n.t('profile.signIn')}</Text>
            </Link>
            <Link href="/sign-up" style={styles.linkButton}>
              <Text style={styles.linkText}>{i18n.t('profile.createAccount')}</Text>
            </Link>
          </View>
        )}

       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafe",
    padding: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a1a1a",
  },
  userCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#666",
    alignItems : 'center',
    justifyContent : 'center',
  },
  value: {
    fontSize: 17,
    color: "#222",
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#e63946",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  historyItem: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    textAlign: "right",
  },
  guestContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 17,
    color: "#555",
    marginBottom: 16,
    textAlign: "center",
  },
  linkButton: {
    backgroundColor: "#4e88ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  languageCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 2,
    alignItems:  'center',
    justifyContent : 'center',
  },
});

export default Profile;
