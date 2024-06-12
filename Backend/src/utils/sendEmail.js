import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "srivardhan1732988@gmail.com",
    pass: "qvcu stou tbyh jhcw",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(studentInfo, facultyMail) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "<srivardhan1732988@gmail.com>", // sender address
    to: `${facultyMail}`, // list of receivers
    subject: "Letter Approval (System Generated)", // Subject line
    html: `
      <html>
        <body>
          <h1>Letter Approval Notification</h1>
          <p>Dear Sir/Madam,</p>
          <p>The letter has been generated and is awaiting approval.</p>
          <p>Please review the details below:</p>
          <ul>
            <li>Name: ${studentInfo.rollNum}</li>
            <li>Branch: ${studentInfo.branch}</li>
            <li>Letter Type: ${studentInfo.letter}</li>
            <li>Reason: ${studentInfo.reason}</li>
            <li>Letter Link (for info): ${studentInfo.letterLink}</li>
            <li>Approve Here: ${studentInfo.approveLink}</li>
            <li>Student email: ${studentInfo.email}</li>
          </ul>
          <p>If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>Letter Approval Team</p>
        </body>
      </html>
    `, // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
export default main;
