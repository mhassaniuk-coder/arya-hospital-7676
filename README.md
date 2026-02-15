# NexusHealth HMS - Advanced AI-Powered Hospital Management System

![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A next-generation, AI-powered Hospital Management System designed to streamline clinical workflows, optimize resource allocation, and enhance patient care through intelligent decision support. Features **50 AI-powered capabilities** across 6 categories.

## Table of Contents

- [Live Demo](#-live-demo)
- [AI Features Overview](#-ai-features-overview)
- [Installation](#-installation--local-development)
- [API Configuration](#-api-configuration)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

## Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmhassaniuk-coder%2FArya-Hospital)

**[View Live Deployment](https://arya-hospital-7676-1oq1oqjxk-mhassaniuk-coders-projects.vercel.app)**

---

## AI Features Overview

NexusHealth HMS includes **50 AI-powered features** organized into 6 categories:

### Batch 1: Clinical AI Features (10 Features)

| Feature | Description | Component |
|---------|-------------|-----------|
| **AI Consultation** | Intelligent symptom analysis and differential diagnosis suggestions | `AIConsult.tsx` |
| **Drug Interaction Checker** | Real-time safety checks for medication prescriptions | `Pharmacy.tsx` |
| **Auto Discharge Summary** | Automated generation of comprehensive discharge reports | `AIDischargeFollowUp.tsx` |
| **Clinical Decision Support** | Evidence-based clinical recommendations at point-of-care | `AIConsult.tsx` |
| **Diagnostic Assistance** | AI-powered diagnostic suggestions based on symptoms and labs | `AIConsult.tsx` |
| **Treatment Recommendations** | Personalized treatment protocol suggestions | `AIConsult.tsx` |
| **Medical Code Suggestions** | Auto-suggestion of ICD-10/CPT codes for diagnoses | `Billing.tsx` |
| **Lab Result Interpretation** | AI analysis of laboratory results with clinical context | `LabManagement.tsx` |
| **Clinical Notes Summarization** | Automatic summarization of lengthy clinical notes | `PatientDetailDrawer.tsx` |
| **Medical Literature Search** | AI-powered search through medical literature and research | `ClinicalResearch.tsx` |

### Batch 2: Operational AI Features (10 Features)

| Feature | Description | Component |
|---------|-------------|-----------|
| **AI Appointment Scheduler** | Smart scheduling with conflict detection and optimization | `AIAppointmentScheduler.tsx` |
| **OPD Queue Optimization** | AI-driven queue management and patient flow optimization | `OPDQueue.tsx` |
| **Operating Room Scheduling** | Intelligent OT scheduling with resource allocation | `OTManagement.tsx` |
| **Inventory Forecasting** | Predictive inventory management for pharmacy and supplies | `Pharmacy.tsx` |
| **Staff Shift Optimization** | AI-powered shift scheduling based on workload patterns | `ShiftRoster.tsx` |
| **Asset Maintenance Prediction** | Predictive maintenance for medical equipment | `AssetManager.tsx` |
| **Bed Management AI** | Intelligent bed allocation and discharge planning | `BedManagement.tsx` |
| **Ambulance Dispatch AI** | Optimized ambulance dispatch and routing | `AmbulanceManager.tsx` |
| **Energy Optimization** | AI-driven facility energy management | `FacilityMaintenance.tsx` |
| **Waste Management AI** | Smart waste disposal scheduling and compliance tracking | `WasteManagement.tsx` |

### Batch 3: Administrative AI Features (10 Features)

| Feature | Description | Component |
|---------|-------------|-----------|
| **AI Billing Assistant** | Automated coding suggestions and billing optimization | `Billing.tsx` |
| **Insurance Claim Prediction** | Predict claim approval likelihood and optimize submissions | `InsuranceClaims.tsx` |
| **Revenue Cycle Analytics** | AI-powered revenue analysis and optimization | `Revenue.tsx` |
| **Audit Trail Analysis** | Intelligent audit log analysis for compliance | `AuditLogs.tsx` |
| **Compliance Monitoring** | Automated compliance checking and reporting | `Legal.tsx` |
| **HR Analytics** | AI-driven HR insights and workforce planning | `StaffDirectory.tsx` |
| **Training Recommendations** | Personalized staff training suggestions | `StaffTraining.tsx` |
| **Document Classification** | Automatic classification of administrative documents | `MedicalCertificates.tsx` |
| **Vendor Performance AI** | AI analysis of vendor performance and recommendations | `Procurement.tsx` |
| **Budget Forecasting** | Predictive budget planning and variance analysis | `Expenses.tsx` |

### Batch 4: Patient-Facing AI Features (7 Features)

| Feature | Description | Component |
|---------|-------------|-----------|
| **AI Symptom Checker** | Patient-facing symptom assessment tool | `AISymptomChecker.tsx` |
| **AI Health Chat Widget** | 24/7 AI health assistant for patient queries | `AIHealthChatWidget.tsx` |
| **AI Health Education** | Personalized health education content generator | `AIHealthEducation.tsx` |
| **AI Medication Reminder** | Smart medication reminder with interaction alerts | `AIMedicationReminder.tsx` |
| **AI Patient Feedback Analyzer** | Sentiment analysis of patient feedback | `AIPatientFeedbackAnalyzer.tsx` |
| **AI Discharge Follow-Up** | Automated post-discharge follow-up and monitoring | `AIDischargeFollowUp.tsx` |
| **Personalized Health Tips** | Daily personalized health recommendations | `AIHealthEducation.tsx` |

### Batch 5: Predictive Analytics AI Features (5 Features)

| Feature | Description | Component |
|---------|-------------|-----------|
| **Patient No-Show Prediction** | ML model predicting appointment no-shows | `AIAppointmentScheduler.tsx` |
| **Disease Outbreak Detection** | Early warning system for disease outbreaks | `Analytics.tsx` |
| **Patient Risk Stratification** | Risk scoring for patient populations | `Dashboard.tsx` |
| **Length of Stay Prediction** | Predict patient LOS for resource planning | `BedManagement.tsx` |
| **Readmission Risk Prediction** | Identify patients at risk of readmission | `AIDischargeFollowUp.tsx` |

### Batch 6: Medical Imaging AI Features (8 Features)

| Feature | Description | Component |
|---------|-------------|-----------|
| **AI X-Ray Analysis** | AI-assisted chest X-ray interpretation | `Radiology.tsx` |
| **AI CT Scan Analysis** | CT scan analysis with anomaly detection | `Radiology.tsx` |
| **AI MRI Analysis** | MRI scan interpretation assistance | `Radiology.tsx` |
| **AI Ultrasound Analysis** | Ultrasound image analysis | `Radiology.tsx` |
| **AI Mammography Analysis** | Mammography screening assistance | `Radiology.tsx` |
| **AI Retinal Image Analysis** | Diabetic retinopathy screening | `Radiology.tsx` |
| **AI Dermatology Analysis** | Skin lesion analysis and classification | `Radiology.tsx` |
| **AI Pathology Image Analysis** | Digital pathology analysis | `LabManagement.tsx` |

---

## Installation & Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mhassaniuk-coder/Arya-Hospital.git
   cd Arya-Hospital
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   
   > **Note**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open `http://localhost:5173` in your browser

---

## API Configuration

### Google Gemini API Setup

The AI features require a Google Gemini API key. Follow these steps:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### API Usage Notes

- The Gemini API has a free tier with generous limits
- Rate limiting is implemented to prevent API abuse
- Some features may have reduced functionality without a valid API key
- API calls are cached to improve performance and reduce costs

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4, Lucide React Icons |
| **State Management** | React Context API |
| **AI Integration** | Google Gemini API (@google/genai) |
| **Visualization** | Recharts |
| **Animations** | Framer Motion |

---

## Project Structure

```
nexushealth-hms/
|-- components/
|   |-- AIConsult.tsx              # AI Consultation
|   |-- AIAppointmentScheduler.tsx # AI Scheduling
|   |-- AIDischargeFollowUp.tsx    # Discharge AI
|   |-- AIHealthChatWidget.tsx     # Patient Chat AI
|   |-- AIHealthEducation.tsx      # Health Education AI
|   |-- AIMedicationReminder.tsx   # Medication AI
|   |-- AIPatientFeedbackAnalyzer.tsx # Feedback AI
|   |-- AISymptomChecker.tsx       # Symptom Checker
|   |-- AIFeaturesHub.tsx          # AI Features Hub
|   |-- Dashboard.tsx              # Main Dashboard
|   |-- OPDQueue.tsx               # OPD Management
|   |-- Pharmacy.tsx               # Pharmacy & Drug AI
|   |-- Radiology.tsx              # Imaging AI
|   |-- LabManagement.tsx          # Lab AI
|   |-- Billing.tsx                # Billing AI
|   |-- InsuranceClaims.tsx        # Insurance AI
|   |-- Revenue.tsx                # Revenue Analytics
|   |-- AuditLogs.tsx              # Audit AI
|   |-- PatientDetailDrawer.tsx    # Patient Details
|   |-- BedManagement.tsx         # Bed Management
|   |-- OTManagement.tsx          # OT Scheduling
|   |-- AmbulanceManager.tsx      # Ambulance Dispatch
|   |-- ShiftRoster.tsx           # Shift Management
|   |-- AssetManager.tsx          # Asset Management
|   |-- FacilityMaintenance.tsx   # Facility AI
|   |-- Housekeeping.tsx          # Housekeeping
|   |-- WasteManagement.tsx       # Waste Management
|   |-- ClinicalResearch.tsx      # Research AI
|   |-- Legal.tsx                 # Legal & Compliance
|   |-- StaffDirectory.tsx        # HR Management
|   |-- StaffTraining.tsx         # Training AI
|   |-- Procurement.tsx           # Procurement AI
|   |-- Expenses.tsx              # Budget AI
|   |-- MedicalCertificates.tsx   # Document AI
|   |-- Analytics.tsx             # Analytics Dashboard
|   |-- Sidebar.tsx               # Navigation
|   |-- LoginPage.tsx             # Authentication
|   |-- ... (other components)
|-- hooks/
|   |-- useAI.ts                  # AI Hook
|-- services/
|   |-- aiService.ts              # AI Service Layer
|   |-- geminiService.ts          # Gemini API Integration
|-- src/
|   |-- contexts/
|       |-- AuthContext.tsx       # Authentication Context
|       |-- DataContext.tsx       # Data Context
|       |-- ThemeContext.tsx      # Theme Context
|-- App.tsx                       # Main App Component
|-- types.ts                      # TypeScript Types
|-- README.md                     # Documentation
```

---

## Usage Guide

### Accessing AI Features

1. **Navigate to AI Tools** - Click "AI Tools" in the sidebar
2. **Browse Features** - View all 50 AI features in the hub
3. **Select a Feature** - Click on any feature card to access it
4. **Configure Settings** - Some features require additional input

### Role-Based Access

| Role | Access Level |
|------|-------------|
| **Admin** | Full access to all 50 AI features |
| **Doctor** | Clinical, Operational, and Patient AI features |
| **Nurse** | Clinical and Operational AI features |
| **Receptionist** | Scheduling and Patient AI features |
| **Pharmacist** | Pharmacy and Drug Interaction AI |
| **Lab Tech** | Lab and Imaging AI features |
| **Accountant** | Billing and Revenue AI features |
| **HR** | HR and Administrative AI features |

---

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- Google Gemini AI for powering the intelligent features
- React team for the amazing framework
- Tailwind CSS for the utility-first styling
- Lucide for the beautiful icons

---

**Developed by Mhassaniuk Coder**

*Last Updated: February 2026*
