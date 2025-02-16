const Tesseract = require("tesseract.js");

// Detect environment
const isBrowser = typeof window !== "undefined";

/**
 * Preprocess Image (Works in both React & Node.js)
 */
async function preprocessImage(imagePath, enhance = false, crop = null) {
    if (isBrowser) {
        // ✅ Browser: Use Canvas API for image processing
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Prevent CORS issues
            img.src = imagePath;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (crop) {
                    canvas.width = crop.width;
                    canvas.height = crop.height;
                    ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }

                resolve(canvas.toDataURL()); // Convert to Base64 for OCR
            };

            img.onerror = (err) => reject("Error loading image: " + err);
        });
    } else {
        // ✅ Node.js: Use Jimp for image processing
        const Jimp = require("jimp");
        const axios = require("axios");
        const fs = require("fs");
        const path = require("path");

        let image;
        if (imagePath.startsWith("http")) {
            const response = await axios({ url: imagePath, responseType: "arraybuffer" });
            image = await Jimp.read(Buffer.from(response.data, "binary"));
        } else if (imagePath.startsWith("data:image")) {
            const base64Data = imagePath.split(",")[1];
            image = await Jimp.read(Buffer.from(base64Data, "base64"));
        } else {
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
    }
}

/**
 * Extract text from an image (Supports URLs, Base64, Local files in Node.js)
 */
async function extractText(imagePath, options = {}) {
    try {
        console.log("🔄 Processing image...");
        const processedImage = await preprocessImage(imagePath, options.enhance, options.crop);

        console.log("🔍 Running OCR...");
        const { data: { text } } = await Tesseract.recognize(processedImage, options.lang || "eng", {
            logger: (m) => console.log(m),
        });

        console.log("✅ OCR Completed!");
        return text.trim();
    } catch (error) {
        console.error("❌ OCR Error:", error);
        return null;
    }
}

/**
 * Extract text from multiple images (Bulk OCR)
 */
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
