from database.models import AnalysisResult

def save_result(db, result_json):
    record = AnalysisResult(
        patient_id=result_json["patient_id"],
        drug=result_json["drug"],
        result=result_json
    )
    db.add(record)
    db.commit()
