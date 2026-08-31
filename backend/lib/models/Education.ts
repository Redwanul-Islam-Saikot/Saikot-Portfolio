import mongoose, { Schema, model, models } from "mongoose";

const EducationSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["B.Sc", "HSC", "SSC", "JSC", "PSC"],
      default: "B.Sc",
    },
    title: { type: String, default: "" }, // Name / Project / Degree Title
    imageUrl: { type: String, default: "" },
    link: { type: String, default: "" },
    result: { type: String, default: "" },
    instituteName: { type: String, default: "" },
    session: { type: String, default: "" },
    passingYear: { type: String, default: "" },
    board: { type: String, default: "" },
    group: { type: String, default: "" },
    programmeName: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Education || model("Education", EducationSchema);