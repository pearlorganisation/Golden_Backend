import { PDFDocument, rgb } from "pdf-lib";
import fetch from "node-fetch";

const addWatermark = async (pdfUrl, watermarkText) => {
  const pdfBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer());

  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Add watermark to all pages
  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 4,
      y: height / 2,
      size: 24,
      color: rgb(0.95, 0.1, 0.1),
      opacity: 0.5,
      rotate: { degrees: 45 },
    });
  });

  // Return watermarked PDF bytes
  return pdfDoc.save();
};

export default addWatermark;
