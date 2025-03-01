import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const SECRET="CoderCoder123"
export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePassword=(password,encryptedPassword)=>bcrypt.compareSync(password,encryptedPassword)
