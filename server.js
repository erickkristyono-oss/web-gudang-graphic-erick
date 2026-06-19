const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Untuk menerima data format JSON (misal dari fetch/axios)
app.use(express.urlencoded({ extended: true })); // BARU: Penting agar bisa membaca data dari form HTML biasa

// Mengatur folder 'public' agar bisa diakses di browser
// Pastikan file 'login.html' kamu berada di dalam folder 'public' ini ya!
app.use(express.static(path.join(__dirname, 'public')));

// --- KONEKSI DATABASE ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Ganti jika username berbeda
    password: '',      // Isi password MySQL kamu jika ada
    database: 'gudang_graphic'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err);
        return;
    }
    console.log('Terhubung ke database Gudang Graphic!');
});

// --- ROUTE API (FITUR LOGIN) ---
app.post('/login', (req, res) => {
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    if (!emailInput || !passwordInput) {
        return res.status(400).send('<h1>Login Gagal</h1><p>Email dan Password harus diisi.</p>');
    }

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [emailInput, passwordInput], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan pada server.');
        }


        if (results.length > 0) {

            res.redirect('/index.html');


        } else {
            res.send('<h1>Login Gagal!</h1><p>Email atau password salah.</p><p><a href="javascript:history.back()">Kembali ke halaman login</a></p>');
        }
        // ---------------------------
    });
});

// --- ROUTE API (FITUR REGISTER) ---
app.post('/register', (req, res) => {
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    // Validasi jika ada input yang kosong
    if (!emailInput || !passwordInput) {
        return res.status(400).send('<h1>Registrasi Gagal</h1><p>Email dan Password harus diisi.</p>');
    }

    // Query untuk MEMASUKKAN data baru ke tabel users
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.query(sql, [emailInput, passwordInput], (err, results) => {
        if (err) {
            console.error(err);
            // Jika error disebabkan karena email sudah ada di database (Constraint UNIQUE)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send('<h1>Registrasi Gagal!</h1><p>Email ini sudah terdaftar. Silakan gunakan email lain atau login.</p><p><a href="/register.html">Kembali</a></p>');
            }
            return res.status(500).send('Terjadi kesalahan pada server saat mendaftar.');
        }

        // Jika berhasil disimpan, kirim pesan sukses dan beri link untuk login
        res.send(`
            <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
                <h1>Pendaftaran Berhasil!</h1>
                <p>Akun dengan email <b>${emailInput}</b> telah dibuat.</p>
                <p><a href="/login.html">Silakan klik di sini untuk Login</a></p>
            </div>
        `);
    });
});

// --- ROUTE API PRODUK/SERVICES (KOREKSI ERROR HANDLING) ---
app.get('/api/services', (req, res) => {
    const sql = "SELECT * FROM services";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message }); // PERBAIKAN: Gunakan return agar kode berhenti jika error
        }
        res.json(results);
    });
});

// --- JALANKAN SERVER ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});