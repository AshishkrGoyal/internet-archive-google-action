const debug = require('debug')('ia:actions:media-status-update:debug');
const warning = require('debug')('ia:actions:media-status-update:warn');

const dialog = require('../dialog');

/**
 * handle 'media status update' action
 *
 * @param app
 */
function handler(app) {
  const status = app.getArgument('MEDIA_STATUS').extension.status;

  if (status === app.Media.Status.FINISHED) {
    handleFinished(app);
  } else {
    // TODO: log that we got unknown status
    // for example (app.Media.Status.UNSPECIFIED)
    warning(`Got unexpected media update ${status}`);
  }
}

/**
 * handle app.Media.Status.FINISHED media status
 *
 * @param app
 */
function handleFinished(app) {
  debug(`handle media action`);
  // TODO: play next song or notify to user that playlist is finished
  dialog.song(app, {});
}

module.exports = {
  handler,
};
