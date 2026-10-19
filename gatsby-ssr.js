/* eslint-disable @typescript-eslint/no-var-requires */
const React = require('react');

// GoatCounter: counts pageviews per path (https://sooftware.goatcounter.com)
exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    React.createElement('script', {
      key: 'goatcounter',
      async: true,
      'data-goatcounter': 'https://sooftware.goatcounter.com/count',
      src: '//gc.zgo.at/count.js',
    }),
  ]);
};
