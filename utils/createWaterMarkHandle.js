import { sendDownloadPdfMail } from "./mail/sendMail.js";
import addWatermark from "./pdfWatermarker.js";
import AdmZip from "adm-zip";

const createAndSendPdfMail = async (
  pdfUrls,
  isAll,
  buyerEmail,
  buyerName,
  buyerNumber
) => {
  const user = {
    name: buyerName,
    email: buyerEmail,
    mobileNumber: buyerNumber,
  };

  const waterMarkText = `Name: ${user.name}\nEmail: ${user.email}\nNumber: ${user.mobileNumber}`;
  const email = buyerEmail;

  // const waterMarkPdfBytes = await addWatermark(pdfUrl, waterMarkText);
  // console.log("--------------the water marked pdf bytes are", waterMarkPdfBytes)
  // if(waterMarkPdfBytes){
  //     try {
  //         const result = await sendDownloadPdfMail(
  //             email,
  //             Buffer.from(waterMarkPdfBytes)
  //         )
  //         return result
  //     } catch (error) {
  //        console.log(error);
  //        return error;
  //     }
  // }
  try {
    if (Array.isArray(pdfUrls)) {
      // Multiple PDFs: Add watermark and create zip
      const watermarkedPdfs = await Promise.all(
        pdfUrls.map((url) => addWatermark(url, waterMarkText))
      );
      const zip = new AdmZip();
      console.log("the length of watermarked pdfs", watermarkedPdfs.length);
      const batchSize = 5;
      let result;
      for (let i = 0; i < watermarkedPdfs.length; i += batchSize) {
        const batch = watermarkedPdfs.slice(i, i + batchSize);
        const zip = new AdmZip();
        batch.forEach((pdfBuffer, index) => {
          zip.addFile(
            `watermarked-file-${i + index + 1}.pdf`,
            Buffer.from(pdfBuffer)
          );
        });

        const zipBuffer = zip.toBuffer();
        await sendDownloadPdfMail(email, zipBuffer, true);
      }
      return { message: "All batches sent successfully" };
    } else {
      // Single PDF: Add watermark and send directly
      const waterMarkPdfBytes = await addWatermark(pdfUrls, waterMarkText);
      if (waterMarkPdfBytes) {
        const result = await sendDownloadPdfMail(
          email,
          Buffer.from(waterMarkPdfBytes),
          false
        );
        return result;
      }
    }
  } catch (error) {
    console.log("Error processing PDFs:", error);
    return error;
  }
};

export default createAndSendPdfMail;
