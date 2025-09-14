const mongoose = require("mongoose");

const mythSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, trim: true },
    category: { type: String, default: "general", trim: true },
    tags: [{ type: String, trim: true }],
    references: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

mythSchema.pre("save", async function (next) {
    if (this.isModified("title") && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const existing = await mongoose.models.Myth.findOne({ slug: this.slug, _id: { $ne: this._id } });
        if (existing) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }
    next();
});

mythSchema.index({ title: "text", content: "text" });
mythSchema.index({ tags: 1 });
mythSchema.index({ category: 1 });

module.exports = mongoose.model("Myth", mythSchema);
