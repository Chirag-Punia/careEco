import Website from "../models/websiteModel.js";
import { generateWebsite } from "../services/websiteGenerator.js";
import { uploadToS3 } from "../services/s3Service.js";

export const generateWebsiteController = async (req, res) => {
  try {
    const websiteData = req.body;

    const uploadedImages = [];

    if (req.files && websiteData.products) {
      for (let i = 0; i < websiteData.products.length; i++) {
        const product = websiteData.products[i];
        if (req.files[i] && !product.image) {
          const imageBuffer = req.files[i].buffer;
          const imageKey = `${websiteData.businessName.toLowerCase().replace(/\s+/g, "-")}/images/${Date.now()}-${product.name.toLowerCase().replace(/\s+/g, "-")}.jpg`;

          const imageUrl = await uploadToS3({ [imageKey]: imageBuffer }, websiteData.businessName, "image/jpeg");
          uploadedImages.push(imageUrl[imageKey]);
          product.imageUrl = imageUrl;
        }
      }
    }

    const { files, websiteId } = await generateWebsite(websiteData, req.user._id);
    const uploadedFiles = await uploadToS3(files, websiteData.businessName);

    const websiteUrl = uploadedFiles["index.html"];
    const scriptJsUrl = uploadedFiles["script.js"];

    const website = new Website({
      userId: req.user._id,
      businessName: websiteData.businessName,
      email: websiteData.email,
      phone: websiteData.phone,
      websiteUrl,
      scriptJsUrl,
      images: uploadedImages,
      files: {
        indexHtmlUrl: websiteUrl,
        scriptJsUrl,
      },
    });

    await website.save();

    res.json({
      success: true,
      websiteUrl,
      scriptJsUrl,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error generating website:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
