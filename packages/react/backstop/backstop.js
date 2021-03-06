const path = require('path');
// This file is generated by `npx sb extract` command.
// eslint-disable-next-line import/no-unresolved
const stories = require('../storybook-static/stories.json');

const mapComponents = require('./storybook');

const debug = false;
// Default viewport values.
const viewports = [
  { label: 'small_atom', width: 400, height: 250 },
  { label: 'phone', width: 320, height: 480 },
  { label: 'tablet', width: 1024, height: 768 }
];

// Map discovered Component dirs to Backstop scenarios.
const scenarios = mapComponents(stories.stories, debug);
module.exports = {
  id: 'vrt',
  viewports,
  onBeforeScript: 'onBefore.js',
  onReadyScript: 'onReady.js',
  scenarios,
  paths: {
    bitmaps_reference: path.resolve(__dirname, './data/bitmaps_reference'),
    bitmaps_test: path.resolve(__dirname, './data/bitmaps_test'),
    engine_scripts: path.resolve(__dirname, './scripts'),
    html_report: path.resolve(__dirname, './data/html_report'),
    ci_report: path.resolve(__dirname, './data/ci_report')
  },
  report: ['browser', 'CI'],
  engine: 'puppeteer',
  engineOptions: {
    args: [
      '--no-sandbox'
    ],
    devtools: false
  },
  asyncCaptureLimit: 3,
  asyncCompareLimit: 20,
  debug,
  debugWindow: debug
};
