/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 27:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 708:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 393:
/***/ ((module) => {

module.exports = eval("require")("@actions/io");


/***/ }),

/***/ 742:
/***/ ((module) => {

module.exports = eval("require")("@actions/tool-cache");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(27);
const io = __nccwpck_require__(393);
const exec = __nccwpck_require__(708);
const tc = __nccwpck_require__(742);
const fs = __nccwpck_require__(147);

async function main() {
  const millPath = '.mill-bin'

  try {
    const millVersion = core.getInput('mill-version');

    const millDownloadPath = await tc.downloadTool(`https://github.com/lihaoyi/mill/releases/download/${millVersion}/${millVersion}`);
    await io.mkdirP(millPath);
    await io.cp(millDownloadPath, `${millPath}/mill`, { force: true });
    fs.chmodSync(`${millPath}/mill`, '0755');
    core.addPath(millPath);

    await exec.exec('mill', ['version']);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();

})();

module.exports = __webpack_exports__;
/******/ })()
;