import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "srivardhan1732988@gmail.com",
    pass: "qvcu stou tbyh jhcw",
  },
  secure: true,
});

// async..await is not allowed in global scope, must use a wrapper

async function main(studentInfo, facultyMail) {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: "<your-email@gmail.com>", // Sender address
      to: `${facultyMail}`, // List of receivers
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
              <li>Letter Type: ${studentInfo.type}</li>
              <li>Reason: ${studentInfo.reason}</li>
              <li>Letter Link (for info): <a href="${studentInfo.letterLink}">View Letter</a></li>
              <li>Approve Here: <a href="${studentInfo.approveLink}">Approve Letter</a></li>
              <li>Student Email: ${studentInfo.email}</li>
            </ul>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>Letter Approval Team</p>
          </body>
        </html>
      `,
    });

    // Log the response for debugging
    // console.log("Mail response:", info);

    // Check if the mail was accepted by any recipient
    if (!info.accepted || !info.accepted.includes(facultyMail)) {
      throw new Error("Mail did not reach the recipient.");
    }
    // Return a success response or log additional information if needed
    // console.log("Message sent successfully:", info.messageId);
    return info;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error in sending mail:", error.message);
    throw error; // Re-throw the error for further handling if needed
  }
}

export default main;
