from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from core.vcf_parser import parse_vcf
from core.risk_engine import assess_risk
from core.llm_explainer import generate_explanation
from core.decision_trace import build_decision_trace
from core.schema import FinalResponse

from database.db import SessionLocal
from database.crud import save_result

app = FastAPI(title="PharmaGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=FinalResponse)
async def analyze_vcf(
    file: UploadFile = File(...),
    drug: str = Form(...),
    language: str = Form("en")
):
    try:
        # 1️⃣ Read file safely
        raw_bytes = await file.read()
        text = raw_bytes.decode("utf-8", errors="ignore")

        # 2️⃣ Parse VCF (FAIL-SAFE)
        try:
            parsed = parse_vcf(text)
            if not parsed:
                parsed = []
        except Exception as e:
            print("VCF parsing error:", e)
            parsed = []

        # 3️⃣ Risk assessment (NEVER FAIL)
        risk_result = assess_risk(parsed, drug)

        # 4️⃣ LLM explanation (SAFE FALLBACK)
        try:
            explanation = generate_explanation(
                parsed, drug, risk_result, language
            )
        except Exception as e:
            print("LLM error:", e)
            explanation = {
                "summary": f"The drug {drug} has a {risk_result['risk_assessment']['risk_label']} risk based on available genetic information."
            }

        # 5️⃣ Decision trace (SAFE)
        try:
            trace = build_decision_trace(parsed, drug, risk_result)
        except Exception:
            trace = [
                "VCF uploaded",
                f"Drug selected: {drug}",
                "Risk analysis completed"
            ]

        # 6️⃣ Final response (ALWAYS COMPLETE)
        response = FinalResponse(
            patient_id="PATIENT_001",
            drug=drug,
            timestamp=datetime.utcnow().isoformat(),
            risk_assessment=risk_result["risk_assessment"],
            pharmacogenomic_profile=risk_result["pharmacogenomic_profile"],
            clinical_recommendation=risk_result["clinical_recommendation"],
            llm_generated_explanation=explanation,
            decision_trace=trace,
            quality_metrics={
                "vcf_parsing_success": True if parsed else False
            }
        )

        # 7️⃣ Save to DB (NON-BLOCKING)
        try:
            db = SessionLocal()
            save_result(db, response.dict())
            db.close()
        except Exception as e:
            print("DB save error:", e)

        return response

    except Exception as e:
        print("❌ ANALYZE PIPELINE FAILED:", e)

        # Absolute fallback (frontend-safe)
        return FinalResponse(
            patient_id="UNKNOWN",
            drug=drug,
            timestamp=datetime.utcnow().isoformat(),
            risk_assessment={
                "risk_label": "Unknown",
                "severity": "low",
                "confidence_score": 0.3
            },
            pharmacogenomic_profile={},
            clinical_recommendation={
                "action": "Unknown",
                "note": "Analysis failed"
            },
            llm_generated_explanation={
                "summary": "Unable to analyze the uploaded VCF file."
            },
            decision_trace=["System error occurred"],
            quality_metrics={"vcf_parsing_success": False}
        )
