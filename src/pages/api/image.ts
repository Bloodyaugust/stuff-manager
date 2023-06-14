const cloudinary = require('cloudinary').v2;

import prisma from '@/lib/prisma';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import getSessionAndAccount from '@/lib/authEndpoint';
import { Image } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Image | Error>
) {
  try {
    const { session, account } = await getSessionAndAccount(req, res);

    if (!session || !account) {
      res.status(401).json({ message: 'Please sign in' });
      return;
    }

    if (req.method === 'POST') {
      const { cloudinaryImage, fields } = (await new Promise((outerResolve) => {
        let innerFields: any;

        const uploadStream = () => {
          return cloudinary.uploader.upload_stream(
            {},
            (err: any, image: any) => {
              if (err) {
                console.error('stream upload error: ', err);
                throw err;
              }

              outerResolve({ cloudinaryImage: image, fields: innerFields });
            }
          );
        };

        const form = formidable({
          fileWriteStreamHandler: uploadStream,
        });

        new Promise((resolve) => {
          form.parse(req, (err, formFields, files) => {
            if (err) {
              console.error('form parse error: ', err);
              throw err;
            }

            innerFields = formFields;

            resolve({
              formFields,
              files,
            });
          });
        });
      })) as { cloudinaryImage: any; fields: any };

      const { boxId, thingId } = fields;

      const image = await prisma.image.create({
        data: {
          url: cloudinaryImage.url,
          createdBy: account.id,
          boxId,
          thingId,
        },
      });

      res.status(200).json(image);
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: JSON.stringify(e) });
    return;
  }

  res.status(500).json({ message: 'Method not allowed' });
}
