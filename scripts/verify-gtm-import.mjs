// Structural validation of the generated GTM container import file
// (docs/gtm/SCS-GA4-container-import.json). This validates the file against
// the documented GTM export/import shape (exportFormatVersion 2, API Version
// resource, snake-case enum types) and the project's intended tag set:
//   - exactly one Google Tag (googtag) for G-EQ9CBESN23
//   - exactly one GA4 event tag per approved data-layer event
//   - generate_lead mapped from scs_form_confirmed
//   - no second page-view tag, no duplicate names, no dangling references
// It cannot validate against Google's importer (that runs only in the owner's
// browser); the GTM import screen previews the file before anything is applied.
//
// Usage: node scripts/verify-gtm-import.mjs
import fs from 'node:fs';

const FILE = 'docs/gtm/SCS-GA4-container-import.json';
const GA4_ID = 'G-EQ9CBESN23';
const EXPECTED_EVENTS = new Map([
  ['scs_call_click', 'CE - scs_call_click'],
  ['scs_text_click', 'CE - scs_text_click'],
  ['scs_request_click', 'CE - scs_request_click'],
  ['scs_form_start', 'CE - scs_form_start'],
  ['generate_lead', 'CE - scs_form_confirmed'],
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
    ['scs_call_click', 'scs_text_click', 'scs_request_click', 'scs_form_start', 'scs_form_confirmed'].includes(name),
  ),
  customEventNames.join(','),
);

console.log(`\n${failures.length ? `FAILURES:\n${failures.join('\n')}` : 'ALL GTM IMPORT CHECKS PASSED'}`);
if (failures.length) process.exitCode = 1;
