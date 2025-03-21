// Componente para mostrar una vista previa de los datos antes de exportar
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tipos de datos
interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  publication_date: string;
  url: string;
  [key: string]: any;
}

interface DataPreviewProps {
  data: JobOffer[];
  onExport?: () => void;
}

export function DataPreview({ data, onExport }: DataPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<JobOffer[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("publication_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Campos disponibles para ordenar
  const sortableFields = [
    { id: "title", label: "Título" },
    { id: "company", label: "Empresa" },
    { id: "location", label: "Ubicación" },
    { id: "publication_date", label: "Fecha de publicación" },
  ];
  
  // Preparar datos para la vista previa
  useEffect(() => {
    if (!isOpen) return;
    
    // Filtrar por término de búsqueda
    let filtered = [...data];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(term) || 
        item.company?.toLowerCase().includes(term) || 
        item.location?.toLowerCase().includes(term) || 
        item.description?.toLowerCase().includes(term)
      );
    }
    
    // Ordenar datos
    filtered.sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      
      // Manejar fechas especialmente
      if (sortField === 'publication_date') {
        const dateA = fieldA ? new Date(fieldA).getTime() : 0;
        const dateB = fieldB ? new Date(fieldB).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Ordenamiento de texto
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Paginar
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);
    
    setPreviewData(paginatedData);
  }, [isOpen, data, searchTerm, sortField, sortDirection, currentPage, pageSize]);
  
  // Calcular número total de páginas
  const totalPages = Math.ceil(
    (searchTerm 
      ? data.filter(item => 
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.company?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.location?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        ).length 
      : data.length) / pageSize
  );
  
  // Cambiar página
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Cambiar ordenamiento
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(true)}
          disabled={data.length === 0}
        >
          Vista Previa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Vista previa de datos</DialogTitle>
          <DialogDescription>
            Explora y verifica los datos antes de exportarlos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar en los datos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Resetear a primera página al buscar
              }}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="sort-field" className="whitespace-nowrap">Ordenar por:</Label>
            <Select
              value={sortField}
              onValueChange={(value) => {
                setSortField(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="sort-field" className="w-[180px]">
                <SelectValue placeholder="Seleccionar campo" />
              </SelectTrigger>
              <SelectContent>
                {sortableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
        
        <div className="overflow-auto flex-1 border rounded-md">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-medium">Título</th>
                <th className="px-4 py-2 text-left font-medium">Empresa</th>
                <th className="px-4 py-2 text-left font-medium">Ubicación</th>
                <th className="px-4 py-2 text-left font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {previewData.length > 0 ? (
                previewData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-2">
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{item.company}</td>
                    <td className="px-4 py-2">{item.location}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatDate(item.publication_date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    {data.length === 0 
                      ? "No hay datos disponibles" 
                      : "No se encontraron resultados para la búsqueda"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="page-size" className="whitespace-nowrap">Mostrar:</Label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="page-size" className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Mostrando {previewData.length} de {data.length} registros
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </Button>
            
            <span className="text-sm px-2">
              Página {currentPage} de {totalPages || 1}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              »
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
          {onExport && (
            <Button onClick={() => {
              onExport();
              setIsOpen(false);
            }}>
              Exportar datos
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
