import React, { useState } from 'react';
import {
  FlaskConical, Plus, Search, FileText, CheckCircle, Clock,
  AlertCircle, Brain, Sparkles, Loader2, TrendingUp, TrendingDown,
  Activity, ChevronDown, ChevronUp, AlertTriangle, Heart, Upload,
  Zap, Battery, Gauge, Stethoscope, ClipboardList
} from 'lucide-react';
import { useLabInterpretation } from '../hooks/useAI';
import { LabInterpretationResult, ECGAnalysisResult } from '../types';
import { analyzeECG } from '../services/aiService';

interface LabTest {
  id: string;
  patientName: string;
  testName: string;
  doctorName: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Critical';
  priority: 'Routine' | 'Urgent';
  result?: string;
  unit?: string;
  referenceRange?: string;
}

const LabManagement: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>([
    { id: 'LAB-001', patientName: 'John Doe', testName: 'Complete Blood Count (CBC)', doctorName: 'Dr. Smith', date: '2024-03-15', status: 'Completed', priority: 'Routine', result: 'Normal', unit: '', referenceRange: 'Standard' },
    { id: 'LAB-002', patientName: 'Jane Smith', testName: 'Lipid Profile', doctorName: 'Dr. Chen', date: '2024-03-15', status: 'Processing', priority: 'Routine' },
    { id: 'LAB-003', patientName: 'Robert Brown', testName: 'Troponin I', doctorName: 'Dr. Wilson', date: '2024-03-15', status: 'Critical', priority: 'Urgent', result: '2.5', unit: 'ng/mL', referenceRange: '<0.04' },
    { id: 'LAB-004', patientName: 'Emily Davis', testName: 'Thyroid Panel', doctorName: 'Dr. White', date: '2024-03-15', status: 'Pending', priority: 'Routine' },
    { id: 'LAB-005', patientName: 'Michael Johnson', testName: 'Hemoglobin A1c', doctorName: 'Dr. Garcia', date: '2024-03-15', status: 'Completed', priority: 'Routine', result: '7.2', unit: '%', referenceRange: '4.0-5.6' },
    { id: 'LAB-006', patientName: 'Sarah Wilson', testName: 'Fasting Glucose', doctorName: 'Dr. Lee', date: '2024-03-15', status: 'Completed', priority: 'Routine', result: '145', unit: 'mg/dL', referenceRange: '70-100' },
  ]);

  const [showAddTest, setShowAddTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [interpretationInput, setInterpretationInput] = useState({
    patientAge: '',
    patientGender: 'Male',
    clinicalContext: ''
  });

  const { data: interpretationResult, loading: interpretationLoading, execute: interpretLab } = useLabInterpretation();

  // ECG Analysis State
  const [showECGAnalysis, setShowECGAnalysis] = useState(false);
  const [ecgImage, setEcgImage] = useState<string | null>(null);
  const [ecgPatientInfo, setEcgPatientInfo] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    clinicalContext: ''
  });
  const [ecgAnalysisResult, setEcgAnalysisResult] = useState<ECGAnalysisResult | null>(null);
  const [ecgLoading, setEcgLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'lab' | 'ecg'>('lab');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success-light text-success-dark';
      case 'Processing': return 'bg-info-light text-info-dark';
      case 'Pending': return 'bg-warning-light text-warning-dark';
      case 'Critical': return 'bg-danger-light text-danger-dark animate-pulse';
      default: return 'bg-background-secondary text-foreground-secondary';
    }
  };

  const handleInterpretLab = async (test: LabTest) => {
    if (!test.result) return;

    setSelectedTest(test);
    await interpretLab({
      testName: test.testName,
      result: test.result,
      unit: test.unit,
      referenceRange: test.referenceRange ? {
        low: parseFloat(test.referenceRange.split('-')[0]) || 0,
        high: parseFloat(test.referenceRange.split('-')[1]) || 0
      } : undefined,
      patientAge: interpretationInput.patientAge ? parseInt(interpretationInput.patientAge) : undefined,
      patientGender: interpretationInput.patientGender,
      clinicalContext: interpretationInput.clinicalContext || undefined
    });
  };

  // ECG Analysis Handlers
  const handleECGImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEcgImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeECG = async () => {
    if (!ecgImage) return;

    setEcgLoading(true);
    try {
      const response = await analyzeECG({
        ecgData: ecgImage,
        leadConfiguration: '12-lead',
        patientInfo: {
          age: ecgPatientInfo.patientAge ? parseInt(ecgPatientInfo.patientAge) : undefined,
          gender: ecgPatientInfo.patientGender,
          symptoms: ecgPatientInfo.clinicalContext ? [ecgPatientInfo.clinicalContext] : undefined
        }
      });
      setEcgAnalysisResult(response.data);
    } catch (error) {
      console.error('ECG analysis error:', error);
    } finally {
      setEcgLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-success-dark bg-success-light';
    if (confidence >= 0.7) return 'text-info-dark bg-info-light';
    if (confidence >= 0.5) return 'text-warning-dark bg-warning-light';
    return 'text-danger-dark bg-danger-light';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-light text-danger-dark border-red-200 dark:border-red-800';
      case 'high': return 'bg-warning-light text-warning-dark border-orange-200 dark:border-orange-800';
      case 'moderate': return 'bg-warning-light text-warning-dark border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-success-light text-success-dark border-green-200 dark:border-green-800';
      default: return 'bg-background-secondary text-foreground-secondary border-border';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Laboratory & Pathology</h1>
          <p className="text-foreground-secondary">AI-powered lab management and result interpretation.</p>
        </div>
        <button
          onClick={() => setShowAddTest(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 theme-transition"
        >
          <Plus size={18} /> New Test Request
        </button>
      </div>

      {/* AI Feature Banner */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800 rounded-xl p-4 flex items-center gap-4">
        <div className="bg-cyan-100 dark:bg-cyan-900/50 p-3 rounded-full">
          <Brain className="text-cyan-600 dark:text-cyan-400" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100">AI-Powered Lab Interpretation & ECG Analysis</h3>
          <p className="text-sm text-cyan-700 dark:text-cyan-300">Get intelligent analysis of lab results and ECG with clinical significance and recommendations</p>
        </div>
        <span className="px-2 py-1 bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 text-xs font-bold rounded-full flex items-center gap-1">
          <Sparkles size={10} /> AI-Assisted
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px theme-transition ${activeTab === 'lab'
            ? 'text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400'
            : 'text-foreground-muted border-transparent hover:text-foreground-primary'
            }`}
        >
          <FlaskConical size={16} className="inline mr-2" />
          Lab Tests
        </button>
        <button
          onClick={() => setActiveTab('ecg')}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px theme-transition ${activeTab === 'ecg'
            ? 'text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400'
            : 'text-foreground-muted border-transparent hover:text-foreground-primary'
            }`}
        >
          <Heart size={16} className="inline mr-2" />
          ECG Analysis
          <span className="ml-2 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-full flex items-center gap-1">
            <Sparkles size={8} /> AI
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-info-light text-info-dark rounded-lg"><FlaskConical size={24} /></div>
            <div>
              <p className="text-sm text-foreground-secondary font-medium">Total Requests</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{tests.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-light text-warning-dark rounded-lg"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-foreground-secondary font-medium">Pending</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{tests.filter(t => t.status === 'Pending').length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-light text-success-dark rounded-lg"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm text-foreground-secondary font-medium">Completed</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{tests.filter(t => t.status === 'Completed').length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-danger-light text-danger-dark rounded-lg"><AlertCircle size={24} /></div>
            <div>
              <p className="text-sm text-foreground-secondary font-medium">Critical Results</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{tests.filter(t => t.status === 'Critical').length}</h3>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lab Tests Table */}
          <div className="lg:col-span-2 bg-background-elevated rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search by patient or test ID..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary placeholder:text-foreground-muted theme-transition"
                />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-background-tertiary border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold text-foreground-secondary">Test ID</th>
                  <th className="px-6 py-4 font-semibold text-foreground-secondary">Patient Name</th>
                  <th className="px-6 py-4 font-semibold text-foreground-secondary">Test Name</th>
                  <th className="px-6 py-4 font-semibold text-foreground-secondary">Status</th>
                  <th className="px-6 py-4 font-semibold text-foreground-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-background-secondary transition-colors">
                    <td className="px-6 py-4 font-mono text-foreground-secondary text-sm">{test.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground-primary">{test.patientName}</td>
                    <td className="px-6 py-4 text-foreground-secondary">
                      {test.testName}
                      {test.priority === 'Urgent' && <span className="ml-2 px-2 py-0.5 bg-danger-light text-danger-dark text-[10px] font-bold rounded-full uppercase">Urgent</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {test.status === 'Completed' || test.status === 'Critical' ? (
                        <div className="flex items-center gap-2">
                          <button className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 text-sm font-medium flex items-center gap-1 theme-transition">
                            <FileText size={16} /> View Report
                          </button>
                          {test.result && (
                            <button
                              onClick={() => handleInterpretLab(test)}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium flex items-center gap-1 theme-transition"
                            >
                              <Brain size={16} /> AI Interpret
                            </button>
                          )}
                        </div>
                      ) : (
                        <button className="text-info-dark hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium theme-transition">
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Interpretation Panel */}
          <div className="space-y-4">
            <div className="bg-background-elevated rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-purple-600 dark:text-purple-400" size={20} />
                <h3 className="font-bold text-foreground-primary">AI Lab Interpretation</h3>
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles size={10} /> AI
                </span>
              </div>

              {selectedTest ? (
                <div className="space-y-4">
                  <div className="bg-background-secondary rounded-lg p-3">
                    <p className="text-xs text-foreground-muted">Selected Test</p>
                    <p className="font-semibold text-foreground-primary">{selectedTest.testName}</p>
                    <p className="text-sm text-foreground-secondary">
                      Result: <span className="font-bold">{selectedTest.result} {selectedTest.unit}</span>
                    </p>
                    {selectedTest.referenceRange && (
                      <p className="text-xs text-foreground-muted">Reference: {selectedTest.referenceRange}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground-secondary mb-1">Patient Age</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-background-primary text-foreground-primary theme-transition"
                        value={interpretationInput.patientAge}
                        onChange={e => setInterpretationInput({ ...interpretationInput, patientAge: e.target.value })}
                        placeholder="Years"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-secondary mb-1">Gender</label>
                      <select
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-background-primary text-foreground-primary theme-transition"
                        value={interpretationInput.patientGender}
                        onChange={e => setInterpretationInput({ ...interpretationInput, patientGender: e.target.value })}
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-secondary mb-1">Clinical Context</label>
                    <textarea
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none h-16 resize-none bg-background-primary text-foreground-primary theme-transition"
                      value={interpretationInput.clinicalContext}
                      onChange={e => setInterpretationInput({ ...interpretationInput, clinicalContext: e.target.value })}
                      placeholder="Relevant clinical information..."
                    />
                  </div>

                  <button
                    onClick={() => handleInterpretLab(selectedTest)}
                    disabled={interpretationLoading}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 theme-transition"
                  >
                    {interpretationLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain size={16} />
                        Interpret Result
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-foreground-muted">
                  <FlaskConical size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a completed test to get AI interpretation</p>
                </div>
              )}
            </div>

            {/* Interpretation Results */}
            {interpretationResult && (
              <div className="bg-background-elevated border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground-primary">Interpretation</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${interpretationResult.status === 'Normal' ? 'bg-success-light text-success-dark' :
                    interpretationResult.status === 'Critical' ? 'bg-danger-light text-danger-dark' :
                      interpretationResult.status === 'Abnormal' ? 'bg-warning-light text-warning-dark' :
                        'bg-warning-light text-warning-dark'
                    }`}>
                    {interpretationResult.status}
                  </span>
                </div>

                <div className="bg-background-secondary rounded-lg p-3">
                  <p className="text-sm text-foreground-secondary">{interpretationResult.interpretation}</p>
                </div>

                <div className="bg-info-light border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-info-dark mb-1">Clinical Significance</p>
                  <p className="text-sm text-blue-600 dark:text-blue-200">{interpretationResult.clinicalSignificance}</p>
                </div>

                {interpretationResult.possibleCauses.length > 0 && (
                  <div className="bg-warning-light border border-amber-100 dark:border-amber-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-warning-dark mb-1">Possible Causes</p>
                    <ul className="text-xs text-amber-600 dark:text-amber-200 space-y-1">
                      {interpretationResult.possibleCauses.map((cause, i) => (
                        <li key={i}>• {cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {interpretationResult.recommendedActions.length > 0 && (
                  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1 flex items-center gap-1">
                      <Activity size={12} /> Recommended Actions
                    </p>
                    <ul className="text-xs text-teal-600 dark:text-teal-200 space-y-1">
                      {interpretationResult.recommendedActions.map((action, i) => (
                        <li key={i}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {interpretationResult.trendAnalysis && (
                  <div className="bg-background-secondary rounded-lg p-3 flex items-center gap-3">
                    {interpretationResult.trendAnalysis.direction === 'increasing' ? (
                      <TrendingUp className="text-danger-dark" size={20} />
                    ) : interpretationResult.trendAnalysis.direction === 'decreasing' ? (
                      <TrendingDown className="text-info-dark" size={20} />
                    ) : (
                      <Activity className="text-success-dark" size={20} />
                    )}
                    <div>
                      <p className="text-xs text-foreground-muted">Trend: {interpretationResult.trendAnalysis.direction}</p>
                      <p className="text-sm text-foreground-secondary">{interpretationResult.trendAnalysis.significance}</p>
                    </div>
                  </div>
                )}

                {interpretationResult.followUpRequired && (
                  <div className="bg-danger-light border border-red-100 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle className="text-danger-dark" size={16} />
                    <span className="text-sm text-danger-dark font-medium">Follow-up required</span>
                  </div>
                )}

                {interpretationResult.icdCode && (
                  <div className="text-xs text-foreground-muted">
                    Suggested ICD-10: <span className="font-mono font-bold">{interpretationResult.icdCode}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ECG Analysis Tab */}
      {activeTab === 'ecg' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ECG Upload and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* ECG Upload Section */}
            <div className="bg-background-elevated rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-danger-dark" size={20} />
                <h3 className="font-bold text-foreground-primary">ECG Image Upload</h3>
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles size={10} /> AI-Powered
                </span>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${ecgImage
                  ? 'border-green-300 dark:border-green-700 bg-success-light'
                  : 'border-border hover:border-teal-400 dark:hover:border-teal-500'
                  }`}
              >
                {ecgImage ? (
                  <div className="space-y-4">
                    <img src={ecgImage} alt="ECG" className="max-h-64 mx-auto rounded-lg shadow-md" />
                    <button
                      onClick={() => { setEcgImage(null); setEcgAnalysisResult(null); }}
                      className="text-sm text-danger-dark hover:text-red-800 dark:hover:text-red-300 theme-transition"
                    >
                      Remove and upload different ECG
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="mx-auto text-foreground-muted mb-3" size={48} />
                    <p className="text-foreground-secondary mb-2">Click to upload ECG image</p>
                    <p className="text-xs text-foreground-muted">Supports: PNG, JPG, PDF (12-lead, 6-lead, 3-lead configurations)</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleECGImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* ECG Analysis Results */}
            {ecgAnalysisResult && (
              <div className="bg-background-elevated rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="text-purple-600 dark:text-purple-400" size={20} />
                    <h3 className="font-bold text-foreground-primary">AI ECG Analysis Results</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getConfidenceColor(ecgAnalysisResult.confidence)}`}>
                      {Math.round(ecgAnalysisResult.confidence * 100)}% Confidence
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getSeverityColor(ecgAnalysisResult.overallAssessment.severity)}`}>
                      {ecgAnalysisResult.overallAssessment.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Rhythm Analysis */}
                <div className="bg-background-secondary rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="text-yellow-500" size={16} />
                    <h4 className="font-semibold text-foreground-primary">Rhythm Analysis</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-foreground-muted">Rhythm Type</p>
                      <p className="font-bold text-foreground-primary">{ecgAnalysisResult.rhythmAnalysis.rhythmType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Heart Rate</p>
                      <p className="font-bold text-foreground-primary">{ecgAnalysisResult.rhythmAnalysis.heartRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Regularity</p>
                      <p className="font-medium text-foreground-secondary">{ecgAnalysisResult.rhythmAnalysis.regularity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Confidence</p>
                      <p className={`font-medium ${ecgAnalysisResult.rhythmAnalysis.confidence >= 0.9 ? 'text-success-dark' : 'text-warning-dark'}`}>
                        {Math.round(ecgAnalysisResult.rhythmAnalysis.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interval Measurements */}
                <div className="bg-info-light border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge className="text-info-dark" size={16} />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Interval Measurements</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-blue-600 dark:text-blue-400">PR Interval</p>
                      <p className={`font-bold text-lg ${ecgAnalysisResult.intervalMeasurements.prInterval.normal ? 'text-success-dark' : 'text-danger-dark'
                        }`}>
                        {ecgAnalysisResult.intervalMeasurements.prInterval.value}ms
                      </p>
                      <p className="text-[10px] text-blue-500 dark:text-blue-400">Normal: 120-200ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-blue-600 dark:text-blue-400">QRS Duration</p>
                      <p className={`font-bold text-lg ${ecgAnalysisResult.intervalMeasurements.qrsDuration.normal ? 'text-success-dark' : 'text-danger-dark'
                        }`}>
                        {ecgAnalysisResult.intervalMeasurements.qrsDuration.value}ms
                      </p>
                      <p className="text-[10px] text-blue-500 dark:text-blue-400">Normal: 60-100ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-blue-600 dark:text-blue-400">QT Interval</p>
                      <p className={`font-bold text-lg ${ecgAnalysisResult.intervalMeasurements.qtInterval.normal ? 'text-success-dark' : 'text-danger-dark'
                        }`}>
                        {ecgAnalysisResult.intervalMeasurements.qtInterval.value}ms
                      </p>
                      <p className="text-[10px] text-blue-500 dark:text-blue-400">QTc: {ecgAnalysisResult.intervalMeasurements.qtInterval.corrected}ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-blue-600 dark:text-blue-400">QRS Axis</p>
                      <p className="font-bold text-lg text-foreground-primary">
                        {ecgAnalysisResult.intervalMeasurements.qrsAxis}°
                      </p>
                      <p className="text-[10px] text-blue-500 dark:text-blue-400">Normal: -30° to +90°</p>
                    </div>
                  </div>
                </div>

                {/* Findings */}
                {ecgAnalysisResult.findings.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground-primary flex items-center gap-2">
                      <ClipboardList size={16} />
                      Detected Findings ({ecgAnalysisResult.findings.length})
                    </h4>
                    <div className="grid gap-2">
                      {ecgAnalysisResult.findings.map((finding, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${getSeverityColor(finding.severity)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{finding.finding}</span>
                              <span className="text-xs px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded-full">
                                {finding.category}
                              </span>
                            </div>
                            <span className="text-xs font-bold">
                              {Math.round(finding.confidence * 100)}%
                            </span>
                          </div>
                          {finding.description && (
                            <p className="text-xs mt-1 opacity-80">{finding.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinical Recommendations */}
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="text-teal-600 dark:text-teal-400" size={16} />
                    <h4 className="font-semibold text-teal-800 dark:text-teal-200">Clinical Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {ecgAnalysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-teal-700 dark:text-teal-300">
                        <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Overall Assessment */}
                <div className={`p-4 rounded-lg border ${ecgAnalysisResult.overallAssessment.severity === 'critical'
                  ? 'bg-danger-light border-red-200 dark:border-red-800'
                  : ecgAnalysisResult.overallAssessment.severity === 'high'
                    ? 'bg-warning-light border-orange-200 dark:border-orange-800'
                    : 'bg-background-secondary border-border'
                  }`}>
                  <h4 className="font-semibold text-foreground-primary mb-2">Overall Assessment</h4>
                  <p className="text-sm text-foreground-secondary">{ecgAnalysisResult.overallAssessment.summary}</p>
                  {ecgAnalysisResult.overallAssessment.requiresImmediateAttention && (
                    <div className="mt-3 flex items-center gap-2 text-danger-dark font-medium">
                      <AlertTriangle size={16} />
                      Requires Immediate Clinical Attention
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ECG Patient Info Panel */}
          <div className="space-y-4">
            <div className="bg-background-elevated rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-teal-600 dark:text-teal-400" size={20} />
                <h3 className="font-bold text-foreground-primary">Patient Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-secondary mb-1">Patient Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-background-primary text-foreground-primary theme-transition"
                    value={ecgPatientInfo.patientName}
                    onChange={e => setEcgPatientInfo({ ...ecgPatientInfo, patientName: e.target.value })}
                    placeholder="Enter patient name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground-secondary mb-1">Age</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-background-primary text-foreground-primary theme-transition"
                      value={ecgPatientInfo.patientAge}
                      onChange={e => setEcgPatientInfo({ ...ecgPatientInfo, patientAge: e.target.value })}
                      placeholder="Years"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground-secondary mb-1">Gender</label>
                    <select
                      title="Select gender"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-background-primary text-foreground-primary theme-transition"
                      value={ecgPatientInfo.patientGender}
                      onChange={e => setEcgPatientInfo({ ...ecgPatientInfo, patientGender: e.target.value })}
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-secondary mb-1">Clinical Context / Symptoms</label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none h-20 resize-none bg-background-primary text-foreground-primary theme-transition"
                    value={ecgPatientInfo.clinicalContext}
                    onChange={e => setEcgPatientInfo({ ...ecgPatientInfo, clinicalContext: e.target.value })}
                    placeholder="Chest pain, palpitations, shortness of breath..."
                  />
                </div>

                <button
                  onClick={handleAnalyzeECG}
                  disabled={!ecgImage || ecgLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 theme-transition"
                >
                  {ecgLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Analyzing ECG...
                    </>
                  ) : (
                    <>
                      <Brain size={18} />
                      Analyze ECG with AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gradient-to-br from-background-secondary to-background-tertiary rounded-xl border border-border p-4">
              <h4 className="font-semibold text-foreground-primary mb-3 text-sm">ECG Quick Reference</h4>
              <div className="space-y-2 text-xs text-foreground-secondary">
                <div className="flex justify-between">
                  <span>Normal Heart Rate:</span>
                  <span className="font-medium">60-100 bpm</span>
                </div>
                <div className="flex justify-between">
                  <span>PR Interval:</span>
                  <span className="font-medium">120-200 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>QRS Duration:</span>
                  <span className="font-medium">60-100 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>QTc Interval:</span>
                  <span className="font-medium">&lt; 440 ms (M), &lt; 460 ms (F)</span>
                </div>
                <div className="flex justify-between">
                  <span>QRS Axis:</span>
                  <span className="font-medium">-30 to +90 deg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabManagement;
