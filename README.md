🧬 PharmaGuard – AI-Powered Pharmacogenomics Decision Support System

PharmaGuard is an AI-driven precision medicine platform that analyzes pharmacogenomic VCF data to predict drug safety, dosage requirements, adverse reactions, and alternative therapies based on a patient’s genetic profile.

The system converts raw genetic variants (STAR alleles & genotypes) into explainable, actionable clinical insights, helping clinicians and patients make safer drug decisions.


🚨 Problem Statement
Adverse Drug Reactions (ADRs) are a major cause of hospitalization and mortality worldwide.
Many ADRs occur because genetic differences affect how patients metabolize drugs, but this information is rarely used in routine prescribing.
Goal:
Build a system that:
Accepts genomic VCF data
Identifies gene–drug interactions
Predicts risk, dosage adjustments, and safer alternatives
Presents results in a clear, explainable, and multilingual UI


💡 Solution Overview
PharmaGuard processes clinically relevant pharmacogenomic genes such as:
CYP2D6

CYP2C19

CYP2C9

SLCO1B1

TPMT

DPYD
Using rule-based pharmacogenomics logic (CPIC-aligned), the system determines:
Drug safety level
Dosage recommendations
Potential adverse symptoms
Recommended actions if the drug is already taken
Alternative drugs with lower genetic risk
All results are visualized using an intuitive dashboard with charts, tables, and explainable summaries.

🧠 Key Features

🔬 Genetic Drug Risk Analysis
Upload .vcf pharmacogenomic files
STAR allele & genotype interpretation
Risk classification:
Safe
Adjust Dosage
Toxic
Unknown

🧪 Drug Sensitivity Index (DSI)
Converts genetic metabolizer status into a risk percentage
Helps compare drug safety at a glance
Fully explainable & guideline-based

⚠️ Symptoms & Actions (If Already Taken)
Predicts possible adverse symptoms
Suggests immediate clinical actions
Activated automatically for risky cases

💊 Alternative Drug & Dosage Recommendations
Suggests genetically safer alternatives
Displays dosage guidance
CPIC-aligned clinical advice

📊 Visual Analytics
Bar chart: Risk confidence
Pie chart: Risk category distribution
Color-coded severity indicators

🌍 Multilingual Support
Full UI translation using Google Translate
Support:
English
Hindi
Kannada
Tamil
Telugu



🔐 Secure Login (Demo Mode)
Controlled dashboard access
Prevents unauthorized analysis


Demo Credentials
Email: demo@pharmaguard.ai
Password: pharmaguard123


📋 Structured JSON Report
Machine-readable clinical output
Copy-to-Clipboard (CTC)
Downloadable JSON repor


🧾 Audit & Explainability
Decision trace for every analysis
No raw genome storage
Explainable, transparent logic

🧱 Tech Stack
Frontend
HTML5
CSS3
JavaScript (Vanilla)
Chart.js
Google Translate Widget


Backend
Python
FastAPI
Rule-based Pharmacogenomics Engine
Data
VCF v4.2
STAR Allele Annotations
CPIC-inspired rules


📁 Project Structure
pharmaGuard/
│
├── backend/
│   ├── core/
│   │   ├── risk_engine.py
│   │   ├── vcf_parser.py
│   │   ├── llm_explainer.py
│   │
│   ├── data/
│   │   ├── pharmaco_rules.json
│   │   ├── language_map.json
│   │
│   └── main.py
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │
│   └── index.html
│
├── .gitignore
├── README.md

▶️ How to Run the Project
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at:
http://127.0.0.1:8000

Frontend
Open frontend/index.html in browser
OR
Use Live Server in VS Code


🧪 Sample Input
The system supports .vcf files containing:
GENE
STAR allele
Genotype (GT)
Example:GENE=CYP2D6; STAR=*4; GT=0/1


🏥 Clinical Disclaimer

PharmaGuard is a clinical decision-support tool.
Final prescribing decisions must be made by qualified healthcare professionals.


📌 Future Enhancements
PDF clinical report export
EHR integration
Gene-level heatmap
ML-based sensitivity refinement
Mobile application
