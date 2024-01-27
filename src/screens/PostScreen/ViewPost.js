// REACT ( NATIVE )
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AntDesign } from "react-native-vector-icons";
// FIRE BASE
import { addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config";

// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import { COLORS } from "../../constants/COLORS";

import {
  AppSafeAreaView,
  AppText,
  AppImage,
  CustomCard,
  CustomButton,
  Row,
  InputCheckbox,
} from "../../components";
import { formatDateTime, formatMoney } from "../../utils";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function ViewPostScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [acceptJob, setAcceptJob] = useState(false);
  const [showAlertAcceptJob, setShowAlertAcceptJob] = useState(false);
  const [job, setJob] = useState(route.params.job);
  const [editAble, setEditAble] = useState(false);

  useEffect(() => {}, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CustomButton
          label={editAble ? "Hủy chỉnh sửa" : "Chỉnh Sửa"}
          style={{ marginTop: 0 }}
          styleText={{ color: COLORS.accent }}
          onPress={() => {
            navigation.navigate("EditPost", {job})
          }}
        />
      ),
    });
  }, [editAble]);

  const headerCardInfoJob = (title, startTimestamp) => {
    return (
      <View>
        <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
          {title.toUpperCase()}
        </AppText>
        <AppText style={{ fontSize: 15 }}>
          Bắt đầu vào lúc:
          <AppText
            style={{
              color: COLORS.accent,
              fontSize: 17,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            {formatDateTime(startTimestamp).DDMYTS}
          </AppText>
        </AppText>
      </View>
    );
  };

  const bodyCardInfoJob = (timeJob, money, address, textNote) => {
    return (
      <View style={{ rowGap: 5, paddingHorizontal: 10 }}>
        <View
          id="benifit"
          style={{
            flexDirection: "row",
            borderWidth: 0.5,
            borderColor: "grey",
            borderRadius: 5,
            padding: 10,
            justifyContent: "space-around",
          }}
        >
          <View id="time" style={{ alignItems: "center" }}>
            <AppText>Làm trong</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              {timeJob}
            </AppText>
          </View>

          <View id="money" style={{ alignItems: "center" }}>
            <AppText>Số tiền(VND)</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              {formatMoney(money)}
            </AppText>
          </View>
        </View>

        <View id="address" style={{ flexDirection: "row" }}>
          <AppText>Tại: </AppText>
          <AppText fontWeight={"bold"}>{address}</AppText>
        </View>
        <View id="note-from-customer" style={{ flexDirection: "row" }}>
          <AppText>Ghi chú: </AppText>
          <AppText style={{ fontWeight: "bold" }}>{textNote}</AppText>
        </View>
      </View>
    );
  };

  const footerCardInfoJob = () => {
    return (
      <View>
        <AppText color={COLORS.accent}>alsdfjljasdfklajtdlfkj</AppText>

        <Row style={{ marginTop: 15 }}>
          <AppText style={{ marginLeft: "auto" }}>
            Đã có{" "}
            <AppText color={COLORS.accent} fontWeight={"bold"}>
              {job.applies.length}
            </AppText>{" "}
            người nộp đơn
          </AppText>
          <TouchableOpacity>
            <Row style={{ columnGap: 0, marginTop: 0 }}>
              <AppText color={COLORS.accent}>Xem</AppText>
              <AntDesign name="right" size={18} color={COLORS.accent} />
            </Row>
          </TouchableOpacity>
        </Row>
      </View>
    );
  };

  const handleAcceptJob = async () => {
    if (!acceptJob) {
      Alert.alert(
        "CẢNH BÁO",
        "Vui lòng đọc kỹ yêu cầu và nhấn vào nút Xác Nhận bên dưới trước khi nhận việc"
      );
      return;
    }
    const postRef = doc(db, "posts", job._id);
    const update = await updateDoc(postRef, {
      applies: arrayUnion(user.uid),
    })
      .then(() => {
        console.log("YOU ACCEPTED JOB");
      })
      .catch((err) => console.log(err));
  };
  return (
    <AppSafeAreaView style={{ paddingHorizontal: 10 }}>
      <CustomCard
        header={headerCardInfoJob(job.title, job.start)}
        body={bodyCardInfoJob(
          job.timeHire,
          job.money,
          job.address,
          job.textNote
        )}
        footer={footerCardInfoJob()}
        style={{
          rowGap: 15,
          backgroundColor: "white",
          paddingHorizontal: 30,
          paddingVertical: 15,
        }}
      />
    </AppSafeAreaView>
  );
}