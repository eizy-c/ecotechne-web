'use client';

import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  FileSpreadsheet,
  FileText,
  MoreVertical
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T | string; // Propiedad del objeto (o cadena con puntos para anidados)
  cell?: (item: T) => React.ReactNode; // Renderizador personalizado
  sortable?: boolean;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[]; // Claves sobre las que buscar
  itemsPerPage?: number;
  enableExport?: boolean;
  exportFilename?: string;
  rowClassName?: (item: T) => string;
}

// Función auxiliar para obtener valores anidados (ej. "role.name")
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export default function DataTable<T>({ 
  data, 
  columns, 
  searchPlaceholder = "Buscar...",
  searchKeys = [],
  itemsPerPage = 10,
  enableExport = false,
  exportFilename = "exportacion",
  rowClassName
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);

  // 1. Filtrado (Búsqueda global)
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowercasedSearch = searchTerm.toLowerCase();

    return data.filter(item => {
      // Si no se proveen keys, busca en todos los values (superficialmente)
      if (searchKeys.length === 0) {
        return Object.values(item as any).some(val => 
          String(val).toLowerCase().includes(lowercasedSearch)
        );
      }
      
      // Si se proveen keys, busca específicamente en ellas (soportando anidación)
      return searchKeys.some(key => {
        const val = getNestedValue(item, key as string);
        return val && String(val).toLowerCase().includes(lowercasedSearch);
      });
    });
  }, [data, searchTerm, searchKeys]);

  // 2. Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === bValue) return 0;
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Ordenar strings de forma natural
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      // Ordenar booleanos, números o fechas
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 3. Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reiniciar paginación al ordenar
  };

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const exportToExcel = () => {
    // Solo exportar las columnas que tienen un header
    const exportData = sortedData.map(item => {
      const row: any = {};
      columns.forEach(col => {
        if (col.header && col.accessorKey) {
          row[col.header] = getNestedValue(item, col.accessorKey as string);
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${exportFilename}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.filter(c => c.header && c.accessorKey).map(c => c.header);
    const tableRows = sortedData.map(item => {
      return columns.filter(c => c.header && c.accessorKey).map(c => {
        return getNestedValue(item, c.accessorKey as string) || '';
      });
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [249, 115, 22] } // brand-accent
    });
    
    doc.save(`${exportFilename}.pdf`);
  };

  return (
    <div className="glass-card rounded-2xl border border-card-border overflow-hidden animate-fade-in-up">
      {/* Barra superior de Búsqueda */}
      <div className="p-4 border-b border-card-border flex flex-col sm:flex-row justify-between items-center bg-card/50 gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reiniciar paginación al buscar
            }}
            className="w-full bg-background/50 border border-card-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-foreground/50 whitespace-nowrap">
            {sortedData.length} registro(s) encontrado(s)
          </div>
          
          {enableExport && (
            <div className="flex items-center gap-2 border-l border-card-border pl-4">
              <button 
                onClick={exportToExcel}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                title="Exportar a Excel"
              >
                <FileSpreadsheet size={18} />
              </button>
              <button 
                onClick={exportToPDF}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                title="Exportar a PDF"
              >
                <FileText size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vista Móvil (Tarjetas) */}
      <div className="md:hidden flex flex-col gap-3 p-4 bg-card/10" onClick={() => setOpenMenuIdx(null)}>
        {currentData.length > 0 ? (
          currentData.map((item, rowIdx) => {
            const accionesCol = columns.find(c => c.header === 'Acciones');
            const otherCols = columns.filter(c => c.header !== 'Acciones');

            return (
              <div 
                key={rowIdx} 
                className={`bg-background/80 border border-card-border rounded-xl p-4 shadow-sm flex flex-col gap-4 relative hover:border-brand-accent/30 transition-colors ${rowClassName ? rowClassName(item) : ''}`}
              >
                {/* Opciones de 3 puntos (Acciones) */}
                {accionesCol && accionesCol.cell && (
                  <div className="absolute top-3 right-3 z-10" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenMenuIdx(openMenuIdx === rowIdx ? null : rowIdx); }}
                      className="p-1.5 text-foreground/50 hover:text-brand-accent rounded-lg bg-background border border-card-border"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuIdx === rowIdx && (
                      <div className="absolute right-0 top-10 bg-card border border-card-border p-2 rounded-xl shadow-xl z-20 flex flex-col gap-2 min-w-[120px] animate-fade-in-up">
                        {accionesCol.cell(item)}
                      </div>
                    )}
                  </div>
                )}

                {otherCols.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider pr-8">{col.header}</span>
                    <div className="text-sm text-foreground w-full">
                      {col.cell 
                        ? col.cell(item) 
                        : (col.accessorKey ? getNestedValue(item, col.accessorKey as string) : <span className="text-foreground/30">-</span>)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-foreground/50 text-sm bg-background/50 rounded-xl border border-card-border">
            {searchTerm ? 'No se encontraron coincidencias.' : 'No hay datos disponibles.'}
          </div>
        )}
      </div>

      {/* Tabla Responsiva (Escritorio) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-foreground/5 text-foreground/70 uppercase font-semibold text-xs tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 ${col.sortable !== false && col.accessorKey ? 'cursor-pointer hover:bg-foreground/10 transition-colors select-none group' : ''}`}
                  onClick={() => col.sortable !== false && col.accessorKey ? handleSort(col.accessorKey as string) : null}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable !== false && col.accessorKey && (
                      <span className="text-foreground/30 group-hover:text-foreground/60 transition-colors">
                        {sortConfig?.key === col.accessorKey ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-brand-accent" /> : <ArrowDown size={14} className="text-brand-accent" />
                        ) : (
                          <ArrowUpDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {currentData.length > 0 ? (
              currentData.map((item, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  className={`hover:bg-foreground/5 transition-colors ${rowClassName ? rowClassName(item) : ''}`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      {col.cell 
                        ? col.cell(item) 
                        : (col.accessorKey ? getNestedValue(item, col.accessorKey as string) : null)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-foreground/50">
                  {searchTerm ? 'No se encontraron coincidencias.' : 'No hay datos disponibles.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/30">
          <div className="text-sm text-foreground/60">
            Página <span className="font-bold text-foreground">{currentPage}</span> de <span className="font-bold text-foreground">{totalPages}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => goToPage(1)} 
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 disabled:opacity-30 disabled:hover:bg-foreground/5 transition-colors text-foreground"
              title="Primera página"
            >
              <ChevronsLeft size={18} />
            </button>
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 disabled:opacity-30 disabled:hover:bg-foreground/5 transition-colors text-foreground"
              title="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1 px-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Lógica simple para mostrar hasta 5 números de página alrededor de la actual
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-brand-accent text-brand-dark' 
                        : 'text-foreground/70 hover:bg-foreground/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 disabled:opacity-30 disabled:hover:bg-foreground/5 transition-colors text-foreground"
              title="Página siguiente"
            >
              <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => goToPage(totalPages)} 
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 disabled:opacity-30 disabled:hover:bg-foreground/5 transition-colors text-foreground"
              title="Última página"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
