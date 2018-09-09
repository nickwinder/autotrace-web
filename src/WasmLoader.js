export default function loadNativeModule() {
    return new Promise(resolve => {
        let module = {
            // Wasm file is copied to ./lib/ when deployed.
            locateFile: function (path, prefix) {
                return "./lib/" + prefix + path;
            },
            // Prevent main from being called when wasm is loaded.
            noInitialRun: true,
        };

        const autotrace = require('../wasm/autotraceCpp.js');

        const nativeModule = autotrace({
            ...module,
            onRuntimeInitialized: () => {
                resolve({nativeModule})
            },
        });
    });
}