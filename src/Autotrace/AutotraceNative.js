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

  async convertImage(imageImage: ArrayBuffer): boolean {
    await this.loadModule();

    const byteArray = new Uint8Array(imageImage);
    let vector = new this.nativeModule.VectorUint8()
    for (let i = 0; i < byteArray.byteLength; i++) {
      vector.push_back(byteArray[i])
    }

    try {
      let result = this.nativeModule.autotraceRun(
        vector,
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
    }
  }

  retrieveConversion(): Promise<String> {
    return new Promise(((resolve, reject) => {
      let outputFileResult = this.nativeModule.getOutputFile();
      if (outputFileResult.success) {
        // TODO Pretty inefficient and should be optimized.
        let outputBuffer = new Uint8Array(outputFileResult.value.size());
        for (let i = 0; i < outputFileResult.value.size(); i++) {
          outputBuffer[i] = outputFileResult.value.get(i);
        }
        const enc = new TextDecoder("utf-8");
        const svg = enc.decode(outputBuffer);
        resolve(svg);
      } else {
        reject("output file get error = " + outputFileResult.error);
      }
    }))
  }
}

export let autotraceNative = new AutotraceNative();
