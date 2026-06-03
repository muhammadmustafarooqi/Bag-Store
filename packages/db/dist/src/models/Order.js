"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    color: { type: String },
});
const shippingAddressSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: {
        type: String,
        enum: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'Islamabad'],
        required: true,
    },
});
const orderSchema = new mongoose_1.default.Schema({
    orderId: { type: String, unique: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    guestInfo: {
        name: String,
        email: String,
        phone: String,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
        type: String,
        enum: ['COD', 'JazzCash'],
        required: true,
        default: 'COD',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    jazzCashTransactionId: { type: String },
    orderStatus: {
        type: String,
        enum: [
            'placed',
            'confirmed',
            'packed',
            'shipped',
            'delivered',
            'cancelled',
            'returned',
        ],
        default: 'placed',
    },
    trackingNumber: { type: String },
    courierName: { type: String },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String },
    notes: { type: String },
    placedAt: { type: Date, default: Date.now },
}, { timestamps: true });
orderSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.orderId) {
            const year = new Date().getFullYear();
            const count = yield mongoose_1.default.model('Order').countDocuments();
            this.orderId = `KRV-${year}-${String(count + 1).padStart(4, '0')}`;
        }
        next();
    });
});
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ placedAt: -1 });
exports.default = mongoose_1.default.models.Order || mongoose_1.default.model('Order', orderSchema);
