// Reconstruit la grille d'affichage de public/icons.svg à partir du contenu des <defs>.
// Chaque bloc <defs> devient une bande de la grille, large de 10 icônes, empilées sans chevauchement.
// S'assure aussi que chaque <symbol> a un viewBox et que chaque <path> utilise fill="currentColor".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ICONS_PATH = path.resolve(__dirname, '../public/icons.svg');

const ICON_SIZE = 64;
const COLUMNS = 10;
const DISPLAY_GROUP_OPEN = '<g transform="scale(.1)" color="#800">';

function removeXmlProlog(svg) {
    return svg.replace(/^\uFEFF?\s*<\?xml[^?]*\?>\s*/, '');
}

function stripLegacyXlink(svg) {
    let result = svg.replace(/\s+xmlns:xlink\s*=\s*"[^"]*"/g, '');

    result = result.replace(/<([a-zA-Z][\w:-]*)\b([^>]*)>/g, (tag, tagName, attrs) => {
        if (!/xlink:href\s*=/.test(attrs)) return tag;
        attrs = /(^|\s)href\s*=/.test(attrs)
            ? attrs.replace(/\s*xlink:href\s*=\s*"[^"]*"/, '')
            : attrs.replace(/xlink:href(\s*=\s*")/, 'href$1');
        return `<${tagName}${attrs}>`;
    });

    return result;
}

function ensureCurrentColorFill(symbolContent) {
    return symbolContent.replace(/<path\b([^>]*?)\/>/g, (match, attrs) => {
        if (/fill\s*=\s*"[^"]*"/.test(attrs)) {
            attrs = attrs.replace(/fill\s*=\s*"[^"]*"/, 'fill="currentColor"');
        } else {
            attrs = `${attrs} fill="currentColor"`;
        }
        return `<path${attrs}/>`;
    });
}

function ensureViewBox(symbolAttrs) {
    if (/\bviewBox\s*=/.test(symbolAttrs)) return symbolAttrs;
    return `${symbolAttrs} viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}"`;
}

function fixDefs(svg) {
    const defsList = [];
    let defsIndex = 0;

    const fixedSvg = svg.replace(/<defs\b([^>]*)>([\s\S]*?)<\/defs>/g, (fullMatch, defsAttrs, defsContent) => {
        defsIndex += 1;
        const idMatch = /\bid\s*=\s*"([^"]+)"/.exec(defsAttrs);
        const name = idMatch ? idMatch[1].replace(/-defs$/, '') : `defs-${defsIndex}`;

        const ids = [];
        const fixedContent = defsContent.replace(/<symbol\b([^>]*)>([\s\S]*?)<\/symbol>/g, (symMatch, symAttrs, symContent) => {
            const symIdMatch = /\bid\s*=\s*"([^"]+)"/.exec(symAttrs);
            if (!symIdMatch) return symMatch;
            ids.push(symIdMatch[1]);

            const newAttrs = ensureViewBox(symAttrs);
            const newContent = ensureCurrentColorFill(symContent);
            return `<symbol${newAttrs}>${newContent}</symbol>`;
        });

        defsList.push({ name, ids });
        return `<defs${defsAttrs}>${fixedContent}</defs>`;
    });

    return { fixedSvg, defsList };
}

function buildGrid(defsList) {
    const blocks = [];
    let offsetY = 0;

    for (const { name, ids } of defsList) {
        if (ids.length === 0) continue;

        const rows = [];
        for (let i = 0; i < ids.length; i += COLUMNS) {
            const rowIds = ids.slice(i, i + COLUMNS);
            const rowIndex = i / COLUMNS;
            const uses = rowIds
                .map((id, col) => (col === 0 ? `                <use href="#${id}"/>` : `                <use x="${col * ICON_SIZE}" href="#${id}"/>`))
                .join('\n');
            const rowTransform = rowIndex === 0 ? '' : ` transform="translate(0,${rowIndex * ICON_SIZE})"`;
            rows.push(`            <g${rowTransform}>\n${uses}\n            </g>`);
        }

        const blockHeight = Math.ceil(ids.length / COLUMNS) * ICON_SIZE;
        const groupTransform = offsetY === 0 ? '' : ` transform="translate(0,${offsetY})"`;
        blocks.push(`        <g id="${name}"${groupTransform}>\n${rows.join('\n')}\n        </g>`);
        offsetY += blockHeight;
    }

    return blocks.join('\n');
}

function replaceDisplayGroup(svg, gridContent) {
    const openIdx = svg.lastIndexOf(DISPLAY_GROUP_OPEN);
    if (openIdx === -1) {
        throw new Error(`Groupe d'affichage introuvable : ${DISPLAY_GROUP_OPEN}`);
    }
    const svgCloseIdx = svg.lastIndexOf('</svg>');
    if (svgCloseIdx === -1) {
        throw new Error('Balise </svg> introuvable.');
    }

    const head = svg.slice(0, openIdx);
    const tail = svg.slice(svgCloseIdx);
    return `${head}${DISPLAY_GROUP_OPEN}\n${gridContent}\n    </g>\n${tail}`;
}

function main() {
    let svg = fs.readFileSync(ICONS_PATH, 'utf8');
    svg = removeXmlProlog(svg);
    svg = stripLegacyXlink(svg);
    const { fixedSvg, defsList } = fixDefs(svg);
    const gridContent = buildGrid(defsList);
    const result = replaceDisplayGroup(fixedSvg, gridContent);

    fs.writeFileSync(ICONS_PATH, result, 'utf8');

    const total = defsList.reduce((n, d) => n + d.ids.length, 0);
    console.log(`Grille reconstruite : ${defsList.length} bloc(s), ${total} icône(s).`);
    for (const { name, ids } of defsList) {
        console.log(`  - ${name}: ${ids.length} icône(s)`);
    }
}

main();
