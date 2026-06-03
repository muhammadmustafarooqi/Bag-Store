"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const categorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    image: { type: String },
    imagePublicId: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
categorySchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
    }
    next();
});
exports.default = mongoose_1.default.models.Category || mongoose_1.default.model('Category', categorySchema);
