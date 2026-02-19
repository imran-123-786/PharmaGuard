from pydantic import BaseModel
from typing import List, Dict, Any

class RiskAssessment(BaseModel):
    risk_label: str
    confidence_score: float
    severity: str

class PGxProfile(BaseModel):
    primary_gene: str | None = None
    diplotype: str | None = None
    phenotype: str | None = None
    detected_variants: List[Dict[str, Any]] = []

class FinalResponse(BaseModel):
    patient_id: str
    drug: str
    timestamp: str
    risk_assessment: RiskAssessment
    pharmacogenomic_profile: PGxProfile
    clinical_recommendation: Dict[str, Any]
    llm_generated_explanation: Dict[str, Any]
    decision_trace: List[str]
    quality_metrics: Dict[str, Any]
