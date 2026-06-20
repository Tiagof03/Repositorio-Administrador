interface SkeletonProps {
  className?: string
}

export function SkeletonBlock({ className = '' }: SkeletonProps) {
  return (
    <div
          className={`animate-pulse bg-surface-container-highest/50 rounded-sm ${className}`}
        />
  )
}

export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={`h-5 ${i === 0 ? 'w-48' : i === columns - 1 ? 'w-24 ml-auto' : 'w-32'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border border-outline-variant/20">
      {/* header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-surface-container">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className={`h-4 ${i === 0 ? 'w-48' : i === columns - 1 ? 'w-24 ml-auto' : 'w-32'}`}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} columns={columns} />
      ))}
    </div>
  )
}

export function SkeletonKanban() {
  return (
    <div className="flex gap-6 flex-1 min-h-[700px] overflow-x-auto pb-4">
      {Array.from({ length: 5 }).map((_, colIdx) => (
        <div key={colIdx} className="flex flex-col w-80 shrink-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-5 w-8" />
          </div>
          <div className="space-y-3 pr-1">
            {Array.from({ length: 3 }).map((_, cardIdx) => (
              <div
                key={cardIdx}
                className="bg-surface-container p-4 border border-outline-variant/20"
              >
                <div className="flex justify-between items-start mb-3">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-3 w-12" />
                </div>
                <SkeletonBlock className="h-4 w-36 mb-2" />
                <SkeletonBlock className="h-3 w-full mb-1" />
                <SkeletonBlock className="h-3 w-3/4 mb-3" />
                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
                  <SkeletonBlock className="h-5 w-16" />
                  <SkeletonBlock className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-container p-6 border border-outline-variant/20">
            <SkeletonBlock className="h-4 w-24 mb-3" />
            <SkeletonBlock className="h-8 w-20 mb-2" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>
      {/* chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-surface-container p-6 border border-outline-variant/20">
            <SkeletonBlock className="h-5 w-40 mb-6" />
            <SkeletonBlock className="h-48 w-full" />
          </div>
        ))}
      </div>
      {/* table */}
      <div className="bg-surface-container border border-outline-variant/20">
        <div className="px-6 py-4">
          <SkeletonBlock className="h-5 w-32" />
        </div>
        <SkeletonTable rows={4} columns={4} />
      </div>
    </div>
  )
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-surface-container border border-outline-variant/20">
          <SkeletonBlock className="h-40 w-full" />
          <div className="p-4 space-y-3">
            <SkeletonBlock className="h-5 w-3/4" />
            <SkeletonBlock className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <SkeletonBlock className="h-5 w-16" />
              <SkeletonBlock className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonInline({ className = '' }: SkeletonProps) {
  return <SkeletonBlock className={`h-4 w-32 inline-block ${className}`} />
}
