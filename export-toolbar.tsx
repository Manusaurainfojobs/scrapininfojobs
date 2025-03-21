// Componente integrado para exportación CSV avanzada con filtrado
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ExportCSVAdvanced } from './export-csv-advanced'
import { FilterBeforeExport } from './filter-before-export'

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

interface ExportToolbarProps {
  data: JobOffer[];
  filename?: string;
}

export function ExportToolbar({ data, filename = "infojobs-ofertas" }: ExportToolbarProps) {
  const [filteredData, setFilteredData] = useState<JobOffer[]>(data);
  
  // Actualizar datos filtrados cuando cambian los datos originales
  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);
  
  // Manejar cambios en los filtros
  const handleFilter = (newFilteredData: JobOffer[]) => {
    setFilteredData(newFilteredData);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <FilterBeforeExport data={data} onFilter={handleFilter} />
      <ExportCSVAdvanced data={filteredData} filename={filename} />
      <div className="text-sm text-muted-foreground ml-2">
        {filteredData.length !== data.length && (
          <span>Mostrando {filteredData.length} de {data.length} registros</span>
        )}
      </div>
    </div>
  );
}
