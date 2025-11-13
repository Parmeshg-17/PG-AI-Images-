import React, { useState, useRef } from 'react';

// Icons based on the image
const LayersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const ChevronDownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const BlockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;
const PlusCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const FileIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>;

type EnvVariable = {
  id: number;
  key: string;
  value: string;
};

const AdminEnvironmentPage = () => {
    const [variables, setVariables] = useState<EnvVariable[]>([
        { id: Date.now(), key: 'CLIENT_KEY...', value: '' }
    ]);
    const [showPasteArea, setShowPasteArea] = useState(false);
    const [pastedContent, setPastedContent] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleVariableChange = (id: number, field: 'key' | 'value', val: string) => {
        setVariables(vars => vars.map(v => v.id === id ? { ...v, [field]: val } : v));
    };

    const addVariable = () => {
        setVariables(vars => [...vars, { id: Date.now(), key: '', value: '' }]);
    };

    const removeVariable = (id: number) => {
        setVariables(vars => vars.filter(v => v.id !== id));
    };
    
    const parseAndSetEnv = (content: string) => {
        const newVars: EnvVariable[] = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(line => {
                const parts = line.split('=');
                const key = parts.shift() || '';
                const value = parts.join('=');
                return { id: Date.now() + Math.random(), key, value: value.replace(/(^"|"$)/g, '') };
            })
            .filter(v => v.key);
        
        if (newVars.length > 0) {
            setVariables(vars => {
                const filledVars = vars.filter(v => v.key || v.value);
                const uniqueNewVars = newVars.filter(nv => !filledVars.some(fv => fv.key === nv.key));
                return [...filledVars, ...uniqueNewVars];
            });
        }
    };
    
    const handlePaste = () => {
        parseAndSetEnv(pastedContent);
        setPastedContent('');
        setShowPasteArea(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                parseAndSetEnv(content);
            };
            reader.readAsText(file);
        }
        event.target.value = ''; // Reset file input
    };

    const triggerFileImport = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            // In a real app, this would be an authenticated request to a Netlify function.
            const response = await fetch('/.netlify/functions/manage-env', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    variables: variables.filter(v => v.key.trim() && v.value.trim()) 
                }),
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
    
            setSaveStatus('success');
        } catch (error) {
            console.error('Error saving variables:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const getSaveButtonText = () => {
        if (isSaving) return 'Saving...';
        if (saveStatus === 'success') return 'Saved!';
        if (saveStatus === 'error') return 'Error! Retry';
        return 'Save';
    };
    
    const getSaveButtonClasses = () => {
        let baseClasses = "px-6 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50";
        if (saveStatus === 'success') {
            return `${baseClasses} bg-green-500 text-white`;
        }
        if (saveStatus === 'error') {
            return `${baseClasses} bg-red-500 text-white`;
        }
        return `${baseClasses} bg-white text-black hover:opacity-90`;
    };

    return (
        <div className="bg-dark text-dark-text p-8 rounded-lg space-y-6 font-sans" style={{backgroundColor: '#0A0A0A'}}>
             <h2 className="text-2xl font-bold font-heading">Environments</h2>

            <div className="space-y-4">
                <div className="flex justify-between items-center bg-dark-secondary p-3 rounded-lg border border-dark-border">
                    <div className="flex items-center gap-3">
                        <LayersIcon />
                        <span className="font-medium">All Environments</span>
                    </div>
                    <ChevronDownIcon />
                </div>
                <button className="w-full bg-dark-secondary p-3 rounded-lg border border-dark-border font-medium hover:border-gray-600 transition-colors">
                    Select a custom Preview branch
                </button>
            </div>
            
            <hr className="border-dark-border" />
            
            <div>
                <div className="grid grid-cols-12 gap-4 mb-2 text-sm text-gray-400">
                    <div className="col-span-5">Key</div>
                    <div className="col-span-5">Value</div>
                </div>
                
                <div className="space-y-3">
                    {variables.map((variable) => (
                        <div key={variable.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-5">
                                <input 
                                    type="text"
                                    placeholder={variable.key ? '' : 'New key'}
                                    value={variable.key}
                                    onChange={(e) => handleVariableChange(variable.id, 'key', e.target.value)}
                                    className="w-full px-3 py-2 bg-dark-secondary rounded-md border border-dark-border focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                             <div className="col-span-5">
                                <input 
                                    type="password"
                                    placeholder="New value"
                                    value={variable.value}
                                    onChange={(e) => handleVariableChange(variable.id, 'value', e.target.value)}
                                    className="w-full px-3 py-2 bg-dark-secondary rounded-md border border-dark-border focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <button className="p-2 rounded-md border border-dark-border hover:bg-dark-secondary transition-colors" aria-label="Edit variable">
                                    <EditIcon />
                                </button>
                                <button onClick={() => removeVariable(variable.id)} className="p-2 rounded-md border border-dark-border hover:bg-dark-secondary transition-colors" aria-label="Remove variable">
                                    <BlockIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                 {showPasteArea && (
                    <div className="mt-4 space-y-2 animate-fade-in">
                        <textarea
                            value={pastedContent}
                            onChange={(e) => setPastedContent(e.target.value)}
                            placeholder="Paste your .env file contents here..."
                            rows={6}
                            className="w-full p-3 bg-dark-secondary rounded-md border border-dark-border focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <div className="flex justify-end gap-2">
                             <button onClick={() => setShowPasteArea(false)} className="px-4 py-2 bg-dark-secondary rounded-lg border border-dark-border font-semibold text-sm hover:border-gray-600 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handlePaste} className="px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                                Add
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <hr className="border-dark-border" />
            
            <div>
                 <button onClick={addVariable} className="flex items-center gap-2 p-2 rounded-md border border-dark-border hover:bg-dark-secondary transition-colors font-medium">
                    <PlusCircleIcon />
                    Add Another
                </button>
            </div>
            
            <hr className="border-dark-border" />

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".env" />
                    <button onClick={triggerFileImport} className="flex items-center gap-2 px-3 py-2 rounded-md border border-dark-border hover:bg-dark-secondary transition-colors font-medium text-sm">
                        <FileIcon />
                        Import .env
                    </button>
                    <span className="text-gray-400 text-sm">
                        or <button onClick={() => setShowPasteArea(s => !s)} className="underline hover:text-white">paste the .env contents</button>
                    </span>
                </div>
                 <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={getSaveButtonClasses()}>
                    {getSaveButtonText()}
                </button>
            </div>
        </div>
    );
};

export default AdminEnvironmentPage;