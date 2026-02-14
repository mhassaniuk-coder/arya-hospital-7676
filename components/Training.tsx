import React, { useState } from 'react';
import { GraduationCap, Play, CheckCircle, Clock, Plus, Users, Award } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  enrolled: number;
  completed: number;
  status: 'Active' | 'Upcoming' | 'Archived';
  progress: number; // For demo purpose
}

const Training: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: 'HIPAA Compliance 2024', instructor: 'Dr. Emily White', duration: '2 hours', enrolled: 45, completed: 30, status: 'Active', progress: 75 },
    { id: 2, title: 'Advanced CPR Techniques', instructor: 'Paramedic John Doe', duration: '4 hours', enrolled: 20, completed: 5, status: 'Active', progress: 25 },
    { id: 3, title: 'Electronic Health Records (EHR) Training', instructor: 'IT Dept', duration: '1 hour', enrolled: 15, completed: 15, status: 'Archived', progress: 100 },
    { id: 4, title: 'Infection Control Protocols', instructor: 'Nurse Sarah', duration: '3 hours', enrolled: 50, completed: 0, status: 'Upcoming', progress: 0 },
  ]);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', instructor: '', duration: '' });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const course: Course = {
      id: courses.length + 1,
      title: newCourse.title,
      instructor: newCourse.instructor,
      duration: newCourse.duration,
      enrolled: 0,
      completed: 0,
      status: 'Upcoming',
      progress: 0
    };
    setCourses([...courses, course]);
    setShowAddCourse(false);
    setNewCourse({ title: '', instructor: '', duration: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Training & Development</h1>
          <p className="text-slate-500">Manage courses and track certification progress</p>
        </div>
        <button 
          onClick={() => setShowAddCourse(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} />
          Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Users size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total Enrolled</p>
                    <h3 className="text-2xl font-bold text-slate-900">130</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Certifications Issued</p>
                    <h3 className="text-2xl font-bold text-slate-900">45</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Clock size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Pending Completion</p>
                    <h3 className="text-2xl font-bold text-slate-900">85</h3>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{course.title}</h3>
                            <p className="text-sm text-slate-500">Instructor: {course.instructor}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === 'Active' ? 'bg-green-100 text-green-700' :
                        course.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                        {course.status}
                    </span>
                </div>
                
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                            className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${course.progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                    <div className="flex gap-4 text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={16} /> {course.duration}</span>
                        <span className="flex items-center gap-1"><Users size={16} /> {course.enrolled} Enrolled</span>
                    </div>
                    <button className="text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1">
                        View Details
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Create New Course</h3>
              <button onClick={() => setShowAddCourse(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instructor Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newCourse.instructor}
                  onChange={e => setNewCourse({...newCourse, instructor: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (e.g., 2 hours)</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newCourse.duration}
                  onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                Create Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
