import React from 'react';
import type { ProcessStep } from './types';
import { SearchIcon, DocumentIcon } from './components/icons';

const AssistantResponse: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mt-4 animate-fadeIn">
    <p className="font-semibold text-teal-400 mb-2">Respuesta del Asistente:</p>
    {children}
  </div>
);

export const PROCESS_FLOW: Record<number, ProcessStep> = {
  0: {
    id: 0,
    title: "Inicio: Nueva Alerta",
    description: "El sistema de monitoreo transaccional ha generado una nueva alerta. Inicie el proceso de investigación.",
    command: 'Asistente Cumplimiento, [Abre Alerta] 2025-452.',
    assistantResponse: (
      <AssistantResponse>
        <p>Alerta 2025-452 abierta. Cargando expediente del cliente y actividad transaccional relevante...</p>
      </AssistantResponse>
    ),
    nextStepId: 1,
  },
  1: {
    id: 1,
    title: "Paso 1: Carga y Resumen",
    description: "El expediente está cargado. Solicite un resumen para obtener una vista general del perfil de riesgo y la actividad reciente.",
    command: '[Dame Perfil de Riesgo] y la actividad transaccional de 6 meses.',
    assistantResponse: (
      <AssistantResponse>
        <div className="space-y-3">
          <p><strong className="text-white">Resumen del Expediente:</strong></p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li><span className="font-medium text-gray-300">Cliente:</span> ACME Corp S.A.</li>
            <li><span className="font-medium text-gray-300">Nivel de Riesgo:</span> Medio-Alto.</li>
            <li><span className="font-medium text-gray-300">Actividad Típica:</span> Transferencias internacionales B2B, sector import/export.</li>
            <li><span className="font-medium text-gray-300">Alerta Actual:</span> Transferencia de $250,000 USD a una nueva contraparte en jurisdicción de alto riesgo.</li>
          </ul>
          <p>Presentando el historial transaccional de los últimos 6 meses...</p>
        </div>
      </AssistantResponse>
    ),
    nextStepId: 2,
  },
  2: {
    id: 2,
    title: "Paso 2: Búsqueda de Datos",
    description: "El Asistente ha iniciado automáticamente consultas en bases de datos internas (KYC) y externas (noticias adversas, registros corporativos) para enriquecer el perfil.",
    command: 'Procesando...',
    assistantResponse: (
      <AssistantResponse>
        <div className="space-y-3">
          <p><strong className="text-white">Resultados de Búsqueda Automática:</strong></p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li><span className="text-green-400">Interno:</span> Perfil KYC completo y actualizado. Sin alertas previas de naturaleza similar.</li>
            <li><span className="text-yellow-400">Externo:</span> Se encontró una mención en medios sobre la contraparte relacionada con investigaciones de evasión fiscal hace 2 años. <span className="text-white font-semibold">Requiere atención.</span></li>
          </ul>
        </div>
      </AssistantResponse>
    ),
    nextStepId: 3,
  },
  3: {
    id: 3,
    title: "Paso 3: Consulta Regulatoria",
    description: "Con la información de medios adversos, es prudente realizar una consulta regulatoria específica y revisar los procedimientos internos.",
    command: '[Busca en Listas de Sanciones] y [Lee Procedimiento] de DDI.',
    assistantResponse: (
      <AssistantResponse>
        <div className="flex items-start space-x-3">
          <SearchIcon className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" />
          <div>
            <p><strong className="text-white">Resultados de Listas de Sanciones (OFAC, ONU, UE):</strong></p>
            <p className="text-gray-400">No se encontraron coincidencias directas para la contraparte ni sus directores conocidos.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 mt-3">
          <DocumentIcon className="w-5 h-5 mt-1 text-blue-400 flex-shrink-0" />
          <div>
            <p><strong className="text-white">Procedimiento Interno (Debida Diligencia Intensificada - DDI):</strong></p>
            <p className="text-gray-400">Para transacciones con contrapartes en jurisdicciones de alto riesgo con medios adversos, se requiere la aprobación de un segundo nivel y la documentación del propósito comercial.</p>
          </div>
        </div>
      </AssistantResponse>
    ),
    nextStepId: 4,
  },
  4: {
    id: 4,
    title: "Paso 4: Punto de Decisión Crítica",
    description: "Analice toda la información recopilada: la naturaleza de la transacción, el perfil del cliente, los medios adversos sobre la contraparte y los requisitos del procedimiento interno. Determine si la alerta justifica una investigación intensiva (Verdadero Positivo) o si puede ser desestimada (Falso Positivo).",
    command: 'Analiza el riesgo vs. el patrón. Elige clasificar.',
    assistantResponse: (
      <AssistantResponse>
        <p>A la espera de su decisión. Por favor, clasifique la alerta para continuar con el flujo de trabajo apropiado.</p>
      </AssistantResponse>
    ),
    decision: {
      truePositive: {
        command: "[Clasifica como Verdadero Positivo] y [Crea Borrador del ROS].",
        nextStepId: 5,
      },
      falsePositive: {
        command: "[Clasifica como Falso Positivo] y [Cierra con Justificación].",
        nextStepId: 6,
      },
    },
  },
  5: {
    id: 5,
    title: "Paso 5a: Verdadero Positivo",
    description: "Ha determinado que la operación es sospechosa. El Asistente ahora creará un borrador del Reporte de Operación Sospechosa (ROS) con la información recopilada.",
    command: 'Generando borrador del ROS...',
    assistantResponse: (
      <AssistantResponse>
        <p>Borrador del ROS (Reporte de Operación Sospechosa) creado y adjuntado al expediente. El documento incluye datos del cliente, detalles de la transacción y hallazgos de la investigación. Por favor, proceda a añadir su análisis cualitativo.</p>
      </AssistantResponse>
    ),
    nextStepId: 7,
  },
  6: {
    id: 6,
    title: "Paso 5b: Falso Positivo",
    description: "Ha determinado que la operación no es sospechosa. Por favor, proporcione una justificación clara y concisa para cerrar la alerta. Esta justificación quedará registrada para fines de auditoría.",
    command: 'Esperando justificación...',
    assistantResponse: (
      <AssistantResponse>
        <p>Por favor, ingrese su justificación en el campo de texto a continuación para cerrar la alerta como Falso Positivo.</p>
      </AssistantResponse>
    ),
    requiresInput: 'justification',
    nextStepId: 8,
  },
  7: {
    id: 7,
    title: "Paso 6: Análisis del Oficial",
    description: "El borrador del ROS está listo. Su experiencia es crucial. Añada su análisis cualitativo, explicando por qué considera la operación sospechosa. Puede usar una nota de voz para mayor agilidad.",
    command: '[Añade Nota de Voz] al Análisis del Oficial.',
    assistantResponse: (
      <AssistantResponse>
        <p>Grabadora de voz activada. Por favor, dicte su análisis. El sistema transcribirá y adjuntará el texto al ROS.</p>
      </AssistantResponse>
    ),
    requiresInput: 'voiceNote',
    nextStepId: 9,
  },
  8: {
      id: 8,
      title: "Fin: Alerta Cerrada",
      description: "La alerta ha sido clasificada como Falso Positivo y cerrada con la justificación proporcionada. El expediente ha sido archivado.",
      command: 'Proceso finalizado.',
      assistantResponse: (
        <AssistantResponse>
            <p className='text-green-400'>Proceso completado. La alerta 2025-452 ha sido archivada correctamente.</p>
        </AssistantResponse>
      ),
      isFinal: true,
  },
  9: {
    id: 9,
    title: "Fin: ROS Enviado",
    description: "El Asistente ha transcrito su nota de voz. El ROS está completo y ha sido marcado para revisión final antes de ser enviado a la autoridad competente.",
    command: 'Aprobar y enviar.',
    assistantResponse: (
      <AssistantResponse>
          <p className='text-green-400'>Transcripción completada y añadida al ROS. El expediente está listo para la revisión final y envío. Proceso completado.</p>
      </AssistantResponse>
    ),
    isFinal: true,
  },
};