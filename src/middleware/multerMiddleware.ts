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

export const uploadImages = upload.fields([{ name: 'images', maxCount: 5 }]);

export const resizeImages = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  // console.log('files', req.files);

  if (!req.files) next();

  const images: string[] = [];
  const thumbnails: string[] = [];

  // to prevent event loop this will keep  a mp od promises
  await Promise.all(
    req.files.images.map(async (file: any, index: number) => {
      const mimetype = file.mimetype.split('/')[1];
      const fileName = `${req.params.id}-${++index}.${mimetype}`;

      await sharp(file.buffer)
        .resize({ width: 2000 })
        .toFile(`static/products/${fileName}`);

      await sharp(file.buffer)
        .resize({ width: 200 })
        .toFile(`static/thumbnails/${fileName}`);

      thumbnails.push(fileName);
      images.push(fileName);
    }),
  );

  req.body.images = images;
  req.body.thumbnails = thumbnails;

  // req.body.images = req.files.images;
  next();
};
