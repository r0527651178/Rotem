# תמונות האתר

כל התמונות והטקסטים מוגדרים בקובץ `content.json` שבתיקייה הזו.
אחרי שינוי בקובץ או הוספת תמונה מספיק לרענן את הדפדפן. אין צורך בבנייה מחדש.

| תיקייה | מה שמים בה | איפה מוגדר ב-`content.json` |
|---|---|---|
| `hero/` | תמונות גדולות שמתחלפות בראש העמוד (מומלץ 2400px רוחב, JPG/WebP) | `hero.images` |
| `visualization/` | `cover.jpg` לתמונת "הדמיות" ותמונות לגלריה | `capabilities[0]` |
| `conservation/` | `cover.jpg` לתמונת "שימור", ותיקייה לכל פרויקט בעמוד הגלריה. הפירוט נמצא ב-`conservation/README.md` | `capabilities[1].galleryPage` |
| `synagogues/` | `cover.jpg`, תמונה קטנה בצד `extra.jpg`, ותיקייה לכל פרויקט בעמוד הגלריה של "מבנים תורניים". הפירוט נמצא ב-`synagogues/README.md` | `capabilities[2].galleryPage` |
| `sales-plans/` | `cover.jpg`, תרשים מפתח `key-plan.png`, התמונות `1.jpg` עד `4.jpg` לעמוד הבית, והתיקיות `2d/` ו-`3d/` לעמוד הגלריה של "תוכניות מכר". הפירוט נמצא ב-`sales-plans/README.md` | `capabilities[3].galleryPage` |
| `ai/` | `cover.jpg` והתמונות `1.jpg` עד `4.jpg` לעמוד הבית, והתיקייה `gallery/` לעמוד הגלריה של "הדמיות AI". הפירוט נמצא ב-`ai/README.md` | `capabilities[4].galleryPage` |
| `brochure/` | `cover.jpg` והתמונות `1.jpg` עד `4.jpg` לעמוד הבית, והתיקייה `gallery/` לעמוד הגלריה של "ברושור פרויקט נדל״ן" (תיקייה לכל ברושור, קובץ לכל עמוד). הפירוט נמצא ב-`brochure/README.md` | `capabilities[5].galleryPage` |
| `about/` | `cover.jpg` – התמונה בעמוד אודות (1024 × 1024, עם קווי הסקיצה שבתוכה), ו-`signature.png` – החתימה בכתב יד. הקווים המונפשים באתר מצוירים על הקווים שבתמונה, לפי הקואורדינטות שלה. אם מחליפים את התמונה, צריך לעדכן את `about.html` או לשנות את `about.lines` ל-`false` | `about` |
| (שורש) | `logo.png` – הלוגו בכותרת (רקע שקוף) | `logo` |
| (שורש) | `logo-menu.png` – הלוגו הגדול בתפריט | `menuLogo` |

- אפשר לשנות שמות קבצים, להוסיף או להסיר, ובלבד שהרשימה ב-`content.json` תתאים.
- תמונה שחסרה מוסתרת אוטומטית.
- זמן ההחלפה בין תמונות הכותרת במילישניות: `hero.intervalMs`.
- מומלץ לשמור תמונות כ-JPG בגודל של עד כ-500KB כדי שהאתר ייטען מהר.
