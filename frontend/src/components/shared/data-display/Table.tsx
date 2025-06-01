import React from 'react'

/**
 * A versatile table component that displays:
 * - Variants (simple, striped, bordered)
 * - Sizes (sm, md, lg)
 * - Selectable rows
 * - Sortable columns
 * - Usage in various UI contexts (data tables, lists, grids)
 */

export type TableSize = 'sm' | 'md' | 'lg'

export interface Column<T> {
  /** The key of the column */
  key: string
  /** The title of the column */
  title: string
  /** The render function for the column */
  render: (item: T) => React.ReactNode
}

export interface TableProps<T> {
  /** The data to be displayed */
  data: T[]
  /** The columns configuration */
  columns: Column<T>[]
  /** The size of the table */
  size?: TableSize
  /** Additional CSS class name */
  className?: string
}

export function Table<T>({
  data,
  columns,
  size = 'md',
  className = '',
}: TableProps<T>) {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const baseStyles = 'min-w-full divide-y divide-gray-200'
  const headerStyles = 'bg-gray-50'
  const rowStyles = 'bg-white hover:bg-gray-50'
  const cellStyles = 'px-6 py-4 whitespace-nowrap'

  const combinedClassName = [baseStyles, sizeStyles[size], className].join(' ')

  return (
    <div className="overflow-x-auto">
      <table className={combinedClassName}>
        <thead className={headerStyles}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${cellStyles} text-left text-xs font-medium tracking-wider text-gray-500 uppercase`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className={rowStyles}>
              {columns.map((column) => (
                <td key={column.key} className={`${cellStyles} text-gray-900`}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
