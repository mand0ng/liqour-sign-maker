'use client';
import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Loader2 } from 'lucide-react';
import { templates } from '@/components/templates';
import { exampleData } from './exampleData';
import ControlPanel from '@/components/ControlPanel';
import EmptyState from '@/components/EmptyState';
import PagePreview from '@/components/PagePreview';

export default function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedTemplateName, setSelectedTemplateName] = useState('Light'); // Default to Light
    const [isGreyscale, setIsGreyscale] = useState(false);
    const [scale, setScale] = useState(1);
    const gridRef = useRef(null);

    // React Component of the selected template
    const SelectedTemplate = templates[selectedTemplateName] || templates['Light'];

    // Dynamic Scale Calculation for WYSIWYG Preview
    useEffect(() => {
        const calculateScale = () => {
            if (gridRef.current) {
                const containerWidth = gridRef.current.offsetWidth;
                // 816px = 8.5in at 96dpi.
                // We want to fit pages.
                // Mobile: 1 page wide. Scale = containerWidth / 816
                // Desktop: 2 pages wide? or just comfortable max width.

                let targetCols = 1;
                if (window.innerWidth >= 1200) targetCols = 2; // Side by side on large screens
                if (window.innerWidth >= 1800) targetCols = 3;

                const gap = 32;
                const availableWidthPerPage = (containerWidth - ((targetCols - 1) * gap)) / targetCols;

                let newScale = availableWidthPerPage / 816;
                // Cap scale at 1 to prevent huge zoomed in signs
                newScale = Math.min(newScale, 1.2);

                setScale(newScale);
            }
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [items.length]);

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
        const ws = XLSX.utils.json_to_sheet(exampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "sign_template_v2.xlsx");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">

            <ControlPanel
                isGreyscale={isGreyscale}
                setIsGreyscale={setIsGreyscale}
                selectedTemplateName={selectedTemplateName}
                setSelectedTemplateName={setSelectedTemplateName}
                itemsLength={items.length}
                downloadTemplate={downloadTemplate}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none print:w-full print:mx-0 print:bg-transparent">
                {items.length === 0 ? (
                    <EmptyState
                        isDragOver={isDragOver}
                        setIsDragOver={setIsDragOver}
                        handleDrop={handleDrop}
                        handleFileUpload={handleFileUpload}
                    />
                ) : (
                    <PagePreview
                        items={items}
                        scale={scale}
                        gridRef={gridRef}
                        isGreyscale={isGreyscale}
                        SelectedTemplate={SelectedTemplate}
                    />
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
