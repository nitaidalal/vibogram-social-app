import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if(!file){
            return res.status(400).json({message:"No file uploaded"});
        }
        const fileBase64 = file.buffer.toString('base64');
        const fileUri = `data:${file.mimetype};base64,${fileBase64}`; 
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "Vibogram/images",
          resource_type: "image",
          transformation: [
            { width: 1080, crop: "limit" }, 
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });
        res.status(200).json({message:"Image uploaded successfully", url:result.secure_url});
    } catch (error) {
        res.status(500).json({message:"Image upload failed", error:error.message});
    }
}


export const uploadVideo = async (req, res) => {
    try {
        const file = req.file;
        if(!file){
            return res.status(400).json({message:"No file uploaded"});
        }
        const fileBase64 = file.buffer.toString('base64');
        const fileUri = `data:${file.mimetype};base64,${fileBase64}`;
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "vibogram/vibes",
          resource_type: "video",
          chunk_size: 6000000,
          transformation: [
            { quality: "auto" }, 
          ],
        });
          
        res.status(200).json({message:"Video uploaded successfully", url:result.secure_url});
    } catch (error) {
        res.status(500).json({message:"Video upload failed", error:error.message});
    }
}