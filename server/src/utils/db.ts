// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri: any = "mongodb+srv://khushalmoradiya100:H6SzisVmj4hl11GN@cluster0.tzndtyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// if (!uri) throw new Error("MONGOURI not defined.");

// let client: MongoClient | null = null;

// export async function connectDB(): Promise<MongoClient> {
//   if (client) {
//     try {
//       await client.db("admin").command({ ping: 1 });
//       return client;
//     } catch {
//       console.log("Connection is stale, reconnecting...");
//     }
//   }

//   try {
//     client = new MongoClient(uri, {
//       serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//       },
//       // tlsAllowInvalidHostnames :true,
//       tls: true, // Ensure TLS is enabled
//       tlsInsecure: false, // Set to true only for testing, not recommended for production
//     });

//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("✅ MongoDB connected");
//     return client;
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//     throw error;
//   }
// }
// src/utils/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGOURI;

if (!uri) throw new Error("❌ MONGOURI is not defined in .env");

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Stop the server if DB connection fails
  }
};

