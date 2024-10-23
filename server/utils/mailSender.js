import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.example.com', 
      port: Number(process.env.MAIL_PORT) || 465, 
      secure: true, 
      auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
      },
      logger: true, 
      debug: true,  
  });
  
  transporter.verify((error, success) => {
      if (error) {
          console.error('Error in transporter configuration:', error);
      } else {
          console.log('SMTP Server is ready to take messages:', success);
      }
  });

    const info = await transporter.sendMail({
      from: "Lando - For Professionals",
      to: email,
      subject: title,
      html: body,
    });

    console.log("INFO", info);
    return info;
  } catch (err) {
    console.error(err.message);
  }
};

export default mailSender;
