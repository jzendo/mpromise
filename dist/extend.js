parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"GHac":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(e){return function(t){return t===e}},t=exports.PENDING="pending",r=exports.FULFILLED="fulfilled",s=exports.REJECTED="rejected",n=exports.isPending=e(t),o=exports.isFulfilled=e(r),i=exports.isRejected=e(s),u=exports.isResolved=function(e){return o(e)||i(e)};
},{}],"YOqM":[function(require,module,exports) {
"use strict";function e(r){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(r)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.flushPendingHandlers=exports.teardownDeferThrow=exports.setupDeferThrow=exports.runAsync=exports.isObject=exports.isFunction=void 0;var r=require("./status"),t=exports.isFunction=function(e){return e&&"function"==typeof e},o=exports.isObject=function(r){return r&&"object"===e(r)},n=exports.runAsync=function(e){setTimeout(e,0)},u=function(e,r){var t={timer:setTimeout(function(){t.handler(e)}),handler:function(e){throw e},error:e};return t},i=exports.setupDeferThrow=function(e){if(e){var t=e.status_;if(0==e.pendingHandlers_.length&&(0,r.isRejected)(t)){var o=e.value_;return e.reject_(o),e.deferThrowErr_=u(o,e),!0}}return!1},s=exports.teardownDeferThrow=function(e){e&&e.deferThrowErr_&&(clearTimeout(e.deferThrowErr_.timer),e.deferThrowErr_=void 0)},f=exports.flushPendingHandlers=function(e){var t=e.status_;if((0,r.isResolved)(t)){var o=e.pendingHandlers_.slice(0),u=e.value_;i(e)||o.forEach(function(e){var o;(0,r.isFulfilled)(t)?o=e[0]:(0,r.isRejected)(t)&&(o=e[1]),o&&n(function(){return o(u)})})}};
},{"./status":"GHac"}],"Focm":[function(require,module,exports) {
"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.defer=void 0;var n=require("./status"),s=require("./util"),r=function(){function e(i){t(this,e),this.status_=n.PENDING,this.value_=void 0,this.pendingHandlers_=[],this.promiseConstructor_=e,i(this.resolve_.bind(this),this.reject_.bind(this))}return i(e,[{key:"resolve_",value:function(t){if(!(0,n.isResolved)(this.status_)){if(t===this)throw new TypeError("Chaining cycle detected for promise");if(t instanceof this.promiseConstructor_)t.then(this.resolve_.bind(this),this.reject_.bind(this));else if((0,s.isFunction)(t)||(0,s.isObject)(t)){var e=!1;try{var i=t.then;if((0,s.isFunction)(i)){var r=function(t){return function(i){e||(t(i),e=!0)}};i.call(t,r(this.resolve_.bind(this)),r(this.reject_.bind(this)))}else this.fulfill_(t)}catch(u){e||this.reject_(u)}}else this.fulfill_(t)}}},{key:"fulfill_",value:function(t){this.fillWith_(t,n.FULFILLED)}},{key:"reject_",value:function(t){this.fillWith_(t,n.REJECTED)}},{key:"fillWith_",value:function(t,e){(0,n.isResolved)(this.status_)||(this.status_=e,this.value_=t,(0,s.flushPendingHandlers)(this))}},{key:"then",value:function(t,e){var i=this;(0,s.teardownDeferThrow)(this);var r=this.status_,u=this.value_,o=function(e,i){return function(n){try{(0,s.isFunction)(t)?e(t(n)):e(n)}catch(r){i(r)}}},c=function(t,i){return function(n){try{(0,s.isFunction)(e)?t(e(n)):i(n)}catch(r){i(r)}}},l=this.promiseConstructor_;return(0,n.isPending)(r)?new l(function(t,e){i.pendingHandlers_.push([o(t,e),c(t,e)])}):(0,n.isFulfilled)(r)?new l(function(t,e){return(0,s.runAsync)(function(){o(t,e)(u)})}):(0,n.isRejected)(r)?new l(function(t,e){return(0,s.runAsync)(function(){c(t,e)(u)})}):void 0}}]),e}();exports.default=r;var u=exports.defer=function(){var t={};return t.promise=new r(function(e,i){t.resolve=e,t.reject=i}),t};
},{"./status":"GHac","./util":"YOqM"}],"w5r6":[function(require,module,exports) {
"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function n(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}function o(t,r){return!r||"object"!==e(r)&&"function"!=typeof r?u(t):r}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function i(e){return(i=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.defer=void 0;var a=require("./index"),l=s(a),y=require("./util");function s(e){return e&&e.__esModule?e:{default:e}}function p(e){if(!Array.isArray(e))throw new Error("The first argument is not iterable (cannot read property Symbol(Symbol.iterator))")}var v=function(e){function r(e){var n;return t(this,r),(n=o(this,i(r).call(this,e))).promiseConstructor_=r,n}return f(r,l.default),n(r,[{key:"catch",value:function(e){return(0,y.teardownDeferThrow)(this),this.then(void 0,e)}}],[{key:"resolve",value:function(e){return e instanceof r?e:new r(function(t,r){t(e)})}},{key:"reject",value:function(e){return e instanceof r?e:new r(function(t,r){r(e)})}},{key:"all",value:function(e){p(e);var t=(0,a.defer)(),n=t.promise,o=t.resolve,u=t.reject,i=0,f=0,c=[],l=function(e){return function(t){f++,c[e]=t,f>=i&&o(c)}},y=!0,s=!1,v=void 0;try{for(var b,d=e[Symbol.iterator]();!(y=(b=d.next()).done);y=!0){var h=b.value;i++,r.resolve(h).then(l(i-1),u)}}catch(m){s=!0,v=m}finally{try{y||null==d.return||d.return()}finally{if(s)throw v}}return n}},{key:"race",value:function(e){p(e);var t=(0,a.defer)(),n=t.promise,o=t.resolve,u=t.reject,i=!0,f=!1,c=void 0;try{for(var l,y=e[Symbol.iterator]();!(i=(l=y.next()).done);i=!0){var s=l.value;r.resolve(s).then(o,u)}}catch(v){f=!0,c=v}finally{try{i||null==y.return||y.return()}finally{if(f)throw c}}return n}}]),r}();exports.default=v,exports.defer=a.defer;
},{"./index":"Focm","./util":"YOqM"}]},{},["w5r6"], "Promise")
//# sourceMappingURL=/extend.js.map