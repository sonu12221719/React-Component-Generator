// /services/zip.js
import archiver from 'archiver';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import File from '../models/File.js';

export async function createProjectZip({ projectId, revisionId }) {
  // Get files for the given revision
  const files = await File.find({ projectId, revisionId });
  if (!files.length) throw new Error('No files found for this revision');

  // Prepare a memory stream
  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks = [];
  archive.on('data', (chunk) => chunks.push(chunk));

  for (const file of files) {
    archive.append(file.code, { name: file.path });
  }

  await archive.finalize();
  const zipBuffer = Buffer.concat(chunks);

  // Upload ZIP to Cloudinary
  const uploadStream = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // for zip files
          folder: 'saas_zips',
          public_id: `${projectId}-${revisionId}`,
          format: 'zip',
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );

      Readable.from(zipBuffer).pipe(stream);
    });

  const result = await uploadStream();
  return result.secure_url;
}
