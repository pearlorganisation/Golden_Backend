const cloudinary = require("../utils/cloudinaryConfig");
const addWatermark = require("../utils/pdfWatermarker");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
    });

    fs.unlinkSync(filePath);

    res
      .status(200)
      .json({ message: "File uploaded successfully", url: result.secure_url });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const user = { name: "Shubham Mamgain" };
    const watermarkText = `Watermarked for: ${user.name} for Golden Website`;

    const pdfUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/raw/upload/v1234567890/sample.pdf`;

    const watermarkedPdfBytes = await addWatermark(pdfUrl, watermarkText);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="watermarked.pdf"',
    });
    res.send(Buffer.from(watermarkedPdfBytes));
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
};
