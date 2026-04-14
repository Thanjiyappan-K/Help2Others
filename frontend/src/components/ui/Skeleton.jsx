import React from 'react';

const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} aria-hidden="true" />
);

export const SkeletonCard = () => (
  <div className="card" style={{ padding: 20, display: 'flex', gap: 16 }}>
    <Skeleton className="skeleton-avatar" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton className="skeleton-title" style={{ width: '60%' }} />
      <Skeleton className="skeleton-text" style={{ width: '90%' }} />
      <Skeleton className="skeleton-text" style={{ width: '70%' }} />
    </div>
  </div>
);

export const SkeletonStatGrid = () => (
  <div className="grid-2" style={{ gap: 12 }}>
    {[1,2,3,4].map(i => (
      <div key={i} className="stat-card">
        <Skeleton className="stat-icon skeleton" style={{ borderRadius: 12, minWidth: 52, height: 52 }} />
        <div className="stat-info" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton className="skeleton-title" style={{ width: '50%' }} />
          <Skeleton className="skeleton-text" style={{ width: '80%' }} />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 4, cols = 5 }) => (
  <div className="card" style={{ padding: 16, overflowX: 'auto' }}>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(120px, 1fr))`, gap: 10 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={`h-${i}`} className="skeleton-title" style={{ height: 14, width: '70%' }} />
      ))}
      {Array.from({ length: rows * cols }).map((_, i) => (
        <Skeleton key={`c-${i}`} className="skeleton-text" style={{ height: 12, width: `${50 + (i % 4) * 10}%` }} />
      ))}
    </div>
  </div>
);

export default Skeleton;
