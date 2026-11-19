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
}

export interface MosaicTemplate {
  /** Sketch the template was taken from. */
  sketch: number;
  height: number;
  slots: MosaicSlot[];
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
    sketch: 28, // free collage: top row of three, a framed tall plan on the right, a wide site plan below
    height: 1390,
    slots: [
      { x: 1353, y: 0, w: 565, h: 430, caption: { x: 1353, y: 444, w: 400, align: 'left' } },
      { x: 889, y: 0, w: 431, h: 590, caption: { x: 956, y: 608, w: 300, align: 'right' } },
      { x: 2, y: 15, w: 707, h: 523, caption: { x: 371, y: 545, w: 300, align: 'right' } },
      {
        x: 1429, y: 490, w: 460, h: 865,
        frame: { x: 1414, y: 467, w: 475, h: 908 },
        caption: { x: 1511, y: 1356, w: 200, align: 'center' },
      },
      // T-shaped office plan: its box reaches under "שערי העיר" and "פרויקט השושנה", so it sits below them.
      { x: 344, y: 432, w: 807, h: 434, z: 0, caption: { x: 1159, y: 850, w: 250, align: 'left' } },
      { x: 2, y: 593, w: 327, h: 752, caption: { x: 347, y: 592, w: 300, align: 'left' } },
      { x: 345, y: 885, w: 885, h: 460, caption: { x: 1257, y: 1320, w: 200, align: 'left' } },
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
 * AI templates measured from sketches 32 (the page with the title), 33 and 34,
 * normalised to width 1918. Beige page, no captions.
 */
export const AI_TEMPLATES: MosaicTemplate[] = [
  {
    sketch: 32, // three rows of three; the middle tile of the top row is narrow
    height: 1080,
    slots: [
      { x: 1365, y: 0, w: 548, h: 344 },
      { x: 637, y: 0, w: 342, h: 340 },
      { x: 9, y: 0, w: 606, h: 340 },
      { x: 1365, y: 368, w: 548, h: 346 },
      { x: 637, y: 368, w: 592, h: 344 },
      { x: 9, y: 368, w: 606, h: 342 },
      { x: 1365, y: 734, w: 548, h: 346 },
      { x: 637, y: 734, w: 592, h: 340 },
      { x: 11, y: 734, w: 602, h: 340 },
    ],
  },
  {
    sketch: 33, // two squares on the right, four strips in the middle, three on the left
    height: 1352,
    slots: [
      { x: 1333, y: 0, w: 584, h: 584 },
      { x: 703, y: 0, w: 606, h: 316 },
      { x: 7, y: 0, w: 674, h: 382 },
      { x: 703, y: 332, w: 606, h: 342 },
      { x: 7, y: 404, w: 674, h: 384 },
      { x: 1335, y: 608, w: 582, h: 582 },
      { x: 701, y: 690, w: 608, h: 334 },
      { x: 7, y: 810, w: 674, h: 386 },
      { x: 703, y: 1040, w: 606, h: 312 },
    ],
  },
  {
    sketch: 34, // free collage around a tall floor plan
    height: 1404,
    slots: [
      { x: 1239, y: 2, w: 679, h: 382 },
      { x: 801, y: 0, w: 402, h: 720 },
      { x: 0, y: 0, w: 586, h: 584 },
      { x: 1247, y: 412, w: 671, h: 380 },
      { x: 0, y: 606, w: 490, h: 252 },
      { x: 733, y: 742, w: 472, h: 266 },
      { x: 0, y: 874, w: 488, h: 528 },
      { x: 531, y: 1020, w: 674, h: 384 },
      { x: 1247, y: 1026, w: 671, h: 378 },
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
    height: 1181,
    slots: [
      { x: 50, y: 5, w: 441, h: 599 },
      { x: 508, y: 139, w: 418, h: 301 },
      { x: 944, y: 139, w: 418, h: 298 },
      { x: 1379, y: 139, w: 418, h: 294, caption: { x: 581, y: 536, w: 825, align: 'center', band: true } },
      { x: 123, y: 760, w: 329, h: 363 },
      { x: 485, y: 759, w: 654, h: 368 },
      { x: 1147, y: 705, w: 364, h: 200 },
      { x: 1147, y: 925, w: 378, h: 208 },
      { x: 1531, y: 820, w: 378, h: 208, caption: { x: 113, y: 1142, w: 380, align: 'left', band: true } },
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
