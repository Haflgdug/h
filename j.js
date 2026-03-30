// بيانات المنتجات (يمكنك إضافة المزيد هنا)
const products = [
    { id: 1, name: "عطر ليالي الشرق", category: "perfume", price: 120, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "نظارة شمسية كلاسيك", category: "glasses", price: 85, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "بدلة رسمية إيطالية", category: "clothes", price: 350, img: "https://images.unsplash.com/photo-1593030761757-71fae4630b14?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "عطر العود الملكي", category: "perfume", price: 150, img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=400&q=80" },
    { id: 5, name: "نظارة عصرية", category: "glasses", price: 95, img: "https://images.unsplash.com/photo-1572635196237-14b3f281501f?auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "قميص قطني فاخر", category: "clothes", price: 60, img: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=400&q=80" }
];

// مصفوفة سلة المشتريات
let cart = [];

// دالة التنقل بين الصفحات
function showPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // إظهار الصفحة المطلوبة
    document.getElementById(pageId).classList.add('active');

    // إذا ذهبنا للمتجر، نعرض كل المنتجات
    if(pageId === 'shop') {
        renderProducts(products);
    }
}

// دالة عرض المنتجات في صفحة المتجر
function renderProducts(items) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // تنظيف الشبكة
    
    items.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <button onclick="addToCart(${product.id})">أضف إلى السلة</button>
            </div>
        `;
        productList.innerHTML += productHTML;
    });
}

// دالة فلترة المنتجات حسب الفئة
function filterProducts(category, btnElement) {
    // تفعيل وتغيير لون زر الفلتر النشط
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active-filter'));
    btnElement.classList.add('active-filter');

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// دالة إضافة منتج للسلة
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    alert(`تمت إضافة "${product.name}" إلى السلة بنجاح!`);
}

// دالة حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// دالة تحديث واجهة السلة (العدد، العناصر، الإجمالي)
function updateCartUI() {
    // تحديث العداد في شريط التصفح
    document.getElementById('cart-count').innerText = cart.length;

    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center;">سلتك فارغة حالياً.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <img src="${item.img}" alt="${item.name}">
                        <h4>${item.name}</h4>
                    </div>
                    <div>
                        <span style="font-weight:bold; margin-left:15px;">$${item.price}</span>
                        <button class="remove-btn" onclick="removeFromCart(${index})">حذف</button>
                    </div>
                </div>
            `;
        });
    }
    
    // تحديث السعر الإجمالي
    totalPriceEl.innerText = total;
}

// تهيئة الموقع عند الفتح (عرض الرئيسية كبداية)
window.onload = () => {
    showPage('home');
    updateCartUI();
};
