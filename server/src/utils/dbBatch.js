// Big enough that a player's check-ins or a pack's cards come back in one
// batch: the driver's first batch is 101 documents, and each further batch is
// another round trip to the database, ~100 ms from far away (2026-11-13).
export const BIG_BATCH = 5000;
