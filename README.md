
# ShopSee

ShopSee is a full-featured e-commerce platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with integrated payment processing using Stripe.

## Features

- **Product Management**: Add, edit, delete, and manage products.
- **User Authentication**: Secure authentication and authorization with JWT.
- **Shopping Cart**: Add products to cart and manage orders.
- **Order Management**: Track and manage customer orders.
- **Stripe Payment Gateway**: Secure and efficient payment processing.
- **Responsive Design**: Fully responsive UI for all device sizes.
- **Admin Dashboard**: Manage users, products, and orders with an intuitive admin panel.

## Tech Stack

- **MongoDB**: NoSQL database for storing product, user, and order data.
- **Express.js**: Backend framework for building RESTful APIs.
- **React.js**: Frontend library for building user interfaces.
- **Node.js**: Server-side JavaScript runtime environment.
- **Stripe**: Payment gateway for processing credit card payments.

## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB database
- Stripe account for payment integration

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shopsee.git
   cd shopsee
Install server dependencies

bash
Copy code
cd backend
npm install
Install client dependencies

bash
Copy code
cd ../frontend
npm install
Set up environment variables

Create a .env file in the backend directory and add the following:

env
Copy code
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
Run the application

To run the server:

bash
Copy code
cd backend
npm run dev
To run the client:

bash
Copy code
cd ../frontend
npm start
The server will start on http://localhost:5000 and the client on http://localhost:3000.

Usage
Register and log in as a user.
Browse products and add them to your shopping cart.
Proceed to checkout and make payments using Stripe.
Admins can manage products, users, and orders through the admin panel.
Stripe Integration
Stripe is used for handling secure payments.
Ensure you have a Stripe account and replace the STRIPE_SECRET_KEY in the .env file with your own.
Payment processing is handled on the backend using Stripe's SDK.
Contributing
Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For any questions or feedback, please contact [adityara424@gmail.com].
