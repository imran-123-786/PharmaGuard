from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime
from database.db import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    id = Column(Integer, primary_key=True)
    patient_id = Column(String)
    drug = Column(String)
    result = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
