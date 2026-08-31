import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Static", "Dynamic"],
      required: true,
    },
    imageUrl: { type: String, required: true },
    liveUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);