# **News API Project - README**

## **Project Overview**

The **News API Project** is a full-stack web application that fetches news articles from the [News API](https://newsapi.org/) and allows users to filter, save, and manage news data within a **MongoDB database**. It includes **user authentication, profile management, and an admin dashboard** for managing users.

## **Technologies Used**

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **API Used**: [News API](https://newsapi.org/)

## **Installation Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/Mannu14/pgagi-analytics-dashboard
   ```
2. Navigate to the project directory:
   ```bash
   cd pgagi-analytics-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URL=<your_mongodb_connection_string>
   SECRET_KEY=<your_jwt_secret_key>
   SESSION_SECRET=<SESSION_SECRET>
   PORT=<PORT>
   FRONTEND_APIKEY1=<your_newsapi_key1>
   FRONTEND_APIKEY2=<your_newsapi_key2>
   GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>
   GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>
   NODE_ENV=<NODE_ENV>
   ```

## **How to Run the Project**

1. Start the application:
   ```bash
   npm start
   ```
2. Open the browser and navigate to:
   - `http://localhost:3000/Auth` – Login page
   - `http://localhost:3000/NewsApi` – News feed

## **Testing Instructions**

To run tests:

```bash
npm test
```

To check test coverage:

```bash
npm run coverage
```

## **Deployment Details**

If deployed, access the live application here:
[Live Demo Link](#)

### **Deployment Notes**

- Ensure environment variables are correctly set up on the hosting platform.
- Use a database service like **MongoDB Atlas** for production.

## **Environment Variables**

The following environment variables are required:

- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – Secret key for JWT authentication
- `NEWS_API_KEY` – API key for fetching news from NewsAPI.org

## **API Setup**

To obtain a **News API Key**:

1. Visit [News API](https://newsapi.org/)
2. Sign up and generate an API key
3. Add the key to your `.env` file

## **Additional Notes**

- Users can sign up and log in with secure JWT authentication.
- Admins have access to view, edit, and delete users.
- News articles can be filtered based on category, source, and date.

## **Screenshots**

- **Login Page:**

- **News Feed:**

- **Admin Dashboard:**

