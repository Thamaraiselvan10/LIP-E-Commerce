import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Loader2, Bell, MessageSquare, Megaphone, CheckCircle, AlertTriangle } from 'lucide-react';
import { announcementsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/PageHeader';

export default function AnnouncementManagement() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'toast',
        is_active: true,
    });

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const response = await announcementsAPI.getAllAdmin();
            setAnnouncements(response.data.announcements);
        } catch (error) {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            message: '',
            type: 'toast',
            is_active: true,
        });
        setEditingItem(null);
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                message: item.message,
                type: item.type,
                is_active: item.is_active === 1,
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error('Title and message are required');
            return;
        }

        setSaving(true);

        try {
            // Convert is_active to isActive for backend
            const payload = {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                isActive: formData.is_active
            };

            if (editingItem) {
                await announcementsAPI.update(editingItem.id, payload);
                toast.success('Announcement updated');
            } else {
                await announcementsAPI.create(payload);
                toast.success('Announcement created');
            }
            handleCloseModal();
            loadAnnouncements();
        } catch (error) {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            await announcementsAPI.toggle(id);
            toast.success(currentStatus ? 'Deactivated' : 'Activated');
            loadAnnouncements();
        } catch (error) {
            toast.error('Failed to toggle');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;

        try {
            await announcementsAPI.delete(id);
            toast.success('Deleted');
            loadAnnouncements();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const getTypeStyles = (type) => {
        if (type === 'popup') return {
            icon: Megaphone,
            bg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
            text: 'text-purple-600',
            lightBg: 'bg-purple-50'
        };
        if (type === 'toast') return {
            icon: MessageSquare,
            bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
            text: 'text-blue-600',
            lightBg: 'bg-blue-50'
        };
        return {
            icon: Bell,
            bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
            text: 'text-amber-600',
            lightBg: 'bg-amber-50'
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    // Add Announcement Button
    const AddButton = (
        <button
            onClick={() => handleOpenModal()}
            className="btn bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/30 border-0"
        >
            <Plus size={20} />
            Create Announcement
        </button>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <PageHeader
                title="Announcements"
                subtitle="Engage your users with popups and notifications."
                actions={AddButton}
            />

            {/* Announcements Grid */}
            {announcements.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                    {announcements.map((item) => {
                        const styles = getTypeStyles(item.type);
                        const TypeIcon = styles.icon;

                        return (
                            <div
                                key={item.id}
                                className={`group relative bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 ${!item.is_active ? 'opacity-70 grayscale-[0.5] hover:grayscale-0 hover:opacity-100' : ''}`}
                                style={{ padding: '20px' }}
                            >
                                {/* Active Indicator */}
                                <div className={`absolute top-6 right-6 w-3 h-3 rounded-full ${item.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`} />

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl ${styles.bg} p-[1px] mb-6 shadow-lg shadow-gray-200`}>
                                    <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                                        <TypeIcon size={24} className={styles.text} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                                    {item.message}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${styles.lightBg} ${styles.text}`}>
                                        {item.type}
                                    </span>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setShowPreview(item)}
                                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                            title="Preview"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleToggle(item.id, item.is_active)}
                                            className={`p-2 rounded-xl transition-all ${item.is_active
                                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                                : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                                                }`}
                                            title={item.is_active ? 'Deactivate' : 'Activate'}
                                        >
                                            {item.is_active ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
                    <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No announcements yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create your first announcement to share updates, offers, or news with your customers.</p>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary">
                        Create First Announcement
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />

                    <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl animate-scale-in overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between" style={{ padding: '16px 24px' }}>
                            <h2 className="text-lg font-bold">{editingItem ? 'Edit Announcement' : 'New Announcement'}</h2>
                            <button onClick={handleCloseModal} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label className="text-sm font-semibold text-slate-700">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ padding: '12px 16px' }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                                    placeholder="e.g. Summer Sale!"
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label className="text-sm font-semibold text-slate-700">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    style={{ padding: '12px 16px', minHeight: '100px' }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                                    placeholder="e.g. Get 50% off on all items..."
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label className="text-sm font-semibold text-slate-700">Type</label>
                                <div className="flex bg-slate-100 rounded-xl" style={{ padding: '6px' }}>
                                    {['toast', 'popup', 'both'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            style={{ padding: '8px 12px' }}
                                            className={`flex-1 rounded-lg text-sm font-bold capitalize transition-all ${formData.type === type
                                                ? 'bg-white text-slate-800 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ paddingTop: '8px' }}>
                                <label className="flex items-center cursor-pointer hover:bg-slate-50 transition-colors border border-slate-100 rounded-xl" style={{ gap: '12px', padding: '16px' }}>
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${formData.is_active ? 'bg-purple-600 border-purple-600' : 'border-slate-300'}`}>
                                        {formData.is_active && <CheckCircle size={14} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-slate-700">Publish Immediately</span>
                                </label>
                            </div>

                            <div className="flex" style={{ gap: '12px', paddingTop: '8px' }}>
                                <button type="button" onClick={handleCloseModal} style={{ padding: '12px 16px' }} className="flex-1 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 btn btn-primary rounded-xl shadow-lg shadow-purple-500/20">
                                    {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : (editingItem ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPreview(null)} />

                    <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl animate-scale-in">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-amber-500" />

                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Megaphone className="text-purple-600" size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3">{showPreview.title}</h3>
                        <p className="text-slate-600 mb-8 leading-relaxed">{showPreview.message}</p>

                        <button
                            onClick={() => setShowPreview(null)}
                            className="w-full btn btn-primary py-3 rounded-xl shadow-lg shadow-purple-500/20"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
