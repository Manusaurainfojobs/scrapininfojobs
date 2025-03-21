// Script de prueba para verificar la funcionalidad de exportación CSV avanzada
'use client'

import React, { useState, useEffect } from 'react'
import { ExportToolbarComplete } from './export-toolbar-complete'

// Datos de prueba
const mockData = [
  {
    id: 1,
    title: "Desarrollador Frontend",
    company: "TechCorp",
    location: "Huesca",
    description: "Experiencia en React y TypeScript",
    publication_date: "2025-03-15T10:30:00",
    url: "https://infojobs.net/oferta/1"
  },
  {
    id: 2,
    title: "Administrativo",
    company: "Gestiones SL",
    location: "Barbastro",
    description: "Conocimientos de contabilidad y atención al cliente",
    publication_date: "2025-03-18T09:15:00",
    url: "https://infojobs.net/oferta/2"
  },
  {
    id: 3,
    title: "Técnico de Mantenimiento",
    company: "Industrias Aragonesas",
    location: "Monzón",
    description: "Experiencia en mantenimiento industrial",
    publication_date: "2025-03-10T14:45:00",
    url: "https://infojobs.net/oferta/3"
  },
  {
    id: 4,
    title: "Dependiente/a",
    company: "Comercio Local",
    location: "Binéfar",
    description: "Atención al cliente y gestión de inventario",
    publication_date: "2025-03-19T11:20:00",
    url: "https://infojobs.net/oferta/4"
  },
  {
    id: 5,
    title: "Ingeniero/a Agrónomo",
    company: "AgroTech",
    location: "Graus",
    description: "Proyectos de innovación en agricultura",
    publication_date: "2025-03-05T08:00:00",
    url: "https://infojobs.net/oferta/5"
  }
];

export function TestExportFunctionality() {
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simular carga de datos
  useEffect(() => {
    // Simular un retraso de carga
    const timer = setTimeout(() => {
      setJobOffers(mockData);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Prueba de Exportación CSV Avanzada</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Cargando datos de prueba...</span>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm text-muted-foreground">
                Se encontraron {jobOffers.length} ofertas en total
              </span>
            </div>
            
            {/* Componente de exportación completo */}
            <ExportToolbarComplete 
              data={jobOffers} 
              filename="infojobs-ofertas-test"
            />
          </div>
          
          {/* Tabla de resultados */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Empresa</th>
                  <th className="px-4 py-2 text-left">Ubicación</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jobOffers.map((offer) => (
                  <tr key={offer.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="font-medium">{offer.title}</div>
                      {offer.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {offer.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{offer.company}</td>
                    <td className="px-4 py-2">{offer.location}</td>
                    <td className="px-4 py-2">
                      {new Date(offer.publication_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <a 
                        href={offer.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver oferta
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 p-4 border rounded-md bg-muted/50">
            <h2 className="text-lg font-semibold mb-2">Instrucciones de prueba</h2>
            <p className="mb-4">Utiliza los botones de la barra de herramientas para probar las siguientes funcionalidades:</p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Filtrar</strong>: Prueba a filtrar los datos por título, empresa o ubicación</li>
              <li><strong>Vista Previa</strong>: Explora los datos, ordénalos y busca dentro de ellos</li>
              <li><strong>Exportar CSV</strong>: Configura las opciones de exportación, selecciona campos y formatos</li>
              <li><strong>Historial</strong>: Después de exportar, verifica que la exportación se guarde en el historial</li>
            </ul>
            
            <p className="mt-4 text-sm text-muted-foreground">
              Nota: La exportación real descargará un archivo CSV en tu navegador.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
