import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const CURRENT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))

export const PORT = 8080;
export const PUBLIC_DIRECTORY = path.join(CURRENT_DIRECTORY, "public")
export const CHALLENGE_DIRECTORY = path.join(CURRENT_DIRECTORY, "challenges")
export const LOG_DIRECTORY = path.join(CURRENT_DIRECTORY, "logs")

if (!fs.existsSync(LOG_DIRECTORY)){
    fs.mkdirSync(LOG_DIRECTORY);
}
