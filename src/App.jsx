import { useState, useEffect } from "react";

// Durées bloquées en minutes (durée réelle + 10min tampon) - invisible pour la cliente
const DUREE_BLOCAGE = {
  "c1": 120,  // Pose cil à cil: 1h50 + 10min
  "c2": 90,   // Remplissage cil à cil: 1h20 + 10min
  "c3": 120,  // Pose mixte 3D/4D/5D: 1h50 + 10min
  "c4": 90,   // Remplissage mixte: 1h20 + 10min
  "c5": 120,  // Pose méga cil à cil: 1h50 + 10min
  "c6": 90,   // Remplissage méga: 1h20 + 10min
  "c7": 120,  // Volume Russe: 1h50 + 10min
  "c8": 90,   // Remplissage Volume Russe: 1h20 + 10min
  "c9": 120,  // Méga Volume Russe: 1h50 + 10min
  "c10": 90,  // Remplissage Méga Volume: 1h20 + 10min
  "c11": 120, // Anime Lashes Classic: 1h50 + 10min
  "c12": 90,  // Remplissage Anime Classic: 1h20 + 10min
  "c13": 120, // Méga Anime Lashes: 1h50 + 10min
  "c14": 90,  // Remplissage Méga Anime: 1h20 + 10min
  "c15": 50,  // Dépose cils: 40min + 10min
  "s1": 50,   // Browlift: 40min + 10min
  "s2": 70,   // Browlift + Épilation: 1h + 10min
  "s3": 80,   // Browlift + Teinture: 1h10 + 10min
  "s4": 40,   // Teinture sourcils: 30min + 10min
  "s5": 40,   // Épilation au fil sourcils: 30min + 10min
  "r1": 60,   // Rehaussement: 50min + 10min
  "r2": 85,   // Rehaussement + Teinture: 1h15 + 10min
  "r3": 40,   // Teinture cils: 30min + 10min
};

const INFO_POSE = "Durée : 1h20 à 1h50. Venez démaquillée, sans mascara ni huile sur les cils.";
const INFO_REMPL = "Durée : 1h15 à 1h20 selon le remplissage. Venez démaquillée, sans mascara ni huile sur les cils.";
const INFO_SOURCIL = "Venez sans maquillage sur les sourcils pour un résultat optimal.";
const INFO_REHAUSSE = "Durée : 50 min. Venez sans mascara ni produit sur les cils.";
const INFO_REHAUSSE2 = "Durée : 1h15. Venez sans mascara ni produit sur les cils.";
const INFO_DEPOSE = "Durée : 40 min. Dépose douce des extensions posees en institut extérieur.";
const INFO_TEINTURE = "Durée : 30 min. Venez sans maquillage sur la zone.";
const INFO_BROWLIFT = "Durée : 40 min. Venez sans maquillage sur les sourcils.";
const INFO_BROWLIFT2 = "Durée : 1h. Venez sans maquillage sur les sourcils.";
const INFO_BROWLIFT3 = "Durée : 1h10. Venez sans maquillage sur les sourcils.";
const INFO_EPIL = "Durée : 30 min. Venez sans maquillage sur les sourcils.";

const services = [
  {
    category: "Cils",
    emoji: "🪄",
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
    category: "Sourcils",
    emoji: "✨",
    items: [
      { id: "s1", name: "Browlift", price: "50€", info: INFO_BROWLIFT },
      { id: "s2", name: "Browlift + Épilation", price: "65€", info: INFO_BROWLIFT2 },
      { id: "s3", name: "Browlift + Teinture", price: "70€", info: INFO_BROWLIFT3 },
      { id: "s4", name: "Teinture sourcils", price: "25€", info: INFO_TEINTURE },
      { id: "s5", name: "Épilation au fil sourcils", price: "20€", info: INFO_EPIL },
    ],
  },
  {
    category: "Rehaussement de cils",
    emoji: "🌸",
    items: [
      { id: "r1", name: "Rehaussement", price: "50€", info: INFO_REHAUSSE },
      { id: "r2", name: "Rehaussement + Teinture", price: "65€", info: INFO_REHAUSSE2 },
      { id: "r3", name: "Teinture cils", price: "20€", info: INFO_TEINTURE },
    ],
  },
];

// Genere les creneaux de 9h a 20h30 par pas de 15 min
function genererCreneaux() {
  const creneaux = [];
  for (let h = 9; h <= 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 20 && m > 30) break;
      const hStr = String(h).padStart(2, "0");
      const mStr = String(m).padStart(2, "0");
      creneaux.push(hStr + ":" + mStr);
    }
  }
  return creneaux;
}

const TOUS_CRENEAUX = genererCreneaux();

// Convertit "09:00" en minutes depuis minuit
function enMinutes(heure) {
  const [h, m] = heure.split(":").map(Number);
  return h * 60 + m;
}

// Calcule les creneaux bloques par les RDV existants
function creneauxBloques(rdvs, dureeService) {
  const bloques = new Set();
  rdvs.forEach(rdv => {
    const debut = enMinutes(rdv.heure);
    const fin = debut + rdv.duree;
    // Bloque tous les creneaux qui chevauchent ce RDV
    TOUS_CRENEAUX.forEach(c => {
      const cMin = enMinutes(c);
      const cFin = cMin + dureeService;
      if (cMin < fin && cFin > debut) {
        bloques.add(c);
      }
    });
  });
  return bloques;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Decembre"];
const dayNames = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Nunito:wght@700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:linear-gradient(145deg,#fff5f7 0%,#fce8ef 40%,#f9d6e4 100%);min-height:100vh}
  .sans{font-family:'Jost',sans-serif}
  .btn-rose{background:linear-gradient(135deg,#d4688a,#c0506e);color:white;border:none;border-radius:50px;padding:14px 36px;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all 0.25s;box-shadow:0 4px 20px rgba(192,80,110,0.3)}
  .btn-rose:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(192,80,110,0.4)}
  .btn-rose:disabled{opacity:0.4;cursor:not-allowed;transform:none}
  .btn-ghost{background:transparent;border:1.5px solid rgba(192,80,110,0.35);color:#c0506e;border-radius:50px;padding:10px 24px;font-family:'Jost',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
  .btn-ghost:hover{background:rgba(192,80,110,0.07)}
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
  .time-chip.blocked{opacity:0.25;cursor:not-allowed;background:rgba(0,0,0,0.05);border-color:transparent;color:#999}
  .cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:50%;font-family:'Jost',sans-serif;font-size:13px;cursor:pointer;transition:all 0.18s;border:1.5px solid transparent}
  .cal-day:hover{background:rgba(212,104,138,0.12);border-color:rgba(212,104,138,0.3)}
  .cal-day.dis{opacity:0.25;cursor:not-allowed;pointer-events:none}
  .cal-day.sel{background:linear-gradient(135deg,#d4688a,#c0506e);color:white}
  .cal-day.tod{border-color:#d4688a;color:#d4688a;font-weight:600}
  textarea.input-field{resize:vertical;min-height:80px}
  .info-box{background:rgba(212,104,138,0.08);border:1px solid rgba(212,104,138,0.25);border-radius:12px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:12px;color:#a06070;line-height:1.6;margin-top:8px;animation:fadeIn 0.2s ease}
  .notice{background:rgba(212,104,138,0.08);border:1px solid rgba(212,104,138,0.2);border-radius:12px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:12px;color:#a06070;text-align:center;line-height:1.6;margin-top:16px}
  .logo-text{font-family:'Nunito',sans-serif;font-weight:900;font-size:clamp(36px,10vw,52px);color:#c9788e;letter-spacing:-1px;line-height:1}
  .logo-sub{font-family:'Jost',sans-serif;font-weight:300;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d4a0b0;margin-top:2px}
  @keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
`;

const STORAGE_KEY = "concept4lashes_rdvs";

function chargerRdvs() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch(e) {
    return {};
  }
}

function sauvegarderRdv(dateKey, heure, duree) {
  try {
    const rdvs = chargerRdvs();
    if (!rdvs[dateKey]) rdvs[dateKey] = [];
    rdvs[dateKey].push({ heure, duree });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rdvs));
  } catch(e) {}
}

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [rdvs, setRdvs] = useState({});
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  useEffect(() => {
    setRdvs(chargerRdvs());
  }, []);

  const dateKey = selectedDate
    ? selectedDate.getFullYear() + "-" + String(selectedDate.getMonth()+1).padStart(2,"0") + "-" + String(selectedDate.getDate()).padStart(2,"0")
    : null;

  const dureeService = selectedService ? DUREE_BLOCAGE[selectedService.id] : 60;
  const rdvsDuJour = (dateKey && rdvs[dateKey]) ? rdvs[dateKey] : [];
  const bloques = creneauxBloques(rdvsDuJour, dureeService);

  // Verifie aussi que le creneau + duree ne depasse pas 20h30
  const estDisponible = (creneau) => {
    if (bloques.has(creneau)) return false;
    const debut = enMinutes(creneau);
    const fin = debut + dureeService;
    if (fin > enMinutes("20:30") + 30) return false; // derniere prestation max 20h30
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
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true;
    return false;
  };

  const handleConfirm = async () => {
    if (!form.name || !form.phone) return;
    const data = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      note: form.note,
      prestation: selectedService ? selectedService.name + " — " + selectedService.price : "",
      date: selectedDate ? selectedDate.toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"}) : "",
      heure: selectedTime || "",
    };
    // Sauvegarder le RDV localement pour bloquer le creneau
    if (dateKey && selectedTime) {
      sauvegarderRdv(dateKey, selectedTime, dureeService);
      setRdvs(chargerRdvs());
    }
    try {
      await fetch("https://formspree.io/f/mrejgyev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch(e) {
      console.error(e);
    }
    setStep(5);
  };

  const reset = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setForm({ name: "", phone: "", email: "", note: "" });
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", fontFamily:"'Cormorant Garamond', Georgia, serif", color:"#2a1520" }}>
        <div style={{ maxWidth:"480px", margin:"0 auto", padding:"24px 16px 40px" }}>

          <div style={{ textAlign:"center", marginBottom:"32px", paddingTop:"12px" }}>
            <div className="logo-text">concept<span style={{ color:"#c9788e" }}>.</span></div>
            <div className="logo-sub">for iconic lashes</div>
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
                <button className="btn-rose" disabled={!selectedService} onClick={() => setStep(2)}>
                  Continuer
                </button>
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
                    onClick={() => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}>
                    ‹
                  </button>
                  <span style={{ fontSize:"20px", fontWeight:"400" }}>{monthNames[calMonth]} {calYear}</span>
                  <button className="btn-ghost" style={{ padding:"6px 14px", fontSize:"18px" }}
                    onClick={() => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}>
                    ›
                  </button>
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
                        className={"cal-day" + (disabled?" dis":"") + (isSel?" sel":"") + (!isSel&&isTod?" tod":"")}
                        onClick={() => { if(!disabled){ setSelectedDate(date); setSelectedTime(null); } }}
                      >
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
              <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center" }}>
                {TOUS_CRENEAUX.map(t => {
                  const dispo = estDisponible(t);
                  return (
                    <div
                      key={t}
                      className={"time-chip" + (selectedTime===t?" sel":"") + (!dispo?" blocked":"")}
                      onClick={() => { if(dispo) setSelectedTime(t); }}
                    >
                      {t}
                    </div>
                  );
                })}
              </div>
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
                  <div>📅 {selectedDate && selectedDate.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} a {selectedTime}</div>
                </div>
                {selectedService && (
                  <div style={{ marginTop:"10px", fontSize:"12px", fontFamily:"'Jost',sans-serif", color:"#a06070", lineHeight:"1.5" }}>
                    {selectedService.info}
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
                  <label className="sans" style={{ fontSize:"12px", color:"#a06070", display:"block", marginBottom:"6px" }}>Email</label>
                  <input className="input-field" placeholder="votre@email.com" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                </div>
                <div>
                  <label className="sans" style={{ fontSize:"12px", color:"#a06070", display:"block", marginBottom:"6px" }}>Note (optionnel)</label>
                  <textarea className="input-field" placeholder="Ex : allergies, questions..." value={form.note} onChange={e => setForm({...form, note:e.target.value})} />
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"24px" }}>
                <button className="btn-ghost" onClick={() => setStep(3)}>Retour</button>
                <button className="btn-rose" disabled={!form.name || !form.phone} onClick={handleConfirm}>
                  Confirmer le RDV
                </button>
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
                Votre demande a bien été envoyée.<br/>
                Je vous confirme par SMS très bientôt.
              </p>
              <div className="card" style={{ padding:"20px", marginBottom:"28px", textAlign:"left", cursor:"default" }}>
                <div className="sans" style={{ fontSize:"13px", color:"#5a3040", lineHeight:"2" }}>
                  <div>🪄 {selectedService && selectedService.name}</div>
                  <div>📅 {selectedDate && selectedDate.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} a {selectedTime}</div>
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
