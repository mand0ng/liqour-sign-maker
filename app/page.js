'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Printer, FileDown, Loader2, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { templates } from '@/components/templates';

export default function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedTemplateName, setSelectedTemplateName] = useState('Light'); // Default to Light
    const [isGreyscale, setIsGreyscale] = useState(false);

    // React Component of the selected template
    const SelectedTemplate = templates[selectedTemplateName] || templates['Light'];

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Normalize keys
                const normalizedData = jsonData.map(row => {
                    const newRow = {};
                    Object.keys(row).forEach(key => {
                        newRow[key.toLowerCase().replace(/[^a-z0-9]/g, "")] = row[key];
                    });

                    const message1Status = newRow.message1status || newRow.msg1status || "No";
                    const message2Status = newRow.message2status || newRow.msg2status || "No";

                    return {
                        name: newRow.name || newRow.itemname || newRow.item || "Unknown Item",
                        price: newRow.price || 0,
                        size: newRow.size || "",
                        promo: newRow.promo || newRow.sale || "No",
                        message1Status: message1Status,
                        message1Content: newRow.message1contents || newRow.message1content || newRow.msg1 || "",
                        message2Status: message2Status,
                        message2Content: newRow.message2contents || newRow.message2content || newRow.msg2 || "",
                        storeName: newRow.storename || "Liquor Store",
                        storeNum: newRow.storenum || newRow.store || "000",
                        storeAddress: newRow.storeaddress || newRow.address || ""
                    };
                });

                setItems(normalizedData);
            } catch (error) {
                console.error("Error parsing file:", error);
                alert("Error parsing file. Please check the Excel format.");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            {
                Name: "Jameson Irish Whiskey",
                Size: "750ml",
                Price: 29.99,
                Promo: "Yes",
                "Message1 Status": "Yes",
                "Message1 Contents": "Best Seller",
                "Message2 Status": "No",
                "Message2 Contents": "",
                StoreName: "Pedro's Spirits",
                StoreNum: "101",
                StoreAddress: "123 Ocean Drive, Miami FL"
            },
            {
                Name: "Grey Goose Vodka",
                Size: "1L",
                Price: 45.00,
                Promo: "No",
                "Message1 Status": "No",
                "Message1 Contents": "",
                "Message2 Status": "Yes",
                "Message2 Contents": "Manager's Pick",
                StoreName: "Pedro's Spirits",
                StoreNum: "101",
                StoreAddress: "123 Ocean Drive, Miami FL"
            },
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "sign_template_v2.xlsx");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">

            {/* Control Panel */}
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
                                {Object.keys(templates).map(name => (
                                    <option key={name} value={name}>{name} Theme</option>
                                ))}
                            </select>
                        </div>

                        <Link
                            href="/generate"
                            className="text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors"
                        >
                            <Wand2 size={16} /> New AI Template
                        </Link>


                        {items.length > 0 && (
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none print:w-full print:mx-0">

                {items.length === 0 ? (
                    <div
                        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ease-in-out bg-white ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center max-w-md mx-auto py-12">
                            <div className="bg-gray-100 p-4 rounded-full mb-6 text-gray-500">
                                <Upload size={48} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Upload your Excel file</h3>
                            <p className="text-gray-500 mb-8">Drag and drop your spreadsheet here, or click to browse</p>

                            <label className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-transform active:scale-95 cursor-pointer shadow-lg mb-6 relative z-10">
                                Browse Files
                                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                            </label>

                            <div className="flex items-center gap-2 text-sm text-gray-500 relative z-10">
                                <span>Want a custom design?</span>
                                <Link href="/generate" className="text-purple-600 font-bold hover:underline flex items-center gap-1">
                                    <Wand2 size={14} /> Create AI Template
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:block print:gap-0">
                        {items.map((item, index) => (
                            <div key={index} className="print:break-after-page print:h-screen print:w-full print:flex print:items-center print:justify-center">
                                <div
                                    className="scale-[0.6] sm:scale-[0.8] md:scale-100 origin-top-left md:origin-center print:scale-100 print:origin-top-left item-preview-wrapper"
                                    style={{ filter: isGreyscale ? 'grayscale(100%)' : 'none' }}
                                >
                                    {/* Render the selected dynamic component */}
                                    <SelectedTemplate data={item} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {loading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin mb-4 text-black" size={48} />
                        <p className="text-xl font-bold">Processing...</p>
                    </div>
                </div>
            )}

        </div>
    );
}
