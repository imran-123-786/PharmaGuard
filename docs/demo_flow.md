# PharmaGuard – Demo Flow (Selection Round)

This document explains the end-to-end demo flow of the PharmaGuard system for judges and evaluators.

---

## 1. User Authentication (MVP)

- User lands on the PharmaGuard dashboard.
- Login is demonstrated as a minimal account system.
- Purpose: to associate pharmacogenomic results with a specific user.

> Note: Authentication is implemented as an MVP for selection round demonstration.

---

## 2. VCF File Upload

- User uploads a genetic Variant Call Format (VCF) file.
- System validates:
  - File type (.vcf)
  - File structure
- Sample VCF is used for demonstration.

---

## 3. Drug Selection

- User selects a drug (e.g., Codeine, Clopidogrel, Warfarin).
- Drug selection determines which pharmacogenomic gene is evaluated.

---

## 4. Pharmacogenomic Analysis

The backend performs the following steps:

1. Parses the VCF file
2. Detects pharmacogenomic gene variants
3. Infers metabolizer phenotype
4. Applies CPIC-aligned rule-based logic
5. Computes:
   - Risk label
   - Severity
   - Confidence score

---

## 5. Explainable AI Layer

- LLM generates a human-readable explanation covering:
  - Gene function
  - Variant impact
  - Drug metabolism
  - Clinical recommendation
- Explanation can be generated in multiple languages.

---

## 6. Risk Visualization & Results Analysis

- Results are displayed with:
  - Color-coded risk indicator (Green / Yellow / Red)
  - Confidence percentage
  - Variant evidence table
  - Decision trace explaining how the risk was derived

---

## 7. Result Storage

- Final structured JSON output is stored in a relational SQL database.
- Enables audit trail and result reproducibility.

---

## 8. AI Chatbot Support (24/7)

- User can ask questions such as:
  - “Why is this drug risky?”
  - “What does this gene do?”
- Chatbot responds using LLM-based explanations.
- Supports multilingual queries.

---

## 9. Output & Completion

- System returns a strict JSON output matching the required schema.
- User can copy or download the result.

---

## Demo Conclusion

PharmaGuard demonstrates how explainable AI can transform complex genetic data into transparent, clinically actionable insights for safer drug prescribing.
