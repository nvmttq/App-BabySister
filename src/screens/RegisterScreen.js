import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import DatePicker from "react-native-date-picker";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";


import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../constants/COLORS";

import { AppText, AppImage, InputField, CustomButton, AppSafeAreaView } from "../components";

export default function SignupScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState("Date of Birth");

  const [email, setEmail] = useState("minhnv@gmail.com");
  const [password, setPassword] = useState("123456");
  const [fullName, setFullName] = useState("Nguyen Van Minh");

  const handleSignup = () => {
    console.log(email, password);
    // return;
    if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          const { user } = res;
          const docRef = await addDoc(collection(db, "users"), {
            uid: user.uid,
            displayName: fullName,
            email,
            password,
            following: [],
            provider: "EmailPassword",
          });

          navigation.navigate("Home");
          console.log("SIGNUP SUCCESS", user);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 15 }}
      >
        <View style={{ alignItems: "center" }}>
          <AppImage
            width={380}
            height={250}
            source={require("../assets/images/bbst-2.png")}
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
          Register
        </AppText>

        <InputField
          label={"Enter FullName"}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => setFullName(text)}
          value={fullName}
        />

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
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <InputField
          label={"Enter Password"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          inputType={"password"}
        />

        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <AppText style={{ color: "#666", marginLeft: 5, marginTop: 5 }}>
              {dobLabel}
            </AppText>
          </TouchableOpacity>
        </View>

        <CustomButton
          label={"Register"}
          onPress={handleSignup}
          style={{
            backgroundColor: COLORS.accent,
            paddingVertical: 15,
            borderRadius: 10,
            marginBottom: 30,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <AppText>Already registered?</AppText>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AppText style={{ color: COLORS.accent, fontWeight: "700" }}>
              {" "}
              Login
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
