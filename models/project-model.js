const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    projectName: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 100 },
    longDescription: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    budget: { type: String, required: true },
    budgetItems: [
      {
        itemName: String,
        amount: Number
      }
    ],
    moneyReceived: { type: Number, default: 0 },
    endDate: { type: Date, required: true },
    expectedReleaseDate: { type: Date, required: true },
    comments: { type: [String] },
    format: { type: String },
    genre: { type: [String] },
    locations: { type: String },
    progress: {
      type: String,
      default: "in funding",
      enum: ["in funding", "in production", "completed"]
    },
    cast: [
      {
        role: { type: String },
        name: { type: String }
      }
    ],
    crew: [
      {
        role: { type: String },
        name: { type: String }
      }
    ],
    videoFile: { type: String },
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

projectSchema.virtual("getCreatedAt").get(function() {
  return moment(this.createdAt).format("DD MMMM YYYY");
});

projectSchema.virtual("getEndDate").get(function() {
  return moment(this.endDate).format("DD MMMM YYYY");
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
