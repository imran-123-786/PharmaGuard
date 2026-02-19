def generate_explanation(variants, drug, risk_result, language="en"):
    risk = risk_result["risk_assessment"]["risk_label"]
    gene = risk_result["pharmacogenomic_profile"].get("primary_gene", "Unknown")
    phenotype = risk_result["pharmacogenomic_profile"].get("phenotype", "Unknown")

    # ---------- ENGLISH ----------
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
            f"which results in a '{risk}' risk classification for this drug."
        )

    # ---------- SIMPLE MULTI-LANGUAGE SUPPORT ----------
    if language == "hi":
        return {
            "summary": f"दवा {drug} के लिए आपका जोखिम स्तर '{risk}' है। यह परिणाम आपके जीन {gene} के विश्लेषण पर आधारित है।"
        }

    if language == "kn":
        return {
            "summary": f"{drug} ಔಷಧಿಗೆ ನಿಮ್ಮ ಅಪಾಯ ಮಟ್ಟ '{risk}' ಆಗಿದೆ."
        }

    if language == "ta":
        return {
            "summary": f"{drug} மருந்திற்கு உங்கள் அபாய நிலை '{risk}' ஆகும்."
        }

    if language == "te":
        return {
            "summary": f"{drug} మందుకు మీ ప్రమాద స్థాయి '{risk}'."
        }

    # ---------- DEFAULT (ENGLISH) ----------
    return {
        "summary": explanation_en
    }
