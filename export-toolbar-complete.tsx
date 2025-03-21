// Componente integrado completo para exportación CSV avanzada
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ExportCSVAdvanced } from './export-csv-advanced'
import { FilterBeforeExport } from './filter-before-export'
import { DataPreview } from './data-preview'
import { ExportHistory, useExportHistory } from './export-history'

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

interface ExportToolbarCompleteProps {
  data: JobOffer[];
  filename?: string;
}

export function ExportToolbarComplete({ data, filename = "infojobs-ofertas" }: ExportToolbarCompleteProps) {
  const [filteredData, setFilteredData] = useState<JobOffer[]>(data);
  const { addToHistory } = useExportHistory();
  
  // Actualizar datos filtrados cuando cambian los datos originales
  useEffect(() => {
    setFilteredData(data);
  }, [data]);
  
  // Manejar cambios en los filtros
  const handleFilter = (newFilteredData: JobOffer[]) => {
    setFilteredData(newFilteredData);
  };
  
  // Manejar exportación y registrar en historial
  const handleExport = (exportConfig: any) => {
    // Aquí se podría implementar la lógica para registrar la exportación en el historial
    addToHistory({
      date: new Date().toLocaleString(),
      filename: `${filename}_${new Date().toISOString().slice(0, 10)}.csv`,
      records: filteredData.length,
      fields: exportConfig.fields || ['title', 'company', 'location', 'description', 'publication_date', 'url'],
      filters: exportConfig.filters
    });
  };
  
  // Manejar selección de exportación desde historial
  const handleSelectFromHistory = (historyItem: any) => {
    // Aquí se podría implementar la lógica para cargar una configuración desde el historial
    console.log('Cargando configuración desde historial:', historyItem);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <FilterBeforeExport data={data} onFilter={handleFilter} />
      <DataPreview 
        data={filteredData} 
        onExport={() => {
          // Aquí se podría implementar la lógica para iniciar la exportación desde la vista previa
        }} 
      />
      <ExportCSVAdvanced data={filteredData} filename={filename} />
      <ExportHistory onSelectExport={handleSelectFromHistory} />
      <div className="text-sm text-muted-foreground ml-2">
        {filteredData.length !== data.length && (
          <span>Mostrando {filteredData.length} de {data.length} registros</span>
        )}
      </div>
    </div>
  );
}
