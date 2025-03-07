import { asyncHandler } from "../utils/asyncHandler.js";
import createAndSendPdfMail from "../utils/createWaterMarkHandle.js";

export const sendPdfByAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, mobileNumber, selectedPdfUrl } = req.body;
  console.log("the requested body is", req.body);
  let pdfUrl = selectedPdfUrl.length === 1 ? selectedPdfUrl[0] : selectedPdfUrl;
  console.log("selected parsed pdf urls", pdfUrl);
  let isAll = true;
  if (name && email && mobileNumber && selectedPdfUrl) {
    try {
      const data = await createAndSendPdfMail(
        pdfUrl,
        isAll,
        email,
        name,
        mobileNumber
      );
      console.log("-----------the result is", data);
      // if(!data){

      // }
      return res
        .status(201)
        .json({ success: true, message: "Emails are sent " });
    } catch (error) {
      console.log("the error is", error);
      throw error;
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Please send all the details" });
  }
});
