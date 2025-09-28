// import nodemailer from "nodemailer";





// export const sendMail = () => {

//   // Create a test account or replace with real credentials.
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "yousefomar6464@gmail.com",
//       pass: "l z s l k s n u o s h e v p k w",
//     },
//   });

//   // Wrap in an async IIFE so we can use await.
//   async () => {
//     const info = await transporter.sendMail({
//       from: '"Afaq" <yousefomar6464@gmail.com>',
//       to: "yousefebada717@gmail.com",
//       subject: "Hello ✔",
//       text: "Hello world?", // plain‑text body
//       html: "<b>Hello world?</b>", // HTML body
//     });

//     console.log("Message sent:", info.messageId);
//   };
// };

import nodemailer from "nodemailer";
import emailTemplate from "./emailTemplate.js";

export const sendMail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yousefomar6464@gmail.com",
        pass: "l z s l k s n u o s h e v p k w", 
      },
      tls: { rejectUnauthorized: false }
    });

    const info = await transporter.sendMail({
      from: '"Yousef Ebada" <yousefomar6464@gmail.com>',
      to: email,
      subject: "Hello ✔",
      text: "Hello world?", 
      html: emailTemplate(email), 
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};

