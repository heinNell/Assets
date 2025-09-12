import { getDefaultConfig } from "expo/metro-config";
import { fileURLToPath, URL } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const config = getDefaultConfig(__dirname);

export default config;
