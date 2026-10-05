const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.resolve(__dirname, '../public/module_images');
const TEMP_DIR = path.resolve(__dirname, '../scripts/temp_svgs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const images = [
  // 1. Module Hero Banners
  {
    filename: 'module_fire_safety_hero.jpg',
    width: 1200,
    height: 600,
    title: 'FIRE & EXPLOSION RESPONSE',
    subtitle: 'Module Hero Header Banner',
    badge: 'MODULE 1 HERO',
    color: '#F59E0B', // Amber
    iconPath: 'M12 2c1 3 4 6 4 9a6 6 0 0 1-12 0c0-3 3-6 4-9 1 2 2 3 4 3s3-1 4-3z'
  },
  {
    filename: 'module_gas_leak_hero.jpg',
    width: 1200,
    height: 600,
    title: 'GAS LEAK & CONFINED SPACE',
    subtitle: 'Module Hero Header Banner',
    badge: 'MODULE 2 HERO',
    color: '#38BDF8', // Sky Blue
    iconPath: 'M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2m18 4a2 2 0 1 1-1.4 3.4H2m14-8a2 2 0 1 0-1.4-3.4H2'
  },
  {
    filename: 'module_ppe_hazard_hero.jpg',
    width: 1200,
    height: 600,
    title: 'PPE & HAZARD INSPECTION',
    subtitle: 'Module Hero Header Banner',
    badge: 'MODULE 3 HERO',
    color: '#10B981', // Emerald
    iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
  },
  {
    filename: 'module_loto_hero.jpg',
    width: 1200,
    height: 600,
    title: 'LOTO MECHANICAL ISOLATION',
    subtitle: 'Module Hero Header Banner',
    badge: 'MODULE 4 HERO',
    color: '#A855F7', // Purple
    iconPath: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-12 0V7a5 5 0 0 1 10 0v4'
  },
  {
    filename: 'module_roof_bolting_hero.jpg',
    width: 1200,
    height: 600,
    title: 'STRATA CONTROL & ROOF BOLTING',
    subtitle: 'Module Hero Header Banner',
    badge: 'MODULE 5 HERO',
    color: '#94A3B8', // Slate / Silver
    iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
  },

  // 2. PPE Items (Stage 1)
  {
    filename: 'ppe_helmet.jpg',
    width: 800,
    height: 600,
    title: 'HARD HAT & CAP LAMP',
    subtitle: 'IS 2925 Industrial Safety Helmet & Lumen Test',
    badge: 'PPE ITEM 1',
    color: '#F59E0B',
    iconPath: 'M2 12a10 10 0 0 1 20 0v3H2v-3zm0 3h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z'
  },
  {
    filename: 'ppe_goggles.jpg',
    width: 800,
    height: 600,
    title: 'BALLISTIC EYE GOGGLES',
    subtitle: 'Anti-Fog Impact & Dust Resistant Eye Protection',
    badge: 'PPE ITEM 2',
    color: '#38BDF8',
    iconPath: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 5a5 5 0 1 0 0-10 5 5 0 0 0 0 10z'
  },
  {
    filename: 'ppe_respirator.jpg',
    width: 800,
    height: 600,
    title: 'SCSR EMERGENCY RESPIRATOR',
    subtitle: 'Self-Contained Self-Rescuer Chemical Oxygen Filter',
    badge: 'PPE ITEM 3',
    color: '#F43F5E', // Rose
    iconPath: 'M12 2a7 7 0 0 0-7 7v4a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7zm-4 9a2 2 0 1 1 4 0v2a2 2 0 1 1-4 0v-2zm8 0a2 2 0 1 1 4 0v2a2 2 0 1 1-4 0v-2z'
  },
  {
    filename: 'ppe_boots.jpg',
    width: 800,
    height: 600,
    title: 'METATARSAL SAFETY BOOTS',
    subtitle: 'Steel-Toe & Anti-Perforation Mine Footwear',
    badge: 'PPE ITEM 4',
    color: '#FB923C', // Orange
    iconPath: 'M4 18v2h16v-2l-4-4v-4l-4-4H8v10L4 18z'
  },

  // 3. Underground Hazards (Stage 2)
  {
    filename: 'hazard_gas_ch4.jpg',
    width: 800,
    height: 600,
    title: 'TOXIC GAS (CH4 & CO)',
    subtitle: 'Combustible Methane & Carbon Monoxide Seep',
    badge: 'HAZARD ITEM 1',
    color: '#06B6D4',
    iconPath: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01'
  },
  {
    filename: 'hazard_roof_fracture.jpg',
    width: 800,
    height: 600,
    title: 'ROOF STRATA FRACTURE',
    subtitle: 'Underground Delamination & Sounding Detection',
    badge: 'HAZARD ITEM 2',
    color: '#EAB308',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z'
  },
  {
    filename: 'hazard_conveyor_belt.jpg',
    width: 800,
    height: 600,
    title: 'CONVEYOR NIP POINTS',
    subtitle: 'High-Torque Roller Entanglement Danger Zone',
    badge: 'HAZARD ITEM 3',
    color: '#F97316',
    iconPath: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4 1.3l-1.5 2.6-3-.8a7.9 7.9 0 0 1-1.9 1.1l-.5 3h-3l-.5-3a7.9 7.9 0 0 1-1.9-1.1l-3 .8-1.5-2.6 2.5-1.8a8.3 8.3 0 0 1 0-2.2L2.1 11.5l1.5-2.6 3 .8c.6-.4 1.2-.8 1.9-1.1l.5-3h3l.5 3c.7.3 1.3.7 1.9 1.1l3-.8 1.5 2.6-2.5 1.8c.1.7.1 1.5 0 2.2l2.5 1.7z'
  },
  {
    filename: 'hazard_water_inrush.jpg',
    width: 800,
    height: 600,
    title: 'WATER INRUSH & FLOODING',
    subtitle: 'Abandoned Workings & Sump Inundation Threat',
    badge: 'HAZARD ITEM 4',
    color: '#3B82F6',
    iconPath: 'M2 12s3-3 6-3 6 3 6 3 3-3 6-3 6 3 6 3M2 17s3-3 6-3 6 3 6 3 3-3 6-3 6 3 6 3'
  },

  // 4. Fire Extinguisher Guide
  {
    filename: 'fire_extinguisher_anatomy.jpg',
    width: 900,
    height: 1200,
    title: 'EXTINGUISHER ANATOMY',
    subtitle: 'Comprehensive Cutaway: Valve, Siphon Tube, Gauge & Cylinder',
    badge: 'PASS STEP 0',
    color: '#EF4444',
    iconPath: 'M12 2v20m-5-15h10M9 3h6M7 7h10v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7z'
  },
  {
    filename: 'extinguisher_seal_intact.jpg',
    width: 1000,
    height: 750,
    title: 'INSPECTION: SEAL INTACT',
    subtitle: 'Yellow / Red Safety Tamper Wire Fastened Securely',
    badge: 'PASS STEP 1 (VERIFIED)',
    color: '#10B981',
    iconPath: 'M22 11.08V12a10 10 0 1 1-5.93-9.14m6.93.14L12 15.01l-3-3'
  },
  {
    filename: 'extinguisher_seal_broken.jpg',
    width: 1000,
    height: 750,
    title: 'INSPECTION: SEAL BROKEN',
    subtitle: 'Tamper Seal Severed / Unit Ready for Pin Extraction',
    badge: 'PASS STEP 1 (ACTION)',
    color: '#EF4444',
    iconPath: 'M18 6L6 18M6 6l12 12'
  },
  {
    filename: 'extinguisher_pin_removed.jpg',
    width: 1000,
    height: 750,
    title: 'PULL PIN: PIN REMOVED',
    subtitle: 'Locking Ring Extracted • Ready to Squeeze Trigger',
    badge: 'PASS STEP 2 (ACTION)',
    color: '#F59E0B',
    iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6'
  },

  // 5. Dashboard Hero
  {
    filename: 'app_hero_banner.png',
    width: 1200,
    height: 500,
    title: 'JOHAR SAFETY ECOSYSTEM',
    subtitle: 'Vocational Industrial Training, Simulation & Compliance Platform',
    badge: 'DASHBOARD BANNER',
    color: '#F59E0B',
    iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
  }
];

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSVG(img) {
  const { width, height, title, subtitle, badge, color, filename, iconPath } = img;
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safeBadge = escapeXml(badge);
  const safeFilename = escapeXml(filename);
  const isDark = true;
  const bg = '#0B0F17';
  const surface = '#131B2A';
  const border = '#1E293B';
  const textMuted = '#94A3B8';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Radial Ambient Gradient -->
    <radialGradient id="glow_${filename.replace(/[^a-zA-Z0-9]/g, '_')}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${bg}" stop-opacity="0" />
    </radialGradient>
    <!-- Subtle Grid Pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.04" />
    </pattern>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="${bg}" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  <rect width="100%" height="100%" fill="url(#glow_${filename.replace(/[^a-zA-Z0-9]/g, '_')})" />

  <!-- Outer Frame & Corner Highlights -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="24" fill="none" stroke="${border}" stroke-width="2" />
  <line x1="20" y1="50" x2="20" y2="20" stroke="${color}" stroke-width="4" stroke-linecap="round" />
  <line x1="20" y1="20" x2="50" y2="20" stroke="${color}" stroke-width="4" stroke-linecap="round" />

  <line x1="${width - 20}" y1="${height - 50}" x2="${width - 20}" y2="${height - 20}" stroke="${color}" stroke-width="4" stroke-linecap="round" />
  <line x1="${width - 20}" y1="${height - 20}" x2="${width - 50}" y2="${height - 20}" stroke="${color}" stroke-width="4" stroke-linecap="round" />

  <!-- Center Content Container -->
  <g transform="translate(${width / 2}, ${height / 2})">
    <!-- Center Icon Badge -->
    <circle cx="0" cy="-60" r="48" fill="${surface}" stroke="${color}" stroke-width="2.5" />
    <circle cx="0" cy="-60" r="40" fill="${color}" fill-opacity="0.12" />
    <path d="${iconPath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(-12, -72) scale(1)" />

    <!-- Badge Tag -->
    <rect x="-110" y="10" width="220" height="30" rx="15" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.5" />
    <text x="0" y="30" fill="${color}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" text-anchor="middle">
      ${safeBadge}
    </text>

    <!-- Title -->
    <text x="0" y="70" fill="#F8FAFC" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" letter-spacing="1" text-anchor="middle">
      ${safeTitle}
    </text>

    <!-- Subtitle -->
    <text x="0" y="98" fill="${textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" text-anchor="middle">
      ${safeSubtitle}
    </text>

    <!-- Instructions / Dimensions Box -->
    <g transform="translate(-180, 125)">
      <rect x="0" y="0" width="360" height="36" rx="8" fill="#090D15" stroke="#334155" stroke-width="1" stroke-dasharray="4,4" />
      <text x="180" y="23" fill="#E2E8F0" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="13" font-weight="600" text-anchor="middle">
        Replace: ${safeFilename} (${width} × ${height})
      </text>
    </g>
  </g>

  <!-- Top Right Watermark -->
  <text x="${width - 45}" y="52" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" text-anchor="end" letter-spacing="0.5">
    JohAR Module Asset • PLACEHOLDER
  </text>
</svg>`;
}

console.log('Generating placeholder SVGs and converting to JPG/PNG using sips...');

images.forEach(img => {
  const svgContent = generateSVG(img);
  const tempSvgPath = path.join(TEMP_DIR, `${img.filename}.svg`);
  const finalPath = path.join(OUTPUT_DIR, img.filename);

  fs.writeFileSync(tempSvgPath, svgContent, 'utf-8');

  const format = img.filename.endsWith('.png') ? 'png' : 'jpeg';
  try {
    execSync(`sips -s format ${format} "${tempSvgPath}" --out "${finalPath}"`, { stdio: 'pipe' });
    console.log(`✓ Generated: ${img.filename} (${img.width}x${img.height})`);
  } catch (err) {
    console.error(`Failed to convert ${img.filename}:`, err);
  }
});

// Copy existing logo if available
const existingLogo = path.resolve(__dirname, '../public/jiwiAR_logo.png');
if (fs.existsSync(existingLogo)) {
  fs.copyFileSync(existingLogo, path.join(OUTPUT_DIR, 'jiwiAR_logo.png'));
  console.log('✓ Copied: jiwiAR_logo.png');
}

// Clean up temp SVGs
try {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
} catch {}

// Create README.txt inside module_images
const readmeContent = `# JohAR Industrial Safety — Module Image Replacement Guide

This folder contains all image assets used across the JohAR training simulator modules.
Each file here is a ready-to-use placeholder configured with the ideal resolution and aspect ratio.

## How to replace an image:
1. Export or prepare your custom image matching the recommended dimensions below.
2. Save it with the EXACT SAME FILENAME as the placeholder you wish to replace.
3. Drop it into this folder (replacing the placeholder).
4. That's it! The app will instantly display your new image.

---

## Asset Catalog & Placement:

### 1. Module Hero Banners (Header in ModuleDetailsScreen.jsx)
- module_fire_safety_hero.jpg   -> 1200 x 600 px (2:1) | Fire & Explosion Response
- module_gas_leak_hero.jpg      -> 1200 x 600 px (2:1) | Gas Leak & Confined Space
- module_ppe_hazard_hero.jpg    -> 1200 x 600 px (2:1) | PPE & Hazard Inspection
- module_loto_hero.jpg          -> 1200 x 600 px (2:1) | Machinery Lockout / Tagout
- module_roof_bolting_hero.jpg  -> 1200 x 600 px (2:1) | Strata Control & Roof Bolting

### 2. PPE Essentials (Stage 1 Slides & Interactive Locker Selection)
- ppe_helmet.jpg                -> 800 x 600 px (4:3)  | Hard Hat (IS 2925) & Cap Lamp
- ppe_goggles.jpg               -> 800 x 600 px (4:3)  | Ballistic Eye Goggles
- ppe_respirator.jpg            -> 800 x 600 px (4:3)  | SCSR Particulate Respirator
- ppe_boots.jpg                 -> 800 x 600 px (4:3)  | Metatarsal Steel-Toe Boots

### 3. Underground Hazards (Stage 2 Slides & Workface Assessment)
- hazard_gas_ch4.jpg            -> 800 x 600 px (4:3)  | Toxic Methane & Carbon Monoxide Seep
- hazard_roof_fracture.jpg      -> 800 x 600 px (4:3)  | Strata Fracture & Sounding Bar
- hazard_conveyor_belt.jpg      -> 800 x 600 px (4:3)  | Conveyor Belt Nip & Roller Points
- hazard_water_inrush.jpg       -> 800 x 600 px (4:3)  | Water Inrush & Underground Sump

### 4. Fire Extinguisher Guide (PASS Protocol Interactive Modal)
- fire_extinguisher_anatomy.jpg -> 900 x 1200 px (3:4) | Cutaway Diagram of Extinguisher
- extinguisher_seal_intact.jpg  -> 1000 x 750 px (4:3) | Seal Intact (Inspection Step)
- extinguisher_seal_broken.jpg  -> 1000 x 750 px (4:3) | Seal Broken (Action Step)
- extinguisher_pin_removed.jpg  -> 1000 x 750 px (4:3) | Pin Pulled (Action Step)

### 5. Branding & App UI
- jiwiAR_logo.png               -> 512 x 512 px (1:1)  | App Logo & Header Badge
- app_hero_banner.png           -> 1200 x 500 px       | Main Dashboard Banner

---
Shortcut link available at: /MODULE_IMAGES_PLACEHOLDERS (project root)
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'README.txt'), readmeContent, 'utf-8');
console.log('✓ Created: README.txt');
