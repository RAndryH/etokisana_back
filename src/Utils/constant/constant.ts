import path from "path"

export const MONGO_URI = 'mongodb+srv://randryh:xrLsLv7Nwn7q0YyD@cluster0.xjaop.mongodb.net/etokisana' //'mongodb://localhost:27017/etokisana'
export const JWT_SECRET = 'e-tokisana'
export const EMAIL_HOST = 'commercegestion.com'
export const EMAIL_USERNAME = 'contact@commercegestion.com'
export const EMAIL_PASSWORD = 'Rzh398aNVtFZUu4'
export const FROM_EMAIL = 'contact@commercegestion.com'
export const EMAIL_PORT = 465
export const BCRYPT_SALT = 10
export const CLIENT_URL = 'https://www.commercegestion.com'
export const NODE_ENV = 'DEV'
export const MAILTRAP_HOST = 'sandbox.smtp.mailtrap.io'
export const MAILTRAP_PORT = 2525
export const MAILTRAP_USER = '2a6a049ea742dd'
export const MAILTRAP_PASS = '1b8d17f7b2651a'
export const PORT_DEV = 8000
export const LIMIT = '50mb'
export const EMAIL_TEMPLATE_PATH = path.join( __dirname, '../../../built/Utils/Emails/Template') // koyed path: /workspace/built/Utils/Emails/Template Local path: ../../Utils/Emails/Template