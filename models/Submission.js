const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },

    // Who submitted
    submittedBy: {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true }
    },

    // Review status
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewComment: { type: String, trim: true },
    reviewedAt: { type: Date }
}, { timestamps: true });

// Indexes for queries
submissionSchema.index({ status: 1 });
submissionSchema.index({ "submittedBy.email": 1 });
submissionSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Submission", submissionSchema);
