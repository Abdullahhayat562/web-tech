# Assignment 3 - Dynamic Product Catalog Integration

This project extends the `labtask-2` Express/EJS application with a MongoDB-backed product catalog.

## Features

- Mongoose `Product` schema with `name`, `price`, `category`, `rating`, `stock`, and `imageUrl`
- Seed script with 32 sample products and relevant product image URLs
- `/products` route rendered with EJS
- Server-side pagination with 8 products per page
- Search by product name
- Category filtering
- Minimum and maximum price filtering
- Sorting by newest, price, rating, and stock

## Project Structure

```text
assignment-3/
├── models/
│   └── Product.js
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
├── views/
│   ├── homepage.ejs
│   ├── contact-us.ejs
│   └── products.ejs
├── package.json
├── seedProducts.js
├── server.js
└── README.md
```

## Setup

Install dependencies:

```bash
npm install
```

Start MongoDB locally, then seed the database:

```bash
npm run seed
```

Run the seed command again whenever you want to refresh existing products with the latest image URLs.

Run the application:

```bash
npm start
```

Open these routes:

- Homepage: `http://localhost:3000/`
- Product catalog: `http://localhost:3000/products`
- Example filtered page: `http://localhost:3000/products?search=watch&minPrice=100&maxPrice=250&page=1`

## MongoDB Connection

By default, the app uses:

```text
mongodb://127.0.0.1:27017/assignment3_catalog
```

To use another database, set the `MONGO_URI` environment variable before running the seed or server command.
