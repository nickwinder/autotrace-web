function loadWASMJS(url) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.onload = () => resolve(window.createAutotrace)
        script.onerror = reject
        script.src = url

        const { documentElement } = document
        documentElement.appendChild(script)
    })
}

export default function loadNativeModule() {
    return new Promise( async resolve => {
        const autotrace = await loadWASMJS('../wasm/autotraceCpp.js');
        const nativeModule = await autotrace(module)
        resolve({nativeModule})
    });
}
