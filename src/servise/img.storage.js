// const { ImageKit } = require("@imagekit/nodejs")
import ImageKit from "@imagekit/nodejs";


const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(file) {
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "product_" + Date.now(),
        folder: "products/images",
    })

    return result;
}


export default uploadFile;