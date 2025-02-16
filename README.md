# OCR Easy 🖼️➡️🔤  
A simple and powerful OCR (Optical Character Recognition) library using Tesseract.js.

![npm](https://img.shields.io/npm/v/ocr-easy) ![License](https://img.shields.io/npm/l/ocr-easy) ![Downloads](https://img.shields.io/npm/dt/ocr-easy)

---

## ✨ Features
✅ Extract text from **images, URLs, and Base64**  
✅ **Bulk image processing**  
✅ **Image cropping & enhancement** (grayscale, contrast)  
✅ **Supports multiple languages**  
✅ **Fast & lightweight**  

---

## 📦 Installation

```sh
npm install ocr-easy
```

---

## 🚀 Usage

### 1️⃣ Extract text from a local image

```javascript
const { extractText } = require("ocr-easy");

extractText("test.png", { enhance: true })
    .then(text => console.log("Extracted Text:", text))
    .catch(err => console.error("Error:", err));
```

### 2️⃣ Extract text from an image URL

```javascript
extractText("https://example.com/sample-image.png")
    .then(text => console.log("Extracted Text:", text))
    .catch(err => console.error("Error:", err));
```

### 3️⃣ Extract text from a Base64 image

```javascript
const base64Image = "data:image/png;base64,iVBORw0KGg...";
extractText(base64Image)
    .then(text => console.log("Extracted Text:", text))
    .catch(err => console.error("Error:", err));
```

### 4️⃣ Bulk OCR (Multiple Images)

```javascript
const { extractTextFromMultipleImages } = require("ocr-easy");

extractTextFromMultipleImages(["image1.png", "image2.jpg"], { enhance: true })
    .then(results => console.log("Bulk OCR Results:", results))
    .catch(err => console.error("Error:", err));
```

### 5️⃣ Extract text from an image with cropping

```javascript
extractText("image.png", { 
    crop: { x: 50, y: 50, width: 200, height: 100 } 
})
.then(text => console.log("Extracted Text:", text))
.catch(err => console.error("Error:", err));
```

### 6️⃣ Extract text from an image with language selection

```javascript
extractText("image.png", { lang: "spa" }) // Spanish
    .then(text => console.log("Extracted Text in Spanish:", text))
    .catch(err => console.error("Error:", err));
```

---

## 🛠️ Options

| Option  | Type    | Default  | Description |
|---------|--------|----------|-------------|
| `lang`  | String | `"eng"`  | Language for OCR processing (e.g., `"spa"`, `"fra"`) |
| `enhance` | Boolean | `false` | Apply grayscale & contrast for better OCR results |
| `crop`  | Object | `null` | Crop part of the image `{ x: 50, y: 50, width: 200, height: 100 }` |

---

## 🌍 Supported Languages

- English (`eng`)
- Spanish (`spa`)
- French (`fra`)
- German (`deu`)
- Hindi (`hin`)
- **More languages can be added by configuring Tesseract.js.**

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 📫 Contributing

Pull requests are welcome! Feel free to contribute or report issues.

⭐ **Star this project if you found it useful!**

---
