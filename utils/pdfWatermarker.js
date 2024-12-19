import hummus from "hummus"
import fetch from "node-fetch"



// import {
//   PDFDocument,
//   rgb,
//   degrees,
//   StandardFonts
// } from "pdf-lib";
// import fetch from "node-fetch";

// const addWatermark = async (pdfUrl, watermarkText) => {
//   const pdfBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer());

//   const pdfDoc = await PDFDocument.load(pdfBuffer);

//   const pages = pdfDoc.getPages();
//   pages.forEach((page) => {
//     const { width, height } = page.getSize();
//     page.drawText(watermarkText, {
//       x: width / 4,
//       y: height / 2,
//       size: 36,
//       color: rgb(0.95, 0.1, 0.1),
//       opacity: 0.8,
//     });
//   });

//   return pdfDoc.save();
// };

 
//  const hummus = require('hummus');
//  const fetch = require('node-fetch');
 

 const addWatermark = async (pdfUrl, watermarkText, fontPath) => {
   try {
     const pdfBytes = await fetch(pdfUrl).then(res => res.buffer()); // Fetch PDF from URL
     const pdfReader = hummus.createReader(new hummus.PDFRStreamForBuffer(pdfBytes));
     const pdfWriter = hummus.createWriter(new hummus.PDFWStreamForBuffer());
     const font = pdfWriter.getFontForFile(fontPath);

     const pageCount = pdfReader.getPagesCount();
     for (let i = 0; i < pageCount; i++) {
       const originalPage = pdfReader.parsePage(i);
       pdfWriter.createPage(originalPage);
       const page = pdfWriter.modifyPage(i);
       const {
         width,
         height
       } = page.getSize();
       const textWidth = font.widthOfTextAtSize(watermarkText, 36);
       const x = (width - textWidth) / 2;
       const y = height / 2;


       page.writeText(watermarkText, x, y, {
         font,
         size: 36,
         color: [0.95, 0.1, 0.1],
         opacity: 0.8,
       });


       page.end();
     }

     pdfWriter.end();
     return pdfWriter.toBuffer(); // Return the modified PDF buffer

   } catch (error) {
     console.error('Error adding watermark:', error);
     throw error; // Re-throw for proper error handling in the calling function
   }
 };

export default addWatermark;
