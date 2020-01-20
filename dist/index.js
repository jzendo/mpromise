parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"GHac":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(e){return function(t){return t===e}},t=exports.PENDING="pending",r=exports.FULFILLED="fulfilled",s=exports.REJECTED="rejected",n=exports.isPending=e(t),o=exports.isFulfilled=e(r),i=exports.isRejected=e(s),u=exports.isResolved=function(e){return o(e)||i(e)};
},{}],"YOqM":[function(require,module,exports) {
"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.flushPendingHandlers=exports.teardownDeferThrow=exports.setupDeferThrow=exports.runAsync=exports.isObject=exports.isFunction=void 0;var t=require("./status"),r=exports.isFunction=function(e){return e&&"function"==typeof e},o=exports.isObject=function(t){return t&&"object"===e(t)},n=exports.runAsync=function(e){setTimeout(e,0)},u=function(e,t){var r={timer:setTimeout(function(){r.handler(e)}),handler:function(e){throw e},error:e};return r},s=exports.setupDeferThrow=function(e){return!1},i=exports.teardownDeferThrow=function(e){0},f=exports.flushPendingHandlers=function(e){var r=e.status_;if((0,t.isResolved)(r)){var o=e.pendingHandlers_.slice(0),u=e.value_;s(e)||o.forEach(function(e){var o;(0,t.isFulfilled)(r)?o=e[0]:(0,t.isRejected)(r)&&(o=e[1]),o&&n(function(){return o(u)})})}};
},{"./status":"GHac"}],"Focm":[function(require,module,exports) {
"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.defer=void 0;var n=require("./status"),s=require("./util"),r=function(){function e(i){t(this,e),this.status_=n.PENDING,this.value_=void 0,this.pendingHandlers_=[],this.promiseConstructor_=e,i(this.resolve_.bind(this),this.reject_.bind(this))}return i(e,[{key:"resolve_",value:function(t){if(!(0,n.isResolved)(this.status_)){if(t===this)throw new TypeError("Chaining cycle detected for promise");if(t instanceof this.promiseConstructor_)t.then(this.resolve_.bind(this),this.reject_.bind(this));else if((0,s.isFunction)(t)||(0,s.isObject)(t)){var e=!1;try{var i=t.then;if((0,s.isFunction)(i)){var r=function(t){return function(i){e||(t(i),e=!0)}};i.call(t,r(this.resolve_.bind(this)),r(this.reject_.bind(this)))}else this.fulfill_(t)}catch(u){e||this.reject_(u)}}else this.fulfill_(t)}}},{key:"fulfill_",value:function(t){this.fillWith_(t,n.FULFILLED)}},{key:"reject_",value:function(t){this.fillWith_(t,n.REJECTED)}},{key:"fillWith_",value:function(t,e){(0,n.isResolved)(this.status_)||(this.status_=e,this.value_=t,(0,s.flushPendingHandlers)(this))}},{key:"then",value:function(t,e){var i=this;(0,s.teardownDeferThrow)(this);var r=this.status_,u=this.value_,o=function(e,i){return function(n){try{(0,s.isFunction)(t)?e(t(n)):e(n)}catch(r){i(r)}}},c=function(t,i){return function(n){try{(0,s.isFunction)(e)?t(e(n)):i(n)}catch(r){i(r)}}},l=this.promiseConstructor_;return(0,n.isPending)(r)?new l(function(t,e){i.pendingHandlers_.push([o(t,e),c(t,e)])}):(0,n.isFulfilled)(r)?new l(function(t,e){return(0,s.runAsync)(function(){o(t,e)(u)})}):(0,n.isRejected)(r)?new l(function(t,e){return(0,s.runAsync)(function(){c(t,e)(u)})}):void 0}}]),e}();exports.default=r;var u=exports.defer=function(){var t={};return t.promise=new r(function(e,i){t.resolve=e,t.reject=i}),t};
},{"./status":"GHac","./util":"YOqM"}]},{},["Focm"], "Promise")
//# sourceMappingURL=/index.js.map