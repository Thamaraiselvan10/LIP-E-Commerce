/**
 * PageHeader - Consistent page header for admin pages
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Optional subtitle/description
 * @param {React.ReactNode} props.actions - Optional action buttons (right side)
 */

export default function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between" style={{ gap: '16px', marginBottom: '32px' }}>
            <div>
                <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
                {subtitle && (
                    <p className="text-slate-500" style={{ marginTop: '4px' }}>{subtitle}</p>
                )}
            </div>

            {actions && (
                <div className="flex items-center" style={{ gap: '12px' }}>
                    {actions}
                </div>
            )}
        </div>
    );
}
