import {
  PDFDocument,
  rgb
} from "pdf-lib";
import fetch from "node-fetch";

const addWatermark = async (pdfUrl, watermarkText) => {
  const pdfBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(pdfBuffer);

  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    const {
      width,
      height
    } = page.getSize();
    const fontSize = 36;

    // Adjust coordinates for top-right corner placement
    const x = width - fontSize * watermarkText.length * 0.6; // Approximation for text width
    const y = height - fontSize - 10; // Offset slightly from the top

    page.drawText(watermarkText, {
      x,
      y,
      size: fontSize,
      color: rgb(0.95, 0.1, 0.1),
      opacity: 0.8,
    });
  });

  return pdfDoc.save();
};

export default addWatermark;
