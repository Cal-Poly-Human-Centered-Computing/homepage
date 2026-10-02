const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const projectRoot = path.join(__dirname, "..");
const recordPath = path.join(projectRoot, "assets", "compressed-images.json");

const folders = [
    { folder: "assets/photos", maxSize: 600 },
    { folder: "assets/images", maxSize: 1600 }
];

const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function getHash(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}

function loadRecord() {
    if (!fs.existsSync(recordPath)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(recordPath, "utf8"));
}

function saveRecord(record) {
    const sortedRecord = {};
    Object.keys(record).sort().forEach(function (key) {
        sortedRecord[key] = record[key];
    });
    fs.writeFileSync(recordPath, JSON.stringify(sortedRecord, null, 4) + "\n");
}

function formatKilobytes(byteCount) {
    return Math.round(byteCount / 1024) + " KB";
}

async function compress(buffer, extension, maxSize) {
    let image = sharp(buffer)
        .rotate()
        .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true });

    if (extension === ".jpg" || extension === ".jpeg") {
        image = image.jpeg({ quality: 80, mozjpeg: true });
    } else if (extension === ".png") {
        image = image.png({ compressionLevel: 9, palette: true, quality: 90 });
    } else if (extension === ".webp") {
        image = image.webp({ quality: 80 });
    }

    return image.toBuffer();
}

async function main() {
    const record = loadRecord();
    let compressedCount = 0;
    let skippedCount = 0;

    for (const { folder, maxSize } of folders) {
        const folderPath = path.join(projectRoot, folder);
        if (!fs.existsSync(folderPath)) {
            continue;
        }

        const fileNames = fs.readdirSync(folderPath).sort();
        for (const fileName of fileNames) {
            const extension = path.extname(fileName).toLowerCase();
            if (!supportedExtensions.includes(extension)) {
                continue;
            }

            const relativePath = folder + "/" + fileName;
            const filePath = path.join(folderPath, fileName);
            const original = fs.readFileSync(filePath);

            if (record[relativePath] === getHash(original)) {
                skippedCount = skippedCount + 1;
                continue;
            }

            const compressed = await compress(original, extension, maxSize);

            if (compressed.length < original.length) {
                fs.writeFileSync(filePath, compressed);
                record[relativePath] = getHash(compressed);
                console.log(relativePath + ": " + formatKilobytes(original.length) + " -> " + formatKilobytes(compressed.length));
            } else {
                record[relativePath] = getHash(original);
                console.log(relativePath + ": already small, left as is");
            }
            compressedCount = compressedCount + 1;
        }
    }

    saveRecord(record);
    console.log("Done. Processed " + compressedCount + " image(s), skipped " + skippedCount + " already compressed.");
}

main();
