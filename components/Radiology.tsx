import React, { useState } from 'react';
import { Scan, Image, FileText, Upload, Plus, Search, Eye, X, Brain, Activity, Baby, Eye as EyeIcon, Heart, Loader2, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { analyzeChestXRay, analyzeCTScan, analyzeMRI, analyzeMammography, analyzeRetinalImaging } from '../services/aiService';
import {
  ChestXRayAnalysisResult,
  CTScanAnalysisResult,
  MRIAnalysisResult,
  MammographyAnalysisResult,
  RetinalImagingAnalysisResult
} from '../types';

interface ScanRequest {
  id: string;
  patientName: string;
  modality: 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound' | 'Mammography' | 'Retinal';
  bodyPart: string;
  doctor: string;
  date: string;
  status: 'Scheduled' | 'Imaging' | 'Reviewing' | 'Finalized';
  imageCount: number;
}

type AIAnalysisResult = ChestXRayAnalysisResult | CTScanAnalysisResult | MRIAnalysisResult | MammographyAnalysisResult | RetinalImagingAnalysisResult | null;

const Radiology: React.FC = () => {
  const [requests, setRequests] = useState<ScanRequest[]>([
    { id: 'RAD-001', patientName: 'John Doe', modality: 'X-Ray', bodyPart: 'Chest PA', doctor: 'Dr. Smith', date: '2024-03-15', status: 'Finalized', imageCount: 2 },
    { id: 'RAD-002', patientName: 'Jane Smith', modality: 'MRI', bodyPart: 'Brain', doctor: 'Dr. Chen', date: '2024-03-15', status: 'Imaging', imageCount: 0 },
    { id: 'RAD-003', patientName: 'Robert Brown', modality: 'CT Scan', bodyPart: 'Abdomen', doctor: 'Dr. Wilson', date: '2024-03-15', status: 'Reviewing', imageCount: 150 },
    { id: 'RAD-004', patientName: 'Mary Johnson', modality: 'Mammography', bodyPart: 'Bilateral', doctor: 'Dr. Davis', date: '2024-03-15', status: 'Reviewing', imageCount: 4 },
    { id: 'RAD-005', patientName: 'James Wilson', modality: 'Retinal', bodyPart: 'Fundus', doctor: 'Dr. Martinez', date: '2024-03-15', status: 'Finalized', imageCount: 2 },
  ]);

  const [showViewer, setShowViewer] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanRequest | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState<'viewer' | 'ai'>('viewer');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Finalized': return 'bg-green-100 text-green-700';
      case 'Reviewing': return 'bg-blue-100 text-blue-700';
      case 'Imaging': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getModalityIcon = (modality: string) => {
    switch(modality) {
      case 'MRI': return <Brain className="text-purple-500" size={18} />;
      case 'CT Scan': return <Scan className="text-blue-500" size={18} />;
      case 'X-Ray': return <Image className="text-teal-500" size={18} />;
      case 'Mammography': return <Heart className="text-pink-500" size={18} />;
      case 'Retinal': return <EyeIcon className="text-amber-500" size={18} />;
      case 'Ultrasound': return <Baby className="text-cyan-500" size={18} />;
      default: return <Scan className="text-slate-500" size={18} />;
    }
  };

  const openViewer = (scan: ScanRequest) => {
    setSelectedScan(scan);
    setShowViewer(true);
    setAiAnalysis(null);
    setShowAIAnalysis(false);
    setActiveTab('viewer');
  };

  const runAIAnalysis = async () => {
    if (!selectedScan) return;
    
    setAiLoading(true);
    setShowAIAnalysis(true);
    setActiveTab('ai');
    
    try {
      let result: AIAnalysisResult = null;
      
      // Simulate image data (in real app, this would be actual image data)
      const mockImageData = 'base64_encoded_image_data';
      
      switch(selectedScan.modality) {
        case 'X-Ray':
          if (selectedScan.bodyPart.toLowerCase().includes('chest')) {
            const response = await analyzeChestXRay({
              imageData: mockImageData,
              patientInfo: {
                age: 45,
                gender: 'Male',
                clinicalIndication: 'Chest pain evaluation'
              }
            });
            result = response.data || null;
          }
          break;
        case 'CT Scan':
          const ctResponse = await analyzeCTScan({
            imageData: mockImageData,
            scanType: selectedScan.bodyPart.toLowerCase().includes('brain') ? 'head' : 
                      selectedScan.bodyPart.toLowerCase().includes('chest') ? 'chest' : 'abdomen',
            contrastUsed: true,
            patientInfo: {
              age: 52,
              gender: 'Male',
              clinicalIndication: 'Abdominal pain evaluation'
            }
          });
          result = ctResponse.data || null;
          break;
        case 'MRI':
          const mriResponse = await analyzeMRI({
            imageData: mockImageData,
            scanType: selectedScan.bodyPart.toLowerCase().includes('brain') ? 'brain' : 
                      selectedScan.bodyPart.toLowerCase().includes('spine') ? 'spine' : 'joint',
            sequences: ['T1', 'T2', 'FLAIR'],
            contrastUsed: false,
            patientInfo: {
              age: 38,
              gender: 'Female',
              clinicalIndication: 'Headache evaluation'
            }
          });
          result = mriResponse.data || null;
          break;
        case 'Mammography':
          const mammographyResponse = await analyzeMammography({
            imageData: mockImageData,
            views: ['CC', 'MLO'],
            laterality: 'bilateral',
            patientInfo: {
              age: 48,
              gender: 'Female',
              clinicalIndication: 'Screening mammography'
            }
          });
          result = mammographyResponse.data || null;
          break;
        case 'Retinal':
          const retinalResponse = await analyzeRetinalImaging({
            imageData: mockImageData,
            imagingType: 'fundus_photography',
            laterality: 'bilateral',
            patientInfo: {
              age: 55,
              diabetesStatus: 'type2',
              hypertension: true
            }
          });
          result = retinalResponse.data || null;
          break;
      }
      
      setAiAnalysis(result);
    } catch (error) {
      console.error('AI Analysis error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const renderConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    const color = percentage >= 90 ? 'bg-green-100 text-green-700' :
                  percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {percentage}% confidence
      </span>
    );
  };

  const renderChestXRayAnalysis = (analysis: ChestXRayAnalysisResult) => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
        <h4 className="font-semibold text-teal-800 mb-2">Overall Impression</h4>
        <p className="text-slate-700">{analysis.overallImpression}</p>
        <div className="mt-2 flex items-center gap-2">
          {renderConfidenceBadge(analysis.confidence)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
            <Activity className="text-red-500" size={18} />
            Cardiac Analysis
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Cardiothoracic Ratio:</span>
              <span className="font-medium">{analysis.cardiacAnalysis.cardiothoracicRatio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Heart Size:</span>
              <span className="font-medium capitalize">{analysis.cardiacAnalysis.heartSize.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cardiomegaly:</span>
              <span className={`font-medium ${analysis.cardiacAnalysis.cardiomegaly ? 'text-red-600' : 'text-green-600'}`}>
                {analysis.cardiacAnalysis.cardiomegaly ? 'Present' : 'Absent'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
            <Image className="text-blue-500" size={18} />
            Lung Analysis
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Lung Fields:</span>
              <span className="font-medium capitalize">{analysis.lungAnalysis.lungFields}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Infiltrates:</span>
              <span className="font-medium">{analysis.lungAnalysis.infiltrates.length || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Pleural Effusion:</span>
              <span className="font-medium">{analysis.lungAnalysis.pleuralEffusion.length || 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Detected Abnormalities</h5>
        <div className="space-y-2">
          {analysis.abnormalities.filter(a => a.present).length === 0 ? (
            <p className="text-green-600 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> No abnormalities detected
            </p>
          ) : (
            analysis.abnormalities.filter(a => a.present).map((abnormality, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                <div>
                  <span className="font-medium text-red-800 capitalize">{abnormality.type.replace('_', ' ')}</span>
                  <p className="text-xs text-red-600">{abnormality.description}</p>
                </div>
                {renderConfidenceBadge(abnormality.confidence)}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Recommendations</h5>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <span className="font-medium">{rec.recommendation}</span>
                <p className="text-slate-500 text-xs">Timeframe: {rec.timeframe}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCTScanAnalysis = (analysis: CTScanAnalysisResult) => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Overall Impression</h4>
        <p className="text-slate-700">{analysis.overallImpression}</p>
        <div className="mt-2 flex items-center gap-2">
          {renderConfidenceBadge(analysis.confidence)}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Organ Analysis</h5>
        <div className="grid grid-cols-2 gap-3">
          {analysis.organAnalysis.map((organ, idx) => (
            <div key={idx} className={`p-3 rounded-lg ${organ.status === 'normal' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-800">{organ.organ}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${organ.status === 'normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {organ.status}
                </span>
              </div>
              <p className="text-xs text-slate-600">{organ.findings.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Measurements</h5>
        <div className="space-y-2">
          {analysis.measurements.slice(0, 6).map((measurement, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
              <span className="text-slate-600">{measurement.structure} - {measurement.measurement}</span>
              <div className="text-right">
                <span className="font-medium">{measurement.value} {measurement.unit}</span>
                <span className={`ml-2 text-xs ${measurement.interpretation === 'Normal' ? 'text-green-600' : 'text-amber-600'}`}>
                  ({measurement.interpretation})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Recommendations</h5>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <span className="font-medium">{rec.recommendation}</span>
                <p className="text-slate-500 text-xs">Priority: {rec.priority}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMRIAnalysis = (analysis: MRIAnalysisResult) => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-2">Overall Impression</h4>
        <p className="text-slate-700">{analysis.overallImpression}</p>
        <div className="mt-2 flex items-center gap-2">
          {renderConfidenceBadge(analysis.confidence)}
        </div>
      </div>

      {analysis.brainAnalysis && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
            <Brain className="text-purple-500" size={18} />
            Brain Analysis
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Ventricles:</span>
                <span className="font-medium capitalize">{analysis.brainAnalysis.ventricles.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">White Matter:</span>
                <span className="font-medium capitalize">{analysis.brainAnalysis.whiteMatter.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Gray Matter:</span>
                <span className="font-medium capitalize">{analysis.brainAnalysis.grayMatter.status}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Vascular:</span>
                <span className="font-medium capitalize">{analysis.brainAnalysis.vascular.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Masses:</span>
                <span className={`font-medium ${analysis.brainAnalysis.masses.present ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.brainAnalysis.masses.present ? 'Present' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis.spineAnalysis && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3">Spine Analysis</h5>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-slate-600">Vertebral Bodies:</span>
              <span className="ml-2 font-medium capitalize">{analysis.spineAnalysis.vertebralBodies.status}</span>
            </div>
            <div className="text-sm">
              <span className="text-slate-600">Spinal Cord:</span>
              <span className="ml-2 font-medium capitalize">{analysis.spineAnalysis.spinalCord.status}</span>
            </div>
            <div className="mt-3">
              <h6 className="text-xs font-medium text-slate-500 mb-2">Disc Status</h6>
              <div className="grid grid-cols-3 gap-2">
                {analysis.spineAnalysis.intervertebralDiscs.slice(0, 5).map((disc, idx) => (
                  <div key={idx} className={`p-2 rounded text-xs ${disc.status === 'normal' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className="font-medium">{disc.level}</div>
                    <div className="capitalize">{disc.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Recommendations</h5>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <Info className="text-purple-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <span className="font-medium">{rec.recommendation}</span>
                <p className="text-slate-500 text-xs">Priority: {rec.priority}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMammographyAnalysis = (analysis: MammographyAnalysisResult) => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-pink-800">BI-RADS Assessment</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            analysis.biRadsAssessment.category === 1 ? 'bg-green-100 text-green-700' :
            analysis.biRadsAssessment.category === 2 ? 'bg-green-100 text-green-700' :
            analysis.biRadsAssessment.category === 3 ? 'bg-yellow-100 text-yellow-700' :
            analysis.biRadsAssessment.category === 4 ? 'bg-orange-100 text-orange-700' :
            analysis.biRadsAssessment.category === 5 ? 'bg-red-100 text-red-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            Category {analysis.biRadsAssessment.category}
          </span>
        </div>
        <p className="text-slate-700">{analysis.biRadsAssessment.categoryDescription}</p>
        <p className="text-sm text-slate-600 mt-2">
          <strong>Probability of Malignancy:</strong> {analysis.biRadsAssessment.probabilityOfMalignancy}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {renderConfidenceBadge(analysis.confidence)}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Breast Density</h5>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 rounded-full" 
                style={{ width: `${analysis.breastDensity.percentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">{analysis.breastDensity.percentage}%</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">Category {analysis.breastDensity.category}: {analysis.breastDensity.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3">Masses</h5>
          {analysis.masses.present ? (
            <div className="space-y-2">
              {analysis.masses.findings.map((mass, idx) => (
                <div key={idx} className="text-sm p-2 bg-amber-50 rounded border border-amber-200">
                  <span className="font-medium">{mass.location}</span>
                  <p className="text-xs text-slate-600">{mass.size} - {mass.assessment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> No masses detected
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3">Calcifications</h5>
          {analysis.calcifications.present ? (
            <div className="space-y-2">
              {analysis.calcifications.findings.map((calc, idx) => (
                <div key={idx} className="text-sm p-2 bg-amber-50 rounded border border-amber-200">
                  <span className="font-medium">{calc.location}</span>
                  <p className="text-xs text-slate-600">{calc.type} - {calc.assessment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> No suspicious calcifications
            </p>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Recommendations</h5>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <Info className="text-pink-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <span className="font-medium">{rec.recommendation}</span>
                <p className="text-slate-500 text-xs">Timeframe: {rec.timeframe}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRetinalAnalysis = (analysis: RetinalImagingAnalysisResult) => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-2">Overall Impression</h4>
        <p className="text-slate-700">{analysis.overallImpression}</p>
        <div className="mt-2 flex items-center gap-2">
          {renderConfidenceBadge(analysis.confidence)}
        </div>
      </div>

      {analysis.diabeticRetinopathyAnalysis && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
            <EyeIcon className="text-amber-500" size={18} />
            Diabetic Retinopathy Assessment
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Present:</span>
                <span className={`font-medium ${analysis.diabeticRetinopathyAnalysis.present ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.diabeticRetinopathyAnalysis.present ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Severity:</span>
                <span className="font-medium capitalize">{analysis.diabeticRetinopathyAnalysis.severity.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Microaneurysms:</span>
                <span className="font-medium">{analysis.diabeticRetinopathyAnalysis.microaneurysms.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">DME:</span>
                <span className={`font-medium ${analysis.diabeticRetinopathyAnalysis.dme.present ? 'text-amber-600' : 'text-green-600'}`}>
                  {analysis.diabeticRetinopathyAnalysis.dme.present ? 'Present' : 'Absent'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis.glaucomaAnalysis && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3">Glaucoma Risk Assessment</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Risk Level:</span>
                <span className={`font-medium capitalize ${
                  analysis.glaucomaAnalysis.riskLevel === 'low' ? 'text-green-600' :
                  analysis.glaucomaAnalysis.riskLevel === 'moderate' ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {analysis.glaucomaAnalysis.riskLevel}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Cup/Disc Ratio:</span>
                <span className="font-medium">{analysis.glaucomaAnalysis.cupToDiscRatio.vertical}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">NFL Status:</span>
                <span className="font-medium capitalize">{analysis.glaucomaAnalysis.nerveFiberLayer.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Notching:</span>
                <span className={`font-medium ${analysis.glaucomaAnalysis.opticDisc.notching ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.glaucomaAnalysis.opticDisc.notching ? 'Present' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis.amdAnalysis && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h5 className="font-medium text-slate-800 mb-3">AMD Assessment</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">AMD Present:</span>
              <span className={`font-medium ${analysis.amdAnalysis.present ? 'text-amber-600' : 'text-green-600'}`}>
                {analysis.amdAnalysis.present ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Type:</span>
              <span className="font-medium capitalize">{analysis.amdAnalysis.type.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Drusen Present:</span>
              <span className="font-medium">{analysis.amdAnalysis.drusen.present ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h5 className="font-medium text-slate-800 mb-3">Recommendations</h5>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <Info className="text-amber-500 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <span className="font-medium">{rec.recommendation}</span>
                <p className="text-slate-500 text-xs">Timeframe: {rec.timeframe}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIAnalysis = () => {
    if (aiLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-teal-500 mb-4" size={48} />
          <p className="text-slate-600 font-medium">Running AI Analysis...</p>
          <p className="text-slate-400 text-sm">This may take a moment</p>
        </div>
      );
    }

    if (!aiAnalysis) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="text-amber-500 mx-auto mb-4" size={48} />
          <p className="text-slate-600">Unable to perform AI analysis</p>
        </div>
      );
    }

    switch(selectedScan?.modality) {
      case 'X-Ray':
        return renderChestXRayAnalysis(aiAnalysis as ChestXRayAnalysisResult);
      case 'CT Scan':
        return renderCTScanAnalysis(aiAnalysis as CTScanAnalysisResult);
      case 'MRI':
        return renderMRIAnalysis(aiAnalysis as MRIAnalysisResult);
      case 'Mammography':
        return renderMammographyAnalysis(aiAnalysis as MammographyAnalysisResult);
      case 'Retinal':
        return renderRetinalAnalysis(aiAnalysis as RetinalImagingAnalysisResult);
      default:
        return <p className="text-slate-600">AI analysis not available for this modality</p>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Radiology & PACS</h1>
          <p className="text-slate-500">Diagnostic imaging workflow and AI-powered analysis.</p>
        </div>
        <button 
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} /> Schedule Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Scan size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total Scans</p>
                    <h3 className="text-2xl font-bold text-slate-900">45</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-lg"><Brain size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">AI Analyzed</p>
                    <h3 className="text-2xl font-bold text-slate-900">32</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Pending Review</p>
                    <h3 className="text-2xl font-bold text-slate-900">8</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Finalized Today</p>
                    <h3 className="text-2xl font-bold text-slate-900">12</h3>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search PACS..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Accession #</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Patient</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Modality</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Images</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-600 text-sm">{req.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">
                    {req.patientName}
                    <p className="text-xs text-slate-500">{req.doctor}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      {getModalityIcon(req.modality)}
                      <div>
                        <span className="font-bold">{req.modality}</span>
                        <p className="text-xs">{req.bodyPart}</p>
                      </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-slate-600 flex items-center gap-1">
                    <Image size={14} /> {req.imageCount}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                    {req.status !== 'Scheduled' && (
                        <button 
                            onClick={() => openViewer(req)}
                            className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center gap-1 bg-teal-50 px-2 py-1 rounded"
                        >
                            <Eye size={16} /> View
                        </button>
                    )}
                    {req.status === 'Finalized' && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                            <FileText size={16} /> Report
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PACS Viewer Modal with AI Analysis */}
      {showViewer && selectedScan && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col animate-fade-in">
            <div className="h-14 bg-slate-900 flex items-center justify-between px-4 text-slate-300 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    {getModalityIcon(selectedScan.modality)}
                    <div>
                        <h3 className="font-bold text-white text-sm">{selectedScan.patientName}</h3>
                        <p className="text-xs text-slate-400">{selectedScan.id} • {selectedScan.modality} {selectedScan.bodyPart}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     {/* Tab buttons */}
                     <div className="flex bg-slate-800 rounded-lg p-1">
                       <button
                         onClick={() => setActiveTab('viewer')}
                         className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTab === 'viewer' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
                       >
                         <Image size={16} className="inline mr-1" /> Viewer
                       </button>
                       <button
                         onClick={() => setActiveTab('ai')}
                         className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${activeTab === 'ai' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
                       >
                         <Brain size={16} /> AI Analysis
                         {aiAnalysis && <span className="w-2 h-2 bg-green-400 rounded-full ml-1" />}
                       </button>
                     </div>
                     <button className="hover:text-white"><Upload size={20} /></button>
                     <button className="hover:text-white" onClick={() => setShowViewer(false)}><X size={24} /></button>
                </div>
            </div>
            
            {activeTab === 'viewer' ? (
              <div className="flex-1 bg-black flex items-center justify-center relative">
                  <div className="text-slate-600 flex flex-col items-center">
                      <Image size={64} className="mb-4 opacity-20" />
                      <p>DICOM Viewer Simulation</p>
                      <p className="text-sm opacity-50">Image rendering area</p>
                  </div>
                  {/* Overlay details */}
                  <div className="absolute top-4 left-4 text-teal-500 font-mono text-xs">
                      <p>W: 255 L: 127</p>
                      <p>Zoom: 100%</p>
                  </div>
                  
                  {/* AI Analysis Button */}
                  <button
                    onClick={runAIAnalysis}
                    disabled={aiLoading}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain size={18} />
                        Run AI Analysis
                      </>
                    )}
                  </button>
              </div>
            ) : (
              <div className="flex-1 bg-slate-900 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                      <Brain className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI-Powered Analysis</h3>
                      <p className="text-slate-400 text-xs">{selectedScan.modality} • {selectedScan.bodyPart}</p>
                    </div>
                    {aiAnalysis && (
                      <span className="ml-auto px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                        Analysis Complete
                      </span>
                    )}
                  </div>
                  
                  {renderAIAnalysis()}
                  
                  <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 flex items-start gap-2">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Disclaimer:</strong> This AI analysis is for educational purposes only and should not replace professional medical interpretation. 
                        All findings should be verified by a qualified radiologist and correlated clinically.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Radiology;
