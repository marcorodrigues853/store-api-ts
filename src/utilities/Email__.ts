import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class Email {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public async sendEmail(to: string, subject: string, text: string, link: URL) {
    const mailOptions = {
      from: `"ALEX AGEEV" <${process.env.EMAIL_NO_REPLY}>`,
      to,
      subject,
      text,
      html: `
      <div>
        <h1>Reset Password</h1>
        <a href="${text}">${link}</a>
      </div>
    `,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  public send(template: string, subject: string) {
    //
    console.log(template, subject);
  }
  public async sendWelcome() {
    await this.send('welcome', 'Welcome to the  Family!');
  }
  async sendPasswordReset() {
    await this.send(
      'Reset',
      'Your password reset token (valid for only 60 minutes)',
    );
  }
}

export default new Email();
