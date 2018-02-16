const {expect} = require('chai');
const {buildIntentRequest, MockResponse} = require('./_utils/mocking');
const index = require('..');
const strings = require('../strings');

describe('playMedia', () => {
  it('should be defined', () => {
    expect(index.playMedia).to.be.ok;
  });

  it('should store last used action', () => {
    const res = new MockResponse();
    index.playMedia(buildIntentRequest({
      action: 'input.welcome',
      lastSeen: null,
    }), res);
    expect(res.data()).to.have.property('repetition').to.have.property('action', 'input.welcome');
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
        expect(res.userResponse()).to.be.true;
        expect(res.speech()).to.contain(strings.errors.noInput.first);
      });

      it('should 2nd time', () => {
        const res = new MockResponse();
        const req = buildIntentRequest({
          action: 'No.Input',
          data: {
            repetition: {
              action: 'No.Input',
              count: 1,
            },
          },
        });
        index.playMedia(req, res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.userResponse()).to.be.true;
        expect(res.speech()).to.contain(strings.errors.noInput.reprompt);
      });

      it('should 3rd time', () => {
        const res = new MockResponse();
        const req = buildIntentRequest({
          action: 'No.Input',
          data: {
            repetition: {
              action: 'No.Input',
              count: 2,
            },
          },
        });
        index.playMedia(req, res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.userResponse()).to.be.false;
        expect(res.speech()).to.contain(strings.fallback.finalReprompt);
      });

      it('should not fallback 3rd time if previous action was not no-input', () => {
        const res = new MockResponse();
        const req = buildIntentRequest({
          action: 'No.Input',
          data: {
            repetition: {
              action: 'some.other.action',
              count: 2,
            },
          },
        });
        index.playMedia(req, res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.userResponse()).to.be.true;
        expect(res.speech()).to.contain(strings.errors.noInput.first);
      });
    });
  });

  describe('unknown action', () => {
    describe('speech back', () => {
      it('should 1st time', () => {
        const res = new MockResponse();
        index.playMedia(buildIntentRequest({
          action: 'input.unknown',
        }), res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.userResponse()).to.be.true;
        expect(res.speech()).to.contain(strings.errors.unknownInput.first);
      });

      it('should 2nd time', () => {
        const res = new MockResponse();
        const req = buildIntentRequest({
          action: 'input.unknown',
          data: {
            repetition: {
              action: 'input.unknown',
              count: 1,
            },
          },
        });
        index.playMedia(req, res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.userResponse()).to.be.true;
        expect(res.speech()).to.contain(strings.errors.unknownInput.reprompt);
      });

      it('should 3rd time', () => {
        const res = new MockResponse();
        const req = buildIntentRequest({
          action: 'input.unknown',
          data: {
            repetition: {
              action: 'input.unknown',
              count: 2,
            },
          },
        });
        index.playMedia(req, res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.userResponse()).to.be.false;
        expect(res.speech()).to.contain(strings.fallback.finalReprompt);
      });

      it('should not fallback 3rd time if previous action was not no-input', () => {
        const res = new MockResponse();
        const req = buildIntentRequest({
          action: 'input.unknown',
          data: {
            repetition: {
              action: 'some.other.action',
              count: 2,
            },
          },
        });
        index.playMedia(req, res);
        expect(res.statusCode).to.be.equal(200);
        expect(res.userResponse()).to.be.true;
        expect(res.speech()).to.contain(strings.errors.unknownInput.first);
      });
    });
  });
});
