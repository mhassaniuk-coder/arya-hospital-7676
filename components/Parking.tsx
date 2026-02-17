import React, { useState } from 'react';
import { ParkingSpot } from '../types';
import {
    Car, Clock, User, ShieldCheck, MapPin,
    Search, Filter, Plus, X, ArrowRight, Ban, CheckCircle2
} from 'lucide-react';

const MOCK_PARKING: ParkingSpot[] = Array.from({ length: 24 }, (_, i) => ({
    id: `P-${i + 1}`,
    number: `A-${i + 1}`,
    section: i < 4 ? 'Ambulance' : i < 12 ? 'Staff' : i < 20 ? 'Visitor' : 'Disabled',
    status: Math.random() > 0.6 ? 'Occupied' : Math.random() > 0.8 ? 'Reserved' : 'Available',
    vehicleNumber: Math.random() > 0.6 ? `ABC-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    checkInTime: Math.random() > 0.6 ? '09:00 AM' : undefined,
    assignedTo: i < 12 && Math.random() > 0.6 ? 'Dr. Smith' : undefined
}));

const SECTIONS = ['All', 'Ambulance', 'Staff', 'Visitor', 'Disabled'];

const Parking: React.FC = () => {
    const [spots, setSpots] = useState<ParkingSpot[]>(MOCK_PARKING);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterSection, setFilterSection] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [assignment, setAssignment] = useState({
        vehicleNumber: '',
        assignedTo: '',
        reservedFor: ''
    });

    const stats = {
        total: spots.length,
        occupied: spots.filter(s => s.status === 'Occupied').length,
        available: spots.filter(s => s.status === 'Available').length,
        reserved: spots.filter(s => s.status === 'Reserved').length
    };

    const handleSpotAction = () => {
        if (!selectedSpot) return;

        if (selectedSpot.status === 'Available') {
            // Check In
            setSpots(spots.map(s => s.id === selectedSpot.id ? {
                ...s,
                status: 'Occupied',
                vehicleNumber: assignment.vehicleNumber,
                assignedTo: assignment.assignedTo,
                checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } : s));
        } else {
            // Check Out / Release
            setSpots(spots.map(s => s.id === selectedSpot.id ? {
                ...s,
                status: 'Available',
                vehicleNumber: undefined,
                assignedTo: undefined,
                checkInTime: undefined,
                reservedFor: undefined
            } : s));
        }
        setIsModalOpen(false);
        setSelectedSpot(null);
        setAssignment({ vehicleNumber: '', assignedTo: '', reservedFor: '' });
    };

    const filteredSpots = spots.filter(spot => {
        const matchesSection = filterSection === 'All' || spot.section === filterSection;
        const matchesSearch = spot.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (spot.vehicleNumber && spot.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (spot.assignedTo && spot.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSection && matchesSearch;
    });

    const getSpotColor = (spot: ParkingSpot) => {
        if (spot.status === 'Occupied') return 'bg-background-secondary border-border opacity-80';
        if (spot.status === 'Reserved') return 'bg-warning-light border-warning-dark';

        switch (spot.section) {
            case 'Ambulance': return 'bg-danger-light border-danger-dark hover:bg-danger-light/80';
            case 'Staff': return 'bg-info-light border-info-dark hover:bg-info-light/80';
            case 'Disabled': return 'bg-purple-50 border-purple-300 hover:bg-purple-100';
            default: return 'bg-success-light border-success-dark hover:bg-success-light/80';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Parking Management</h1>
                    <p className="text-foreground-muted">Manage real-time parking availability and assignments.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Total Spots</p>
                            <h3 className="text-2xl font-bold text-foreground-primary mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-info-light rounded-lg">
                            <MapPin className="text-info-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Available</p>
                            <h3 className="text-2xl font-bold text-success mt-1">{stats.available}</h3>
                        </div>
                        <div className="p-2 bg-success-light rounded-lg">
                            <Car className="text-success-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Occupied</p>
                            <h3 className="text-2xl font-bold text-foreground-secondary mt-1">{stats.occupied}</h3>
                        </div>
                        <div className="p-2 bg-background-secondary rounded-lg">
                            <Car className="text-foreground-muted" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Reserved</p>
                            <h3 className="text-2xl font-bold text-warning-dark mt-1">{stats.reserved}</h3>
                        </div>
                        <div className="p-2 bg-warning-light rounded-lg">
                            <ShieldCheck className="text-warning-dark" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search spot, vehicle, or owner..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent theme-transition"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {SECTIONS.map(section => (
                        <button
                            key={section}
                            onClick={() => setFilterSection(section)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap theme-transition ${filterSection === section
                                ? 'bg-accent/10 text-accent'
                                : 'text-foreground-secondary hover:bg-background-secondary'
                                }`}
                        >
                            {section}
                        </button>
                    ))}
                </div>
            </div>

            {/* Parking Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {filteredSpots.map(spot => (
                    <div
                        key={spot.id}
                        onClick={() => { setSelectedSpot(spot); setIsModalOpen(true); }}
                        className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center min-h-[120px] transition-all hover:scale-105 ${getSpotColor(spot)}`}
                    >
                        <div className="text-[10px] font-bold uppercase mb-2 text-foreground-muted">{spot.section}</div>

                        {spot.status === 'Occupied' ? (
                            <div className="flex flex-col items-center">
                                <Car size={32} className="text-foreground-secondary mb-1" />
                                <span className="text-[10px] font-mono font-bold text-foreground-primary bg-background-primary px-1 rounded border border-border">
                                    {spot.vehicleNumber}
                                </span>
                            </div>
                        ) : spot.status === 'Reserved' ? (
                            <div className="flex flex-col items-center">
                                <ShieldCheck size={32} className="text-warning-dark mb-1" />
                                <span className="text-[10px] font-bold text-warning-dark">Reserved</span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-foreground-secondary">{spot.number}</span>
                        )}

                        <span className={`mt-2 text-[10px] font-bold uppercase ${spot.status === 'Available' ? 'text-success' : 'text-foreground-muted'
                            }`}>
                            {spot.status}
                        </span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center bg-background-primary p-4 rounded-xl border border-border-muted">
                <div className="flex items-center gap-2 text-sm text-foreground-secondary"><span className="w-3 h-3 bg-danger-light border border-danger-dark rounded"></span> Ambulance</div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary"><span className="w-3 h-3 bg-info-light border border-info-dark rounded"></span> Staff</div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary"><span className="w-3 h-3 bg-success-light border border-success-dark rounded"></span> Visitor</div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary"><span className="w-3 h-3 bg-purple-50 border border-purple-300 rounded"></span> Disabled</div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary"><span className="w-3 h-3 bg-background-secondary border border-border rounded"></span> Occupied</div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary"><span className="w-3 h-3 bg-warning-light border border-warning-dark rounded"></span> Reserved</div>
            </div>

            {/* Management Modal */}
            {isModalOpen && selectedSpot && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background-secondary">
                            <div>
                                <h2 className="text-xl font-bold text-foreground-primary">Spot {selectedSpot.number}</h2>
                                <p className="text-sm text-foreground-muted">{selectedSpot.section} Section</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-primary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {selectedSpot.status !== 'Available' ? (
                                // Occupied State
                                <div className="space-y-4">
                                    <div className="bg-background-secondary p-4 rounded-xl border border-border">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-foreground-muted uppercase">Vehicle</p>
                                                <p className="font-bold font-mono text-lg text-foreground-primary">{selectedSpot.vehicleNumber || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-foreground-muted uppercase">Check-in</p>
                                                <p className="font-bold text-foreground-primary flex items-center gap-1">
                                                    <Clock size={14} /> {selectedSpot.checkInTime || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedSpot.assignedTo && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <p className="text-xs text-foreground-muted uppercase">Assigned To</p>
                                                <p className="font-bold text-foreground-primary flex items-center gap-1">
                                                    <User size={14} /> {selectedSpot.assignedTo}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSpotAction}
                                        className="w-full py-3 bg-danger text-white rounded-xl font-bold shadow-lg hover:bg-danger/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Ban size={20} /> Release Spot
                                    </button>
                                </div>
                            ) : (
                                // Available State - Assign form
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Vehicle Details</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                            placeholder="Vehicle Number (e.g. ABC-1234)"
                                            value={assignment.vehicleNumber}
                                            onChange={e => setAssignment({ ...assignment, vehicleNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Owner / Driver</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                            placeholder="Name (Optional)"
                                            value={assignment.assignedTo}
                                            onChange={e => setAssignment({ ...assignment, assignedTo: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSpotAction}
                                        className="w-full py-3 bg-success text-white rounded-xl font-bold shadow-lg hover:bg-success/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={20} /> Assign Spot
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Parking;
