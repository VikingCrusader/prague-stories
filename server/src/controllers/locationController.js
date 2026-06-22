import Location from '../models/Location.js';
import CheckIn from '../models/CheckIn.js';
import { generateLocationDescription } from '../services/claudeService.js';

export async function getLocations(req, res, next) {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const locations = await Location.find(filter)
      .select('-description')
      .lean();

    // If user is authenticated, attach unlock status
    if (req.user) {
      const checkins = await CheckIn.find({ user: req.user._id }).select('location').lean();
      const unlockedSet = new Set(checkins.map(c => c.location.toString()));
      return res.json(locations.map(loc => ({
        ...loc,
        unlocked: unlockedSet.has(loc._id.toString()),
      })));
    }

    res.json(locations.map(loc => ({ ...loc, unlocked: false })));
  } catch (err) {
    next(err);
  }
}

export async function getLocation(req, res, next) {
  try {
    const location = await Location.findOne({ slug: req.params.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });

    // Lazy-generate AI description only when English is missing
    if (!location.description.en) {
      try {
        const desc = await generateLocationDescription(location.name, location.category);
        location.description = desc;
        await location.save();
      } catch (aiErr) {
        console.error('Claude description generation failed:', aiErr.message);
        // Proceed without description rather than blocking the response
      }
    }

    let unlocked = false;
    if (req.user) {
      const checkIn = await CheckIn.findOne({ user: req.user._id, location: location._id });
      unlocked = !!checkIn;
    }

    res.json({ ...location.toObject(), unlocked });
  } catch (err) {
    next(err);
  }
}

export async function deleteLocation(req, res, next) {
  try {
    const location = await Location.findOne({ slug: req.params.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });
    await CheckIn.deleteMany({ location: location._id });
    await location.deleteOne();
    res.json({ message: 'Location deleted', slug: req.params.slug });
  } catch (err) {
    next(err);
  }
}

export async function updateLocation(req, res, next) {
  try {
    const location = await Location.findOne({ slug: req.params.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });

    const { name, localizedNames, category, coordinates, wikipediaUrl, description, coverImage, xpReward, difficulty } = req.body;

    if (name)                             location.name        = name;
    if (category)                         location.category    = category;
    if (coordinates?.lat != null && coordinates?.lng != null) location.coordinates = coordinates;
    if (wikipediaUrl !== undefined)        location.wikipediaUrl = wikipediaUrl;
    if (coverImage   !== undefined)        location.coverImage  = coverImage;
    if (xpReward     != null)             location.xpReward    = xpReward;
    if (difficulty   != null)             location.difficulty  = difficulty;
    if (localizedNames) {
      location.localizedNames = {
        cz: localizedNames.cz ?? location.localizedNames?.cz ?? '',
        zh: localizedNames.zh ?? location.localizedNames?.zh ?? '',
      };
    }
    if (description) {
      location.description = {
        en: description.en ?? location.description.en,
        cz: description.cz ?? location.description.cz,
        zh: description.zh ?? location.description.zh,
      };
    }

    await location.save();
    res.json(location.toObject());
  } catch (err) {
    next(err);
  }
}

export async function createLocation(req, res, next) {
  try {
    const { name, category, coordinates, wikipediaUrl, description, coverImage } = req.body;
    if (!name || !category || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ message: 'name, category, and coordinates are required' });
    }

    if (coverImage && Buffer.byteLength(coverImage, 'utf8') > 2 * 1024 * 1024) {
      return res.status(400).json({ message: 'Cover image must be under 2 MB' });
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();

    const location = await Location.create({
      name,
      slug,
      category,
      coordinates,
      wikipediaUrl: wikipediaUrl || '',
      description:  description ? { en: description, cz: '', zh: '' } : undefined,
      coverImage:   coverImage || '',
      isPreset: false,
      addedBy: req.user._id,
      xpReward: 20,
      difficulty: 2,
    });

    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
}
