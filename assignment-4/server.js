// Import required modules
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Product = require("./models/Product");

// Initialize an express application
const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS_PER_PAGE = 8;
const mongoUri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assignment4_catalog";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const productImageUrl = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
const uploadsDirectory = path.join(__dirname, "public", "uploads");
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

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueName}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }

    return cb(new Error("Only image files are allowed."));
  },
});

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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

function requestAdminLogin(res) {
  res.set("WWW-Authenticate", 'Basic realm="MVMT Admin Panel"');
  return res.status(401).send("Admin login required.");
}

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Basic ")) {
    return requestAdminLogin(res);
  }

  const credentials = Buffer.from(authHeader.slice(6), "base64")
    .toString("utf8")
    .split(":");
  const username = credentials[0];
  const password = credentials.slice(1).join(":");

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return next();
  }

  return requestAdminLogin(res);
}

function getProductInput(body, imageUrl) {
  const price = String(body.price ?? "").trim();
  const rating = String(body.rating ?? "").trim();
  const stock = String(body.stock ?? "").trim();

  return {
    name: (body.name || "").trim(),
    price: price === "" ? NaN : Number(price),
    category: (body.category || "").trim(),
    rating: rating === "" ? NaN : Number(rating),
    stock: stock === "" ? NaN : Number(stock),
    imageUrl,
  };
}

function validateProductInput(productInput, requireImage) {
  const errors = [];

  if (!productInput.name) errors.push("Product name is required.");
  if (!productInput.category) errors.push("Category is required.");
  if (!Number.isFinite(productInput.price) || productInput.price < 0) {
    errors.push("Price must be a valid number.");
  }
  if (
    !Number.isFinite(productInput.rating) ||
    productInput.rating < 0 ||
    productInput.rating > 5
  ) {
    errors.push("Rating must be between 0 and 5.");
  }
  if (
    !Number.isInteger(productInput.stock) ||
    productInput.stock < 0
  ) {
    errors.push("Stock must be a whole number.");
  }
  if (requireImage && !productInput.imageUrl) {
    errors.push("Product image is required.");
  }

  return errors;
}

function renderProductForm(res, options) {
  return res.render("admin/product-form", {
    product: options.product,
    errors: options.errors || [],
    formTitle: options.formTitle,
    formAction: options.formAction,
    submitLabel: options.submitLabel,
    requireImage: options.requireImage,
  });
}

app.use("/admin", adminAuth);

app.get("/admin", function (req, res) {
  return res.redirect("/admin/products");
});

app.get("/admin/products", async function (req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const totalStock = products.reduce(
      (sum, product) => sum + Number(product.stock || 0),
      0
    );
    const totalValue = products.reduce(
      (sum, product) =>
        sum + Number(product.price || 0) * Number(product.stock || 0),
      0
    );
    const categories = [...new Set(products.map((product) => product.category))]
      .filter(Boolean)
      .sort();

    return res.render("admin/dashboard", {
      products,
      stats: {
        totalProducts: products.length,
        totalStock,
        totalValue,
        totalCategories: categories.length,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error.message);
    return res.status(500).send("Unable to load admin dashboard.");
  }
});

app.get("/admin/products/new", function (req, res) {
  return renderProductForm(res, {
    product: {},
    formTitle: "Add Product",
    formAction: "/admin/products",
    submitLabel: "Create Product",
    requireImage: true,
  });
});

app.post(
  "/admin/products",
  upload.single("image"),
  async function (req, res) {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.existingImage || "";
    const productInput = getProductInput(req.body, imageUrl);
    const errors = validateProductInput(productInput, true);

    if (errors.length > 0) {
      return renderProductForm(res, {
        product: productInput,
        errors,
        formTitle: "Add Product",
        formAction: "/admin/products",
        submitLabel: "Create Product",
        requireImage: true,
      });
    }

    try {
      await Product.create(productInput);
      return res.redirect("/admin/products");
    } catch (error) {
      console.error("Create product error:", error.message);
      return renderProductForm(res, {
        product: productInput,
        errors: ["Unable to create product. Please check the form values."],
        formTitle: "Add Product",
        formAction: "/admin/products",
        submitLabel: "Create Product",
        requireImage: true,
      });
    }
  }
);

app.get("/admin/products/:id/edit", async function (req, res) {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    return renderProductForm(res, {
      product,
      formTitle: "Edit Product",
      formAction: `/admin/products/${product._id}`,
      submitLabel: "Save Changes",
      requireImage: false,
    });
  } catch (error) {
    console.error("Edit product error:", error.message);
    return res.status(500).send("Unable to load product editor.");
  }
});

app.post(
  "/admin/products/:id",
  upload.single("image"),
  async function (req, res) {
    try {
      const existingProduct = await Product.findById(req.params.id).lean();

      if (!existingProduct) {
        return res.status(404).send("Product not found.");
      }

      const imageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : existingProduct.imageUrl;
      const productInput = getProductInput(req.body, imageUrl);
      const errors = validateProductInput(productInput, false);

      if (errors.length > 0) {
        return renderProductForm(res, {
          product: { ...existingProduct, ...productInput },
          errors,
          formTitle: "Edit Product",
          formAction: `/admin/products/${existingProduct._id}`,
          submitLabel: "Save Changes",
          requireImage: false,
        });
      }

      await Product.findByIdAndUpdate(req.params.id, productInput, {
        runValidators: true,
      });
      return res.redirect("/admin/products");
    } catch (error) {
      console.error("Update product error:", error.message);
      return res.status(500).send("Unable to update product.");
    }
  }
);

app.post("/admin/products/:id/delete", async function (req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Delete product error:", error.message);
    return res.status(500).send("Unable to delete product.");
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

app.use(function (error, req, res, next) {
  if (error instanceof multer.MulterError || error.message.includes("image")) {
    return res.status(400).send(error.message);
  }

  return next(error);
});

// Start the server on port 3000
app.listen(PORT, function () {
  console.log(`Server Started at localhost:${PORT}`);
});

// Log a message to indicate that the server.js file is being executed
console.log("Console from server.js file");
