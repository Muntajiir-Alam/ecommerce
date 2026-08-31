import ImageKit from '@imagekit/nodejs';
import { configDotenv } from 'dotenv';
configDotenv();

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file, fileName = `product-${Date.now()}`) {
    const result = await ImageKitClient.files.upload({
        file,
        fileName,
        folder: '/products/images',
        useUniqueFileName: true,
    });

    return result;
}

export default uploadFile;
