import React from 'react';
import { LibraryItem } from '../types';
import { Book, Search } from 'lucide-react';

const MOCK_BOOKS: LibraryItem[] = [
    { id: '1', title: 'Harrison\'s Principles of Internal Medicine', author: 'J. Larry Jameson', category: 'Medicine', status: 'Available' },
    { id: '2', title: 'Gray\'s Anatomy', author: 'Susan Standring', category: 'Anatomy', status: 'Checked Out' },
];

const Library: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Medical Library</h1>
                  <p className="text-slate-500">Digital catalog for books and journals.</p>
                </div>
            </div>

             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search title, author..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_BOOKS.map(book => (
                    <div key={book.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className="w-16 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                            <Book size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 mb-1">{book.title}</h3>
                            <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{book.category}</span>
                                <span className={`text-xs font-bold ${book.status === 'Available' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {book.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;