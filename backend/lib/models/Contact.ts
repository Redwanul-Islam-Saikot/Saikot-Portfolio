import mongoose, { Schema, model, models } from "mongoose";

// ১. কাস্টমার মেসেজ স্কিমা
const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String },
    timeline: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// ২. অ্যাডমিন সেকশন কনফিগারেশন স্কিমা
const ContactSectionSchema = new Schema(
  {
    title: { type: String, default: "Contact me" },
    subtitle: {
      type: String,
      default: "Cultivating Connections: Reach Out And Connect With Me",
    },
    servicesOptions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    messages: [ContactMessageSchema], // সব মেসেজ এখানে সেভ হবে
  },
  { timestamps: true }
);

export default models.ContactSection ||
  model("ContactSection", ContactSectionSchema);