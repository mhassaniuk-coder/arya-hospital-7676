import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Stethoscope,
  Pill,
  Calendar,
  MessageSquare,
  Heart,
  Activity,
  AlertTriangle,
  FileText,
  Users,
  Shield,
  TrendingUp,
  Scan,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Microscope,
  Image,
  Siren,
  BedDouble,
  FlaskConical,
  Scissors,
  Truck,
  Wrench,
  CreditCard,
  Scale,
  GraduationCap,
  Video,
  Syringe,
  Droplet,
  Accessibility,
  Radio,
  Trash2,
  UtensilsCrossed,
  Coffee,
  Brush,
  Hammer,
  Shirt,
  Headphones,
  Car,
  UserCog,
  DollarSign,
  UserPlus,
  Receipt,
  PiggyBank,
  ShoppingBag,
  Building2,
  LifeBuoy,
  Ticket,
  PartyPopper,
  FileWarning,
  HelpCircle,
  Book,
  Share2,
  FileBadge,
  ScrollText,
  ShieldCheck,
  Move,
  Flame,
  Baby,
  Skull,
  LayoutDashboard,
  Search,
  Filter,
  Grid,
  List,
  Info
} from 'lucide-react';

interface AIFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'planned';
  component?: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

const aiFeatures: AIFeature[] = [
  // Batch 1: Clinical AI Features (10 features)
  {
    id: 'ai-triage',
    name: 'AI-Powered Triage Assistant',
    description: 'Intelligent patient triage system that analyzes symptoms, vital signs, and medical history to assign urgency levels.',
    category: 'Clinical AI',
    status: 'active',
    component: 'OPDQueue',
    icon: <Siren size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-dosage',
    name: 'Smart Medication Dosage Calculator',
    description: 'AI-powered dosage calculator considering patient weight, age, kidney function, and drug interactions.',
    category: 'Clinical AI',
    status: 'active',
    component: 'Pharmacy',
    icon: <Pill size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-cdss',
    name: 'Clinical Decision Support System',
    description: 'Real-time clinical decision support analyzing patient data against medical guidelines.',
    category: 'Clinical AI',
    status: 'active',
    component: 'AIConsult',
    icon: <Stethoscope size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-scribe',
    name: 'AI-Enhanced Medical Scribe',
    description: 'Voice-to-text system with medical terminology recognition and SOAP note structuring.',
    category: 'Clinical AI',
    status: 'active',
    component: 'AIConsult',
    icon: <FileText size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-allergy',
    name: 'Intelligent Allergy & Contraindication Alert',
    description: 'Proactive alert system cross-referencing medications with patient allergies and conditions.',
    category: 'Clinical AI',
    status: 'active',
    component: 'Pharmacy',
    icon: <Shield size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-lab-interpret',
    name: 'AI-Powered Lab Result Interpretation',
    description: 'Intelligent analysis of lab results with automatic flagging of abnormalities and trend analysis.',
    category: 'Clinical AI',
    status: 'active',
    component: 'LabManagement',
    icon: <FlaskConical size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-treatment-plan',
    name: 'Smart Treatment Plan Generator',
    description: 'AI system generating personalized treatment plans based on diagnosis and guidelines.',
    category: 'Clinical AI',
    status: 'active',
    component: 'AIConsult',
    icon: <Heart size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-differential',
    name: 'AI-Powered Differential Diagnosis Engine',
    description: 'Enhanced differential diagnosis considering rare diseases and epidemiology.',
    category: 'Clinical AI',
    status: 'active',
    component: 'AIConsult',
    icon: <Brain size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-vitals',
    name: 'Intelligent Vital Signs Monitoring',
    description: 'AI analysis of vital signs trends to detect early deterioration and sepsis risk.',
    category: 'Clinical AI',
    status: 'active',
    component: 'BedManagement',
    icon: <Activity size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-sepsis',
    name: 'Sepsis Early Warning System',
    description: 'AI-powered early detection of sepsis risk using clinical parameters and trends.',
    category: 'Clinical AI',
    status: 'active',
    component: 'Dashboard',
    icon: <AlertTriangle size={20} />,
    priority: 'high'
  },

  // Batch 2: Operational AI Features (10 features)
  {
    id: 'ai-appointment',
    name: 'AI Appointment Scheduler',
    description: 'Smart appointment scheduling optimizing provider time and patient convenience.',
    category: 'Operational AI',
    status: 'active',
    component: 'AIAppointmentScheduler',
    icon: <Calendar size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-discharge',
    name: 'AI Discharge Planning & Follow-Up',
    description: 'Automated discharge planning with follow-up scheduling and patient education.',
    category: 'Operational AI',
    status: 'active',
    component: 'AIDischargeFollowUp',
    icon: <CheckCircle2 size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-bed-management',
    name: 'Predictive Bed Management',
    description: 'AI prediction of bed availability and optimal patient placement.',
    category: 'Operational AI',
    status: 'active',
    component: 'BedManagement',
    icon: <BedDouble size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-ot-scheduling',
    name: 'Smart OT Scheduling',
    description: 'AI-optimized operating theater scheduling and resource allocation.',
    category: 'Operational AI',
    status: 'active',
    component: 'OTManagement',
    icon: <Scissors size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-ambulance',
    name: 'AI Ambulance Dispatch',
    description: 'Intelligent ambulance dispatch with route optimization and ETA prediction.',
    category: 'Operational AI',
    status: 'active',
    component: 'AmbulanceManager',
    icon: <Truck size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-inventory',
    name: 'AI Inventory Management',
    description: 'Predictive inventory management for pharmacy and supplies.',
    category: 'Operational AI',
    status: 'active',
    component: 'Pharmacy',
    icon: <ShoppingBag size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-staffing',
    name: 'AI Staffing Optimization',
    description: 'AI-powered staff scheduling based on patient volume predictions.',
    category: 'Operational AI',
    status: 'active',
    component: 'ShiftRoster',
    icon: <Users size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-maintenance',
    name: 'Predictive Maintenance',
    description: 'AI prediction of equipment maintenance needs before failures.',
    category: 'Operational AI',
    status: 'active',
    component: 'FacilityMaintenance',
    icon: <Wrench size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-waste',
    name: 'AI Waste Management Optimization',
    description: 'Smart bio-medical waste tracking and disposal optimization.',
    category: 'Operational AI',
    status: 'active',
    component: 'WasteManagement',
    icon: <Trash2 size={20} />,
    priority: 'low'
  },
  {
    id: 'ai-housekeeping',
    name: 'AI Housekeeping Scheduler',
    description: 'Intelligent housekeeping task scheduling and resource allocation.',
    category: 'Operational AI',
    status: 'active',
    component: 'Housekeeping',
    icon: <Brush size={20} />,
    priority: 'low'
  },

  // Batch 3: Administrative AI Features (10 features)
  {
    id: 'ai-billing',
    name: 'AI Billing Optimization',
    description: 'Automated billing code suggestion and claim optimization.',
    category: 'Administrative AI',
    status: 'active',
    component: 'Billing',
    icon: <CreditCard size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-insurance',
    name: 'AI Insurance Claim Processing',
    description: 'Intelligent insurance claim validation and processing assistance.',
    category: 'Administrative AI',
    status: 'active',
    component: 'InsuranceClaims',
    icon: <ShieldCheck size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-compliance',
    name: 'AI Compliance Monitoring',
    description: 'Automated compliance checking and regulatory reporting assistance.',
    category: 'Administrative AI',
    status: 'active',
    component: 'AuditLogs',
    icon: <Scale size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-audit',
    name: 'AI Audit Trail Analysis',
    description: 'Intelligent analysis of audit logs for anomaly detection.',
    category: 'Administrative AI',
    status: 'active',
    component: 'AuditLogs',
    icon: <ScrollText size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-feedback',
    name: 'AI Patient Feedback Analyzer',
    description: 'Sentiment analysis and insights from patient feedback.',
    category: 'Administrative AI',
    status: 'active',
    component: 'AIPatientFeedbackAnalyzer',
    icon: <MessageSquare size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-revenue',
    name: 'AI Revenue Cycle Management',
    description: 'AI-powered revenue optimization and financial forecasting.',
    category: 'Administrative AI',
    status: 'active',
    component: 'Revenue',
    icon: <PiggyBank size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-procurement',
    name: 'AI Procurement Optimization',
    description: 'Smart procurement recommendations and vendor analysis.',
    category: 'Administrative AI',
    status: 'active',
    component: 'Procurement',
    icon: <ShoppingBag size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-legal',
    name: 'AI Legal Document Analysis',
    description: 'AI assistance for legal and MLC document preparation.',
    category: 'Administrative AI',
    status: 'active',
    component: 'Legal',
    icon: <Scale size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-training',
    name: 'AI Training Recommendations',
    description: 'Personalized staff training recommendations based on performance.',
    category: 'Administrative AI',
    status: 'active',
    component: 'StaffTraining',
    icon: <GraduationCap size={20} />,
    priority: 'low'
  },
  {
    id: 'ai-recruitment',
    name: 'AI Recruitment Assistant',
    description: 'AI-powered candidate screening and recruitment assistance.',
    category: 'Administrative AI',
    status: 'active',
    component: 'Recruitment',
    icon: <UserPlus size={20} />,
    priority: 'low'
  },

  // Batch 4: Patient-Facing AI Features (7 features)
  {
    id: 'ai-symptom-checker',
    name: 'AI Symptom Checker',
    description: 'Patient-facing symptom analysis and care recommendations.',
    category: 'Patient-Facing AI',
    status: 'active',
    component: 'AISymptomChecker',
    icon: <Search size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-health-chat',
    name: 'AI Health Chat Widget',
    description: '24/7 AI-powered health chat assistant for patients.',
    category: 'Patient-Facing AI',
    status: 'active',
    component: 'AIHealthChatWidget',
    icon: <MessageSquare size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-med-reminder',
    name: 'AI Medication Reminder',
    description: 'Smart medication reminders with adherence tracking.',
    category: 'Patient-Facing AI',
    status: 'active',
    component: 'AIMedicationReminder',
    icon: <Syringe size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-health-education',
    name: 'AI Health Education',
    description: 'Personalized health education content recommendations.',
    category: 'Patient-Facing AI',
    status: 'active',
    component: 'AIHealthEducation',
    icon: <Book size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-telemedicine',
    name: 'AI Telemedicine Assistant',
    description: 'AI-enhanced telemedicine consultations with pre-screening.',
    category: 'Patient-Facing AI',
    status: 'active',
    component: 'Telemedicine',
    icon: <Video size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-referral',
    name: 'AI Referral Suggestions',
    description: 'Smart referral recommendations based on patient needs.',
    category: 'Patient-Facing AI',
    status: 'active',
    component: 'ReferralSystem',
    icon: <Share2 size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-certificates',
    name: 'AI Medical Certificate Generator',
    description: 'Automated medical certificate generation with AI assistance.',
    category: 'Patient-Facing AI',
    status: 'active',
    component: 'MedicalCertificates',
    icon: <FileBadge size={20} />,
    priority: 'medium'
  },

  // Batch 5: Predictive Analytics AI Features (5 features)
  {
    id: 'ai-readmission',
    name: 'Readmission Risk Predictor',
    description: 'AI prediction of 30-day readmission risk for discharge planning.',
    category: 'Predictive Analytics',
    status: 'active',
    component: 'Dashboard',
    icon: <TrendingUp size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-outbreak',
    name: 'Disease Outbreak Detection',
    description: 'AI-powered early detection of disease outbreaks from patient data.',
    category: 'Predictive Analytics',
    status: 'active',
    component: 'Dashboard',
    icon: <AlertTriangle size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-mortality',
    name: 'Mortality Risk Predictor',
    description: 'AI prediction of mortality risk for critical care patients.',
    category: 'Predictive Analytics',
    status: 'active',
    component: 'BedManagement',
    icon: <Activity size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-length-stay',
    name: 'Length of Stay Predictor',
    description: 'AI prediction of patient length of stay for resource planning.',
    category: 'Predictive Analytics',
    status: 'active',
    component: 'BedManagement',
    icon: <Clock size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-census',
    name: 'Patient Census Forecasting',
    description: 'AI forecasting of patient volume for capacity planning.',
    category: 'Predictive Analytics',
    status: 'active',
    component: 'Dashboard',
    icon: <Users size={20} />,
    priority: 'medium'
  },

  // Batch 6: Medical Imaging AI Features (8 features)
  {
    id: 'ai-xray',
    name: 'AI X-Ray Analysis',
    description: 'AI-powered chest X-ray analysis for abnormality detection.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'Radiology',
    icon: <Scan size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-ct-scan',
    name: 'AI CT Scan Analysis',
    description: 'AI analysis of CT scans for lesion detection and characterization.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'Radiology',
    icon: <Scan size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-mri',
    name: 'AI MRI Analysis',
    description: 'AI-powered MRI analysis for neurological and musculoskeletal conditions.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'Radiology',
    icon: <Image size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-ultrasound',
    name: 'AI Ultrasound Analysis',
    description: 'AI analysis of ultrasound images for obstetric and abdominal screening.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'Radiology',
    icon: <Activity size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-mammography',
    name: 'AI Mammography Analysis',
    description: 'AI-powered mammogram analysis for breast cancer screening.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'Radiology',
    icon: <Target size={20} />,
    priority: 'high'
  },
  {
    id: 'ai-dermatology',
    name: 'AI Dermatology Image Analysis',
    description: 'AI analysis of skin lesion images for dermatological conditions.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'AIConsult',
    icon: <Scan size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-retinal',
    name: 'AI Retinal Image Analysis',
    description: 'AI-powered retinal image analysis for diabetic retinopathy screening.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'Radiology',
    icon: <Target size={20} />,
    priority: 'medium'
  },
  {
    id: 'ai-pathology',
    name: 'AI Pathology Image Analysis',
    description: 'AI analysis of pathology slides for cancer detection.',
    category: 'Medical Imaging AI',
    status: 'active',
    component: 'LabManagement',
    icon: <Microscope size={20} />,
    priority: 'high'
  }
];

// Eye icon component since it's not in the import list
const Eye = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

interface AIFeaturesHubProps {
  onNavigate?: (tab: string) => void;
}

const AIFeaturesHub: React.FC<AIFeaturesHubProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null);

  const categories = [...new Set(aiFeatures.map(f => f.category))];

  const filteredFeatures = aiFeatures.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: AIFeature['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'beta': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'planned': return 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority: AIFeature['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Clinical AI': 'from-blue-500 to-blue-600',
      'Operational AI': 'from-purple-500 to-purple-600',
      'Administrative AI': 'from-orange-500 to-orange-600',
      'Patient-Facing AI': 'from-green-500 to-green-600',
      'Predictive Analytics': 'from-pink-500 to-pink-600',
      'Medical Imaging AI': 'from-cyan-500 to-cyan-600',
    };
    return colors[category] || 'from-slate-500 to-slate-600';
  };

  const handleFeatureClick = (feature: AIFeature) => {
    if (onNavigate && feature.component) {
      // Map component names to tab IDs
      const componentToTab: Record<string, string> = {
        'AIConsult': 'clinical-ai',
        'AIAppointmentScheduler': 'ai-appointment-scheduler',
        'AIDischargeFollowUp': 'ai-discharge-followup',
        'AIHealthChatWidget': 'ai-health-chat',
        'AIHealthEducation': 'ai-health-education',
        'AIMedicationReminder': 'ai-med-reminder',
        'AIPatientFeedbackAnalyzer': 'ai-feedback-analyzer',
        'AISymptomChecker': 'ai-symptom-checker',
        'Dashboard': 'dashboard',
        'OPDQueue': 'opd-queue',
        'Pharmacy': 'pharmacy',
        'BedManagement': 'beds',
        'OTManagement': 'ot',
        'AmbulanceManager': 'ambulance',
        'ShiftRoster': 'roster',
        'FacilityMaintenance': 'facility',
        'WasteManagement': 'waste',
        'Housekeeping': 'housekeeping',
        'Billing': 'billing',
        'InsuranceClaims': 'insurance',
        'AuditLogs': 'audit',
        'Revenue': 'revenue',
        'Procurement': 'procurement',
        'Legal': 'legal',
        'StaffTraining': 'training',
        'Recruitment': 'recruitment',
        'Telemedicine': 'telemedicine',
        'ReferralSystem': 'referrals',
        'MedicalCertificates': 'certificates',
        'Radiology': 'radiology',
        'LabManagement': 'lab',
      };
      
      const tabId = componentToTab[feature.component] || 'dashboard';
      onNavigate(tabId);
    }
  };

  const featureCounts = categories.map(cat => ({
    name: cat,
    count: aiFeatures.filter(f => f.category === cat).length,
    activeCount: aiFeatures.filter(f => f.category === cat && f.status === 'active').length
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/20">
            <Brain size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">AI Features Hub</h1>
            <p className="text-slate-500 dark:text-slate-400">50 AI-powered features across 6 categories</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {featureCounts.map((cat) => (
          <motion.div
            key={cat.name}
            className={`p-4 rounded-xl bg-gradient-to-br ${getCategoryColor(cat.name)} text-white shadow-lg`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
          >
            <div className="text-2xl font-bold">{cat.activeCount}/{cat.count}</div>
            <div className="text-xs opacity-80 truncate">{cat.name.replace(' AI', '')}</div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search AI features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg hover:border-teal-500/50 transition-all cursor-pointer"
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(feature.category)} text-white`}>
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(feature.priority)}`} title={`${feature.priority} priority`} />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{feature.category}</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer"
                onClick={() => handleFeatureClick(feature)}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(feature.category)} text-white shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 dark:text-white truncate">{feature.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{feature.description}</p>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{feature.category}</div>
                <ChevronRight size={16} className="text-slate-400 shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <Brain size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">No features found</h3>
          <p className="text-slate-500 dark:text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedFeature.category)} text-white`}>
                  {selectedFeature.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedFeature.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(selectedFeature.status)}`}>
                      {selectedFeature.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{selectedFeature.category}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{selectedFeature.description}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <Info size={16} />
                <span>Component: {selectedFeature.component || 'Integrated'}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleFeatureClick(selectedFeature)}
                  className="flex-1 py-2 px-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
                >
                  Open Feature
                </button>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="py-2 px-4 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="text-teal-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">AI-Powered Healthcare</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All 50 AI features are powered by Google Gemini AI, providing intelligent assistance across clinical, operational, administrative, and patient-facing workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesHub;