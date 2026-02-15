import React, { useState, useEffect } from 'react';
import { useData } from '../src/contexts/DataContext';
import { 
    AlertTriangle, Package, Search, Plus, Brain, Sparkles, 
    Calculator, ShieldAlert, Loader2, CheckCircle, XCircle,
    Pill, FileText, ChevronDown, ChevronUp, TrendingUp, 
    Calendar, DollarSign, ShoppingCart, AlertCircle
} from 'lucide-react';
import { useDosageCalculator, useAllergyCheck, usePrescriptionGenerator, useAntimicrobialStewardship, useInventoryForecast } from '../hooks/useAI';
import { DosageResult, AllergyCheckResult, PrescriptionResult, AntimicrobialResult, InventoryForecastResult } from '../types';
import { useTheme } from '../src/contexts/ThemeContext';

const Pharmacy: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { inventory } = useData();
    const [activeTab, setActiveTab] = useState<'inventory' | 'forecast' | 'dosage' | 'allergy' | 'prescription' | 'antimicrobial'>('inventory');
    
    // Dosage Calculator State
    const [dosageInput, setDosageInput] = useState({
        medication: '',
        weight: '',
        age: '',
        gender: 'Male',
        indication: '',
        creatinineClearance: '',
        serumCreatinine: '',
        hepaticImpairment: 'None'
    });
    const { data: dosageResult, loading: dosageLoading, execute: calculateDosage } = useDosageCalculator();
    
    // Allergy Check State
    const [allergyInput, setAllergyInput] = useState({
        allergies: '',
        medications: '',
        conditions: '',
        age: '',
        gender: 'Male'
    });
    const { data: allergyResult, loading: allergyLoading, execute: checkAllergies } = useAllergyCheck();
    
    // Prescription Generator State
    const [prescriptionInput, setPrescriptionInput] = useState({
        diagnosis: '',
        age: '',
        weight: '',
        gender: 'Male',
        allergies: '',
        currentMeds: '',
        renalFunction: '',
        hepaticFunction: 'Normal'
    });
    const { data: prescriptionResult, loading: prescriptionLoading, execute: generatePrescription } = usePrescriptionGenerator();
    
    // Antimicrobial Stewardship State
    const [antimicrobialInput, setAntimicrobialInput] = useState({
        infectionType: '',
        organism: '',
        sensitivity: '',
        currentAntibiotics: '',
        age: '',
        renalFunction: '',
        allergies: ''
    });
    const { data: antimicrobialResult, loading: antimicrobialLoading, execute: getAntimicrobialRecommendation } = useAntimicrobialStewardship();

    // Inventory Forecast State
    const { data: forecastResult, loading: forecastLoading, execute: runForecast } = useInventoryForecast();
    const [showForecastPanel, setShowForecastPanel] = useState(false);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'In Stock': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'Low Stock': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
            case 'Out of Stock': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
        }
    };

    const handleDosageCalculate = async () => {
        if (!dosageInput.medication) return;
        await calculateDosage({
            medication: dosageInput.medication,
            patientWeight: dosageInput.weight ? parseFloat(dosageInput.weight) : undefined,
            patientAge: dosageInput.age ? parseInt(dosageInput.age) : undefined,
            patientGender: dosageInput.gender,
            indication: dosageInput.indication || undefined,
            renalFunction: {
                creatinineClearance: dosageInput.creatinineClearance ? parseFloat(dosageInput.creatinineClearance) : undefined,
                serumCreatinine: dosageInput.serumCreatinine ? parseFloat(dosageInput.serumCreatinine) : undefined,
            },
            hepaticImpairment: dosageInput.hepaticImpairment as 'None' | 'Mild' | 'Moderate' | 'Severe'
        });
    };

    const handleAllergyCheck = async () => {
        if (!allergyInput.allergies || !allergyInput.medications) return;
        await checkAllergies({
            patientAllergies: allergyInput.allergies.split(',').map(a => a.trim()),
            medications: allergyInput.medications.split(',').map(m => m.trim()),
            patientConditions: allergyInput.conditions ? allergyInput.conditions.split(',').map(c => c.trim()) : undefined,
            age: allergyInput.age ? parseInt(allergyInput.age) : undefined,
            gender: allergyInput.gender
        });
    };

    const handlePrescriptionGenerate = async () => {
        if (!prescriptionInput.diagnosis) return;
        await generatePrescription({
            diagnosis: prescriptionInput.diagnosis,
            patientAge: prescriptionInput.age ? parseInt(prescriptionInput.age) : undefined,
            patientWeight: prescriptionInput.weight ? parseFloat(prescriptionInput.weight) : undefined,
            patientGender: prescriptionInput.gender,
            allergies: prescriptionInput.allergies ? prescriptionInput.allergies.split(',').map(a => a.trim()) : undefined,
            renalFunction: prescriptionInput.renalFunction ? parseFloat(prescriptionInput.renalFunction) : undefined,
            hepaticFunction: prescriptionInput.hepaticFunction as 'Normal' | 'Impaired'
        });
    };

    const handleAntimicrobialRequest = async () => {
        if (!antimicrobialInput.infectionType) return;
        await getAntimicrobialRecommendation({
            infectionType: antimicrobialInput.infectionType,
            cultureResults: antimicrobialInput.organism ? [{
                organism: antimicrobialInput.organism,
                sensitivity: antimicrobialInput.sensitivity.split(',').map(s => s.trim())
            }] : undefined,
            currentAntibiotics: antimicrobialInput.currentAntibiotics ? antimicrobialInput.currentAntibiotics.split(',').map(a => a.trim()) : undefined,
            patientAge: antimicrobialInput.age ? parseInt(antimicrobialInput.age) : undefined,
            renalFunction: antimicrobialInput.renalFunction ? parseFloat(antimicrobialInput.renalFunction) : undefined,
            allergyInfo: antimicrobialInput.allergies ? antimicrobialInput.allergies.split(',').map(a => a.trim()) : undefined
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pharmacy & AI Clinical Support</h1>
                    <p className="text-slate-500 dark:text-slate-400">AI-powered medication management and clinical decision support.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search medicines..." 
                            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-sm w-64 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                        />
                    </div>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md flex items-center gap-2">
                        <Plus size={18} /> Add Item
                    </button>
                </div>
            </div>

            {/* AI Features Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                    {[
                        { id: 'inventory', label: 'Inventory', icon: Package },
                        { id: 'forecast', label: 'AI Forecast', icon: TrendingUp, ai: true },
                        { id: 'dosage', label: 'Dosage Calculator', icon: Calculator, ai: true },
                        { id: 'allergy', label: 'Allergy Check', icon: ShieldAlert, ai: true },
                        { id: 'prescription', label: 'Smart Prescription', icon: FileText, ai: true },
                        { id: 'antimicrobial', label: 'Antimicrobial', icon: Pill, ai: true }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                                activeTab === tab.id 
                                    ? 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 bg-teal-50/50 dark:bg-teal-900/20' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {tab.ai && (
                                <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-full flex items-center gap-0.5">
                                    <Sparkles size={8} /> AI
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Inventory Tab */}
                    {activeTab === 'inventory' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-4 rounded-xl flex items-center gap-4">
                                    <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full text-red-600 dark:text-red-400">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">Items Low/Out of Stock</p>
                                    </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4 rounded-xl flex items-center gap-4">
                                    <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full text-green-600 dark:text-green-400">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">1,240</p>
                                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">Total Items Tracked</p>
                                    </div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 p-4 rounded-xl flex items-center gap-4">
                                    <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full text-purple-600 dark:text-purple-400">
                                        <Brain size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">4</p>
                                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">AI Tools Available</p>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                        <th className="px-6 py-4">Item Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Stock Level</th>
                                        <th className="px-6 py-4">Last Updated</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {inventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.category}</td>
                                            <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">
                                                {item.stock} <span className="text-xs text-slate-400 dark:text-slate-500">{item.unit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{item.lastUpdated}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline">Restock</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* AI Inventory Forecast Tab */}
                    {activeTab === 'forecast' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Brain className="text-purple-600 dark:text-purple-400" size={20} />
                                        <span className="font-semibold text-purple-900 dark:text-purple-300">Smart Inventory Forecasting</span>
                                        <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Sparkles size={10} /> AI
                                        </span>
                                    </div>
                                    <button 
                                        onClick={async () => {
                                            await runForecast({
                                                items: inventory,
                                                currentStock: inventory.map(i => ({
                                                    itemId: i.id,
                                                    quantity: i.stock,
                                                    reorderLevel: 50
                                                }))
                                            });
                                            setShowForecastPanel(true);
                                        }}
                                        disabled={forecastLoading}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {forecastLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <TrendingUp size={16} />
                                                Run AI Forecast
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-sm text-purple-700 dark:text-purple-400 mt-2">Predicts demand, optimizes reorder schedules, and identifies cost-saving opportunities.</p>
                            </div>

                            {forecastResult ? (
                                <div className="space-y-6">
                                    {/* Demand Forecasts */}
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                            <TrendingUp size={18} className="text-blue-500" />
                                            Demand Forecasts
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {forecastResult.demandForecasts.slice(0, 6).map((forecast, idx) => (
                                                <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{forecast.itemName}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                            forecast.trend === 'increasing' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                                            forecast.trend === 'decreasing' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                            'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                                                        }`}>
                                                            {forecast.trend}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{forecast.predictedDemand} units</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{forecast.timeframe}</p>
                                                    <div className="mt-2 flex items-center gap-1">
                                                        <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                                                            <div 
                                                                className="bg-blue-500 h-1.5 rounded-full" 
                                                                style={{ width: `${forecast.confidence * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">{Math.round(forecast.confidence * 100)}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reorder Recommendations */}
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                            <ShoppingCart size={18} className="text-orange-500" />
                                            Reorder Recommendations
                                        </h3>
                                        <div className="space-y-3">
                                            {forecastResult.reorderRecommendations.map((rec, idx) => (
                                                <div key={idx} className={`p-3 rounded-lg border ${
                                                    rec.urgency === 'Immediate' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                                                    rec.urgency === 'Soon' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                                                    'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                                                }`}>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="font-medium text-slate-800 dark:text-white">{rec.itemName}</span>
                                                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                                                rec.urgency === 'Immediate' ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                                                                rec.urgency === 'Soon' ? 'bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300' :
                                                                'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                                                            }`}>
                                                                {rec.urgency}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Order: {rec.recommendedOrderQuantity}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <span>Current: {rec.currentStock}</span>
                                                        <span>Stockout: {rec.estimatedStockoutDate}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Expiry Alerts */}
                                    {forecastResult.expiryAlerts.length > 0 && (
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                                <AlertCircle size={18} className="text-red-500" />
                                                Expiry Alerts
                                            </h3>
                                            <div className="space-y-2">
                                                {forecastResult.expiryAlerts.map((alert, idx) => (
                                                    <div key={idx} className={`p-3 rounded-lg flex justify-between items-center ${
                                                        alert.daysUntilExpiry <= 7 ? 'bg-red-50 dark:bg-red-900/20' :
                                                        alert.daysUntilExpiry <= 30 ? 'bg-orange-50 dark:bg-orange-900/20' :
                                                        'bg-yellow-50 dark:bg-yellow-900/20'
                                                    }`}>
                                                        <div>
                                                            <span className="font-medium text-slate-800 dark:text-white">{alert.itemName}</span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">Batch: {alert.batchNumber}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{alert.daysUntilExpiry} days</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{alert.action}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cost Optimizations */}
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                            <DollarSign size={18} className="text-green-500" />
                                            Cost Optimization Opportunities
                                        </h3>
                                        <div className="space-y-3">
                                            {forecastResult.costOptimizations.map((opt, idx) => (
                                                <div key={idx} className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-green-800 dark:text-green-300">{opt.suggestion}</span>
                                                        <span className="text-sm font-bold text-green-700 dark:text-green-400">Save ${opt.potentialSavings}</span>
                                                    </div>
                                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{opt.implementation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Auto Purchase Orders */}
                                    {forecastResult.autoPurchaseOrders && forecastResult.autoPurchaseOrders.length > 0 && (
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                                <FileText size={18} className="text-purple-500" />
                                                AI-Generated Purchase Orders
                                            </h3>
                                            <div className="space-y-4">
                                                {forecastResult.autoPurchaseOrders.map((po, idx) => (
                                                    <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-4">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="font-medium text-purple-900 dark:text-purple-300">Vendor: {po.vendor}</span>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                                                po.priority === 'High' ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                                                                po.priority === 'Medium' ? 'bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300' :
                                                                'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                                                            }`}>
                                                                {po.priority} Priority
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2 mb-3">
                                                            {po.items.map((item, i) => (
                                                                <div key={i} className="flex justify-between text-sm">
                                                                    <span className="text-slate-700 dark:text-slate-300">{item.itemName}</span>
                                                                    <span className="text-slate-500 dark:text-slate-400">Qty: {item.quantity} • ${item.estimatedCost}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between items-center pt-2 border-t border-purple-200 dark:border-purple-800">
                                                            <span className="font-bold text-purple-900 dark:text-purple-300">Total: ${po.totalEstimatedCost}</span>
                                                            <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-700">
                                                                Approve Order
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
                                    <TrendingUp size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-500 dark:text-slate-400 mb-4">Click "Run AI Forecast" to analyze inventory patterns</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">AI will predict demand, identify reorder needs, and suggest cost optimizations</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dosage Calculator Tab */}
                    {activeTab === 'dosage' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Brain className="text-purple-600 dark:text-purple-400" size={20} />
                                        <span className="font-semibold text-purple-900 dark:text-purple-300">Smart Dosage Calculator</span>
                                        <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Sparkles size={10} /> AI
                                        </span>
                                    </div>
                                    <p className="text-sm text-purple-700 dark:text-purple-400">Calculates optimal dosing based on patient parameters, renal function, and drug interactions.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medication *</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={dosageInput.medication}
                                        onChange={e => setDosageInput({...dosageInput, medication: e.target.value})}
                                        placeholder="e.g., Amoxicillin, Metformin"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Weight (kg)</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={dosageInput.weight}
                                            onChange={e => setDosageInput({...dosageInput, weight: e.target.value})}
                                            placeholder="e.g., 70"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Age</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={dosageInput.age}
                                            onChange={e => setDosageInput({...dosageInput, age: e.target.value})}
                                            placeholder="Years"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={dosageInput.gender}
                                            onChange={e => setDosageInput({...dosageInput, gender: e.target.value})}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hepatic Impairment</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={dosageInput.hepaticImpairment}
                                            onChange={e => setDosageInput({...dosageInput, hepaticImpairment: e.target.value})}
                                        >
                                            <option>None</option>
                                            <option>Mild</option>
                                            <option>Moderate</option>
                                            <option>Severe</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Indication</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={dosageInput.indication}
                                        onChange={e => setDosageInput({...dosageInput, indication: e.target.value})}
                                        placeholder="e.g., Pneumonia, Diabetes"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CrCl (mL/min)</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={dosageInput.creatinineClearance}
                                            onChange={e => setDosageInput({...dosageInput, creatinineClearance: e.target.value})}
                                            placeholder="Creatinine clearance"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Serum Cr (mg/dL)</label>
                                        <input 
                                            type="number"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={dosageInput.serumCreatinine}
                                            onChange={e => setDosageInput({...dosageInput, serumCreatinine: e.target.value})}
                                            placeholder="Serum creatinine"
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={handleDosageCalculate}
                                    disabled={!dosageInput.medication || dosageLoading}
                                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {dosageLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Calculating...
                                        </>
                                    ) : (
                                        <>
                                            <Calculator size={18} />
                                            Calculate Dosage
                                        </>
                                    )}
                                </button>
                            </div>

                            <div>
                                {dosageResult ? (
                                    <div className="bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-900 rounded-xl p-6 space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Dosage Recommendation</h3>
                                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Sparkles size={10} /> AI-Generated
                                            </span>
                                        </div>
                                        
                                        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-lg p-4">
                                            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-1">Recommended Dose</p>
                                            <p className="text-2xl font-bold text-teal-800 dark:text-teal-300">{dosageResult.recommendedDose}</p>
                                            <p className="text-sm text-teal-600 dark:text-teal-400">{dosageResult.doseFrequency} - {dosageResult.route}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Max Daily Dose</p>
                                                <p className="font-bold text-slate-800 dark:text-white">{dosageResult.maxDailyDose}</p>
                                            </div>
                                            {dosageResult.renalAdjustment && (
                                                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                                                    <p className="text-xs text-amber-600 dark:text-amber-400">Renal Adjustment</p>
                                                    <p className="font-bold text-amber-800 dark:text-amber-300">{dosageResult.renalAdjustment}</p>
                                                </div>
                                            )}
                                        </div>

                                        {dosageResult.adjustments.length > 0 && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Adjustments Applied</p>
                                                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                                                    {dosageResult.adjustments.map((adj, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                                                            {adj}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {dosageResult.warnings.length > 0 && (
                                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-1">
                                                    <AlertTriangle size={14} /> Warnings
                                                </p>
                                                <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                                                    {dosageResult.warnings.map((warn, i) => (
                                                        <li key={i}>• {warn}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                                        <Calculator size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">Enter medication and patient details to calculate dosage</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Allergy Check Tab */}
                    {activeTab === 'allergy' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldAlert className="text-red-600 dark:text-red-400" size={20} />
                                        <span className="font-semibold text-red-900 dark:text-red-300">Allergy & Contraindication Checker</span>
                                        <span className="px-2 py-0.5 bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Sparkles size={10} /> AI
                                        </span>
                                    </div>
                                    <p className="text-sm text-red-700 dark:text-red-400">Checks for allergic reactions, cross-reactivity, and contraindications.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Allergies *</label>
                                    <textarea 
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-20 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={allergyInput.allergies}
                                        onChange={e => setAllergyInput({...allergyInput, allergies: e.target.value})}
                                        placeholder="Comma-separated list, e.g., Penicillin, Sulfa, Aspirin"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medications to Check *</label>
                                    <textarea 
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none h-20 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={allergyInput.medications}
                                        onChange={e => setAllergyInput({...allergyInput, medications: e.target.value})}
                                        placeholder="Comma-separated list of medications to check"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Age</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={allergyInput.age}
                                            onChange={e => setAllergyInput({...allergyInput, age: e.target.value})}
                                            placeholder="Years"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={allergyInput.gender}
                                            onChange={e => setAllergyInput({...allergyInput, gender: e.target.value})}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Conditions</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={allergyInput.conditions}
                                        onChange={e => setAllergyInput({...allergyInput, conditions: e.target.value})}
                                        placeholder="e.g., Asthma, Diabetes (comma-separated)"
                                    />
                                </div>

                                <button 
                                    onClick={handleAllergyCheck}
                                    disabled={!allergyInput.allergies || !allergyInput.medications || allergyLoading}
                                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {allergyLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Checking...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldAlert size={18} />
                                            Check Allergies
                                        </>
                                    )}
                                </button>
                            </div>

                            <div>
                                {allergyResult ? (
                                    <div className="bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-900 rounded-xl p-6 space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Allergy Check Results</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${allergyResult.hasAlerts ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'}`}>
                                                {allergyResult.hasAlerts ? 'Alerts Found' : 'Safe'}
                                            </span>
                                        </div>

                                        {allergyResult.alerts.length > 0 && (
                                            <div className="space-y-3">
                                                {allergyResult.alerts.map((alert, i) => (
                                                    <div key={i} className={`p-4 rounded-lg border ${
                                                        alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                                                        alert.severity === 'high' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                                                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                                    }`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <AlertTriangle className={`${
                                                                alert.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                                                                alert.severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                                                                'text-yellow-600 dark:text-yellow-400'
                                                            }`} size={18} />
                                                            <span className="font-bold text-slate-800 dark:text-white">{alert.medication}</span>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                alert.severity === 'critical' ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                                                                alert.severity === 'high' ? 'bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300' :
                                                                'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                                                            }`}>
                                                                {alert.severity.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{alert.reaction}</p>
                                                        {alert.crossReactivity.length > 0 && (
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Cross-reactivity: {alert.crossReactivity.join(', ')}
                                                            </p>
                                                        )}
                                                        {alert.alternativeMedications.length > 0 && (
                                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                                Alternatives: {alert.alternativeMedications.join(', ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {allergyResult.contraindications.length > 0 && (
                                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Contraindications</p>
                                                {allergyResult.contraindications.map((c, i) => (
                                                    <div key={i} className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                                                        <strong>{c.medication}:</strong> {c.contraindication} ({c.reason})
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {allergyResult.safeAlternatives.length > 0 && (
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-1">
                                                    <CheckCircle size={14} /> Safe Alternatives
                                                </p>
                                                <p className="text-sm text-green-600 dark:text-green-400">{allergyResult.safeAlternatives.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                                        <ShieldAlert size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">Enter allergies and medications to check for interactions</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Prescription Generator Tab */}
                    {activeTab === 'prescription' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-100 dark:border-teal-800 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="text-teal-600 dark:text-teal-400" size={20} />
                                        <span className="font-semibold text-teal-900 dark:text-teal-300">Smart Prescription Generator</span>
                                        <span className="px-2 py-0.5 bg-teal-200 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Sparkles size={10} /> AI
                                        </span>
                                    </div>
                                    <p className="text-sm text-teal-700 dark:text-teal-400">Generates evidence-based prescription recommendations based on diagnosis.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diagnosis *</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={prescriptionInput.diagnosis}
                                        onChange={e => setPrescriptionInput({...prescriptionInput, diagnosis: e.target.value})}
                                        placeholder="e.g., Hypertension, Type 2 Diabetes"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={prescriptionInput.age}
                                            onChange={e => setPrescriptionInput({...prescriptionInput, age: e.target.value})}
                                            placeholder="Years"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={prescriptionInput.weight}
                                            onChange={e => setPrescriptionInput({...prescriptionInput, weight: e.target.value})}
                                            placeholder="kg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={prescriptionInput.gender}
                                            onChange={e => setPrescriptionInput({...prescriptionInput, gender: e.target.value})}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Allergies</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={prescriptionInput.allergies}
                                        onChange={e => setPrescriptionInput({...prescriptionInput, allergies: e.target.value})}
                                        placeholder="Comma-separated list"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Renal Function (CrCl)</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={prescriptionInput.renalFunction}
                                            onChange={e => setPrescriptionInput({...prescriptionInput, renalFunction: e.target.value})}
                                            placeholder="mL/min"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hepatic Function</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={prescriptionInput.hepaticFunction}
                                            onChange={e => setPrescriptionInput({...prescriptionInput, hepaticFunction: e.target.value})}
                                        >
                                            <option>Normal</option>
                                            <option>Impaired</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePrescriptionGenerate}
                                    disabled={!prescriptionInput.diagnosis || prescriptionLoading}
                                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {prescriptionLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={18} />
                                            Generate Prescription
                                        </>
                                    )}
                                </button>
                            </div>

                            <div>
                                {prescriptionResult ? (
                                    <div className="bg-white dark:bg-slate-800 border-2 border-teal-200 dark:border-teal-900 rounded-xl p-6 space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Prescription Recommendation</h3>
                                            <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Sparkles size={10} /> AI-Generated
                                            </span>
                                        </div>

                                        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-lg p-4">
                                            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-1">Primary Medication</p>
                                            <p className="text-xl font-bold text-teal-800 dark:text-teal-300">{prescriptionResult.primaryPrescription.medication}</p>
                                            <p className="text-sm text-teal-600 dark:text-teal-400">
                                                {prescriptionResult.primaryPrescription.dose} {prescriptionResult.primaryPrescription.frequency} via {prescriptionResult.primaryPrescription.route}
                                            </p>
                                            <p className="text-sm text-teal-600 dark:text-teal-400">Duration: {prescriptionResult.primaryPrescription.duration}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                                <p className="text-slate-500 dark:text-slate-400">Quantity</p>
                                                <p className="font-bold text-slate-800 dark:text-white">{prescriptionResult.primaryPrescription.quantity}</p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                                <p className="text-slate-500 dark:text-slate-400">Refills</p>
                                                <p className="font-bold text-slate-800 dark:text-white">{prescriptionResult.primaryPrescription.refills}</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Instructions</p>
                                            <p className="text-sm text-blue-600 dark:text-blue-300">{prescriptionResult.primaryPrescription.instructions}</p>
                                        </div>

                                        {prescriptionResult.primaryPrescription.warnings.length > 0 && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                                                    <AlertTriangle size={12} /> Warnings
                                                </p>
                                                <ul className="text-xs text-amber-600 dark:text-amber-300 space-y-1">
                                                    {prescriptionResult.primaryPrescription.warnings.map((w, i) => (
                                                        <li key={i}>• {w}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {prescriptionResult.counselingPoints.length > 0 && (
                                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-1">Patient Counseling Points</p>
                                                <ul className="text-xs text-purple-600 dark:text-purple-300 space-y-1">
                                                    {prescriptionResult.counselingPoints.map((c, i) => (
                                                        <li key={i}>• {c}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                                        <FileText size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">Enter a diagnosis to generate prescription recommendations</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Antimicrobial Stewardship Tab */}
                    {activeTab === 'antimicrobial' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Pill className="text-amber-600 dark:text-amber-400" size={20} />
                                        <span className="font-semibold text-amber-900 dark:text-amber-300">Antimicrobial Stewardship</span>
                                        <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Sparkles size={10} /> AI
                                        </span>
                                    </div>
                                    <p className="text-sm text-amber-700 dark:text-amber-400">Evidence-based antibiotic recommendations and resistance monitoring.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Infection Type *</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={antimicrobialInput.infectionType}
                                        onChange={e => setAntimicrobialInput({...antimicrobialInput, infectionType: e.target.value})}
                                        placeholder="e.g., Pneumonia, UTI, Sepsis"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Organism (if known)</label>
                                        <input 
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={antimicrobialInput.organism}
                                            onChange={e => setAntimicrobialInput({...antimicrobialInput, organism: e.target.value})}
                                            placeholder="e.g., E. coli"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sensitivities</label>
                                        <input 
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={antimicrobialInput.sensitivity}
                                            onChange={e => setAntimicrobialInput({...antimicrobialInput, sensitivity: e.target.value})}
                                            placeholder="Comma-separated"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Age</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={antimicrobialInput.age}
                                            onChange={e => setAntimicrobialInput({...antimicrobialInput, age: e.target.value})}
                                            placeholder="Years"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Renal Function (CrCl)</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={antimicrobialInput.renalFunction}
                                            onChange={e => setAntimicrobialInput({...antimicrobialInput, renalFunction: e.target.value})}
                                            placeholder="mL/min"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Antibiotics</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={antimicrobialInput.currentAntibiotics}
                                        onChange={e => setAntimicrobialInput({...antimicrobialInput, currentAntibiotics: e.target.value})}
                                        placeholder="Comma-separated list"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Allergies</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={antimicrobialInput.allergies}
                                        onChange={e => setAntimicrobialInput({...antimicrobialInput, allergies: e.target.value})}
                                        placeholder="Comma-separated list"
                                    />
                                </div>

                                <button 
                                    onClick={handleAntimicrobialRequest}
                                    disabled={!antimicrobialInput.infectionType || antimicrobialLoading}
                                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {antimicrobialLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Pill size={18} />
                                            Get Recommendation
                                        </>
                                    )}
                                </button>
                            </div>

                            <div>
                                {antimicrobialResult ? (
                                    <div className="bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-900 rounded-xl p-6 space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Antimicrobial Recommendation</h3>
                                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Sparkles size={10} /> AI-Generated
                                            </span>
                                        </div>

                                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-4">
                                            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Recommended Antibiotic</p>
                                            <p className="text-lg font-bold text-amber-800 dark:text-amber-300">{antimicrobialResult.recommendedAntibiotic}</p>
                                            <p className="text-sm text-amber-600 dark:text-amber-400">Duration: {antimicrobialResult.recommendedDuration}</p>
                                        </div>

                                        {antimicrobialResult.alternativeOptions.length > 0 && (
                                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Alternative Options</p>
                                                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                                    {antimicrobialResult.alternativeOptions.map((alt, i) => (
                                                        <li key={i}>• {alt}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {antimicrobialResult.resistanceWarnings.length > 0 && (
                                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-1">
                                                    <AlertTriangle size={12} /> Resistance Warnings
                                                </p>
                                                <ul className="text-xs text-red-600 dark:text-red-300 space-y-1">
                                                    {antimicrobialResult.resistanceWarnings.map((w, i) => (
                                                        <li key={i}>• {w}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {antimicrobialResult.stewardshipAlerts.length > 0 && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Stewardship Alerts</p>
                                                <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                                                    {antimicrobialResult.stewardshipAlerts.map((a, i) => (
                                                        <li key={i}>• {a}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {antimicrobialResult.deEscalationOptions.length > 0 && (
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                                                    <CheckCircle size={12} /> De-escalation Options
                                                </p>
                                                <ul className="text-xs text-green-600 dark:text-green-300 space-y-1">
                                                    {antimicrobialResult.deEscalationOptions.map((d, i) => (
                                                        <li key={i}>• {d}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                                        <Pill size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">Enter infection details to get antibiotic recommendations</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pharmacy;
