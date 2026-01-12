import { useState, useRef, useEffect } from 'react';

// Optimized Image component with lazy loading
export default function OptimizedImage({
    src,
    alt,
    className = '',
    style = {},
    fallback = 'https://placehold.co/300x300/f1f5f9/94a3b8?text=No+Image',
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before visible
                threshold: 0
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = (e) => {
        setHasError(true);
        e.target.src = fallback;
    };

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={style}
        >
            {/* Placeholder skeleton */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
                    style={{ background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }}
                />
            )}

            {isInView && (
                <img
                    src={hasError ? fallback : src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    decoding="async"
                    {...props}
                />
            )}
        </div>
    );
}
