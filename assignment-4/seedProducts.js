const mongoose = require("mongoose");
const Product = require("./models/Product");

const mongoUri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assignment4_catalog";

const imageUrl = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;

const sampleProducts = [
  { name: "Legacy Slim Auto Watch", price: 229, category: "Watches", rating: 4.8, stock: 18, imageUrl: imageUrl("photo-1523170335258-f5ed11844a49") },
  { name: "Odyssey II Automatic Watch", price: 299, category: "Watches", rating: 4.7, stock: 12, imageUrl: imageUrl("photo-1524592094714-0f0654e20314") },
  { name: "Field Chrono Watch", price: 179, category: "Watches", rating: 4.4, stock: 24, imageUrl: imageUrl("photo-1508685096489-7aacd43bd3b1") },
  { name: "Minimal Sport Watch", price: 149, category: "Watches", rating: 4.2, stock: 31, imageUrl: imageUrl("photo-1434056886845-dac89ffe9b56") },
  { name: "Avenue Rose Gold Watch", price: 199, category: "Watches", rating: 4.6, stock: 15, imageUrl: imageUrl("photo-1533139502658-0198f920d8e8") },
  { name: "Classic Leather Watch", price: 129, category: "Watches", rating: 4.3, stock: 22, imageUrl: imageUrl("photo-1522312346375-d1a52e2b99b3") },
  { name: "Blacktop Sunglasses", price: 95, category: "Eyewear", rating: 4.5, stock: 28, imageUrl: imageUrl("photo-1511499767150-a48a237f0083") },
  { name: "Horizon Polarized Sunglasses", price: 115, category: "Eyewear", rating: 4.6, stock: 19, imageUrl: imageUrl("photo-1572635196237-14b3f281503f") },
  { name: "Vista Round Sunglasses", price: 89, category: "Eyewear", rating: 4.1, stock: 35, imageUrl: imageUrl("photo-1508296695146-257a814070b4") },
  { name: "Monroe Cat Eye Sunglasses", price: 105, category: "Eyewear", rating: 4.4, stock: 20, imageUrl: imageUrl("photo-1574258495973-f010dfbb5371") },
  { name: "Archer Blue Light Frames", price: 79, category: "Eyewear", rating: 4.0, stock: 26, imageUrl: imageUrl("photo-1591076482161-42ce6da69f67") },
  { name: "Ridge Aviator Sunglasses", price: 99, category: "Eyewear", rating: 4.3, stock: 16, imageUrl: imageUrl("photo-1577803645773-f96470509666") },
  { name: "Curb Chain Bracelet", price: 65, category: "Jewelry", rating: 4.5, stock: 40, imageUrl: imageUrl("photo-1611591437281-460bfbe1220a") },
  { name: "Signet Ring", price: 75, category: "Jewelry", rating: 4.2, stock: 18, imageUrl: imageUrl("photo-1605100804763-247f67b3557e") },
  { name: "Layered Pendant Necklace", price: 85, category: "Jewelry", rating: 4.7, stock: 21, imageUrl: imageUrl("photo-1515562141207-7a88fb7ce338") },
  { name: "Minimal Hoop Earrings", price: 55, category: "Jewelry", rating: 4.1, stock: 34, imageUrl: imageUrl("photo-1599643478518-a784e5dc4c8f") },
  { name: "Braided Leather Bracelet", price: 45, category: "Jewelry", rating: 4.0, stock: 27, imageUrl: imageUrl("photo-1611652022419-a9419f74343d") },
  { name: "Stacked Band Ring Set", price: 69, category: "Jewelry", rating: 4.4, stock: 23, imageUrl: imageUrl("photo-1603561596112-db1d9f0d85fb") },
  { name: "Travel Watch Roll", price: 59, category: "Accessories", rating: 4.6, stock: 25, imageUrl: imageUrl("photo-1542291026-7eec264c27ff") },
  { name: "Leather Card Holder", price: 49, category: "Accessories", rating: 4.2, stock: 33, imageUrl: imageUrl("photo-1627123424574-724758594e93") },
  { name: "Canvas Weekender Bag", price: 139, category: "Accessories", rating: 4.5, stock: 11, imageUrl: imageUrl("photo-1553062407-98eeb64c6a62") },
  { name: "Desk Charging Tray", price: 39, category: "Accessories", rating: 4.1, stock: 30, imageUrl: imageUrl("photo-1516321318423-f06f85e504b3") },
  { name: "Wireless Earbuds Case", price: 29, category: "Accessories", rating: 3.9, stock: 44, imageUrl: imageUrl("photo-1606220945770-b5b6c2c55bf1") },
  { name: "Laptop Sleeve", price: 54, category: "Accessories", rating: 4.3, stock: 17, imageUrl: imageUrl("photo-1517336714731-489689fd1ca8") },
  { name: "Smart Fitness Band", price: 119, category: "Electronics", rating: 4.4, stock: 29, imageUrl: imageUrl("photo-1575311373937-040b8e1fd5b6") },
  { name: "Portable Bluetooth Speaker", price: 89, category: "Electronics", rating: 4.5, stock: 14, imageUrl: imageUrl("photo-1608043152269-423dbba4e7e1") },
  { name: "Wireless Charging Stand", price: 49, category: "Electronics", rating: 4.2, stock: 32, imageUrl: imageUrl("photo-1586953208448-b95a79798f07") },
  { name: "Noise Cancelling Headphones", price: 189, category: "Electronics", rating: 4.7, stock: 10, imageUrl: imageUrl("photo-1505740420928-5e560c06d30e") },
  { name: "Cotton Logo Hoodie", price: 72, category: "Fashion", rating: 4.1, stock: 38, imageUrl: imageUrl("photo-1556821840-3a63f95609a7") },
  { name: "Essential Crew T-Shirt", price: 34, category: "Fashion", rating: 4.0, stock: 52, imageUrl: imageUrl("photo-1521572163474-6864f9cf17ab") },
  { name: "Linen Throw Blanket", price: 64, category: "Home", rating: 4.3, stock: 18, imageUrl: imageUrl("photo-1616627561950-9f746e330187") },
  { name: "Ceramic Candle Set", price: 42, category: "Home", rating: 4.6, stock: 27, imageUrl: imageUrl("photo-1603006905003-be475563bc59") },
];

async function seedProducts() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log(`Seeded ${sampleProducts.length} products successfully.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedProducts();
