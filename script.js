// بيانات المنتجات تدعم اللغتين
const products = [
    { id: 1, nameAr: "عطر ليالي الشرق", nameEn: "Oriental Nights Perfume", category: "perfume", price: 120, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80" },
    { id: 2, nameAr: "نظارة شمسية كلاسيك", nameEn: "Classic Sunglasses", category: "glasses", price: 85, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80" },
    { id: 3, nameAr: "بدلة رسمية إيطالية", nameEn: "Italian Formal Suit", category: "clothes", price: 350, img: "https://images.unsplash.com/photo-1593030761757-71fae4630b14?auto=format&fit=crop&w=400&q=80" },
    { id: 4, nameAr: "عطر العود الملكي", nameEn: "Royal Oud Perfume", category: "perfume", price: 150, img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=400&q=80" },
    { id: 5, nameAr: "نظارة عصرية", nameEn: "Modern Glasses", category: "glasses", price: 95, img: "https://images.unsplash.com/photo-1572635196237-14b3f281501f?auto=format&fit=crop&w=400&q=80" },
    { id: 6, nameAr: "قميص قطني فاخر", nameEn: "Luxury Cotton Shirt", category: "clothes", price: 60, img: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=400&q=80" }
];

// قاموس الترجمة
const translations = {
    ar: {
        home: "الرئيسية", shop: "المتجر", cart: "السلة",
        heroTitle: "اكتشف الفخامة في كل تفصيلة",
        heroDesc: "تشكيلة حصرية من أرقى العطور، النظارات، والملابس المصممة خصيصاً لك.",
        shopNow: "تسوق الآن", contactTitle: "<i class='fas fa-gem'></i> ابقَ على تواصل معنا",
        contactDesc: "تابع أحدث صيحات الموضة والعروض الحصرية مباشرة عبر حساباتنا",
        followIg: "تابعنا على إنستغرام", shopTitle: "منتجاتنا المميزة",
        filterAll: "الكل", filterPerfume: "عطور", filterGlasses: "نظارات", filterClothes: "ملابس",
        addToCart: "<i class='fas fa-cart-plus'></i> أضف إلى السلة", cartTitle: "سلة المشتريات",
        total: "الإجمالي:", payMethod: "اختر طريقة الدفع:", checkout: "إتمام الطلب <i class='fas fa-check'></i>",
        visa: "فيزا", mastercard: "ماستركارد", paypal: "باي بال", cod: "عند الاستلام",
        emptyCart: "سلتك فارغة حالياً.", addedToCart: "تمت الإضافة إلى السلة بنجاح!",
        orderSuccess: "تم استلام طلبك! سيتم الدفع عبر: "
    },
    en: {
        home: "Home", shop: "Shop", cart: "Cart",
        heroTitle: "Discover Luxury in Every Detail",
        heroDesc: "An exclusive collection of the finest perfumes, glasses, and clothes tailored for you.",
        shopNow: "Shop Now", contactTitle: "<i class='fas fa-gem'></i> Get in Touch",
        contactDesc: "Follow the latest fashion trends and exclusive offers directly on our accounts",
        followIg: "Follow on Instagram", shopTitle: "Our Premium Products",
        filterAll: "All", filterPerfume: "Perfumes", filterGlasses: "Glasses", filterClothes: "Clothes",
        addToCart: "<i class='fas fa-cart-plus'></i> Add to Cart", cartTitle: "Shopping Cart",
        total: "Total:", payMethod: "Select Payment Method:", checkout: "Checkout <i class='fas fa-check'></i>",
        visa: "Visa", mastercard: "Mastercard", paypal: "PayPal", cod: "Cash on Delivery",
        emptyCart: "Your cart is currently empty.", addedToCart: "Successfully added to cart!",
        orderSuccess: "Order received! Payment via: "
    }
};

let currentLang = 'ar';
let cart = [];

// دالة تغيير اللغة
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('lang-text').innerText = currentLang === 'ar' ? 'EN' : 'AR';
    
    // تحديث كل العناصر التي تحتوي على data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.innerHTML = translations[currentLang][key];
        }
    });

    // إعادة رسم المنتجات والسلة باللغة الجديدة
    const activeFilter = document.querySelector('.active-filter').getAttribute('onclick').match(/'([^']+)'/)[1];
    filterProducts(activeFilter, document.querySelector('.active-filter'), true);
    updateCartUI();
}

// دالة التنقل
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(pageId === 'shop' && document.getElementById('product-list').innerHTML === '') {
        renderProducts(products);
    }
}

// رسم المنتجات مع دعم اللغة
function renderProducts(items) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    
    items.forEach((product, index) => {
        const delay = index * 0.1; 
        const productName = currentLang === 'ar' ? product.nameAr : product.nameEn;
        
        const productHTML = `
            <div class="product-card fade-in-item" style="animation-delay: ${delay}s">
                <div class="product-card-img-wrapper">
                    <img src="${product.img}" alt="${productName}">
                </div>
                <div class="product-info">
                    <h3>${productName}</h3>
                    <p class="price">$${product.price}</p>
                    <button onclick="addToCart(${product.id})">${translations[currentLang].addToCart}</button>
                </div>
            </div>
        `;
        productList.innerHTML += productHTML;
    });
}

function filterProducts(category, btnElement, isLangChange = false) {
    if (!isLangChange) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active-filter'));
        btnElement.classList.add('active-filter');
    }
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts(filtered);
}

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    showToast(translations[currentLang].addedToCart);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItemsContainer = document.getElementById('cart-items');
    document.getElementById('total-price').innerText = cart.reduce((sum, item) => sum + item.price, 0);
    
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; padding: 20px;">${translations[currentLang].emptyCart}</p>`;
    } else {
        cart.forEach((item, index) => {
            const itemName = currentLang === 'ar' ? item.nameAr : item.nameEn;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <img src="${item.img}" alt="${itemName}">
                        <h4>${itemName}</h4>
                    </div>
                    <div>
                        <span style="font-weight:bold; margin:0 15px; color: var(--gold-color);">$${item.price}</span>
                        <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
    }
}

function processCheckout() {
    if(cart.length === 0) {
        showToast(translations[currentLang].emptyCart);
        return;
    }
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    const paymentName = translations[currentLang][selectedPayment];
    showToast(translations[currentLang].orderSuccess + paymentName);
    cart = [];
    updateCartUI();
}

window.onload = () => {
    // تفعيل الترجمة المبدئية عند فتح الموقع
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = translations['ar'][key];
    });
    showPage('home');
    updateCartUI();
};

async function processCheckout() {
    if(cart.length === 0) return showToast(translations[currentLang].emptyCart);

    const customerName = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // تحقق من أن الحقول غير فارغة
    if(!customerName || !phone || !address) {
        return showToast("يرجى إدخال جميع معلومات الشحن!");
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

    try {
        // إرسال البيانات للسيرفر
        const response = await fetch('http://localhost:5000/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName, phone, address, cart, totalAmount, paymentMethod
            })
        });

        const data = await response.json();

        if (response.ok) {
            // توجيه المستخدم لصفحة الدفع الخاصة بـ Stripe أو صفحة النجاح
            window.location.href = data.url; 
        } else {
            showToast("حدث خطأ في البيانات، يرجى التأكد والمحاولة.");
            checkoutBtn.innerHTML = 'إتمام الطلب <i class="fas fa-check"></i>';
        }
    } catch (error) {
        showToast("خطأ في الاتصال بالسيرفر.");
        checkoutBtn.innerHTML = 'إتمام الطلب <i class="fas fa-check"></i>';
    }
}

// دالة لمعرفة إذا كان المستخدم عاد من صفحة الدفع بنجاح
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if(paymentStatus === 'success' || paymentStatus === 'cod_success') {
        showToast("تم تأكيد طلبك بنجاح! شكراً لتسوقك من vxteey.");
        cart = []; // تفريغ السلة
        updateCartUI();
        // إزالة الباراميتر من الرابط لتنظيفه
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
