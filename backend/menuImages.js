const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const multer = require('multer');
const sharp = require('sharp');

const uploadDir = path.join(__dirname, 'uploads', 'menu');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5 },
  fileFilter: (_req, file, done) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return done(new Error('Unsupported image type'));
    done(null, true);
  },
}).single('imageFile');

function parseMenuImage(req, res, next) {
  upload(req, res, (error) => {
    if (error) return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ message: 'Invalid image upload (maximum 5 MB).' });
    next();
  });
}

async function saveMenuImage(file) {
  const image = sharp(file.buffer, { limitInputPixels: 20_000_000, failOn: 'error' });
  const { format } = await image.metadata();
  if (!['jpeg', 'png', 'webp'].includes(format)) throw new Error('Unsupported image format');
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = `${crypto.randomUUID()}.webp`;
  await image.rotate().resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(uploadDir, filename));
  return `/uploads/menu/${filename}`;
}

async function removeMenuImage(imagePath) {
  const filename = imagePath?.match(/^\/uploads\/menu\/([0-9a-f-]{36}\.webp)$/)?.[1];
  if (filename) await fs.unlink(path.join(uploadDir, filename)).catch(() => {});
}

module.exports = { uploadDir, parseMenuImage, saveMenuImage, removeMenuImage };
