import { sendDownloadPdfMail } from "./mail/sendMail.js"
import addWatermark from "./pdfWatermarker.js"

 const createAndSendPdfMail = async(pdfUrl, buyerEmail, buyerName, buyerNumber)=>{
    const user = {
        name: buyerName,
        email: buyerEmail,
        mobileNumber: buyerNumber
        }
     
const waterMarkText = `Name: ${user.name}\nEmail: ${user.email}\nNumber: ${user.mobileNumber}`
  const email = buyerEmail

    const waterMarkPdfBytes = await addWatermark(pdfUrl, waterMarkText);
    if(waterMarkPdfBytes){
        try {
            const result = await sendDownloadPdfMail(
                email,
                Buffer.from(waterMarkPdfBytes)
            )
            return result
        } catch (error) {
           console.log(error);
           return error;
        }
    }
}

export default createAndSendPdfMail;