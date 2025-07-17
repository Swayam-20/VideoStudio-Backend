import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; 


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Click 'View API Keys' above to copy your cloud name
        api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API key
        api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });
    
    // Function to upload a file to Cloudinary
    const uploadfile = async (localfilepath) => {
        try{if (!localfilepath) {
            return null;
        }
            const res = await cloudinary.uploader.upload(localfilepath, {
                resource_type:"auto"
        })
        // file uploaded successfully
        console.log("File uploaded successfully:", res);
        
        return res;

    }
    catch(error){
        fs.unlinkSync(localfilepath); // Delete the local file if upload fails from local storage
        return null;

    }
}

export default uploadfile;
    
