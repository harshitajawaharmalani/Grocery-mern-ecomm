# Grocery-mern-ecomm
This is a comprehensive Full-Stack application designed to provide a seamless online shopping experience for groceries. It includes separate interfaces for customers and administrators to manage products and orders efficiently.

***Key Features***                                   
User Authentication: Secure signup and login using JWT (JSON Web Tokens).

Product Management: Admin dashboard to add, edit, and delete grocery items with image upload support.

Shopping Cart: Fully functional cart with the ability to add/remove items and adjust quantities.

Wishlist & Checkout: Users can save items for later and proceed through a structured checkout process.

Order Management: Real-time order tracking for users and status management for admins.

Responsive UI: Mobile-first design built using React and Tailwind CSS.

***Tech Stack***                                         
Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Security: JWT, Bcrypt for password hashing          

***Installation & Setup***  

***1. Prerequisites***                             
Node.js installed

MongoDB account (Atlas or local)

Cloudinary account (for image hosting)

***2. Backend Setup***                            
Navigate to the backend directory:
cd Backend

Install dependencies:
npm install     

***Create a .env file and add your credentials:***

PORT=5000                          
MONGODB_URI=your_mongodb_uri                   
JWT_SECRET=your_jwt_secret                     
CLOUDINARY_CLOUD_NAME=your_name                  
CLOUDINARY_API_KEY=your_key                   
CLOUDINARY_API_SECRET=your_secret

Start the server:
npm run dev

***3. Frontend Setup***                                                                                                                                                                                                   
Navigate to the frontend directory:
cd frontend

Install dependencies:
npm install

Start the development server:
npm run dev
