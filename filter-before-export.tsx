// Componente para filtrado previo a la exportación
'use client'

import React, { useState } from 'react'
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
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

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

interface FilterProps {
  data: JobOffer[];
  onFilter: (filteredData: JobOffer[]) => void;
}

export function FilterBeforeExport({ data, onFilter }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<{
    title: string;
    company: string;
    location: string;
    dateRange: [number, number]; // días atrás
    keywords: string[];
  }>({
    title: "",
    company: "",
    location: "",
    dateRange: [0, 30],
    keywords: [],
  });
  
  const [keywordInput, setKeywordInput] = useState("");
  const [filteredCount, setFilteredCount] = useState(data.length);
  
  // Aplicar filtros a los datos
  const applyFilters = () => {
    let result = [...data];
    
    // Filtrar por título
    if (filters.title) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    // Filtrar por empresa
    if (filters.company) {
      result = result.filter(item => 
        item.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    
    // Filtrar por ubicación
    if (filters.location) {
      result = result.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Filtrar por rango de fechas
    if (filters.dateRange[0] !== 0 || filters.dateRange[1] !== 30) {
      const now = new Date();
      const minDate = new Date();
      const maxDate = new Date();
      
      minDate.setDate(now.getDate() - filters.dateRange[1]);
      maxDate.setDate(now.getDate() - filters.dateRange[0]);
      
      result = result.filter(item => {
        if (!item.publication_date) return false;
        const pubDate = new Date(item.publication_date);
        return pubDate >= minDate && pubDate <= maxDate;
      });
    }
    
    // Filtrar por palabras clave
    if (filters.keywords.length > 0) {
      result = result.filter(item => {
        const fullText = `${item.title} ${item.company} ${item.description || ''}`.toLowerCase();
        return filters.keywords.some(keyword => 
          fullText.includes(keyword.toLowerCase())
        );
      });
    }
    
    setFilteredCount(result.length);
    return result;
  };
  
  // Actualizar contador de resultados cuando cambian los filtros
  React.useEffect(() => {
    if (isOpen) {
      setFilteredCount(applyFilters().length);
    }
  }, [filters, isOpen]);
  
  // Añadir palabra clave
  const addKeyword = () => {
    if (keywordInput.trim() && !filters.keywords.includes(keywordInput.trim())) {
      setFilters({
        ...filters,
        keywords: [...filters.keywords, keywordInput.trim()]
      });
      setKeywordInput("");
    }
  };
  
  // Eliminar palabra clave
  const removeKeyword = (keyword: string) => {
    setFilters({
      ...filters,
      keywords: filters.keywords.filter(k => k !== keyword)
    });
  };
  
  // Aplicar filtros y cerrar diálogo
  const handleApplyFilters = () => {
    const filteredData = applyFilters();
    onFilter(filteredData);
    setIsOpen(false);
  };
  
  // Resetear filtros
  const resetFilters = () => {
    setFilters({
      title: "",
      company: "",
      location: "",
      dateRange: [0, 30],
      keywords: [],
    });
    setKeywordInput("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(true)}
          disabled={data.length === 0}
        >
          Filtrar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrar datos antes de exportar</DialogTitle>
          <DialogDescription>
            Define criterios para filtrar los datos que deseas exportar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title-filter">Título contiene</Label>
            <Input
              id="title-filter"
              placeholder="Filtrar por título..."
              value={filters.title}
              onChange={(e) => setFilters({...filters, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-filter">Empresa contiene</Label>
            <Input
              id="company-filter"
              placeholder="Filtrar por empresa..."
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location-filter">Ubicación contiene</Label>
            <Input
              id="location-filter"
              placeholder="Filtrar por ubicación..."
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Antigüedad (días)</Label>
            <div className="pt-2 px-2">
              <Slider
                defaultValue={[0, 30]}
                min={0}
                max={30}
                step={1}
                value={filters.dateRange}
                onValueChange={(value) => setFilters({...filters, dateRange: value as [number, number]})}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Hoy</span>
                <span>{filters.dateRange[0]} - {filters.dateRange[1]} días</span>
                <span>30 días</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keyword-filter">Palabras clave</Label>
            <div className="flex space-x-2">
              <Input
                id="keyword-filter"
                placeholder="Añadir palabra clave..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button type="button" onClick={addKeyword} size="sm">
                Añadir
              </Button>
            </div>
            
            {filters.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                    <button
                      className="ml-1 text-xs"
                      onClick={() => removeKeyword(keyword)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-2 border-t">
            <div className="text-sm">
              Resultados: <strong>{filteredCount}</strong> de {data.length} registros
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            <Button variant="ghost" onClick={resetFilters} size="sm">
              Resetear
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyFilters}>
              Aplicar filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
