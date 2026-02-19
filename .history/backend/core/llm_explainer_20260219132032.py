import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_explanation(variants, drug, risk_result, language="en"):
    gene = risk_result["pharmacogenomic_profile"].get("primary_gene")

    prompt = f"""
Explain in {language}:
Gene: {gene}
Drug: {drug}
Risk: {risk_result['risk_assessment']['risk_label']}
Provide clinical explanation and recommendation.
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        text = response.choices[0].message.content
    except Exception:
        text = "Explanation unavailable."

    return {
        "summary": text
    }
