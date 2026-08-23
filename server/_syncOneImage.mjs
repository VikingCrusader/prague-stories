import "dotenv/config";
import { connectDB } from "./src/config/db.js";
import HistoryEvent from "./src/models/HistoryEvent.js";
import { historyEvents } from "./_seedNoRun.mjs";

await connectDB();
const data = historyEvents.find((e) => e.slug === "three-guardians-1279");
const res = await HistoryEvent.updateOne(
  { slug: "three-guardians-1279" },
  { $set: { relatedLandmarks: data.relatedLandmarks } },
);
console.log(JSON.stringify(res));
process.exit(0);
