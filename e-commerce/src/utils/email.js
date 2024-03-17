import nodemailer from "nodemailer";


async function sendEmail({  to, subject, text, html, cc, bcc, attachments = [] } = {})  {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {

            user: process.env.GMAIL,
            pass: process.env.GMAILPASS,
        },

        tls : {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: `"Ahmed Hesham 👻" <${process.env.GMAIL}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
        cc,
        bcc,
        attachments
    });
    return info.rejected.length ? false: true
}

export default sendEmail