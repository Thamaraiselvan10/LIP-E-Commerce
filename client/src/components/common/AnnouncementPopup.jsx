import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { announcementsAPI } from '../../services/api';

export default function AnnouncementPopup() {
    const [announcement, setAnnouncement] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const response = await announcementsAPI.getActive();
            const popups = response.data.announcements.filter(
                a => a.type === 'popup' || a.type === 'both'
            );

            if (popups.length > 0) {
                const dismissedIds = JSON.parse(sessionStorage.getItem('dismissedPopups') || '[]');
                const toShow = popups.find(p => !dismissedIds.includes(p.id));

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
            const dismissedIds = JSON.parse(sessionStorage.getItem('dismissedPopups') || '[]');
            dismissedIds.push(announcement.id);
            sessionStorage.setItem('dismissedPopups', JSON.stringify(dismissedIds));
        }
        setShow(false);
    };

    if (!show || !announcement) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" style={{ padding: '16px' }}>
            <div className="bg-white rounded-3xl w-full text-center animate-scale-in shadow-2xl relative overflow-hidden" style={{ maxWidth: '400px', padding: '32px' }}>
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div>

                <button
                    onClick={handleDismiss}
                    className="absolute text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    style={{ top: '16px', right: '16px', padding: '8px' }}
                >
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <div
                        className="w-20 h-20 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 animate-float"
                        style={{ margin: '0 auto 24px' }}
                    >
                        <Sparkles className="text-white" size={36} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>{announcement.title}</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>{announcement.message}</p>

                    <button
                        onClick={handleDismiss}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                        style={{ padding: '16px' }}
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
