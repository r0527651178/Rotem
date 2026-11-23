/**
 * Mosaic templates measured from sketches 12, 13, 14, 16, 15 (content width 1918 sketch px).
 * Slots are listed in reading order (RTL: right column first, top to bottom),
 * which is also the order projects are taken from content.json.
 * Projects fill the templates one after another; the cycle repeats if there are more.
 */
export const MOSAIC_WIDTH = 1918;

export interface MosaicBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MosaicSlot extends MosaicBox {
  /** Two coloured sheets fanned out behind the card (sketch 27): [front sheet, back sheet]. */
  sheets?: [string, string];
  /** A caption that is always visible, placed by its own box (sketch px; h is not needed). */
  caption?: {
    x: number;
    y: number;
    w: number;
    align?: 'left' | 'right' | 'center';
    /** The caption sits on the image itself (sketches 30, 31): no page-colour strip, a soft shadow instead. */
    over?: boolean;
    /**
     * A beige band with white text that names a whole group of tiles (brochures, sketches 35–37).
     * Put it on the group's last slot, so on phones it follows the group.
     */
    band?: boolean;
  };
  /** A thin outline drawn around the tile (sketch 28, "תוכניות החי"ם"). */
  frame?: MosaicBox;
  /** Stacking order when boxes overlap. Default 1; 0 puts the tile under its neighbours. */
  z?: number;
  /** A captioned tile normally shows the whole plan (contain); 'cover' fills the box, for photos (sketch 30). */
  fit?: 'cover';
  /** object-position for a cropped image, e.g. '100% 50%' keeps its right side (sketch 35). */
  pos?: string;
  /** Tilt in degrees, clockwise (brochure mockups, sketch 37). Desktop only; the stacked layout stays straight. */
  rot?: number;
  /** Show `N.png` (transparent mockup) in the tile instead of `N.jpg`; the viewer keeps the jpg. */
  png?: boolean;
}

/** A full-width coloured strip drawn under the tiles, with an optional title (AI pages). */
export interface MosaicBand {
  y: number;
  h: number;
  text?: string;
  /** Box of the text inside the band (default: the full width). */
  x?: number;
  w?: number;
  /** Font size in template px. */
  size?: number;
  /** Horizontal / vertical glyph scale from the layout file (InDesign's horizontal and vertical scale). */
  scaleX?: number;
  scaleY?: number;
}

/** A block of running text placed like a tile. With no `text`, the capability's text is used. */
export interface MosaicText extends MosaicBox {
  text?: string;
  /** Font size and line height in template px. */
  size: number;
  leading: number;
}

export interface MosaicTemplate {
  /** Sketch the template was taken from. */
  sketch: number;
  height: number;
  slots: MosaicSlot[];
  bands?: MosaicBand[];
  texts?: MosaicText[];
}

export const MOSAIC_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 12, // two rows of three
    height: 1213,
    slots: [
      { x: 1293, y: 0, w: 625, h: 538 },
      { x: 647, y: 0, w: 625, h: 538 },
      { x: 0, y: 0, w: 625, h: 538 },
      { x: 1293, y: 553, w: 625, h: 660 },
      { x: 647, y: 553, w: 625, h: 660 },
      { x: 0, y: 553, w: 625, h: 660 },
    ],
  },
  {
    sketch: 13, // two tall towers, a portrait pair on the left, a wide strip below
    height: 1380,
    slots: [
      { x: 1293, y: 0, w: 625, h: 875 },
      { x: 646, y: 0, w: 626, h: 874 },
      { x: 0, y: 0, w: 626, h: 686 },
      { x: 644, y: 893, w: 1274, h: 487 },
      { x: 0, y: 707, w: 623, h: 673 },
    ],
  },
  {
    sketch: 14,
    height: 1369,
    slots: [
      { x: 1288, y: 0, w: 630, h: 839 },
      { x: 647, y: 0, w: 625, h: 607 },
      { x: 0, y: 0, w: 625, h: 1026 },
      { x: 1290, y: 855, w: 628, h: 514 },
      { x: 647, y: 623, w: 625, h: 746 },
      { x: 0, y: 1042, w: 625, h: 327 },
    ],
  },
  {
    sketch: 16, // three columns, seven tiles (shown before 15)
    height: 1400,
    slots: [
      { x: 1289, y: 0, w: 629, h: 500 },
      { x: 645, y: 0, w: 622, h: 773 },
      { x: 0, y: 0, w: 623, h: 978 },
      { x: 1289, y: 516, w: 629, h: 539 },
      { x: 645, y: 791, w: 622, h: 609 },
      { x: 0, y: 994, w: 623, h: 406 },
      { x: 1289, y: 1070, w: 629, h: 330 },
    ],
  },
  {
    sketch: 15, // wide tile + tall tile on top, two small tiles below (shown last)
    height: 1011,
    slots: [
      { x: 650, y: 0, w: 1268, h: 607 },
      { x: 0, y: 0, w: 624, h: 961 },
      { x: 1295, y: 622, w: 623, h: 389 },
      { x: 651, y: 622, w: 622, h: 340 },
    ],
  },
  {
    sketch: 39, // extra page: two photos on top, a wide and a narrow one below, titles show on hover like the other pages
    height: 1369,
    slots: [
      { x: 978, y: 0, w: 940, h: 609 },
      { x: 0, y: 0, w: 953, h: 609 },
      { x: 1274, y: 624, w: 644, h: 745 },
      { x: 0, y: 624, w: 1253, h: 745 },
    ],
  },
];

/**
 * Interior templates measured from sketches 17, 18, 19, normalised to width 1918
 * (horizontal gap 20, vertical gap 15).
 */
export const INTERIOR_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 17, // narrow-wide-medium row, two wide tiles below
    height: 1161,
    slots: [
      { x: 1295, y: 0, w: 623, h: 540 },
      { x: 440, y: 0, w: 835, h: 540 },
      { x: 0, y: 0, w: 420, h: 540 },
      { x: 862, y: 555, w: 1056, h: 606 },
      { x: 0, y: 555, w: 842, h: 606 },
    ],
  },
  {
    sketch: 19, // medium-wide-narrow row, two wide tiles below (shown second, before 18)
    height: 1084,
    slots: [
      { x: 1288, y: 0, w: 630, h: 532 },
      { x: 451, y: 0, w: 817, h: 532 },
      { x: 0, y: 0, w: 431, h: 532 },
      { x: 857, y: 547, w: 1061, h: 537 },
      { x: 0, y: 547, w: 837, h: 537 },
    ],
  },
  {
    sketch: 18, // three columns, two tiles each, slightly staggered (shown last)
    height: 955,
    slots: [
      { x: 1299, y: 0, w: 619, h: 524 },
      { x: 707, y: 0, w: 572, h: 473 },
      { x: 0, y: 0, w: 687, h: 471 },
      { x: 1299, y: 539, w: 619, h: 416 },
      { x: 707, y: 488, w: 572, h: 460 },
      { x: 0, y: 486, w: 687, h: 456 },
    ],
  },
];

/**
 * Conservation templates measured from sketches 20, 21, normalised to width 1918
 * (horizontal gap 20, vertical gap 15–18).
 */
export const CONSERVATION_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 20, // wide-medium-narrow row, three equal tiles below
    height: 1205,
    slots: [
      { x: 1054, y: 0, w: 864, h: 580 },
      { x: 376, y: 0, w: 658, h: 580 },
      { x: 0, y: 0, w: 356, h: 580 },
      { x: 1300, y: 595, w: 618, h: 610 },
      { x: 661, y: 595, w: 619, h: 610 },
      { x: 0, y: 595, w: 641, h: 610 },
    ],
  },
  {
    sketch: 21, // two columns of two on the right, a tall tile over a strip on the left
    height: 1313,
    slots: [
      { x: 1300, y: 0, w: 618, h: 610 },
      { x: 661, y: 0, w: 619, h: 610 },
      { x: 0, y: 0, w: 641, h: 960 },
      { x: 1300, y: 628, w: 618, h: 685 },
      { x: 661, y: 628, w: 619, h: 685 },
      { x: 0, y: 976, w: 641, h: 337 },
    ],
  },
];

/**
 * Torah-buildings templates measured from sketches 26 (the page with the title) and 25,
 * normalised to width 1918 (gaps 20–22).
 */
export const SYNAGOGUE_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 26, // wide-medium row, medium-wide row below
    height: 1190,
    slots: [
      { x: 862, y: 0, w: 1056, h: 614 },
      { x: 0, y: 0, w: 841, h: 619 },
      { x: 1057, y: 630, w: 861, h: 547 },
      { x: 0, y: 632, w: 1035, h: 558 },
    ],
  },
  {
    sketch: 25, // two rows: medium tile on the right, wide tile on the left
    height: 1282,
    slots: [
      { x: 1058, y: 0, w: 860, h: 666 },
      { x: 0, y: 0, w: 1036, h: 667 },
      { x: 1059, y: 684, w: 859, h: 598 },
      { x: 0, y: 684, w: 1037, h: 598 },
    ],
  },
];

/**
 * Torah-buildings exterior templates measured from sketches 24 (the page with the title
 * and tabs), 22 and 23, normalised to width 1918.
 */
export const SYNAGOGUE_EXTERIOR_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 24, // wide-medium row, narrow-wide row below
    height: 1222,
    slots: [
      { x: 872, y: 0, w: 1046, h: 661 },
      { x: 0, y: 0, w: 856, h: 656 },
      { x: 1295, y: 673, w: 623, h: 549 },
      { x: 0, y: 673, w: 1273, h: 549 },
    ],
  },
  {
    sketch: 22, // two equal-ish tiles, then narrow-wide row
    height: 1167,
    slots: [
      { x: 1008, y: 0, w: 910, h: 521 },
      { x: 0, y: 0, w: 991, h: 521 },
      { x: 1421, y: 538, w: 497, h: 629 },
      { x: 0, y: 538, w: 1401, h: 629 },
    ],
  },
  {
    sketch: 23, // two equal-ish tiles, then wide-medium row
    height: 1134,
    slots: [
      { x: 1016, y: 0, w: 902, h: 531 },
      { x: 0, y: 0, w: 999, h: 531 },
      { x: 854, y: 550, w: 1064, h: 584 },
      { x: 0, y: 552, w: 840, h: 580 },
    ],
  },
];
/**
 * Sales-plans (2D) templates measured from sketches 27 (the page with the title and tabs)
 * and 28, normalised to width 1918. Plans sit on a black page, captions are always shown.
 */
export const SALES_PLANS_2D_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 27, // three columns: cards with coloured sheets on the sides, tall plans in the middle
    height: 1229,
    slots: [
      {
        x: 1225, y: 78, w: 672, h: 477,
        sheets: ['#a3c477', '#c9dcae'],
        caption: { x: 1224, y: 575, w: 400, align: 'left' },
      },
      { x: 731, y: 5, w: 340, h: 686, caption: { x: 560, y: 160, w: 200, align: 'right' } },
      {
        x: 40, y: 80, w: 605, h: 528,
        sheets: ['#5ec3cd', '#acdde2'],
        caption: { x: 29, y: 618, w: 400, align: 'left' },
      },
      {
        x: 1242, y: 640, w: 645, h: 457,
        sheets: ['#3d3f7c', '#7a5ba5'],
        caption: { x: 1279, y: 1122, w: 400, align: 'left' },
      },
      { x: 797, y: 707, w: 294, h: 516, caption: { x: 800, y: 768, w: 234, align: 'right' } },
      {
        x: 96, y: 677, w: 527, h: 504,
        sheets: ['#bfae9b', '#dccfc1'],
        caption: { x: 299, y: 1192, w: 310, align: 'right' },
      },
    ],
  },
  {
    sketch: 28, // page 2, redesigned (הדמיות מכר דו ממדי חדש.png): gilboa and shaarei-hair on sheets, curved chaim plan bottom right
    height: 1356,
    slots: [
      {
        x: 1336, y: 0, w: 543, h: 414,
        sheets: ['#1f6f6a', '#134b4e'],
        caption: { x: 1322, y: 436, w: 400, align: 'left' },
      },
      { x: 889, y: 17, w: 376, h: 526, caption: { x: 1005, y: 585, w: 300, align: 'right' } },
      {
        x: 71, y: 40, w: 610, h: 453,
        sheets: ['#e0bfa8', '#c9a58e'],
        caption: { x: 404, y: 535, w: 322, align: 'right' },
      },
      { x: 1412, y: 472, w: 490, h: 845, caption: { x: 1508, y: 1298, w: 200, align: 'center' } },
      // T-shaped office plan: its box reaches under "שערי העיר" and "פרויקט השושנה", so it sits below them.
      { x: 367, y: 414, w: 776, h: 420, z: 0, caption: { x: 1150, y: 815, w: 250, align: 'left' } },
      { x: 40, y: 572, w: 316, h: 722, caption: { x: 372, y: 567, w: 300, align: 'left' } },
      { x: 370, y: 850, w: 849, h: 443, caption: { x: 1226, y: 1265, w: 200, align: 'left' } },
    ],
  },
];
/**
 * Sales-plans (3D) templates measured from sketches 30 (the page with the title and tabs),
 * 31 and 29, normalised to width 1918. Photos fill their box ('cover'); plans on black show
 * whole ('contain'), so a few boxes are taller than in the sketch, which stretched the plans.
 */
export const SALES_PLANS_3D_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 30, // two rows: narrow photo on the left, wide one on the right
    height: 1200,
    slots: [
      {
        x: 707, y: 43, w: 1210, h: 515, fit: 'cover',
        caption: { x: 1309, y: 2, w: 400, align: 'right' },
      },
      {
        x: 5, y: 45, w: 684, h: 513, fit: 'cover',
        caption: { x: 85, y: 85, w: 300, align: 'left', over: true },
      },
      { x: 691, y: 590, w: 1227, h: 560, caption: { x: 860, y: 1155, w: 300, align: 'left' } },
      {
        x: 5, y: 628, w: 684, h: 485, fit: 'cover',
        caption: { x: 85, y: 1138, w: 300, align: 'left' },
      },
    ],
  },
  {
    sketch: 31, // tall garden plan and a plan below it on the left, two wide images on the right
    height: 1370,
    slots: [
      { x: 729, y: 40, w: 1176, h: 563, caption: { x: 745, y: 545, w: 300, align: 'left' } },
      {
        x: 34, y: 5, w: 575, h: 855,
        caption: { x: 269, y: 645, w: 200, align: 'left', over: true },
      },
      {
        x: 713, y: 615, w: 1192, h: 700, fit: 'cover',
        caption: { x: 711, y: 1332, w: 400, align: 'left' },
      },
      // No title in the sketch.
      { x: 0, y: 872, w: 629, h: 478 },
    ],
  },
  {
    sketch: 29, // closing strip: wide office floor, small apartment on the left
    height: 560,
    slots: [
      { x: 631, y: 80, w: 1268, h: 470, caption: { x: 605, y: 35, w: 300, align: 'center' } },
      { x: 97, y: 75, w: 487, h: 415, caption: { x: 146, y: 35, w: 300, align: 'center' } },
    ],
  },
];
/**
 * AI pages AI 1 – AI 5 (ROTEM-pdf screenshots), measured from the InDesign file AI.idml:
 * an A4-landscape page (841.8 pt) scaled to 1918, so x / y are page positions including its margins.
 * Each image file is pre-cropped to what its frame shows, so it fills its slot exactly.
 * Beige page, brown bands, no captions. z keeps the document stacking order.
 */
export const AI_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 1, // AI 1: title band, the intro text between the columns
    height: 1356,
    bands: [{ y: 0, h: 130, text: 'הדמיות AI', x: 174, w: 1565, size: 91, scaleY: 0.8 }],
    texts: [{ x: 999, y: 176, w: 327, h: 531, size: 23.9, leading: 31.9 }],
    slots: [
      { x: 1348, y: 176, w: 525, h: 330, z: 1 }, // yakirei-synagogue-4
      { x: 1348, y: 530, w: 525, h: 330, z: 3 }, // yakirei-synagogue-3
      { x: 1348, y: 881, w: 525, h: 330, z: 4 }, // yakirei-synagogue
      { x: 650, y: 530, w: 566, h: 329, z: 8 }, // image-24
      { x: 650, y: 881, w: 566, h: 325, z: 6 }, // kids-room
      { x: 650, y: 176, w: 326, h: 326, z: 7 }, // image-22
      { x: 47, y: 176, w: 581, h: 327, z: 9 }, // image-7
      { x: 47, y: 530, w: 581, h: 327, z: 10 }, // inspiration
      { x: 49, y: 881, w: 578, h: 325, z: 11 }, // image-8
    ],
  },
  {
    sketch: 2, // AI 2: three columns, an empty band at the foot
    height: 1356,
    bands: [{ y: 1233, h: 123 }],
    slots: [
      { x: 1317, y: 59, w: 560, h: 560, z: 1 }, // image-11
      { x: 1319, y: 643, w: 558, h: 558, z: 4 }, // image-14
      { x: 714, y: 59, w: 581, h: 304, z: 12 }, // apartment
      { x: 714, y: 378, w: 581, h: 327, z: 9 }, // image-23
      { x: 712, y: 721, w: 583, h: 320, z: 10 }, // image-25
      { x: 714, y: 1057, w: 581, h: 299, z: 13 }, // image-10
      { x: 45, y: 59, w: 646, h: 366, z: 5 }, // image-15
      { x: 45, y: 448, w: 646, h: 366, z: 6 }, // image-16
      { x: 45, y: 837, w: 646, h: 369, z: 7 }, // image-19
    ],
  },
  {
    sketch: 3, // AI 3: four facades, titled band at the foot
    height: 1356,
    bands: [{ y: 1233, h: 123, text: 'בניינים לפי שרטוט חזית', x: 174, w: 1565, size: 91, scaleY: 0.8 }],
    slots: [
      { x: 1044, y: 45, w: 862, h: 582, z: 2 }, // facade-sketch
      { x: 1031, y: 651, w: 887, h: 582, z: 1 }, // rashi
      { x: 0, y: 45, w: 1020, h: 582, z: 3 }, // ayelet-hashachar-day
      { x: 0, y: 651, w: 1020, h: 582, z: 4 }, // ayelet-hashachar-night
    ],
  },
  {
    sketch: 4, // AI 4: free collage around a tall image, an empty band at the foot
    height: 1356,
    bands: [{ y: 1233, h: 123 }],
    slots: [
      { x: 1228, y: 2, w: 651, h: 366, z: 2 }, // image-27
      { x: 1234, y: 396, w: 646, h: 363, z: 3 }, // image-26
      { x: 1234, y: 983, w: 646, h: 362, z: 6 }, // image-3
      { x: 807, y: 1, w: 384, h: 689, z: 9 }, // image-5
      { x: 743, y: 711, w: 452, h: 254, z: 7 }, // image-21
      { x: 549, y: 979, w: 646, h: 366, z: 4 }, // image-18
      { x: 39, y: 0, w: 560, h: 560, z: 1 }, // image-9
      { x: 39, y: 581, w: 469, h: 242, z: 8 }, // image-17
      { x: 39, y: 838, w: 468, h: 507, z: 5 }, // image-20
    ],
  },
  {
    // The layout file sets this title 110% wide in its own font; the site font is wider, so it is
    // narrowed to keep the same length (it ends before the garden plan, as in the file).
    sketch: 5, // AI 5: two columns of three, plans on the left, titled band at the foot
    height: 1356,
    bands: [{ y: 1233, h: 123, text: 'שיפוצים לפי דרישת לקוח - תוכניות מכר', x: 385, w: 1590, size: 68, scaleX: 0.88, scaleY: 0.8 }],
    slots: [
      { x: 1242, y: 19, w: 671, h: 379, z: 2 }, // lake-house
      { x: 1242, y: 424, w: 671, h: 379, z: 4 }, // round-window-bedroom
      { x: 1242, y: 828, w: 671, h: 379, z: 6 }, // spring-bathroom
      { x: 562, y: 19, w: 671, h: 379, z: 3 }, // kitchen-options
      { x: 562, y: 424, w: 671, h: 373, z: 5 }, // kitchen-board
      { x: 562, y: 828, w: 671, h: 379, z: 7 }, // building
      { x: 2, y: 19, w: 549, h: 304, z: 10 }, // sales-plan
      { x: 0, y: 331, w: 551, h: 369, z: 9 }, // office-plan
      { x: 2, y: 706, w: 549, h: 304, z: 11 }, // sales-plan-2
      { x: 2, y: 1020, w: 549, h: 322, z: 8 }, // garden-plan
    ],
  },
];
/**
 * Brochures, sketches 35, 36, 37 (cream page). Coordinates are the sketch's, scaled by 1918/2000.
 * Each sketch holds two brochures; their pages fill consecutive slots (GalleryCategory.pages)
 * and a beige band under each group names the brochure. The sketch shows the pages tilted, as
 * mockups; here each slot has the page's own proportions, so the page is shown whole and flat.
 */
export const BROCHURE_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 35, // Mashi: cover, two spreads. Nof Beitar: cover, spread.
    height: 1026,
    slots: [
      { x: 91, y: 5, w: 537, h: 433 },
      { x: 639, y: 12, w: 788, h: 439 },
      // The sketch crops this spread at the page edge and keeps its right side.
      {
        x: 1427, y: 115, w: 481, h: 334, fit: 'cover', pos: '100% 50%',
        caption: { x: 0, y: 460, w: 467, align: 'left', band: true },
      },
      { x: 82, y: 518, w: 646, h: 433 },
      { x: 767, y: 512, w: 1040, h: 441, caption: { x: 0, y: 986, w: 689, align: 'left', band: true } },
    ],
  },
  {
    sketch: 36, // KK"L: folded leaflet, spread, tall page. Kubhayof: cover, two spreads.
    height: 1180,
    slots: [
      { x: 82, y: 21, w: 351, h: 600 },
      { x: 591, y: 4, w: 531, h: 618 },
      { x: 1185, y: 0, w: 615, h: 769, caption: { x: 0, y: 641, w: 689, align: 'left', band: true } },
      { x: 221, y: 713, w: 587, h: 410 },
      { x: 917, y: 855, w: 387, h: 269 },
      { x: 1379, y: 857, w: 387, h: 267, caption: { x: 0, y: 1141, w: 689, align: 'left', band: true } },
    ],
  },
  {
    sketch: 37, // Beit Yosef Moldova: cover, three spreads. Kinneret: logo, mockup, three spreads.
    // Moldova: the cover (transparent png) lies over the first spread, which lies over the second,
    // which touches the third; the two middle spreads are tilted about 6 degrees clockwise.
    // Kinneret: the last spread is tilted 4 degrees and sits under its neighbour.
    height: 1181,
    slots: [
      { x: 50, y: 5, w: 481, h: 614, z: 4, png: true },
      { x: 438, y: 95, w: 470, h: 362, z: 3, rot: 6.5 },
      { x: 830, y: 62, w: 520, h: 400, z: 2, rot: 6 },
      { x: 1277, y: 42, w: 531, h: 375, z: 1, caption: { x: 581, y: 536, w: 825, align: 'center', band: true } },
      { x: 112, y: 763, w: 348, h: 360 },
      { x: 483, y: 761, w: 655, h: 370 },
      { x: 1147, y: 705, w: 363, h: 200 },
      { x: 1215, y: 936, w: 378, h: 206, z: 2 },
      { x: 1526, y: 912, w: 385, h: 210, z: 1, rot: 4, caption: { x: 113, y: 1142, w: 380, align: 'left', band: true } },
    ],
  },
];
/** Template sets by GalleryCategory.layout. */
export const MOSAIC_LAYOUTS: Record<string, MosaicTemplate[]> = {
  exterior: MOSAIC_TEMPLATES,
  interior: INTERIOR_TEMPLATES,
  conservation: CONSERVATION_TEMPLATES,
  synagogues: SYNAGOGUE_TEMPLATES,
  'synagogues-exterior': SYNAGOGUE_EXTERIOR_TEMPLATES,
  'sales-plans-2d': SALES_PLANS_2D_TEMPLATES,
  'sales-plans-3d': SALES_PLANS_3D_TEMPLATES,
  ai: AI_TEMPLATES,
  brochure: BROCHURE_TEMPLATES,
};

/** Used for leftovers that don't fill a whole template: rows of three, as in sketch 13. */
export const FALLBACK_SLOT = { w: 625, h: 538 };
