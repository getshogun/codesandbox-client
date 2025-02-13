import * as childProcess from 'node-services/lib/child_process';

// @ts-ignore
import SubWorkLoader from 'worker-loader?publicPath=/_bundler/&name=sub-dynamic-worker.[hash:8].worker.js!./generic-2';

import { EXTENSIONS_LOCATION } from '../../constants';

import { initializeAll } from '../common/global';

declare const __DEV__: boolean;

childProcess.addDefaultForkHandler(SubWorkLoader);

initializeAll().then(async () => {
  // Use require so that it only starts executing the chunk with all globals specified.
  // eslint-disable-next-line
  require('../workers/generic-worker').start({
    syncSandbox: true,
    syncTypes: true,
    extraMounts: {
      '/extensions': {
        fs: 'BundledHTTPRequest',
        options: {
          index: EXTENSIONS_LOCATION + '/extensions/index.json',
          baseUrl: EXTENSIONS_LOCATION + '/extensions',
          bundle: EXTENSIONS_LOCATION + '/bundles/svelte.0.7.1.min.json',
          logReads: __DEV__,
        },
      },
    },
  });
});
