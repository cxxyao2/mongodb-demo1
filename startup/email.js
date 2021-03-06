"use strict";
const nodemailer = require("nodemailer");
const config = require("config");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.get("mail.host"),
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.get("mail.user"), // generated ethereal user
      pass: config.get("mail.password"), // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Admin" <${config.get("mail.user")}>`, // sender address
    to: "jenniferyao1996@qq.com,", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// 可以执行这段代码：   main().catch(console.error);

// 遗忘密码后,发重新设置信
async function sendResetPwdEmail(url,destinationEmail) {
  let transporter = nodemailer.createTransport({
    host: config.get("mail.host"),
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.get("mail.user"), // generated ethereal user
      pass: config.get("mail.password"), // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Admin" <${config.get("mail.user")}>`, // sender address
    to: destinationEmail, // list of receivers
    subject: "Reset Password ✔", // Subject line
    text: "Reset Password?", // plain text body
    html: `<b>Reset password?<a href="${url}" target="_blank" rel="noopener noreferrer">click it</a></b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.sendResetPwdEmail = sendResetPwdEmail;
