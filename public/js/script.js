document.addEventListener("DOMContentLoaded", () => {
    console.log("Website Gudang Graphic Siap!");


    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        })
    });
});

// PROSES CHECKOUT 

async function processCheckout(event) {
    event.preventDefault(); // Mencegah form me-refresh halaman

    // 1. TAMBAHAN: Cek kedua kemungkinan nama keranjang
    let cart = JSON.parse(localStorage.getItem('gudangCart')) || JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Keranjang Anda kosong! Silakan pilih jasa terlebih dahulu.");
        window.location.href = 'product.html';
        return;
    }

    // Ambil data dari form input
    const name = document.getElementById('c_name').value;
    const email = document.getElementById('c_email').value;
    const phone = document.getElementById('c_phone').value;

    // 2. TAMBAHAN: Ubah tombol menjadi "Memproses..." agar tidak di-klik 2 kali
    const submitBtn = document.querySelector('#checkout-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerText = "Sedang Memproses...";
        submitBtn.disabled = true;
    }

    // Hitung total harga
    let total = 0;
    cart.forEach(item => total += parseInt(item.price));

    // 3. TAMBAHAN: Pastikan nama produk terbaca (mengatasi masalah item.name vs item.title)
    const formattedItems = cart.map(item => ({
        title: item.title || item.name, // Ambil title, jika tidak ada ambil name
        price: item.price
    }));

    // Siapkan bungkusan data untuk dikirim ke server
    const orderData = {
        name: name,
        email: email,
        phone: phone,
        total: total,
        items: formattedItems
    };

    // Kirim data ke API Checkout
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();

        if (response.ok) {
            alert(`Terima kasih, ${name}! Pesanan Anda berhasil dibuat (ID Pesanan: ${result.orderId}). Tim kami akan segera menghubungi Anda.`);
            localStorage.removeItem('gudangCart'); // Kosongkan keranjang
            localStorage.removeItem('cart');       // Bersihkan juga jika ada
            window.location.href = 'index.html'; // Kembalikan ke halaman utama
        } else {
            alert("Terjadi kesalahan sistem: " + result.error);
        }
    } catch (err) {
        console.error("Error Checkout:", err);
        alert("Gagal terhubung ke server. Pastikan server Node.js menyala.");
    } finally {
        // Kembalikan tombol seperti semula jika terjadi error
        if (submitBtn) {
            submitBtn.innerText = "Selesaikan Pesanan & Bayar";
            submitBtn.disabled = false;
        }
    }
}

// Pasang pendengar event pada form checkout
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', processCheckout);
    }
});


// PROSES CONTACT US

async function processContact(event) {
    event.preventDefault(); // Mencegah form me-refresh halaman

    // Ambil data dari inputan
    const name = document.getElementById('msg_name').value;
    const email = document.getElementById('msg_email').value;
    const message = document.getElementById('msg_text').value;

    const submitBtn = document.querySelector('#contact-form button[type="submit"]');

    // Ubah teks tombol saat loading
    if (submitBtn) {
        submitBtn.innerText = "Mengirim...";
        submitBtn.disabled = true;
    }

    try {
        // Kirim data ke backend server.js
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
            // Memunculkan notifikasi persis seperti yang Anda minta
            alert("Pesan Anda sudah terkirim, team kami akan membalas pesan Anda.");

            // Kosongkan form setelah pesan terkirim
            document.getElementById('contact-form').reset();
        } else {
            alert("Maaf, sistem sedang sibuk. Gagal mengirim pesan.");
        }
    } catch (err) {
        console.error("Error Contact:", err);
        alert("Gagal terhubung ke server. Pastikan server Node.js menyala.");
    } finally {
        // Kembalikan teks tombol seperti semula
        if (submitBtn) {
            submitBtn.innerText = "Kirim Pesan";
            submitBtn.disabled = false;
        }
    }
}