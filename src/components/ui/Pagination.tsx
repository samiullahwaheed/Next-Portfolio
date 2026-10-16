import { Icon } from './Icon'

type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
  disabled?: boolean
}

// 1 … 4 5 6 … 12 — always shows first, last, and the current page's neighbours
function pageItems(page: number, totalPages: number): (number | 'gap')[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b)
  return sorted.flatMap((value, index) => {
    const previous = sorted[index - 1]
    if (previous === undefined || value - previous === 1) return [value]
    // Fill a single missing page instead of showing "…" for it
    return value - previous === 2 ? [previous + 1, value] : ['gap' as const, value]
  })
}

const base =
  'grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-40'

export function Pagination({ page, totalPages, onChange, disabled = false }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-slate-200/80 bg-white/70 p-1 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/50">
        <li>
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={disabled || page === 1}
            aria-label="Previous page"
            className={`${base} text-slate-600 hover:bg-slate-100 hover:text-[var(--accent)] dark:text-slate-300 dark:hover:bg-slate-800`}
          >
            <Icon name="left" className="size-4" />
          </button>
        </li>
        {pageItems(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden className="px-1 text-slate-400">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                disabled={disabled}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={`${base} ${
                  item === page
                    ? 'bg-[var(--accent)] text-white shadow-md shadow-[color-mix(in_srgb,var(--accent)_35%,transparent)] disabled:opacity-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[var(--accent)] dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={disabled || page === totalPages}
            aria-label="Next page"
            className={`${base} text-slate-600 hover:bg-slate-100 hover:text-[var(--accent)] dark:text-slate-300 dark:hover:bg-slate-800`}
          >
            <Icon name="right" className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
