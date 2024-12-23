import addWatermark from "../utils/pdfWatermarker.js";
import fs from "fs";

export const uploadFile = async (req, res) => {
  //   try {
  //     const filePath = req.file.path;
  //     const result = await cloudinary.uploader.upload(filePath, {
  //       resource_type: "raw",
  //     });
  //     fs.unlinkSync(filePath);
  //     res.status(200).json({
  //       message: "File uploaded successfully",
  //       url: result.secure_url,
  //     });
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     res.status(500).json({ error: "Failed to upload file" });
  //   }
};

export const downloadFile = async (req, res) => {
  try {
    const user = { name: "Shubham Mamgain" };
    const watermarkText = `Name: ${user.name}`;

    const pdfUrl =
      "https://res.cloudinary.com/dapjyizvj/raw/upload/v1734943843/uploads/reev5wluktdww2c0jqd3.pdf";

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
