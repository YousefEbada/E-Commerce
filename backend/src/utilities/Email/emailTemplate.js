
import jwt from "jsonwebtoken";

const emailTemplate = (email) => {
  const tokenMail = jwt.sign({ email: email }, process.env.JWT_SECRET);
  return (
    `
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table
          align="center"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.1);"
        >
          <tr>
            <td style="background-color:#1449e7; padding:20px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
              NTI E-Commerce
            </td>
          </tr>
          <tr>
            <td style="padding:30px; text-align:center; color:#333;">
              <h2 style="color:#20368a; margin-bottom:20px;">
                Verify Your Email Address
              </h2>
              <p style="font-size:16px; line-height:1.5; margin-bottom:30px;">
                Thank you for registering with <strong>Afaq</strong>! Please
                confirm your email address by clicking the button below.
              </p>
              <a
                href="http://localhost:5000/users/verify/${tokenMail}"
                style="background-color:#1449e7; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:6px; font-size:16px; font-weight:bold; cursor:pointer; display:inline-block;"
              >
                Verify Email
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f4f4; padding:20px; text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Afaq. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      `
  );
};

export default emailTemplate;
