'use client';
import { useState } from 'react';
import { Upload, Code, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function GeneratePage() {
    const [apiKey, setApiKey] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [targetWidth, setTargetWidth] = useState('');
    const [targetHeight, setTargetHeight] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!apiKey || !image) {
            alert("Please provide both API Key and Image");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey, image, width: targetWidth, height: targetHeight })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setGeneratedCode(data.code);
        } catch (e) {
            alert("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!templateName || !generatedCode) return;
        try {
            const res = await fetch('/api/save-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: templateName, code: generatedCode })
            });
            if (res.ok) {
                alert("Template Saved! You can now use it on the home page.");
                window.location.href = "/";
            } else {
                alert("Failed to save template.");
            }
        } catch (e) {
            alert("Error saving: " + e.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="flex items-center text-gray-500 hover:text-black mb-8">
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-2">AI Template Generator</h1>
                <p className="text-gray-500 mb-8">Upload a picture of a sign you like, and we'll clone it.</p>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Gemini API Key</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="AIzaSy..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">Stored locally in your browser.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reference Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 relative">
                            {image ? (
                                <img src={image} alt="Preview" className="max-h-64 mx-auto rounded shadow-sm" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Upload size={32} className="mb-2" />
                                    <span>Click to upload image</span>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer h-full w-full" onChange={handleImageUpload} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Width (in)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                placeholder="e.g. 8.5"
                                value={targetWidth}
                                onChange={(e) => setTargetWidth(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height (in)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                placeholder="e.g. 11"
                                value={targetHeight}
                                onChange={(e) => setTargetHeight(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={() => { setTargetWidth(''); setTargetHeight(''); }}
                                className="text-xs text-gray-500 hover:text-black underline cursor-pointer"
                            >
                                Reset to 8.5x11
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Code />}
                        {loading ? "Analyzing Image..." : "Generate Code"}
                    </button>

                    {generatedCode && (
                        <div className="mt-8 border-t pt-8">
                            <h3 className="font-bold mb-4">Generated Template Code</h3>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono mb-4 h-64 overflow-y-scroll">
                                <pre>{generatedCode}</pre>
                            </div>

                            <div className="flex gap-4 items-end">
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Give it a name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="MyCustomTheme"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Template
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
