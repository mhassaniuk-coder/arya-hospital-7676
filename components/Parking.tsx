import React from 'react';
import { ParkingSpot } from '../types';
import { Car } from 'lucide-react';

const MOCK_PARKING: ParkingSpot[] = Array.from({ length: 20 }, (_, i) => ({
    id: `P-${i+1}`,
    number: `${i+1}`,
    section: i < 5 ? 'Ambulance' : i < 12 ? 'Staff' : 'Visitor',
    status: Math.random() > 0.4 ? 'Occupied' : 'Available'
}));

const Parking: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Parking Management</h1>
                  <p className="text-slate-500">Live parking spot availability.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {MOCK_PARKING.map(spot => (
                    <div key={spot.id} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center min-h-[100px] ${
                        spot.status === 'Occupied' ? 'bg-slate-100 border-slate-200 opacity-70' : 
                        spot.section === 'Ambulance' ? 'bg-red-50 border-red-200' :
                        spot.section === 'Staff' ? 'bg-blue-50 border-blue-200' :
                        'bg-green-50 border-green-200'
                    }`}>
                        <div className="text-xs font-bold uppercase mb-2 text-slate-400">{spot.section}</div>
                        {spot.status === 'Occupied' ? (
                            <Car size={32} className="text-slate-400" />
                        ) : (
                            <span className="text-2xl font-bold text-slate-700">{spot.number}</span>
                        )}
                        <span className={`mt-2 text-[10px] font-bold uppercase ${spot.status === 'Occupied' ? 'text-slate-500' : 'text-green-600'}`}>
                            {spot.status}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="flex gap-4 mt-6 justify-center">
                <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-3 h-3 bg-red-50 border border-red-200 rounded"></span> Ambulance</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></span> Staff</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-3 h-3 bg-green-50 border border-green-200 rounded"></span> Visitor</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-3 h-3 bg-slate-100 border border-slate-200 rounded"></span> Occupied</div>
            </div>
        </div>
    );
};

export default Parking;