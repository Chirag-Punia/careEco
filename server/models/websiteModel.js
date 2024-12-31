import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    scriptJsUrl: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    files: {
      indexHtmlUrl: String,
      scriptJsUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

const Website = mongoose.model("Website", websiteSchema);

export default Website;
