import json

RULES_FILE = "backend/data/pharmaco_rules.json"

ALTERNATIVES = {
    "CODEINE": ["Non-opioid analgesics", "Morphine (clinical supervision)"],
    "CLOPIDOGREL": ["Prasugrel", "Ticagrelor"],
    "WARFARIN": ["DOACs", "Heparin"],
    "SIMVASTATIN": ["Pravastatin", "Rosuvastatin"],
    "AZATHIOPRINE": ["Methotrexate", "Mycophenolate mofetil"],
    "FLUOROURACIL": ["Capecitabine (adjusted)", "Alternative regimen"]
}


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

        diplotype = star or "Unknown"

        # 🔥 CORE FIX: derive phenotype from GT
        if gt == "1/1":
            phenotype = "PM"
        elif gt == "0/1":
            phenotype = "IM"
        elif gt == "0/0":
            phenotype = "NM"

    risk_map = {
        "PM": ("Toxic", "critical", 0.9),
        "IM": ("Adjust Dosage", "moderate", 0.7),
        "NM": ("Safe", "none", 0.9)
    }

    label, severity, confidence = risk_map.get(
        phenotype, ("Unknown", "low", 0.4)
    )

    note = "Refer CPIC guideline"
    alternatives = []

    if label == "Toxic":
        note = "Avoid drug; consider alternatives"
        alternatives = ALTERNATIVES.get(drug, [])
    elif label == "Adjust Dosage":
        note = "Dose adjustment recommended"

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
            "note": note,
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
            "note": "Insufficient genetic data",
            "alternative_drugs": []
        }
    }
