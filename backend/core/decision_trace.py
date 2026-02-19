def build_decision_trace(variants, drug, risk):
    return [
        f"Drug selected: {drug}",
        f"Gene detected: {risk['pharmacogenomic_profile'].get('primary_gene')}",
        f"Phenotype inferred: {risk['pharmacogenomic_profile'].get('phenotype')}",
        f"Final risk decision: {risk['risk_assessment']['risk_label']}"
    ]
