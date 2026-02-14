# Arya Hospital - Advanced Hospital Management System (HMS)

![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A next-generation, AI-powered Hospital Management System designed to streamline clinical workflows, optimize resource allocation, and enhance patient care through intelligent decision support.

## 🚀 Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmhassaniuk-coder%2FArya-Hospital)

**[View Live Deployment](https://arya-hospital.vercel.app)**
*(Note: If the live demo is not yet active, click the "Deploy with Vercel" button above to deploy your own instance instantly)*

*(Note: If the link above is not active, please check the repository description or releases for the latest deployment URL.)*

## ✨ Key Features

### 🤖 Clinical AI & Decision Support
- **AI Consultation**: Intelligent symptom analysis and differential diagnosis suggestions powered by Google Gemini AI.
- **Drug Interaction Check**: Real-time safety checks for medication prescriptions.
- **Auto-Discharge Summary**: Automated generation of comprehensive discharge reports.
- **Radiology AI**: AI-assisted analysis of X-rays and scans (Simulated/Integrated).

### 🏥 Core Hospital Operations
- **OPD & Triage Management**: Smart queue management with priority triage (Routine, Urgent, Emergency).
- **In-Patient Management**: Bed allocation, ward management, and patient tracking.
- **Resource Management**: 
  - **Ambulance Fleet**: Real-time tracking and dispatch.
  - **Blood Bank**: Inventory and donor management.
  - **Pharmacy & Inventory**: Stock tracking and automated reordering.

### 💼 Administrative Modules
- **HR & Payroll**: Staff directory, shift rostering, and leave management.
- **Billing & Insurance**: Automated invoicing and claims processing.
- **Analytics Dashboard**: Real-time insights into hospital performance and patient statistics.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Context API
- **AI Integration**: Google Gemini API (@google/genai)
- **Charts/Visualization**: Recharts

## 📦 Installation & Local Development

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
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Build for Production

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Developed by Mhassaniuk Coder**
