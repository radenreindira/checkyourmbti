const SUPABASE_URL = window.MBTI_CONFIG?.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = window.MBTI_CONFIG?.SUPABASE_ANON_KEY || "";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const questions = [
  { axis:"EI", side:"E", text:"Saya merasa berenergi setelah bertemu dan berbicara dengan banyak orang." },
  { axis:"EI", side:"I", text:"Saya lebih nyaman mengisi energi dengan waktu sendiri." },
  { axis:"EI", side:"E", text:"Saya mudah memulai percakapan dengan orang baru." },
  { axis:"EI", side:"I", text:"Saya cenderung berpikir dulu sebelum berbicara." },
  { axis:"EI", side:"E", text:"Saya menikmati aktivitas kelompok dan suasana ramai." },
  { axis:"EI", side:"I", text:"Saya lebih suka percakapan mendalam dengan sedikit orang." },
  { axis:"EI", side:"E", text:"Saya sering menyampaikan ide secara spontan." },
  { axis:"EI", side:"I", text:"Saya butuh waktu tenang setelah terlalu banyak interaksi sosial." },
  { axis:"EI", side:"E", text:"Saya suka menjadi bagian aktif dalam diskusi." },
  { axis:"EI", side:"I", text:"Saya lebih nyaman bekerja di lingkungan yang tenang." },
  { axis:"SN", side:"S", text:"Saya lebih percaya pada fakta, data, dan pengalaman nyata." },
  { axis:"SN", side:"N", text:"Saya senang membayangkan kemungkinan dan ide masa depan." },
  { axis:"SN", side:"S", text:"Saya memperhatikan detail kecil dalam pekerjaan." },
  { axis:"SN", side:"N", text:"Saya lebih tertarik pada konsep besar daripada detail teknis." },
  { axis:"SN", side:"S", text:"Saya menyukai instruksi yang jelas dan langkah-langkah konkret." },
  { axis:"SN", side:"N", text:"Saya sering melihat pola atau hubungan di balik suatu kejadian." },
  { axis:"SN", side:"S", text:"Saya lebih suka solusi yang sudah terbukti berhasil." },
  { axis:"SN", side:"N", text:"Saya tertarik mencoba cara baru meskipun belum umum digunakan." },
  { axis:"SN", side:"S", text:"Saya fokus pada apa yang realistis dan bisa dilakukan sekarang." },
  { axis:"SN", side:"N", text:"Saya sering memikirkan makna, simbol, atau kemungkinan tersembunyi." },
  { axis:"TF", side:"T", text:"Saya mengambil keputusan berdasarkan logika dan objektivitas." },
  { axis:"TF", side:"F", text:"Saya mempertimbangkan perasaan orang lain dalam mengambil keputusan." },
  { axis:"TF", side:"T", text:"Saya lebih menghargai kejujuran langsung daripada basa-basi." },
  { axis:"TF", side:"F", text:"Saya berusaha menjaga harmoni dalam hubungan." },
  { axis:"TF", side:"T", text:"Saya nyaman mengevaluasi masalah secara kritis." },
  { axis:"TF", side:"F", text:"Saya mudah memahami suasana hati orang lain." },
  { axis:"TF", side:"T", text:"Saya menilai keputusan dari efektivitas dan hasilnya." },
  { axis:"TF", side:"F", text:"Saya menilai keputusan dari dampaknya terhadap manusia." },
  { axis:"TF", side:"T", text:"Saya tidak keberatan berdebat jika tujuannya menemukan solusi terbaik." },
  { axis:"TF", side:"F", text:"Saya cenderung menghindari konflik yang bisa menyakiti orang lain." },
  { axis:"JP", side:"J", text:"Saya suka membuat rencana dan mengikuti jadwal." },
  { axis:"JP", side:"P", text:"Saya lebih nyaman fleksibel dan menyesuaikan keadaan." },
  { axis:"JP", side:"J", text:"Saya merasa lega jika tugas selesai jauh sebelum deadline." },
  { axis:"JP", side:"P", text:"Saya sering mendapatkan ide bagus saat mendekati deadline." },
  { axis:"JP", side:"J", text:"Saya menyukai keputusan yang jelas dan tidak menggantung." },
  { axis:"JP", side:"P", text:"Saya suka membiarkan pilihan tetap terbuka." },
  { axis:"JP", side:"J", text:"Saya lebih produktif dengan struktur dan prioritas yang rapi." },
  { axis:"JP", side:"P", text:"Saya mudah beradaptasi ketika rencana berubah." },
  { axis:"JP", side:"J", text:"Saya suka mengatur pekerjaan dalam daftar atau sistem." },
  { axis:"JP", side:"P", text:"Saya lebih suka mengikuti alur daripada terlalu banyak aturan." }
];

const typeData = {
  ISTJ:{ name:"The Inspector", desc:"Terstruktur, bertanggung jawab, realistis, dan teliti.", strengths:["Disiplin dan dapat dipercaya","Kuat dalam detail","Stabil menjalankan rencana"], growth:["Lebih terbuka pada perubahan","Melatih fleksibilitas","Mengkomunikasikan perasaan"], career:["Administrasi","Keuangan","Operasional","Quality control"] },
  ISFJ:{ name:"The Protector", desc:"Hangat, teliti, dan peduli.", strengths:["Peduli dan loyal","Teliti membantu","Menciptakan stabilitas"], growth:["Berani menyampaikan kebutuhan","Tidak memendam beban","Menerima perubahan bertahap"], career:["Pendidikan","Layanan pelanggan","Kesehatan","HR support"] },
  INFJ:{ name:"The Advocate", desc:"Visioner, empatik, dan berprinsip.", strengths:["Empati kuat","Berpikir strategis","Konsisten dengan nilai"], growth:["Tidak terlalu perfeksionis","Membagi energi","Berani meminta bantuan"], career:["Konseling","Penulis","Pendidikan","Komunitas"] },
  INTJ:{ name:"The Strategist", desc:"Analitis, mandiri, dan visioner.", strengths:["Strategis","Berorientasi solusi","Kuat dalam sistem"], growth:["Komunikasi emosional","Sabar pada proses tim","Menghargai masukan"], career:["Strategi bisnis","Teknologi","Riset","Manajemen sistem"] },
  ISTP:{ name:"The Craftsman", desc:"Praktis, observatif, dan fleksibel.", strengths:["Tenang dalam masalah teknis","Adaptif","Praktis"], growth:["Konsistensi jangka panjang","Menyampaikan rencana","Tidak menunda komitmen"], career:["Teknik","Produksi","IT support","Lapangan"] },
  ISFP:{ name:"The Artist", desc:"Sensitif, tenang, dan autentik.", strengths:["Kreatif","Peka suasana","Fleksibel"], growth:["Percaya diri berpendapat","Membangun struktur","Menghadapi konflik penting"], career:["Desain","Seni","Hospitality","Konten kreatif"] },
  INFP:{ name:"The Mediator", desc:"Idealistis, reflektif, dan penuh nilai.", strengths:["Imajinatif","Empatik","Humanis"], growth:["Membuat batasan","Menyelesaikan ide","Tidak keras pada diri"], career:["Penulisan","Konseling","Kreatif","NGO"] },
  INTP:{ name:"The Thinker", desc:"Logis, konseptual, dan ingin tahu.", strengths:["Analitis","Objektif","Konseptual"], growth:["Konsisten mengeksekusi","Komunikasi sederhana","Memperhatikan emosi"], career:["Riset","Data","Teknologi","Akademik"] },
  ESTP:{ name:"The Dynamo", desc:"Energik, berani, dan responsif.", strengths:["Cepat bertindak","Percaya diri","Adaptif"], growth:["Rencana jangka panjang","Tidak impulsif","Mendengar dampak emosional"], career:["Sales","Event lapangan","Entrepreneur","Emergency response"] },
  ESFP:{ name:"The Entertainer", desc:"Ramah, ekspresif, dan spontan.", strengths:["Membangun relasi","Optimis","Peka pengalaman nyata"], growth:["Fokus jangka panjang","Mengelola prioritas","Memperhatikan detail"], career:["Public relations","Event","Hospitality","Entertainment"] },
  ENFP:{ name:"The Campaigner", desc:"Antusias, kreatif, dan penuh kemungkinan.", strengths:["Kreatif","Inspiratif","Komunikatif"], growth:["Konsistensi","Menyelesaikan prioritas","Membatasi distraksi"], career:["Marketing","Kreatif","Komunikasi","Bisnis"] },
  ENTP:{ name:"The Debater", desc:"Inovatif, kritis, dan cepat berpikir.", strengths:["Inovatif","Melihat peluang","Berani mencoba"], growth:["Konsisten eksekusi","Menghargai detail","Tidak berdebat untuk menang"], career:["Startup","Strategi","Konsultan","Produk"] },
  ESTJ:{ name:"The Executive", desc:"Tegas, terorganisir, dan berorientasi hasil.", strengths:["Leadership jelas","Efisien","Berani mengambil keputusan"], growth:["Fleksibel","Mendengar sisi emosional","Tidak terlalu kaku"], career:["Manajemen","Operasional","Administrasi","Project lead"] },
  ESFJ:{ name:"The Caregiver", desc:"Sosial, suportif, dan bertanggung jawab.", strengths:["Hangat","Kooperatif","Menjaga relasi"], growth:["Tidak bergantung validasi","Berani berkata tidak","Menerima kritik"], career:["HR","Customer service","Pendidikan","Event hospitality"] },
  ENFJ:{ name:"The Protagonist", desc:"Karismatik, empatik, dan visioner.", strengths:["Memotivasi","Empati","Kolaboratif"], growth:["Tidak memikul semua beban","Membuat batasan","Objektif dalam konflik"], career:["Leadership","Pelatihan","Komunikasi","Community development"] },
  ENTJ:{ name:"The Commander", desc:"Ambisius, strategis, dan tegas.", strengths:["Visioner","Tegas","Terorganisir"], growth:["Lebih empatik","Tidak dominan","Memberi ruang proses"], career:["Eksekutif","Entrepreneur","Strategi bisnis","Project director"] }
};

const scaleLabels = [
  {value:1,label:"Sangat Tidak Setuju"},{value:2,label:"Tidak Setuju"},{value:3,label:"Netral"},{value:4,label:"Setuju"},{value:5,label:"Sangat Setuju"}
];

let currentSession = null;
let answers = {};

const $ = (id) => document.getElementById(id);

function showMessage(id, text, ok=false){
  const el = $(id);
  if(!el) return;
  el.textContent = text || "";
  el.classList.toggle("ok", ok);
}
function showView(view){
  ["loginView","adminView","participantView"].forEach(id => $(id).classList.add("hidden"));
  $(view).classList.remove("hidden");
}
function saveSession(session){
  currentSession = session;
  sessionStorage.setItem("mbti_online_session", JSON.stringify(session));
}
function loadSession(){
  try { return JSON.parse(sessionStorage.getItem("mbti_online_session") || "null"); }
  catch { return null; }
}
async function clearSession(){
  if(currentSession?.token){ await db.rpc("mbti_logout", { p_token: currentSession.token }); }
  currentSession = null;
  sessionStorage.removeItem("mbti_online_session");
  answers = {};
  showView("loginView");
}
function randomSalt(){
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr));
}
async function hashPassword(password, salt){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name:"PBKDF2", salt:enc.encode(salt), iterations:120000, hash:"SHA-256" }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

async function login(username, password){
  try{
    const cleanUsername = username.trim().toLowerCase();
    if(!cleanUsername || !password){
      showMessage("loginMessage", "Username dan password wajib diisi.");
      return;
    }

    showMessage("loginMessage", "Memeriksa akun...");

    const saltResult = await db.rpc("mbti_get_salt", { p_username: cleanUsername });
    if(saltResult.error){
      showMessage("loginMessage", "Koneksi Supabase berhasil, tetapi fungsi database belum siap. Jalankan ulang supabase-schema.sql di SQL Editor.");
      console.error(saltResult.error);
      return;
    }
    if(!saltResult.data){
      showMessage("loginMessage", "Username tidak ditemukan. Jika admin gagal login, jalankan admin-fix.sql di Supabase SQL Editor.");
      return;
    }

    const hash = await hashPassword(password, saltResult.data);
    const result = await db.rpc("mbti_login", { p_username: cleanUsername, p_password_hash: hash });
    if(result.error){
      showMessage("loginMessage", "Login gagal. Jalankan admin-fix.sql atau ulangi supabase-schema.sql di Supabase SQL Editor.");
      console.error(result.error);
      return;
    }

    const row = Array.isArray(result.data) ? result.data[0] : null;
    if(!row){
      showMessage("loginMessage", "Password salah. Untuk admin, jalankan admin-fix.sql lalu gunakan password Admin123.");
      return;
    }

    saveSession(row);
    showMessage("loginMessage", "Login berhasil.", true);
    if(row.role === "admin"){
      await openAdmin();
    } else {
      openParticipant();
    }
  }catch(err){
    console.error(err);
    showMessage("loginMessage", "Login gagal karena koneksi/konfigurasi bermasalah. Pastikan config.js sudah diisi SUPABASE_URL dan SUPABASE_ANON_KEY yang benar.");
  }
}

async function openAdmin(){
  showView("adminView");
  await loadParticipants();
}
function openParticipant(){
  showView("participantView");
  $("participantNameText").textContent = `Peserta: ${currentSession.full_name || currentSession.username}`;
  answers = {};
  renderQuestions();
}

async function loadParticipants(){
  const tbody = $("participantsBody");
  tbody.innerHTML = `<tr><td colspan="5">Memuat data...</td></tr>`;
  const result = await db.rpc("mbti_list_participants", { p_admin_token: currentSession.token });
  if(result.error){ tbody.innerHTML = `<tr><td colspan="5">Gagal memuat data: ${result.error.message}</td></tr>`; return; }
  if(!result.data?.length){ tbody.innerHTML = `<tr><td colspan="5">Belum ada akun peserta.</td></tr>`; return; }
  tbody.innerHTML = result.data.map(row => `
    <tr>
      <td><b>${escapeHtml(row.full_name || "-")}</b></td>
      <td>${escapeHtml(row.username)}</td>
      <td>${row.latest_type ? `<b>${escapeHtml(row.latest_type)}</b>` : "Belum tes"}</td>
      <td>${row.latest_result_at ? new Date(row.latest_result_at).toLocaleString("id-ID") : "-"}</td>
      <td>
        <div class="row-actions">
          <button class="btn btn-light2" onclick="resetParticipantPassword('${row.account_id}', '${escapeAttr(row.username)}')">Reset Password</button>
          <button class="btn btn-danger" onclick="deleteParticipant('${row.account_id}', '${escapeAttr(row.username)}')">Hapus</button>
        </div>
      </td>
    </tr>`).join("");
}

async function createParticipant(e){
  e.preventDefault();
  const fullName = $("newFullName").value.trim();
  const username = $("newUsername").value.trim().toLowerCase();
  const password = $("newPassword").value;
  if(password.length < 6){ showMessage("adminMessage", "Password minimal 6 karakter."); return; }
  const salt = randomSalt();
  const hash = await hashPassword(password, salt);
  showMessage("adminMessage", "Membuat akun...");
  const result = await db.rpc("mbti_create_participant", {
    p_admin_token: currentSession.token,
    p_username: username,
    p_full_name: fullName,
    p_password_salt: salt,
    p_password_hash: hash
  });
  if(result.error){ showMessage("adminMessage", result.error.message || "Gagal membuat akun."); return; }
  e.target.reset();
  showMessage("adminMessage", "Akun peserta berhasil dibuat.", true);
  await loadParticipants();
}

async function resetParticipantPassword(accountId, username){
  const pass = prompt(`Masukkan password baru untuk ${username}:`);
  if(!pass) return;
  if(pass.length < 6){ alert("Password minimal 6 karakter."); return; }
  const salt = randomSalt();
  const hash = await hashPassword(pass, salt);
  const result = await db.rpc("mbti_reset_participant_password", {
    p_admin_token: currentSession.token,
    p_account_id: accountId,
    p_password_salt: salt,
    p_password_hash: hash
  });
  if(result.error){ alert(result.error.message || "Gagal reset password."); return; }
  alert("Password berhasil direset.");
}

async function deleteParticipant(accountId, username){
  if(!confirm(`Hapus akun peserta ${username}? Data hasil tes peserta ini juga akan terhapus.`)) return;
  const result = await db.rpc("mbti_delete_participant", { p_admin_token: currentSession.token, p_account_id: accountId });
  if(result.error){ alert(result.error.message || "Gagal hapus akun."); return; }
  await loadParticipants();
}

function renderQuestions(){
  const wrap = $("questions");
  wrap.innerHTML = questions.map((q, idx) => `
    <div class="question ${answers[idx] ? "answered" : ""}" id="qcard-${idx}">
      <div class="q-top">
        <div class="q-num">${idx+1}</div>
        <div><div class="q-text">${q.text}</div><div class="q-axis">Dimensi: ${axisName(q.axis)}</div></div>
      </div>
      <div class="scale">
        ${scaleLabels.map(opt => `
          <div class="choice">
            <input type="radio" id="q${idx}-${opt.value}" name="q${idx}" value="${opt.value}" ${Number(answers[idx])===opt.value ? "checked" : ""} onchange="setAnswer(${idx}, ${opt.value})">
            <label for="q${idx}-${opt.value}">${opt.label}</label>
          </div>`).join("")}
      </div>
    </div>`).join("");
  updateProgress();
  $("questionSection").classList.remove("hidden");
  $("resultSection").classList.add("hidden");
}
function axisName(axis){ return {EI:"Extraversion / Introversion",SN:"Sensing / Intuition",TF:"Thinking / Feeling",JP:"Judging / Perceiving"}[axis]; }
function setAnswer(index, value){ answers[index] = value; $("qcard-"+index).classList.add("answered"); updateProgress(); }
function updateProgress(){ const count = Object.keys(answers).length; $("answeredCount").textContent = `${count}/${questions.length}`; $("progressFill").style.width = `${(count/questions.length)*100}%`; }

async function calculateResult(){
  if(Object.keys(answers).length < questions.length){ alert(`Masih ada ${questions.length - Object.keys(answers).length} pertanyaan yang belum dijawab.`); return; }
  const scores = { E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0 };
  questions.forEach((q, idx) => { scores[q.side] += Number(answers[idx]); });
  const type = (scores.E >= scores.I ? "E" : "I") + (scores.S >= scores.N ? "S" : "N") + (scores.T >= scores.F ? "T" : "F") + (scores.J >= scores.P ? "J" : "P");
  const result = await db.rpc("mbti_save_result", { p_token: currentSession.token, p_mbti_type: type, p_scores: scores, p_answers: answers });
  if(result.error){ alert(result.error.message || "Gagal menyimpan hasil ke database online."); return; }
  renderResult(type, scores);
  $("questionSection").classList.add("hidden");
  $("resultSection").classList.remove("hidden");
  $("resultSection").scrollIntoView();
}
function percent(a,b){ const total = a+b; return total ? Math.round((a/total)*100) : 50; }
function axisBar(labelA, labelB, a, b){
  const pa = percent(a,b); const dominant = a >= b ? labelA : labelB;
  return `<div class="bar-row"><div class="bar-top"><span>${labelA}: ${pa}%</span><span>${labelB}: ${100-pa}%</span></div><div class="dual"><i style="width:${pa}%"></i></div><div class="muted" style="margin-top:7px">Dominan: <b>${dominant}</b></div></div>`;
}
function renderResult(type, scores){
  const d = typeData[type];
  $("resultContent").innerHTML = `
    <div class="result-hero">
      <div class="type-card"><span class="badge">Hasil Anda</span><div class="type-code">${type}</div><div class="type-title">${d.name}</div><div class="type-desc">${d.desc}</div></div>
      <div class="score-card"><h3>Komposisi Skor</h3>${axisBar("E","I",scores.E,scores.I)}${axisBar("S","N",scores.S,scores.N)}${axisBar("T","F",scores.T,scores.F)}${axisBar("J","P",scores.J,scores.P)}</div>
    </div>
    <div class="detail-grid">
      <div class="info-card"><h3>Kekuatan Utama</h3><ul>${d.strengths.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      <div class="info-card"><h3>Area Pengembangan</h3><ul>${d.growth.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      <div class="info-card"><h3>Potensi Karier</h3><ul>${d.career.map(x=>`<li>${x}</li>`).join("")}</ul></div>
    </div>`;
}
function resetTest(){ if(confirm("Reset semua jawaban dan mulai ulang?")){ answers = {}; renderQuestions(); $("participantView").scrollIntoView(); } }
function editAnswers(){ $("resultSection").classList.add("hidden"); $("questionSection").classList.remove("hidden"); }
function escapeHtml(str){ return String(str ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[c])); }
function escapeAttr(str){ return escapeHtml(str).replace(/`/g, "&#096;"); }

function validateConfig(){
  if(!SUPABASE_URL.includes("supabase.co") || SUPABASE_ANON_KEY.startsWith("GANTI_")){
    showMessage("loginMessage", "Konfigurasi Supabase belum diisi. Buka file config.js lalu masukkan SUPABASE_URL dan SUPABASE_ANON_KEY.");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  $("loginForm").addEventListener("submit", async (e) => { e.preventDefault(); if(!validateConfig()) return; await login($("loginUsername").value, $("loginPassword").value); });
  $("createUserForm").addEventListener("submit", createParticipant);
  $("refreshUsersBtn").addEventListener("click", loadParticipants);
  $("adminLogoutBtn").addEventListener("click", clearSession);
  $("participantLogoutBtn").addEventListener("click", clearSession);
  $("calculateBtn").addEventListener("click", calculateResult);
  $("calculateBottomBtn").addEventListener("click", calculateResult);
  $("resetBtn").addEventListener("click", resetTest);
  $("retakeBtn").addEventListener("click", resetTest);
  $("editAnswerBtn").addEventListener("click", editAnswers);

  const session = loadSession();
  if(session?.token){
    currentSession = session;
    if(session.role === "admin") openAdmin(); else openParticipant();
  } else {
    showView("loginView");
  }
});
