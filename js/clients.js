import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// clients list
const clientsData = [
  { name: "Classic Massage", project: "Full Body Relaxation" },
  { name: "Deep Tissue Massage", project: "Muscle Recovery Therapy" },
  { name: "Swedish Massage", project: "Stress Relief Session" },
  { name: "Thai Massage", project: "Stretch & Energy Balance" },
  { name: "Hot Stone Massage", project: "Thermal Relax Therapy" },
  { name: "Aroma Oil Massage", project: "Essential Oil Experience" },
  { name: "Sports Massage", project: "Post-Workout Recovery" },
  { name: "Anti-Cellulite Massage", project: "Body Contour Program" },
  { name: "Lymphatic Drainage", project: "Detox Flow Therapy" },
  { name: "Back & Neck Massage", project: "Office Tension Relief" },
  { name: "Head Massage", project: "Scalp Relax Session" },
  { name: "Foot Reflexology", project: "Pressure Point Therapy" },
  { name: "Facial Massage", project: "Natural Lifting Care" },
  { name: "Honey Massage", project: "Skin Detox Ritual" },
  { name: "Body Scrub", project: "Exfoliation Treatment" },
  { name: "Body Wrap", project: "Hydration & Firming" },
  { name: "Couples Massage", project: "Relax for Two" },
  { name: "Express Massage", project: "Quick Relief 30 min" },
  { name: "Premium SPA Program", project: "Full Wellness Experience" },
  { name: "Therapeutic Massage", project: "Pain Relief Treatment" },
  { name: "Relax Program", project: "Anti-Stress Ritual" },
  { name: "Maderotherapy", project: "Wood Therapy Sculpting" },
  { name: "Prenatal Massage", project: "Gentle Care Program" },
  { name: "Postural Correction Massage", project: "Spine Alignment Session" },
  { name: "Abdominal Massage", project: "Digestive Support Therapy" },
  { name: "Trigger Point Therapy", project: "Deep Muscle Release" },
  { name: "Myofascial Release", project: "Fascia Mobility Work" },
  { name: "Manual Lymph Massage", project: "Fluid Balance Session" },
  { name: "Relaxing Oil Ritual", project: "Evening Recovery" },
  { name: "Signature Massage", project: "Author Technique Session" }
];

// initialization
document.addEventListener("DOMContentLoaded", () => {
  generateClientsList();

  setTimeout(() => {
    ScrollTrigger.refresh();
    initClientsAnimation();
  }, 100);
});

// generate client rows from data
function generateClientsList() {
  const clientsList = document.querySelector(".clients-list");
  if (!clientsList) return;

  clientsData.forEach((client) => {
    const row = document.createElement("div");
    row.className = "client-row";

    const nameP = document.createElement("p");
    nameP.className = "type-mono";
    nameP.textContent = client.name;

    const projectP = document.createElement("p");
    projectP.className = "type-mono";
    projectP.textContent = client.project;

    row.appendChild(nameP);
    row.appendChild(projectP);
    clientsList.appendChild(row);
  });
}

// scroll animation - gap closes and opacity fades in
function initClientsAnimation() {
  const clientRows = document.querySelectorAll(".client-row");

  clientRows.forEach((row) => {
    const paragraphs = row.querySelectorAll("p");

    ScrollTrigger.create({
      trigger: row,
      start: "top 75%",
      end: "top 65%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(row, { gap: `${25 - progress * 25}%` });
        paragraphs.forEach((p) => gsap.set(p, { opacity: progress }));
      },
    });
  });
}
