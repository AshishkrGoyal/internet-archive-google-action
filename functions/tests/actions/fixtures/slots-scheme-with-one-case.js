module.exports = {
  name: 'one dialog',

  /**
   * default values for slots
   * (we don't need to define those slots in `slots` field)
   */
  defaults: {
    sort: 'random',
  },

  /**
   * slots which we need for fulfillement
   */
  slots: [
    'collection',
    'creatorId',
    'coverage',
    'year',
  ],

  acknowledges: [
    '{{coverage}} - good place!',
    '{{coverage}} {{year}} - great choice!',
    '{{year}} - it was excellent year!',
    'Ok! Lets go with {{__resolvers.creator.title}} band!',
    `You've selected {{__resolvers.collection.title}}`,
  ],

  prompts: [{
    /**
     * prompt for a single slot
     */
    requirements: [
      'collection'
    ],

    prompts: [
      'Would you like to listen to music from our collections of {{suggestions.humanized}}?',
    ],

    /**
     * Fixed set of suggestions
     */
    suggestions: [
      '78s',
      'Live Concerts',
    ],
  }, {
    /**
     * prompt for a single slot
     */
    requirements: [
      'creatorId'
    ],

    prompts: [
      'What artist would you like to listen to, e.g. {{suggestions.humanized}}?',
    ],
  }, {
    /**
     * prompt for a single slot
     */
    requirements: [
      'coverage',
      'year',
    ],

    prompts: [
      'Do you have a specific city and year in mind, like {{suggestions.values.0}}, or would you like me to play something randomly?',
    ],
  }],

  /**
   * feeder which we should call once we get all slots
   */
  fulfillment: 'albums',
};
