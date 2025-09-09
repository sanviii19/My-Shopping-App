const nodemailer = require("nodemailer");

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",  //we are using gmail
//   port: 587,
//   secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

(async () => {
    try{
        await transporter.verify();
        console.log("----- Email Server is ready -----");
    }catch(err){
        console.log("----- Error connecting to Email Server -----");
        console.log(err.message);
    }
})();

const sendEmail = async (toEmail, subject, htmlText) => {
  try {
    await transporter.sendMail({
      from: `"Shopping App Team" <${process.env.SMTP_USER}>`, // sender address
      to: toEmail, // receiver's email
      subject: subject, // Subject line
      html: htmlText, // html body
    });

    console.log("----- ✅ Email Sent -----");

  } catch (err) {
    console.log("------ Error while sending mail ------");
    console.log(err.message);
    throw new Error("Email not sent");
  }
};

const sendOtpEmail = async (toEmail, otp) => {
    console.log("Sending OTP Email to ", toEmail);
    
    // HTML Template for the email
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f7fa;
                line-height: 1.6;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            .header h1 {
                font-size: 28px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .welcome-text {
                font-size: 18px;
                color: #4a5568;
                margin-bottom: 30px;
                line-height: 1.5;
            }
            .otp-container {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
                box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
            }
            .otp-label {
                font-size: 14px;
                color: white;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 500;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .info-text {
                color: #718096;
                font-size: 14px;
                margin: 25px 0;
                line-height: 1.6;
            }
            .warning-box {
                background-color: #fef5e7;
                border-left: 4px solid #f6ad55;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }
            .warning-text {
                color: #744210;
                font-size: 14px;
                font-weight: 500;
            }
            .footer {
                background-color: #f8fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-text {
                color: #a0aec0;
                font-size: 12px;
                line-height: 1.5;
            }
            .company-name {
                color: #667eea;
                font-weight: 600;
            }
            @media (max-width: 600px) {
                .email-container {
                    margin: 0 10px;
                }
                .header, .content, .footer {
                    padding: 25px 20px;
                }
                .otp-code {
                    font-size: 28px;
                    letter-spacing: 6px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🛍️ Shopping App</h1>
                <p>Verify your email address</p>
            </div>
            
            <div class="content">
                <p class="welcome-text">
                    Welcome! You're almost ready to start shopping with us. 
                    Please verify your email address by entering the OTP code below:
                </p>
                
                <div class="otp-container">
                    <div class="otp-label">Your verification code</div>
                    <div class="otp-code">${otp}</div>
                </div>
                
                <p class="info-text">
                    Enter this code in the verification field to complete your account setup.
                    This code is valid for <strong>10 minutes</strong>.
                </p>
                
                <div class="warning-box">
                    <div class="warning-text">
                        🔒 For security reasons, never share this code with anyone. 
                        Our team will never ask for your verification code.
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    This email was sent by <span class="company-name">Shopping App</span><br>
                    If you didn't request this verification, you can safely ignore this email.<br>
                    <br>
                    Need help? Contact our support team at support@shoppingapp.com
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendEmail(
        toEmail,
        "Verify Your Email - Shopping App",
        htmlTemplate
    );
}

module.exports = { sendOtpEmail };