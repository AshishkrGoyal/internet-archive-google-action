const debug = require('debug')('ia:actions:middleware:copy-arguments-to-slots:debug');

/**
 * Middleware
 * which transfer arguments to slots
 *
 * @param app
 * @param newValues
 * @param query
 * @param slotScheme
 * @returns {Promise.<{app: *, newValues, query: *, slotScheme: *}>}
 */
module.exports = () =>
  ({app, newValues = {}, query, slotScheme, ...res}) => {
    debug('apply copy arguments to slots middleware');
    newValues = slotScheme.slots
      .reduce((newValues, slotName) => {
        const value = app.getArgument(slotName);
        if (value) {
          query.setSlot(app, slotName, value);
          newValues = Object.assign({}, newValues, {[slotName]: value});
        }
        return newValues;
      }, newValues);

    return Promise.resolve({app, newValues, query, slotScheme, ...res});
  };
