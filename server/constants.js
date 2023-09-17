import path from "path";
import { fileURLToPath } from 'url';

const CURRENT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))

export const PORT = 8080;
export const PUBLIC_DIRECTORY = path.join(CURRENT_DIRECTORY, "..", "public")
export const CHALLENGE_DIRECTORY = path.join(CURRENT_DIRECTORY, "..", "challenges")
