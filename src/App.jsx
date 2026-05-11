import { useState, useEffect } from "react";

const SUPABASE_URL = "https://lysqfkxxegzfjnljhszy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5c3Fma3h4ZWd6ZmpubGpoc3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTYxMTIsImV4cCI6MjA5Mzk5MjExMn0.KSpnz_DD_kVB5W9OCDQvJ3RoskMEIEJxXdDXX0ZPJNE";
const ADMIN_PASSWORD = "Bossboss123";

const EMAILJS_SERVICE_ID = "concept4lashes";
const EMAILJS_PUBLIC_KEY = "eMaOTwoGjGcKN6krF";
const EMAILJS_TEMPLATE_CLIENTE = "template_w1ly2z5";
const EMAILJS_TEMPLATE_ADMIN = "template_hgvofmq";

async function getReservations(date) {
  const res = await fetch(
    SUPABASE_URL + "/rest/v1/Reservation?date=eq." + date + "&select=id,heure,duree",
    { headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY } }
  );
  return await res.json();
}

async function getAllReservations() {
  const res = await fetch(
    SUPABASE_URL + "/rest/v1/Reservation?select=id,date,heure,duree&order=date.asc,heure.asc",
    { headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY } }
  );
  return await res.json();
}

async function deleteReservation(id) {
  await fetch(SUPABASE_URL + "/rest/v1/Reservation?id=eq." + id, {
    method: "DELETE",
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
  });
}

async function addReservation(date, heure, duree) {
  await fetch(SUPABASE_URL + "/rest/v1/Reservation", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ date, heure, duree })
  });
}

async function blockDay(date) {
  await fetch(SUPABASE_URL + "/rest/v1/Reservation", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ date, heure: "09:00", duree: 705 })
  });
}

const DUREE_BLOCAGE = {
  "c1": 120, "c2": 90, "c3": 120, "c4": 90, "c5": 120,
  "c6": 90, "c7": 120, "c8": 90, "c9": 120, "c10": 90,
  "c11": 120, "c12": 90, "c13": 120, "c14": 90, "c15": 50,
  "s1": 50, "s2": 70, "s3": 80, "s4": 40, "s5": 40,
  "r1": 60, "r2": 85, "r3": 40,
};

const INFO_POSE = "Durée : 1h20 à 1h50. Venez démaquillée, sans mascara ni huile sur les cils.";
const INFO_REMPL = "Durée : 1h15 à 1h20 selon le remplissage. Venez démaquillée, sans mascara ni huile sur les cils.";
const INFO_DEPOSE = "Durée : 40 min. Dépose douce des extensions posées en institut extérieur.";
const INFO_BROWLIFT = "Durée : 40 min. Venez sans maquillage sur les sourcils.";
const INFO_BROWLIFT2 = "Durée : 1h. Venez sans maquillage sur les sourcils.";
const INFO_BROWLIFT3 = "Durée : 1h10. Venez sans maquillage sur les sourcils.";
const INFO_TEINTURE = "Durée : 30 min. Venez sans maquillage sur la zone.";
const INFO_EPIL = "Durée : 30 min. Venez sans maquillage sur les sourcils.";
const INFO_REHAUSSE = "Durée : 50 min. Venez sans mascara ni produit sur les cils.";
const INFO_REHAUSSE2 = "Durée : 1h15. Venez sans mascara ni produit sur les cils.";

const services = [
  {
    category: "Cils", emoji: "🪄",
    items: [
      { id: "c1", name: "Pose cil à cil", price: "70€", info: INFO_POSE },
      { id: "c2", name: "Remplissage cil à cil", price: "55€", info: INFO_REMPL },
      { id: "c3", name: "Pose mixte 3D/4D/5D", price: "80€", info: INFO_POSE },
      { id: "c4", name: "Remplissage mixte", price: "65€", info: INFO_REMPL },
      { id: "c5", name: "Pose méga cil à cil", price: "80€", info: INFO_POSE },
      { id: "c6", name: "Remplissage méga", price: "65€", info: INFO_REMPL },
      { id: "c7", name: "Volume Russe (8D et +)", price: "90€", info: INFO_POSE },
      { id: "c8", name: "Remplissage Volume Russe", price: "75€", info: INFO_REMPL },
      { id: "c9", name: "Méga Volume Russe", price: "100€", info: INFO_POSE },
      { id: "c10", name: "Remplissage Méga Volume", price: "85€", info: INFO_REMPL },
      { id: "c11", name: "Anime Lashes Classic", price: "80€", info: INFO_POSE },
      { id: "c12", name: "Remplissage Anime Classic", price: "70€", info: INFO_REMPL },
      { id: "c13", name: "Méga Anime Lashes", price: "100€", info: INFO_POSE },
      { id: "c14", name: "Remplissage Méga Anime", price: "80€", info: INFO_REMPL },
      { id: "c15", name: "Dépose cils pose extérieur", price: "20€", info: INFO_DEPOSE },
    ],
  },
  {
    category: "Sourcils", emoji: "✨",
    items: [
      { id: "s1", name: "Browlift", price: "50€", info: INFO_BROWLIFT },
      { id: "s2", name: "Browlift + Épilation", price: "65€", info: INFO_BROWLIFT2 },
      { id: "s3", name: "Browlift + Teinture", price: "70€", info: INFO_BROWLIFT3 },
      { id: "s4", name: "Teinture sourcils", price: "25€", info: INFO_TEINTURE },
      { id: "s5", name: "Épilation au fil sourcils", price: "20€", info: INFO_EPIL },
    ],
  },
  {
    category: "Rehaussement de cils", emoji: "🌸",
    items: [
      { id: "r1", name: "Rehaussement", price: "50€", info: INFO_REHAUSSE },
      { id: "r2", name: "Rehaussement + Teinture", price: "65€", info: INFO_REHAUSSE2 },
      { id: "r3", name: "Teinture cils", price: "20€", info: INFO_TEINTURE },
    ],
  },
];

function genererCreneaux() {
  const creneaux = [];
  for (let h = 9; h <= 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 20 && m > 30) break;
      creneaux.push(String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0"));
    }
  }
  return creneaux;
}

const TOUS_CRENEAUX = genererCreneaux();

function enMinutes(heure) {
  const [h, m] = heure.split(":").map(Number);
  return h * 60 + m;
}

function calculerBloques(rdvs, dureeService) {
  const bloques = new Set();
  rdvs.forEach(rdv => {
    const debut = enMinutes(rdv.heure);
    const fin = debut + rdv.duree;
    TOUS_CRENEAUX.forEach(c => {
      const cMin = enMinutes(c);
      const cFin = cMin + dureeService;
      if (cMin < fin && cFin > debut) bloques.add(c);
    });
  });
  return bloques;
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { let d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; }

const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const dayNames = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Nunito:wght@900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:linear-gradient(145deg,#fff5f7 0%,#fce8ef 40%,#f9d6e4 100%);min-height:100vh}
  .sans{font-family:'Jost',sans-serif}
  .btn-rose{background:linear-gradient(135deg,#d4688a,#c0506e);color:white;border:none;border-radius:50px;padding:14px 36px;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all 0.25s;box-shadow:0 4px 20px rgba(192,80,110,0.3)}
  .btn-rose:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(192,80,110,0.4)}
  .btn-rose:disabled{opacity:0.4;cursor:not-allowed;transform:none}
  .btn-ghost{background:transparent;border:1.5px solid rgba(192,80,110,0.35);color:#c0506e;border-radius:50px;padding:10px 24px;font-family:'Jost',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
  .btn-ghost:hover{background:rgba(192,80,110,0.07)}
  .btn-red{background:linear-gradient(135deg,#e05555,#c03030);color:white;border:none;border-radius:50px;padding:8px 18px;font-family:'Jost',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s}
  .btn-red:hover{opacity:0.85}
  .card{background:rgba(255,255,255,0.75);backdrop-filter:blur(12px);border:1px solid rgba(219,112,147,0.15);border-radius:20px;transition:all 0.2s;cursor:pointer}
  .card:hover{border-color:rgba(219,112,147,0.4);box-shadow:0 8px 32px rgba(192,80,110,0.1)}
  .card.selected{border-color:#d4688a!important;background:rgba(255,235,242,0.85)!important;box-shadow:0 6px 24px rgba(192,80,110,0.18)!important}
  .input-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.8);border:1.5px solid rgba(219,112,147,0.2);border-radius:12px;font-family:'Jost',sans-serif;font-size:14px;color:#2a1520;outline:none;transition:border-color 0.2s}
  .input-field:focus{border-color:#d4688a}
  .step-dot{width:8px;height:8px;border-radius:50%;background:rgba(192,80,110,0.2);transition:all 0.3s;display:inline-block}
  .step-dot.active{background:#d4688a;width:24px;border-radius:4px}
  .step-dot.done{background:rgba(192,80,110,0.5)}
  .time-chip{padding:9px 16px;border-radius:50px;border:1.5px solid rgba(219,112,147,0.25);background:rgba(255,255,255,0.7);font-family:'Jost',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s;color:#2a1520}
  .time-chip:hover{border-color:#d4688a;background:rgba(255,235,242,0.8)}
  .time-chip.sel{background:linear-gradient(135deg,#d4688a,#c0506e);color:white;border-color:transparent}
  .time-chip.blocked{opacity:0.25;cursor:not-allowed;background:rgba(0,0,0,0.05);border-color:transparent;color:#999;text-decoration:line-through}
  .cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:50%;font-family:'Jost',sans-serif;font-size:13px;cursor:pointer;transition:all 0.18s;border:1.5px solid transparent}
  .cal-day:hover{background:rgba(212,104,138,0.12);border-color:rgba(212,104,138,0.3)}
  .cal-day.dis{opacity:0.25;cursor:not-allowed;pointer-events:none}
  .cal-day.sel{background:linear-gradient(135deg,#d4688a,#c0506e);color:white}
  .cal-day.tod{border-color:#d4688a;color:#d4688a;font-weight:600}
  textarea.input-field{resize:vertical;min-height:80px}
  .info-box{background:rgba(212,104,138,0.08);border:1px solid rgba(212,104,138,0.25);border-radius:12px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:12px;color:#a06070;line-height:1.6;margin-top:8px;animation:fadeIn 0.2s ease}
  .notice{background:rgba(212,104,138,0.08);border:1px solid rgba(212,104,138,0.2);border-radius:12px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:12px;color:#a06070;text-align:center;line-height:1.6;margin-top:16px}
  .rdv-card{background:white;border-radius:16px;padding:16px;margin-bottom:12px;border-left:4px solid #d4688a;box-shadow:0 2px 12px rgba(192,80,110,0.08);display:flex;justify-content:space-between;align-items:center}
  .admin-input{width:100%;padding:14px 18px;background:rgba(255,255,255,0.9);border:2px solid rgba(219,112,147,0.3);border-radius:14px;font-family:'Jost',sans-serif;font-size:16px;color:#2a1520;outline:none;transition:border-color 0.2s;margin-bottom:16px}
  .admin-input:focus{border-color:#d4688a}
  @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
`;

function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError(false);
      loadRdvs();
    } else {
      setError(true);
    }
  };

  const loadRdvs = async () => {
    setLoading(true);
    const data = await getAllReservations();
    setRdvs(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteReservation(id);
    setSuccessMsg("Créneau rouvert !");
    setTimeout(() => setSuccessMsg(""), 2000);
    loadRdvs();
  };

  const handleBlockDay = async () => {
    if (!blockDate) return;
    await blockDay(blockDate);
    setSuccessMsg("Journée bloquée !");
    setTimeout(() => setSuccessMsg(""), 2000);
    setBlockDate("");
    loadRdvs();
  };

  const today = new Date().toISOString().split("T")[0];
  const rdvsFuturs = rdvs.filter(r => r.date >= today);

  if (!loggedIn) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Jost',sans-serif", padding:"24px" }}>
        <div style={{ background:"white", borderRadius:"24px", padding:"40px", maxWidth:"360px", width:"100%", boxShadow:"0 8px 40px rgba(192,80,110,0.15)", textAlign:"center" }}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:"900", fontSize:"32px", color:"#c9788e", marginBottom:"4px" }}>concept.</div>
          <div style={{ fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", color:"#d4a0b0", marginBottom:"32px" }}>espace admin</div>
          <input
            className="admin-input"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          {error && <p style={{ color:"#e05555", fontSize:"13px", marginBottom:"12px" }}>Mot de passe incorrect</p>}
          <button className="btn-rose" style={{ width:"100%" }} onClick={login}>Connexion</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Jost',sans-serif", color:"#2a1520", padding:"24px 16px 40px", maxWidth:"600px", margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:"28px" }}>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:"900", fontSize:"32px", color:"#c9788e" }}>concept.</div>
        <div style={{ fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", color:"#d4a0b0" }}>espace admin</div>
      </div>

      {successMsg && (
        <div style={{ background:"#e8f5e9", border:"1px solid #a5d6a7", borderRadius:"12px", padding:"12px 16px", textAlign:"center", color:"#2e7d32", fontSize:"14px", marginBottom:"20px" }}>
          ✅ {successMsg}
        </div>
      )}

      <div style={{ background:"white", borderRadius:"20px", padding:"20px", marginBottom:"24px", boxShadow:"0 2px 16px rgba(192,80,110,0.08)" }}>
        <h2 style={{ fontSize:"16px", fontWeight:"600", marginBottom:"16px", color:"#2a1520" }}>🚫 Bloquer une journée</h2>
        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          <input
            type="date"
            className="admin-input"
            style={{ marginBottom:"0", flex:1 }}
            value={blockDate}
            min={today}
            onChange={e => setBlockDate(e.target.value)}
          />
          <button className="btn-rose" style={{ padding:"14px 20px", whiteSpace:"nowrap" }} onClick={handleBlockDay}>
            Bloquer
          </button>
        </div>
        <p style={{ fontSize:"11px", color:"#a06070", marginTop:"8px" }}>Bloque toute la journée — congé, vacances, formation...</p>
      </div>

      <div style={{ background:"white", borderRadius:"20px", padding:"20px", boxShadow:"0 2px 16px rgba(192,80,110,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
          <h2 style={{ fontSize:"16px", fontWeight:"600", color:"#2a1520" }}>📋 Réservations à venir</h2>
          <button className="btn-ghost" style={{ padding:"8px 16px", fontSize:"12px" }} onClick={loadRdvs}>↻ Actualiser</button>
        </div>
        {loading ? (
          <p style={{ textAlign:"center", color:"#a06070", padding:"20px" }}>Chargement...</p>
        ) : rdvsFuturs.length === 0 ? (
          <p style={{ textAlign:"center", color:"#a06070", padding:"20px" }}>Aucune réservation à venir</p>
        ) : (
          rdvsFuturs.map(rdv => (
            <div key={rdv.id} className="rdv-card">
              <div>
                <div style={{ fontWeight:"600", fontSize:"14px", marginBottom:"4px" }}>
                  📅 {rdv.date} à {rdv.heure}
                </div>
                <div style={{ fontSize:"12px", color:"#a06070" }}>
                  Durée bloquée : {rdv.duree} min
                </div>
              </div>
              <button className="btn-red" onClick={() => handleDelete(rdv.id)}>
                Annuler
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign:"center", marginTop:"24px" }}>
        <button className="btn-ghost" onClick={() => window.location.href = "/"}>← Retour à l'app</button>
      </div>
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname === "/admin";
  if (isAdmin) return <AdminPage />;

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [rdvsDuJour, setRdvsDuJour] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const dateKey = selectedDate
    ? selectedDate.getFullYear() + "-" + String(selectedDate.getMonth()+1).padStart(2,"0") + "-" + String(selectedDate.getDate()).padStart(2,"0")
    : null;

  useEffect(() => {
    if (dateKey && step === 3) {
      setLoading(true);
      getReservations(dateKey).then(data => {
        setRdvsDuJour(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    }
  }, [dateKey, step]);

  const dureeService = selectedService ? DUREE_BLOCAGE[selectedService.id] : 60;
  const bloques = calculerBloques(rdvsDuJour, dureeService);

  const estDisponible = (creneau) => {
    if (bloques.has(creneau)) return false;
    const fin = enMinutes(creneau) + dureeService;
    if (fin > enMinutes("20:30") + 30) return false;
    return true;
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  const isDisabled = (d) => {
    if (!d) return true;
    const date = new Date(calYear, calMonth, d);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const handleConfirm = async () => {
    if (!form.name || !form.phone || !form.email) return;
    if (dateKey && selectedTime) {
      await addReservation(dateKey, selectedTime, dureeService);
    }
    const dateFormatee = selectedDate
      ? selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
      : "";
    const serviceFormate = selectedService
      ? selectedService.name + " — " + selectedService.price
      : "";
    try {
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_CLIENTE,
        {
          client_name: form.name,
          client_email: form.email,
          appointment_date: dateFormatee,
          appointment_time: selectedTime || "",
          service: serviceFormate,
        },
        EMAILJS_PUBLIC_KEY
      );
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ADMIN,
        {
          client_name: form.name,
          client_phone: form.phone,
          client_email: form.email,
          appointment_date: dateFormatee,
          appointment_time: selectedTime || "",
          service: serviceFormate,
          note: form.note || "—",
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch(e) {
      console.error("EmailJS error:", e);
    }
    setStep(5);
  };

  const reset = () => {
    setStep(1); setSelectedService(null); setSelectedDate(null);
    setSelectedTime(null); setForm({ name:"", phone:"", email:"", note:"" });
    setRdvsDuJour([]);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", fontFamily:"'Cormorant Garamond', Georgia, serif", color:"#2a1520" }}>
        <div style={{ maxWidth:"480px", margin:"0 auto", padding:"24px 16px 40px" }}>

          <div style={{ textAlign:"center", marginBottom:"32px", paddingTop:"12px" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:"900", fontSize:"clamp(36px,10vw,52px)", color:"#c9788e", letterSpacing:"-1px" }}>
              concept<span>.</span>
            </div>
            <div className="sans" style={{ fontWeight:"300", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", color:"#d4a0b0", marginTop:"2px" }}>
              for iconic lashes
            </div>
            <div style={{ width:"40px", height:"1px", background:"linear-gradient(90deg,transparent,#d4688a,transparent)", margin:"14px auto 0" }} />
          </div>

          {step < 5 && (
            <div style={{ display:"flex", gap:"6px", justifyContent:"center", marginBottom:"28px" }}>
              {[1,2,3,4].map(s => (
                <div key={s} className={"step-dot" + (step===s?" active":step>s?" done":"")} />
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="sans" style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#a06070", marginBottom:"20px", textAlign:"center" }}>
                Choisir une prestation
              </p>
              {services.map(cat => (
                <div key={cat.category} style={{ marginBottom:"20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                    <span style={{ fontSize:"18px" }}>{cat.emoji}</span>
                    <h2 style={{ fontSize:"20px", fontWeight:"400" }}>{cat.category}</h2>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {cat.items.map(item => (
                      <div key={item.id}>
                        <div
                          className={"card" + (selectedService && selectedService.id===item.id?" selected":"")}
                          onClick={() => setSelectedService(selectedService && selectedService.id===item.id ? null : item)}
                          style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                        >
                          <div className="sans" style={{ fontSize:"14px" }}>{item.name}</div>
                          <div style={{ fontSize:"16px", fontWeight:"500", color:"#d4688a" }}>{item.price}</div>
                        </div>
                        {selectedService && selectedService.id===item.id && (
                          <div className="info-box">ℹ️ {item.info}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="notice">
                Prestations nocturnes disponibles sur demande après 20h : supplément de 15€.<br/>
                Les remplissages sont acceptés à partir de 2 semaines et demi.
              </div>
              <div style={{ textAlign:"center", marginTop:"24px" }}>
                <button className="btn-rose" disabled={!selectedService} onClick={() => setStep(2)}>Continuer</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="sans" style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#a06070", marginBottom:"20px", textAlign:"center" }}>
                Choisir une date
              </p>
              <div className="card" style={{ padding:"20px", cursor:"default" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                  <button className="btn-ghost" style={{ padding:"6px 14px", fontSize:"18px" }}
                    onClick={() => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}>‹</button>
                  <span style={{ fontSize:"20px", fontWeight:"400" }}>{monthNames[calMonth]} {calYear}</span>
                  <button className="btn-ghost" style={{ padding:"6px 14px", fontSize:"18px" }}
                    onClick={() => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}>›</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px", marginBottom:"8px" }}>
                  {dayNames.map(d => (
                    <div key={d} className="sans" style={{ textAlign:"center", fontSize:"11px", color:"#a06070", padding:"4px 0" }}>{d}</div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" }}>
                  {calDays.map((d, i) => {
                    if (!d) return <div key={"e"+i} />;
                    const disabled = isDisabled(d);
                    const date = new Date(calYear, calMonth, d);
                    const isSel = selectedDate && selectedDate.getDate()===d && selectedDate.getMonth()===calMonth && selectedDate.getFullYear()===calYear;
                    const isTod = d===today.getDate() && calMonth===today.getMonth() && calYear===today.getFullYear();
                    return (
                      <div key={d}
                        className={"cal-day"+(disabled?" dis":"")+(isSel?" sel":"")+((!isSel&&isTod)?" tod":"")}
                        onClick={() => { if(!disabled){ setSelectedDate(date); setSelectedTime(null); } }}>
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"24px" }}>
                <button className="btn-ghost" onClick={() => setStep(1)}>Retour</button>
                <button className="btn-rose" disabled={!selectedDate} onClick={() => setStep(3)}>Continuer</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="sans" style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#a06070", marginBottom:"8px", textAlign:"center" }}>
                Choisir un horaire
              </p>
              {selectedDate && (
                <p style={{ textAlign:"center", fontSize:"16px", fontWeight:"300", marginBottom:"20px", color:"#5a3040" }}>
                  {selectedDate.toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
                </p>
              )}
              {loading ? (
                <p className="sans" style={{ textAlign:"center", color:"#a06070", fontSize:"14px" }}>Chargement des disponibilités...</p>
              ) : (
                <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center" }}>
                  {TOUS_CRENEAUX.map(t => {
                    const dispo = estDisponible(t);
                    return (
                      <div key={t}
                        className={"time-chip"+(selectedTime===t?" sel":"")+((!dispo)?" blocked":"")}
                        onClick={() => { if(dispo) setSelectedTime(t); }}>
                        {t}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"28px" }}>
                <button className="btn-ghost" onClick={() => setStep(2)}>Retour</button>
                <button className="btn-rose" disabled={!selectedTime} onClick={() => setStep(4)}>Continuer</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="sans" style={{ fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#a06070", marginBottom:"20px", textAlign:"center" }}>
                Vos informations
              </p>
              <div className="card" style={{ padding:"16px 20px", marginBottom:"20px", borderLeft:"3px solid #d4688a", cursor:"default" }}>
                <div className="sans" style={{ fontSize:"13px", color:"#5a3040", lineHeight:"1.8" }}>
                  <div>🪄 {selectedService && selectedService.name} — {selectedService && selectedService.price}</div>
                  <div>📅 {selectedDate && selectedDate.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} à {selectedTime}</div>
                </div>
                {selectedService && (
                  <div style={{ marginTop:"10px", fontSize:"12px", fontFamily:"'Jost',sans-serif", color:"#a06070", lineHeight:"1.5" }}>
                    ℹ️ {selectedService.info}
                  </div>
                )}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                <div>
                  <label className="sans" style={{ fontSize:"12px", color:"#a06070", display:"block", marginBottom:"6px" }}>Prénom et Nom *</label>
                  <input className="input-field" placeholder="Sarah Dupont" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                </div>
                <div>
                  <label className="sans" style={{ fontSize:"12px", color:"#a06070", display:"block", marginBottom:"6px" }}>Téléphone *</label>
                  <input className="input-field" placeholder="+33 6 XX XX XX XX" type="tel" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                </div>
                <div>
                  <label className="sans" style={{ fontSize:"12px", color:"#a06070", display:"block", marginBottom:"6px" }}>Email *</label>
                  <input className="input-field" placeholder="votre@email.com" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                </div>
                <div>
                  <label className="sans" style={{ fontSize:"12px", color:"#a06070", display:"block", marginBottom:"6px" }}>Note (optionnel)</label>
                  <textarea className="input-field" placeholder="Ex : allergies, questions..." value={form.note} onChange={e => setForm({...form, note:e.target.value})} />
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"24px" }}>
                <button className="btn-ghost" onClick={() => setStep(3)}>Retour</button>
                <button className="btn-rose" disabled={!form.name || !form.phone || !form.email} onClick={handleConfirm}>Confirmer le RDV</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:"56px", marginBottom:"16px" }}>🌸</div>
              <h2 style={{ fontSize:"28px", fontWeight:"300", marginBottom:"8px" }}>
                Merci <em style={{ color:"#d4688a" }}>{form.name.split(" ")[0]}</em> !
              </h2>
              <p className="sans" style={{ fontSize:"14px", color:"#7a4555", marginBottom:"24px", lineHeight:"1.6" }}>
                Votre rendez-vous est confirmé 🎉<br/>
                Un email de confirmation vous a été envoyé.
              </p>
              <div className="card" style={{ padding:"20px", marginBottom:"28px", textAlign:"left", cursor:"default" }}>
                <div className="sans" style={{ fontSize:"13px", color:"#5a3040", lineHeight:"2" }}>
                  <div>🪄 {selectedService && selectedService.name}</div>
                  <div>📅 {selectedDate && selectedDate.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} à {selectedTime}</div>
                  <div>💰 Tarif : {selectedService && selectedService.price}</div>
                </div>
              </div>
              <button className="btn-ghost" onClick={reset}>Prendre un autre RDV</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
