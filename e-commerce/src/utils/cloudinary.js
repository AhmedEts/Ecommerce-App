import  cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..','..','.env') });
          

cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET, 
  secure: true
});
export default cloudinary.v2