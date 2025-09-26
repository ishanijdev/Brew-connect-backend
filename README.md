# ☕ Bréw Connect - Backend API

This is the backend server for the Bréw Connect full-stack e-commerce application. It is a RESTful API built with Node.js and Express, connected to a MongoDB database. It handles all data management, user authentication, and business logic.

**Live API URL:** [https://coffee-leaf-api.onrender.com](https://coffee-leaf-api.onrender.com) 

---

## Features

* **RESTful API:** A complete set of endpoints to manage products, users, carts, and orders.
* **User Authentication & Authorization:** Secure user registration and login using JSON Web Tokens (JWT). Passwords are encrypted using `bcryptjs`.
* **Middleware Protection:** Custom middleware ensures that sensitive routes are only accessible to authenticated users.
* **Data Modeling:** Mongoose schemas define the structure for products, users, and orders.
* **Custom Business Logic:** Includes a unique endpoint for filtering products based on "mood" tags.
* **Simulated Order Processing:** Backend logic to create an order and mark it as paid, simulating a successful transaction.

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT), bcrypt.js
---

## API Endpoints

| Method | Endpoint                    | Description                           | Access    |
| :----- | :-------------------------- | :------------------------------------ | :-------- |
| `GET`  | `/api/products`             | Get all products                      | Public    |
| `GET`  | `/api/products/mood/:mood`  | Get products filtered by mood tag     | Public    |
| `POST` | `/api/users/register`       | Register a new user                   | Public    |
| `POST` | `/api/users/login`          | Authenticate a user and get a token   | Public    |
| `GET`  | `/api/cart`                 | Get the logged-in user's cart         | Private   |
| `POST` | `/api/cart`                 | Add an item to the user's cart        | Private   |
| `DELETE`| `/api/cart/:productId`      | Remove an item from the user's cart   | Private   |
| `DELETE`| `/api/cart`                 | Clear all items from the user's cart  | Private   |
| `POST` | `/api/orders`               | Create a new order                    | Private   |
| `GET`  | `/api/orders/myorders`      | Get all orders for the logged-in user | Private   |

---

## Environment Variables

To run this project, you will need to add a `.env` file in the root of the `backend` folder with the following variables:

`MONGO_URI=`
`JWT_SECRET=`

---

## Setup and Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/ishanijdev/coffee-leaf-backend.git](https://github.com/ishanijdev/coffee-leaf-backend.git)
    ```
2.  Navigate into the project directory:
    ```bash
    cd coffee-leaf-backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root and add the required variables from the section above.
5.  Run the server:
    ```bash
    node server.js
    ```