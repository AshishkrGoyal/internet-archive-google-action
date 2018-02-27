const _ = require('lodash');
const mustache = require('mustache');

function extractRequrements (templates) {
  return templates
    .map(greeting => ({
      template: greeting,
      requirements: getListOfRequiredSlots(greeting)
      // some slots could be described in temples like slotName.field
      // we should only consider slotName and drop field here
        .map(slot => slot.split('.')[0])
    }));
}

/**
 * Get list of slots which need for this template
 *
 * @param {string} template
 * @returns {Array}
 */
function getListOfRequiredSlots (template) {
  return mustache
    .parse(template)
    .filter(token => token[0] === 'name')
    .map(token => token[1]);
}

/**
 * get list of templates which match slots
 *
 * @param {Array} templateRequirements
 * @param {Object} slots
 * @returns {Array
 */
function getMatchedTemplates (templateRequirements, slots) {
  return templateRequirements
    .filter(
      ({requirements}) => requirements.every(r => _.includes(slots, r))
    )
    .map(({template}) => template);
}

/**
 * get list of templates which match slots
 *
 * @param {Array} templates
 * @param {Object} slots
 * @returns {Array
 */
function getMatchedTemplatesExactly (templateRequirements, slots) {
  const numOfSlots = slots.length;
  return templateRequirements
    .filter(
      ({requirements}) => _.intersection(requirements, slots).length === numOfSlots
    )
    .map(({template}) => template);
}

/**
 * Get prompts which match covers 1st slot
 * and has the maximum intersection with other slots
 *
 * @param {Array} prompts
 * @param {Array} slots
 */
function getPromptsForSlots (prompts, slots) {
  const criticalSlot = slots[0];
  const maximumIntersection = slots.length;
  return prompts
    .filter(p => _.includes(p.requirements, criticalSlot))
    .map(p => ({
      priority: _.intersection(p.requirements, slots).length / maximumIntersection,
      p,
    }))
    .sort((a, b) => b.priority - a.priority)
    .map(({p}) => p)[0];
}

module.exports = {
  extractRequrements,
  getListOfRequiredSlots,
  getMatchedTemplates,
  getMatchedTemplatesExactly,
  getPromptsForSlots,
};
