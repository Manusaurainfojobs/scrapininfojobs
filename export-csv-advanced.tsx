// Componente mejorado para exportación CSV con opciones avanzadas
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast-simplified"

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

interface ExportCSVProps {
  data: JobOffer[];
  filename?: string;
}

export function ExportCSVAdvanced({ data, filename = "infojobs-ofertas" }: ExportCSVProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    title: true,
    company: true,
    location: true,
    description: true,
    publication_date: true,
    url: true,
  });
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [exportHistory, setExportHistory] = useState<{
    date: string;
    filename: string;
    records: number;
  }[]>([]);
  
  // Campos disponibles para exportar
  const availableFields = [
    { id: "title", label: "Título" },
    { id: "company", label: "Empresa" },
    { id: "location", label: "Ubicación" },
    { id: "description", label: "Descripción" },
    { id: "publication_date", label: "Fecha de publicación" },
    { id: "url", label: "URL" },
  ];
  
  // Función para generar la vista previa de datos
  const generatePreview = () => {
    if (data.length === 0) return [];
    
    const fields = availableFields
      .filter(field => selectedFields[field.id])
      .map(field => field.id);
    
    const headers = includeHeaders 
      ? availableFields
          .filter(field => selectedFields[field.id])
          .map(field => field.label)
      : [];
    
    const rows = data.slice(0, 5).map(item => 
      fields.map(field => {
        if (field === 'publication_date' && item[field]) {
          // Formatear fecha según el formato seleccionado
          const date = new Date(item[field]);
          switch (dateFormat) {
            case "DD/MM/YYYY":
              return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            case "MM/DD/YYYY":
              return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            case "YYYY-MM-DD":
              return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            default:
              return item[field];
          }
        }
        return item[field] || '';
      })
    );
    
    return headers.length > 0 ? [headers, ...rows] : rows;
  };
  
  // Función para exportar a CSV
  const exportToCSV = () => {
    if (data.length === 0) {
      toast({
        title: "Error",
        description: "No hay datos para exportar",
        variant: "destructive"
      });
      return;
    }
    
    const fields = availableFields
      .filter(field => selectedFields[field.id])
      .map(field => field.id);
    
    if (fields.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos un campo para exportar",
        variant: "destructive"
      });
      return;
    }
    
    const headers = includeHeaders 
      ? availableFields
          .filter(field => selectedFields[field.id])
          .map(field => field.label)
      : [];
    
    const rows = data.map(item => 
      fields.map(field => {
        if (field === 'publication_date' && item[field]) {
          // Formatear fecha según el formato seleccionado
          const date = new Date(item[field]);
          switch (dateFormat) {
            case "DD/MM/YYYY":
              return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            case "MM/DD/YYYY":
              return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            case "YYYY-MM-DD":
              return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            default:
              return item[field];
          }
        }
        return item[field] || '';
      })
    );
    
    // Escapar campos si es necesario
    const escapeCsvValue = (value: string) => {
      if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };
    
    const csvContent = [
      ...(headers.length > 0 ? [headers.map(escapeCsvValue).join(delimiter)] : []),
      ...rows.map(row => row.map(escapeCsvValue).join(delimiter))
    ].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    // Añadir fecha al nombre del archivo
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const fullFilename = `${filename}_${dateStr}.csv`;
    
    link.setAttribute('download', fullFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Actualizar historial de exportaciones
    const newExportHistory = [
      {
        date: now.toLocaleString(),
        filename: fullFilename,
        records: data.length
      },
      ...exportHistory
    ].slice(0, 10); // Mantener solo las últimas 10 exportaciones
    
    setExportHistory(newExportHistory);
    
    toast({
      title: "Exportación completada",
      description: `Se han exportado ${data.length} registros a ${fullFilename}`,
    });
    
    setIsOpen(false);
  };
  
  // Actualizar vista previa cuando cambian las opciones
  React.useEffect(() => {
    if (isOpen) {
      setPreviewData(generatePreview());
    }
  }, [isOpen, selectedFields, delimiter, includeHeaders, dateFormat]);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(true)}
          disabled={data.length === 0}
        >
          Exportar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Exportar a CSV</DialogTitle>
          <DialogDescription>
            Configura las opciones de exportación para personalizar el archivo CSV.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="fields">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fields">Campos</TabsTrigger>
            <TabsTrigger value="format">Formato</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>
          
          {/* Pestaña de selección de campos */}
          <TabsContent value="fields" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Selecciona los campos a exportar</h3>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const allSelected = availableFields.every(field => selectedFields[field.id]);
                      const newSelectedFields = {...selectedFields};
                      availableFields.forEach(field => {
                        newSelectedFields[field.id] = !allSelected;
                      });
                      setSelectedFields(newSelectedFields);
                    }}
                  >
                    {availableFields.every(field => selectedFields[field.id]) 
                      ? "Deseleccionar Todos" 
                      : "Seleccionar Todos"}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`field-${field.id}`} 
                      checked={selectedFields[field.id] || false}
                      onCheckedChange={(checked) => {
                        setSelectedFields({
                          ...selectedFields,
                          [field.id]: !!checked
                        });
                      }}
                    />
                    <Label htmlFor={`field-${field.id}`}>{field.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Pestaña de opciones de formato */}
          <TabsContent value="format" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="delimiter">Delimitador</Label>
                <Select 
                  value={delimiter} 
                  onValueChange={setDelimiter}
                >
                  <SelectTrigger id="delimiter">
                    <SelectValue placeholder="Selecciona un delimitador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Coma (,)</SelectItem>
                    <SelectItem value=";">Punto y coma (;)</SelectItem>
                    <SelectItem value="\t">Tabulador</SelectItem>
                    <SelectItem value="|">Barra vertical (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Formato de fecha</Label>
                <Select 
                  value={dateFormat} 
                  onValueChange={setDateFormat}
                >
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Selecciona un formato de fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-headers" 
                  checked={includeHeaders}
                  onCheckedChange={(checked) => setIncludeHeaders(!!checked)}
                />
                <Label htmlFor="include-headers">Incluir encabezados</Label>
              </div>
            </div>
          </TabsContent>
          
          {/* Pestaña de vista previa */}
          <TabsContent value="preview" className="py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Vista previa (primeros 5 registros)</h3>
              
              {previewData.length > 0 ? (
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {previewData.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex === 0 && includeHeaders ? "bg-muted font-medium" : ""}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border px-3 py-2 truncate max-w-[200px]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay datos para mostrar en la vista previa
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                {data.length > 5 && "Mostrando solo los primeros 5 registros. "}
                El archivo exportado contendrá {data.length} registros en total.
              </p>
            </div>
          </TabsContent>
          
          {/* Pestaña de historial */}
          <TabsContent value="history" className="py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Historial de exportaciones recientes</h3>
              
              {exportHistory.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-3 py-2 text-left">Fecha</th>
                        <th className="px-3 py-2 text-left">Archivo</th>
                        <th className="px-3 py-2 text-right">Registros</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exportHistory.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-3 py-2">{item.date}</td>
                          <td className="px-3 py-2 font-mono text-xs">{item.filename}</td>
                          <td className="px-3 py-2 text-right">{item.records}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay historial de exportaciones
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={exportToCSV}>
            Exportar {data.length} registros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
