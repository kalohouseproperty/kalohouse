const sharp = require('sharp');

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 90 })
      .toFile(outputPath);
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
}

convertToWebP(
  '/home/ashimirwe/Documents/nyumbani/public/logo-main.png',
  '/home/ashimirwe/Documents/nyumbani/public/logo-main.webp'
);

convertToWebP(
  '/home/ashimirwe/Documents/nyumbani/public/logo-transparent.png',
  '/home/ashimirwe/Documents/nyumbani/public/logo-transparent.webp'
);