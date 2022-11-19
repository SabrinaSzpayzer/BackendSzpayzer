import { createTransport } from "nodemailer";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

// dotenv

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(path.join(__dirname, "../.env"))
})

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.mail,
        pass: process.env.mailPass
    }
})


async function sendEmail (subject, bodyTitle, bodyText) {

    const mailOptions = {
        from: "Node Server",
        to: process.env.mail,
        subject: subject,
        html: `<h1>'${bodyTitle}'</h1><span>'${bodyText}'</span>`
    }
    
    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail