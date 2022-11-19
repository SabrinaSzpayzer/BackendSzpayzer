import twilio from "twilio";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv"

// dotenv

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(path.join(__dirname, "../.env"))
})

const accountSid = process.env.accSID;
const authToken = process.env.authToken;

const client = twilio(accountSid, authToken)

async function sendWhatsapp (body) {

    try {
        const message = await client.messages.create({
            body: body,
            from: "whatsapp:+14155238886",
            to: process.env.whatsapp
        })
    } catch (error) {
        console.log(error)
    }

}

export default sendWhatsapp