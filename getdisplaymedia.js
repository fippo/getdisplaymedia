var adapter = require('webrtc-adapter');
var browser = adapter.browserDetails.browserName;

var firefoxDefaultSurface;
var chromeCallback;
module.exports = {
    shimgetDiplayMedia(window) {
        if (!window.navigator || 'getDisplayMedia' in window.navigator) {
            return;
        }
        if (!(browser === 'chrome' || browser === 'firefox')) {
            return;
        }
        navigator.getDisplayMedia = function(constraints) {
            if (browser === 'firefox') {
                if (!firefoxDefaultSurface) {
                    // throw an error indicating a choice must be made.
                    return;
                }
                if (constraints.video) {
                    constraints.video.mediaSource = firefoxDefaultSurface;
                    return navigator.mediaDevices.getUserMedia(constraints);
                } else {
                    // throw an error? What is the default.
                }
            } else if (browser === 'chrome')
                if (!chromeCallback) {
                    // throw an error indicating a choice must be made.
                    return;
                }
                return chromeCallback.then(function(sourceId) {
                    // TODO: empty sourceId means user aborted. Throw an error.
                    // TODO: evaluate given constraints first.
                    constraints = {video: {mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId,
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height,
                        maxFrameRate: 3
                    }}};
                    return navigator.mediaDevices.getUserMedia(constraints);
                });
            }
        }
    },

    setFirefoxDefaultSurface(surface) {
        firefoxDefaultSurface = surface;
    },

    setChromeCallback(cb) {
        chromeCallback = cb;
    }
};
