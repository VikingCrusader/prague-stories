import "dotenv/config";
import { connectDB } from "../config/db.js";
import Location from "../models/Location.js";

await connectDB();
const result = await Location.updateOne(
  { slug: "bazilika-sv-ludmily" },
  { $set: { coordinates: { lat: 50.075354074325865, lng: 14.436368818058986 } } }
);
console.log(result);
process.exit(0);
