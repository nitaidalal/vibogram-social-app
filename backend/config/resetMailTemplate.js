export const getResetPasswordOTPTemplate = (otp, username = "User") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0F0F14; font-family:Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F0F14; padding:20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="480px" cellpadding="0" cellspacing="0" style="background-color:#1A1A23; border-radius:12px; padding:30px; box-shadow:0 10px 30px rgba(0,0,0,0.4);">
              
              <!-- Logo / App Name -->
              <tr>
                <td align="center" style="font-size:28px; font-weight:bold; color:#FFFFFF; padding-bottom:10px;">
                  Vibogram
                </td>
              </tr>
  
              <!-- Heading -->
              <tr>
                <td align="center" style="font-size:20px; font-weight:bold; color:#8B5CF6; padding-bottom:10px;">
                  Reset Your Password
                </td>
              </tr>
  
              <!-- Greeting -->
              <tr>
                <td style="font-size:14px; color:#E5E7EB; padding-bottom:20px; text-align:center;">
                  Hi <strong>${username}</strong>,<br/>
                  We received a request to reset your Vibogram password.
                </td>
              </tr>
  
              <!-- OTP Box -->
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <div style="
                    display:inline-block;
                    background:linear-gradient(135deg, #8B5CF6, #EC4899);
                    color:#FFFFFF;
                    font-size:28px;
                    font-weight:bold;
                    letter-spacing:6px;
                    padding:14px 28px;
                    border-radius:8px;
                  ">
                    ${otp}
                  </div>
                </td>
              </tr>
  
              <!-- Instructions -->
              <tr>
                <td style="font-size:14px; color:#D1D5DB; text-align:center; padding-bottom:10px;">
                  Enter this OTP to reset your password.
                </td>
              </tr>
  
              <tr>
                <td style="font-size:13px; color:#9CA3AF; text-align:center; padding-bottom:20px;">
                  This OTP is valid for <strong>5 minutes</strong>.  
                  Do not share it with anyone.
                </td>
              </tr>
  
              <!-- Security Note -->
              <tr>
                <td style="font-size:12px; color:#6B7280; text-align:center; padding-bottom:20px;">
                  If you didn’t request a password reset, you can safely ignore this email.
                </td>
              </tr>
  
              <!-- Footer -->
              <tr>
                <td style="font-size:12px; color:#6B7280; text-align:center; border-top:1px solid #2A2A35; padding-top:15px;">
                  © ${new Date().getFullYear()} Vibogram. All rights reserved.
                </td>
              </tr>
  
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
};
