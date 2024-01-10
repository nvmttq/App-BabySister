import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import LoginSVG from "../assets/images/misc/login.svg";
import GoogleSVG from "../assets/images/misc/google.svg";
import FacebookSVG from "../assets/images/misc/facebook.svg";
import TwitterSVG from "../assets/images/misc/twitter.svg";

import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("minhnv@gmail.com");
  const [password, setPassword] = useState("123456");

  const [test, setTest] = useState(null);
  useEffect(() => {}, [test]);
  const handleLogin = () => {
    console.log(email, password);
    // return;
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password).catch((err) =>
        Alert.alert(err.message)
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.tinyLogo(380, 250)}
            source={require("../assets/images/bbst-2.png")}
          />
        </View>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Login
        </Text>

        <InputField
          label={'Enter Email'}
          icon={
            <MaterialIcons
            name="alternate-email"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          }
          onChangeText={(text) => {setEmail(text); console.log("TẼ", text)}}
          value={email}
          inputType="text"
          keyboardType="email-address"
        />
        <InputField
          label={'Enter Password'}
          icon={
            <Ionicons
            name="ios-lock-closed-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          }
          onChangeText={(text) => {setPassword(text); console.log("TẼ", text)}}
          value={password}
          inputType="password"
          
        />
    

        <CustomButton label={"Login"} onPress={handleLogin} />

        <Text style={{ textAlign: "center", color: "#666", marginBottom: 30 }}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          {[1, 2, 3].map((touch, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {}}
              style={{
                borderColor: "#ddd",
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 30,
                paddingVertical: 10,
              }}
            >
              <Image
                style={styles.tinyLogo(24, 24)}
                source={require("../assets/icons/google-ic.png")}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
              {" "}
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginVertical: 20,
  },
  signUp: {
    fontSize: 20,
    flexDirection: "row",
    marginTop: 20,
  },
  tinyLogo: (w, h) => ({
    width: w,
    height: h,
  }),
});