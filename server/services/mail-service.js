const nodemailer = require('nodemailer');

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      to,
      from: process.env.SMTP_USER,
      subject: `Активация аккаунта на ${process.env.SERVICE_URL}`,
      text: '',
      html: `
        <div>
          <h1>Благодарим за регистрацию на сервисе ${process.env.SERVICE_URL}</h1>
          <p>Для активации аккаунта перейдите по ссылке<br />
            <a href="${link}">${link}<a>
          </p>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
