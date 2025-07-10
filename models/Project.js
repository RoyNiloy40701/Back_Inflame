import mongoose, { Schema, models, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, required: true },
    images: { type: [String] },
    description: { type: String },
    blogcategory: { type: [String] },
    tags: { type: [String] },
    status: { type: String, enum: ["draft", "publish"], default: "draft" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

export const Project = models.Project || model("Project", ProjectSchema, "projects");




















// const { Schema, models, model } = require("mongoose");



// const projectSchema = new Schema(
//   {
//     title: { type: String },
//     slug: { type: String, required: true, unique: true },
//     images: { type: [String] },
//     description: { type: String },
//     client: { type: String },
//     projectcategory: { type: [String] },
//     tags: { type: [String] },
//     livepreview: { type: String },
//     status: { type: String, enum: ["draft", "publish"], default: "draft" },
//   },
//   {
//     timestamps: true,
//   }
// );


// export const Project = models.Project || model("Project", projectSchema, "projects");