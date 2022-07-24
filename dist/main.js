/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CachedTaskStoreTypes\": () => (/* binding */ CachedTaskStoreTypes),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nfunction deepCopy(obj) {\n    return JSON.parse(JSON.stringify(obj));\n}\nclass CachedTaskStore {\n    constructor(memType) {\n        this.memType = memType;\n    }\n}\nclass inMemoryStore extends CachedTaskStore {\n    constructor() {\n        super(\"memory\");\n    }\n}\nclass inSessionStore extends CachedTaskStore {\n    constructor() {\n        super(\"session\");\n    }\n}\nclass inIndexedDbStore extends CachedTaskStore {\n    constructor(expires) {\n        super(\"idb\");\n        this.expires = expires;\n    }\n}\nvar CachedTaskStoreTypes;\n(function (CachedTaskStoreTypes) {\n    CachedTaskStoreTypes.inMemory = new inMemoryStore();\n    // export const inSession = new inSessionStore();\n    // export const inIndexedDb_expiresIn = (expires: number) => new inIndexedDbStore(expires);\n})(CachedTaskStoreTypes || (CachedTaskStoreTypes = {}));\nclass AlreadyOpenedTaskException {\n    constructor(child) {\n        this.child = child;\n    }\n}\nclass ExceptionOnTask {\n    constructor(e) {\n        this.e = e;\n    }\n}\n/**Cached Task Manager.\n * Provides caching promise result.\n */\nclass CachedTaskManager {\n    /**Make new instance of Cached task manager. */\n    constructor(option = { storage: CachedTaskStoreTypes.inMemory }) {\n        this.option = option;\n        this.taskTable = {};\n        if (option.storage instanceof inMemoryStore) {\n        }\n        else if (option.storage instanceof inIndexedDbStore) {\n            if (typeof indexedDB === \"undefined\")\n                throw \"no idb\";\n        }\n    }\n    withTask(id, resolver) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const res = yield this.openTask(id)\n                .then((task) => resolver()\n                .catch((e) => new ExceptionOnTask(e))\n                .then((res) => task.close(res)))\n                .catch((y) => {\n                if (y instanceof AlreadyOpenedTaskException) {\n                    return y.child.waitForResolve();\n                }\n                else\n                    throw y;\n            });\n            return res;\n        });\n    }\n    openTask(id) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const existingTask = this.taskTable[id];\n            if (existingTask == undefined) {\n                this.taskTable[id] = new CachedTaskSet(id);\n                const newParent = new ParentCachedTask(id, this.taskTable[id]);\n                this.taskTable[id].parent = newParent;\n                newParent.list = this.taskTable[id];\n                return newParent;\n            }\n            else {\n                const newChild = new ChildCachedTask(id, this.taskTable[id]);\n                existingTask.addTask(newChild);\n                throw new AlreadyOpenedTaskException(newChild);\n            }\n        });\n    }\n}\nclass CachedTaskSet {\n    constructor(id) {\n        this.id = id;\n        this.children = [];\n        this.isResolved = false;\n        this.isRejected = false;\n    }\n    get result() {\n        return this._result;\n    }\n    set result(v) {\n        this._result = v;\n        this.isResolved = true;\n        this.children.map((x) => x.taskResolver(v));\n    }\n    get reject() {\n        return this._reject;\n    }\n    set reject(v) {\n        this._reject = v;\n        this.isRejected = true;\n        this.children.map((x) => x.taskRejector(v));\n    }\n    addTask(child) {\n        this.children.push(child);\n    }\n}\nclass CachedTask {\n    constructor(id, list) {\n        this.id = id;\n        this.list = list;\n    }\n}\nclass ParentCachedTask extends CachedTask {\n    close(resOrErr) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                if (resOrErr instanceof ExceptionOnTask) {\n                    throw resOrErr;\n                }\n                else {\n                    this.result = deepCopy(resOrErr);\n                    setTimeout(() => (this.list.result = deepCopy(resOrErr)), 0);\n                    return this.result;\n                }\n            }\n            catch (e) {\n                if (e instanceof ExceptionOnTask) {\n                    this.reject = deepCopy(e);\n                    setTimeout(() => (this.list.reject = deepCopy(e)), 0);\n                    throw this.reject;\n                }\n                else {\n                    throw e;\n                }\n            }\n        });\n    }\n}\nclass ChildCachedTask extends CachedTask {\n    constructor(id, list) {\n        super(id, list);\n        this.id = id;\n        this.list = list;\n        this.resultPromise = new Promise((res, rej) => {\n            this.taskResolver = res;\n            this.taskRejector = rej;\n        });\n    }\n    waitForResolve() {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (this.list.isRejected) {\n                this.taskRejector(this.list.reject);\n            }\n            else if (this.list.isResolved) {\n                this.taskResolver(this.list.result);\n            }\n            const res = yield this.resultPromise;\n            if (res instanceof ExceptionOnTask) {\n                throw res;\n            }\n            else\n                return deepCopy(res);\n        });\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CachedTaskManager);\n\n\n//# sourceURL=webpack://cached-promise/./src/main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});