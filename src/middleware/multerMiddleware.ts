import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import AppError from '../utilities/AppError';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
export const uploadUserPhoto = upload.single('photo');
export const resizeUserPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) return next();
  const mimetype = 'webp'; // to grant transparency
  const fileName = `${req.params.id}.${mimetype}`;
  req.body.photo = fileName;

  await sharp(req.file.buffer)
    .resize(200, 200)
    .composite([
      {
        input: Buffer.from(
          `<svg><rect x="0" y="0" width="200" height="200" rx="100" ry="100"/></svg>`,
        ),
        blend: 'dest-in',
      },
    ])
    .webp({ quality: 90 })
    .toFile(`static/users/${fileName}`);

  next();
};

export const uploadImages = upload.fields([{ name: 'images', maxCount: 5 }]);
export const resizeImages = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files.images) return next();

  const images: string[] = [];
  const thumbnails: string[] = [];

  // to prevent event loop this will keep  a map od promises
  await Promise.all(
    req.files.images.map(async (file: any, index: number) => {
      // const mimetype = file.mimetype.split('/')[1];

      const fileName = `${req.params.id}-${++index}.webp`;

      await sharp(file.buffer)
        .resize({ width: 2000 })
        .webp({ quality: 90 })
        .toFile(`static/products/${fileName}`);

      await sharp(file.buffer)
        .resize({ width: 200 })
        .webp({ quality: 90 })
        .toFile(`static/thumbnails/${fileName}`);

      thumbnails.push(fileName);
      images.push(fileName);
    }),
  );

  req.body.images = { big: images, thumbnails };
  next();
};
