import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, X, Loader2, MessageSquare, Clock, CheckCircle, Archive, Filter, Search, User } from 'lucide-react';
import { contactsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/PageHeader';

export default function ContactManagement() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [statusCounts, setStatusCounts] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadContacts();
    }, [statusFilter]);

    const loadContacts = async () => {
        try {
            const response = await contactsAPI.getAll({ status: statusFilter });
            setContacts(response.data.contacts);
            setStatusCounts(response.data.statusCounts || {});
        } catch (error) {
            toast.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleViewContact = async (contact) => {
        try {
            const response = await contactsAPI.getById(contact.id);
            setSelectedContact(response.data.contact);
            // Refresh list to update read status
            loadContacts();
        } catch (error) {
            toast.error('Failed to load contact details');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await contactsAPI.updateStatus(id, status);
            toast.success(`Marked as ${status}`);
            loadContacts();
            if (selectedContact?.id === id) {
                setSelectedContact({ ...selectedContact, status });
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this contact message?')) return;

        try {
            await contactsAPI.delete(id);
            toast.success('Contact deleted');
            loadContacts();
            if (selectedContact?.id === id) {
                setSelectedContact(null);
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'new':
                return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
            case 'read':
                return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
            case 'replied':
                return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
            case 'archived':
                return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const filteredContacts = contacts.filter(contact => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            contact.first_name.toLowerCase().includes(query) ||
            contact.last_name.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query) ||
            contact.message.toLowerCase().includes(query)
        );
    });

    const filterTabs = [
        { key: 'all', label: 'All', count: Object.values(statusCounts).reduce((a, b) => a + b, 0) },
        { key: 'new', label: 'New', count: statusCounts.new || 0 },
        { key: 'read', label: 'Read', count: statusCounts.read || 0 },
        { key: 'replied', label: 'Replied', count: statusCounts.replied || 0 },
        { key: 'archived', label: 'Archived', count: statusCounts.archived || 0 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <PageHeader
                title="Contact Messages"
                subtitle="Manage customer inquiries and messages."
            />

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100" style={{ padding: '16px 20px' }}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between" style={{ gap: '16px' }}>
                    {/* Status Filter Tabs */}
                    <div className="flex items-center flex-wrap" style={{ gap: '8px' }}>
                        {filterTabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`flex items-center rounded-lg font-medium text-sm transition-all ${statusFilter === tab.key
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                style={{ padding: '8px 14px', gap: '8px' }}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`text-xs font-bold rounded-full ${statusFilter === tab.key
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-200 text-slate-700'
                                        }`} style={{ padding: '2px 8px' }}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                            style={{ padding: '10px 12px 10px 40px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Messages List */}
            {filteredContacts.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {filteredContacts.map((contact) => {
                            const styles = getStatusStyles(contact.status);
                            return (
                                <div
                                    key={contact.id}
                                    className={`flex items-start hover:bg-slate-50 transition-colors cursor-pointer ${contact.status === 'new' ? 'bg-blue-50/30' : ''
                                        }`}
                                    style={{ padding: '20px 24px', gap: '16px' }}
                                    onClick={() => handleViewContact(contact)}
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                                        <User size={20} className="text-purple-600" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                                            <div className="flex items-center" style={{ gap: '10px' }}>
                                                <h4 className={`font-semibold text-slate-800 ${contact.status === 'new' ? 'text-slate-900' : ''}`}>
                                                    {contact.first_name} {contact.last_name}
                                                </h4>
                                                <span className={`inline-flex items-center text-xs font-medium rounded-full ${styles.bg} ${styles.text}`} style={{ padding: '2px 10px', gap: '4px' }}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                                                    {contact.status}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-400 flex items-center" style={{ gap: '4px' }}>
                                                <Clock size={12} />
                                                {formatDate(contact.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500" style={{ marginBottom: '6px' }}>
                                            {contact.email}
                                        </p>
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {contact.message}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center" style={{ gap: '4px' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleViewContact(contact); }}
                                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
                    <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No messages found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        {statusFilter !== 'all'
                            ? `No ${statusFilter} messages yet.`
                            : 'Contact form submissions will appear here.'}
                    </p>
                </div>
            )}

            {/* Detail Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedContact(null)} />

                    <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between" style={{ padding: '16px 24px' }}>
                            <div className="flex items-center" style={{ gap: '12px' }}>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">{selectedContact.first_name} {selectedContact.last_name}</h2>
                                    <p className="text-sm text-white/70">{selectedContact.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedContact(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '24px' }}>
                            {/* Status and Date */}
                            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                                <span className={`inline-flex items-center text-sm font-medium rounded-full ${getStatusStyles(selectedContact.status).bg} ${getStatusStyles(selectedContact.status).text}`} style={{ padding: '4px 12px', gap: '6px' }}>
                                    <span className={`w-2 h-2 rounded-full ${getStatusStyles(selectedContact.status).dot}`}></span>
                                    {selectedContact.status}
                                </span>
                                <span className="text-sm text-slate-500">
                                    {new Date(selectedContact.created_at).toLocaleString()}
                                </span>
                            </div>

                            {/* Message */}
                            <div className="bg-slate-50 rounded-2xl" style={{ padding: '20px', marginBottom: '24px' }}>
                                <p className="text-slate-700 whitespace-pre-wrap" style={{ lineHeight: '1.7' }}>
                                    {selectedContact.message}
                                </p>
                            </div>

                            {/* Status Actions */}
                            <div style={{ marginBottom: '20px' }}>
                                <p className="text-sm font-medium text-slate-700" style={{ marginBottom: '10px' }}>Update Status</p>
                                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedContact.id, 'replied')}
                                        className={`flex items-center text-sm font-medium rounded-xl transition-all ${selectedContact.status === 'replied'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                                            }`}
                                        style={{ padding: '8px 16px', gap: '6px' }}
                                    >
                                        <CheckCircle size={16} />
                                        Replied
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedContact.id, 'archived')}
                                        className={`flex items-center text-sm font-medium rounded-xl transition-all ${selectedContact.status === 'archived'
                                                ? 'bg-slate-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                        style={{ padding: '8px 16px', gap: '6px' }}
                                    >
                                        <Archive size={16} />
                                        Archive
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <a
                                    href={`mailto:${selectedContact.email}?subject=Re: Your inquiry to LIP Materials`}
                                    className="btn btn-primary rounded-xl shadow-lg shadow-purple-500/20"
                                    style={{ padding: '10px 20px' }}
                                >
                                    <Mail size={18} />
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => handleDelete(selectedContact.id)}
                                    className="flex items-center text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    style={{ padding: '10px 16px', gap: '6px' }}
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
