/**
 * @file features/reports/pages/CreateReportPage.tsx
 * @description Página principal del flujo de creación de reportes.
 * Orquesta el paso 0 (selección de tipo) y el wizard de formulario.
 */

import { useState } from 'react';
import { ReportType } from '@/types';
import ReportTypeSelector from '../components/ReportTypeSelector';
import ReportFormWizard from '../components/ReportFormWizard';

const CreateReportPage = () => {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);

  const handleTypeSelect = (type: ReportType) => {
    setSelectedType(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedType(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Si no hay tipo seleccionado → mostrar selector
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-baby_pink-900 to-icy_blue-900">
        <ReportTypeSelector onSelect={handleTypeSelect} />
      </div>
    );
  }

  // Si hay tipo seleccionado → mostrar wizard
  return (
    <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-white to-icy_blue-900">
      <ReportFormWizard reportType={selectedType} onBack={handleBack} />
    </div>
  );
};

export default CreateReportPage;
