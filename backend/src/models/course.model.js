import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    mentor: {
      type: String,
      required: true,
      trim: true,
      default: "Skill Nest Mentor",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    enrolledStudents: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);