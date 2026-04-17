const imagemin = require("imagemin").default;
const imageminMozjpeg = require("imagemin-mozjpeg").default;
const imageminPngquant = require("imagemin-pngquant").default;
const imageminGifsicle = require("imagemin-gifsicle").default;
const imageminWebp = require("imagemin-webp").default;
const fs = require("fs");
const path = require("path");

async function compressImages() {
  const sourceRoots = [
    "wp-content/uploads",
    "homepage",
    "caputo",
    "delverde",
    "garofalo",
    "logo",
    "logo-g",
    "sacla",
    "sterilgarda",
    "virgilio",
    "public/optimized-media",
  ];

  // Get all image files
  const imageFiles = [];

  function findImages(dir) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findImages(filePath);
      } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        imageFiles.push(filePath);
      }
    }
  }

  for (const root of sourceRoots) {
    findImages(root);
  }

  console.log(`Found ${imageFiles.length} images to compress`);

  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  for (const imagePath of imageFiles) {
    try {
      const originalSize = fs.statSync(imagePath).size;
      totalOriginalSize += originalSize;

      console.log(`Compressing: ${imagePath}`);

      // Create backup
      const backupPath = imagePath + ".backup";
      fs.copyFileSync(imagePath, backupPath);

      // Compress based on file extension
      const ext = path.extname(imagePath).toLowerCase();
      let plugins = [];

      if (ext === ".jpg" || ext === ".jpeg") {
        plugins = [
          imageminMozjpeg({
            quality: 85,
            progressive: true,
          }),
        ];
      } else if (ext === ".png") {
        plugins = [
          imageminPngquant({
            quality: [0.6, 0.8],
            speed: 1,
          }),
        ];
      } else if (ext === ".gif") {
        plugins = [
          imageminGifsicle({
            optimizationLevel: 3,
          }),
        ];
      } else if (ext === ".webp") {
        plugins = [
          imageminWebp({
            quality: 85,
          }),
        ];
      }

      if (plugins.length > 0) {
        const result = await imagemin([imagePath], {
          destination: path.dirname(imagePath),
          plugins: plugins,
        });

        if (result.length > 0) {
          const compressedSize = fs.statSync(imagePath).size;
          totalCompressedSize += compressedSize;

          const savings = originalSize - compressedSize;
          const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

          console.log(`  Original: ${(originalSize / 1024).toFixed(1)}KB`);
          console.log(`  Compressed: ${(compressedSize / 1024).toFixed(1)}KB`);
          console.log(
            `  Savings: ${(savings / 1024).toFixed(1)}KB (${savingsPercent}%)`
          );

          // Remove backup if compression was successful
          fs.unlinkSync(backupPath);
        } else {
          console.log(`  No compression applied, restoring backup`);
          fs.copyFileSync(backupPath, imagePath);
          fs.unlinkSync(backupPath);
          totalCompressedSize += originalSize;
        }
      } else {
        console.log(`  Unsupported format, skipping`);
        totalCompressedSize += originalSize;
      }
    } catch (error) {
      console.error(`Error compressing ${imagePath}:`, error.message);
      // Restore backup if it exists
      const backupPath = imagePath + ".backup";
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, imagePath);
        fs.unlinkSync(backupPath);
      }
      totalCompressedSize += fs.statSync(imagePath).size;
    }
  }

  const totalSavings = totalOriginalSize - totalCompressedSize;
  const totalSavingsPercent = (
    (totalSavings / totalOriginalSize) *
    100
  ).toFixed(1);

  console.log("\n=== Compression Summary ===");
  console.log(`Total images processed: ${imageFiles.length}`);
  console.log(
    `Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(
    `Compressed total size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(
    `Total savings: ${(totalSavings / 1024 / 1024).toFixed(
      2
    )}MB (${totalSavingsPercent}%)`
  );
}

compressImages().catch(console.error);
