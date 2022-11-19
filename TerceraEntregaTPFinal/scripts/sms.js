import twilio from "twilio";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

// dotenv

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(path.join(__dirname, "../.env"))
})

const accountSid = process.env.accSID;
const authToken = process.env.authToken;

const client = twilio(accountSid, authToken)

async function sendSms (phone) {

    try {
        const message = await client.messages.create({
            body: "Su pedido ha sido generado y se encuentra en proceso",
            from: "+13517775428",
            to: phone,
        })
    } catch (error) {
        console.log(error)
    }

}

export default sendSms