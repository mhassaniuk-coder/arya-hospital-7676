import React, { useState } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  BarChart3,
  PieChart,
  Users,
  Building,
  User,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileText,
  Send
} from 'lucide-react';
import { usePatientFeedbackAnalyzer } from '../hooks/useAI';
import { PatientFeedbackResult, PatientFeedbackInput } from '../types';

interface FeedbackItem {
  id: string;
  rating: number;
  category: string;
  feedback: string;
  department: string;
  date: string;
}

const AIPatientFeedbackAnalyzer: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackItem>({
    id: '',
    rating: 5,
    category: 'overall',
    feedback: '',
    department: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [showResults, setShowResults] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  const { execute: analyzeFeedback, data: result, loading, error } = usePatientFeedbackAnalyzer();

  const categories = [
    'overall', 'clinical_care', 'nursing', 'facilities', 'food', 'billing', 'discharge'
  ];

  const departments = [
    'Emergency', 'Cardiology', 'Orthopedics', 'Pediatrics', 'OB/GYN', 
    'General Medicine', 'Surgery', 'Radiology', 'Laboratory', 'Pharmacy'
  ];

  const addFeedback = () => {
    if (!currentFeedback.feedback.trim()) return;
    setFeedbackItems([...feedbackItems, { ...currentFeedback, id: Date.now().toString() }]);
    setCurrentFeedback({
      id: '',
      rating: 5,
      category: 'overall',
      feedback: '',
      department: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const removeFeedback = (id: string) => {
    setFeedbackItems(feedbackItems.filter(f => f.id !== id));
  };

  const handleAnalyze = async () => {
    if (feedbackItems.length === 0) return;

    const input: PatientFeedbackInput = {
      feedbackItems: feedbackItems.map(f => ({
        id: f.id,
        patientId: undefined,
        department: f.department,
        provider: undefined,
        date: f.date,
        rating: f.rating,
        category: f.category as any,
        feedback: f.feedback,
        responseSource: 'survey'
      })),
      analysisScope: 'organization'
    };

    await analyzeFeedback(input);
    setShowResults(true);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'very_positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'positive': return 'bg-green-50 text-green-600 border-green-100';
      case 'neutral': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'negative': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'very_negative': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp size={14} className="text-green-500" />;
      case 'declining': return <TrendingDown size={14} className="text-red-500" />;
      default: return <Minus size={14} className="text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'major': return 'bg-orange-100 text-orange-700';
      case 'minor': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Patient Feedback Analyzer
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                AI-Powered
              </span>
            </h2>
            <p className="text-sm text-slate-500">Analyze patient feedback for actionable insights</p>
          </div>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Add Feedback Form */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Add Feedback Entry</h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setCurrentFeedback({...currentFeedback, rating: star})}
                      className="p-1"
                      title={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star 
                        size={16} 
                        className={star <= currentFeedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Category</label>
                <select
                  value={currentFeedback.category}
                  onChange={(e) => setCurrentFeedback({...currentFeedback, category: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  title="Select category"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Department</label>
                <select
                  value={currentFeedback.department}
                  onChange={(e) => setCurrentFeedback({...currentFeedback, department: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  title="Select department"
                >
                  <option value="">Any</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-5">
                <label className="block text-xs text-slate-500 mb-1">Feedback</label>
                <input
                  type="text"
                  value={currentFeedback.feedback}
                  onChange={(e) => setCurrentFeedback({...currentFeedback, feedback: e.target.value})}
                  placeholder="Enter patient feedback..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-1 flex items-end">
                <button
                  onClick={addFeedback}
                  disabled={!currentFeedback.feedback.trim()}
                  className="w-full bg-amber-600 text-white p-1.5 rounded-lg hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  title="Add feedback"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          {feedbackItems.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Feedback Entries ({feedbackItems.length})
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {feedbackItems.map(item => (
                  <div key={item.id} className="flex items-start justify-between bg-white border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star}
                            size={12} 
                            className={star <= item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm text-slate-700">{item.feedback}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-full">{item.category}</span>
                          {item.department && <span>• {item.department}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFeedback(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove feedback"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Data Button */}
          <button
            onClick={() => {
              const sampleFeedback = [
                { id: '1', rating: 5, category: 'clinical_care', feedback: 'Excellent care from the nursing staff. Very attentive and compassionate.', department: 'Cardiology', date: '2026-02-10' },
                { id: '2', rating: 2, category: 'facilities', feedback: 'Long wait times in the emergency room. Waited over 4 hours to be seen.', department: 'Emergency', date: '2026-02-11' },
                { id: '3', rating: 4, category: 'nursing', feedback: 'Nurses were friendly and professional. Response time could be improved.', department: 'General Medicine', date: '2026-02-12' },
                { id: '4', rating: 5, category: 'clinical_care', feedback: 'Dr. Johnson explained everything clearly. Best cardiologist I have seen.', department: 'Cardiology', date: '2026-02-13' },
                { id: '5', rating: 3, category: 'billing', feedback: 'Billing process was confusing. Had to call multiple times to resolve issues.', department: 'Billing', date: '2026-02-14' },
                { id: '6', rating: 4, category: 'food', feedback: 'Food quality has improved. Still could use more healthy options.', department: 'Dietary', date: '2026-02-14' },
                { id: '7', rating: 1, category: 'facilities', feedback: 'Room was not clean when I arrived. Found trash from previous patient.', department: 'Housekeeping', date: '2026-02-14' },
                { id: '8', rating: 5, category: 'nursing', feedback: 'The nurses in ICU were amazing. They saved my life and I am forever grateful.', department: 'ICU', date: '2026-02-14' },
              ];
              setFeedbackItems(sampleFeedback);
            }}
            className="w-full mb-4 bg-slate-100 text-slate-600 py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors"
          >
            Load Sample Feedback Data
          </button>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={feedbackItems.length === 0 || loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Feedback...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze Feedback
              </>
            )}
          </button>
        </>
      ) : (
        /* Results Section */
        result && (
          <div className="space-y-4">
            {/* Back Button */}
            <button
              onClick={() => setShowResults(false)}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back to feedback entry
            </button>

            {/* Executive Summary */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
                className="w-full p-4 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Executive Summary</span>
                </div>
                {expandedSection === 'summary' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'summary' && (
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-slate-800">{result.executiveSummary.totalFeedbackAnalyzed}</p>
                      <p className="text-xs text-slate-500">Feedback Analyzed</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">{result.executiveSummary.overallSatisfactionScore.toFixed(1)}</p>
                      <p className="text-xs text-slate-500">Satisfaction Score</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{result.executiveSummary.npsScore || 'N/A'}</p>
                      <p className="text-xs text-slate-500">NPS Score</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-slate-700">{result.executiveSummary.progressFromLastPeriod}</p>
                      <p className="text-xs text-slate-500">vs Last Period</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                        <ThumbsUp size={14} /> Key Strengths
                      </p>
                      <ul className="space-y-1">
                        {result.executiveSummary.keyStrengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <CheckCircle size={12} className="text-green-500 mt-1" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                        <AlertTriangle size={14} /> Critical Issues
                      </p>
                      <ul className="space-y-1">
                        {result.executiveSummary.criticalIssues.map((issue, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <AlertCircle size={12} className="text-red-500 mt-1" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">Top Priorities:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.executiveSummary.topPriorities.map((priority, idx) => (
                        <span key={idx} className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                          {idx + 1}. {priority}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sentiment Analysis */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'sentiment' ? null : 'sentiment')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-slate-800">Sentiment Analysis</span>
                </div>
                {expandedSection === 'sentiment' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'sentiment' && (
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`px-4 py-2 rounded-lg border ${getSentimentColor(result.sentimentAnalysis.overallSentiment)}`}>
                      <p className="text-sm font-medium capitalize">{result.sentimentAnalysis.overallSentiment.replace('_', ' ')}</p>
                      <p className="text-xs">Overall Sentiment</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Sentiment Score</p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${result.sentimentAnalysis.sentimentScore >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.abs(result.sentimentAnalysis.sentimentScore) * 50}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{result.sentimentAnalysis.sentimentScore.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Emotional Tone Detected:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sentimentAnalysis.emotionalTone.map((tone, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full capitalize">
                          {tone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Key Phrases:</p>
                      <div className="space-y-1">
                        {result.sentimentAnalysis.keyPhrases.slice(0, 5).map((phrase, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className={phrase.sentiment === 'positive' ? 'text-green-600' : phrase.sentiment === 'negative' ? 'text-red-600' : 'text-slate-600'}>
                              "{phrase.phrase}"
                            </span>
                            <span className="text-slate-400">×{phrase.frequency}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Aspect Sentiments:</p>
                      <div className="space-y-2">
                        {result.sentimentAnalysis.aspectSentiments.map((aspect, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">{aspect.aspect}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${aspect.sentiment === 'positive' ? 'bg-green-500' : aspect.sentiment === 'negative' ? 'bg-red-500' : 'bg-slate-400'}`}
                                  style={{ width: `${Math.abs(aspect.score) * 50}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-500">{aspect.mentions}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Identified Issues */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'issues' ? null : 'issues')}
                className="w-full p-4 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Identified Issues</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                    {result.identifiedIssues.length}
                  </span>
                </div>
                {expandedSection === 'issues' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'issues' && (
                <div className="p-4 space-y-3">
                  {result.identifiedIssues.map((issue, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-800">{issue.issue}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>
                              {issue.severity}
                            </span>
                            <span className="text-xs text-slate-500">{issue.frequency} occurrences</span>
                          </div>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {issue.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        <strong>Root Cause Hypothesis:</strong> {issue.rootCauseHypothesis}
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-slate-500">Affected Departments:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {issue.affectedDepartments.map((dept, i) => (
                            <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                      {issue.exampleQuotes.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-xs text-slate-500 mb-1">Example Quotes:</p>
                          <p className="text-xs text-slate-600 italic">"{issue.exampleQuotes[0]}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Positive Highlights */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'highlights' ? null : 'highlights')}
                className="w-full p-4 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Positive Highlights</span>
                </div>
                {expandedSection === 'highlights' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'highlights' && (
                <div className="p-4 grid grid-cols-2 gap-3">
                  {result.positiveHighlights.map((highlight, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <p className="font-medium text-slate-800">{highlight.highlight}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{highlight.category}</span>
                        <span>×{highlight.frequency}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {highlight.departments.slice(0, 3).map((dept, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actionable Insights */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'insights' ? null : 'insights')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-slate-800">Actionable Insights</span>
                </div>
                {expandedSection === 'insights' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'insights' && (
                <div className="p-4 space-y-3">
                  {result.actionableInsights.sort((a, b) => a.priority - b.priority).map((insight, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {insight.priority}
                          </span>
                          <div>
                            <p className="font-medium text-slate-800">{insight.insight}</p>
                            <p className="text-sm text-slate-600 mt-1">{insight.recommendation}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(insight.impact)}`}>
                            {insight.impact} impact
                          </span>
                          <span className="text-xs text-slate-500">{insight.effort.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        Expected Outcome: {insight.expectedOutcome}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Department Analysis */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'departments' ? null : 'departments')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-slate-800">Department Analysis</span>
                </div>
                {expandedSection === 'departments' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'departments' && (
                <div className="p-4">
                  <div className="space-y-3">
                    {result.departmentAnalysis.map((dept, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                              <Building size={16} className="text-slate-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{dept.department}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                      key={star}
                                      size={10} 
                                      className={star <= Math.round(dept.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                                  />
                                  ))}
                                </div>
                                <span className="text-xs text-slate-500">{dept.averageRating.toFixed(1)}</span>
                                <span className="text-xs text-slate-400">({dept.feedbackVolume} reviews)</span>
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 text-xs ${dept.comparisonToAverage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dept.comparisonToAverage >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {dept.comparisonToAverage >= 0 ? '+' : ''}{dept.comparisonToAverage.toFixed(1)} vs avg
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div>
                            <p className="text-xs text-green-600 mb-1">Strengths:</p>
                            <div className="flex flex-wrap gap-1">
                              {dept.topStrengths.map((s, i) => (
                                <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-red-600 mb-1">Concerns:</p>
                            <div className="flex flex-wrap gap-1">
                              {dept.topConcerns.map((c, i) => (
                                <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Response Recommendations */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'responses' ? null : 'responses')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-slate-800">Recommended Responses</span>
                </div>
                {expandedSection === 'responses' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'responses' && (
                <div className="p-4 space-y-3">
                  {result.responseRecommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          rec.responseType === 'apologize' ? 'bg-red-100 text-red-700' :
                          rec.responseType === 'acknowledge' ? 'bg-blue-100 text-blue-700' :
                          rec.responseType === 'escalate' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {rec.responseType}
                        </span>
                        <span className="text-xs text-slate-500">Tone: {rec.tone}</span>
                      </div>
                      <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded-lg italic">
                        "{rec.suggestedResponse}"
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-slate-500">Follow-up Actions:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rec.followUpActions.map((action, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trends */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'trends' ? null : 'trends')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-slate-800">Trends</span>
                </div>
                {expandedSection === 'trends' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'trends' && (
                <div className="p-4 grid grid-cols-2 gap-3">
                  {result.trends.map((trend, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-700">{trend.category}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(trend.trend)}
                          <span className={`text-xs ${trend.trend === 'improving' ? 'text-green-600' : trend.trend === 'declining' ? 'text-red-600' : 'text-slate-500'}`}>
                            {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{trend.significance}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AIPatientFeedbackAnalyzer;
