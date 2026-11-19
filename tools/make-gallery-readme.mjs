// Generates public/images/visualization/README.md from content.json and the mosaic slot sizes
// in src/app/gallery-page/mosaic-layouts.ts. Run after changing the project list:
//   node tools/make-gallery-readme.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const images = join(root, 'public', 'images');

// Read slot sizes straight from the layout file, so the two never drift apart.
const layoutSrc = readFileSync(join(root, 'src/app/gallery-page/mosaic-layouts.ts'), 'utf8');
const readTemplates = (name) => {
  const start = layoutSrc.indexOf(`export const ${name}`);
  const end = layoutSrc.indexOf('\n];', start);
  return layoutSrc
    .slice(start, end)
    .split(/sketch: \d+/)
    .slice(1)
    // A slot is "{ x, y, w, h" (possibly over several lines). Frames ("frame: {…}") and
    // captions (no h) are not slots.
    .map((t) =>
      [...t.matchAll(/(?<!frame: )\{\s*x: \d+, y: \d+, w: (\d+), h: (\d+)/g)].map((m) => ({ w: +m[1], h: +m[2] })),
    );
};
const fallback = (() => {
  const m = layoutSrc.match(/FALLBACK_SLOT = \{ w: (\d+), h: (\d+) \}/);
  return { w: +m[1], h: +m[2] };
})();
const layouts = {
  exterior: readTemplates('MOSAIC_TEMPLATES'),
  interior: readTemplates('INTERIOR_TEMPLATES'),
  conservation: readTemplates('CONSERVATION_TEMPLATES'),
  synagogues: readTemplates('SYNAGOGUE_TEMPLATES'),
  'synagogues-exterior': readTemplates('SYNAGOGUE_EXTERIOR_TEMPLATES'),
  'sales-plans-2d': readTemplates('SALES_PLANS_2D_TEMPLATES'),
  'sales-plans-3d': readTemplates('SALES_PLANS_3D_TEMPLATES'),
  ai: readTemplates('AI_TEMPLATES'),
  brochure: readTemplates('BROCHURE_TEMPLATES'),
};

// Same rule as GalleryPage.layout(): whole templates in turn, leftovers in rows of three.
const slotsFor = (count, templates) => {
  const out = [];
  let t = 0;
  while (out.length < count) {
    const tpl = templates[t++ % templates.length];
    if (count - out.length >= tpl.length) out.push(...tpl);
    else while (out.length < count) out.push(fallback);
  }
  return out;
};

// Strip a BOM if an editor added one.
const content = JSON.parse(readFileSync(join(images, 'content.json'), 'utf8').replace(/^\uFEFF/, ''));
const cats = content.capabilities.find((c) => c.id === 'visualization').galleryPage.categories;

const round50 = (v) => Math.round(v / 50) * 50;
const shape = (r) =>
  r > 1.6 ? 'רחבה' : r > 1.05 ? 'לרוחב' : r > 0.9 ? 'כמעט ריבוע' : r > 0.7 ? 'לאורך' : 'גבוהה';

const header = '| # | הכותרת באתר | התיקייה | גודל מומלץ (רוחב × גובה) | צורה |\n|---|---|---|---|---|';
const rows = (cat) => {
  const slots = slotsFor(cat.projects.length, layouts[cat.layout ?? 'exterior']);
  return cat.projects
    .map((p, i) => {
      const s = slots[i];
      const title = p.title.replace(/\n/g, ' ') || '(בלי כותרת)';
      const dir = cat.folder.split('/').pop();
      return `| ${i + 1} | ${title} | \`${dir}/${p.folder}/\` | ${round50(s.w * 1.6)} × ${round50(s.h * 1.6)} | ${shape(s.w / s.h)} |`;
    })
    .join('\n');
};

const [exterior, interior] = cats;

const md = `# הדמיות – תמונות הגלריה

> הקובץ הזה נוצר אוטומטית. אחרי שינוי ברשימת הפרויקטים מריצים: \`node tools/make-gallery-readme.mjs\`

כל פרויקט מקבל תיקייה משלו. בתוך התיקייה:

- **\`1.jpg\`** – התמונה הראשית, שמופיעה בגלריה.
- **\`2.jpg\`**, **\`3.jpg\`** … – מבטים נוספים על אותו פרויקט. הם נפתחים בתצוגה המוגדלת, אחרי התמונה הראשית.

כשמוסיפים מבטים נוספים לפרויקט, מעדכנים ב-\`content.json\` את מספר המבטים. למשל, לפרויקט עם 3 תמונות:

\`\`\`json
{ "title": "מיכלין", "folder": "michlin", "views": 3 },
\`\`\`

הגדלים מתאימים למסך ברוחב 2000 פיקסלים ולמסכים חדים. אפשר לשלוח תמונה גדולה יותר, ובלבד שיחס הרוחב לגובה יישמר. אם היחס שונה, האתר חותך את הקצוות. כדאי לשמור כל תמונה כ-JPG בגודל של עד כ-500KB.

## חוץ – \`images/visualization/exterior/\`

${header}
${rows(exterior)}

## פנים – \`images/visualization/interior/\`

פרויקטי הפנים מסתדרים בתבניות הפסיפס של סקיצות 17, 19 ו-18 (בסדר הזה), לפי הסדר שבטבלה.

${header}
${rows(interior)}

## הסדר והפריסה

- הפרויקטים מסודרים בגלריה לפי הסדר שלהם ב-\`content.json\`. הם ממלאים את תבניות הפסיפס בזו אחר זו: בחוץ סקיצות 12, 13, 14, 16 ו-15, ובפנים סקיצות 17, 19 ו-18 (בסדר הזה).
- כדי שכל תמונה תיכנס למשבצת שתוכננה לה, כדאי לשמור על הסדר הקיים. פרויקט שמוסיפים באמצע הרשימה מזיז משבצת אחת את כל הפרויקטים שאחריו.
- פרויקטים חדשים מוסיפים בסוף הרשימה. הם נכנסים לתבנית הבאה במחזור. אם אין מספיק פרויקטים לתבנית שלמה, הם מוצגים בשורות של שלוש.
- כותרת עם ירידת שורה כותבים כך: \`"מלון דירות\\nברח' ההסתדרות"\`.
- בזמן הפיתוח, פרויקט בלי תמונה מוצג כמשבצת מפוספסת עם הנתיב שאליו צריך לשמור את הקובץ. באתר החי פרויקט כזה מוסתר.
`;

writeFileSync(join(images, 'visualization', 'README.md'), md, 'utf8');
console.log(`README written – ${exterior.projects.length} exterior, ${interior.projects.length} interior projects.`);

// ---------- Conservation ----------
const [conservation] = content.capabilities.find((c) => c.id === 'conservation').galleryPage.categories;

const mdConservation = `# שימור – תמונות הגלריה

> הקובץ הזה נוצר אוטומטית. אחרי שינוי ברשימת הפרויקטים מריצים: \`node tools/make-gallery-readme.mjs\`

כל פרויקט מקבל תיקייה משלו בתוך \`images/conservation/\`. התמונה הראשית היא \`1.jpg\`, ומבטים נוספים הם \`2.jpg\`, \`3.jpg\` וכן הלאה. כשמוסיפים מבטים, מעדכנים ב-\`content.json\` את השדה \`"views"\` של הפרויקט.

התמונה \`cover.jpg\` שבתיקייה הזו היא תמונת השער של "שימור" בעמוד הבית.

הגדלים מתאימים למסך ברוחב 2000 פיקסלים ולמסכים חדים. אם יחס הרוחב לגובה שונה, האתר חותך את הקצוות.

${header}
${rows(conservation)}

## הסדר והפריסה

- הפרויקטים ממלאים את תבניות הפסיפס של סקיצות 20 ו-21, לפי הסדר ב-\`content.json\`.
- פרויקטים חדשים מוסיפים בסוף הרשימה. אם אין מספיק פרויקטים לתבנית שלמה, הם מוצגים בשורות של שלוש.
- בזמן הפיתוח, פרויקט בלי תמונה מוצג כמשבצת מפוספסת. באתר החי פרויקט כזה מוסתר.
`;

writeFileSync(join(images, 'conservation', 'README.md'), mdConservation, 'utf8');
console.log(`README written – ${conservation.projects.length} conservation projects.`);

// ---------- Torah buildings ----------
const torahCats = content.capabilities.find((c) => c.id === 'synagogues').galleryPage.categories;
const torahExt = torahCats.find((c) => c.id === 'exterior');
const torah = torahCats.find((c) => c.id === 'interior');

const mdTorah = `# מבנים תורניים – תמונות הגלריה

> הקובץ הזה נוצר אוטומטית. אחרי שינוי ברשימת הפרויקטים מריצים: \`node tools/make-gallery-readme.mjs\`

בגלריה שתי לשוניות, חוץ ופנים, כמו בהדמיות. העמוד נפתח בלשונית פנים. כל פרויקט מקבל תיקייה משלו בתוך \`images/synagogues/exterior/\` או \`images/synagogues/interior/\`. התמונה הראשית היא \`1.jpg\`, ומבטים נוספים הם \`2.jpg\`, \`3.jpg\` וכן הלאה. כשמוסיפים מבטים, מעדכנים ב-\`content.json\` את השדה \`"views"\` של הפרויקט.

התמונות \`cover.jpg\` ו-\`extra.jpg\` שבתיקייה \`images/synagogues/\` הן התמונות של "מבנים תורניים" בעמוד הבית.

הגדלים מתאימים למסך ברוחב 2000 פיקסלים ולמסכים חדים. אם יחס הרוחב לגובה שונה, האתר חותך את הקצוות.

## חוץ – \`images/synagogues/exterior/\`

${torahExt.projects.length ? `${header}\n${rows(torahExt)}` : 'עדיין אין פרויקטים. עד שיתווספו, בלשונית חוץ מוצגת ההודעה "התמונות יעלו בקרוב".'}

## פנים – \`images/synagogues/interior/\`

${header}
${rows(torah)}

## הסדר והפריסה

- פרויקטי החוץ ממלאים את תבניות הפסיפס של סקיצות 24, 22 ו-23 (בסדר הזה), לפי הסדר ב-\`content.json\`.
- פרויקטי הפנים ממלאים את תבניות הפסיפס של סקיצות 26 ו-25 (בסדר הזה), לפי הסדר ב-\`content.json\`.
- פרויקטים חדשים מוסיפים בסוף הרשימה. אם אין מספיק פרויקטים לתבנית שלמה, הם מוצגים בשורות של שלוש.
- בזמן הפיתוח, פרויקט בלי תמונה מוצג כמשבצת מפוספסת. באתר החי פרויקט כזה מוסתר.
`;

writeFileSync(join(images, 'synagogues', 'README.md'), mdTorah, 'utf8');
console.log(`README written – ${torahExt.projects.length} exterior, ${torah.projects.length} interior torah-building projects.`);

// ---------- Sales plans ----------
const salesCats = content.capabilities.find((c) => c.id === 'sales-plans').galleryPage.categories;
const sales2d = salesCats.find((c) => c.id === '2d');
const sales3d = salesCats.find((c) => c.id === '3d');

const mdSales = `# תוכניות מכר – תמונות הגלריה

> הקובץ הזה נוצר אוטומטית. אחרי שינוי ברשימת הפרויקטים מריצים: \`node tools/make-gallery-readme.mjs\`

בגלריה שתי לשוניות: דו ממדי ותלת מימדי. הרקע של העמוד שחור, כמו בסקיצות. כל פרויקט מקבל תיקייה משלו בתוך \`images/sales-plans/2d/\` או \`images/sales-plans/3d/\`. התמונה הראשית היא \`1.jpg\`, ומבטים נוספים הם \`2.jpg\`, \`3.jpg\` וכן הלאה. כשמוסיפים מבטים, מעדכנים ב-\`content.json\` את השדה \`"views"\` של הפרויקט.

התמונות שבתיקייה \`images/sales-plans/\` עצמה (\`cover.jpg\`, \`key-plan.png\`, \`1.jpg\` עד \`4.jpg\`) הן התמונות של "תוכניות מכר" בעמוד הבית.

תוכנית מוצגת בשלמותה, בלי חיתוך. אם יחס הרוחב לגובה שונה מהמשבצת, יישארו שוליים שחורים. החריגים ממלאים את המשבצת: הכרטיסים עם הדפים הצבעוניים מאחור (סקיצה 27), וההדמיות המצולמות בתלת מימדי (סקיצות 30 ו-31). כדאי לשמור כל תמונה כ-JPG בגודל של עד כ-500KB.

## דו ממדי – \`images/sales-plans/2d/\`

${header}
${rows(sales2d)}

## תלת מימדי – \`images/sales-plans/3d/\`

${sales3d.projects.length ? `${header}\n${rows(sales3d)}` : 'עדיין אין פרויקטים. עד שיתווספו, בלשונית תלת מימדי מוצגת ההודעה "התמונות יעלו בקרוב".'}

## הסדר והפריסה

- פרויקטי הדו ממדי ממלאים את תבניות הפסיפס של סקיצות 27 ו-28 (בסדר הזה), לפי הסדר ב-\`content.json\`.
- פרויקטי התלת מימדי ממלאים את תבניות סקיצות 30, 31 ו-29 (בסדר הזה). סקיצה 30 ראשונה כי בה כותרת העמוד והלשוניות, וסקיצה 29 היא רצועת סיום.
- הכותרת של כל תוכנית מוצגת תמיד, במקום שלה בסקיצה.
- בסקיצה 28 חלק מהתוכניות נכנסות זו לתוך המרווחים של זו. למשל, "תכנון משרד" בצורת T נכנסת מתחת ל"פרויקט השושנה". לכן לתוכניות האלה צריך רקע שחור, כמו בסקיצה, ולא רקע לבן.
- פרויקטים חדשים מוסיפים בסוף הרשימה. אם אין מספיק פרויקטים לתבנית שלמה, הם מוצגים בשורות של שלוש.
- בזמן הפיתוח, פרויקט בלי תמונה מוצג כמשבצת מפוספסת. באתר החי פרויקט כזה מוסתר.
`;

writeFileSync(join(images, 'sales-plans', 'README.md'), mdSales, 'utf8');
console.log(`README written – ${sales2d.projects.length} 2D, ${sales3d.projects.length} 3D sales-plan projects.`);

// ---------- AI ----------
const aiCat = content.capabilities.find((c) => c.id === 'ai').galleryPage.categories[0];
const aiMissing = aiCat.projects.filter((p) => !existsSync(join(root, 'public', aiCat.folder, p.folder, '1.jpg')));

const mdAi = `# הדמיות AI – תמונות הגלריה

> הקובץ הזה נוצר אוטומטית. אחרי שינוי ברשימת הפרויקטים מריצים: \`node tools/make-gallery-readme.mjs\`

הרקע של העמוד בז', כמו בסקיצות, ולתמונות אין כותרות. כל תמונה מקבלת תיקייה משלה בתוך \`images/ai/gallery/\`. התמונה הראשית היא \`1.jpg\`, ומבטים נוספים הם \`2.jpg\`, \`3.jpg\` וכן הלאה. כשמוסיפים מבטים, מעדכנים ב-\`content.json\` (בתוך \`capabilities\` → \`ai\` → \`galleryPage\`) את השדה \`"views"\`.

התמונות שבתיקייה \`images/ai/\` עצמה (\`cover.jpg\`, \`1.jpg\` עד \`4.jpg\`) הן התמונות של "הדמיות AI" בעמוד הבית.

${header}
${rows(aiCat)}

## תמונות חסרות

${aiMissing.length ? aiMissing.map((p) => `- \`gallery/${p.folder}/1.jpg\``).join('\n') : 'אין.'}

## הסדר והפריסה

- התמונות ממלאות את תבניות סקיצות 32, 33 ו-34 (בסדר הזה), לפי הסדר ב-\`content.json\`. כל תבנית מקבלת 9 תמונות.
- תמונות חדשות מוסיפים בסוף הרשימה. אם אין מספיק תמונות לתבנית שלמה, הן מוצגות בשורות של שלוש.
- בזמן הפיתוח, תמונה חסרה מוצגת כמשבצת מפוספסת. באתר החי היא מוסתרת.
`;

writeFileSync(join(images, 'ai', 'README.md'), mdAi, 'utf8');
console.log(`README written – ${aiCat.projects.length} AI projects, ${aiMissing.length} missing.`);

// ---------- Brochures ----------
const brCat = content.capabilities.find((c) => c.id === 'brochure').galleryPage.categories[0];
// Every page is its own tile (GalleryCategory.pages), so slots are counted per page.
const brPages = brCat.projects.flatMap((p) =>
  Array.from({ length: p.views ?? 1 }, (_, i) => ({ project: p, file: `${p.folder}/${i + 1}.jpg` })),
);
const brSlots = slotsFor(brPages.length, layouts.brochure);
const brMissing = brPages.filter((pg) => !existsSync(join(root, 'public', brCat.folder, pg.file)));
const brHeader = '| # | הברושור | הקובץ | גודל מומלץ (רוחב × גובה) | צורה |\n|---|---|---|---|---|';
const brRows = brPages
  .map((pg, i) => {
    const s = brSlots[i];
    return `| ${i + 1} | ${pg.project.title} | \`gallery/${pg.file}\` | ${round50(s.w * 1.6)} × ${round50(s.h * 1.6)} | ${shape(s.w / s.h)} |`;
  })
  .join('\n');

const mdBrochure = `# ברושור פרויקט נדל"ן – תמונות הגלריה

> הקובץ הזה נוצר אוטומטית. אחרי שינוי ברשימת הברושורים מריצים: \`node tools/make-gallery-readme.mjs\`

כל ברושור מקבל תיקייה משלו בתוך \`images/brochure/gallery/\`. בתוך התיקייה, כל עמוד הוא קובץ: \`1.jpg\` (השער), \`2.jpg\`, \`3.jpg\` וכן הלאה. בגלריה כל עמוד מוצג במשבצת משלו, ומתחת לכל ברושור מופיעה רצועה בז' עם השם שלו. לחיצה על עמוד פותחת את הברושור כולו בתצוגה המוגדלת, בעמוד שנלחץ.

כשמוסיפים עמוד, מעדכנים ב-\`content.json\` (בתוך \`capabilities\` → \`brochure\` → \`galleryPage\`) את השדה \`"views"\` של הברושור.

התמונות שבתיקייה \`images/brochure/\` עצמה (\`cover.jpg\`, \`1.jpg\` עד \`4.jpg\`) הן התמונות של "ברושור פרויקט נדל"ן" בעמוד הבית.

תמונה עם רקע שקוף (PNG) מקבלת בייבוא את צבע הרקע של העמוד, \`#fffdf4\`.

${brHeader}
${brRows}

## עמודים חסרים

${brMissing.length ? brMissing.map((pg) => `- \`gallery/${pg.file}\` – ${pg.project.title}`).join('\n') : 'אין.'}

## הסדר והפריסה

- הברושורים ממלאים את תבניות סקיצות 35, 36 ו-37 (בסדר הזה), שני ברושורים בכל תבנית, לפי הסדר ב-\`content.json\`.
- כל תבנית בנויה למספר העמודים של הברושורים שבה: 3 ו-2 בסקיצה 35, 3 ו-3 בסקיצה 36, 4 ו-5 בסקיצה 37. שינוי במספר העמודים מזיז את כל העמודים שאחריו.
- בזמן הפיתוח, עמוד חסר מוצג כמשבצת מפוספסת. באתר החי המשבצת שלו נשארת ריקה, כדי ששאר העמודים יישארו במקומם.
`;

writeFileSync(join(images, 'brochure', 'README.md'), mdBrochure, 'utf8');
console.log(`README written – ${brCat.projects.length} brochures, ${brPages.length} pages, ${brMissing.length} missing.`);