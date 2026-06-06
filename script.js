/* ============================================
   GameAware – script.js
   Fitur: Navbar, Screening Test, Charts, Animasi
   ============================================ */

/* ============================================
   1. DAFTAR PERTANYAAN SCREENING
   ============================================ */
const questions = [
  {
    text: "Apakah kamu bermain Roblox lebih dari 5 jam dalam sehari?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah kamu merasa marah, cemas, atau gelisah ketika tidak bisa bermain Roblox?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah tugas sekolah atau pekerjaan rumah sering tertunda karena kamu bermain Roblox?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah kamu lebih memilih bermain Roblox dibandingkan menghabiskan waktu bersama teman atau keluarga?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah kamu pernah begadang hingga larut malam (di atas jam 12) demi bermain Roblox?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah pikiran kamu sering memikirkan Roblox meski sedang tidak bermain (misalnya di sekolah atau saat makan)?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah kamu terus bermain Roblox meski sudah berjanji kepada diri sendiri untuk berhenti?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah nilai atau prestasi akademikmu menurun sejak intensitas bermain Roblox meningkat?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah kamu pernah berbohong kepada orang tua tentang berapa lama kamu bermain Roblox?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  },
  {
    text: "Apakah kamu merasa bermain Roblox adalah satu-satunya hal yang membuatmu bahagia atau rileks?",
    options: ["Tidak Pernah", "Kadang", "Sering"]
  }
];

/* ============================================
   2. STATE SCREENING TEST
   ============================================ */
// Menyimpan jawaban user (default null = belum dijawab)
let answers = new Array(questions.length).fill(null);
let currentQuestion = 0; // Indeks pertanyaan yang sedang ditampilkan

/* ============================================
   3. INISIALISASI FORM PERTANYAAN
   ============================================ */
function initForm() {
  const form = document.getElementById('screeningForm');
  form.innerHTML = ''; // Kosongkan dulu

  questions.forEach((q, index) => {
    // Buat card tiap pertanyaan
    const card = document.createElement('div');
    card.className = `question-card${index === 0 ? ' active' : ''}`;
    card.id = `question-${index}`;

    card.innerHTML = `
      <div class="question-number">Pertanyaan ${index + 1}</div>
      <p class="question-text">${q.text}</p>
      <div class="options-group">
        ${q.options.map((opt, i) => `
          <label class="option-label${answers[index] === i ? ' selected' : ''}"
                 onclick="selectOption(${index}, ${i}, this)">
            <input type="radio" name="q${index}" value="${i}" ${answers[index] === i ? 'checked' : ''} />
            <span class="option-dot"></span>
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    `;

    form.appendChild(card);
  });

  updateProgress(); // Tampilkan progress awal
}

/* ============================================
   4. PILIH JAWABAN
   ============================================ */
function selectOption(questionIndex, value, labelEl) {
  // Simpan jawaban
  answers[questionIndex] = value;

  // Update UI: hilangkan selected dari semua opsi di pertanyaan ini
  const card = document.getElementById(`question-${questionIndex}`);
  card.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));

  // Tandai yang dipilih
  labelEl.classList.add('selected');

  // Otomatis pindah ke pertanyaan berikutnya setelah 500ms (UX lebih smooth)
  if (questionIndex < questions.length - 1) {
    setTimeout(() => nextQuestion(), 450);
  }
}

/* ============================================
   5. NAVIGASI PERTANYAAN
   ============================================ */
function nextQuestion() {
  // Validasi: harus sudah dijawab dulu
  if (answers[currentQuestion] === null) {
    shakeCurrentCard();
    return;
  }

  if (currentQuestion < questions.length - 1) {
    hideCard(currentQuestion);
    currentQuestion++;
    showCard(currentQuestion);
    updateProgress();
    updateNavButtons();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    hideCard(currentQuestion);
    currentQuestion--;
    showCard(currentQuestion);
    updateProgress();
    updateNavButtons();
  }
}

function hideCard(index) {
  const card = document.getElementById(`question-${index}`);
  if (card) card.classList.remove('active');
}

function showCard(index) {
  const card = document.getElementById(`question-${index}`);
  if (card) card.classList.add('active');
}

// Efek shake jika pertanyaan belum dijawab
function shakeCurrentCard() {
  const card = document.getElementById(`question-${currentQuestion}`);
  if (!card) return;
  card.style.animation = 'none';
  card.offsetHeight; // Reflow trick
  card.style.animation = 'shakeCard 0.4s ease';
  setTimeout(() => { card.style.animation = ''; }, 400);
}

/* ============================================
   6. UPDATE PROGRESS BAR & TOMBOL
   ============================================ */
function updateProgress() {
  const percent = Math.round((currentQuestion / (questions.length - 1)) * 100);

  // Hitung berapa yang sudah dijawab
  const answered = answers.filter(a => a !== null).length;
  const fillPercent = Math.round((answered / questions.length) * 100);

  document.getElementById('progressFill').style.width = fillPercent + '%';
  document.getElementById('questionCounter').textContent =
    `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
  document.getElementById('progressPercent').textContent = fillPercent + '%';
}

function updateNavButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  // Prev: disabled di pertanyaan pertama
  prevBtn.disabled = currentQuestion === 0;

  // Pertanyaan terakhir: tampilkan Submit, sembunyikan Next
  if (currentQuestion === questions.length - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-flex';
  } else {
    nextBtn.style.display = 'inline-flex';
    submitBtn.style.display = 'none';
  }
}

/* ============================================
   7. SUBMIT & HITUNG SKOR
   ============================================ */
function submitTest() {
  // Validasi: semua pertanyaan harus dijawab
  const unanswered = answers.findIndex(a => a === null);
  if (unanswered !== -1) {
    // Arahkan ke pertanyaan yang belum dijawab
    hideCard(currentQuestion);
    currentQuestion = unanswered;
    showCard(currentQuestion);
    updateProgress();
    updateNavButtons();
    shakeCurrentCard();
    alert(`Mohon jawab pertanyaan ${unanswered + 1} terlebih dahulu.`);
    return;
  }

  // Hitung total skor
  // Tidak Pernah = 0, Kadang = 1, Sering = 2
  const totalScore = answers.reduce((sum, val) => sum + val, 0);

  // Tampilkan hasil menggunakan logika if-else
  showResult(totalScore);
}

/* ============================================
   8. TAMPILKAN HASIL TES (if-else logic)
   ============================================ */
function showResult(score) {
  // Sembunyikan form test
  document.getElementById('testWrapper').style.display = 'none';

  // Tampilkan wrapper hasil
  const resultWrapper = document.getElementById('resultWrapper');
  resultWrapper.style.display = 'block';

  const resultCard = document.getElementById('resultCard');
  const resultIcon = document.getElementById('resultIcon');
  const resultScore = document.getElementById('resultScore');
  const resultCategory = document.getElementById('resultCategory');
  const resultDesc = document.getElementById('resultDesc');
  const resultTips = document.getElementById('resultTips');

  // Set skor
  resultScore.textContent = score;

  // ---- Logika if-else penilaian ----
  if (score >= 0 && score <= 6) {
    // KATEGORI: Normal
    resultIcon.textContent = '✅';
    resultCard.className = 'result-card normal';
    resultCategory.textContent = 'Masih dalam Batas Normal';
    resultDesc.textContent =
      `Skor kamu ${score}/20. Kamu tampaknya masih bisa mengelola waktu bermain Roblox dengan baik. 
       Pertahankan keseimbangan antara bermain game dan aktivitas penting lainnya.`;
    resultTips.innerHTML = `
      <h5>💡 Saran untuk Kamu</h5>
      <ul>
        <li>Tetap jaga pola bermain yang sehat dengan batas waktu jelas</li>
        <li>Prioritaskan belajar dan aktivitas offline setiap hari</li>
        <li>Gunakan game sebagai sarana relaksasi, bukan pelarian</li>
        <li>Jadwalkan waktu bersama keluarga dan teman setiap minggu</li>
      </ul>
    `;
  } else if (score >= 7 && score <= 13) {
    // KATEGORI: Berisiko
    resultIcon.textContent = '⚠️';
    resultCard.className = 'result-card risiko';
    resultCategory.textContent = 'Mulai Berisiko Kecanduan';
    resultDesc.textContent =
      `Skor kamu ${score}/20. Ada beberapa tanda bahwa Roblox mulai memengaruhi hidupmu secara negatif.
       Ini saatnya mulai mengambil langkah untuk menyeimbangkan kembali rutinitasmu.`;
    resultTips.innerHTML = `
      <h5>⚡ Langkah yang Disarankan</h5>
      <ul>
        <li>Tetapkan batas bermain maksimal 2 jam per hari mulai sekarang</li>
        <li>Selesaikan semua tugas sekolah sebelum membuka Roblox</li>
        <li>Matikan notifikasi game saat jam belajar dan malam hari</li>
        <li>Bicarakan dengan orang tua untuk membuat kesepakatan bersama</li>
        <li>Temukan hobi baru sebagai alternatif pengisi waktu luang</li>
      </ul>
    `;
  } else {
    // KATEGORI: Kecanduan (skor 14–20)
    resultIcon.textContent = '🚨';
    resultCard.className = 'result-card kecanduan';
    resultCategory.textContent = 'Terindikasi Kecanduan Roblox';
    resultDesc.textContent =
      `Skor kamu ${score}/20. Kamu menunjukkan banyak tanda kecanduan game yang cukup serius.
       Jangan abaikan ini — kondisi ini bisa memengaruhi kesehatan mental, akademik, dan hubungan sosialmu secara signifikan.`;
    resultTips.innerHTML = `
      <h5>🆘 Tindakan Penting Segera</h5>
      <ul>
        <li>Ceritakan kondisi ini kepada orang tua atau orang dewasa terpercaya</li>
        <li>Pertimbangkan untuk berkonsultasi dengan psikolog atau konselor</li>
        <li>Istirahat total dari Roblox selama minimal 1–2 minggu (digital detox)</li>
        <li>Buat rutinitas harian yang padat dengan aktivitas produktif</li>
        <li>Cari komunitas atau teman yang mendukung pola hidup sehat</li>
      </ul>
    `;
  }
  // ---- Akhir logika if-else ----

  // Animasi skor naik (count up)
  animateScore(score);
}

/* ============================================
   9. ANIMASI SKOR COUNT-UP
   ============================================ */
function animateScore(targetScore) {
  const el = document.getElementById('resultScore');
  let current = 0;
  const duration = 1200; // ms
  const steps = 60;
  const increment = targetScore / steps;
  const interval = duration / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= targetScore) {
      el.textContent = targetScore;
      clearInterval(timer);
    } else {
      el.textContent = Math.round(current);
    }
  }, interval);
}

/* ============================================
   10. RESET TES
   ============================================ */
function resetTest() {
  // Reset state
  answers = new Array(questions.length).fill(null);
  currentQuestion = 0;

  // Sembunyikan hasil, tampilkan form
  document.getElementById('resultWrapper').style.display = 'none';
  document.getElementById('testWrapper').style.display = 'block';

  // Re-inisialisasi form
  initForm();
  updateNavButtons();
}

/* ============================================
   11. NAVBAR SCROLL & HAMBURGER MENU
   ============================================ */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('open');
}

// Tutup menu saat klik link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ============================================
   12. SMOOTH SCROLL HELPER
   ============================================ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80; // Tinggi navbar
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ============================================
   13. INTERSECTION OBSERVER (animasi masuk)
   ============================================ */
// Animasi kartu info saat masuk viewport
const observerCards = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
    }
  });
}, { threshold: 0.15 });

// Observer akan dijalankan setelah DOM siap

/* ============================================
   14. CHART.JS – STATISTIK
   ============================================ */
function initCharts() {
  // Palet warna konsisten
  const blueGrad = ['rgba(59,130,246,0.85)', 'rgba(99,102,241,0.85)', 'rgba(124,58,237,0.85)',
                    'rgba(6,182,212,0.85)', 'rgba(20,184,166,0.85)'];
  const borderColors = ['#3b82f6', '#6366f1', '#7c3aed', '#06b6d4', '#14b8a6'];

  // Konfigurasi font global Chart.js
  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.color = '#475569';

  // ---- Chart 1: Doughnut – Persentase Remaja Bermain Game ----
  new Chart(document.getElementById('chartGamer'), {
    type: 'doughnut',
    data: {
      labels: ['Bermain Roblox', 'Game Lain', 'Tidak Bermain'],
      datasets: [{
        data: [42, 35, 23],
        backgroundColor: ['#3b82f6', '#7c3aed', '#e2e8f0'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      },
      cutout: '65%'
    }
  });

  // ---- Chart 2: Bar – Rata-rata Jam Bermain ----
  new Chart(document.getElementById('chartHours'), {
    type: 'bar',
    data: {
      labels: ['< 1 jam', '1–2 jam', '3–5 jam', '5–8 jam', '> 8 jam'],
      datasets: [{
        label: '% Remaja',
        data: [8, 25, 34, 22, 11],
        backgroundColor: blueGrad,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 40,
          ticks: { callback: val => val + '%' },
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => ` ${ctx.parsed.y}% remaja` }
        }
      }
    }
  });

  // ---- Chart 3: Polar Area – Dampak pada Tidur ----
  new Chart(document.getElementById('chartSleep'), {
    type: 'polarArea',
    data: {
      labels: ['Tidur < 6 jam', 'Insomnia ringan', 'Kualitas buruk', 'Sering mengantuk', 'Tidur normal'],
      datasets: [{
        data: [38, 22, 45, 52, 28],
        backgroundColor: [
          'rgba(239,68,68,0.7)',
          'rgba(249,115,22,0.7)',
          'rgba(234,179,8,0.7)',
          'rgba(59,130,246,0.7)',
          'rgba(34,197,94,0.7)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          ticks: { display: false },
          grid: { color: 'rgba(0,0,0,0.07)' }
        }
      },
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } },
        tooltip: {
          callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed.r}% remaja` }
        }
      }
    }
  });

  // ---- Chart 4: Line – Dampak Akademik berdasarkan jam bermain ----
  new Chart(document.getElementById('chartAcademic'), {
    type: 'line',
    data: {
      labels: ['1 jam', '2 jam', '3 jam', '4 jam', '5 jam', '6+ jam'],
      datasets: [
        {
          label: 'Rata-rata Nilai (%)',
          data: [82, 79, 74, 68, 61, 52],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 5
        },
        {
          label: 'Kehadiran Sekolah (%)',
          data: [96, 94, 89, 83, 75, 65],
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124,58,237,0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#7c3aed',
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          min: 40,
          max: 100,
          ticks: { callback: val => val + '%' },
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { padding: 14, font: { size: 12 } } }
      },
      interaction: { mode: 'index', intersect: false }
    }
  });
}

/* ============================================
   15. CSS KEYFRAME: SHAKE CARD
   (ditambahkan via JS agar mudah dipahami)
   ============================================ */
function addGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shakeCard {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-10px); }
      40% { transform: translateX(10px); }
      60% { transform: translateX(-8px); }
      80% { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(style);
}

/* ============================================
   16. INISIALISASI SEMUA SAAT DOM READY
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  addGlobalStyles();   // Tambahkan animasi shake
  initForm();          // Buat form pertanyaan
  updateNavButtons();  // Set tombol navigasi awal
  initCharts();        // Buat semua chart statistik

  // Aktifkan observer untuk animasi kartu
  document.querySelectorAll('.info-card').forEach(card => {
    observerCards.observe(card);
  });

  // Observer untuk chart cards (lazy load ringan)
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.chart-card, .tip-card, .impact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    chartObserver.observe(el);
  });
});
