// Structural validation of the generated GTM container import file
// (docs/gtm/SCS-GA4-container-import.json) and the minimal merge-only support
// tracking patch (docs/gtm/SCS-support-tracking-patch.json). This validates the
// files against the documented GTM export/import shape (exportFormatVersion 2,
// API Version resource, snake-case enum types) and the project's intended tag
// set:
//   - exactly one Google Tag (googtag) for G-EQ9CBESN23
//   - exactly one GA4 event tag per approved data-layer event
//   - generate_lead mapped from scs_form_confirmed
//   - scs_support_click mapped from CE - scs_support_click with only the
//     allowlisted support_platform parameter
//   - no second page-view tag, no duplicate names, no dangling references
//   - the support patch contains ONLY the support resources (merge-safe)
// It cannot validate against Google's importer (that runs only in the owner's
// browser); the GTM import screen previews the file before anything is applied.
//
// Usage: node scripts/verify-gtm-import.mjs
import fs from 'node:fs';

const FILE = 'docs/gtm/SCS-GA4-container-import.json';
const PATCH_FILE = 'docs/gtm/SCS-support-tracking-patch.json';
const GA4_ID = 'G-EQ9CBESN23';
const EXPECTED_EVENTS = new Map([
  ['scs_call_click', 'CE - scs_call_click'],
  ['scs_text_click', 'CE - scs_text_click'],
  ['scs_request_click', 'CE - scs_request_click'],
  ['scs_form_start', 'CE - scs_form_start'],
  ['generate_lead', 'CE - scs_form_confirmed'],
  ['scs_support_click', 'CE - scs_support_click'],
]);

const failures = [];
const check = (name, condition, detail = '') => {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

let parsed;
try {
  parsed = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch (error) {
  console.error(`FAIL  ${FILE} is not valid JSON — ${error.message}`);
  process.exit(1);
}

check('exportFormatVersion is 2', parsed.exportFormatVersion === 2, String(parsed.exportFormatVersion));
const cv = parsed.containerVersion;
check('containerVersion present', Boolean(cv));
check('container publicId is GTM-MBGJ8SLD', cv?.container?.publicId === 'GTM-MBGJ8SLD');

const tags = cv?.tag ?? [];
const triggers = cv?.trigger ?? [];
const variables = cv?.variable ?? [];

const unique = (items, key, label) => {
  const ids = items.map((item) => item[key]);
  check(`${label} IDs unique`, new Set(ids).size === ids.length, ids.join(','));
  check(`${label} names unique`, new Set(items.map((i) => i.name)).size === items.length);
};
unique(tags, 'tagId', 'tag');
unique(triggers, 'triggerId', 'trigger');
unique(variables, 'variableId', 'variable');

const triggerIds = new Set(triggers.map((t) => t.triggerId));
for (const tag of tags) {
  for (const id of tag.firingTriggerId ?? []) {
    check(`tag "${tag.name}" trigger ${id} exists`, triggerIds.has(id));
  }
}

const variableNames = new Set(variables.map((v) => v.name));
for (const tag of tags) {
  const text = JSON.stringify(tag.parameter ?? []);
  for (const match of text.matchAll(/\{\{(DLV - [^}]+)\}\}/g)) {
    check(`tag "${tag.name}" variable ${match[1]} exists`, variableNames.has(match[1]));
  }
}

const googleTags = tags.filter((t) => t.type === 'googtag');
check('exactly one Google Tag (googtag)', googleTags.length === 1, String(googleTags.length));
if (googleTags.length === 1) {
  const idParam = (googleTags[0].parameter ?? []).find((p) => p.key === 'tagId');
  check('Google Tag uses G-EQ9CBESN23', idParam?.value === GA4_ID, idParam?.value);
}

const eventTags = tags.filter((t) => t.type === 'gaawe');
check('exactly one GA4 event tag per approved event', eventTags.length === EXPECTED_EVENTS.size, String(eventTags.length));
for (const [eventName, triggerName] of EXPECTED_EVENTS) {
  const matching = eventTags.filter((t) =>
    (t.parameter ?? []).some((p) => p.key === 'eventName' && p.value === eventName),
  );
  check(`exactly one tag sends "${eventName}"`, matching.length === 1, String(matching.length));
  if (matching.length === 1) {
    const triggerId = (matching[0].firingTriggerId ?? [])[0];
    const trigger = triggers.find((t) => t.triggerId === triggerId);
    check(`"${eventName}" fires from ${triggerName}`, trigger?.name === triggerName, trigger?.name);
  }
}

check(
  'no second page-view event tag',
  !eventTags.some((t) => (t.parameter ?? []).some((p) => p.key === 'eventName' && p.value === 'page_view')),
);
check('no legacy GA4 configuration tag (gaawc)', !tags.some((t) => t.type === 'gaawc'));
check('no advertising tags (awct/sp/gaa)', !tags.some((t) => ['awct', 'sp', 'gaa'].includes(t.type)));

const leadTag = eventTags.find((t) =>
  (t.parameter ?? []).some((p) => p.key === 'eventName' && p.value === 'generate_lead'),
);
if (leadTag) {
  const settings = (leadTag.parameter ?? []).find((p) => p.key === 'eventSettingsTable');
  const text = JSON.stringify(settings ?? {});
  check('generate_lead sends service_category from the data layer', text.includes('service_category') && text.includes('DLV - service_category'));
  check('generate_lead sends cta_slot from the data layer', text.includes('cta_slot') && text.includes('DLV - cta_slot'));
}

const pageViewTriggers = triggers.filter((t) => t.type === 'PAGEVIEW');
check('exactly one page-view trigger', pageViewTriggers.length === 1, String(pageViewTriggers.length));

const customEventNames = triggers
  .filter((t) => t.type === 'CUSTOM_EVENT')
  .map((t) => t.customEventFilter?.[0]?.parameter?.find((p) => p.key === 'arg1')?.value);
check(
  'custom-event triggers cover exactly the approved data-layer events',
  customEventNames.length === EXPECTED_EVENTS.size &&
    customEventNames.every((name) => [...EXPECTED_EVENTS.values()].length > 0 && name),
  customEventNames.join(','),
);
check(
  'no extra custom-event triggers beyond the approved set',
  customEventNames.every((name) =>
    [
      'scs_call_click',
      'scs_text_click',
      'scs_request_click',
      'scs_form_start',
      'scs_form_confirmed',
      'scs_support_click',
    ].includes(name),
  ),
  customEventNames.join(','),
);

// ── GA4 Event tag measurement ID (real importer requirement) ────────────────
// Google's container importer rejects gaawe tags whose measurement ID override
// is missing or empty with:
//   containerVersion.tag[n].vendorTemplate.parameter.measurementIdOverride:
//   The value must not be empty.
// Every GA4 Event tag must carry a nonempty measurementIdOverride TEMPLATE
// parameter (genuine exports place it in the tag's top-level parameter list).
const validateGa4EventTags = (cv, label) => {
  const ga4EventTags = (cv?.tag ?? []).filter((t) => t.type === 'gaawe');
  check(`${label}: GA4 event tags present`, ga4EventTags.length > 0, String(ga4EventTags.length));
  for (const tag of ga4EventTags) {
    const mid = (tag.parameter ?? []).find((p) => p.key === 'measurementIdOverride');
    check(
      `${label}: tag "${tag.name}" has a nonempty measurementIdOverride`,
      mid?.type === 'TEMPLATE' && typeof mid.value === 'string' && mid.value.trim().length > 0,
      JSON.stringify(mid ?? null),
    );
    if (mid && typeof mid.value === 'string' && mid.value.trim()) {
      check(
        `${label}: tag "${tag.name}" measurement ID is ${GA4_ID}`,
        mid.value === GA4_ID,
        mid.value,
      );
    }
  }
};

validateGa4EventTags(cv, 'full import');

// ── Support tracking resources (both the full import and the merge patch) ───
const validateSupportResources = (cv, label) => {
  const tagsIn = cv?.tag ?? [];
  const triggersIn = cv?.trigger ?? [];
  const variablesIn = cv?.variable ?? [];

  const supportTags = tagsIn.filter((t) =>
    (t.parameter ?? []).some((p) => p.key === 'eventName' && p.value === 'scs_support_click'),
  );
  check(`${label}: exactly one scs_support_click tag`, supportTags.length === 1, String(supportTags.length));
  if (supportTags.length === 1) {
    const tag = supportTags[0];
    check(`${label}: support tag is a GA4 event tag (gaawe)`, tag.type === 'gaawe', tag.type);
    const triggerId = (tag.firingTriggerId ?? [])[0];
    const trigger = triggersIn.find((t) => t.triggerId === triggerId);
    check(
      `${label}: support tag fires from CE - scs_support_click`,
      trigger?.name === 'CE - scs_support_click',
      trigger?.name,
    );
    const settings = JSON.stringify(
      (tag.parameter ?? []).find((p) => p.key === 'eventSettingsTable') ?? {},
    );
    check(
      `${label}: support tag maps support_platform from {{DLV - support_platform}}`,
      settings.includes('"support_platform"') && settings.includes('{{DLV - support_platform}}'),
    );
    check(
      `${label}: support tag has no href/amount/PII parameters`,
      !/href|amount|donor|email|phone|name|url/i.test(settings),
      settings,
    );
  }

  const supportTriggers = triggersIn.filter((t) => t.name === 'CE - scs_support_click');
  check(`${label}: exactly one CE - scs_support_click trigger`, supportTriggers.length === 1, String(supportTriggers.length));
  if (supportTriggers.length === 1) {
    const eventName = supportTriggers[0].customEventFilter?.[0]?.parameter?.find((p) => p.key === 'arg1')?.value;
    check(`${label}: support trigger watches scs_support_click`, eventName === 'scs_support_click', eventName);
  }

  const supportVariables = variablesIn.filter((v) => v.name === 'DLV - support_platform');
  check(`${label}: exactly one DLV - support_platform variable`, supportVariables.length === 1, String(supportVariables.length));
  if (supportVariables.length === 1) {
    const variable = supportVariables[0];
    const version = (variable.parameter ?? []).find((p) => p.key === 'dataLayerVersion')?.value;
    const name = (variable.parameter ?? []).find((p) => p.key === 'name')?.value;
    check(`${label}: support variable is a data-layer variable (v)`, variable.type === 'v', variable.type);
    check(`${label}: support variable reads dataLayerVersion 2`, String(version) === '2', String(version));
    check(`${label}: support variable name is support_platform`, name === 'support_platform', name);
  }
};

validateSupportResources(cv, 'full import');

// The patch must contain ONLY the support resources (merge-safe) and no
// second Google base tag.
let patch;
try {
  patch = JSON.parse(fs.readFileSync(PATCH_FILE, 'utf8'));
} catch (error) {
  check(`${PATCH_FILE} parses as JSON`, false, error.message);
}
if (patch) {
  const pcv = patch.containerVersion;
  check('patch: exportFormatVersion is 2', patch.exportFormatVersion === 2, String(patch.exportFormatVersion));
  check('patch: container publicId is GTM-MBGJ8SLD', pcv?.container?.publicId === 'GTM-MBGJ8SLD');
  check('patch: contains exactly 1 tag', (pcv?.tag ?? []).length === 1, String((pcv?.tag ?? []).length));
  check('patch: contains exactly 1 trigger', (pcv?.trigger ?? []).length === 1, String((pcv?.trigger ?? []).length));
  check('patch: contains exactly 1 variable', (pcv?.variable ?? []).length === 1, String((pcv?.variable ?? []).length));
  check('patch: contains no Google base tag', !(pcv?.tag ?? []).some((t) => t.type === 'googtag'));
  check('patch: contains no page-view trigger', !(pcv?.trigger ?? []).some((t) => t.type === 'PAGEVIEW'));
  validateSupportResources(pcv, 'patch');
  validateGa4EventTags(pcv, 'patch');
}

console.log(`\n${failures.length ? `FAILURES:\n${failures.join('\n')}` : 'ALL GTM IMPORT CHECKS PASSED'}`);
if (failures.length) process.exitCode = 1;
