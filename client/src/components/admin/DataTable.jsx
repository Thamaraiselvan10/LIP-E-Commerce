import { Link } from 'react-router-dom';
import { ArrowRight, Box } from 'lucide-react';

/**
 * DataTable - Reusable data table component for admin pages
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{ key, label, render?, align? }]
 * @param {Array} props.data - Array of data objects
 * @param {string} props.title - Table title
 * @param {string} props.viewAllLink - Optional "View All" link URL
 * @param {string} props.emptyMessage - Message when no data
 * @param {Function} props.onRowClick - Optional row click handler
 */

export default function DataTable({
    columns = [],
    data = [],
    title,
    viewAllLink,
    emptyMessage = 'No data to display',
    onRowClick
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            {(title || viewAllLink) && (
                <div style={{ padding: '20px' }} className="border-b border-slate-100 flex items-center justify-between">
                    {title && <h3 className="font-bold text-lg text-slate-800">{title}</h3>}
                    {viewAllLink && (
                        <Link
                            to={viewAllLink}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1 group"
                        >
                            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                                        }`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                onClick={() => onRowClick?.(row)}
                                className={`hover:bg-purple-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-6 py-5 text-sm ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                                            }`}
                                    >
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : row[col.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {data.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <Box size={48} className="mx-auto mb-3 opacity-20" />
                    <p>{emptyMessage}</p>
                </div>
            )}
        </div>
    );
}

// Skeleton loader variant
export function DataTableSkeleton({ rows = 3, cols = 4 }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="h-6 w-32 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-200 rounded" />
            </div>
            <div className="p-6 space-y-4">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        {Array.from({ length: cols }).map((_, j) => (
                            <div key={j} className="h-4 flex-1 bg-slate-100 rounded" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
