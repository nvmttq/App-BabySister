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
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../constants/COLORS";

import { AppText, CustomButton, InputField, AppImage, AppSafeAreaView} from "../components";
import { expoPushNotice } from "../utils";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("minhnv@gmail.com");
  const [password, setPassword] = useState("123456");


  const addExpoPushToken = async (uid) => {
    expoPushNotice.registerForPushNotificationsAsync().then(async token => {
      if(token) {
        await updateDoc(doc(db, "users", uid), {
          expoPushTokens: arrayUnion(token),
          currentExpoPushToken: token
        })
      }
    });
  }
  const handleLogin = async () => {
    // return;
    if (email !== "" && password !== "") {
      await signInWithEmailAndPassword(auth, email, password).then((data) => {
        console.log("LONGIN SUCCESSFULL",email, password, data.user.uid)
        addExpoPushToken(data.user.uid)
      }).catch((err) =>
        Alert.alert(err.message)
        
      );
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: "center" }}>
          <AppImage
            width={380}
            height={250}
            source={require("images/bbst-2.png")}
          />
        </View>
        <AppText
          style={{
            fontFamily: "Roboto",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Đăng nhập
        </AppText>

        <InputField
          label={"Enter Email"}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => {
            setEmail(text);
          }}
          value={email}
          inputType="text"
          keyboardType="email-address"
        />
        <InputField
          label={"Enter Password"}
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
          inputType="password"
        />

        <CustomButton
          label={"Đăng nhập"}
          onPress={handleLogin}
          style={{
            backgroundColor: COLORS.accent,
            paddingVertical: 15,
            borderRadius: 10,
            marginBottom: 30,
          }}
          styleText={{fontSize: 18}}
        />

        {/* <AppText style={{ textAlign: "center", color: "#666", marginBottom: 30 }}>
          Or, login with ...
        </AppText>

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
              <AppImage
                width={24}
                height={24}
                source={require("icons/google-ic.png")}
              />
            </TouchableOpacity>
          ))}
        </View> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <AppText>Bạn chưa có tài khoản? </AppText>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <AppText style={{ color: COLORS.accent, fontWeight: "700" }}>
              Đăng ký
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </AppSafeAreaView>
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
