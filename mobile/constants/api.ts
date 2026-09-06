import { Platform } from "react-native";

const IP = '192.168.1.11'

export const BASE_URL = Platform.select({
    android: `http://${IP}:5050`,
    ios: `http://${IP}:5050`,
    default: `http://localhost:5050`
});