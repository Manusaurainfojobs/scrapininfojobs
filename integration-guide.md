# Guía de Integración: Mejoras de Exportación CSV para InfoJobs Scraper

Esta guía proporciona instrucciones detalladas para integrar las mejoras de exportación CSV en el proyecto existente de InfoJobs Scraper.

## Archivos Incluidos

1. **export-csv-advanced.tsx**: Componente principal para exportación CSV con opciones avanzadas
2. **filter-before-export.tsx**: Componente para filtrar datos antes de exportar
3. **data-preview.tsx**: Componente para previsualizar datos antes de exportar
4. **export-history.tsx**: Componente para gestionar el historial de exportaciones
5. **export-toolbar.tsx**: Barra de herramientas básica que integra exportación y filtrado
6. **export-toolbar-complete.tsx**: Barra de herramientas completa que integra todas las funcionalidades

## Pasos de Integración

### 1. Copiar los Archivos de Componentes

Copia todos los archivos de componentes en el directorio de componentes de tu proyecto:

```bash
cp export-csv-advanced.tsx /ruta/a/tu/proyecto/src/components/ui/
cp filter-before-export.tsx /ruta/a/tu/proyecto/src/components/ui/
cp data-preview.tsx /ruta/a/tu/proyecto/src/components/ui/
cp export-history.tsx /ruta/a/tu/proyecto/src/components/ui/
cp export-toolbar.tsx /ruta/a/tu/proyecto/src/components/ui/
cp export-toolbar-complete.tsx /ruta/a/tu/proyecto/src/components/ui/
```

### 2. Actualizar las Importaciones

Asegúrate de que las rutas de importación en cada archivo sean correctas según la estructura de tu proyecto. Por ejemplo, si tus componentes UI están en una ubicación diferente, actualiza las importaciones en todos los archivos.

Ejemplo de importación que podría necesitar actualización:
```typescript
import { Button } from "@/components/ui/button"
```

### 3. Integrar en la Página de Resultados

Reemplaza el botón de exportación CSV existente en tu página de resultados con el nuevo componente `ExportToolbarComplete`:

```tsx
// En src/app/results/page.tsx o similar

import { ExportToolbarComplete } from "@/components/ui/export-toolbar-complete";

// Dentro de tu componente de página:
return (
  <div>
    {/* Otros elementos de la página */}
    
    <div className="flex justify-between items-center mb-4">
      <div>
        <span className="text-sm text-muted-foreground">
          Se encontraron {jobOffers.length} ofertas en total
        </span>
      </div>
      
      {/* Reemplazar el botón de exportación existente con este componente */}
      <ExportToolbarComplete 
        data={jobOffers} 
        filename="infojobs-ofertas"
      />
    </div>
    
    {/* Tabla de resultados y otros elementos */}
  </div>
);
```

### 4. Verificar Dependencias

Asegúrate de que todas las dependencias de UI necesarias estén disponibles en tu proyecto. Los componentes utilizan varios elementos de UI como Dialog, Button, Input, etc.

Si estás utilizando shadcn/ui, estos componentes deberían estar ya disponibles. Si no, necesitarás instalar y configurar estos componentes.

### 5. Personalización (Opcional)

Puedes personalizar los componentes según tus necesidades:

- **Cambiar el estilo**: Modifica las clases CSS para que coincidan con tu diseño
- **Ajustar funcionalidades**: Modifica los componentes para añadir o quitar características
- **Integración parcial**: Si solo necesitas algunas funcionalidades, puedes usar componentes individuales en lugar del `ExportToolbarComplete`

## Uso de Componentes Individuales

Si prefieres una integración más granular, puedes usar los componentes por separado:

### Solo Exportación Avanzada

```tsx
import { ExportCSVAdvanced } from "@/components/ui/export-csv-advanced";

<ExportCSVAdvanced data={jobOffers} filename="infojobs-ofertas" />
```

### Exportación con Filtrado

```tsx
import { ExportToolbar } from "@/components/ui/export-toolbar";

<ExportToolbar data={jobOffers} filename="infojobs-ofertas" />
```

### Solo Vista Previa

```tsx
import { DataPreview } from "@/components/ui/data-preview";

<DataPreview data={jobOffers} />
```

### Solo Historial

```tsx
import { ExportHistory } from "@/components/ui/export-history";

<ExportHistory onSelectExport={(historyItem) => {
  // Manejar la selección de un elemento del historial
}} />
```

## Pruebas

Después de integrar los componentes, realiza las siguientes pruebas:

1. **Exportación básica**: Verifica que puedes exportar datos a CSV
2. **Selección de campos**: Comprueba que puedes seleccionar qué campos exportar
3. **Opciones de formato**: Prueba diferentes delimitadores y formatos de fecha
4. **Filtrado**: Verifica que puedes filtrar datos antes de exportar
5. **Vista previa**: Comprueba que la vista previa muestra correctamente los datos
6. **Historial**: Verifica que las exportaciones se guardan en el historial y pueden reutilizarse

## Solución de Problemas

### Errores de Importación

Si encuentras errores relacionados con importaciones, verifica que las rutas sean correctas según la estructura de tu proyecto.

### Errores de Componentes UI

Si faltan componentes UI, asegúrate de que todos los componentes necesarios estén disponibles en tu proyecto.

### Problemas con localStorage

El historial de exportaciones utiliza localStorage para persistencia. Si encuentras problemas, verifica que localStorage esté disponible y funcionando correctamente en tu entorno.

### Datos Incorrectos

Si los datos no se muestran correctamente, verifica que la estructura de tus datos coincida con la esperada por los componentes (ver interfaces JobOffer en los archivos).

## Conclusión

Con estas mejoras, tu aplicación InfoJobs Scraper ahora cuenta con una funcionalidad de exportación CSV avanzada que permite a los usuarios personalizar completamente sus exportaciones, filtrar datos, previsualizar resultados y mantener un historial de exportaciones anteriores.

Esta implementación mejora significativamente la experiencia de usuario y facilita la integración con Google Sheets mediante la exportación de archivos CSV bien formateados que pueden importarse fácilmente.
