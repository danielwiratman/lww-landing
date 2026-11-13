#!/usr/bin/env node
/**
 * Imports the product catalogue from the company-profile pack into the CMS.
 *
 * Source of truth:
 *   resources/compro/03-products/products.json   — the 13 product lines
 *   resources/compro/04-service-maintenance/service-maintenance.json — product 13
 *
 * Outputs:
 *   public/img/products/<slug>/*.webp          — product photography
 *   public/img/products/datasheets/<slug>.pdf  — the product page of the profile
 *   content/products/<slug>.md                 — Indonesian document
 *   content/products/<slug>.en.md              — English document
 *
 * `resources/` is git-ignored, so this script is the only way to refresh the
 * catalogue from the pack. It needs ImageMagick (`magick`) and Ghostscript
 * (`gs`) for the assets; both are optional — without them the source files are
 * copied verbatim and no PDF is extracted.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PACK = path.join(ROOT, 'resources/compro');
const PRODUCTS_JSON = path.join(PACK, '03-products/products.json');
const SERVICE_JSON = path.join(PACK, '04-service-maintenance/service-maintenance.json');
const PROFILE_PDF = path.join(ROOT, 'resources/COMPRO LIMAWIRA - REVISI FINAL - VIEWER.pdf');
const CONTENT_DIR = path.join(ROOT, 'content/products');
const IMAGE_DIR = path.join(ROOT, 'public/img/products');
const DATASHEET_DIR = path.join(IMAGE_DIR, 'datasheets');

const CATEGORY_ORDER = ['Critical Power', 'Power Quality', 'Solution', 'Service'];

/** Human labels for the spec keys used by the pack. */
const SPEC_LABELS = {
  topologies: 'Topologies',
  efficiency: 'Efficiency',
  phase_configurations: 'Phase Configurations',
  form_factors: 'Form Factors',
  form_factor: 'Form Factor',
  communications: 'Communications',
  other: 'Other',
  accuracy: 'Accuracy',
  battery_types: 'Battery Types',
  control: 'Control',
  expansion: 'Expansion',
  output_power_factor: 'Output Power Factor',
  regulation_range: 'Regulation Range',
  performance: 'Performance',
  response: 'Response',
  transfer_time: 'Transfer Time',
  transfer_type: 'Transfer Type',
  mtbf: 'MTBF',
  serviceability: 'Serviceability',
  neutral_to_ground_output: 'Neutral to Ground Output',
  installation: 'Installation',
  chemistry: 'Chemistry',
  rack_width_cm: 'Rack Width (cm)',
  rack_height_cm: 'Rack Height (cm)',
};

const has = (command) => spawnSync(command, ['-version'], { stdio: 'ignore' }).status === 0;
const CAN_MAGICK = has('magick');
const CAN_GS = has('gs');

/** The pack stores bilingual strings as "Indonesian / English". */
function pick(value, lang) {
  if (typeof value !== 'string') return value;
  if (!value.includes(' / ')) return value;
  const parts = value.split(' / ').map((part) => part.trim());
  if (parts.length < 2) return value;
  return lang === 'en' ? parts[parts.length - 1] : parts[0];
}

function pickDeep(value, lang) {
  if (Array.isArray(value)) return value.map((item) => pickDeep(item, lang));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, pickDeep(item, lang)]));
  }
  return pick(value, lang);
}

function labelFor(key) {
  return SPEC_LABELS[key] ?? key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function join(value, lang) {
  const items = (Array.isArray(value) ? value : [value]).map((item) => pickDeep(item, lang)).filter(Boolean);
  return items.join(', ');
}

function rows(specs) {
  return specs.map((spec) => ({ label: spec.label, value: spec.value })).filter((spec) => spec.label && spec.value);
}

/** Normalises the extra, product-specific lists of the pack into spec rows. */
function extraRows(product, lang) {
  const out = [];
  const add = (label, value) => {
    const text = join(value, lang);
    if (text) out.push({ label, value: text });
  };

  if (product.variants) {
    for (const variant of product.variants) {
      out.push({
        label: pickDeep(variant.name, lang),
        value: pickDeep(variant.description, lang),
      });
    }
  }
  if (product.applications) add('Applications', product.applications);
  if (product.harmonic_sources) add('Harmonic Sources', product.harmonic_sources);
  if (product.effects) {
    for (const [distortion, list] of Object.entries(product.effects)) {
      const text = list.map((entry) => `${pickDeep(entry.equipment, lang)} — ${pickDeep(entry.effect, lang)}`).join('; ');
      out.push({ label: labelFor(distortion), value: text });
    }
  }
  if (product.measured_parameters) add('Measured Parameters', product.measured_parameters);
  if (product.architecture) {
    for (const [layer, list] of Object.entries(product.architecture)) {
      add(labelFor(layer), list);
    }
  }
  if (product.typical_applications) add('Typical Applications', product.typical_applications);
  if (product.it_equipment) add('IT Equipment', product.it_equipment);
  if (product.supporting_equipment) add('Supporting Equipment', product.supporting_equipment);
  if (product.data_center_structure) add('Data Center Structure', product.data_center_structure);
  if (product.alert_channels) add('Alert Channels', product.alert_channels);
  if (product.module_annotations) add('Module Features', product.module_annotations);

  return out;
}

/** Product 13 lives in the service-maintenance group and carries richer data. */
function serviceRows(service, lang) {
  const out = [];
  for (const entry of service.services) {
    const label = entry.name[lang];
    const value = entry.description ? entry.description[lang] : '';
    if (!value || value === label) continue;
    out.push({ label, value });
  }
  if (service.maintenance_definition) {
    out.push({ label: 'Maintenance', value: service.maintenance_definition[lang] });
    if (service.maintenance_definition.objectives) {
      out.push({
        label: 'Objectives',
        value: join(
          service.maintenance_definition.objectives.map((o) => o[lang]),
          lang
        ),
      });
    }
  }
  for (const key of ['power_quality_audit', 'electrical_system_documentation']) {
    const block = service[key];
    if (!block) continue;
    const steps = (block.steps ?? []).map((step) => (lang === 'en' ? (step.en ?? humanize(step.id)) : humanize(step.id))).filter(Boolean);
    out.push({
      label: block.name[lang],
      value: [block.description[lang], steps.join(' → ')].filter(Boolean).join(' — '),
    });
  }
  return out;
}

function humanize(value) {
  return String(value ?? '')
    .replace(/[-_]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function buildDocument(product, lang, assets) {
  const lines = [];
  lines.push('---');
  lines.push(`title: ${yamlString(product.name[lang])}`);
  lines.push(`slug: ${yamlString(product.slug)}`);
  lines.push(`order: ${product.order}`);
  lines.push(`category: ${yamlString(product.category[lang])}`);
  if (product.brand) lines.push(`brand: ${yamlString(product.brand)}`);
  lines.push(`description: ${yamlString(pickDeep(product.description[lang]))}`);

  const features = (product.features ?? []).map((feature) => pickDeep(feature, lang));
  if (features.length) {
    lines.push('features:');
    for (const feature of features) lines.push(`  - ${yamlString(feature)}`);
  }

  if (product.specs.length) {
    lines.push('specs:');
    for (const spec of product.specs) {
      lines.push(`  - label: ${yamlString(spec.label)}`);
      lines.push(`    value: ${yamlString(spec.value)}`);
    }
  }

  if (assets.images.length) {
    lines.push('images:');
    for (const image of assets.images) {
      lines.push(`  - image: ${yamlString(image.path)}`);
      lines.push(`    caption: ${yamlString(pickDeep(image.caption, lang))}`);
    }
  }

  if (assets.datasheet) lines.push(`datasheet: ${yamlString(assets.datasheet)}`);

  lines.push(`language: ${lang}`);
  lines.push(`translationKey: ${product.slug}`);
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

function copyImage(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const isPng = source.toLowerCase().endsWith('.png');
  const quality = isPng ? 82 : 78;
  if (CAN_MAGICK) {
    const result = spawnSync('magick', [source, '-auto-orient', '-strip', '-resize', '1920x1920>', '-quality', String(quality), target], { stdio: 'ignore' });
    if (result.status === 0) return true;
  }
  fs.copyFileSync(source, target);
  return true;
}

function extractDatasheet(page, target) {
  if (!CAN_GS || !fs.existsSync(PROFILE_PDF)) return null;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const result = spawnSync(
    'gs',
    [
      '-q',
      '-dNOPAUSE',
      '-dBATCH',
      '-sDEVICE=pdfwrite',
      `-dFirstPage=${page}`,
      `-dLastPage=${page}`,
      '-dCompatibilityLevel=1.7',
      '-dPDFSETTINGS=/printer',
      '-dDownsampleColorImages=true',
      '-dColorImageResolution=150',
      '-dGrayImageResolution=150',
      `-sOutputFile=${target}`,
      PROFILE_PDF,
    ],
    { stdio: 'ignore' }
  );
  return result.status === 0 && fs.existsSync(target) ? `/img/products/datasheets/${path.basename(target)}` : null;
}

function main() {
  if (!fs.existsSync(PRODUCTS_JSON)) {
    console.error(`Missing ${PRODUCTS_JSON} — the company-profile pack is not in the repository.`);
    process.exit(1);
  }

  const pack = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
  const service = fs.existsSync(SERVICE_JSON) ? JSON.parse(fs.readFileSync(SERVICE_JSON, 'utf8')) : null;

  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  for (const product of pack.products) {
    const slug = slugify(product.id);

    const images = [];
    for (const image of product.images ?? []) {
      const source = path.join(PACK, '03-products', image.file);
      if (!fs.existsSync(source)) continue;
      const base = path.basename(image.file, path.extname(image.file));
      const target = path.join(IMAGE_DIR, slug, `${base}.webp`);
      copyImage(source, target);
      images.push({ path: `/img/products/${slug}/${base}.webp`, caption: image.caption });
    }

    const datasheet = extractDatasheet(product.pdf_page, path.join(DATASHEET_DIR, `${slug}.pdf`));

    const enriched = { ...product, slug };
    if (slug === 'service-maintenance' && service) {
      enriched.description = {
        id: service.offering.id,
        en: service.offering.en,
      };
    }

    for (const lang of ['id', 'en']) {
      const specRows = [
        ...Object.entries(product.specs ?? {}).map(([key, value]) => ({ label: labelFor(key), value: join(value, lang) })),
        ...extraRows(product, lang),
        ...(slug === 'service-maintenance' && service ? serviceRows(service, lang) : []),
      ];

      const document = {
        ...enriched,
        description: enriched.description,
        specs: rows(specRows),
        assets: { images, datasheet },
      };

      const name = lang === 'en' ? `${slug}.en.md` : `${slug}.md`;
      fs.writeFileSync(path.join(CONTENT_DIR, name), buildDocument(document, lang, document.assets), 'utf8');
    }

    console.log(`${slug}: ${images.length} image(s)${datasheet ? ' + datasheet' : ''}`);
  }

  const categories = [...new Set(pack.products.map((product) => product.category.id))];
  const ordered = [
    ...CATEGORY_ORDER.filter((category) => categories.includes(category)),
    ...categories.filter((category) => !CATEGORY_ORDER.includes(category)),
  ];
  console.log(`\n${pack.products.length} products in ${ordered.length} categories: ${ordered.join(', ')}`);
}

main();
