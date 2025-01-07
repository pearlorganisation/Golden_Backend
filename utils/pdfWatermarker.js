// import {
//   PDFDocument,
//   rgb
// } from "pdf-lib";
// import fetch from "node-fetch";
 
// const addWatermark = async (pdfUrls, watermarkText) => {
//   const processPdf = async (pdfUrl) => {
//     const pdfBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer());
//     const pdfDoc = await PDFDocument.load(pdfBuffer);
//     const pages = pdfDoc.getPages();
//     const fontSize = 30; // Adjust font size for watermark text
//     const lineGap = 5; // Vertical gap between lines

//     pages.forEach((page) => {
//       const { width, height } = page.getSize();
//       const lines = watermarkText.split("\n");
//       const startX = width - 600; // Move to the top-right corner (adjust as needed)
//       let startY = height - 20; // Offset from the top edge (adjust as needed)

//       lines.forEach((line, index) => {
//         page.drawText(line, {
//           x: startX,
//           y: startY - index * (fontSize + lineGap),
//           size: fontSize,
//           color: rgb(0.95, 0.1, 0.1),
//           opacity: 0.8,
//         });
//       });
//     });

//     return pdfDoc.save();
//   };

//   if (Array.isArray(pdfUrls)) {
//     const watermarkedPdfs = await Promise.all(pdfUrls.map((url) => processPdf(url)));
//     return watermarkedPdfs;
//   } else {
//     return processPdf(pdfUrls);
//   }
// };
// export default addWatermark;

import {
  PDFDocument,
  rgb,
  StandardFonts
} from 'pdf-lib';
import fetch from 'node-fetch';

const addWatermark = async (pdfUrls, watermarkText) => {
  const processPdf = async (pdfUrl) => {
    const pdfBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Embed the font ONCE per document
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica); // Or any font you prefer


    const pages = pdfDoc.getPages();
    const fontSize = 30;
    const lineGap = 5;

    pages.forEach((page) => {
      const {
        width,
        height
      } = page.getSize();
      const lines = watermarkText.split("\n");
      const startX = width - 600;
      let startY = height - 20;

      lines.forEach((line, index) => {
        page.drawText(line, {
          x: startX,
          y: startY - index * (fontSize + lineGap),
          size: fontSize,
          font: helveticaFont, // Use the embedded font
          color: rgb(0.95, 0.1, 0.1),
          opacity: 0.8,
        });
      });
    });

    return pdfDoc.save();
  };

  if (Array.isArray(pdfUrls)) {
    const watermarkedPdfs = await Promise.all(
      pdfUrls.map((url) => processPdf(url))
    );
    return watermarkedPdfs;
  } else {
    return processPdf(pdfUrls);
  }
};

export default addWatermark;