import mongoose, { Schema, models, model } from "mongoose";

const HeroSchema = new Schema(
  {
    greeting: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cvUrl: { type: String, default: "" },
    
    // Social Links (# default rakha hoyeche jeno store thake)
    instagramUrl: { type: String, default: "#" },
    linkedinUrl: { type: String, default: "#" },
    facebookUrl: { type: String, default: "#" },
    whatsappUrl: { type: String, default: "#" },
    dribbbleUrl: { type: String, default: "#" },
    behanceUrl: { type: String, default: "#" },

    // Stats
    experienceYears: { type: String, required: true },
    projectsDone: { type: String, required: true },
    happyClients: { type: String, required: true },

    // Active Status
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Hero = models.Hero || model("Hero", HeroSchema);
export default Hero;