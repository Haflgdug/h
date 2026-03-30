import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { body, validationResult } from 'express-validator';
import Order from './models/Order.js';

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- إعدادات الحماية والأمان ---
app.use(helmet()); // حماية HTTP Headers
app.use(cors({ origin: process.env.CLIENT_URL })); // منع طلبات من مواقع غريبة (CSRF Protection)
app.use(express.json({ limit: '10kb' })); // منع هجمات إغراق السيرفر
app.use(mongoSanitize()); // منع حقن قواعد البيانات NoSQL Injection
app.use(xss()); // منع هجمات XSS

// --- الاتصال بقاعدة البيانات ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Securely'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- نظام تسجيل الطلبات والدفع ---
app.post('/api/checkout', [
    // التحقق من المدخلات (Input Validation)
    body('customerName').trim().isLength({ min: 3 }).escape(),
    body('phone').isMobilePhone().escape(),
    body('address').trim().isLength({ min: 10 }).escape(),
    body('cart').isArray({ min: 1 }),
], async (req, res) => {
    
    // إذا كان هناك خطأ في البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { customerName, phone, address, cart, totalAmount, paymentMethod } = req.body;

        // 1. حفظ الطلب في قاعدة البيانات (مبدئياً غير مدفوع)
        const newOrder = new Order({ customerName, phone, address, products: cart, totalAmount, paymentMethod });
        await newOrder.save();

        // 2. إذا كان الدفع عبر Stripe
        if (paymentMethod === 'visa' || paymentMethod === 'mastercard') {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: cart.map(item => ({
                    price_data: {
                        currency: 'usd',
                        product_data: { name: item.nameEn },
                        unit_amount: item.price * 100, // Stripe يتعامل بالسنت
                    },
                    quantity: 1,
                })),
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}?payment=success`,
                cancel_url: `${process.env.CLIENT_URL}?payment=failed`,
            });
            // إرسال رابط الدفع للفرونت اند
            return res.json({ url: session.url });
        }

        // 3. إذا كان الدفع عند الاستلام
        res.json({ message: "Order placed successfully for COD", url: `${process.env.CLIENT_URL}?payment=cod_success` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during checkout' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Secure Server running on port ${PORT}`));

//LPZ8BH9Sq7XFsY5m