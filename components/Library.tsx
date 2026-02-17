import React, { useState, useMemo } from 'react';
import { LibraryItem } from '../types';
import { BookOpen, Plus, Search, X, ChevronDown, BookMarked, ArrowRightLeft, AlertCircle, CheckCircle, Edit2, Trash2, User, Calendar } from 'lucide-react';

const INITIAL_BOOKS: LibraryItem[] = [
    { id: 'LB-001', title: 'Harrison\'s Principles of Internal Medicine', author: 'J. Larry Jameson', category: 'Medicine', status: 'Available' },
    { id: 'LB-002', title: 'Gray\'s Anatomy for Students', author: 'Richard Drake', category: 'Anatomy', status: 'Checked Out' },
    { id: 'LB-003', title: 'Robbins Pathologic Basis of Disease', author: 'Vinay Kumar', category: 'Pathology', status: 'Available' },
    { id: 'LB-004', title: 'Guyton Textbook of Medical Physiology', author: 'John E. Hall', category: 'Physiology', status: 'Available' },
    { id: 'LB-005', title: 'Schwartz\'s Principles of Surgery', author: 'F. Charles Brunicardi', category: 'Surgery', status: 'Checked Out' },
    { id: 'LB-006', title: 'Nelson Textbook of Pediatrics', author: 'Robert Kliegman', category: 'Pediatrics', status: 'Available' },
    { id: 'LB-007', title: 'Williams Obstetrics', author: 'F. Gary Cunningham', category: 'Obstetrics', status: 'Available' },
    { id: 'LB-008', title: 'Goodman & Gilman\'s Pharmacology', author: 'Laurence Brunton', category: 'Pharmacology', status: 'Checked Out' },
    { id: 'LB-009', title: 'Bailey & Love\'s Short Practice of Surgery', author: 'Norman Williams', category: 'Surgery', status: 'Available' },
    { id: 'LB-010', title: 'Davidson\'s Principles of Medicine', author: 'Stuart Ralston', category: 'Medicine', status: 'Available' },
];

const CATEGORIES = ['Medicine', 'Anatomy', 'Pathology', 'Physiology', 'Surgery', 'Pediatrics', 'Obstetrics', 'Pharmacology', 'Nursing', 'Radiology'];
const SHELF_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-rose-500', 'bg-cyan-500', 'bg-amber-500'];

interface BorrowRecord { bookId: string; borrower: string; borrowDate: string; dueDate: string; returned: boolean; }

const BORROW_HISTORY: BorrowRecord[] = [
    { bookId: 'LB-002', borrower: 'Dr. Sarah Chen', borrowDate: '2026-02-10', dueDate: '2026-03-10', returned: false },
    { bookId: 'LB-005', borrower: 'Nurse Joy', borrowDate: '2026-02-08', dueDate: '2026-03-08', returned: false },
    { bookId: 'LB-008', borrower: 'Dr. Michael Ross', borrowDate: '2026-02-05', dueDate: '2026-03-05', returned: false },
];

const Library: React.FC = () => {
    const [books, setBooks] = useState<LibraryItem[]>(INITIAL_BOOKS);
    const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(BORROW_HISTORY);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [checkoutModal, setCheckoutModal] = useState<string | null>(null);
    const [editingBook, setEditingBook] = useState<LibraryItem | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', author: '', category: 'Medicine', isbn: '', edition: '', publisher: '', copies: 1, shelf: '' });
    const [checkoutData, setCheckoutData] = useState({ borrower: '', dueDate: '' });

    const filtered = useMemo(() => books.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCat;
    }), [books, searchQuery, statusFilter, categoryFilter]);

    const stats = useMemo(() => ({
        total: books.length,
        available: books.filter(b => b.status === 'Available').length,
        checkedOut: books.filter(b => b.status === 'Checked Out').length,
        overdue: borrowRecords.filter(r => !r.returned && new Date(r.dueDate) < new Date()).length,
    }), [books, borrowRecords]);

    const openAdd = () => { setEditingBook(null); setFormData({ title: '', author: '', category: 'Medicine', isbn: '', edition: '', publisher: '', copies: 1, shelf: '' }); setShowModal(true); };
    const openEdit = (b: LibraryItem) => { setEditingBook(b); setFormData({ title: b.title, author: b.author, category: b.category, isbn: '', edition: '', publisher: '', copies: 1, shelf: '' }); setShowModal(true); };

    const handleSave = () => {
        if (!formData.title.trim() || !formData.author.trim()) return;
        if (editingBook) {
            setBooks(prev => prev.map(b => b.id === editingBook.id ? { ...b, title: formData.title, author: formData.author, category: formData.category } : b));
        } else {
            const newBook: LibraryItem = { id: `LB-${String(books.length + 1).padStart(3, '0')}`, title: formData.title, author: formData.author, category: formData.category, status: 'Available' };
            setBooks(prev => [...prev, newBook]);
        }
        setShowModal(false);
    };

    const handleCheckout = (id: string) => {
        if (!checkoutData.borrower.trim() || !checkoutData.dueDate) return;
        setBooks(prev => prev.map(b => b.id === id ? { ...b, status: 'Checked Out' as const } : b));
        setBorrowRecords(prev => [...prev, { bookId: id, borrower: checkoutData.borrower, borrowDate: new Date().toISOString().split('T')[0], dueDate: checkoutData.dueDate, returned: false }]);
        setCheckoutModal(null);
        setCheckoutData({ borrower: '', dueDate: '' });
    };

    const handleReturn = (id: string) => {
        setBooks(prev => prev.map(b => b.id === id ? { ...b, status: 'Available' as const } : b));
        setBorrowRecords(prev => prev.map(r => r.bookId === id && !r.returned ? { ...r, returned: true } : r));
    };

    const handleDelete = (id: string) => { setBooks(prev => prev.filter(b => b.id !== id)); setDeleteConfirm(null); };

    const getActiveBorrow = (id: string) => borrowRecords.find(r => r.bookId === id && !r.returned);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Library</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage books, journals, and lending.</p>
                </div>
                <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all">
                    <Plus size={18} /> Add Book
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Books', value: stats.total, icon: <BookOpen size={22} />, color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
                    { label: 'Available', value: stats.available, icon: <CheckCircle size={22} />, color: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
                    { label: 'Checked Out', value: stats.checkedOut, icon: <ArrowRightLeft size={22} />, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
                    { label: 'Overdue', value: stats.overdue, icon: <AlertCircle size={22} />, color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search by title or author..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option value="All">All Categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option value="All">All Status</option><option>Available</option><option>Checked Out</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((book, idx) => {
                    const borrow = getActiveBorrow(book.id);
                    const isOverdue = borrow && new Date(borrow.dueDate) < new Date();
                    return (
                        <div key={book.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group">
                            <div className="flex">
                                <div className={`w-3 ${SHELF_COLORS[idx % SHELF_COLORS.length]}`} />
                                <div className="flex-1 p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight truncate" title={book.title}>{book.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{book.author}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                                            <button onClick={() => openEdit(book)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"><Edit2 size={14} /></button>
                                            <button onClick={() => setDeleteConfirm(book.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 size={14} /></button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${SHELF_COLORS[idx % SHELF_COLORS.length].replace('bg-', 'text-')} bg-opacity-10`} style={{ backgroundColor: 'rgba(99,102,241,0.08)' }}>{book.category}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${book.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>{book.status}</span>
                                        {isOverdue && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">Overdue</span>}
                                    </div>

                                    {borrow && (
                                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mb-3 text-xs space-y-1">
                                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><User size={12} /> {borrow.borrower}</div>
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Calendar size={12} /> Due: {new Date(borrow.dueDate).toLocaleDateString()}</div>
                                        </div>
                                    )}

                                    {book.status === 'Available' ? (
                                        <button onClick={() => { setCheckoutModal(book.id); setCheckoutData({ borrower: '', dueDate: '' }); }}
                                            className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-2">
                                            <ArrowRightLeft size={14} /> Check Out
                                        </button>
                                    ) : (
                                        <button onClick={() => handleReturn(book.id)}
                                            className="w-full py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg font-semibold text-sm hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2">
                                            <BookMarked size={14} /> Return
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No books found</p>
                </div>
            )}

            {/* Checkout Modal */}
            {checkoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCheckoutModal(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check Out Book</h3>
                            <button onClick={() => setCheckoutModal(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3">
                                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">{books.find(b => b.id === checkoutModal)?.title}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Borrower Name *</label>
                                <input type="text" value={checkoutData.borrower} onChange={e => setCheckoutData(p => ({ ...p, borrower: e.target.value }))} placeholder="Full name"
                                    className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Due Date *</label>
                                <input type="date" value={checkoutData.dueDate} onChange={e => setCheckoutData(p => ({ ...p, dueDate: e.target.value }))}
                                    className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-700">
                            <button onClick={() => setCheckoutModal(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                            <button onClick={() => handleCheckout(checkoutModal)} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Remove Book?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This book will be permanently removed from the catalog.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                                <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Book title"
                                    className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Author *</label>
                                    <input type="text" value={formData.author} onChange={e => setFormData(p => ({ ...p, author: e.target.value }))} placeholder="Author name"
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                    <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ISBN</label>
                                    <input type="text" value={formData.isbn} onChange={e => setFormData(p => ({ ...p, isbn: e.target.value }))} placeholder="ISBN"
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Edition</label>
                                    <input type="text" value={formData.edition} onChange={e => setFormData(p => ({ ...p, edition: e.target.value }))} placeholder="e.g. 21st"
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Publisher</label>
                                    <input type="text" value={formData.publisher} onChange={e => setFormData(p => ({ ...p, publisher: e.target.value }))} placeholder="Publisher"
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Shelf Location</label>
                                    <input type="text" value={formData.shelf} onChange={e => setFormData(p => ({ ...p, shelf: e.target.value }))} placeholder="e.g. A-3-12"
                                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-700">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">{editingBook ? 'Update' : 'Add Book'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;