const {expect} = require('chai');
const rewire = require('rewire');

const feeder = rewire('../../../extensions/feeders/albums-async');
const playlist = require('../../../state/playlist');
const query = require('../../../state/query');

const mockApp = require('../../_utils/mocking/app');
const mockAlbumsProvider = require('../../_utils/mocking/provider/albums');

describe('feeders', () => {
  describe('albums async', () => {
    let albumsProvider;
    let app;

    function mockNewAlbum (album) {
      albumsProvider = Object.assign({}, albumsProvider, mockAlbumsProvider({
        fetchAlbumsByQueryResolve: {
          items: [{
            identifier: album,
          }],
          total: 3,
        },

        fetchAlbumDetailsResolve: album,
      }));
      feeder.__set__('albumsProvider', albumsProvider);
    }

    function testNextSong ({album, app, feeder, filename, playlist, query, hasNext = true, moveToNext = true}) {
      let resolve;
      if (moveToNext) {
        resolve = feeder.next(app, query, playlist);
      } else {
        resolve = Promise.resolve();
      }

      return resolve
        .then(() => {
          expect(feeder.isEmpty(app, query, playlist)).to.be.false;
          expect(feeder.getCurrentItem(app, query, playlist))
            .to.have.property('filename', filename);
          expect(feeder.getCurrentItem(app, query, playlist))
            .to.have.property('albumTitle', album);
          expect(feeder.hasNext(app, query, playlist)).to.be.equal(hasNext);
        });
    }

    it('should fetch next ordered song', () => {
      app = mockApp();
      // TODO: do we need to set the order slot ?
      // query.setSlot(app, 'order', 'natural');
      mockNewAlbum({
        title: 'album-1',
        songs: [{
          filename: 'filename-1',
        }, {
          filename: 'filename-2',
        }, {
          filename: 'filename-3',
        }]
      });

      return feeder
        .build(app, query, playlist)
        .then(() => testNextSong({
          album: 'album-1',
          app,
          feeder,
          filename: 'filename-1',
          playlist,
          query,
          moveToNext: false,
        }))
        .then(() => testNextSong({
          album: 'album-1',
          app,
          feeder,
          filename: 'filename-2',
          playlist,
          query
        }))
        .then(() => {
          // we will request next chunk of songs
          mockNewAlbum({
            title: 'album-1',
            songs: [{
              filename: 'filename-1',
            }, {
              filename: 'filename-2',
            }, {
              filename: 'filename-3',
            }]
          });
        })
        .then(() => testNextSong({
          album: 'album-1',
          app,
          feeder,
          filename: 'filename-3',
          playlist,
          query
        }))
        .then(() => {
          // we will request next chunk of songs
          mockNewAlbum({
            title: 'album-2',
            songs: [{
              filename: 'filename-1',
            }, {
              filename: 'filename-2',
            }, {
              filename: 'filename-3',
            }]
          });
        })
        .then(() => testNextSong({
          album: 'album-2',
          app,
          feeder,
          filename: 'filename-1',
          playlist,
          query,
        }))
        .then(() => testNextSong({
          album: 'album-2',
          app,
          feeder,
          filename: 'filename-2',
          playlist,
          query
        }))
        .then(() => {
          // we will request next chunk of songs
          mockNewAlbum({
            title: 'album-2',
            songs: [{
              filename: 'filename-1',
            }, {
              filename: 'filename-2',
            }, {
              filename: 'filename-3',
            }]
          });
        })
        .then(() => testNextSong({
          album: 'album-2',
          app,
          feeder,
          filename: 'filename-3',
          playlist,
          query
        }))
        .then(() => {
          // we will request next chunk of songs
          mockNewAlbum({
            title: 'album-3',
            songs: [{
              filename: 'filename-1',
            }, {
              filename: 'filename-2',
            }, {
              filename: 'filename-3',
            }]
          });
        })
        .then(() => testNextSong({
          album: 'album-3',
          app,
          feeder,
          filename: 'filename-1',
          playlist,
          query
        }))
        .then(() => testNextSong({
          album: 'album-3',
          app,
          feeder,
          filename: 'filename-2',
          playlist,
          query
        }))
        .then(() => {
          // we will request next chunk of songs
          mockNewAlbum({
            title: 'album-3',
            songs: [{
              filename: 'filename-1',
            }, {
              filename: 'filename-2',
            }, {
              filename: 'filename-3',
            }]
          });
        })
        .then(() => testNextSong({
          album: 'album-3',
          app,
          feeder,
          filename: 'filename-3',
          playlist,
          query,
          hasNext: false,
        }));
    });

    // TODO: before this test
    // we should cover other functions from playlist
    // as we it would be good to cover fetchAlbumsByQuery
    xit('should fetch next random song', () => {
      app = mockApp();
      query.setSlot(app, 'order', 'random');
      return feeder.build(app, query, playlist)
        .then(() => testNextSong({
          app,
          feeder,
          filename: 'filename-1',
          playlist,
          query
        }))
        .then(() => testNextSong({
          app,
          feeder,
          filename: 'filename-2',
          playlist,
          query
        }))
        .then(() => testNextSong({
          app,
          feeder,
          filename: 'filename-3',
          playlist,
          query
        }))
        .then(() => testNextSong({
          app,
          feeder,
          filename: 'filename-1',
          playlist,
          query
        }))
        .then(() => testNextSong({
          app,
          feeder,
          filename: 'filename-2',
          playlist,
          query
        }));
    });
  });
});
