import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, '../components/templates');
const outputFile = path.join(templatesDir, 'index.js');

function generate() {
    console.log('Generating template imports...');

    const files = fs.readdirSync(templatesDir)
        .filter(f => f.endsWith('.jsx') && f !== 'index.js');

    const imports = [];
    const mappings = [];

    files.forEach(file => {
        const name = path.basename(file, '.jsx');
        // Standardize names: SignCard, SignCardDark, etc.
        // Ensure valid JS identifier (cannot start with a number)
        let importName = name.replace(/[^a-zA-Z0-9]/g, '');
        if (/^[0-9]/.test(importName)) {
            importName = 'T' + importName;
        }

        imports.push(`import ${importName} from './${name}';`);

        let label = name;
        if (name === 'SignCard') label = 'Light';
        if (name === 'SignCardDark') label = 'Dark';

        mappings.push(`  '${label}': ${importName},`);
    });

    const content = `// This file is auto-generated. Do not edit manually.
${imports.join('\n')}

export const templates = {
${mappings.join('\n')}
};
`;

    fs.writeFileSync(outputFile, content);
    console.log(`Successfully updated ${outputFile}`);
}

generate();
