const treatmentData = {
  cataract: {
    title: "Cataract Surgery",
    lead: "A simple explanation of cloudy lens treatment, surgery planning, and recovery guidance.",
    what: "Cataract surgery replaces the cloudy natural lens with a clear artificial lens to improve vision, reduce glare, and help daily tasks feel easier again.",
    preparation: "Detailed eye examination, medication review, and testing may be done before treatment so the plan is safe and clear.",
    before: "Before cataract surgery, you may be asked to stop or adjust some medicines, arrange transport, and follow the clinic's fasting or drop instructions.",
    during: "The procedure is usually performed through a tiny incision under local anesthesia. It is designed to be quick, comfortable, and carefully controlled.",
    after: "After cataract surgery, vision may improve gradually over a few days and you will receive eye drop instructions and follow-up timing.",
    recovery: "Use the prescribed eye drops, avoid eye rubbing, and wear protection if recommended. Follow-up visits help track healing and lens positioning.",
    sideEffects: "Temporary blur, light sensitivity, mild irritation, or watering can happen while the eye settles after surgery.",
    risks: "Infection, inflammation, pressure changes, or retinal swelling are uncommon but possible. Your surgeon will explain the specific risks for your case.",
    glasses: "Some patients need new glasses after healing, depending on the lens chosen and the vision goal discussed during planning."
  },
  cornea: {
    title: "Cornea Care",
    lead: "Care for corneal surface problems, discomfort, redness, blurred vision, and related conditions.",
    what: "Cornea care focuses on the clear front surface of the eye. Treatment may include medicines, drops, procedures, or surgery depending on the exact condition.",
    preparation: "Detailed eye examination, corneal measurements, and a review of symptoms help decide the most suitable care plan.",
    before: "Before cornea treatment, you may be asked to avoid contact lenses for a time and follow any drop instructions shared by the doctor.",
    during: "Treatment can range from simple medical management to a procedure. The clinic team explains each step before starting.",
    after: "After treatment, comfort and clarity usually improve gradually. Some conditions need several visits so the surface can heal properly.",
    recovery: "Use the prescribed drops, avoid rubbing, and keep follow-up appointments. Healing time depends on the type of corneal problem treated.",
    sideEffects: "Mild irritation, watering, or temporary blur can occur, especially while drops and healing are in progress.",
    risks: "Risks are usually small but may include infection, delayed healing, or recurrence of symptoms depending on the condition.",
    glasses: "New glasses may be recommended once the surface is stable, especially if vision changes after healing."
  },
  dryeye: {
    title: "Dry Eye Treatment",
    lead: "A practical plan for dryness, burning, irritation, and everyday eye comfort.",
    what: "Dry eye treatment helps restore tear balance and reduce symptoms such as burning, dryness, watering, and visual fluctuation.",
    preparation: "A review of symptoms, lifestyle habits, screen use, medications, and eye surface findings helps shape the treatment plan.",
    before: "Before treatment, you may be asked about your environment, screen time, and the drops or remedies you already use.",
    during: "Treatment may include lubricating drops, lid hygiene, anti-inflammatory drops, or other surface care based on the cause.",
    after: "After treatment, symptoms typically reduce gradually and the plan may be adjusted based on response and comfort.",
    recovery: "Follow the prescribed drop schedule, keep eyelids clean, and return for review if dryness changes or becomes severe.",
    sideEffects: "Some drops can cause brief stinging or a temporary blurred sensation when first used.",
    risks: "Complications are uncommon, though ongoing dryness may return if the underlying cause is not controlled.",
    glasses: "Artificial tears or specific eye care routines are usually more important than glasses, though updated glasses may help if vision is fluctuating."
  },
  refractive: {
    title: "Refractive Surgery",
    lead: "Vision correction treatment for patients who want to reduce dependence on glasses or contact lenses.",
    what: "Refractive surgery reshapes the eye's focusing system to correct short-sightedness, long-sightedness, or astigmatism after proper evaluation.",
    preparation: "Detailed eye measurements, corneal thickness checks, and a review of eye health are needed before deciding if surgery is suitable.",
    before: "You may be asked to stop wearing contact lenses for a period and to follow specific pre-surgery instructions from the doctor.",
    during: "The procedure is usually quick and performed with advanced laser or surgical techniques depending on the chosen treatment.",
    after: "Vision improves over time, and the clinic will guide you on drops, rest, and follow-up visits during the recovery window.",
    recovery: "Protect your eyes, avoid rubbing, and attend follow-up reviews so healing and vision stability can be checked closely.",
    sideEffects: "Temporary dryness, glare, halos, or mild discomfort may happen while the eye adjusts after treatment.",
    risks: "Under-correction, over-correction, infection, or healing variations are uncommon but can occur and are discussed beforehand.",
    glasses: "Some patients still need glasses for fine work or night use, even after surgery, depending on their vision goals and healing response."
  },
  pdek: {
    title: "PDEK (Corneal Transplant)",
    lead: "A corneal transplant technique used for selected corneal diseases affecting clarity and vision.",
    what: "PDEK replaces damaged inner corneal layers with healthy donor tissue, helping restore clarity when the cornea is not functioning properly.",
    preparation: "The evaluation includes corneal testing, general eye checks, and a discussion of expected recovery and donor tissue use.",
    before: "Before PDEK, the doctor may advise you about medicines, transport, and the recovery schedule so you can prepare comfortably.",
    during: "During surgery, the damaged layer is replaced carefully with donor tissue and the eye is protected while healing begins.",
    after: "Vision improves gradually over weeks or months, and follow-up care is important to monitor graft position and healing.",
    recovery: "Use prescribed drops, avoid eye rubbing, and attend all follow-up visits. Recovery plans are often more structured for transplant cases.",
    sideEffects: "Temporary blur, pressure changes, light sensitivity, or mild irritation may happen while the graft settles.",
    risks: "Graft rejection, infection, delayed healing, or graft dislocation are possible and are discussed before treatment.",
    glasses: "Glasses may still be needed later for clearer vision once healing is complete and the prescription stabilizes."
  },
  retina: {
    title: "Medical Retina Care",
    lead: "Diagnosis and treatment for conditions affecting the retina, macula, and central vision.",
    what: "Medical retina care focuses on diseases such as swelling, bleeding, diabetic changes, and other retinal conditions that need close monitoring.",
    preparation: "Detailed retina examination, scans, and sometimes imaging or injections are planned based on the condition.",
    before: "Before treatment, bring your previous reports and share your medical history, especially if you have diabetes or blood pressure concerns.",
    during: "Treatment may include medicines, injections, or laser procedures, depending on the retinal condition and response needed.",
    after: "After treatment, vision and comfort are monitored closely and follow-up timing is based on how the retina responds.",
    recovery: "Use medicines as directed and attend review visits so the eye can be checked for retinal improvement and stability.",
    sideEffects: "Mild irritation, brief blur, or pressure sensations can occur depending on the specific retina treatment given.",
    risks: "Complications are uncommon but may include infection, inflammation, or incomplete response requiring further care.",
    glasses: "Glasses changes may be needed later once the retina is stable, but retinal treatment itself is usually more important first."
  },
  antiVegf: {
    title: "Anti-VEGF Treatment",
    lead: "Injection-based retinal treatment used to reduce swelling and control abnormal vessel growth.",
    what: "Anti-VEGF treatment helps reduce leakage, swelling, and harmful vessel growth in selected retinal conditions.",
    preparation: "Your retina examination, scan results, and medical history are reviewed before injection treatment is planned.",
    before: "Before the procedure, the eye is cleaned and numbing drops are used so the treatment is as comfortable as possible.",
    during: "The injection is performed quickly and carefully in a sterile setting. The doctor explains each step before starting.",
    after: "After treatment, you may notice mild irritation or blur that settles soon. Follow-up is used to check response and safety.",
    recovery: "Avoid rubbing the eye, use the prescribed drops if given, and return for review according to the schedule shared by the clinic.",
    sideEffects: "Temporary redness, pressure feeling, or mild blur can occur for a short time after injection.",
    risks: "Infection, inflammation, or pressure rise are uncommon but possible. These are reviewed before treatment begins.",
    glasses: "Glasses may still be useful for day-to-day vision if the underlying retina condition also affects clarity."
  },
  laser: {
    title: "Laser Treatment",
    lead: "Targeted laser care for selected retinal or corneal conditions, depending on the diagnosis.",
    what: "Laser treatment uses controlled light energy to treat specific eye conditions. The exact approach depends on the condition being managed.",
    preparation: "Eye examination, imaging, and condition-specific planning help decide whether laser treatment is the right option.",
    before: "Before laser treatment, the eye may be dilated or numbed and you may be asked to avoid contacts or follow special steps.",
    during: "The procedure is usually brief and performed in clinic. The doctor places the laser carefully based on your diagnosis.",
    after: "Vision may feel slightly different for a short time after laser treatment. Follow-up is used to confirm response and safety.",
    recovery: "Use drops if prescribed, rest the eye as instructed, and attend any follow-up reviews to ensure healing is on track.",
    sideEffects: "Temporary blur, brightness sensitivity, or mild discomfort may occur after the laser session.",
    risks: "Rare risks can include inflammation, pressure changes, or nearby tissue effect depending on the laser area treated.",
    glasses: "Eyeglasses may remain the same or may be updated later depending on the reason the laser treatment was done."
  }
};

const treatmentAliases = {
  "cataract surgery": "cataract",
  "cataract-care": "cataract",
  cataract: "cataract",
  "cornea care": "cornea",
  cornea: "cornea",
  "dry eye treatment": "dryeye",
  dryeye: "dryeye",
  "refractive surgery": "refractive",
  refractive: "refractive",
  pdek: "pdek",
  "pdek corneal transplant": "pdek",
  retina: "retina",
  "medical retina care": "retina",
  "anti-vegf": "antiVegf",
  antivegf: "antiVegf",
  "anti-vegf treatment": "antiVegf",
  laser: "laser",
  "laser treatment": "laser"
};

const slug = new URLSearchParams(window.location.search).get("t") || new URLSearchParams(window.location.search).get("treatment") || "cataract";
const key = treatmentAliases[slug.toLowerCase()] || "cataract";
const treatment = treatmentData[key] || treatmentData.cataract;

document.title = `${treatment.title} | Juhi Eye Care`;

document.querySelectorAll("[data-treatment-title]").forEach((node) => {
  node.textContent = treatment.title;
});

const leadNode = document.querySelector("[data-treatment-lead]");
if (leadNode) leadNode.textContent = treatment.lead;

const contentMap = {
  "[data-treatment-what]": treatment.what,
  "[data-treatment-preparation]": treatment.preparation,
  "[data-treatment-before]": treatment.before,
  "[data-treatment-during]": treatment.during,
  "[data-treatment-after]": treatment.after,
  "[data-treatment-recovery]": treatment.recovery,
  "[data-treatment-side-effects]": treatment.sideEffects,
  "[data-treatment-risks]": treatment.risks,
  "[data-treatment-glasses]": treatment.glasses
};

Object.entries(contentMap).forEach(([selector, value]) => {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
});

document.querySelectorAll(".treatment-detail-media__tile").forEach((tile, index) => {
  const gradients = [
    "linear-gradient(135deg, #d9ddc8, #7b9b73 48%, #2b5b57)",
    "linear-gradient(135deg, #edd0b0, #b96d55 42%, #52352a)"
  ];

  tile.style.background = `${gradients[index % gradients.length]}`;
});
