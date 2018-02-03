const bluebird = require('bluebird');

global.Promise = bluebird;

function promisifier(method) {
  return function promisified(...args) {
    return new Promise((resolve) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction'
]);
promisifyAll(chrome.storage, [
  'local',
]);

require('./background/inject');
