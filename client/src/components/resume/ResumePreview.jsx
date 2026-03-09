import React from 'react';
import useResumeStore from '../../store/useResumeStore';
import ModernTemplate from '../../templates/ModernTemplate';
import MinimalTemplate from '../../templates/MinimalTemplate';
import ProfessionalTemplate from '../../templates/ProfessionalTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import TechnicalTemplate from '../../templates/TechnicalTemplate';
import AcademicTemplate from '../../templates/AcademicTemplate';
import StartupTemplate from '../../templates/StartupTemplate';
import ClassicTemplate from '../../templates/ClassicTemplate';
import CompactTemplate from '../../templates/CompactTemplate';
import CleanTemplate from '../../templates/CleanTemplate';
import TechTemplate from '../../templates/TechTemplate';
import ElegantTemplate from '../../templates/ElegantTemplate';

const ResumePreview = () => {
    const { currentResume } = useResumeStore();

    if (!currentResume) return <div>Loading preview...</div>;

    // Render the selected template
    switch (currentResume.template) {
        case 'Minimal':
            return <MinimalTemplate data={currentResume} />;
        case 'Professional':
            return <ProfessionalTemplate data={currentResume} />;
        case 'Executive':
            return <ExecutiveTemplate data={currentResume} />;
        case 'Creative':
            return <CreativeTemplate data={currentResume} />;
        case 'Technical':
            return <TechnicalTemplate data={currentResume} />;
        case 'Academic':
            return <AcademicTemplate data={currentResume} />;
        case 'Startup':
            return <StartupTemplate data={currentResume} />;
        case 'Classic':
            return <ClassicTemplate data={currentResume} />;
        case 'Tech':
            return <TechTemplate data={currentResume} />;
        case 'Compact':
            return <CompactTemplate data={currentResume} />;
        case 'Clean':
            return <CleanTemplate data={currentResume} />;
        case 'Elegant':
            return <ElegantTemplate data={currentResume} />;
        case 'Modern':
        default:
            return <ModernTemplate data={currentResume} />;
    }
};

export default ResumePreview;
