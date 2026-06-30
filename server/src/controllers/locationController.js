import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import sharp from 'sharp';
import Location from '../models/Location.js';
import CheckIn from '../models/CheckIn.js';
import { generateLocationDescription } from '../services/claudeService.js';
import { RARITY_XP } from '../data/rarityMap.js';
import cloudinary from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PIXEL_ART_DIR = path.resolve(__dirname, '../../../client/public/pixel-art');

function cloudinaryUpload(buffer, options) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err); else resolve(result);
    }).end(buffer);
  });
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  },
});

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
      const checkins = await CheckIn.find({ user: req.user._id }).select('location checkedInAt').lean();
      const checkinMap = new Map(checkins.map(c => [c.location.toString(), c.checkedInAt]));
      return res.json(locations.map(loc => ({
        ...loc,
        unlocked: checkinMap.has(loc._id.toString()),
        _checkedInAt: checkinMap.get(loc._id.toString()) ?? null,
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

    if (!location.description.en || !location.description.cz || !location.description.zh) {
      try {
        const desc = await generateLocationDescription(
          location.name,
          location.labels?.[0] || 'architecture',
          location.description.en || null
        );
        const patch = {};
        if (!location.description.en && desc.en) patch['description.en'] = desc.en;
        if (!location.description.cz && desc.cz) patch['description.cz'] = desc.cz;
        if (!location.description.zh && desc.zh) patch['description.zh'] = desc.zh;
        if (Object.keys(patch).length) {
          await Location.updateOne({ _id: location._id }, { $set: patch });
          if (patch['description.en']) location.description.en = patch['description.en'];
          if (patch['description.cz']) location.description.cz = patch['description.cz'];
          if (patch['description.zh']) location.description.zh = patch['description.zh'];
        }
      } catch (aiErr) {
        console.error('AI description generation failed:', aiErr.message);
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

    if (location.coverImage?.startsWith('/pixel-art/')) {
      fs.unlink(path.join(PIXEL_ART_DIR, path.basename(location.coverImage)), () => {});
    } else if (location.coverImage?.includes('cloudinary.com')) {
      cloudinary.uploader.destroy(`prague-stories/covers/${req.params.slug}`).catch(() => {});
    }

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

    const { name, localizedNames, labels, coordinates, wikipediaUrl, description, rarity } = req.body;

    if (name)                             location.name        = name;
    if (labels)                           location.labels      = Array.isArray(labels) ? labels : [labels];
    if (coordinates?.lat != null && coordinates?.lng != null) location.coordinates = coordinates;
    if (wikipediaUrl !== undefined)        location.wikipediaUrl = wikipediaUrl;
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
    const { name, localizedNames, labels, coordinates, wikipediaUrl, rarity, description } = req.body;
    if (!name || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ message: 'name and coordinates are required' });
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();

    const resolvedRarity = rarity && RARITY_XP[rarity] ? rarity : 'common';

    const location = await Location.create({
      name,
      slug,
      localizedNames: localizedNames || {},
      labels: Array.isArray(labels) ? labels : [],
      coordinates,
      wikipediaUrl: wikipediaUrl || '',
      description: description && typeof description === 'object'
        ? { en: description.en || '', cz: description.cz || '', zh: description.zh || '' }
        : {},
      addedBy:  req.user._id,
      rarity:   resolvedRarity,
      xpReward: RARITY_XP[resolvedRarity],
    });

    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
}

export async function uploadCoverImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const location = await Location.findOne({ slug: req.params.slug });
    if (!location) return res.status(404).json({ message: 'Location not found' });

    // Clean up old local file if it predates the Cloudinary migration
    if (location.coverImage?.startsWith('/pixel-art/')) {
      fs.unlink(path.join(PIXEL_ART_DIR, path.basename(location.coverImage)), () => {});
    }

    const webpBuffer = await sharp(req.file.buffer).webp({ quality: 85 }).toBuffer();

    const uploads = [
      cloudinaryUpload(webpBuffer, {
        public_id: `prague-stories/covers/${req.params.slug}`,
        overwrite: true,
        format: 'webp',
      }),
    ];

    if (process.env.NODE_ENV !== 'production') {
      const localFilename = `${req.params.slug}-v${Date.now()}.webp`;
      uploads.push(fs.promises.writeFile(path.join(PIXEL_ART_DIR, localFilename), webpBuffer));
    }

    const [result] = await Promise.all(uploads);

    location.coverImage = result.secure_url;
    await location.save();

    res.json(location.toObject());
  } catch (err) {
    next(err);
  }
}
