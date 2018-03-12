const {debug, warning} = require('../../utils/logger')('ia:suggestions:years');
const albumsProvider = require('../../provider/albums');

const MAX_YEARS = 1000;

/**
 * Fetch year suggestions for the artist
 * TODO: actually it should work for any query set
 *
 * @param context
 */
function handle (context) {
  debug(`handle years suggestions for creator:${context.creatorId}`);
  return albumsProvider
    .fetchAlbumsByQuery(Object.assign({}, context, {
      limit: MAX_YEARS,
      fields: 'year',
      order: 'year',
    }))
    .then(res => {
      debug(res);
      if(res.total === MAX_YEARS) {
        warning('it seems we have asked years with the broad search scope. We should make it more precise to get a more relevant result.');
      }
      return res;
    });
}

module.exports = {
  handle,
  slots: ['year'],
};
