import json
import os

# ================= LANGUAGE MAP FILE =================
LANG_FILE = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "language_map.json"
)

# ================= TRANSLATION HELPER =================
def translate_text(text, language):
    if language == "en":
        return text

    try:
        with open(LANG_FILE, "r", encoding="utf-8") as f:
            lang_map = json.load(f)

        mapping = lang_map.get(language, {})
        for eng, local in mapping.items():
            text = text.replace(eng, local)

        return text
    except Exception:
        return text


# ================= MAIN EXPLAINER =================
def generate_explanation(variants, drug, risk_result, language="en"):
    risk_label = risk_result["risk_assessment"]["risk_label"]
    gene = risk_result["pharmacogenomic_profile"].get("primary_gene", "Unknown")
    phenotype = risk_result["pharmacogenomic_profile"].get("phenotype", "Unknown")

    # ---------- DETAILED ENGLISH EXPLANATION ----------
    explanation_en = (
        f"The analysis of your genetic data focused on the gene {gene}, "
        f"which plays a role in how your body processes the drug {drug}. "
    )

    if phenotype == "Unknown":
        explanation_en += (
            "The available genetic information was insufficient to clearly "
            "classify your drug metabolism type. As a result, the risk level "
            "for this drug is marked as 'Unknown', and clinical guidelines "
            "recommend caution and professional consultation."
        )
    else:
        explanation_en += (
            f"Your genetic profile indicates a {phenotype} metabolizer status, "
            f"which results in a '{risk_label}' risk classification for this drug."
        )

    # ---------- SIMPLE SUMMARY (YOUR REQUEST) ----------
    summary = f"The drug {drug} has a {risk_label} risk based on your genetic profile."
    summary = translate_text(summary, language)

    # ---------- TRANSLATE FULL EXPLANATION ----------
    explanation_final = translate_text(explanation_en, language)

    # ---------- RETURN STRUCTURED OUTPUT ----------
    return {
        "summary": summary,                 # short & clean (frontend friendly)
        "detailed_explanation": explanation_final,  # long explainable AI text
        "language": language,
        "drug": drug,
        "gene": gene,
        "phenotype": phenotype,
        "risk": risk_label
    }