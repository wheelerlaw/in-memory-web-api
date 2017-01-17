export default {
    entry: './dist/src/index.js',
    dest: './bundles/in-memory-web-api.umd.js',
    format: 'umd',
    moduleName: 'ng.inMemoryWebApi',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/http': 'ng.http',
        'rxjs/Observable': 'Rx',
        'rxjs/add/operator/delay': 'Rx'
    }
}
