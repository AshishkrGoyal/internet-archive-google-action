const {expect} = require('chai');
const rewire = require('rewire');

const mockAlbumsProvider = require('../../_utils/mocking/provider/albums');

const creators = rewire('../../../extensions/suggestions/creators');

describe('suggestions', () => {
  describe('creators', () => {
    let albumsProvider = mockAlbumsProvider({});

    beforeEach(() => {
      creators.__set__('albumsProvider', albumsProvider);
    });

    it('should have slots', () => {
      expect(creators).to.have.property('slots');
    });

    it('should have handler', () => {
      expect(creators).to.have.property('handle');
    });

    xit('should fetch popular creators', () => {
      return creators
        .handle({
          collectionId: 'etree',
          creatorId: 'band'
        })
        .then(res => {
          expect(res).to.have.property('items').with.deep.members([
            'the Grateful Dead',
            'the Ditty Bops',
            'the Cowboy Junkies',
          ]);
        });
    });
  });
});
