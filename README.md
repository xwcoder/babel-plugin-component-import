# babel-plugin-component-import

Modular babel plugin for ui library import like `comby-lib`, `antd` etc.

[TOC]

----

## What to do ?

* Transform from import whole package to import individual components, so to reduce code size.
* Automatic import individual component style

## Usage

```bash
npm i babel-plugin-component-import --save-dev
```

Via `babel.config.js`, `.babelrc` or babel-loader.

```js
plugins: [
  ['babel-plugin-component-import', {
    libraryName: 'comby-lib-mobile',
    libraryDirectory: 'lib',
    style: true,
    styleLibraryName: 'comby-lib-mobile_default',
    styleDirectory: 'dist',
    styleLibraryPath: '',
    camel2DashComponentName: true,
    camel2UnderlineComponentName: false,
    fileName: '',
    customName: null,
  }]
]
```

## Options

### libraryName
```javascript
libraryName: String
```
The library name you are using, like `comby-lib`, `antd` etc.

### libraryDirectory
```javascript
libraryDirectory: String - default is 'lib'
```
The components directory in `libraryName`.

### fileName
```javascript
fileName: String - default is ''
```
The component file name.

### camel2DashComponentName
```javascript
camel2DashComponentName: Boolean - default is true
```
Whether transform component name from camel style to dash style.

### camel2UnderlineComponentName
```javascript
camel2UnderlineComponentName: Boolean - default is false
```
Whether transform component name from camel style to underline style. Priority level is higher than `camel2DashComponentName`

### styleLibraryName
```javascript
styleLibraryName: String
```
The style library you are using.

### styleDirectory
```javascript
styleDirectory: String - default is 'dist'
```
The style direactory in `styleLibraryName`.

### styleLibraryPath
```javascript
styleLibraryPath: String
```
The style library path, the priority level is lower than `styleLibraryName`.

`NOTICE:`
The `styleLibraryName`, `styleDirectory` and `styleLibraryPath` determine `styleImportPath`, where to import style file.

```javascript
import { join } from 'path'

const importPath = customName
                    ? customName(componentName)
                    : join(libraryName, libraryDirectory, componentName, fileName)

let styleImportPath = importPath

if (styleLibraryName) {
  styleImportPath = join(styleLibraryName, styleDirectory, componentName)
} else if (styleLibraryPath) {
  styleImportPath = join(styleLibraryPath, componentName)
}
```

### style
```javascript
css: Boolean|String:Function - default is false
```

- `{ style: false }`: do not import style file.
- `{ style: true }`: import js and css modularly which path is `${styleImportPath}/style`
- `{ style: string }`: import js and css modularly which path is `${styleImportPath}/style/${style}`
- ``{ style: (name) => `${name}/style/2x` }``: import js and css modularly & css file path is `${name}/style/2x`

### customName

Customize import file path.

For example, the default behavior:

```typescript
import { TimePicker } from 'comby-lib'
↓ ↓ ↓ ↓ ↓ ↓
var _button = require('comby-lib/lib/time-picker');
```

Use `customName`:

```js
[
  'babel-plugin-component-import',
    {
      libraryName: 'comby-lib',
      customName: (name: string) => {
        if (name === 'time-picker'){
          return 'comby-lib/lib/custom-time-picker'
        }
        return `comby-lib/lib/${name}`
      }
    }
]
```

Result is:

```typescript
import { TimePicker } from 'comby-lib'
↓ ↓ ↓ ↓ ↓ ↓
var _button = require('comby-lib/lib/custom-time-picker')
```

## Example

#### { "libraryName": "comby-lib-mobile" }

```javascript
import { Button } from 'comby-lib-mobile'
ReactDOM.render(<Button>xxxx</Button>)

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('comby-lib-mobile/lib/button')
ReactDOM.render(<_button>xxxx</_button>)
```

#### { "libraryName": "comby-lib-mobile", style: "css" }

```javascript
import { Button } from 'comby-lib-mobile'
ReactDOM.render(<Button>xxxx</Button>)

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('comby-lib-mobile/lib/button')
require('comby-lib-mobile/lib/button/style/css')
ReactDOM.render(<_button>xxxx</_button>)
```

#### { "libraryName": "comby-lib-mobile", style: true }

```javascript
import { Button } from 'comby-lib-mobile'
ReactDOM.render(<Button>xxxx</Button>)

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('comby-lib-mobile/lib/button')
require('comby-lib-mobile/lib/button/style')
ReactDOM.render(<_button>xxxx</_button>)
```
