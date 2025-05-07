import { Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { Link } from "expo-router";
import { useAuth } from "@/components/auth-context";
import LanguageSelector from '@/components/LanguageSelector'


const Profile = () => {
    const { user, logout } = useAuth();
    return (
        <View style={styles.container}>
        <Text style={styles.heading}>👤 Profile</Text>
  
        {user ? (
          <View style={styles.userCard}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
  
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.guestContainer}>
            <Text style={styles.infoText}>You're not logged in.</Text>
  
            <Link href="/sign-in" style={styles.linkButton}>
              <Text style={styles.linkText}>Sign In</Text>
            </Link>
  
            <Link href="/sign-up" style={styles.linkButton}>
              <Text style={styles.linkText}>Create Account</Text>
            </Link>
          </View>
        )}
      <LanguageSelector />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f2f2f2",
      padding: 24,
      justifyContent: "center",
    },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 24,
      textAlign: "center",
      color: "#333",
    },
    userCard: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 12,
      color: "#555",
    },
    value: {
      fontSize: 16,
      color: "#222",
    },
    logoutButton: {
      marginTop: 24,
      backgroundColor: "#ff5c5c",
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    logoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    guestContainer: {
      alignItems: "center",
    },
    infoText: {
      fontSize: 18,
      marginBottom: 20,
      color: "#444",
    },
    linkButton: {
      backgroundColor: "#4e88ff",
      padding: 14,
      borderRadius: 12,
      width: "100%",
      marginBottom: 10,
      alignItems: "center",
    },
    linkText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
export default Profile;