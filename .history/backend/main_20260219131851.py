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
    vcf_data = await file.read()
    parsed = parse_vcf(vcf_data.decode())

    risk_result = assess_risk(parsed, drug)
    explanation = generate_explanation(parsed, drug, risk_result, language)
    trace = build_decision_trace(parsed, drug, risk_result)

    response = FinalResponse(
        patient_id="PATIENT_001",
        drug=drug,
        timestamp=datetime.utcnow().isoformat(),
        risk_assessment=risk_result["risk_assessment"],
        pharmacogenomic_profile=risk_result["pharmacogenomic_profile"],
        clinical_recommendation=risk_result["clinical_recommendation"],
        llm_generated_explanation=explanation,
        decision_trace=trace,
        quality_metrics={"vcf_parsing_success": True}
    )

    db = SessionLocal()
    save_result(db, response.dict())
    db.close()

    return response
