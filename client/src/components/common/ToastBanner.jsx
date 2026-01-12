import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { announcementsAPI } from '../../services/api';

export default function ToastBanner() {
    const [announcement, setAnnouncement] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const response = await announcementsAPI.getActive();
            const toasts = response.data.announcements.filter(
                a => a.type === 'toast' || a.type === 'both'
            );

            if (toasts.length > 0) {
                const dismissedIds = JSON.parse(localStorage.getItem('dismissedToasts') || '[]');
                const toShow = toasts.find(t => !dismissedIds.includes(t.id));

                if (toShow) {
                    setAnnouncement(toShow);
                    setShow(true);
                }
            }
        } catch (error) {
            console.error('Failed to load announcements:', error);
        }
    };

    const handleDismiss = () => {
        if (announcement) {
            const dismissedIds = JSON.parse(localStorage.getItem('dismissedToasts') || '[]');
            dismissedIds.push(announcement.id);
            localStorage.setItem('dismissedToasts', JSON.stringify(dismissedIds));
        }
        setShow(false);
    };

    if (!show || !announcement) return null;

    return (
        <div className="fixed left-0 right-0 z-40 toast-enter" style={{ top: '80px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
                <div
                    className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-2xl shadow-xl shadow-purple-500/20 flex items-center justify-between"
                    style={{ padding: '14px 24px' }}
                >
                    <div className="flex items-center" style={{ gap: '16px' }}>
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles size={16} className="text-amber-300" />
                        </div>
                        <div className="flex items-center flex-wrap" style={{ gap: '8px' }}>
                            <span className="font-bold">{announcement.title}</span>
                            <span className="text-purple-200">—</span>
                            <span className="text-purple-100">{announcement.message}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="hover:bg-white/20 rounded-xl transition-colors flex-shrink-0"
                        style={{ padding: '8px', marginLeft: '16px' }}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
