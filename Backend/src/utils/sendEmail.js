import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "srivardhan1732988@gmail.com",
    pass: "qvcu stou tbyh jhcw",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(a = "hello", b = 167181) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"" <srivardhan1732988@gmail.com>', // sender address
    to: "srivardhanveeramalli@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    html: `<b>Hello world?</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

