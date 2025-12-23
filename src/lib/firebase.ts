import Constants from "expo-constants";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const extra = Constants.expoConfig?.extra as any;
const firebaseConfig = extra?.firebase;

if (!firebaseConfig) {
  console.warn("Firebase config ausente em expo.extra.firebase. Preencha app.json.");
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig ?? {});

let authInstance;
try {
  // Require dinâmico para evitar erro de resolução e permitir fallback quando o native module não está presente
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const asyncStorage = require("@react-native-async-storage/async-storage").default;
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(asyncStorage),
  });
} catch (err) {
  console.warn("Auth em modo de memória (AsyncStorage indisponível). Refaça o dev build para persistir sessão.");
  authInstance = getAuth(app);
}

export const db = getFirestore(app);
export const auth = authInstance;
