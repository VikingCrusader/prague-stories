import Location from '../models/Location.js';
import CheckIn from '../models/CheckIn.js';
import { generateLocationDescription } from '../services/claudeService.js';
import { RARITY_XP } from '../data/rarityMap.js';

export async function getLocations(req, res, next) {
  try {
    const { labels } = req.query;
    const filter = {};
    if (labels) {
      const labelArr = labels.split(',').map(l => l.trim()).filter(Boolean);
      if (labelArr.length > 0) filter.labels = { $in: labelArr };
    }

    const locations = await Location.find(filter)
      .select('-description')
      .lean();

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

    if (!location.description.en) {
      try {
        const desc = await generateLocationDescription(location.name, location.labels?.[0] || 'architecture');
        location.description = desc;
        await location.save();
      } catch (aiErr) {
        console.error('Claude description generation failed:', aiErr.message);
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

    const { name, localizedNames, labels, coordinates, wikipediaUrl, description, coverImage, rarity } = req.body;

    if (name)                             location.name        = name;
    if (labels)                           location.labels      = Array.isArray(labels) ? labels : [labels];
    if (coordinates?.lat != null && coordinates?.lng != null) location.coordinates = coordinates;
    if (wikipediaUrl !== undefined)        location.wikipediaUrl = wikipediaUrl;
    if (coverImage   !== undefined)        location.coverImage  = coverImage;
    if (rarity && RARITY_XP[rarity]) {
      location.rarity   = rarity;
      location.xpReward = RARITY_XP[rarity];
    }
    if (localizedNames) {
      if (localizedNames.cz !== undefined) location.localizedNames.cz = localizedNames.cz;
      if (localizedNames.zh !== undefined) location.localizedNames.zh = localizedNames.zh;
      location.markModified('localizedNames');
    }
    if (description) {
      if (description.en !== undefined) location.description.en = description.en;
      if (description.cz !== undefined) location.description.cz = description.cz;
      if (description.zh !== undefined) location.description.zh = description.zh;
      location.markModified('description');
    }

    await location.save();
    res.json(location.toObject());
  } catch (err) {
    next(err);
  }
}

export async function createLocation(req, res, next) {
  try {
    const { name, labels, coordinates, wikipediaUrl, description, coverImage } = req.body;
    if (!name || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ message: 'name and coordinates are required' });
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
      labels: Array.isArray(labels) ? labels : [],
      coordinates,
      wikipediaUrl: wikipediaUrl || '',
      description:  description ? { en: description, cz: '', zh: '' } : undefined,
      coverImage:   coverImage || '',
      isPreset: false,
      addedBy: req.user._id,
      xpReward: 10,
      rarity: 'common',
    });

    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
}
