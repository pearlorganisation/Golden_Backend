import { sendDownloadPdfMail } from "./mail/sendMail.js"
import addWatermark from "./pdfWatermarker.js"

 const createAndSendPdfMail = async(pdfUrl, buyerEmail, buyerName)=>{
    const user = {name: buyerName}
    const waterMarkText = `Name: ${user.name}`
    const email = buyerEmail

    const waterMarkPdfBytes = await addWatermark(pdfUrl, waterMarkText);
    if(waterMarkPdfBytes){
        try {
            const result = await sendDownloadPdfMail(
                email,
                Buffer.from(waterMarkPdfBytes)
            )
        } catch (error) {
           console.log(error);
           return error;
        }
    }
}

export default createAndSendPdfMail;