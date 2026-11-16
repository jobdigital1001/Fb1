// Runs the pure logic blocks of both tools in Node. Usage: node test.js
const fs = require("fs");
const assert = require("assert");

function loadLogic(file) {
  const html = fs.readFileSync(file, "utf8");
  const m = html.match(/<script id="logic">([\s\S]*?)<\/script>/);
  const mod = { exports: {} };
  new Function("module", m[1])(mod);
  return { api: mod.exports, html };
}

// ---------- KI-Kennzeichnung ----------
const ki = loadLogic(__dirname + "/index.html");
const ev = ki.api.evaluate;
const levels = (r) => r.map((x) => x.level + ":" + x.ref).join(" | ");
const profiles = {
  "Shop mit echt wirkenden KI-Produktfotos": { role: "use", bot: "no", media: "real", text: "marketing", review: "yes", bio: "no" },
  "Agentur, KI-Blogtexte mit Lektorat": { role: "use", bot: "no", media: "none", text: "marketing", review: "yes", bio: "no" },
  "Website mit Support-Chatbot": { role: "use", bot: "yes", media: "none", text: "none", bio: "no" },
  "Newsportal, KI-Texte ohne Prüfung": { role: "use", bot: "no", media: "none", text: "public", review: "no", bio: "no" },
  "Anbieter eines eigenen Bildgenerators": { role: "offer", bot: "no", media: "none", text: "none", bio: "no" },
  "Firma ohne KI-Inhalte": { role: "use", bot: "no", media: "none", text: "none", bio: "no" },
  "Privatperson": { role: "private" },
};
for (const [name, a] of Object.entries(profiles)) console.log(name + "\n   -> " + levels(ev(a)));

assert(ev(profiles["Shop mit echt wirkenden KI-Produktfotos"]).some((r) => r.level === "must" && /Abs\. 4/.test(r.ref)));
assert(ev(profiles["Agentur, KI-Blogtexte mit Lektorat"]).every((r) => r.level === "none"));
assert(ev(profiles["Website mit Support-Chatbot"])[0].level === "rec");
assert(ev(profiles["Newsportal, KI-Texte ohne Prüfung"])[0].level === "must");
assert(ev(profiles["Anbieter eines eigenen Bildgenerators"]).some((r) => /Abs\. 2/.test(r.ref)));
assert(ev(profiles["Firma ohne KI-Inhalte"])[0].level === "none");
assert(ev(profiles["Privatperson"]).length === 1);
assert(ki.api.badgeSVG("<x>", "pill", "solid", "javascript:1").indexOf("<x>") === -1);

for (const t of [ki]) {
  assert(!/(src|href)="https?:\/\//.test(t.html), "external request found");
  assert(!/localStorage|document\.cookie|fetch\(|XMLHttpRequest/.test(t.html), "storage or network call found");
  assert(!/rechtssicher|garantiert|zertifiziert|offiziell/i.test(t.html), "forbidden wording found");
}
console.log("\nAlle Tests bestanden.");
