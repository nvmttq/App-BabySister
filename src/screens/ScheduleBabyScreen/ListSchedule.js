import { StatusBar } from "expo-status-bar";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";

import {
  addDoc,
  orderBy,
  collection,
  query,
  onSnapshot,
  or,
  where,
  getDocs,
  and,
  doc,
} from "firebase/firestore";

import DateTimePicker from "@react-native-community/datetimepicker";

import { MaterialIcons, Ionicons } from "react-native-vector-icons";

import { COLORS } from "../../constants/COLORS";

import {
  CustomButton,
  AppImage,
  AppText,
  InputGroup,
  CustomModal,
  InputField,
  AppSafeAreaView,
  Row,
  InputCheckbox,
} from "../../components";
import { db } from "../../firebase/config";
import { formatDateTime, genShortId } from "../../utils";
import EditTimeSchedule from "./EditTimeSchedule";
import { AuthContext } from "../../contexts/AuthProvider";
import { ScheduleContext } from "../../contexts/ScheduleProvider";
import { ChatPrivateContext } from "../../contexts/ChatPrivateProvider";
import * as ImagePicker from "expo-image-picker";
import AddNewTimeSchedule from "./AddNewTimeSchedule";

function ListSchedule({
  onAddTimeSchedule,
  onRemoveTimeSchedule,
  onEditTimeSchedule,
  readOnly,
  startActive,
  isDone,
  onMarkFinishTimeSchedule,
  finishTimeSchedule,
  onUploadImgTimeSchedule,
  onAddImgTimeSchedule,
}) {
  const { user } = useContext(AuthContext);
  const {timeSchedules, setTimeSchedules, childs, setChilds} = useContext(ScheduleContext);
  const [visiable, setVisiable] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(Date.now());
  const [textNote, setTextNote] = useState("");
  const [images, setImages] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [infoTimeSchedule, setInfoTimeSchedule] = useState(null);
  const [visiableUpImg, setVisiableUpImg] = useState(false);
  const [typeHandleImg, setTypeHandleImg] = useState("add");
  const [imageID, setImageID] = useState(null);
  console.log("render add time");

  const handleEditTimeSchedule = useCallback((data) => {
    setTimeSchedules((prev) =>
      prev.map((v, i) => {
        if (v.timeScheduleID === data.timeScheduleID) {
          return { ...v, ...data };
        } else return v;
      })
    );
  }, []);

  const handleRemoveTimeSchedule = useCallback((timeScheduleID) => {
    setTimeSchedules((prev) =>
      prev.filter((v, i) => v.timeScheduleID !== timeScheduleID)
    );
  }, []);
  const uploadImg = async (mode, childID) => {
    if (mode === "camera") {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log(result.assets[0]);
        result.assets[0].assetId = genShortId();
        setNewTimeSchedule((prev) => ({
          ...prev,
          images: [prev.images, result.assets[0]],
        }));
      }
    }
  };

  const header = (
    <View>
      <AppText style={{ fontWeight: "bold" }}>Thêm mới mốc thời gian</AppText>
    </View>
  );

  const footer = (
    <View
      style={{
        flexDirection: "row",
        columnGap: 10,
        marginLeft: "auto",
        marginTop: 10,
      }}
    >
      <CustomButton
        label={"Thêm"}
        style={{
          backgroundColor: COLORS.accent,

          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 5,
        }}
        onPress={() => {
          onAddTimeSchedule({
            ...newTimeSchedule,
          });
        }}
      />
      <CustomButton
        label={"Hủy"}
        style={{
          backgroundColor: COLORS.secondary,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 5,
        }}
        styleText={{ color: "black" }}
        onPress={() => {
          setVisiable(false);
        }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {infoTimeSchedule && (
        <EditTimeSchedule
          onSaveEdit={handleEditTimeSchedule}
          timeSchedule={infoTimeSchedule}
          setTimeSchedule={setInfoTimeSchedule}
          readOnly={readOnly}
        />
      )}

      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
      >
        <AppText style={{ fontWeight: "bold" }}>Các Khung giờ</AppText>
        {!readOnly && (
          <TouchableOpacity
            onPress={() => {
              setVisiable(true);
            }}
          >
            <Ionicons
              name="add"
              size={30}
              style={{ backgroundColor: COLORS.accent, color: "white" }}
            />
          </TouchableOpacity>
        )}
      </View>

      <AddNewTimeSchedule visiable={visiable} setVisiable={setVisiable} />

      {!timeSchedules.length && (
        <AppText style={{ color: "grey", fontStyle: "italic", alignSelf: 'center'}}>
          Chưa có khung giờ nào !!!
        </AppText>
      )}

      <ScrollView
        contentContainerStyle={{ rowGap: 20 }}
        style={{ marginTop: 20, flex: 1 }}
      >
        {timeSchedules.map((timeSche, i) => (
          <View
            key={i}
            style={{
              backgroundColor: COLORS.secondary,
              borderRadius: 10,
              padding: 10,
              elevation: 3,
            }}
          >
            {startActive && (
              <Row style={{ marginBottom: 10 }}>
                <InputCheckbox
                  edge={20}
                  disable={isDone || user.typeUser === 2}
                  initTick={finishTimeSchedule.some(
                    (timeID) => timeID === timeSche.scheduleID
                  )}
                  onToggle={(tick) => {
                    onMarkFinishTimeSchedule(tick, timeSche);
                  }}
                />
                <AppText style={{ fontStyle: "italic" }}>
                  {user.typeUser === 2
                    ? isDone
                      ? "Bảo mẫu chưa hoàn thành"
                      : "BM đã hoàn thành"
                    : "Đánh dấu đã hoàn thành"}
                </AppText>
              </Row>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                columnGap: 10,
                position: "relative",
              }}
            >
              <AppText fontWeight={"bold"} color={COLORS.accent}>
                {formatDateTime(timeSche.time).T}
              </AppText>

              <InputGroup
                label={
                  <AppText style={{ fontWeight: "bold" }}>Ghi Chú :</AppText>
                }
                styleInput={{ backgroundColor: "white" }}
                styleRoot={{ flex: 1 }}
                multiline={true}
                value={timeSche.textNote}
                onChangeText={(text) => {
                  setTextNote(text);
                }}
                readOnly={true}
              />
            </View>

            <View
              id="actions"
              style={{
                flexDirection: "row",
                columnGap: 10,
                marginLeft: "auto",
              }}
            >
              <CustomButton
                label={!readOnly ? "Xem / Chỉnh Sửa" : "Xem"}
                style={{
                  backgroundColor: COLORS.accent,
                }}
                onPress={() => {
                  setInfoTimeSchedule(timeSche);
                }}
              />

              {!readOnly && (
                <CustomButton
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: COLORS.accent,
                    borderWidth: 1,
                  }}
                  styleText={{ color: "black" }}
                  icon={
                    <Ionicons name="trash" size={24} color={COLORS.accent} />
                  }
                  onPress={() => {
                    onRemoveTimeSchedule(timeSche.scheduleID);
                  }}
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(ListSchedule);
