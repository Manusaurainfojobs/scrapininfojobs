// Componente para gestionar el historial de exportaciones
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Tipo para el historial de exportaciones
interface ExportHistoryItem {
  id: string;
  date: string;
  filename: string;
  records: number;
  fields: string[];
  filters?: {
    title?: string;
    company?: string;
    location?: string;
    dateRange?: [number, number];
    keywords?: string[];
  };
}

interface ExportHistoryProps {
  onSelectExport?: (historyItem: ExportHistoryItem) => void;
}

// Clave para almacenar el historial en localStorage
const STORAGE_KEY = 'infojobs-export-history';

export function ExportHistory({ onSelectExport }: ExportHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Cargar historial desde localStorage al iniciar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error al cargar el historial de exportaciones:', error);
    }
  }, []);
  
  // Filtrar historial por término de búsqueda
  const filteredHistory = searchTerm
    ? history.filter(item => 
        item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.filters?.keywords?.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    : history;
  
  // Añadir una nueva entrada al historial
  const addToHistory = (item: Omit<ExportHistoryItem, 'id'>) => {
    if (typeof window === 'undefined') return;
    
    const newItem: ExportHistoryItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 50); // Limitar a 50 entradas
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error al guardar el historial de exportaciones:', error);
    }
    
    return newItem;
  };
  
  // Eliminar una entrada del historial
  const removeFromHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error al guardar el historial de exportaciones:', error);
    }
  };
  
  // Limpiar todo el historial
  const clearHistory = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todo el historial de exportaciones?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  
  // Formatear lista de campos
  const formatFields = (fields: string[]) => {
    if (fields.length <= 3) {
      return fields.join(', ');
    }
    return `${fields.slice(0, 3).join(', ')} y ${fields.length - 3} más`;
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(true)}
          >
            Historial
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Historial de exportaciones</DialogTitle>
            <DialogDescription>
              Consulta y reutiliza configuraciones de exportaciones anteriores.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 py-4">
            <Input
              placeholder="Buscar en el historial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-auto flex-1 border rounded-md">
            {filteredHistory.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-medium">Fecha</th>
                    <th className="px-4 py-2 text-left font-medium">Archivo</th>
                    <th className="px-4 py-2 text-left font-medium">Registros</th>
                    <th className="px-4 py-2 text-left font-medium">Campos</th>
                    <th className="px-4 py-2 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2 whitespace-nowrap">{item.date}</td>
                      <td className="px-4 py-2 font-mono text-xs">{item.filename}</td>
                      <td className="px-4 py-2 text-center">{item.records}</td>
                      <td className="px-4 py-2">
                        <span className="text-xs text-muted-foreground">
                          {formatFields(item.fields)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {onSelectExport && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                onSelectExport(item);
                                setIsOpen(false);
                              }}
                            >
                              Usar
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFromHistory(item.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {history.length === 0 
                  ? "No hay historial de exportaciones" 
                  : "No se encontraron resultados para la búsqueda"}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <div>
              {history.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearHistory}>
                  Limpiar historial
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Exportar la función addToHistory para que pueda ser utilizada por otros componentes */}
      {React.createElement('div', {
        style: { display: 'none' },
        'data-export-history': true,
        ref: (el) => {
          if (el) {
            (el as any).addToHistory = addToHistory;
          }
        }
      })}
    </>
  );
}

// Función auxiliar para acceder al historial desde otros componentes
export function useExportHistory() {
  const [addToHistoryFn, setAddToHistoryFn] = useState<
    ((item: Omit<ExportHistoryItem, 'id'>) => ExportHistoryItem) | null
  >(null);
  
  useEffect(() => {
    // Buscar el componente ExportHistory en el DOM
    const historyEl = document.querySelector('[data-export-history="true"]');
    if (historyEl) {
      setAddToHistoryFn(() => (historyEl as any).addToHistory);
    }
  }, []);
  
  return {
    addToHistory: addToHistoryFn || ((item) => {
      console.warn('ExportHistory component not found in the DOM');
      return { ...item, id: Date.now().toString() };
    }),
  };
}
