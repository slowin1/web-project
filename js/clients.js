import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// clients list
const clientsData = [
  { name: "Northbound", project: "Archive Signal" },
  { name: "Grey Matter Co", project: "Carbon Interface" },
  { name: "Field Dept", project: "Signal Drift Study" },
  { name: "Monolith", project: "Index" },
  { name: "Office of Signal", project: "Hero Transition" },
  { name: "Plainform", project: "Commerce Stack V1" },
  { name: "Late Season Studio", project: "Content Flow" },
  { name: "Artifact", project: "Scroll Narrative System" },
  { name: "Room Eleven", project: "Visual Density" },
  { name: "Index", project: "Navigation" },
  { name: "Signal & Form", project: "Motion Identity System" },
  { name: "Null", project: "Interface Calibration Test" },
  { name: "Low Fidelity", project: "Prototype" },
  { name: "House of Color", project: "Surface Study" },
  { name: "Static", project: "Landing Page" },
  { name: "Edge Pattern Lab", project: "Interaction Layer" },
  { name: "Grain", project: "Editorial" },
  { name: "Studio Northbound", project: "System Homepage" },
  { name: "Signal Dept", project: "Scroll Field Test" },
  { name: "Room of Pattern", project: "Viewport Experiments" },
  { name: "Vault", project: "Data Surface" },
  { name: "Greyform Lab", project: "Motion Calibration" },
  { name: "Section Eight", project: "Hero Grid Study" },
  { name: "Tone", project: "Identity Pass" },
  { name: "Index Dept", project: "Navigation Stack" },
  { name: "Field of View", project: "Scroll Response" },
  { name: "Mono", project: "Landing System" },
  { name: "North Sector Lab", project: "Interface Density Test" },
  { name: "Drift", project: "Motion Layer" },
  { name: "Room Zero", project: "Prototype Field" },
  { name: "Signal", project: "Scroll Narrative" },
  { name: "Plain Studio", project: "System Audit" },
  { name: "Axis", project: "Layout Study" },
  { name: "Grey Room", project: "Visual Flow Test" },
  { name: "Object Dept", project: "Surface Logic" },
  { name: "Static Form", project: "Content Index" },
  { name: "Lab North", project: "Hero Entry" },
  { name: "Frame", project: "Viewport Logic" },
  { name: "Pattern Office", project: "Interaction System" },
  { name: "North Axis", project: "Spatial Index" },
  { name: "White Room", project: "Interface Study" },
  { name: "Signal Works", project: "Motion Framework" },
  { name: "Field Studio", project: "Scroll Architecture" },
  { name: "Coreform", project: "Layout System" },
  { name: "Room Twelve", project: "Visual Balance Test" },
  { name: "Gradient Lab", project: "Surface Transition" },
  { name: "Studio Vector", project: "Directional System" },
  { name: "Pattern Field", project: "Interaction Mapping" },
  { name: "Neutral Office", project: "Content Hierarchy" },
  { name: "Monoform", project: "Typography Pass" },
  { name: "Signal Archive", project: "Narrative Index" },
  { name: "Grey Sector", project: "Density Calibration" },
  { name: "Object Field", project: "Component Study" },
  { name: "Northframe", project: "Viewport Scaling" },
  { name: "Layer Dept", project: "Stack Architecture" },
  { name: "Studio Plain", project: "System Cleanup" },
  { name: "Axis North", project: "Grid Refinement" },
  { name: "Visual Office", project: "Flow Analysis" },
  { name: "Field Notes", project: "Experimental Log" },
  { name: "Room Alpha", project: "Prototype Cycle" },
  { name: "Form Dept", project: "Structural Pass" },
  { name: "Static North", project: "Landing Revision" },
  { name: "Index Lab", project: "Navigation Research" },
  { name: "Tone Studio", project: "Identity Calibration" },
  { name: "Signal North", project: "Scroll Velocity Test" },
  { name: "Pattern Lab", project: "Interaction Grammar" },
  { name: "Frame Office", project: "Viewport Rules" },
  { name: "Grey Index", project: "System Ordering" },
  { name: "Field Logic", project: "Response Mapping" },
  { name: "Object Studio", project: "Surface Composition" },
  { name: "Northform", project: "Layout Integrity" },
  { name: "Room Delta", project: "Visual Experiment" },
  { name: "Signal Studio", project: "Motion Pass" },
  { name: "Plain Index", project: "Content Structure" },
  { name: "Axis Lab", project: "Alignment Study" },
  { name: "Neutral Field", project: "Interface Restraint" },
  { name: "Pattern North", project: "System Iteration" },
  { name: "Frame Lab", project: "Viewport Behavior" },
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
