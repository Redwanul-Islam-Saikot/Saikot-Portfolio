import mongoose, { Schema, models, model } from "mongoose";

const SkillSchema = new Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  iconUrl: { type: String, default: "" }, // required তুলে দিয়ে default ফাকা রাখা হয়েছে
});

const AboutSchema = new Schema(
  {
    subtitle: { type: String, required: true },
    description: { type: String, default: "" }, 
    bioText: { type: String, default: "" }, // bioText ফিল্ড যুক্ত করা হয়েছে যেন validation failure না হয়
    imageUrl: { type: String, required: true },
    cvUrl: { type: String, required: true },
    skills: [SkillSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const About = models.About || model("About", AboutSchema);
export default About;