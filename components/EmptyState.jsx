import { Upload, Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function EmptyState({ isDragOver, setIsDragOver, handleDrop, handleFileUpload }) {
    return (
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
    );
}
