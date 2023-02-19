import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { IUser } from '../interface/IUser';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

class Email2 {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: IUser, url = '') {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) Render HTML based on a pug template
    console.log('STIRNG', `${__dirname}/email/${template}.pug`, 20000);
    const html = pug.renderFile(`${__dirname}/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // console.log(html);

    // 2) Define email options
    const mailOptions: IMailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    console.log('mail options', mailOptions);

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Sharic Inc!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}

export default Email2;
