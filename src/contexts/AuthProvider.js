import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  doc,
  where,
} from "firebase/firestore";

import Spin from "../components/Spin";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yourLocation, setYourLocation] = useState(null);
  console.log("🚀 ~ AuthProvider ~ yourLocation:", yourLocation);
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const collectionRef = collection(db, "users");
        const q = query(
          collectionRef,
          where("uid", "==", authenticatedUser.uid)
        );
        const querySnapshot = await getDocs(q).then((qr) => {
          qr.forEach(async (doc1) => {
            setUser({ ...doc1.data(), _id: doc1.id });
            // await setDoc(doc(db, `users/${doc1.data().uid}`), {...doc1.data()})
          });
        });

        // setUser(authenticatedUser);
        // setUser(prev => {
        //   ...prev,
        // })
        return;
      } else {
        setUser(null);
      }
    });

    return unsubcribe;
  }, []);

  useEffect(() => {
    if(yourLocation) return;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let location = await Location.getCurrentPositionAsync({});
      console.log("🚀 ~ location:", location)
      if (status !== "granted") {
        console.log("🚀 ~ status:", status);

        setErrorMsg("Permission to access location was denied");
        return;
      }

      
      
      setYourLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [yourLocation]);

  useEffect(() => {
    if (yourLocation) {
      const timeRef = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => {
        clearTimeout(timeRef);
      };
    }
  }, [yourLocation, user]);



  return (
    <AuthContext.Provider value={{ user, setUser, yourLocation }}>
      {loading ? <Spin /> : children}
    </AuthContext.Provider>
  );
}
