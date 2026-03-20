require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const paymentRoutes = require("./routes/paymentRoutes");

const User = require("./models/User");
const Resource = require("./models/Resource");
const Transaction = require("./models/Transaction");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (!MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.error("Missing MONGODB_URI in backend/.env");
  process.exit(1);
}

const seedUsers = [
  { id: "u1", name: "Kavindu Perera", email: "student@test.com", role: "student" },
  { id: "u2", name: "Dr. Lakshan Silva", email: "admin@test.com", role: "admin" },
  { id: "u3", name: "Nimasha Fernando", email: "nimasha@test.com", role: "student" },
  { id: "u4", name: "Tharindu Jayasinghe", email: "tharindu@test.com", role: "student" },
];

const seedResources = [
  {
    id: "r1",
    title: "Data Structures & Algorithms – Complete Notes",
    price: 750,
    uploadedBy: "u1",
    status: "verified",
  },
  {
    id: "r2",
    title: "Database Systems Past Papers 2019–2024",
    price: 500,
    uploadedBy: "u1",
    status: "verified",
  },
  {
    id: "r3",
    title: "Calculus II – Video Tutorial Series",
    price: 0,
    uploadedBy: "u3",
    status: "verified",
  },
  {
    id: "r4",
    title: "Financial Accounting Fundamentals",
    price: 400,
    uploadedBy: "u4",
    status: "pending",
  },
  {
    id: "r5",
    title: "Operating Systems – Mid Semester Notes",
    price: 350,
    uploadedBy: "u3",
    status: "verified",
  },
  {
    id: "r6",
    title: "Thermodynamics Past Papers Collection",
    price: 600,
    uploadedBy: "u3",
    status: "verified",
  },
  {
    id: "r7",
    title: "Marketing Management Complete Guide",
    price: 550,
    uploadedBy: "u4",
    status: "rejected",
  },
  {
    id: "r8",
    title: "Python for Data Science – Crash Course",
    price: 0,
    uploadedBy: "u1",
    status: "verified",
  },
];

const seedTransactions = [
  { id: "t1", date: "2024-10-15", resourceName: "Data Structures & Algorithms – Complete Notes", resourceId: "r1", amount: 750, status: "paid", buyerId: "u3", sellerId: "u1" },
  { id: "t2", date: "2024-10-14", resourceName: "Database Systems Past Papers 2019–2024", resourceId: "r2", amount: 500, status: "paid", buyerId: "u4", sellerId: "u1" },
  { id: "t3", date: "2024-10-12", resourceName: "Data Structures & Algorithms – Complete Notes", resourceId: "r1", amount: 750, status: "verified", buyerId: "u4", sellerId: "u1" },
  { id: "t4", date: "2024-10-10", resourceName: "Database Systems Past Papers 2019–2024", resourceId: "r2", amount: 500, status: "paid", buyerId: "u3", sellerId: "u1" },
  { id: "t5", date: "2024-10-08", resourceName: "Thermodynamics Past Papers Collection", resourceId: "r6", amount: 600, status: "paid", buyerId: "u1", sellerId: "u3" },
  { id: "t6", date: "2024-10-05", resourceName: "Operating Systems – Mid Semester Notes", resourceId: "r5", amount: 350, status: "pending", buyerId: "u4", sellerId: "u3" },
  { id: "t7", date: "2024-09-28", resourceName: "Data Structures & Algorithms – Complete Notes", resourceId: "r1", amount: 750, status: "paid", buyerId: "u3", sellerId: "u1" },
  { id: "t8", date: "2024-09-20", resourceName: "Database Systems Past Papers 2019–2024", resourceId: "r2", amount: 500, status: "paid", buyerId: "u4", sellerId: "u1" },
];

async function seedIfEmpty() {
  const usersCount = await User.countDocuments();
  if (usersCount > 0) return;

  await User.insertMany(seedUsers);
  await Resource.insertMany(seedResources);
  await Transaction.insertMany(seedTransactions);
}

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (no Origin header).
      if (!origin) return callback(null, true);
      if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  return res.json({ ok: true });
});

app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
    await seedIfEmpty();

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Payment backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect MongoDB", err);
    process.exit(1);
  });

