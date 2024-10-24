![image](https://github.com/user-attachments/assets/c9834afc-7a4a-4b15-bfea-b89870ca2d9d)


# 👗 Fashion Fusion - A Fashion Store Management Platform 🛍️

Fashion Fusion is a MERN stack-based platform designed to empower fashion store owners by providing an all-in-one solution for managing inventory, staying updated with fashion news, and utilizing AI for news summarization and demand forecasting. The platform also integrates secure payment subscription services using Razorpay.

![image](https://github.com/user-attachments/assets/70ed1197-c73d-4ee0-ada0-280c3cc3b463)



Fashion Fusion enables store owners to:
- Manage inventory with ease.
- Trend analysis using google treds API.
- Leverage ARIMA model to forecast future product demand.
- User llama-3.1-70b-versatile LLM to generate news summaries of Web articels and blogs.
- Securely manage subscription payments through Razorpay integration.

⚠️ INFO 
Demand forecasting works better on large sample data of entries.



## 🛠️ Technologies Used

- **MongoDB**: NoSQL database for flexible and scalable data storage.
- **Express.js**: Web framework to build the server-side logic.
- **React**: Library for creating dynamic and interactive front-end interfaces.
- **Node.js**: Server-side runtime environment for handling requests and business logic.
- **Tailwind CSS**: Utility-first CSS framework for sleek and responsive UI design.
- **TanStack Query (React Query)**: Efficient data fetching and state management for the front-end.
- **Razorpay**: Secure payment gateway for subscription management.
- **Django**: Python-based web framework that can be used to handle the server-side logic for AI integration and additional features.
---

## 🔑 Key Features

- **Inventory Management**: Admins can add, edit, and delete products and track inventory levels.
- **Fashion News Updates**: Stay up to date with fashion news powered by News API and ChatGroq.
- **Demand Forecasting**: ARIMA is integrated to predict demand for inventory products.
- **Trend Analysis**: Trend Analysis using Google Trends API
- **Subscription Payment System**: Integrated with Razorpay for secure and efficient payment processing.
- **User-Friendly UI**: Built with Tailwind CSS for a sleek, mobile-responsive user interface.

---

## 🛠️ Setup and Installation

To set up and run the project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/fashion-fusion.git


setup vars 

MONGO_URI=
PORT=
JWT_SECRET=
CLOUDINARY_API_KEY =
CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_SECRET =
MAIL_HOST=
MAIL_USER=
MAIL_PASS=
MAIL_PORT=
RAZORPAY_KEY_ID =
RAZORPAY_KEY_SECRET =
VITE_RAZORPAY_KEY_ID=
