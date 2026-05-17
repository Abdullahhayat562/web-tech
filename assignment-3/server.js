// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Initialize an express application
const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS_PER_PAGE = 8;
const mongoUri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assignment3_catalog";
const productImageUrl = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
const homepageFallbackProducts = [
  {
    name: "Legacy Slim Auto Watch",
    price: 229,
    category: "Watches",
    imageUrl: productImageUrl("photo-1523170335258-f5ed11844a49"),
  },
  {
    name: "Odyssey II Automatic Watch",
    price: 299,
    category: "Watches",
    imageUrl: productImageUrl("photo-1524592094714-0f0654e20314"),
  },
  {
    name: "Field Chrono Watch",
    price: 179,
    category: "Watches",
    imageUrl: productImageUrl("photo-1508685096489-7aacd43bd3b1"),
  },
  {
    name: "Minimal Sport Watch",
    price: 149,
    category: "Watches",
    imageUrl: productImageUrl("photo-1434056886845-dac89ffe9b56"),
  },
];

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(function () {
    console.log("Connected to MongoDB");
  })
  .catch(function (error) {
    console.error("MongoDB connection error:", error.message);
  });

// Define a route for the root URL ('/')
app.get("/", async function (req, res) {
  try {
    const featuredProducts = await Product.find({
      category: "Watches",
      imageUrl: { $exists: true, $ne: "" },
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(4)
      .lean();

    return res.render("homepage", {
      featuredProducts:
        featuredProducts.length > 0
          ? featuredProducts
          : homepageFallbackProducts,
    });
  } catch (error) {
    console.error("Homepage products error:", error.message);

    return res.render("homepage", {
      featuredProducts: homepageFallbackProducts,
    });
  }
});

// Display products from MongoDB with pagination, search, and filters
app.get("/products", async function (req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();
    const parsedMinPrice = req.query.minPrice ? Number(req.query.minPrice) : "";
    const parsedMaxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : "";
    const minPrice = Number.isNaN(parsedMinPrice) ? "" : parsedMinPrice;
    const maxPrice = Number.isNaN(parsedMaxPrice) ? "" : parsedMaxPrice;
    const sort = req.query.sort || "newest";

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== "" || maxPrice !== "") {
      query.price = {};

      if (minPrice !== "") {
        query.price.$gte = minPrice;
      }

      if (maxPrice !== "") {
        query.price.$lte = maxPrice;
      }
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      "rating-high": { rating: -1 },
      "stock-low": { stock: 1 },
    };

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.max(Math.ceil(totalProducts / PRODUCTS_PER_PAGE), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const [products, categories] = await Promise.all([
      Product.find(query)
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip(skip)
        .limit(PRODUCTS_PER_PAGE),
      Product.distinct("category"),
    ]);

    return res.render("products", {
      products,
      categories: categories.sort(),
      currentPage,
      totalPages,
      totalProducts,
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sort,
      },
    });
  } catch (error) {
    console.error("Products route error:", error.message);
    return res.status(500).send("Unable to load products.");
  }
});

// Define a route for the '/contact-us' page
app.get("/contact-us", function (req, res) {
  // Render the 'contact-us.ejs' view
  return res.render("contact-us");
});

// Start the server on port 3000
app.listen(PORT, function () {
  console.log(`Server Started at localhost:${PORT}`);
});

// Log a message to indicate that the server.js file is being executed
console.log("Console from server.js file");
