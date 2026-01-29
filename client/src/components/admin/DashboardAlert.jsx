import { useState, useEffect } from 'react';
import { AlertTriangle, X, Package, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardAlert({ lowStockCount, pendingOrderCount }) {
    const [isVisible, setIsVisible] = useState(true);

    // Only show if there are actual issues
    const hasIssues = lowStockCount > 0 || pendingOrderCount > 0;

    if (!hasIssues || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ marginBottom: '32px' }}
            >
                <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-xl shadow-red-500/20 text-white overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                    <div className="relative z-10 flex items-start md:items-center justify-between" style={{ padding: '24px', gap: '24px' }}>
                        <div className="flex items-start" style={{ gap: '20px' }}>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                <AlertTriangle size={24} className="text-white animate-pulse" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-bold flex items-center" style={{ gap: '8px' }}>
                                    Attention Needed
                                </h3>
                                <div className="flex flex-col md:flex-row md:items-center text-red-50" style={{ gap: '12px' }}>
                                    {lowStockCount > 0 && (
                                        <span className="flex items-center gap-1.5 bg-red-800/30 px-3 py-1 rounded-lg text-sm font-medium border border-red-400/30">
                                            <Package size={14} />
                                            {lowStockCount} Products Low in Stock
                                        </span>
                                    )}
                                    {pendingOrderCount > 0 && (
                                        <span className="flex items-center gap-1.5 bg-red-800/30 px-3 py-1 rounded-lg text-sm font-medium border border-red-400/30">
                                            <Clock size={14} />
                                            {pendingOrderCount} High Pending Orders
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0"
                            aria-label="Close alert"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
