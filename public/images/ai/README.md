# הדמיות AI – תמונות הגלריה

> הקובץ הזה נוצר אוטומטית. אחרי שינוי ברשימת הפרויקטים מריצים: `node tools/make-gallery-readme.mjs`

הרקע של העמוד בז', כמו בסקיצות, ולתמונות אין כותרות. כל תמונה מקבלת תיקייה משלה בתוך `images/ai/gallery/`. התמונה הראשית היא `1.jpg`, ומבטים נוספים הם `2.jpg`, `3.jpg` וכן הלאה. כשמוסיפים מבטים, מעדכנים ב-`content.json` (בתוך `capabilities` → `ai` → `galleryPage`) את השדה `"views"`.

התמונות שבתיקייה `images/ai/` עצמה (`cover.jpg`, `1.jpg` עד `4.jpg`) הן התמונות של "הדמיות AI" בעמוד הבית.

| # | הכותרת באתר | התיקייה | גודל מומלץ (רוחב × גובה) | צורה |
|---|---|---|---|---|
| 1 | (בלי כותרת) | `gallery/synagogue-arched-ark/` | 900 × 550 | לרוחב |
| 2 | (בלי כותרת) | `gallery/reading-nook/` | 550 × 550 | כמעט ריבוע |
| 3 | (בלי כותרת) | `gallery/bedroom-navy/` | 950 × 550 | רחבה |
| 4 | (בלי כותרת) | `gallery/synagogue-long-hall/` | 900 × 550 | לרוחב |
| 5 | (בלי כותרת) | `gallery/round-lounge/` | 950 × 550 | רחבה |
| 6 | (בלי כותרת) | `gallery/living-room-sofa/` | 950 × 550 | רחבה |
| 7 | (בלי כותרת) | `gallery/synagogue-carved-ark/` | 900 × 550 | לרוחב |
| 8 | (בלי כותרת) | `gallery/kids-bedroom/` | 950 × 550 | רחבה |
| 9 | (בלי כותרת) | `gallery/bedroom-desk/` | 950 × 550 | רחבה |
| 10 | (בלי כותרת) | `gallery/girls-room/` | 950 × 950 | כמעט ריבוע |
| 11 | (בלי כותרת) | `gallery/living-grey-sofa/` | 950 × 500 | רחבה |
| 12 | (בלי כותרת) | `gallery/kitchen-mint/` | 1100 × 600 | רחבה |
| 13 | (בלי כותרת) | `gallery/office/` | 950 × 550 | רחבה |
| 14 | (בלי כותרת) | `gallery/kitchen-white/` | 1100 × 600 | רחבה |
| 15 | (בלי כותרת) | `gallery/kitchen-chandelier/` | 950 × 950 | כמעט ריבוע |
| 16 | (בלי כותרת) | `gallery/living-pink-sofa/` | 950 × 550 | רחבה |
| 17 | (בלי כותרת) | `gallery/living-mint/` | 1100 × 600 | רחבה |
| 18 | (בלי כותרת) | `gallery/living-beige/` | 950 × 500 | רחבה |
| 19 | (בלי כותרת) | `gallery/balcony-sea/` | 1100 × 600 | רחבה |
| 20 | (בלי כותרת) | `gallery/floor-plan/` | 650 × 1150 | גבוהה |
| 21 | (בלי כותרת) | `gallery/glass-tower/` | 950 × 950 | כמעט ריבוע |
| 22 | (בלי כותרת) | `gallery/balcony-jerusalem/` | 1050 × 600 | רחבה |
| 23 | (בלי כותרת) | `gallery/office-building-night/` | 800 × 400 | רחבה |
| 24 | (בלי כותרת) | `gallery/white-building/` | 750 × 450 | רחבה |
| 25 | (בלי כותרת) | `gallery/stone-building/` | 800 × 850 | כמעט ריבוע |
| 26 | (בלי כותרת) | `gallery/glass-offices/` | 1100 × 600 | רחבה |
| 27 | (בלי כותרת) | `gallery/tower-sunset/` | 1050 × 600 | רחבה |

## תמונות חסרות

- `gallery/synagogue-long-hall/1.jpg`
- `gallery/living-grey-sofa/1.jpg`
- `gallery/living-beige/1.jpg`

## הסדר והפריסה

- התמונות ממלאות את תבניות סקיצות 32, 33 ו-34 (בסדר הזה), לפי הסדר ב-`content.json`. כל תבנית מקבלת 9 תמונות.
- תמונות חדשות מוסיפים בסוף הרשימה. אם אין מספיק תמונות לתבנית שלמה, הן מוצגות בשורות של שלוש.
- בזמן הפיתוח, תמונה חסרה מוצגת כמשבצת מפוספסת. באתר החי היא מוסתרת.
