import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { name, code } = await req.json();
        const safeName = name.replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `${safeName}.jsx`;

        // Ensure identifier starts with a letter (for imports)
        const varName = /^[0-9]/.test(safeName) ? `T${safeName}` : safeName;

        // 1. Write the component file
        const templatesDir = join(process.cwd(), 'components', 'templates');
        await writeFile(join(templatesDir, fileName), code);

        // 2. Update index.js
        const indexFile = join(templatesDir, 'index.js');
        let indexContent = await readFile(indexFile, 'utf8');

        // Add import
        if (!indexContent.includes(`import ${varName}`)) {
            const importStatement = `import ${varName} from './${safeName}';\n`;
            indexContent = importStatement + indexContent;
        }

        // Add to export list
        const exportPattern = /export const templates = {([\s\S]*?)};/;
        const match = indexContent.match(exportPattern);

        if (match) {
            const currentExports = match[1];
            if (!currentExports.includes(`'${safeName}':`)) {
                const newExports = currentExports.trimEnd() + `\n  '${safeName}': ${varName},\n`;
                indexContent = indexContent.replace(exportPattern, `export const templates = {${newExports}};`);
            }
        }

        await writeFile(indexFile, indexContent);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Save Template Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
