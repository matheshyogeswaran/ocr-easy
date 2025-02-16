const Tesseract = require("tesseract.js");
const Jimp = require("jimp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
async function preprocessImage(imagePath, enhance = false, crop = null) {
    try {
        let image;
        
        if (imagePath.startsWith("http")) {
            const response = await axios({ url: imagePath, responseType: "arraybuffer" });
            image = await Jimp.read(Buffer.from(response.data, "binary"));
        }
    
        else if (imagePath.startsWith("data:image")) {
            const base64Data = imagePath.split(",")[1];
            image = await Jimp.read(Buffer.from(base64Data, "base64"));
        }
      
        else {
            image = await Jimp.read(imagePath);
        }

       
        if (crop) {
            image.crop(crop.x, crop.y, crop.width, crop.height);
        }

      
        if (enhance) {
            image.greyscale().contrast(1);
        }

        const processedPath = path.join(__dirname, "temp.png");
        await image.writeAsync(processedPath);
        return processedPath;
    } catch (error) {
        throw new Error("Error processing image: " + error.message);
    }
}

async function extractText(imagePath, options = {}) {
    try {
        const { lang = "eng", enhance = false, crop = null } = options;

        console.log("🔄 Processing image...");
        const processedPath = await preprocessImage(imagePath, enhance, crop);

        console.log("🔍 Running OCR...");
        const { data: { text } } = await Tesseract.recognize(processedPath, lang, { logger: m => console.log(m) });

        console.log("✅ OCR Completed!");
        return text.trim();
    } catch (error) {
        console.error("❌ OCR Error:", error);
        return null;
    }
}

async function extractTextFromMultipleImages(imagePaths, options = {}) {
    const results = [];

    for (const imagePath of imagePaths) {
        console.log(`🔄 Processing: ${imagePath}`);
        const text = await extractText(imagePath, options);
        results.push({ imagePath, text });
    }

    return results;
}





module.exports = { extractText, extractTextFromMultipleImages };


