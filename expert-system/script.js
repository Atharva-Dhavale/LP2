const checkBtn = document.getElementById("checkBtn");
const resetBtn = document.getElementById("resetBtn");
const resultBox = document.getElementById("result");
const resultList = document.getElementById("resultList");
const alertBox = document.getElementById("alertBox");
const messageBox = document.getElementById("message");
const selectedCount = document.getElementById("selectedCount");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function getSymptoms() {
  const selected = {};

  checkboxes.forEach((checkbox) => {
    selected[checkbox.value] = checkbox.checked;
  });

  return selected;
}

function getSelectedKeys(symptoms) {
  return Object.keys(symptoms).filter((key) => symptoms[key]);
}

function getRuleMatches(symptoms) {
  return [
    {
      condition: "COVID-19 / Pneumonia",
      doctor: "Pulmonologist or emergency physician",
      urgency: "High",
      ruleSymptoms: ["fever", "cough", "breathing"],
      advice: "Get medical attention quickly. Wear a mask, isolate yourself, and arrange a clinical evaluation."
    },
    {
      condition: "Dengue / Viral Fever",
      doctor: "General physician",
      urgency: "Moderate",
      ruleSymptoms: ["fever", "body_pain", "headache"],
      advice: "Get blood tests such as CBC and platelet count. Rest well and stay hydrated."
    },
    {
      condition: "Common Cold / Allergic Rhinitis",
      doctor: "General physician or ENT specialist",
      urgency: "Low",
      ruleSymptoms: ["cold", "sneezing", "sore_throat"],
      advice: "Rest, take warm fluids, and monitor symptoms. Seek medical advice if symptoms continue for several days."
    },
    {
      condition: "Influenza (Flu)",
      doctor: "General physician",
      urgency: "Moderate",
      ruleSymptoms: ["fever", "cough", "sore_throat", "cold"],
      advice: "Take rest, drink fluids, and use fever medication if advised. Consult a doctor if symptoms worsen."
    },
    {
      condition: "Food Poisoning / Gastroenteritis",
      doctor: "General physician",
      urgency: "Moderate",
      ruleSymptoms: ["vomiting", "diarrhea"],
      advice: "Take ORS, drink enough water, and eat light food. Visit a doctor if dehydration or weakness increases."
    },
    {
      condition: "Migraine / Stress",
      doctor: "General physician or neurologist",
      urgency: "Low",
      ruleSymptoms: ["headache", "fatigue"],
      excludedSymptoms: ["fever"],
      advice: "Rest in a quiet room, reduce stress, and seek medical help if headaches are frequent or severe."
    },
    {
      condition: "Measles / Chickenpox",
      doctor: "Dermatologist or physician",
      urgency: "High",
      ruleSymptoms: ["rash", "fever"],
      advice: "Get evaluated by a doctor promptly, avoid scratching, and minimize contact with others."
    },
    {
      condition: "Throat Infection / Pharyngitis",
      doctor: "ENT specialist or general physician",
      urgency: "Low",
      ruleSymptoms: ["cough", "sore_throat"],
      excludedSymptoms: ["fever"],
      advice: "Try warm salt water gargles and soothing fluids. Visit a doctor if pain persists."
    }
  ];
}

function buildDiagnosis(rule, matchedCount) {
  const total = rule.ruleSymptoms.length;
  const confidence = Math.round((matchedCount / total) * 100);

  return {
    condition: rule.condition,
    doctor: rule.doctor,
    urgency: rule.urgency,
    confidence,
    matchedSymptoms: rule.ruleSymptoms,
    advice: rule.advice
  };
}

function getDiagnoses(symptoms) {
  const diagnoses = [];
  const selectedKeys = getSelectedKeys(symptoms);
  const rules = getRuleMatches(symptoms);

  rules.forEach((rule) => {
    const hasExcluded = (rule.excludedSymptoms || []).some((item) => symptoms[item]);
    const matchedCount = rule.ruleSymptoms.filter((item) => symptoms[item]).length;

    if (!hasExcluded && matchedCount === rule.ruleSymptoms.length) {
      diagnoses.push(buildDiagnosis(rule, matchedCount));
    }
  });

  if (diagnoses.length === 0) {
    diagnoses.push({
      condition: "No specific condition matched",
      doctor: "General physician",
      urgency: "Needs consultation",
      confidence: selectedKeys.length === 0 ? 0 : 30,
      matchedSymptoms: selectedKeys,
      advice: "The selected symptoms do not clearly match a rule. Please consult a general physician for proper diagnosis."
    });
  }

  diagnoses.sort((a, b) => b.confidence - a.confidence);
  return diagnoses;
}

function getEmergencyAlert(symptoms) {
  if (symptoms.breathing && symptoms.fever) {
    return "Emergency alert: Difficulty breathing with fever may require urgent medical attention.";
  }

  if (symptoms.vomiting && symptoms.diarrhea && symptoms.fatigue) {
    return "Warning: Vomiting, diarrhea, and fatigue together can lead to dehydration. Monitor carefully.";
  }

  return "";
}

function showResults(diagnoses) {
  resultList.innerHTML = "";

  diagnoses.forEach((item) => {
    const card = document.createElement("div");
    card.className = "diagnosis";
    card.innerHTML = `
      <h3>${item.condition}</h3>
      <p><strong>Confidence:</strong> ${item.confidence}%</p>
      <p><strong>Urgency:</strong> ${item.urgency}</p>
      <p><strong>Suggested specialist:</strong> ${item.doctor}</p>
      <p><strong>Matched symptoms:</strong> ${item.matchedSymptoms.length ? item.matchedSymptoms.join(", ") : "None"}</p>
      <p><strong>Advice:</strong> ${item.advice}</p>
    `;
    resultList.appendChild(card);
  });

  resultBox.style.display = "block";
}

function updateSelectedCount() {
  const count = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;
  selectedCount.textContent = count;
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateSelectedCount);
});

checkBtn.addEventListener("click", () => {
  const symptoms = getSymptoms();
  const selectedKeys = getSelectedKeys(symptoms);

  if (selectedKeys.length === 0) {
    messageBox.textContent = "Please select at least one symptom before checking the diagnosis.";
    resultBox.style.display = "none";
    return;
  }

  messageBox.textContent = "";
  const diagnoses = getDiagnoses(symptoms);
  const alertMessage = getEmergencyAlert(symptoms);

  if (alertMessage) {
    alertBox.textContent = alertMessage;
    alertBox.style.display = "block";
  } else {
    alertBox.textContent = "";
    alertBox.style.display = "none";
  }

  showResults(diagnoses);
});

resetBtn.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  resultList.innerHTML = "";
  alertBox.textContent = "";
  alertBox.style.display = "none";
  messageBox.textContent = "";
  resultBox.style.display = "none";
  updateSelectedCount();
});

updateSelectedCount();
