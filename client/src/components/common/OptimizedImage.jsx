import { useState, useRef, useEffect } from 'react';

/**
 * OptimizedImage - A performance-optimized image component with:
 * - Lazy loading with Intersection Observer
 * - Placeholder blur while loading
 * - Error fallback handling
 * - Smooth fade-in animation
 */
export default function OptimizedImage({
    src,
    alt,
    className = '',
    style = {},
    width,
    height,
    fallback = 'https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image',
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
                rootMargin: '100px', // Start loading 100px before coming into view
                threshold: 0.01
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

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    const imageSrc = hasError ? fallback : (isInView ? src : undefined);

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={{
                ...style,
                backgroundColor: '#f3f4f6', // Placeholder background
            }}
        >
            {/* Placeholder shimmer */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 animate-pulse"
                    style={{ backgroundColor: '#e5e7eb' }}
                />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={imageSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ ...style }}
                    {...props}
                />
            )}
        </div>
    );
}
