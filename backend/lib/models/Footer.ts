import mongoose, { Schema, model, models } from "mongoose";

const FooterSchema = new Schema(
  {
    logoText: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    copyrightText: { type: String, default: "" },
    instagramUrl: { type: String, default: "#" },
    linkedinUrl: { type: String, default: "#" },
    facebookUrl: { type: String, default: "#" },
    whatsappUrl: { type: String, default: "#" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Footer = models.Footer || model("Footer", FooterSchema);
export default Footer;