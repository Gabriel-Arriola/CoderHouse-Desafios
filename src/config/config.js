import dotenv from "dotenv";

dotenv.config(
    {
        path: "./src/.env.dev", 
        override: true
    }
)

export const config={
    PORT: process.env.PORT||8000,
    MONGO_URL: process.env.MONGO_URL, 
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLAVE_CLIENT_SECRET: process.env.CLAVE_CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL,
    GMAIL_EMAIL: process.env.GMAIL_EMAIL,
    GMAIL_PASS: process.env.GMAIL_PASS,
    ENTORNO: process.env.ENTORNO||"test"
}
