import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; 
import dotenv from 'dotenv';


dotenv.config(
        {
            path: "./.env" // Load environment variables from .env file
        }
); // Load environment variables from .env file

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Click 'View API Keys' above to copy your cloud name
        api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API key
        api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });
    
    // Function to upload a file to Cloudinary
    const uploadfileoncloudinay = async (localfilepath) => {
        try{
            if (!localfilepath) {
            return null;
        }
            const res = await cloudinary.uploader.upload(localfilepath, {
                resource_type:"auto",
        })
        // file uploaded successfully
        // console.log("File uploaded successfully:", res.url);
        fs.unlinkSync(localfilepath); // Delete the local file after upload
        return res;

    }
    catch(error){
        fs.unlinkSync(localfilepath); // Delete the local file if upload fails from local storage
        return null;

    }}
    // const deletefileoncloudinary= async(localfilepath)=>{
    //     if(!localfilepath)
    //     {
    //         return null;

    //     }
    //     const publicIdWithExtension = localfilepath.split('/').slice(-1)[0];
    //     const publicId = path.parse(publicIdWithExtension).name;

    //     const result = await cloudinary.uploader.destroy(publicId);
    //     if(!result){
    //         throw new Apierror(
    //             "failed to delete file" , 500
    //         )
    //     }
    //     return result;
        
        
    // }


export default   uploadfileoncloudinay 


    
