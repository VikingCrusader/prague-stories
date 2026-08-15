import HistoryEvent from '../models/HistoryEvent.js';
import Location from '../models/Location.js';
import CheckIn from '../models/CheckIn.js';
import { HISTORY_ERAS } from '../data/historyEras.js';

// Single read endpoint for the whole History Timeline: the era roster (all
// six, including the five not seeded yet) plus every HistoryEvent, sorted
// for the scrub. Unlike GET /api/locations, this doesn't split list/detail —
// event copy is a few short hand-written sentences, not a heavy lazily
// generated description, so there's nothing worth deferring.
//
// relatedLandmarks are stored as bare slugs on the event; here they're
// resolved against the live locations collection in one batched query and
// enriched with everything LocationCard needs to render the exact same
// mystery/revealed card Explore uses (name, localizedNames, coordinates,
// rarity, labels, pixelArtKey, coverImage, xpReward, unlocked) — the History
// page renders these landmarks with that real component, not a bespoke
// chip. `unlocked` is computed the same way getLocations does it: false for
// a guest, true when the authenticated user (via optionalAuth) already has
// a CheckIn against it. A slug that doesn't resolve to a real Location is
// dropped rather than sent to the client as a dead link.
export async function getHistoryEvents(req, res, next) {
  try {
    const events = await HistoryEvent.find().sort({ startYear: 1 }).lean();

    const allSlugs = [...new Set(events.flatMap(e => e.relatedLandmarks.map(r => r.slug)))];
    const locations = await Location.find(
      { slug: { $in: allSlugs } },
      '-description'
    ).lean();

    let checkinMap = new Map();
    if (req.user) {
      const checkins = await CheckIn.find({ user: req.user._id }).select('location').lean();
      checkinMap = new Map(checkins.map(c => [c.location.toString(), true]));
    }
    const locationBySlug = new Map(locations.map(loc => [
      loc.slug,
      { ...loc, unlocked: checkinMap.has(loc._id.toString()) },
    ]));

    const enrichedEvents = events.map(event => ({
      ...event,
      relatedLandmarks: event.relatedLandmarks
        .filter(r => locationBySlug.has(r.slug))
        .map(r => ({ relation: r.relation, landmark: locationBySlug.get(r.slug) })),
    }));

    res.json({ eras: HISTORY_ERAS, events: enrichedEvents });
  } catch (err) {
    next(err);
  }
}
