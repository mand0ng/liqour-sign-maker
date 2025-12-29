import { Printer, FileDown, Wand2, Upload } from 'lucide-react';
import Link from 'next/link';
import { templates } from '@/components/templates';

export default function ControlPanel({
    isGreyscale,
    setIsGreyscale,
    selectedTemplateName,
    setSelectedTemplateName,
    itemsLength,
    downloadTemplate
}) {
    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the "${selectedTemplateName}" template?`)) return;

        try {
            const res = await fetch('/api/delete-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: selectedTemplateName }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to delete');
            }

            alert('Template deleted successfully!');
            window.location.reload(); // Quick refresh to update list
        } catch (error) {
            console.error(error);
            alert('Error deleting template: ' + error.message);
        }
    };

    const isDefaultTemplate = ['Light', 'Dark', 'Gin Prompt', 'Funda Test'].includes(selectedTemplateName);

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">

                <div className="flex items-center gap-3">
                    <div className="bg-black text-white p-2 rounded-lg">
                        <Printer size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none">Liquor SignGen</h1>
                        <p className="text-xs text-gray-500">Automated Signage System</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">

                    {/* Grayscale Toggle */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg select-none">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                checked={isGreyscale}
                                onChange={(e) => setIsGreyscale(e.target.checked)}
                            />
                            Inksaver (B&W)
                        </label>
                    </div>

                    {/* Template Selector */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <select
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer py-1.5 pl-3 pr-8 min-w-[140px]"
                            value={selectedTemplateName}
                            onChange={(e) => setSelectedTemplateName(e.target.value)}
                        >
                            {Object.entries(templates).map(([name, Component]) => (
                                <option key={name} value={name}>
                                    {name} {Component.size ? `(${Component.size})` : ''} Theme
                                </option>
                            ))}
                        </select>
                    </div>

                    <Link
                        href="/generate"
                        className="text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                    >
                        <Wand2 size={16} /> New AI Template
                    </Link>

                    {!isDefaultTemplate && (
                        <button
                            onClick={handleDelete}
                            className="text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                        >
                            Delete
                        </button>
                    )}


                    {itemsLength > 0 && (
                        <button
                            onClick={() => window.print()}
                            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Printer size={18} />
                            Print All
                        </button>
                    )}

                    <button
                        onClick={downloadTemplate}
                        className="text-gray-600 hover:text-black text-sm font-medium flex items-center gap-1.5"
                    >
                        <FileDown size={16} />
                        XLSX
                    </button>
                </div>
            </div>
        </div>
    );
}
