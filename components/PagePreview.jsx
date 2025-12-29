export default function PagePreview({ items, scale, gridRef, isGreyscale, SelectedTemplate }) {
    // Parse the size metadata from the selected template (default to 8.5x11 inches)
    const sizeStr = SelectedTemplate.size || "8.5x11";
    const [w, h] = sizeStr.split('x').map(parseFloat);

    // Determine how many items fit on a standard 8.5" x 11" sheet (accounting for 0.1in gap)
    const gap = 0.1;
    const itemsPerRow = Math.max(Math.floor((8.5 + gap) / (w + gap)), 1);
    const itemsPerCol = Math.max(Math.floor((11 + gap) / (h + gap)), 1);
    const itemsPerSheet = itemsPerRow * itemsPerCol;

    // Chunk the items array into pages (sheets)
    const pages = [];
    for (let i = 0; i < items.length; i += itemsPerSheet) {
        pages.push(items.slice(i, i + itemsPerSheet));
    }

    return (
        <div ref={gridRef} className="flex flex-col items-center gap-12 print:block print:gap-0 my-10 print:bg-transparent print:my-0">
            {pages.map((pageItems, pageIdx) => (
                <div
                    key={pageIdx}
                    className="shadow-2xl relative print:break-after-page overflow-hidden print:shadow-none print:!w-[8.5in] print:!h-[11in] print:bg-white"
                    style={{
                        width: `calc(8.5in * ${scale})`,
                        height: `calc(11in * ${scale})`,
                    }}
                >
                    {/* Cut line overlay for the whole sheet */}
                    <div className="absolute inset-0 border-2 border-dashed border-gray-300 pointer-events-none z-50 print:block" />
                    <div
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            width: "8.5in",
                            height: "11in",
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                            gap: '0.1in', // small gap to avoid overlap
                            filter: isGreyscale ? 'grayscale(100%)' : 'none',
                        }}
                        className="print:!transform-none print:!w-[8.5in] print:!h-[11in] print:bg-white print:!gap-0"
                    >
                        {pageItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`relative ${itemsPerSheet > 1 ? 'border border-dashed border-gray-300 overflow-hidden' : ''}`}
                                style={{ width: `${w}in`, height: `${h}in` }}
                            >
                                <SelectedTemplate data={item} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
