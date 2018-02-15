const {expect} = require('chai');
const {buildIntentRequest, MockResponse} = require('./_utils/mocking');
const index = require('..');
const strings = require('../strings');

describe('playMedia', () => {
  it('should be defined', () => {
    expect(index.playMedia).to.be.ok;
  });

  describe('welcome action', () => {
    it('should handle for a new user', () => {
      const res = new MockResponse();
      index.playMedia(buildIntentRequest({
        action: 'input.welcome',
        lastSeen: null,
      }), res);
      expect(res.speech()).to.not.contain('Welcome back');
      expect(res.speech()).to.contain('Welcome to the live music collection at the Internet Archive.');
    });

    it('should handle for return user', () => {
      const res = new MockResponse();
      index.playMedia(buildIntentRequest({
        action: 'input.welcome',
      }), res);
      expect(res.speech()).to.contain('Welcome back, choose an artist.');
    });
  });

  describe('no input action', () => {
    describe('speech back', () => {
      it('should 1st time', () => {
        const res = new MockResponse();
        index.playMedia(buildIntentRequest({
          action: 'No.Input',
        }), res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.speech()).to.contain(strings.errors.noInput.first);
      });

      it('should 2nd time', () => {
        const res = new MockResponse();
        const req = buildIntentRequest({
          action: 'No.Input',
          data: {
            noInputCount: 1,
          },
        });
        index.playMedia(req, res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.speech()).to.contain(strings.errors.noInput.reprompt);
      });
    });
  });
});
