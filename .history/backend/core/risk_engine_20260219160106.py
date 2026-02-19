import json

RULES_FILE = "data/pharmaco_rules.json"


# Alternative drug suggestions (safe, text-based)
ALTERNATIVES = {
    "CODEINE": [
        "Consider non-opioid analgesics",
        "Morphine (under clinical supervision)"
    ],
    "CLOPIDOGREL": [
        "Prasugrel",
        "Ticagrelor"
    ],
    "WARFARIN": [
        "Direct oral anticoagulants (DOACs)",
        "Heparin (short-term)"
    ],
    "SIMVASTATIN": [
        "Pravastatin",
        "Rosuvastatin"
    ],
    "AZATHIOPRINE": [
        "Methotrexate",
        "Mycophenolate mofetil"
    ],
    "FLUOROURACIL": [
        "Capecitabine (dose adjusted)",
        "Non-fluoropyrimidine regimen"
    ]
}


def assess_risk(variants, drug):
    with open(RULES_FILE) as f:
        rules = json.load(f)

    drug = drug.upper()
    rule = rules.get(drug)
    if not rule:
        return unknown_result()

    gene = rule["gene"]

    # Find matching gene variant
    variant = next((v for v in variants if v.get("gene") == gene), None)

    phenotype = "Unknown"
    diplotype = "Unknown"

    if variant and variant.get("star"):
        diplotype = variant["star"]
        phenotype = rule.get(diplotype, "Unknown")

    # Risk mapping (problem statement aligned)
    risk_map = {
        "PM": ("Toxic", "critical", 0.9),
        "IM": ("Adjust Dosage", "moderate", 0.7),
        "NM": ("Safe", "none", 0.9)
    }

    label, severity, confidence = risk_map.get(
        phenotype, ("Unknown", "low", 0.4)
    )

    # Clinical recommendation logic
    recommendation_note = "Refer CPIC guideline"
    alternatives = []

    if label in ["Toxic", "Ineffective"]:
        recommendation_note = "Avoid drug; consider alternatives"
        alternatives = ALTERNATIVES.get(drug, [])
    elif label == "Adjust Dosage":
        recommendation_note = "Dose adjustment recommended"

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
            "action": label,
            "note": recommendation_note,
            "alternative_drugs": alternatives
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
            "action": "Unknown",
            "note": "Insufficient genetic information",
            "alternative_drugs": []
        }
    }
