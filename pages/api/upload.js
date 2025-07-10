import cloudinary from 'cloudinary';
import { mongooseConnect } from '@/lib/mongoose';
import multiparty from 'multiparty';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  await mongooseConnect();

  const form = new multiparty.Form();

  const parseForm = () =>
    new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

  try {
    const { files } = await parseForm();
    const links = [];

    for (const file of files.file) {
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'Inflame Solution Website',
        public_id: `file_${Date.now()}`,
        resource_type: 'auto',
      });
      links.push(result.secure_url);
      // Optionally remove the temp file
      fs.unlinkSync(file.path);
    }

    return res.status(200).json({ links });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
