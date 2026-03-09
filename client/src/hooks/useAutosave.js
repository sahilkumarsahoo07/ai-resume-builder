import { useEffect, useState, useRef } from 'react';

const useAutosave = (saveFunction, delay = 2000, watchData) => {
    const [isSaving, setIsSaving] = useState(false);
    const dataRef = useRef(watchData);
    const firstRender = useRef(true);

    // Update the ref when data changes
    useEffect(() => {
        dataRef.current = watchData;
    }, [watchData]);

    useEffect(() => {
        // Skip the first render
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        setIsSaving(true);

        const handler = setTimeout(async () => {
            await saveFunction();
            setIsSaving(false);
        }, delay);

        return () => clearTimeout(handler);
    }, [watchData, delay, saveFunction]);

    const manualSave = async () => {
        setIsSaving(true);
        await saveFunction();
        setIsSaving(false);
    };

    return { isSaving, manualSave };
};

export default useAutosave;
