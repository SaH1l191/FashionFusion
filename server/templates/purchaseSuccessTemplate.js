const purchaseSuccessTemplate = (name, plan, duration) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Subscription Purchase Successful</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #3498db;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        h1 {
          color: #2c3e50;
          margin-top: 0;
        }
        .highlight {
          font-weight: bold;
          color: #3498db;
        }
        .footer {
          background-color: #ecf0f1;
          color: #7f8c8d;
          text-align: center;
          padding: 10px;
          font-size: 0.8em;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #3498db;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://i.ibb.co/MPhPcSs/image.png" alt="FashionFusion Logo" style="max-width: 150px;" />
        </div>
        <div class="content">
          <h1>Subscription Purchase Successful</h1>
          <p>Dear ${name},</p>
          <p>Thank you for subscribing to FashionFusion! Your purchase was successful, and we're excited to have you on board.</p>
          <p>Here are the details of your subscription:</p>
          <ul>
            <li>Plan: <span class="highlight">${plan}</span></li>
            <li>Duration: <span class="highlight">${duration}</span></li>
          </ul>
          <p>We hope you enjoy your premium features and have a fantastic experience with FashionFusion.</p>
          <p>If you have any questions or need assistance, our support team is always here to help.</p>
          <a href="https://fashionfusion.com/account" class="button">View Your Account</a>
        </div>
        <div class="footer">
          <p>&copy; 2023 FashionFusion. All rights reserved.</p>
          <p>
            <a href="https://fashionfusion.com/privacy">Privacy Policy</a> | 
            <a href="https://fashionfusion.com/terms">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
  </html>`;
};

export default purchaseSuccessTemplate;
