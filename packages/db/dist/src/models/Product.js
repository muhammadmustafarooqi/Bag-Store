"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const reviewSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const imageSchema = new mongoose_1.default.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
});
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: {
        type: String,
        enum: [
            'handbag',
            'backpack',
            'laptop bag',
            'tote',
            'travel bag',
            'clutch',
            'wallet',
            'school bag',
        ],
        required: true,
    },
    brand: { type: String, default: 'KAARVAN' },
    sku: { type: String, unique: true, sparse: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    onSale: { type: Boolean, default: false },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [imageSchema],
    colors: [{ type: String }],
    material: { type: String },
    dimensions: { type: String },
    weight: { type: String },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
    reviews: [reviewSchema],
    tags: [{ type: String }],
}, { timestamps: true, suppressReservedKeysWarning: true });
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
    }
    if (this.reviews && this.reviews.length > 0) {
        if (!this.ratings)
            this.ratings = { average: 0, count: 0 };
        const total = this.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        this.ratings.average = +(total / this.reviews.length).toFixed(1);
        this.ratings.count = this.reviews.length;
    }
    next();
});
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNew: 1 });
exports.default = mongoose_1.default.models.Product || mongoose_1.default.model('Product', productSchema);
