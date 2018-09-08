import WasmLoader from "./WasmLoader";

export class AutotraceNative {
    constructor() {
        this.nativeModule = null;
    }

    loadModule(): Promise {
        let wasmLoader = new WasmLoader();

        return new Promise(resolve => {
            wasmLoader.loadNativeModule()
                .then(({nativeModule}) => {
                    this.nativeModule = nativeModule;
                    resolve();
                });
        });
    }

    async convertImage(imageInputPromise: Promise<ArrayBuffer>): boolean {
        const byteArray = new Uint8Array(await imageInputPromise);
        const dataPtr = this.nativeModule._malloc(byteArray.byteLength);
        const dataHeap = new Uint8Array(this.nativeModule.HEAPU8.buffer, dataPtr, byteArray.byteLength);
        dataHeap.set(byteArray);

        try {
            let result = this.nativeModule.autotraceRun(
                dataHeap.byteOffset,
                dataHeap.byteLength,
                JSON.stringify({}),
                JSON.stringify({}),
                JSON.stringify({})
            );

            return result.success
        } catch (e) {
            return false;
        } finally {
            this.nativeModule._free(dataHeap.byteOffset)
        }
    }

    retrieveConversion(): Promise<String> {
        return new Promise(((resolve, reject) => {
            let fileSizeOutput = this.nativeModule.outputFileSize();

            if (fileSizeOutput.success) {
                const byteArrayOutput = new Uint8Array(fileSizeOutput.value);
                const dataPtrOutput = this.nativeModule._malloc(byteArrayOutput.byteLength);
                const outputFileHeap = new Uint8Array(this.nativeModule.HEAPU8.buffer, dataPtrOutput, byteArrayOutput.byteLength);
                outputFileHeap.set(byteArrayOutput);

                try {
                    let outputFileResult = this.nativeModule.getOutputFile(outputFileHeap.byteOffset, outputFileHeap.byteOffset);
                    if (outputFileResult.success) {
                        const enc = new TextDecoder("utf-8");
                        const svg = enc.decode(outputFileHeap);
                        resolve(svg);
                    } else {
                        reject("output file get error = " + outputFileResult.error);
                    }
                } finally {
                    this.nativeModule._free(outputFileHeap.byteOffset)
                }
            } else {
                reject("file Size error = " + fileSizeOutput.error);
            }
        }))
    }
}