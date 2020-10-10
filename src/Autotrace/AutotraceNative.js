import loadNativeModule from "../WasmLoader";
import type {FittingOptions} from "./FittingOptions";

export class AutotraceNative {
    constructor() {
        this.nativeModule = null;
        this.fittingOptions = {};
    }

    loadModule(): Promise {
        if (this.nativeModule != null) return Promise.resolve(true);

        return new Promise(resolve => {
            loadNativeModule()
                .then(({nativeModule}) => {
                    this.nativeModule = nativeModule;
                    resolve();
                });
        });
    }

    setFittingOptionsProperty(fittingOptions: FittingOptions) {
        this.fittingOptions = {...this.fittingOptions, ...fittingOptions};
    }

    async convertImage(imageInputPromise: Promise<ArrayBuffer>): boolean {
        await this.loadModule();

        const byteArray = new Uint8Array(await imageInputPromise);
        const dataPtr = this.nativeModule._malloc(byteArray.byteLength);
        const dataHeap = new Uint8Array(this.nativeModule.HEAPU8.buffer, dataPtr, byteArray.byteLength);
        dataHeap.set(byteArray);

        try {
            let result = this.nativeModule.autotraceRun(
                dataHeap.byteOffset,
                dataHeap.byteLength,
                JSON.stringify(this.fittingOptions),
                JSON.stringify({}),
                JSON.stringify({})
            );

            if (!result.success)
                console.error(result.error)

            return result.success
        } catch (error) {
            console.error(error)
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

export let autotraceNative = new AutotraceNative();
