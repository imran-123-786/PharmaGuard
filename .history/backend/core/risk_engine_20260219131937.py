import json

RULES_FILE = "backend/data/pharmaco_rules.json"

def assess_risk(variants, drug):
    with open(RULES_FILE) as f:
        rules = json.load(f)

    rule = rules.get(drug.upper())
    if not rule:
        return unknown_result()

    gene = rule["gene"]
    variant = next((v for v in variants if v["gene"] == gene), None)

    phenotype = "Unknown"
    if variant and variant.get("star"):
        phenotype = rule.get(variant["star"], "Unknown")

    risk_map = {
        "PM": ("Toxic", "critical", 0.9),
        "IM": ("Adjust Dosage", "moderate", 0.7),
        "NM": ("Safe", "none", 0.9)
    }

    label, severity, confidence = risk_map.get(
        phenotype, ("Unknown", "low", 0.4)
    )

    return {
        "risk_assessment": {
            "risk_label": label,
            "severity": severity,
            "confidence_score": confidence
        },
        "pharmacogenomic_profile": {
            "primary_gene": gene,
            "diplotype": variant.get("star") if variant else "Unknown",
            "phenotype": phenotype,
            "detected_variants": [variant] if variant else []
        },
        "clinical_recommendation": {
            "action": label,
            "note": "Refer CPIC guideline"
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
        "clinical_recommendation": {}
    }
