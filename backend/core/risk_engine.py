import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RULES_FILE = os.path.join(BASE_DIR, "data", "pharmaco_rules.json")

# -------------------------------------------------
# Therapy, dosage, symptoms & actions knowledge
# -------------------------------------------------
THERAPY_GUIDANCE = {
    "CODEINE": {
        "PM": {
            "alternatives": ["Paracetamol", "Morphine (clinical supervision)"],
            "dosage": "Avoid codeine.",
            "symptoms": [
                "Extreme drowsiness",
                "Respiratory depression",
                "Nausea or vomiting"
            ],
            "actions": [
                "Stop taking the drug immediately",
                "Seek medical attention",
                "Monitor breathing closely"
            ]
        },
        "IM": {
            "alternatives": ["Paracetamol"],
            "dosage": "Reduce dose by 25–50%.",
            "symptoms": ["Drowsiness", "Dizziness"],
            "actions": [
                "Reduce dose",
                "Report symptoms to doctor"
            ]
        },
        "NM": {
            "alternatives": [],
            "dosage": "Standard dosage.",
            "symptoms": [],
            "actions": []
        }
    },

    "CLOPIDOGREL": {
        "PM": {
            "alternatives": ["Prasugrel", "Ticagrelor"],
            "dosage": "Avoid clopidogrel.",
            "symptoms": [
                "Poor platelet inhibition",
                "Risk of clot formation"
            ],
            "actions": [
                "Switch to alternative antiplatelet",
                "Consult cardiologist"
            ]
        },
        "IM": {
            "alternatives": ["Prasugrel"],
            "dosage": "Consider higher dose or alternative.",
            "symptoms": ["Reduced drug effectiveness"],
            "actions": ["Monitor platelet response"]
        },
        "NM": {
            "alternatives": [],
            "dosage": "Standard dosage.",
            "symptoms": [],
            "actions": []
        }
    }
}

# -------------------------------------------------
def assess_risk(variants, drug):
    with open(RULES_FILE) as f:
        rules = json.load(f)

    drug = drug.upper()
    rule = rules.get(drug)
    if not rule:
        return unknown_result()

    gene = rule["gene"]
    variant = next((v for v in variants if v.get("gene") == gene), None)

    phenotype = "Unknown"
    diplotype = "Unknown"

    if variant:
        star = variant.get("star")
        gt = variant.get("gt")

        if star:
            diplotype = star if "/" in star else f"*1/{star}"
            phenotype = rule.get(diplotype, "Unknown")

        if phenotype == "Unknown" and gt:
            if gt == "1/1":
                phenotype = "PM"
            elif gt == "0/1":
                phenotype = "IM"
            elif gt == "0/0":
                phenotype = "NM"

    risk_map = {
        "PM": ("High Risk", "critical", 0.9),
        "IM": ("Moderate Risk", "moderate", 0.7),
        "NM": ("Low Risk", "none", 0.95)
    }

    label, severity, confidence = risk_map.get(
        phenotype, ("Unknown", "low", 0.4)
    )

    guidance = THERAPY_GUIDANCE.get(drug, {}).get(phenotype, {})

    recommended_action = (
        "Avoid drug" if phenotype == "PM"
        else "Adjust dosage" if phenotype == "IM"
        else "Safe to prescribe"
    )

    return {
        "risk_assessment": {
            "risk_label": label,
            "severity": severity,
            "confidence_score": confidence
        },
        "pharmacogenomic_profile": {
            "primary_gene": gene,
            "diplotype": diplotype,
            "phenotype": phenotype,
            "detected_variants": [variant] if variant else []
        },
        "clinical_recommendation": {
            "recommended_action": recommended_action,
            "recommended_dosage": guidance.get("dosage", "N/A"),
            "alternative_drugs": guidance.get("alternatives", []),
            "symptoms_if_taken": guidance.get("symptoms", []),
            "actions_if_taken": guidance.get("actions", []),
            "guideline": "CPIC pharmacogenomics guideline"
        }
    }


def unknown_result():
    return {
        "risk_assessment": {
            "risk_label": "Unknown",
            "severity": "low",
            "confidence_score": 0.3
        },
        "pharmacogenomic_profile": {},
        "clinical_recommendation": {
            "recommended_action": "Insufficient data",
            "recommended_dosage": "Cannot determine",
            "alternative_drugs": [],
            "symptoms_if_taken": [],
            "actions_if_taken": [],
            "guideline": "N/A"
        }
    }
