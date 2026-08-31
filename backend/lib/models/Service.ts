import mongoose, { Schema, models, model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconUrl: { type: String, required: true }, // Cloudinary Image/Icon Link
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = models.Service || model("Service", ServiceSchema);
export default Service;