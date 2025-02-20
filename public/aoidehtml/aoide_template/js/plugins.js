/*! imagesLoaded */ !(function(t, e) {
    "function" == typeof define && define.amd ?
        define("ev-emitter/ev-emitter", e) :
        "object" == typeof module && module.exports ?
        (module.exports = e()) :
        (t.EvEmitter = e());
})("undefined" != typeof window ? window : this, function() {
    function t() {}
    var e = t.prototype;
    return (
        (e.on = function(t, e) {
            if (t && e) {
                var i = (this._events = this._events || {}),
                    n = (i[t] = i[t] || []);
                return -1 == n.indexOf(e) && n.push(e), this;
            }
        }),
        (e.once = function(t, e) {
            if (t && e) {
                this.on(t, e);
                var i = (this._onceEvents = this._onceEvents || {}),
                    n = (i[t] = i[t] || {});
                return (n[e] = !0), this;
            }
        }),
        (e.off = function(t, e) {
            var i = this._events && this._events[t];
            if (i && i.length) {
                var n = i.indexOf(e);
                return -1 != n && i.splice(n, 1), this;
            }
        }),
        (e.emitEvent = function(t, e) {
            var i = this._events && this._events[t];
            if (i && i.length) {
                var n = 0,
                    o = i[n];
                e = e || [];
                for (var r = this._onceEvents && this._onceEvents[t]; o;) {
                    var s = r && r[o];
                    s && (this.off(t, o), delete r[o]),
                        o.apply(this, e),
                        (n += s ? 0 : 1),
                        (o = i[n]);
                }
                return this;
            }
        }),
        t
    );
}),
(function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ?
        define(["ev-emitter/ev-emitter"], function(i) {
            return e(t, i);
        }) :
        "object" == typeof module && module.exports ?
        (module.exports = e(t, require("ev-emitter"))) :
        (t.imagesLoaded = e(t, t.EvEmitter));
})(window, function(t, e) {
    function i(t, e) {
        for (var i in e) t[i] = e[i];
        return t;
    }

    function n(t) {
        var e = [];
        if (Array.isArray(t)) e = t;
        else if ("number" == typeof t.length)
            for (var i = 0; i < t.length; i++) e.push(t[i]);
        else e.push(t);
        return e;
    }

    function o(t, e, r) {
        return this instanceof o ?
            ("string" == typeof t && (t = document.querySelectorAll(t)),
                (this.elements = n(t)),
                (this.options = i({}, this.options)),
                "function" == typeof e ? (r = e) : i(this.options, e),
                r && this.on("always", r),
                this.getImages(),
                h && (this.jqDeferred = new h.Deferred()),
                void setTimeout(
                    function() {
                        this.check();
                    }.bind(this)
                )) :
            new o(t, e, r);
    }

    function r(t) {
        this.img = t;
    }

    function s(t, e) {
        (this.url = t), (this.element = e), (this.img = new Image());
    }
    var h = t.jQuery,
        a = t.console;
    (o.prototype = Object.create(e.prototype)),
    (o.prototype.options = {}),
    (o.prototype.getImages = function() {
        (this.images = []),
        this.elements.forEach(this.addElementImages, this);
    }),
    (o.prototype.addElementImages = function(t) {
        "IMG" == t.nodeName && this.addImage(t),
            this.options.background === !0 &&
            this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && d[e]) {
            for (
                var i = t.querySelectorAll("img"), n = 0; n < i.length; n++
            ) {
                var o = i[n];
                this.addImage(o);
            }
            if ("string" == typeof this.options.background) {
                var r = t.querySelectorAll(this.options.background);
                for (n = 0; n < r.length; n++) {
                    var s = r[n];
                    this.addElementBackgroundImages(s);
                }
            }
        }
    });
    var d = { 1: !0, 9: !0, 11: !0 };
    return (
        (o.prototype.addElementBackgroundImages = function(t) {
            var e = getComputedStyle(t);
            if (e)
                for (
                    var i = /url\((['"])?(.*?)\1\)/gi,
                        n = i.exec(e.backgroundImage); null !== n;

                ) {
                    var o = n && n[2];
                    o && this.addBackground(o, t),
                        (n = i.exec(e.backgroundImage));
                }
        }),
        (o.prototype.addImage = function(t) {
            var e = new r(t);
            this.images.push(e);
        }),
        (o.prototype.addBackground = function(t, e) {
            var i = new s(t, e);
            this.images.push(i);
        }),
        (o.prototype.check = function() {
            function t(t, i, n) {
                setTimeout(function() {
                    e.progress(t, i, n);
                });
            }
            var e = this;
            return (
                (this.progressedCount = 0),
                (this.hasAnyBroken = !1),
                this.images.length ?
                void this.images.forEach(function(e) {
                    e.once("progress", t), e.check();
                }) :
                void this.complete()
            );
        }),
        (o.prototype.progress = function(t, e, i) {
            this.progressedCount++,
                (this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
                this.emitEvent("progress", [this, t, e]),
                this.jqDeferred &&
                this.jqDeferred.notify &&
                this.jqDeferred.notify(this, t),
                this.progressedCount == this.images.length &&
                this.complete(),
                this.options.debug && a && a.log("progress: " + i, t, e);
        }),
        (o.prototype.complete = function() {
            var t = this.hasAnyBroken ? "fail" : "done";
            if (
                ((this.isComplete = !0),
                    this.emitEvent(t, [this]),
                    this.emitEvent("always", [this]),
                    this.jqDeferred)
            ) {
                var e = this.hasAnyBroken ? "reject" : "resolve";
                this.jqDeferred[e](this);
            }
        }),
        (r.prototype = Object.create(e.prototype)),
        (r.prototype.check = function() {
            var t = this.getIsImageComplete();
            return t ?
                void this.confirm(
                    0 !== this.img.naturalWidth,
                    "naturalWidth"
                ) :
                ((this.proxyImage = new Image()),
                    this.proxyImage.addEventListener("load", this),
                    this.proxyImage.addEventListener("error", this),
                    this.img.addEventListener("load", this),
                    this.img.addEventListener("error", this),
                    void(this.proxyImage.src = this.img.src));
        }),
        (r.prototype.getIsImageComplete = function() {
            return this.img.complete && void 0 !== this.img.naturalWidth;
        }),
        (r.prototype.confirm = function(t, e) {
            (this.isLoaded = t),
            this.emitEvent("progress", [this, this.img, e]);
        }),
        (r.prototype.handleEvent = function(t) {
            var e = "on" + t.type;
            this[e] && this[e](t);
        }),
        (r.prototype.onload = function() {
            this.confirm(!0, "onload"), this.unbindEvents();
        }),
        (r.prototype.onerror = function() {
            this.confirm(!1, "onerror"), this.unbindEvents();
        }),
        (r.prototype.unbindEvents = function() {
            this.proxyImage.removeEventListener("load", this),
                this.proxyImage.removeEventListener("error", this),
                this.img.removeEventListener("load", this),
                this.img.removeEventListener("error", this);
        }),
        (s.prototype = Object.create(r.prototype)),
        (s.prototype.check = function() {
            this.img.addEventListener("load", this),
                this.img.addEventListener("error", this),
                (this.img.src = this.url);
            var t = this.getIsImageComplete();
            t &&
                (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
                    this.unbindEvents());
        }),
        (s.prototype.unbindEvents = function() {
            this.img.removeEventListener("load", this),
                this.img.removeEventListener("error", this);
        }),
        (s.prototype.confirm = function(t, e) {
            (this.isLoaded = t),
            this.emitEvent("progress", [this, this.element, e]);
        }),
        (o.makeJQueryPlugin = function(e) {
            (e = e || t.jQuery),
            e &&
                ((h = e),
                    (h.fn.imagesLoaded = function(t, e) {
                        var i = new o(this, t, e);
                        return i.jqDeferred.promise(h(this));
                    }));
        }),
        o.makeJQueryPlugin(),
        o
    );
});
/*! chaming */
!(function(e) {
    "undefined" == typeof module ? (this.charming = e) : (module.exports = e);
})(function(e, n) {
    "use strict";
    n = n || {};
    var t = n.tagName || "span",
        o = null != n.classPrefix ? n.classPrefix : "char",
        r = 1,
        a = function(e) {
            for (
                var n = e.parentNode, a = e.nodeValue, c = a.length, l = -1;
                ++l < c;

            ) {
                var d = document.createElement(t);
                o && ((d.className = o + r), r++),
                    d.appendChild(document.createTextNode(a[l])),
                    n.insertBefore(d, e);
            }
            n.removeChild(e);
        };
    return (
        (function c(e) {
            for (
                var n = [].slice.call(e.childNodes), t = n.length, o = -1;
                ++o < t;

            )
                c(n[o]);
            e.nodeType === Node.TEXT_NODE && a(e);
        })(e),
        e
    );
});
/*! anime */
var $jscomp = { scope: {} };
($jscomp.defineProperty =
    "function" == typeof Object.defineProperties ?
    Object.defineProperty :
    function(t, e, r) {
        if (r.get || r.set)
            throw new TypeError(
                "ES3 does not support getters and setters."
            );
        t != Array.prototype && t != Object.prototype && (t[e] = r.value);
    }),
($jscomp.getGlobal = function(t) {
    return "undefined" != typeof window && window === t ?
        t :
        "undefined" != typeof global && null != global ?
        global :
        t;
}),
($jscomp.global = $jscomp.getGlobal(this)),
($jscomp.SYMBOL_PREFIX = "jscomp_symbol_"),
($jscomp.initSymbol = function() {
    ($jscomp.initSymbol = function() {}),
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
}),
($jscomp.symbolCounter_ = 0),
($jscomp.Symbol = function(t) {
    return $jscomp.SYMBOL_PREFIX + (t || "") + $jscomp.symbolCounter_++;
}),
($jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var t = $jscomp.global.Symbol.iterator;
    t ||
        (t = $jscomp.global.Symbol.iterator =
            $jscomp.global.Symbol("iterator")),
        "function" != typeof Array.prototype[t] &&
        $jscomp.defineProperty(Array.prototype, t, {
            configurable: !0,
            writable: !0,
            value: function() {
                return $jscomp.arrayIterator(this);
            },
        }),
        ($jscomp.initSymbolIterator = function() {});
}),
($jscomp.arrayIterator = function(t) {
    var e = 0;
    return $jscomp.iteratorPrototype(function() {
        return e < t.length ? { done: !1, value: t[e++] } : { done: !0 };
    });
}),
($jscomp.iteratorPrototype = function(t) {
    return (
        $jscomp.initSymbolIterator(),
        ((t = { next: t })[$jscomp.global.Symbol.iterator] = function() {
            return this;
        }),
        t
    );
}),
($jscomp.array = $jscomp.array || {}),
($jscomp.iteratorFromArray = function(t, e) {
    $jscomp.initSymbolIterator(), t instanceof String && (t += "");
    var r = 0,
        n = {
            next: function() {
                if (r < t.length) {
                    var o = r++;
                    return { value: e(o, t[o]), done: !1 };
                }
                return (
                    (n.next = function() {
                        return { done: !0, value: void 0 };
                    }),
                    n.next()
                );
            },
        };
    return (
        (n[Symbol.iterator] = function() {
            return n;
        }),
        n
    );
}),
($jscomp.polyfill = function(t, e, r, n) {
    if (e) {
        for (
            r = $jscomp.global, t = t.split("."), n = 0; n < t.length - 1; n++
        ) {
            var o = t[n];
            o in r || (r[o] = {}), (r = r[o]);
        }
        (e = e((n = r[(t = t[t.length - 1])]))) != n &&
            null != e &&
            $jscomp.defineProperty(r, t, {
                configurable: !0,
                writable: !0,
                value: e,
            });
    }
}),
$jscomp.polyfill(
    "Array.prototype.keys",
    function(t) {
        return (
            t ||
            function() {
                return $jscomp.iteratorFromArray(this, function(t) {
                    return t;
                });
            }
        );
    },
    "es6-impl",
    "es3"
);
var $jscomp$this = this;
!(function(t, e) {
    "function" == typeof define && define.amd ?
        define([], e) :
        "object" == typeof module && module.exports ?
        (module.exports = e()) :
        (t.anime = e());
})(this, function() {
    function t(t) {
        if (!P.col(t))
            try {
                return document.querySelectorAll(t);
            } catch (t) {}
    }

    function e(t, e) {
        for (
            var r = t.length,
                n = 2 <= arguments.length ? arguments[1] : void 0,
                o = [],
                a = 0; a < r; a++
        )
            if (a in t) {
                var i = t[a];
                e.call(n, i, a, t) && o.push(i);
            }
        return o;
    }

    function r(t) {
        return t.reduce(function(t, e) {
            return t.concat(P.arr(e) ? r(e) : e);
        }, []);
    }

    function n(e) {
        return P.arr(e) ?
            e :
            (P.str(e) && (e = t(e) || e),
                e instanceof NodeList || e instanceof HTMLCollection ?
                [].slice.call(e) :
                [e]);
    }

    function o(t, e) {
        return t.some(function(t) {
            return t === e;
        });
    }

    function a(t) {
        var e,
            r = {};
        for (e in t) r[e] = t[e];
        return r;
    }

    function i(t, e) {
        var r,
            n = a(t);
        for (r in t) n[r] = e.hasOwnProperty(r) ? e[r] : t[r];
        return n;
    }

    function u(t, e) {
        var r,
            n = a(t);
        for (r in e) n[r] = P.und(t[r]) ? e[r] : t[r];
        return n;
    }

    function s(t) {
        if (
            (t =
                /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(
                    t
                ))
        )
            return t[2];
    }

    function c(t, e) {
        return P.fnc(t) ? t(e.target, e.id, e.total) : t;
    }

    function f(t, e) {
        if (e in t.style)
            return (
                getComputedStyle(t).getPropertyValue(
                    e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
                ) || "0"
            );
    }

    function l(t, e) {
        return P.dom(t) && o(O, e) ?
            "transform" :
            P.dom(t) && (t.getAttribute(e) || (P.svg(t) && t[e])) ?
            "attribute" :
            P.dom(t) && "transform" !== e && f(t, e) ?
            "css" :
            null != t[e] ?
            "object" :
            void 0;
    }

    function p(t, r) {
        switch (l(t, r)) {
            case "transform":
                return (function(t, r) {
                    var n,
                        o = -1 < (n = r).indexOf("translate") ||
                        "perspective" === n ?
                        "px" :
                        -1 < n.indexOf("rotate") ||
                        -1 < n.indexOf("skew") ?
                        "deg" :
                        void 0;
                    if (
                        ((o = -1 < r.indexOf("scale") ? 1 : 0 + o), !(t = t.style.transform))
                    )
                        return o;
                    for (
                        var a = [], i = [], u = [], s = /(\w+)\((.+?)\)/g;
                        (a = s.exec(t));

                    )
                        i.push(a[1]), u.push(a[2]);
                    return (t = e(u, function(t, e) {
                            return i[e] === r;
                        })).length ?
                        t[0] :
                        o;
                })(t, r);
            case "css":
                return f(t, r);
            case "attribute":
                return t.getAttribute(r);
        }
        return t[r] || 0;
    }

    function d(t, e) {
        var r = /^(\*=|\+=|-=)/.exec(t);
        if (!r) return t;
        var n = s(t) || 0;
        switch (
            ((e = parseFloat(e)),
                (t = parseFloat(t.replace(r[0], ""))),
                r[0][0])
        ) {
            case "+":
                return e + t + n;
            case "-":
                return e - t + n;
            case "*":
                return e * t + n;
        }
    }

    function m(t, e) {
        return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2));
    }

    function g(t) {
        t = t.points;
        for (var e, r = 0, n = 0; n < t.numberOfItems; n++) {
            var o = t.getItem(n);
            0 < n && (r += m(e, o)), (e = o);
        }
        return r;
    }

    function y(t) {
        if (t.getTotalLength) return t.getTotalLength();
        switch (t.tagName.toLowerCase()) {
            case "circle":
                return 2 * Math.PI * t.getAttribute("r");
            case "rect":
                return (
                    2 * t.getAttribute("width") + 2 * t.getAttribute("height")
                );
            case "line":
                return m({ x: t.getAttribute("x1"), y: t.getAttribute("y1") }, { x: t.getAttribute("x2"), y: t.getAttribute("y2") });
            case "polyline":
                return g(t);
            case "polygon":
                var e = t.points;
                return g(t) + m(e.getItem(e.numberOfItems - 1), e.getItem(0));
        }
    }

    function h(t, e) {
        function r(r) {
            return (
                (r = void 0 === r ? 0 : r),
                t.el.getPointAtLength(1 <= e + r ? e + r : 0)
            );
        }
        var n = r(),
            o = r(-1),
            a = r(1);
        switch (t.property) {
            case "x":
                return n.x;
            case "y":
                return n.y;
            case "angle":
                return (180 * Math.atan2(a.y - o.y, a.x - o.x)) / Math.PI;
        }
    }

    function v(t, e) {
        var r,
            n = /-?\d*\.?\d+/g;
        if (((r = P.pth(t) ? t.totalLength : t), P.col(r)))
            if (P.rgb(r)) {
                var o = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(r);
                r = o ? "rgba(" + o[1] + ",1)" : r;
            } else
                r = P.hex(r) ?
                (function(t) {
                    t = t.replace(
                        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                        function(t, e, r, n) {
                            return e + e + r + r + n + n;
                        }
                    );
                    var e =
                        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                            t
                        );
                    return (
                        "rgba(" +
                        (t = parseInt(e[1], 16)) +
                        "," +
                        parseInt(e[2], 16) +
                        "," +
                        (e = parseInt(e[3], 16)) +
                        ",1)"
                    );
                })(r) :
                P.hsl(r) ?
                (function(t) {
                    function e(t, e, r) {
                        return (
                            0 > r && (r += 1),
                            1 < r && --r,
                            r < 1 / 6 ?
                            t + 6 * (e - t) * r :
                            0.5 > r ?
                            e :
                            r < 2 / 3 ?
                            t + (e - t) * (2 / 3 - r) * 6 :
                            t
                        );
                    }
                    var r =
                        /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(
                            t
                        ) ||
                        /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(
                            t
                        );
                    t = parseInt(r[1]) / 360;
                    var n = parseInt(r[2]) / 100,
                        o = parseInt(r[3]) / 100;
                    if (((r = r[4] || 1), 0 == n)) o = n = t = o;
                    else {
                        var a = 0.5 > o ? o * (1 + n) : o + n - o * n,
                            i = 2 * o - a;
                        (o = e(i, a, t + 1 / 3)),
                        (n = e(i, a, t)),
                        (t = e(i, a, t - 1 / 3));
                    }
                    return (
                        "rgba(" +
                        255 * o +
                        "," +
                        255 * n +
                        "," +
                        255 * t +
                        "," +
                        r +
                        ")"
                    );
                })(r) :
                void 0;
        else
            (o = (o = s(r)) ? r.substr(0, r.length - o.length) : r),
            (r = e && !/\s/g.test(r) ? o + e : o);
        return {
            original: (r += ""),
            numbers: r.match(n) ? r.match(n).map(Number) : [0],
            strings: P.str(t) || e ? r.split(n) : [],
        };
    }

    function b(t) {
        return e(
            (t = t ? r(P.arr(t) ? t.map(n) : n(t)) : []),
            function(t, e, r) {
                return r.indexOf(t) === e;
            }
        );
    }

    function j(t, e) {
        var r = a(e);
        if (P.arr(t)) {
            var o = t.length;
            2 !== o || P.obj(t[0]) ?
                P.fnc(e.duration) || (r.duration = e.duration / o) :
                (t = { value: t });
        }
        return n(t)
            .map(function(t, r) {
                return (
                    (r = r ? 0 : e.delay),
                    (t = P.obj(t) && !P.pth(t) ? t : { value: t }),
                    P.und(t.delay) && (t.delay = r),
                    t
                );
            })
            .map(function(t) {
                return u(t, r);
            });
    }

    function $(t, e) {
        var r;
        return t.tweens.map(function(n) {
            var o = (n = (function(t, e) {
                    var r,
                        n = {};
                    for (r in t) {
                        var o = c(t[r], e);
                        P.arr(o) &&
                            1 ===
                            (o = o.map(function(t) {
                                return c(t, e);
                            })).length &&
                            (o = o[0]),
                            (n[r] = o);
                    }
                    return (
                        (n.duration = parseFloat(n.duration)),
                        (n.delay = parseFloat(n.delay)),
                        n
                    );
                })(n, e)).value,
                a = p(e.target, t.name),
                i = r ? r.to.original : a,
                u = ((i = P.arr(o) ? o[0] : i), d(P.arr(o) ? o[1] : o, i));
            a = s(u) || s(i) || s(a);
            return (
                (n.from = v(i, a)),
                (n.to = v(u, a)),
                (n.start = r ? r.end : t.offset),
                (n.end = n.start + n.delay + n.duration),
                (n.easing = (function(t) {
                    return P.arr(t) ? k.apply(this, t) : F[t];
                })(n.easing)),
                (n.elasticity =
                    (1e3 - Math.min(Math.max(n.elasticity, 1), 999)) / 1e3),
                (n.isPath = P.pth(o)),
                (n.isColor = P.col(n.from.original)),
                n.isColor && (n.round = 1),
                (r = n)
            );
        });
    }

    function x(t, e, r, n) {
        var o = "delay" === t;
        return e.length ?
            (o ? Math.min : Math.max).apply(
                Math,
                e.map(function(e) {
                    return e[t];
                })
            ) :
            o ?
            n.delay :
            r.offset + n.delay + n.duration;
    }

    function w(t) {
        var n,
            o,
            a,
            s,
            c = i(M, t),
            f = i(S, t),
            p =
            ((o = t.targets),
                (a = b(o)).map(function(t, e) {
                    return { target: t, id: e, total: a.length };
                })),
            d = [],
            m = u(c, f);
        for (n in t)
            m.hasOwnProperty(n) ||
            "targets" === n ||
            d.push({ name: n, offset: m.offset, tweens: j(t[n], f) });
        return (
            (s = d),
            u(c, {
                children: [],
                animatables: p,
                animations: (t = e(
                    r(
                        p.map(function(t) {
                            return s.map(function(e) {
                                var r = l(t.target, e.name);
                                if (r) {
                                    var n = $(e, t);
                                    e = {
                                        type: r,
                                        property: e.name,
                                        animatable: t,
                                        tweens: n,
                                        duration: n[n.length - 1].end,
                                        delay: n[0].delay,
                                    };
                                } else e = void 0;
                                return e;
                            });
                        })
                    ),
                    function(t) {
                        return !P.und(t);
                    }
                )),
                duration: x("duration", t, c, f),
                delay: x("delay", t, c, f),
            })
        );
    }

    function A(t) {
        function r() {
            return (
                window.Promise &&
                new Promise(function(t) {
                    return (p = t);
                })
            );
        }

        function n(t) {
            return m.reversed ? m.duration - t : t;
        }

        function o(t) {
            for (var r = 0, n = {}, o = m.animations, a = o.length; r < a;) {
                var i = o[r],
                    u = i.animatable,
                    s = (c = i.tweens)[(d = c.length - 1)];
                d &&
                    (s =
                        e(c, function(e) {
                            return t < e.end;
                        })[0] || s);
                for (
                    var c =
                        Math.min(
                            Math.max(t - s.start - s.delay, 0),
                            s.duration
                        ) / s.duration,
                        l = isNaN(c) ? 1 : s.easing(c, s.elasticity),
                        p = ((c = s.to.strings), s.round),
                        d = [],
                        g = void 0,
                        y = ((g = s.to.numbers.length), 0); y < g; y++
                ) {
                    var v = void 0,
                        b = ((v = s.to.numbers[y]), s.from.numbers[y]);
                    v = s.isPath ? h(s.value, l * v) : b + l * (v - b);
                    p && ((s.isColor && 2 < y) || (v = Math.round(v * p) / p)),
                        d.push(v);
                }
                if ((s = c.length))
                    for (g = c[0], l = 0; l < s; l++)
                        (p = c[l + 1]),
                        (y = d[l]),
                        isNaN(y) || (g = p ? g + (y + p) : g + (y + " "));
                else g = d[0];
                L[i.type](u.target, i.property, g, n, u.id),
                    (i.currentValue = g),
                    r++;
            }
            if ((r = Object.keys(n).length))
                for (o = 0; o < r; o++)
                    I ||
                    (I = f(document.body, "transform") ?
                        "transform" :
                        "-webkit-transform"),
                    (m.animatables[o].target.style[I] = n[o].join(" "));
            (m.currentTime = t), (m.progress = (t / m.duration) * 100);
        }

        function a(t) {
            m[t] && m[t](m);
        }

        function i() {
            m.remaining && !0 !== m.remaining && m.remaining--;
        }

        function u(t) {
            var e = m.duration,
                u = m.offset,
                f = u + m.delay,
                g = m.currentTime,
                y = m.reversed,
                h = n(t);
            if (m.children.length) {
                var v = m.children,
                    b = v.length;
                if (h >= m.currentTime)
                    for (var j = 0; j < b; j++) v[j].seek(h);
                else
                    for (; b--;) v[b].seek(h);
            }
            (h >= f || !e) &&
            (m.began || ((m.began = !0), a("begin")), a("run")),
            h > u && h < e ?
                o(h) :
                (h <= u && 0 !== g && (o(0), y && i()),
                    ((h >= e && g !== e) || !e) && (o(e), y || i())),
                a("update"),
                t >= e &&
                (m.remaining ?
                    ((c = s),
                        "alternate" === m.direction &&
                        (m.reversed = !m.reversed)) :
                    (m.pause(),
                        m.completed ||
                        ((m.completed = !0),
                            a("complete"),
                            "Promise" in window && (p(), (d = r())))),
                    (l = 0));
        }
        t = void 0 === t ? {} : t;
        var s,
            c,
            l = 0,
            p = null,
            d = r(),
            m = w(t);
        return (
            (m.reset = function() {
                var t = m.direction,
                    e = m.loop;
                for (
                    m.currentTime = 0,
                    m.progress = 0,
                    m.paused = !0,
                    m.began = !1,
                    m.completed = !1,
                    m.reversed = "reverse" === t,
                    m.remaining = "alternate" === t && 1 === e ? 2 : e,
                    o(0),
                    t = m.children.length; t--;

                )
                    m.children[t].reset();
            }),
            (m.tick = function(t) {
                (s = t), c || (c = s), u((l + s - c) * A.speed);
            }),
            (m.seek = function(t) {
                u(n(t));
            }),
            (m.pause = function() {
                var t = C.indexOf(m); -
                1 < t && C.splice(t, 1), (m.paused = !0);
            }),
            (m.play = function() {
                m.paused &&
                    ((m.paused = !1),
                        (c = 0),
                        (l = n(m.currentTime)),
                        C.push(m),
                        E || T());
            }),
            (m.reverse = function() {
                (m.reversed = !m.reversed), (c = 0), (l = n(m.currentTime));
            }),
            (m.restart = function() {
                m.pause(), m.reset(), m.play();
            }),
            (m.finished = d),
            m.reset(),
            m.autoplay && m.play(),
            m
        );
    }
    var I,
        M = {
            update: void 0,
            begin: void 0,
            run: void 0,
            complete: void 0,
            loop: 1,
            direction: "normal",
            autoplay: !0,
            offset: 0,
        },
        S = {
            duration: 1e3,
            delay: 0,
            easing: "easeOutElastic",
            elasticity: 500,
            round: 0,
        },
        O =
        "translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY perspective".split(
            " "
        ),
        P = {
            arr: function(t) {
                return Array.isArray(t);
            },
            obj: function(t) {
                return -1 < Object.prototype.toString.call(t).indexOf("Object");
            },
            pth: function(t) {
                return P.obj(t) && t.hasOwnProperty("totalLength");
            },
            svg: function(t) {
                return t instanceof SVGElement;
            },
            dom: function(t) {
                return t.nodeType || P.svg(t);
            },
            str: function(t) {
                return "string" == typeof t;
            },
            fnc: function(t) {
                return "function" == typeof t;
            },
            und: function(t) {
                return void 0 === t;
            },
            hex: function(t) {
                return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t);
            },
            rgb: function(t) {
                return /^rgb/.test(t);
            },
            hsl: function(t) {
                return /^hsl/.test(t);
            },
            col: function(t) {
                return P.hex(t) || P.rgb(t) || P.hsl(t);
            },
        },
        k = (function() {
            function t(t, e, r) {
                return (
                    (((1 - 3 * r + 3 * e) * t + (3 * r - 6 * e)) * t + 3 * e) *
                    t
                );
            }
            return function(e, r, n, o) {
                if (0 <= e && 1 >= e && 0 <= n && 1 >= n) {
                    var a = new Float32Array(11);
                    if (e !== r || n !== o)
                        for (var i = 0; 11 > i; ++i) a[i] = t(0.1 * i, e, n);
                    return function(i) {
                        if (e === r && n === o) return i;
                        if (0 === i) return 0;
                        if (1 === i) return 1;
                        for (var u = 0, s = 1; 10 !== s && a[s] <= i; ++s)
                            u += 0.1;
                        s = u + ((i - a[--s]) / (a[s + 1] - a[s])) * 0.1;
                        var c =
                            3 * (1 - 3 * n + 3 * e) * s * s +
                            2 * (3 * n - 6 * e) * s +
                            3 * e;
                        if (0.001 <= c) {
                            for (
                                u = 0; 4 > u &&
                                0 !==
                                (c =
                                    3 * (1 - 3 * n + 3 * e) * s * s +
                                    2 * (3 * n - 6 * e) * s +
                                    3 * e);
                                ++u
                            ) {
                                var f = t(s, e, n) - i;
                                s = s - f / c;
                            }
                            i = s;
                        } else if (0 === c) i = s;
                        else {
                            (s = u), (u = u + 0.1);
                            var l = 0;
                            do {
                                (f = s + (u - s) / 2),
                                (c = t(f, e, n) - i),
                                0 < c ? (u = f) : (s = f);
                            } while (1e-7 < Math.abs(c) && 10 > ++l);
                            i = f;
                        }
                        return t(i, r, o);
                    };
                }
            };
        })(),
        F = (function() {
            function t(t, e) {
                return 0 === t || 1 === t ?
                    t :
                    -Math.pow(2, 10 * (t - 1)) *
                    Math.sin(
                        (2 *
                            (t - 1 - (e / (2 * Math.PI)) * Math.asin(1)) *
                            Math.PI) /
                        e
                    );
            }
            var e,
                r = "Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(
                    " "
                ),
                n = {
                    In: [
                        [0.55, 0.085, 0.68, 0.53],
                        [0.55, 0.055, 0.675, 0.19],
                        [0.895, 0.03, 0.685, 0.22],
                        [0.755, 0.05, 0.855, 0.06],
                        [0.47, 0, 0.745, 0.715],
                        [0.95, 0.05, 0.795, 0.035],
                        [0.6, 0.04, 0.98, 0.335],
                        [0.6, -0.28, 0.735, 0.045],
                        t,
                    ],
                    Out: [
                        [0.25, 0.46, 0.45, 0.94],
                        [0.215, 0.61, 0.355, 1],
                        [0.165, 0.84, 0.44, 1],
                        [0.23, 1, 0.32, 1],
                        [0.39, 0.575, 0.565, 1],
                        [0.19, 1, 0.22, 1],
                        [0.075, 0.82, 0.165, 1],
                        [0.175, 0.885, 0.32, 1.275],
                        function(e, r) {
                            return 1 - t(1 - e, r);
                        },
                    ],
                    InOut: [
                        [0.455, 0.03, 0.515, 0.955],
                        [0.645, 0.045, 0.355, 1],
                        [0.77, 0, 0.175, 1],
                        [0.86, 0, 0.07, 1],
                        [0.445, 0.05, 0.55, 0.95],
                        [1, 0, 0, 1],
                        [0.785, 0.135, 0.15, 0.86],
                        [0.68, -0.55, 0.265, 1.55],
                        function(e, r) {
                            return 0.5 > e ?
                                t(2 * e, r) / 2 :
                                1 - t(-2 * e + 2, r) / 2;
                        },
                    ],
                },
                o = { linear: k(0.25, 0.25, 0.75, 0.75) },
                a = {};
            for (e in n)
                (a.type = e),
                n[a.type].forEach(
                    (function(t) {
                        return function(e, n) {
                            o["ease" + t.type + r[n]] = P.fnc(e) ?
                                e :
                                k.apply($jscomp$this, e);
                        };
                    })(a)
                ),
                (a = { type: a.type });
            return o;
        })(),
        L = {
            css: function(t, e, r) {
                return (t.style[e] = r);
            },
            attribute: function(t, e, r) {
                return t.setAttribute(e, r);
            },
            object: function(t, e, r) {
                return (t[e] = r);
            },
            transform: function(t, e, r, n, o) {
                n[o] || (n[o] = []), n[o].push(e + "(" + r + ")");
            },
        },
        C = [],
        E = 0,
        T = (function() {
            function t() {
                E = requestAnimationFrame(e);
            }

            function e(e) {
                var r = C.length;
                if (r) {
                    for (var n = 0; n < r;) C[n] && C[n].tick(e), n++;
                    t();
                } else cancelAnimationFrame(E), (E = 0);
            }
            return t;
        })();
    return (
        (A.version = "2.2.0"),
        (A.speed = 1),
        (A.running = C),
        (A.remove = function(t) {
            t = b(t);
            for (var e = C.length; e--;)
                for (var r = C[e], n = r.animations, a = n.length; a--;)
                    o(t, n[a].animatable.target) &&
                    (n.splice(a, 1), n.length || r.pause());
        }),
        (A.getValue = p),
        (A.path = function(e, r) {
            var n = P.str(e) ? t(e)[0] : e,
                o = r || 100;
            return function(t) {
                return { el: n, property: t, totalLength: y(n) * (o / 100) };
            };
        }),
        (A.setDashoffset = function(t) {
            var e = y(t);
            return t.setAttribute("stroke-dasharray", e), e;
        }),
        (A.bezier = k),
        (A.easings = F),
        (A.timeline = function(t) {
            var e = A(t);
            return (
                e.pause(),
                (e.duration = 0),
                (e.add = function(r) {
                    return (
                        e.children.forEach(function(t) {
                            (t.began = !0), (t.completed = !0);
                        }),
                        n(r).forEach(function(r) {
                            var n = u(r, i(S, t || {}));
                            (n.targets = n.targets || t.targets),
                            (r = e.duration);
                            var o = n.offset;
                            (n.autoplay = !1),
                            (n.direction = e.direction),
                            (n.offset = P.und(o) ? r : d(o, r)),
                            (e.began = !0),
                            (e.completed = !0),
                            e.seek(n.offset),
                                ((n = A(n)).began = !0),
                                (n.completed = !0),
                                n.duration > r && (e.duration = n.duration),
                                e.children.push(n);
                        }),
                        e.seek(0),
                        e.reset(),
                        e.autoplay && e.restart(),
                        e
                    );
                }),
                e
            );
        }),
        (A.random = function(t, e) {
            return Math.floor(Math.random() * (e - t + 1)) + t;
        }),
        A
    );
});
/*! nicescroll */
!(function(e) {
    "function" == typeof define && define.amd ?
        define(["jquery"], e) :
        "object" == typeof exports ?
        (module.exports = e(require("jquery"))) :
        e(jQuery);
})(function(e) {
    "use strict";
    var o = !1,
        t = !1,
        r = 0,
        i = 2e3,
        s = 0,
        n = e,
        l = document,
        a = window,
        c = n(a),
        d = [],
        u =
        a.requestAnimationFrame ||
        a.webkitRequestAnimationFrame ||
        a.mozRequestAnimationFrame ||
        !1,
        h =
        a.cancelAnimationFrame ||
        a.webkitCancelAnimationFrame ||
        a.mozCancelAnimationFrame ||
        !1;
    if (u) a.cancelAnimationFrame || (h = function(e) {});
    else {
        var p = 0;
        (u = function(e, o) {
            var t = new Date().getTime(),
                r = Math.max(0, 16 - (t - p)),
                i = a.setTimeout(function() {
                    e(t + r);
                }, r);
            return (p = t + r), i;
        }),
        (h = function(e) {
            a.clearTimeout(e);
        });
    }
    var m = a.MutationObserver || a.WebKitMutationObserver || !1,
        f =
        Date.now ||
        function() {
            return new Date().getTime();
        },
        g = {
            zindex: "auto",
            cursoropacitymin: 0,
            cursoropacitymax: 1,
            cursorcolor: "#424242",
            cursorwidth: "6px",
            cursorborder: "1px solid #fff",
            cursorborderradius: "5px",
            scrollspeed: 40,
            mousescrollstep: 27,
            touchbehavior: !1,
            emulatetouch: !1,
            hwacceleration: !0,
            usetransition: !0,
            boxzoom: !1,
            dblclickzoom: !0,
            gesturezoom: !0,
            grabcursorenabled: !0,
            autohidemode: !0,
            background: "",
            iframeautoresize: !0,
            cursorminheight: 32,
            preservenativescrolling: !0,
            railoffset: !1,
            railhoffset: !1,
            bouncescroll: !0,
            spacebarenabled: !0,
            railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
            disableoutline: !0,
            horizrailenabled: !0,
            railalign: "right",
            railvalign: "bottom",
            enabletranslate3d: !0,
            enablemousewheel: !0,
            enablekeyboard: !0,
            smoothscroll: !0,
            sensitiverail: !0,
            enablemouselockapi: !0,
            cursorfixedheight: !1,
            directionlockdeadzone: 6,
            hidecursordelay: 400,
            nativeparentscrolling: !0,
            enablescrollonselection: !0,
            overflowx: !0,
            overflowy: !0,
            cursordragspeed: 0.3,
            rtlmode: "auto",
            cursordragontouch: !1,
            oneaxismousemode: "auto",
            scriptpath: (function() {
                var e =
                    l.currentScript ||
                    (function() {
                        var e = l.getElementsByTagName("script");
                        return !!e.length && e[e.length - 1];
                    })(),
                    o = e ? e.src.split("?")[0] : "";
                return o.split("/").length > 0 ?
                    o.split("/").slice(0, -1).join("/") + "/" :
                    "";
            })(),
            preventmultitouchscrolling: !0,
            disablemutationobserver: !1,
            enableobserver: !0,
            scrollbarid: !1,
        },
        v = !1,
        w = function() {
            if (v) return v;
            var e = l.createElement("DIV"),
                o = e.style,
                t = navigator.userAgent,
                r = navigator.platform,
                i = {};
            return (
                (i.haspointerlock =
                    "pointerLockElement" in l ||
                    "webkitPointerLockElement" in l ||
                    "mozPointerLockElement" in l),
                (i.isopera = "opera" in a),
                (i.isopera12 = i.isopera && "getUserMedia" in navigator),
                (i.isoperamini =
                    "[object OperaMini]" ===
                    Object.prototype.toString.call(a.operamini)),
                (i.isie = "all" in l && "attachEvent" in e && !i.isopera),
                (i.isieold = i.isie && !("msInterpolationMode" in o)),
                (i.isie7 =
                    i.isie &&
                    !i.isieold &&
                    (!("documentMode" in l) || 7 === l.documentMode)),
                (i.isie8 =
                    i.isie && "documentMode" in l && 8 === l.documentMode),
                (i.isie9 =
                    i.isie && "performance" in a && 9 === l.documentMode),
                (i.isie10 =
                    i.isie && "performance" in a && 10 === l.documentMode),
                (i.isie11 = "msRequestFullscreen" in e && l.documentMode >= 11),
                (i.ismsedge = "msCredentials" in a),
                (i.ismozilla = "MozAppearance" in o),
                (i.iswebkit = !i.ismsedge && "WebkitAppearance" in o),
                (i.ischrome = i.iswebkit && "chrome" in a),
                (i.ischrome38 = i.ischrome && "touchAction" in o),
                (i.ischrome22 = !i.ischrome38 && i.ischrome && i.haspointerlock),
                (i.ischrome26 = !i.ischrome38 && i.ischrome && "transition" in o),
                (i.cantouch =
                    "ontouchstart" in l.documentElement || "ontouchstart" in a),
                (i.hasw3ctouch =
                    (a.PointerEvent || !1) &&
                    (navigator.maxTouchPoints > 0 ||
                        navigator.msMaxTouchPoints > 0)),
                (i.hasmstouch = !i.hasw3ctouch && (a.MSPointerEvent || !1)),
                (i.ismac = /^mac$/i.test(r)),
                (i.isios = i.cantouch && /iphone|ipad|ipod/i.test(r)),
                (i.isios4 = i.isios && !("seal" in Object)),
                (i.isios7 = i.isios && "webkitHidden" in l),
                (i.isios8 = i.isios && "hidden" in l),
                (i.isios10 = i.isios && a.Proxy),
                (i.isandroid = /android/i.test(t)),
                (i.haseventlistener = "addEventListener" in e),
                (i.trstyle = !1),
                (i.hastransform = !1),
                (i.hastranslate3d = !1),
                (i.transitionstyle = !1),
                (i.hastransition = !1),
                (i.transitionend = !1),
                (i.trstyle = "transform"),
                (i.hastransform =
                    "transform" in o ||
                    (function() {
                        for (
                            var e = [
                                    "msTransform",
                                    "webkitTransform",
                                    "MozTransform",
                                    "OTransform",
                                ],
                                t = 0,
                                r = e.length; t < r; t++
                        )
                            if (void 0 !== o[e[t]]) {
                                i.trstyle = e[t];
                                break;
                            }
                        i.hastransform = !!i.trstyle;
                    })()),
                i.hastransform &&
                ((o[i.trstyle] = "translate3d(1px,2px,3px)"),
                    (i.hastranslate3d = /translate3d/.test(o[i.trstyle]))),
                (i.transitionstyle = "transition"),
                (i.prefixstyle = ""),
                (i.transitionend = "transitionend"),
                (i.hastransition =
                    "transition" in o ||
                    (function() {
                        i.transitionend = !1;
                        for (
                            var e = [
                                    "webkitTransition",
                                    "msTransition",
                                    "MozTransition",
                                    "OTransition",
                                    "OTransition",
                                    "KhtmlTransition",
                                ],
                                t = [
                                    "-webkit-",
                                    "-ms-",
                                    "-moz-",
                                    "-o-",
                                    "-o",
                                    "-khtml-",
                                ],
                                r = [
                                    "webkitTransitionEnd",
                                    "msTransitionEnd",
                                    "transitionend",
                                    "otransitionend",
                                    "oTransitionEnd",
                                    "KhtmlTransitionEnd",
                                ],
                                s = 0,
                                n = e.length; s < n; s++
                        )
                            if (e[s] in o) {
                                (i.transitionstyle = e[s]),
                                (i.prefixstyle = t[s]),
                                (i.transitionend = r[s]);
                                break;
                            }
                        i.ischrome26 && (i.prefixstyle = t[1]),
                            (i.hastransition = i.transitionstyle);
                    })()),
                (i.cursorgrabvalue = (function() {
                    var e = ["grab", "-webkit-grab", "-moz-grab"];
                    ((i.ischrome && !i.ischrome38) || i.isie) && (e = []);
                    for (var t = 0, r = e.length; t < r; t++) {
                        var s = e[t];
                        if (((o.cursor = s), o.cursor == s)) return s;
                    }
                    return "url(https://cdnjs.cloudflare.com/ajax/libs/slider-pro/1.3.0/css/images/openhand.cur),n-resize";
                })()),
                (i.hasmousecapture = "setCapture" in e),
                (i.hasMutationObserver = !1 !== m),
                (e = null),
                (v = i),
                i
            );
        },
        b = function(e, p) {
            function v() {
                var e = T.doc.css(P.trstyle);
                return (!(!e || "matrix" != e.substr(0, 6)) &&
                    e
                    .replace(/^.*\((.*)\)$/g, "$1")
                    .replace(/px/g, "")
                    .split(/, +/)
                );
            }

            function b() {
                var e = T.win;
                if ("zIndex" in e) return e.zIndex();
                for (; e.length > 0;) {
                    if (9 == e[0].nodeType) return !1;
                    var o = e.css("zIndex");
                    if (!isNaN(o) && 0 !== o) return parseInt(o);
                    e = e.parent();
                }
                return !1;
            }

            function x(e, o, t) {
                var r = e.css(o),
                    i = parseFloat(r);
                if (isNaN(i)) {
                    var s =
                        3 == (i = I[r] || 0) ?
                        t ?
                        T.win.outerHeight() - T.win.innerHeight() :
                        T.win.outerWidth() - T.win.innerWidth() :
                        1;
                    return T.isie8 && i && (i += 1), s ? i : 0;
                }
                return i;
            }

            function S(e, o, t, r) {
                T._bind(
                    e,
                    o,
                    function(r) {
                        var i = {
                            original: (r = r || a.event),
                            target: r.target || r.srcElement,
                            type: "wheel",
                            deltaMode: "MozMousePixelScroll" == r.type ? 0 : 1,
                            deltaX: 0,
                            deltaZ: 0,
                            preventDefault: function() {
                                return (
                                    r.preventDefault ?
                                    r.preventDefault() :
                                    (r.returnValue = !1), !1
                                );
                            },
                            stopImmediatePropagation: function() {
                                r.stopImmediatePropagation ?
                                    r.stopImmediatePropagation() :
                                    (r.cancelBubble = !0);
                            },
                        };
                        return (
                            "mousewheel" == o ?
                            (r.wheelDeltaX &&
                                (i.deltaX = -0.025 * r.wheelDeltaX),
                                r.wheelDeltaY &&
                                (i.deltaY = -0.025 * r.wheelDeltaY), !i.deltaY &&
                                !i.deltaX &&
                                (i.deltaY = -0.025 * r.wheelDelta)) :
                            (i.deltaY = r.detail),
                            t.call(e, i)
                        );
                    },
                    r
                );
            }

            function z(e, o, t, r) {
                T.scrollrunning ||
                    ((T.newscrolly = T.getScrollTop()),
                        (T.newscrollx = T.getScrollLeft()),
                        (D = f()));
                var i = f() - D;
                if (
                    ((D = f()),
                        i > 350 ? (A = 1) : (A += (2 - A) / 10),
                        (e = (e * A) | 0),
                        (o = (o * A) | 0),
                        e)
                ) {
                    if (r)
                        if (e < 0) {
                            if (T.getScrollLeft() >= T.page.maxw) return !0;
                        } else if (T.getScrollLeft() <= 0) return !0;
                    var s = e > 0 ? 1 : -1;
                    X !== s &&
                        (T.scrollmom && T.scrollmom.stop(),
                            (T.newscrollx = T.getScrollLeft()),
                            (X = s)),
                        (T.lastdeltax -= e);
                }
                if (o) {
                    if (
                        (function() {
                            var e = T.getScrollTop();
                            if (o < 0) {
                                if (e >= T.page.maxh) return !0;
                            } else if (e <= 0) return !0;
                        })()
                    ) {
                        if (
                            M.nativeparentscrolling &&
                            t &&
                            !T.ispage &&
                            !T.zoomactive
                        )
                            return !0;
                        var n = T.view.h >> 1;
                        T.newscrolly < -n ?
                            ((T.newscrolly = -n), (o = -1)) :
                            T.newscrolly > T.page.maxh + n ?
                            ((T.newscrolly = T.page.maxh + n), (o = 1)) :
                            (o = 0);
                    }
                    var l = o > 0 ? 1 : -1;
                    B !== l &&
                        (T.scrollmom && T.scrollmom.stop(),
                            (T.newscrolly = T.getScrollTop()),
                            (B = l)),
                        (T.lastdeltay -= o);
                }
                (o || e) &&
                T.synched("relativexy", function() {
                    var e = T.lastdeltay + T.newscrolly;
                    T.lastdeltay = 0;
                    var o = T.lastdeltax + T.newscrollx;
                    (T.lastdeltax = 0), T.rail.drag || T.doScrollPos(o, e);
                });
            }

            function k(e, o, t) {
                var r, i;
                return (!(t || !q) ||
                    (0 === e.deltaMode ?
                        ((r = (-e.deltaX * (M.mousescrollstep / 54)) | 0),
                            (i = (-e.deltaY * (M.mousescrollstep / 54)) | 0)) :
                        1 === e.deltaMode &&
                        ((r =
                                ((-e.deltaX * M.mousescrollstep * 50) / 80) | 0),
                            (i =
                                ((-e.deltaY * M.mousescrollstep * 50) / 80) | 0)),
                        o &&
                        M.oneaxismousemode &&
                        0 === r &&
                        i &&
                        ((r = i),
                            (i = 0),
                            t &&
                            (r < 0 ?
                                T.getScrollLeft() >= T.page.maxw :
                                T.getScrollLeft() <= 0) &&
                            ((i = r), (r = 0))),
                        T.isrtlmode && (r = -r),
                        z(r, i, t, !0) ?
                        void(t && (q = !0)) :
                        ((q = !1),
                            e.stopImmediatePropagation(),
                            e.preventDefault()))
                );
            }
            var T = this;
            (this.version = "3.7.6"), (this.name = "nicescroll"), (this.me = p);
            var E = n("body"),
                M = (this.opt = { doc: E, win: !1 });
            if ((n.extend(M, g), (M.snapbackspeed = 80), e))
                for (var L in M) void 0 !== e[L] && (M[L] = e[L]);
            if (
                (M.disablemutationobserver && (m = !1),
                    (this.doc = M.doc),
                    (this.iddoc =
                        this.doc && this.doc[0] ? this.doc[0].id || "" : ""),
                    (this.ispage = /^BODY|HTML/.test(
                        M.win ? M.win[0].nodeName : this.doc[0].nodeName
                    )),
                    (this.haswrapper = !1 !== M.win),
                    (this.win = M.win || (this.ispage ? c : this.doc)),
                    (this.docscroll =
                        this.ispage && !this.haswrapper ? c : this.win),
                    (this.body = E),
                    (this.viewport = !1),
                    (this.isfixed = !1),
                    (this.iframe = !1),
                    (this.isiframe =
                        "IFRAME" == this.doc[0].nodeName &&
                        "IFRAME" == this.win[0].nodeName),
                    (this.istextarea = "TEXTAREA" == this.win[0].nodeName),
                    (this.forcescreen = !1),
                    (this.canshowonmouseevent = "scroll" != M.autohidemode),
                    (this.onmousedown = !1),
                    (this.onmouseup = !1),
                    (this.onmousemove = !1),
                    (this.onmousewheel = !1),
                    (this.onkeypress = !1),
                    (this.ongesturezoom = !1),
                    (this.onclick = !1),
                    (this.onscrollstart = !1),
                    (this.onscrollend = !1),
                    (this.onscrollcancel = !1),
                    (this.onzoomin = !1),
                    (this.onzoomout = !1),
                    (this.view = !1),
                    (this.page = !1),
                    (this.scroll = { x: 0, y: 0 }),
                    (this.scrollratio = { x: 0, y: 0 }),
                    (this.cursorheight = 20),
                    (this.scrollvaluemax = 0),
                    "auto" == M.rtlmode)
            ) {
                var C = this.win[0] == a ? this.body : this.win,
                    N =
                    C.css("writing-mode") ||
                    C.css("-webkit-writing-mode") ||
                    C.css("-ms-writing-mode") ||
                    C.css("-moz-writing-mode");
                "horizontal-tb" == N || "lr-tb" == N || "" === N ?
                    ((this.isrtlmode = "rtl" == C.css("direction")),
                        (this.isvertical = !1)) :
                    ((this.isrtlmode =
                            "vertical-rl" == N ||
                            "tb" == N ||
                            "tb-rl" == N ||
                            "rl-tb" == N),
                        (this.isvertical =
                            "vertical-rl" == N || "tb" == N || "tb-rl" == N));
            } else(this.isrtlmode = !0 === M.rtlmode), (this.isvertical = !1);
            if (
                ((this.scrollrunning = !1),
                    (this.scrollmom = !1),
                    (this.observer = !1),
                    (this.observerremover = !1),
                    (this.observerbody = !1), !1 !== M.scrollbarid)
            )
                this.id = M.scrollbarid;
            else
                do {
                    this.id = "ascrail" + i++;
                } while (l.getElementById(this.id));
            (this.rail = !1),
            (this.cursor = !1),
            (this.cursorfreezed = !1),
            (this.selectiondrag = !1),
            (this.zoom = !1),
            (this.zoomactive = !1),
            (this.hasfocus = !1),
            (this.hasmousefocus = !1),
            (this.railslocked = !1),
            (this.locked = !1),
            (this.hidden = !1),
            (this.cursoractive = !0),
            (this.wheelprevented = !1),
            (this.overflowx = M.overflowx),
            (this.overflowy = M.overflowy),
            (this.nativescrollingarea = !1),
            (this.checkarea = 0),
            (this.events = []),
            (this.saved = {}),
            (this.delaylist = {}),
            (this.synclist = {}),
            (this.lastdeltax = 0),
            (this.lastdeltay = 0),
            (this.detected = w());
            var P = n.extend({}, this.detected);
            (this.canhwscroll = P.hastransform && M.hwacceleration),
            (this.ishwscroll = this.canhwscroll && T.haswrapper),
            this.isrtlmode ?
                this.isvertical ?
                (this.hasreversehr = !(
                    P.iswebkit ||
                    P.isie ||
                    P.isie11
                )) :
                (this.hasreversehr = !(
                    P.iswebkit ||
                    (P.isie && !P.isie10 && !P.isie11)
                )) :
                (this.hasreversehr = !1),
                (this.istouchcapable = !1),
                P.cantouch || (!P.hasw3ctouch && !P.hasmstouch) ?
                !P.cantouch ||
                P.isios ||
                P.isandroid ||
                (!P.iswebkit && !P.ismozilla) ||
                (this.istouchcapable = !0) :
                (this.istouchcapable = !0),
                M.enablemouselockapi ||
                ((P.hasmousecapture = !1), (P.haspointerlock = !1)),
                (this.debounced = function(e, o, t) {
                    T &&
                        (T.delaylist[e] ||
                            !1 ||
                            ((T.delaylist[e] = {
                                    h: u(function() {
                                        T.delaylist[e].fn.call(T),
                                            (T.delaylist[e] = !1);
                                    }, t),
                                }),
                                o.call(T)),
                            (T.delaylist[e].fn = o));
                }),
                (this.synched = function(e, o) {
                    T.synclist[e] ?
                        (T.synclist[e] = o) :
                        ((T.synclist[e] = o),
                            u(function() {
                                T &&
                                    (T.synclist[e] && T.synclist[e].call(T),
                                        (T.synclist[e] = null));
                            }));
                }),
                (this.unsynched = function(e) {
                    T.synclist[e] && (T.synclist[e] = !1);
                }),
                (this.css = function(e, o) {
                    for (var t in o)
                        T.saved.css.push([e, t, e.css(t)]), e.css(t, o[t]);
                }),
                (this.scrollTop = function(e) {
                    return void 0 === e ? T.getScrollTop() : T.setScrollTop(e);
                }),
                (this.scrollLeft = function(e) {
                    return void 0 === e ?
                        T.getScrollLeft() :
                        T.setScrollLeft(e);
                });
            var R = function(e, o, t, r, i, s, n) {
                (this.st = e),
                (this.ed = o),
                (this.spd = t),
                (this.p1 = r || 0),
                (this.p2 = i || 1),
                (this.p3 = s || 0),
                (this.p4 = n || 1),
                (this.ts = f()),
                (this.df = o - e);
            };
            if (
                ((R.prototype = {
                        B2: function(e) {
                            return 3 * (1 - e) * (1 - e) * e;
                        },
                        B3: function(e) {
                            return 3 * (1 - e) * e * e;
                        },
                        B4: function(e) {
                            return e * e * e;
                        },
                        getPos: function() {
                            return (f() - this.ts) / this.spd;
                        },
                        getNow: function() {
                            var e = (f() - this.ts) / this.spd,
                                o = this.B2(e) + this.B3(e) + this.B4(e);
                            return e >= 1 ? this.ed : (this.st + this.df * o) | 0;
                        },
                        update: function(e, o) {
                            return (
                                (this.st = this.getNow()),
                                (this.ed = e),
                                (this.spd = o),
                                (this.ts = f()),
                                (this.df = this.ed - this.st),
                                this
                            );
                        },
                    }),
                    this.ishwscroll)
            ) {
                (this.doc.translate = { x: 0, y: 0, tx: "0px", ty: "0px" }),
                P.hastranslate3d &&
                    P.isios &&
                    this.doc.css("-webkit-backface-visibility", "hidden"),
                    (this.getScrollTop = function(e) {
                        if (!e) {
                            var o = v();
                            if (o) return 16 == o.length ? -o[13] : -o[5];
                            if (T.timerscroll && T.timerscroll.bz)
                                return T.timerscroll.bz.getNow();
                        }
                        return T.doc.translate.y;
                    }),
                    (this.getScrollLeft = function(e) {
                        if (!e) {
                            var o = v();
                            if (o) return 16 == o.length ? -o[12] : -o[4];
                            if (T.timerscroll && T.timerscroll.bh)
                                return T.timerscroll.bh.getNow();
                        }
                        return T.doc.translate.x;
                    }),
                    (this.notifyScrollEvent = function(e) {
                        var o = l.createEvent("UIEvents");
                        o.initUIEvent("scroll", !1, !1, a, 1),
                            (o.niceevent = !0),
                            e.dispatchEvent(o);
                    });
                var _ = this.isrtlmode ? 1 : -1;
                P.hastranslate3d && M.enabletranslate3d ?
                    ((this.setScrollTop = function(e, o) {
                            (T.doc.translate.y = e),
                            (T.doc.translate.ty = -1 * e + "px"),
                            T.doc.css(
                                    P.trstyle,
                                    "translate3d(" +
                                    T.doc.translate.tx +
                                    "," +
                                    T.doc.translate.ty +
                                    ",0)"
                                ),
                                o || T.notifyScrollEvent(T.win[0]);
                        }),
                        (this.setScrollLeft = function(e, o) {
                            (T.doc.translate.x = e),
                            (T.doc.translate.tx = e * _ + "px"),
                            T.doc.css(
                                    P.trstyle,
                                    "translate3d(" +
                                    T.doc.translate.tx +
                                    "," +
                                    T.doc.translate.ty +
                                    ",0)"
                                ),
                                o || T.notifyScrollEvent(T.win[0]);
                        })) :
                    ((this.setScrollTop = function(e, o) {
                            (T.doc.translate.y = e),
                            (T.doc.translate.ty = -1 * e + "px"),
                            T.doc.css(
                                    P.trstyle,
                                    "translate(" +
                                    T.doc.translate.tx +
                                    "," +
                                    T.doc.translate.ty +
                                    ")"
                                ),
                                o || T.notifyScrollEvent(T.win[0]);
                        }),
                        (this.setScrollLeft = function(e, o) {
                            (T.doc.translate.x = e),
                            (T.doc.translate.tx = e * _ + "px"),
                            T.doc.css(
                                    P.trstyle,
                                    "translate(" +
                                    T.doc.translate.tx +
                                    "," +
                                    T.doc.translate.ty +
                                    ")"
                                ),
                                o || T.notifyScrollEvent(T.win[0]);
                        }));
            } else
                (this.getScrollTop = function() {
                    return T.docscroll.scrollTop();
                }),
                (this.setScrollTop = function(e) {
                    T.docscroll.scrollTop(e);
                }),
                (this.getScrollLeft = function() {
                    return T.hasreversehr ?
                        T.detected.ismozilla ?
                        T.page.maxw -
                        Math.abs(T.docscroll.scrollLeft()) :
                        T.page.maxw - T.docscroll.scrollLeft() :
                        T.docscroll.scrollLeft();
                }),
                (this.setScrollLeft = function(e) {
                    return setTimeout(function() {
                        if (T)
                            return (
                                T.hasreversehr &&
                                (e = T.detected.ismozilla ?
                                    -(T.page.maxw - e) :
                                    T.page.maxw - e),
                                T.docscroll.scrollLeft(e)
                            );
                    }, 1);
                });
            (this.getTarget = function(e) {
                return (!!e &&
                    (e.target ? e.target : !!e.srcElement && e.srcElement)
                );
            }),
            (this.hasParent = function(e, o) {
                if (!e) return !1;
                for (
                    var t = e.target || e.srcElement || e || !1; t && t.id != o;

                )
                    t = t.parentNode || !1;
                return !1 !== t;
            });
            var I = { thin: 1, medium: 3, thick: 5 };
            (this.getDocumentScrollOffset = function() {
                return {
                    top: a.pageYOffset || l.documentElement.scrollTop,
                    left: a.pageXOffset || l.documentElement.scrollLeft,
                };
            }),
            (this.getOffset = function() {
                if (T.isfixed) {
                    var e = T.win.offset(),
                        o = T.getDocumentScrollOffset();
                    return (e.top -= o.top), (e.left -= o.left), e;
                }
                var t = T.win.offset();
                if (!T.viewport) return t;
                var r = T.viewport.offset();
                return { top: t.top - r.top, left: t.left - r.left };
            }),
            (this.updateScrollBar = function(e) {
                var o, t;
                if (T.ishwscroll)
                    T.rail.css({
                        height: T.win.innerHeight() -
                            (M.railpadding.top + M.railpadding.bottom),
                    }),
                    T.railh &&
                    T.railh.css({
                        width: T.win.innerWidth() -
                            (M.railpadding.left +
                                M.railpadding.right),
                    });
                else {
                    var r = T.getOffset();
                    if (
                        ((o = {
                                top: r.top,
                                left: r.left -
                                    (M.railpadding.left + M.railpadding.right),
                            }),
                            (o.top += x(T.win, "border-top-width", !0)),
                            (o.left += T.rail.align ?
                                T.win.outerWidth() -
                                x(T.win, "border-right-width") -
                                T.rail.width :
                                x(T.win, "border-left-width")),
                            (t = M.railoffset) &&
                            (t.top && (o.top += t.top),
                                t.left && (o.left += t.left)),
                            T.railslocked ||
                            T.rail.css({
                                top: o.top,
                                left: o.left,
                                height:
                                    (e ? e.h : T.win.innerHeight()) -
                                    (M.railpadding.top +
                                        M.railpadding.bottom),
                            }),
                            T.zoom &&
                            T.zoom.css({
                                top: o.top + 1,
                                left: 1 == T.rail.align ?
                                    o.left - 20 :
                                    o.left + T.rail.width + 4,
                            }),
                            T.railh && !T.railslocked)
                    ) {
                        (o = { top: r.top, left: r.left }),
                        (t = M.railhoffset) &&
                        (t.top && (o.top += t.top),
                            t.left && (o.left += t.left));
                        var i = T.railh.align ?
                            o.top +
                            x(T.win, "border-top-width", !0) +
                            T.win.innerHeight() -
                            T.railh.height :
                            o.top + x(T.win, "border-top-width", !0),
                            s = o.left + x(T.win, "border-left-width");
                        T.railh.css({
                            top: i -
                                (M.railpadding.top + M.railpadding.bottom),
                            left: s,
                            width: T.railh.width,
                        });
                    }
                }
            }),
            (this.doRailClick = function(e, o, t) {
                var r, i, s, n;
                T.railslocked ||
                    (T.cancelEvent(e),
                        "pageY" in e ||
                        ((e.pageX =
                                e.clientX + l.documentElement.scrollLeft),
                            (e.pageY =
                                e.clientY + l.documentElement.scrollTop)),
                        o ?
                        ((r = t ? T.doScrollLeft : T.doScrollTop),
                            (s = t ?
                                (e.pageX -
                                    T.railh.offset().left -
                                    T.cursorwidth / 2) *
                                T.scrollratio.x :
                                (e.pageY -
                                    T.rail.offset().top -
                                    T.cursorheight / 2) *
                                T.scrollratio.y),
                            T.unsynched("relativexy"),
                            r(0 | s)) :
                        ((r = t ? T.doScrollLeftBy : T.doScrollBy),
                            (s = t ? T.scroll.x : T.scroll.y),
                            (n = t ?
                                e.pageX - T.railh.offset().left :
                                e.pageY - T.rail.offset().top),
                            (i = t ? T.view.w : T.view.h),
                            r(s >= n ? i : -i)));
            }),
            (T.newscrolly = T.newscrollx = 0),
            (T.hasanimationframe = "requestAnimationFrame" in a),
            (T.hascancelanimationframe = "cancelAnimationFrame" in a),
            (T.hasborderbox = !1),
            (this.init = function() {
                if (((T.saved.css = []), P.isoperamini)) return !0;
                if (P.isandroid && !("hidden" in l)) return !0;
                (M.emulatetouch = M.emulatetouch || M.touchbehavior),
                (T.hasborderbox =
                    a.getComputedStyle &&
                    "border-box" ===
                    a.getComputedStyle(l.body)["box-sizing"]);
                var e = { "overflow-y": "hidden" };
                if (
                    ((P.isie11 || P.isie10) &&
                        (e["-ms-overflow-style"] = "none"),
                        T.ishwscroll &&
                        (this.doc.css(
                                P.transitionstyle,
                                P.prefixstyle + "transform 0ms ease-out"
                            ),
                            P.transitionend &&
                            T.bind(
                                T.doc,
                                P.transitionend,
                                T.onScrollTransitionEnd, !1
                            )),
                        (T.zindex = "auto"),
                        T.ispage || "auto" != M.zindex ?
                        (T.zindex = M.zindex) :
                        (T.zindex = b() || "auto"), !T.ispage &&
                        "auto" != T.zindex &&
                        T.zindex > s &&
                        (s = T.zindex),
                        T.isie &&
                        0 === T.zindex &&
                        "auto" == M.zindex &&
                        (T.zindex = "auto"), !T.ispage || !P.isieold)
                ) {
                    var i = T.docscroll;
                    T.ispage && (i = T.haswrapper ? T.win : T.doc),
                        T.css(i, e),
                        T.ispage &&
                        (P.isie11 || P.isie) &&
                        T.css(n("html"), e), !P.isios ||
                        T.ispage ||
                        T.haswrapper ||
                        T.css(E, {
                            "-webkit-overflow-scrolling": "touch",
                        });
                    var d = n(l.createElement("div"));
                    d.css({
                            position: "relative",
                            top: 0,
                            float: "right",
                            width: M.cursorwidth,
                            height: 0,
                            "background-color": M.cursorcolor,
                            border: M.cursorborder,
                            "background-clip": "padding-box",
                            "-webkit-border-radius": M.cursorborderradius,
                            "-moz-border-radius": M.cursorborderradius,
                            "border-radius": M.cursorborderradius,
                        }),
                        d.addClass("nicescroll-cursors"),
                        (T.cursor = d);
                    var u = n(l.createElement("div"));
                    u.attr("id", T.id),
                        u.addClass("nicescroll-rails nicescroll-rails-vr");
                    var h,
                        p,
                        f = ["left", "right", "top", "bottom"];
                    for (var g in f)
                        (p = f[g]),
                        (h = M.railpadding[p] || 0) &&
                        u.css("padding-" + p, h + "px");
                    u.append(d),
                        (u.width = Math.max(
                            parseFloat(M.cursorwidth),
                            d.outerWidth()
                        )),
                        u.css({
                            width: u.width + "px",
                            zIndex: T.zindex,
                            background: M.background,
                            cursor: "default",
                        }),
                        (u.visibility = !0),
                        (u.scrollable = !0),
                        (u.align = "left" == M.railalign ? 0 : 1),
                        (T.rail = u),
                        (T.rail.drag = !1);
                    var v = !1;
                    !M.boxzoom ||
                        T.ispage ||
                        P.isieold ||
                        ((v = l.createElement("div")),
                            T.bind(v, "click", T.doZoom),
                            T.bind(v, "mouseenter", function() {
                                T.zoom.css("opacity", M.cursoropacitymax);
                            }),
                            T.bind(v, "mouseleave", function() {
                                T.zoom.css("opacity", M.cursoropacitymin);
                            }),
                            (T.zoom = n(v)),
                            T.zoom.css({
                                cursor: "pointer",
                                zIndex: T.zindex,
                                backgroundImage: "url(" + M.scriptpath + "zoomico.png)",
                                height: 18,
                                width: 18,
                                backgroundPosition: "0 0",
                            }),
                            M.dblclickzoom &&
                            T.bind(T.win, "dblclick", T.doZoom),
                            P.cantouch &&
                            M.gesturezoom &&
                            ((T.ongesturezoom = function(e) {
                                    return (
                                        e.scale > 1.5 && T.doZoomIn(e),
                                        e.scale < 0.8 && T.doZoomOut(e),
                                        T.cancelEvent(e)
                                    );
                                }),
                                T.bind(T.win, "gestureend", T.ongesturezoom))),
                        (T.railh = !1);
                    var w;
                    if (
                        (M.horizrailenabled &&
                            (T.css(i, { overflowX: "hidden" }),
                                (d = n(l.createElement("div"))).css({
                                    position: "absolute",
                                    top: 0,
                                    height: M.cursorwidth,
                                    width: 0,
                                    backgroundColor: M.cursorcolor,
                                    border: M.cursorborder,
                                    backgroundClip: "padding-box",
                                    "-webkit-border-radius": M.cursorborderradius,
                                    "-moz-border-radius": M.cursorborderradius,
                                    "border-radius": M.cursorborderradius,
                                }),
                                P.isieold && d.css("overflow", "hidden"),
                                d.addClass("nicescroll-cursors"),
                                (T.cursorh = d),
                                (w = n(l.createElement("div"))).attr(
                                    "id",
                                    T.id + "-hr"
                                ),
                                w.addClass(
                                    "nicescroll-rails nicescroll-rails-hr"
                                ),
                                (w.height = Math.max(
                                    parseFloat(M.cursorwidth),
                                    d.outerHeight()
                                )),
                                w.css({
                                    height: w.height + "px",
                                    zIndex: T.zindex,
                                    background: M.background,
                                }),
                                w.append(d),
                                (w.visibility = !0),
                                (w.scrollable = !0),
                                (w.align = "top" == M.railvalign ? 0 : 1),
                                (T.railh = w),
                                (T.railh.drag = !1)),
                            T.ispage)
                    )
                        u.css({
                            position: "fixed",
                            top: 0,
                            height: "100%",
                        }),
                        u.css(u.align ? { right: 0 } : { left: 0 }),
                        T.body.append(u),
                        T.railh &&
                        (w.css({
                                position: "fixed",
                                left: 0,
                                width: "100%",
                            }),
                            w.css(w.align ? { bottom: 0 } : { top: 0 }),
                            T.body.append(w));
                    else {
                        if (T.ishwscroll) {
                            "static" == T.win.css("position") &&
                                T.css(T.win, { position: "relative" });
                            var x =
                                "HTML" == T.win[0].nodeName ?
                                T.body :
                                T.win;
                            n(x).scrollTop(0).scrollLeft(0),
                                T.zoom &&
                                (T.zoom.css({
                                        position: "absolute",
                                        top: 1,
                                        right: 0,
                                        "margin-right": u.width + 4,
                                    }),
                                    x.append(T.zoom)),
                                u.css({ position: "absolute", top: 0 }),
                                u.css(u.align ? { right: 0 } : { left: 0 }),
                                x.append(u),
                                w &&
                                (w.css({
                                        position: "absolute",
                                        left: 0,
                                        bottom: 0,
                                    }),
                                    w.css(
                                        w.align ? { bottom: 0 } : { top: 0 }
                                    ),
                                    x.append(w));
                        } else {
                            T.isfixed = "fixed" == T.win.css("position");
                            var S = T.isfixed ? "fixed" : "absolute";
                            T.isfixed ||
                                (T.viewport = T.getViewport(T.win[0])),
                                T.viewport &&
                                ((T.body = T.viewport),
                                    /fixed|absolute/.test(
                                        T.viewport.css("position")
                                    ) ||
                                    T.css(T.viewport, {
                                        position: "relative",
                                    })),
                                u.css({ position: S }),
                                T.zoom && T.zoom.css({ position: S }),
                                T.updateScrollBar(),
                                T.body.append(u),
                                T.zoom && T.body.append(T.zoom),
                                T.railh &&
                                (w.css({ position: S }),
                                    T.body.append(w));
                        }
                        P.isios &&
                            T.css(T.win, {
                                "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
                                "-webkit-touch-callout": "none",
                            }),
                            M.disableoutline &&
                            (P.isie && T.win.attr("hideFocus", "true"),
                                P.iswebkit && T.win.css("outline", "none"));
                    }
                    if (
                        (!1 === M.autohidemode ?
                            ((T.autohidedom = !1),
                                T.rail.css({ opacity: M.cursoropacitymax }),
                                T.railh &&
                                T.railh.css({
                                    opacity: M.cursoropacitymax,
                                })) :
                            !0 === M.autohidemode ||
                            "leave" === M.autohidemode ?
                            ((T.autohidedom = n().add(T.rail)),
                                P.isie8 &&
                                (T.autohidedom = T.autohidedom.add(
                                    T.cursor
                                )),
                                T.railh &&
                                (T.autohidedom = T.autohidedom.add(
                                    T.railh
                                )),
                                T.railh &&
                                P.isie8 &&
                                (T.autohidedom = T.autohidedom.add(
                                    T.cursorh
                                ))) :
                            "scroll" == M.autohidemode ?
                            ((T.autohidedom = n().add(T.rail)),
                                T.railh &&
                                (T.autohidedom = T.autohidedom.add(
                                    T.railh
                                ))) :
                            "cursor" == M.autohidemode ?
                            ((T.autohidedom = n().add(T.cursor)),
                                T.railh &&
                                (T.autohidedom = T.autohidedom.add(
                                    T.cursorh
                                ))) :
                            "hidden" == M.autohidemode &&
                            ((T.autohidedom = !1),
                                T.hide(),
                                (T.railslocked = !1)),
                            P.cantouch ||
                            T.istouchcapable ||
                            M.emulatetouch ||
                            P.hasmstouch)
                    ) {
                        T.scrollmom = new y(T);
                        (T.ontouchstart = function(e) {
                            if (T.locked) return !1;
                            if (
                                e.pointerType &&
                                ("mouse" === e.pointerType ||
                                    e.pointerType ===
                                    e.MSPOINTER_TYPE_MOUSE)
                            )
                                return !1;
                            if (
                                ((T.hasmoving = !1),
                                    T.scrollmom.timer &&
                                    (T.triggerScrollEnd(),
                                        T.scrollmom.stop()), !T.railslocked)
                            ) {
                                var o = T.getTarget(e);
                                if (
                                    o &&
                                    /INPUT/i.test(o.nodeName) &&
                                    /range/i.test(o.type)
                                )
                                    return T.stopPropagation(e);
                                var t = "mousedown" === e.type;
                                if (
                                    (!("clientX" in e) &&
                                        "changedTouches" in e &&
                                        ((e.clientX =
                                                e.changedTouches[0].clientX),
                                            (e.clientY =
                                                e.changedTouches[0].clientY)),
                                        T.forcescreen)
                                ) {
                                    var r = e;
                                    ((e = {
                                        original: e.original ?
                                            e.original :
                                            e,
                                    }).clientX = r.screenX),
                                    (e.clientY = r.screenY);
                                }
                                if (
                                    ((T.rail.drag = {
                                            x: e.clientX,
                                            y: e.clientY,
                                            sx: T.scroll.x,
                                            sy: T.scroll.y,
                                            st: T.getScrollTop(),
                                            sl: T.getScrollLeft(),
                                            pt: 2,
                                            dl: !1,
                                            tg: o,
                                        }),
                                        T.ispage || !M.directionlockdeadzone)
                                )
                                    T.rail.drag.dl = "f";
                                else {
                                    var i = { w: c.width(), h: c.height() },
                                        s = T.getContentSize(),
                                        l = s.h - i.h,
                                        a = s.w - i.w;
                                    T.rail.scrollable && !T.railh.scrollable ?
                                        (T.rail.drag.ck = l > 0 && "v") :
                                        !T.rail.scrollable &&
                                        T.railh.scrollable ?
                                        (T.rail.drag.ck = a > 0 && "h") :
                                        (T.rail.drag.ck = !1);
                                }
                                if (
                                    M.emulatetouch &&
                                    T.isiframe &&
                                    P.isie
                                ) {
                                    var d = T.win.position();
                                    (T.rail.drag.x += d.left),
                                    (T.rail.drag.y += d.top);
                                }
                                if (
                                    ((T.hasmoving = !1),
                                        (T.lastmouseup = !1),
                                        T.scrollmom.reset(e.clientX, e.clientY),
                                        o && t)
                                ) {
                                    if (!/INPUT|SELECT|BUTTON|TEXTAREA/i.test(
                                            o.nodeName
                                        ))
                                        return (
                                            P.hasmousecapture &&
                                            o.setCapture(),
                                            M.emulatetouch ?
                                            (o.onclick &&
                                                !o._onclick &&
                                                ((o._onclick =
                                                        o.onclick),
                                                    (o.onclick =
                                                        function(e) {
                                                            if (
                                                                T.hasmoving
                                                            )
                                                                return !1;
                                                            o._onclick.call(
                                                                this,
                                                                e
                                                            );
                                                        })),
                                                T.cancelEvent(e)) :
                                            T.stopPropagation(e)
                                        );
                                    /SUBMIT|CANCEL|BUTTON/i.test(
                                            n(o).attr("type")
                                        ) &&
                                        (T.preventclick = {
                                            tg: o,
                                            click: !1,
                                        });
                                }
                            }
                        }),
                        (T.ontouchend = function(e) {
                            if (!T.rail.drag) return !0;
                            if (2 == T.rail.drag.pt) {
                                if (
                                    e.pointerType &&
                                    ("mouse" === e.pointerType ||
                                        e.pointerType ===
                                        e.MSPOINTER_TYPE_MOUSE)
                                )
                                    return !1;
                                T.rail.drag = !1;
                                var o = "mouseup" === e.type;
                                if (
                                    T.hasmoving &&
                                    (T.scrollmom.doMomentum(),
                                        (T.lastmouseup = !0),
                                        T.hideCursor(),
                                        P.hasmousecapture &&
                                        l.releaseCapture(),
                                        o)
                                )
                                    return T.cancelEvent(e);
                            } else if (1 == T.rail.drag.pt)
                                return T.onmouseup(e);
                        });
                        var z =
                            M.emulatetouch &&
                            T.isiframe &&
                            !P.hasmousecapture,
                            k = (0.3 * M.directionlockdeadzone) | 0;
                        (T.ontouchmove = function(e, o) {
                            if (!T.rail.drag) return !0;
                            if (
                                e.targetTouches &&
                                M.preventmultitouchscrolling &&
                                e.targetTouches.length > 1
                            )
                                return !0;
                            if (
                                e.pointerType &&
                                ("mouse" === e.pointerType ||
                                    e.pointerType ===
                                    e.MSPOINTER_TYPE_MOUSE)
                            )
                                return !0;
                            if (2 == T.rail.drag.pt) {
                                "changedTouches" in e &&
                                    ((e.clientX =
                                            e.changedTouches[0].clientX),
                                        (e.clientY =
                                            e.changedTouches[0].clientY));
                                var t, r;
                                if (((r = t = 0), z && !o)) {
                                    var i = T.win.position();
                                    (r = -i.left), (t = -i.top);
                                }
                                var s = e.clientY + t,
                                    n = s - T.rail.drag.y,
                                    a = e.clientX + r,
                                    c = a - T.rail.drag.x,
                                    d = T.rail.drag.st - n;
                                if (T.ishwscroll && M.bouncescroll)
                                    d < 0 ?
                                    (d = Math.round(d / 2)) :
                                    d > T.page.maxh &&
                                    (d =
                                        T.page.maxh +
                                        Math.round(
                                            (d - T.page.maxh) / 2
                                        ));
                                else if (
                                    (d < 0 ?
                                        ((d = 0), (s = 0)) :
                                        d > T.page.maxh &&
                                        ((d = T.page.maxh), (s = 0)),
                                        0 === s && !T.hasmoving)
                                )
                                    return (
                                        T.ispage || (T.rail.drag = !1), !0
                                    );
                                var u = T.getScrollLeft();
                                if (
                                    (T.railh &&
                                        T.railh.scrollable &&
                                        ((u = T.isrtlmode ?
                                                c - T.rail.drag.sl :
                                                T.rail.drag.sl - c),
                                            T.ishwscroll && M.bouncescroll ?
                                            u < 0 ?
                                            (u = Math.round(u / 2)) :
                                            u > T.page.maxw &&
                                            (u =
                                                T.page.maxw +
                                                Math.round(
                                                    (u -
                                                        T.page.maxw) /
                                                    2
                                                )) :
                                            (u < 0 && ((u = 0), (a = 0)),
                                                u > T.page.maxw &&
                                                ((u = T.page.maxw),
                                                    (a = 0)))), !T.hasmoving)
                                ) {
                                    if (
                                        T.rail.drag.y === e.clientY &&
                                        T.rail.drag.x === e.clientX
                                    )
                                        return T.cancelEvent(e);
                                    var h = Math.abs(n),
                                        p = Math.abs(c),
                                        m = M.directionlockdeadzone;
                                    if (
                                        (T.rail.drag.ck ?
                                            "v" == T.rail.drag.ck ?
                                            p > m && h <= k ?
                                            (T.rail.drag = !1) :
                                            h > m &&
                                            (T.rail.drag.dl = "v") :
                                            "h" == T.rail.drag.ck &&
                                            (h > m && p <= k ?
                                                (T.rail.drag = !1) :
                                                p > m &&
                                                (T.rail.drag.dl =
                                                    "h")) :
                                            h > m && p > m ?
                                            (T.rail.drag.dl = "f") :
                                            h > m ?
                                            (T.rail.drag.dl =
                                                p > k ? "f" : "v") :
                                            p > m &&
                                            (T.rail.drag.dl =
                                                h > k ? "f" : "h"), !T.rail.drag.dl)
                                    )
                                        return T.cancelEvent(e);
                                    T.triggerScrollStart(
                                            e.clientX,
                                            e.clientY,
                                            0,
                                            0,
                                            0
                                        ),
                                        (T.hasmoving = !0);
                                }
                                return (
                                    T.preventclick &&
                                    !T.preventclick.click &&
                                    ((T.preventclick.click =
                                            T.preventclick.tg.onclick ||
                                            !1),
                                        (T.preventclick.tg.onclick =
                                            T.onpreventclick)),
                                    T.rail.drag.dl &&
                                    ("v" == T.rail.drag.dl ?
                                        (u = T.rail.drag.sl) :
                                        "h" == T.rail.drag.dl &&
                                        (d = T.rail.drag.st)),
                                    T.synched("touchmove", function() {
                                        T.rail.drag &&
                                            2 == T.rail.drag.pt &&
                                            (T.prepareTransition &&
                                                T.resetTransition(),
                                                T.rail.scrollable &&
                                                T.setScrollTop(d),
                                                T.scrollmom.update(a, s),
                                                T.railh && T.railh.scrollable ?
                                                (T.setScrollLeft(u),
                                                    T.showCursor(d, u)) :
                                                T.showCursor(d),
                                                P.isie10 &&
                                                l.selection.clear());
                                    }),
                                    T.cancelEvent(e)
                                );
                            }
                            return 1 == T.rail.drag.pt ?
                                T.onmousemove(e) :
                                void 0;
                        }),
                        (T.ontouchstartCursor = function(e, o) {
                            if (!T.rail.drag || 3 == T.rail.drag.pt) {
                                if (T.locked) return T.cancelEvent(e);
                                T.cancelScroll(),
                                    (T.rail.drag = {
                                        x: e.touches[0].clientX,
                                        y: e.touches[0].clientY,
                                        sx: T.scroll.x,
                                        sy: T.scroll.y,
                                        pt: 3,
                                        hr: !!o,
                                    });
                                var t = T.getTarget(e);
                                return (!T.ispage &&
                                    P.hasmousecapture &&
                                    t.setCapture(),
                                    T.isiframe &&
                                    !P.hasmousecapture &&
                                    ((T.saved.csspointerevents =
                                            T.doc.css(
                                                "pointer-events"
                                            )),
                                        T.css(T.doc, {
                                            "pointer-events": "none",
                                        })),
                                    T.cancelEvent(e)
                                );
                            }
                        }),
                        (T.ontouchendCursor = function(e) {
                            if (T.rail.drag) {
                                if (
                                    (P.hasmousecapture &&
                                        l.releaseCapture(),
                                        T.isiframe &&
                                        !P.hasmousecapture &&
                                        T.doc.css(
                                            "pointer-events",
                                            T.saved.csspointerevents
                                        ),
                                        3 != T.rail.drag.pt)
                                )
                                    return;
                                return (
                                    (T.rail.drag = !1), T.cancelEvent(e)
                                );
                            }
                        }),
                        (T.ontouchmoveCursor = function(e) {
                            if (T.rail.drag) {
                                if (3 != T.rail.drag.pt) return;
                                if (
                                    ((T.cursorfreezed = !0),
                                        T.rail.drag.hr)
                                ) {
                                    (T.scroll.x =
                                        T.rail.drag.sx +
                                        (e.touches[0].clientX -
                                            T.rail.drag.x)),
                                    T.scroll.x < 0 &&
                                        (T.scroll.x = 0);
                                    var o = T.scrollvaluemaxw;
                                    T.scroll.x > o && (T.scroll.x = o);
                                } else {
                                    (T.scroll.y =
                                        T.rail.drag.sy +
                                        (e.touches[0].clientY -
                                            T.rail.drag.y)),
                                    T.scroll.y < 0 &&
                                        (T.scroll.y = 0);
                                    var t = T.scrollvaluemax;
                                    T.scroll.y > t && (T.scroll.y = t);
                                }
                                return (
                                    T.synched("touchmove", function() {
                                        T.rail.drag &&
                                            3 == T.rail.drag.pt &&
                                            (T.showCursor(),
                                                T.rail.drag.hr ?
                                                T.doScrollLeft(
                                                    Math.round(
                                                        T.scroll.x *
                                                        T
                                                        .scrollratio
                                                        .x
                                                    ),
                                                    M.cursordragspeed
                                                ) :
                                                T.doScrollTop(
                                                    Math.round(
                                                        T.scroll.y *
                                                        T
                                                        .scrollratio
                                                        .y
                                                    ),
                                                    M.cursordragspeed
                                                ));
                                    }),
                                    T.cancelEvent(e)
                                );
                            }
                        });
                    }
                    if (
                        ((T.onmousedown = function(e, o) {
                                if (!T.rail.drag || 1 == T.rail.drag.pt) {
                                    if (T.railslocked) return T.cancelEvent(e);
                                    T.cancelScroll(),
                                        (T.rail.drag = {
                                            x: e.clientX,
                                            y: e.clientY,
                                            sx: T.scroll.x,
                                            sy: T.scroll.y,
                                            pt: 1,
                                            hr: o || !1,
                                        });
                                    var t = T.getTarget(e);
                                    return (
                                        P.hasmousecapture && t.setCapture(),
                                        T.isiframe &&
                                        !P.hasmousecapture &&
                                        ((T.saved.csspointerevents =
                                                T.doc.css("pointer-events")),
                                            T.css(T.doc, {
                                                "pointer-events": "none",
                                            })),
                                        (T.hasmoving = !1),
                                        T.cancelEvent(e)
                                    );
                                }
                            }),
                            (T.onmouseup = function(e) {
                                if (T.rail.drag)
                                    return (
                                        1 != T.rail.drag.pt ||
                                        (P.hasmousecapture &&
                                            l.releaseCapture(),
                                            T.isiframe &&
                                            !P.hasmousecapture &&
                                            T.doc.css(
                                                "pointer-events",
                                                T.saved.csspointerevents
                                            ),
                                            (T.rail.drag = !1),
                                            (T.cursorfreezed = !1),
                                            T.hasmoving && T.triggerScrollEnd(),
                                            T.cancelEvent(e))
                                    );
                            }),
                            (T.onmousemove = function(e) {
                                if (T.rail.drag) {
                                    if (1 !== T.rail.drag.pt) return;
                                    if (P.ischrome && 0 === e.which)
                                        return T.onmouseup(e);
                                    if (
                                        ((T.cursorfreezed = !0),
                                            T.hasmoving ||
                                            T.triggerScrollStart(
                                                e.clientX,
                                                e.clientY,
                                                0,
                                                0,
                                                0
                                            ),
                                            (T.hasmoving = !0),
                                            T.rail.drag.hr)
                                    ) {
                                        (T.scroll.x =
                                            T.rail.drag.sx +
                                            (e.clientX - T.rail.drag.x)),
                                        T.scroll.x < 0 && (T.scroll.x = 0);
                                        var o = T.scrollvaluemaxw;
                                        T.scroll.x > o && (T.scroll.x = o);
                                    } else {
                                        (T.scroll.y =
                                            T.rail.drag.sy +
                                            (e.clientY - T.rail.drag.y)),
                                        T.scroll.y < 0 && (T.scroll.y = 0);
                                        var t = T.scrollvaluemax;
                                        T.scroll.y > t && (T.scroll.y = t);
                                    }
                                    return (
                                        T.synched("mousemove", function() {
                                            T.cursorfreezed &&
                                                (T.showCursor(),
                                                    T.rail.drag.hr ?
                                                    T.scrollLeft(
                                                        Math.round(
                                                            T.scroll.x *
                                                            T.scrollratio
                                                            .x
                                                        )
                                                    ) :
                                                    T.scrollTop(
                                                        Math.round(
                                                            T.scroll.y *
                                                            T.scrollratio
                                                            .y
                                                        )
                                                    ));
                                        }),
                                        T.cancelEvent(e)
                                    );
                                }
                                T.checkarea = 0;
                            }),
                            P.cantouch || M.emulatetouch)
                    )
                        (T.onpreventclick = function(e) {
                            if (T.preventclick)
                                return (
                                    (T.preventclick.tg.onclick =
                                        T.preventclick.click),
                                    (T.preventclick = !1),
                                    T.cancelEvent(e)
                                );
                        }),
                        (T.onclick = !P.isios &&
                            function(e) {
                                return (!T.lastmouseup ||
                                    ((T.lastmouseup = !1),
                                        T.cancelEvent(e))
                                );
                            }),
                        M.grabcursorenabled &&
                        P.cursorgrabvalue &&
                        (T.css(T.ispage ? T.doc : T.win, {
                                cursor: P.cursorgrabvalue,
                            }),
                            T.css(T.rail, {
                                cursor: P.cursorgrabvalue,
                            }));
                    else {
                        var L = function(e) {
                            if (T.selectiondrag) {
                                if (e) {
                                    var o = T.win.outerHeight(),
                                        t = e.pageY - T.selectiondrag.top;
                                    t > 0 && t < o && (t = 0),
                                        t >= o && (t -= o),
                                        (T.selectiondrag.df = t);
                                }
                                if (0 !== T.selectiondrag.df) {
                                    var r =
                                        ((-2 * T.selectiondrag.df) / 6) | 0;
                                    T.doScrollBy(r),
                                        T.debounced(
                                            "doselectionscroll",
                                            function() {
                                                L();
                                            },
                                            50
                                        );
                                }
                            }
                        };
                        (T.hasTextSelected =
                            "getSelection" in l ?

                            function() {
                                return (
                                    l.getSelection().rangeCount > 0
                                );
                            } :
                            "selection" in l ?

                            function() {
                                return "None" != l.selection.type;
                            } :
                            function() {
                                return !1;
                            }),
                        (T.onselectionstart = function(e) {
                            T.ispage ||
                                (T.selectiondrag = T.win.offset());
                        }),
                        (T.onselectionend = function(e) {
                            T.selectiondrag = !1;
                        }),
                        (T.onselectiondrag = function(e) {
                            T.selectiondrag &&
                                T.hasTextSelected() &&
                                T.debounced(
                                    "selectionscroll",
                                    function() {
                                        L(e);
                                    },
                                    250
                                );
                        });
                    }
                    if (
                        (P.hasw3ctouch ?
                            (T.css(T.ispage ? n("html") : T.win, {
                                    "touch-action": "none",
                                }),
                                T.css(T.rail, { "touch-action": "none" }),
                                T.css(T.cursor, { "touch-action": "none" }),
                                T.bind(T.win, "pointerdown", T.ontouchstart),
                                T.bind(l, "pointerup", T.ontouchend),
                                T.delegate(l, "pointermove", T.ontouchmove)) :
                            P.hasmstouch ?
                            (T.css(T.ispage ? n("html") : T.win, {
                                    "-ms-touch-action": "none",
                                }),
                                T.css(T.rail, { "-ms-touch-action": "none" }),
                                T.css(T.cursor, {
                                    "-ms-touch-action": "none",
                                }),
                                T.bind(
                                    T.win,
                                    "MSPointerDown",
                                    T.ontouchstart
                                ),
                                T.bind(l, "MSPointerUp", T.ontouchend),
                                T.delegate(l, "MSPointerMove", T.ontouchmove),
                                T.bind(
                                    T.cursor,
                                    "MSGestureHold",
                                    function(e) {
                                        e.preventDefault();
                                    }
                                ),
                                T.bind(T.cursor, "contextmenu", function(e) {
                                    e.preventDefault();
                                })) :
                            P.cantouch &&
                            (T.bind(
                                    T.win,
                                    "touchstart",
                                    T.ontouchstart, !1, !0
                                ),
                                T.bind(l, "touchend", T.ontouchend, !1, !0),
                                T.bind(
                                    l,
                                    "touchcancel",
                                    T.ontouchend, !1, !0
                                ),
                                T.delegate(
                                    l,
                                    "touchmove",
                                    T.ontouchmove, !1, !0
                                )),
                            M.emulatetouch &&
                            (T.bind(
                                    T.win,
                                    "mousedown",
                                    T.ontouchstart, !1, !0
                                ),
                                T.bind(l, "mouseup", T.ontouchend, !1, !0),
                                T.bind(l, "mousemove", T.ontouchmove, !1, !0)),
                            (M.cursordragontouch ||
                                (!P.cantouch && !M.emulatetouch)) &&
                            (T.rail.css({ cursor: "default" }),
                                T.railh && T.railh.css({ cursor: "default" }),
                                T.jqbind(T.rail, "mouseenter", function() {
                                    if (!T.ispage && !T.win.is(":visible"))
                                        return !1;
                                    T.canshowonmouseevent && T.showCursor(),
                                        (T.rail.active = !0);
                                }),
                                T.jqbind(T.rail, "mouseleave", function() {
                                    (T.rail.active = !1),
                                    T.rail.drag || T.hideCursor();
                                }),
                                M.sensitiverail &&
                                (T.bind(T.rail, "click", function(e) {
                                        T.doRailClick(e, !1, !1);
                                    }),
                                    T.bind(T.rail, "dblclick", function(e) {
                                        T.doRailClick(e, !0, !1);
                                    }),
                                    T.bind(T.cursor, "click", function(e) {
                                        T.cancelEvent(e);
                                    }),
                                    T.bind(T.cursor, "dblclick", function(e) {
                                        T.cancelEvent(e);
                                    })),
                                T.railh &&
                                (T.jqbind(
                                        T.railh,
                                        "mouseenter",
                                        function() {
                                            if (!T.ispage &&
                                                !T.win.is(":visible")
                                            )
                                                return !1;
                                            T.canshowonmouseevent &&
                                                T.showCursor(),
                                                (T.rail.active = !0);
                                        }
                                    ),
                                    T.jqbind(
                                        T.railh,
                                        "mouseleave",
                                        function() {
                                            (T.rail.active = !1),
                                            T.rail.drag || T.hideCursor();
                                        }
                                    ),
                                    M.sensitiverail &&
                                    (T.bind(T.railh, "click", function(e) {
                                            T.doRailClick(e, !1, !0);
                                        }),
                                        T.bind(
                                            T.railh,
                                            "dblclick",
                                            function(e) {
                                                T.doRailClick(e, !0, !0);
                                            }
                                        ),
                                        T.bind(
                                            T.cursorh,
                                            "click",
                                            function(e) {
                                                T.cancelEvent(e);
                                            }
                                        ),
                                        T.bind(
                                            T.cursorh,
                                            "dblclick",
                                            function(e) {
                                                T.cancelEvent(e);
                                            }
                                        )))),
                            M.cursordragontouch &&
                            (this.istouchcapable || P.cantouch) &&
                            (T.bind(
                                    T.cursor,
                                    "touchstart",
                                    T.ontouchstartCursor
                                ),
                                T.bind(
                                    T.cursor,
                                    "touchmove",
                                    T.ontouchmoveCursor
                                ),
                                T.bind(
                                    T.cursor,
                                    "touchend",
                                    T.ontouchendCursor
                                ),
                                T.cursorh &&
                                T.bind(
                                    T.cursorh,
                                    "touchstart",
                                    function(e) {
                                        T.ontouchstartCursor(e, !0);
                                    }
                                ),
                                T.cursorh &&
                                T.bind(
                                    T.cursorh,
                                    "touchmove",
                                    T.ontouchmoveCursor
                                ),
                                T.cursorh &&
                                T.bind(
                                    T.cursorh,
                                    "touchend",
                                    T.ontouchendCursor
                                )),
                            M.emulatetouch || P.isandroid || P.isios ?
                            (T.bind(
                                    P.hasmousecapture ? T.win : l,
                                    "mouseup",
                                    T.ontouchend
                                ),
                                T.onclick && T.bind(l, "click", T.onclick),
                                M.cursordragontouch ?
                                (T.bind(
                                        T.cursor,
                                        "mousedown",
                                        T.onmousedown
                                    ),
                                    T.bind(
                                        T.cursor,
                                        "mouseup",
                                        T.onmouseup
                                    ),
                                    T.cursorh &&
                                    T.bind(
                                        T.cursorh,
                                        "mousedown",
                                        function(e) {
                                            T.onmousedown(e, !0);
                                        }
                                    ),
                                    T.cursorh &&
                                    T.bind(
                                        T.cursorh,
                                        "mouseup",
                                        T.onmouseup
                                    )) :
                                (T.bind(
                                        T.rail,
                                        "mousedown",
                                        function(e) {
                                            e.preventDefault();
                                        }
                                    ),
                                    T.railh &&
                                    T.bind(
                                        T.railh,
                                        "mousedown",
                                        function(e) {
                                            e.preventDefault();
                                        }
                                    ))) :
                            (T.bind(
                                    P.hasmousecapture ? T.win : l,
                                    "mouseup",
                                    T.onmouseup
                                ),
                                T.bind(l, "mousemove", T.onmousemove),
                                T.onclick && T.bind(l, "click", T.onclick),
                                T.bind(T.cursor, "mousedown", T.onmousedown),
                                T.bind(T.cursor, "mouseup", T.onmouseup),
                                T.railh &&
                                (T.bind(
                                        T.cursorh,
                                        "mousedown",
                                        function(e) {
                                            T.onmousedown(e, !0);
                                        }
                                    ),
                                    T.bind(
                                        T.cursorh,
                                        "mouseup",
                                        T.onmouseup
                                    )), !T.ispage &&
                                M.enablescrollonselection &&
                                (T.bind(
                                        T.win[0],
                                        "mousedown",
                                        T.onselectionstart
                                    ),
                                    T.bind(l, "mouseup", T.onselectionend),
                                    T.bind(
                                        T.cursor,
                                        "mouseup",
                                        T.onselectionend
                                    ),
                                    T.cursorh &&
                                    T.bind(
                                        T.cursorh,
                                        "mouseup",
                                        T.onselectionend
                                    ),
                                    T.bind(
                                        l,
                                        "mousemove",
                                        T.onselectiondrag
                                    )),
                                T.zoom &&
                                (T.jqbind(
                                        T.zoom,
                                        "mouseenter",
                                        function() {
                                            T.canshowonmouseevent &&
                                                T.showCursor(),
                                                (T.rail.active = !0);
                                        }
                                    ),
                                    T.jqbind(
                                        T.zoom,
                                        "mouseleave",
                                        function() {
                                            (T.rail.active = !1),
                                            T.rail.drag || T.hideCursor();
                                        }
                                    ))),
                            M.enablemousewheel &&
                            (T.isiframe ||
                                T.mousewheel(
                                    P.isie && T.ispage ? l : T.win,
                                    T.onmousewheel
                                ),
                                T.mousewheel(T.rail, T.onmousewheel),
                                T.railh &&
                                T.mousewheel(T.railh, T.onmousewheelhr)),
                            T.ispage ||
                            P.cantouch ||
                            /HTML|^BODY/.test(T.win[0].nodeName) ||
                            (T.win.attr("tabindex") ||
                                T.win.attr({ tabindex: ++r }),
                                T.bind(T.win, "focus", function(e) {
                                    (o =
                                        T.getTarget(e).id ||
                                        T.getTarget(e) ||
                                        !1),
                                    (T.hasfocus = !0),
                                    T.canshowonmouseevent &&
                                        T.noticeCursor();
                                }),
                                T.bind(T.win, "blur", function(e) {
                                    (o = !1), (T.hasfocus = !1);
                                }),
                                T.bind(T.win, "mouseenter", function(e) {
                                    (t =
                                        T.getTarget(e).id ||
                                        T.getTarget(e) ||
                                        !1),
                                    (T.hasmousefocus = !0),
                                    T.canshowonmouseevent &&
                                        T.noticeCursor();
                                }),
                                T.bind(T.win, "mouseleave", function(e) {
                                    (t = !1),
                                    (T.hasmousefocus = !1),
                                    T.rail.drag || T.hideCursor();
                                })),
                            (T.onkeypress = function(e) {
                                if (T.railslocked && 0 === T.page.maxh)
                                    return !0;
                                e = e || a.event;
                                var r = T.getTarget(e);
                                if (
                                    r &&
                                    /INPUT|TEXTAREA|SELECT|OPTION/.test(
                                        r.nodeName
                                    ) &&
                                    (!(
                                            r.getAttribute("type") ||
                                            r.type ||
                                            !1
                                        ) ||
                                        !/submit|button|cancel/i.tp)
                                )
                                    return !0;
                                if (n(r).attr("contenteditable")) return !0;
                                if (
                                    T.hasfocus ||
                                    (T.hasmousefocus && !o) ||
                                    (T.ispage && !o && !t)
                                ) {
                                    var i = e.keyCode;
                                    if (T.railslocked && 27 != i)
                                        return T.cancelEvent(e);
                                    var s = e.ctrlKey || !1,
                                        l = e.shiftKey || !1,
                                        c = !1;
                                    switch (i) {
                                        case 38:
                                        case 63233:
                                            T.doScrollBy(72), (c = !0);
                                            break;
                                        case 40:
                                        case 63235:
                                            T.doScrollBy(-72), (c = !0);
                                            break;
                                        case 37:
                                        case 63232:
                                            T.railh &&
                                                (s ?
                                                    T.doScrollLeft(0) :
                                                    T.doScrollLeftBy(72),
                                                    (c = !0));
                                            break;
                                        case 39:
                                        case 63234:
                                            T.railh &&
                                                (s ?
                                                    T.doScrollLeft(
                                                        T.page.maxw
                                                    ) :
                                                    T.doScrollLeftBy(-72),
                                                    (c = !0));
                                            break;
                                        case 33:
                                        case 63276:
                                            T.doScrollBy(T.view.h), (c = !0);
                                            break;
                                        case 34:
                                        case 63277:
                                            T.doScrollBy(-T.view.h), (c = !0);
                                            break;
                                        case 36:
                                        case 63273:
                                            T.railh && s ?
                                                T.doScrollPos(0, 0) :
                                                T.doScrollTo(0),
                                                (c = !0);
                                            break;
                                        case 35:
                                        case 63275:
                                            T.railh && s ?
                                                T.doScrollPos(
                                                    T.page.maxw,
                                                    T.page.maxh
                                                ) :
                                                T.doScrollTo(T.page.maxh),
                                                (c = !0);
                                            break;
                                        case 32:
                                            M.spacebarenabled &&
                                                (l ?
                                                    T.doScrollBy(T.view.h) :
                                                    T.doScrollBy(-T.view.h),
                                                    (c = !0));
                                            break;
                                        case 27:
                                            T.zoomactive &&
                                                (T.doZoom(), (c = !0));
                                    }
                                    if (c) return T.cancelEvent(e);
                                }
                            }),
                            M.enablekeyboard &&
                            T.bind(
                                l,
                                P.isopera && !P.isopera12 ?
                                "keypress" :
                                "keydown",
                                T.onkeypress
                            ),
                            T.bind(l, "keydown", function(e) {
                                (e.ctrlKey || !1) && (T.wheelprevented = !0);
                            }),
                            T.bind(l, "keyup", function(e) {
                                e.ctrlKey || !1 || (T.wheelprevented = !1);
                            }),
                            T.bind(a, "blur", function(e) {
                                T.wheelprevented = !1;
                            }),
                            T.bind(a, "resize", T.onscreenresize),
                            T.bind(a, "orientationchange", T.onscreenresize),
                            T.bind(a, "load", T.lazyResize),
                            P.ischrome && !T.ispage && !T.haswrapper)
                    ) {
                        var C = T.win.attr("style"),
                            N = parseFloat(T.win.css("width")) + 1;
                        T.win.css("width", N),
                            T.synched("chromefix", function() {
                                T.win.attr("style", C);
                            });
                    }
                    if (
                        ((T.onAttributeChange = function(e) {
                                T.lazyResize(T.isieold ? 250 : 30);
                            }),
                            M.enableobserver &&
                            (T.isie11 ||
                                !1 === m ||
                                ((T.observerbody = new m(function(e) {
                                        if (
                                            (e.forEach(function(e) {
                                                    if ("attributes" == e.type)
                                                        return E.hasClass(
                                                                "modal-open"
                                                            ) &&
                                                            E.hasClass(
                                                                "modal-dialog"
                                                            ) &&
                                                            !n.contains(
                                                                n(
                                                                    ".modal-dialog"
                                                                )[0],
                                                                T.doc[0]
                                                            ) ?
                                                            T.hide() :
                                                            T.show();
                                                }),
                                                T.me.clientWidth != T.page.width ||
                                                T.me.clientHeight !=
                                                T.page.height)
                                        )
                                            return T.lazyResize(30);
                                    })),
                                    T.observerbody.observe(l.body, {
                                        childList: !0,
                                        subtree: !0,
                                        characterData: !1,
                                        attributes: !0,
                                        attributeFilter: ["class"],
                                    })), !T.ispage && !T.haswrapper))
                    ) {
                        var R = T.win[0];
                        !1 !== m ?
                            ((T.observer = new m(function(e) {
                                    e.forEach(T.onAttributeChange);
                                })),
                                T.observer.observe(R, {
                                    childList: !0,
                                    characterData: !1,
                                    attributes: !0,
                                    subtree: !1,
                                }),
                                (T.observerremover = new m(function(e) {
                                    e.forEach(function(e) {
                                        if (e.removedNodes.length > 0)
                                            for (var o in e.removedNodes)
                                                if (
                                                    T &&
                                                    e.removedNodes[o] === R
                                                )
                                                    return T.remove();
                                    });
                                })),
                                T.observerremover.observe(R.parentNode, {
                                    childList: !0,
                                    characterData: !1,
                                    attributes: !1,
                                    subtree: !1,
                                })) :
                            (T.bind(
                                    R,
                                    P.isie && !P.isie9 ?
                                    "propertychange" :
                                    "DOMAttrModified",
                                    T.onAttributeChange
                                ),
                                P.isie9 &&
                                R.attachEvent(
                                    "onpropertychange",
                                    T.onAttributeChange
                                ),
                                T.bind(R, "DOMNodeRemoved", function(e) {
                                    e.target === R && T.remove();
                                }));
                    }!T.ispage &&
                        M.boxzoom &&
                        T.bind(a, "resize", T.resizeZoom),
                        T.istextarea &&
                        (T.bind(T.win, "keydown", T.lazyResize),
                            T.bind(T.win, "mouseup", T.lazyResize)),
                        T.lazyResize(30);
                }
                if ("IFRAME" == this.doc[0].nodeName) {
                    var _ = function() {
                        T.iframexd = !1;
                        var o;
                        try {
                            (o =
                                "contentDocument" in this ?
                                this.contentDocument :
                                this.contentWindow._doc).domain;
                        } catch (e) {
                            (T.iframexd = !0), (o = !1);
                        }
                        if (T.iframexd)
                            return (
                                "console" in a &&
                                console.log(
                                    "NiceScroll error: policy restriced iframe"
                                ), !0
                            );
                        if (
                            ((T.forcescreen = !0),
                                T.isiframe &&
                                ((T.iframe = {
                                        doc: n(o),
                                        html: T.doc.contents().find("html")[0],
                                        body: T.doc.contents().find("body")[0],
                                    }),
                                    (T.getContentSize = function() {
                                        return {
                                            w: Math.max(
                                                T.iframe.html.scrollWidth,
                                                T.iframe.body.scrollWidth
                                            ),
                                            h: Math.max(
                                                T.iframe.html.scrollHeight,
                                                T.iframe.body.scrollHeight
                                            ),
                                        };
                                    }),
                                    (T.docscroll = n(T.iframe.body))), !P.isios && M.iframeautoresize && !T.isiframe)
                        ) {
                            T.win.scrollTop(0), T.doc.height("");
                            var t = Math.max(
                                o.getElementsByTagName("html")[0]
                                .scrollHeight,
                                o.body.scrollHeight
                            );
                            T.doc.height(t);
                        }
                        T.lazyResize(30),
                            T.css(n(T.iframe.body), e),
                            P.isios &&
                            T.haswrapper &&
                            T.css(n(o.body), {
                                "-webkit-transform": "translate3d(0,0,0)",
                            }),
                            "contentWindow" in this ?
                            T.bind(
                                this.contentWindow,
                                "scroll",
                                T.onscroll
                            ) :
                            T.bind(o, "scroll", T.onscroll),
                            M.enablemousewheel &&
                            T.mousewheel(o, T.onmousewheel),
                            M.enablekeyboard &&
                            T.bind(
                                o,
                                P.isopera ? "keypress" : "keydown",
                                T.onkeypress
                            ),
                            P.cantouch ?
                            (T.bind(o, "touchstart", T.ontouchstart),
                                T.bind(o, "touchmove", T.ontouchmove)) :
                            M.emulatetouch &&
                            (T.bind(o, "mousedown", T.ontouchstart),
                                T.bind(o, "mousemove", function(e) {
                                    return T.ontouchmove(e, !0);
                                }),
                                M.grabcursorenabled &&
                                P.cursorgrabvalue &&
                                T.css(n(o.body), {
                                    cursor: P.cursorgrabvalue,
                                })),
                            T.bind(o, "mouseup", T.ontouchend),
                            T.zoom &&
                            (M.dblclickzoom &&
                                T.bind(o, "dblclick", T.doZoom),
                                T.ongesturezoom &&
                                T.bind(
                                    o,
                                    "gestureend",
                                    T.ongesturezoom
                                ));
                    };
                    this.doc[0].readyState &&
                        "complete" === this.doc[0].readyState &&
                        setTimeout(function() {
                            _.call(T.doc[0], !1);
                        }, 500),
                        T.bind(this.doc, "load", _);
                }
            }),
            (this.showCursor = function(e, o) {
                if (
                    (T.cursortimeout &&
                        (clearTimeout(T.cursortimeout),
                            (T.cursortimeout = 0)),
                        T.rail)
                ) {
                    if (
                        (T.autohidedom &&
                            (T.autohidedom
                                .stop()
                                .css({ opacity: M.cursoropacitymax }),
                                (T.cursoractive = !0)),
                            (T.rail.drag && 1 == T.rail.drag.pt) ||
                            (void 0 !== e &&
                                !1 !== e &&
                                (T.scroll.y = (e / T.scrollratio.y) | 0),
                                void 0 !== o &&
                                (T.scroll.x = (o / T.scrollratio.x) | 0)),
                            T.cursor.css({
                                height: T.cursorheight,
                                top: T.scroll.y,
                            }),
                            T.cursorh)
                    ) {
                        var t = T.hasreversehr ?
                            T.scrollvaluemaxw - T.scroll.x :
                            T.scroll.x;
                        T.cursorh.css({
                                width: T.cursorwidth,
                                left:
                                    !T.rail.align && T.rail.visibility ?
                                    t + T.rail.width :
                                    t,
                            }),
                            (T.cursoractive = !0);
                    }
                    T.zoom &&
                        T.zoom.stop().css({ opacity: M.cursoropacitymax });
                }
            }),
            (this.hideCursor = function(e) {
                T.cursortimeout ||
                    (T.rail &&
                        T.autohidedom &&
                        ((T.hasmousefocus && "leave" === M.autohidemode) ||
                            (T.cursortimeout = setTimeout(function() {
                                (T.rail.active && T.showonmouseevent) ||
                                (T.autohidedom
                                    .stop()
                                    .animate({
                                        opacity: M.cursoropacitymin,
                                    }),
                                    T.zoom &&
                                    T.zoom
                                    .stop()
                                    .animate({
                                        opacity: M.cursoropacitymin,
                                    }),
                                    (T.cursoractive = !1)),
                                (T.cursortimeout = 0);
                            }, e || M.hidecursordelay))));
            }),
            (this.noticeCursor = function(e, o, t) {
                T.showCursor(o, t), T.rail.active || T.hideCursor(e);
            }),
            (this.getContentSize = T.ispage ?

                function() {
                    return {
                        w: Math.max(
                            l.body.scrollWidth,
                            l.documentElement.scrollWidth
                        ),
                        h: Math.max(
                            l.body.scrollHeight,
                            l.documentElement.scrollHeight
                        ),
                    };
                } :
                T.haswrapper ?

                function() {
                    return {
                        w: T.doc[0].offsetWidth,
                        h: T.doc[0].offsetHeight,
                    };
                } :
                function() {
                    return {
                        w: T.docscroll[0].scrollWidth,
                        h: T.docscroll[0].scrollHeight,
                    };
                }),
            (this.onResize = function(e, o) {
                if (!T || !T.win) return !1;
                var t = T.page.maxh,
                    r = T.page.maxw,
                    i = T.view.h,
                    s = T.view.w;
                if (
                    ((T.view = {
                            w: T.ispage ? T.win.width() : T.win[0].clientWidth,
                            h: T.ispage ?
                                T.win.height() :
                                T.win[0].clientHeight,
                        }),
                        (T.page = o || T.getContentSize()),
                        (T.page.maxh = Math.max(0, T.page.h - T.view.h)),
                        (T.page.maxw = Math.max(0, T.page.w - T.view.w)),
                        T.page.maxh == t &&
                        T.page.maxw == r &&
                        T.view.w == s &&
                        T.view.h == i)
                ) {
                    if (T.ispage) return T;
                    var n = T.win.offset();
                    if (T.lastposition) {
                        var l = T.lastposition;
                        if (l.top == n.top && l.left == n.left) return T;
                    }
                    T.lastposition = n;
                }
                return (
                    0 === T.page.maxh ?
                    (T.hideRail(),
                        (T.scrollvaluemax = 0),
                        (T.scroll.y = 0),
                        (T.scrollratio.y = 0),
                        (T.cursorheight = 0),
                        T.setScrollTop(0),
                        T.rail && (T.rail.scrollable = !1)) :
                    ((T.page.maxh -=
                            M.railpadding.top + M.railpadding.bottom),
                        (T.rail.scrollable = !0)),
                    0 === T.page.maxw ?
                    (T.hideRailHr(),
                        (T.scrollvaluemaxw = 0),
                        (T.scroll.x = 0),
                        (T.scrollratio.x = 0),
                        (T.cursorwidth = 0),
                        T.setScrollLeft(0),
                        T.railh && (T.railh.scrollable = !1)) :
                    ((T.page.maxw -=
                            M.railpadding.left + M.railpadding.right),
                        T.railh &&
                        (T.railh.scrollable = M.horizrailenabled)),
                    (T.railslocked =
                        T.locked ||
                        (0 === T.page.maxh && 0 === T.page.maxw)),
                    T.railslocked ?
                    (T.ispage || T.updateScrollBar(T.view), !1) :
                    (T.hidden ||
                        (T.rail.visibility || T.showRail(),
                            T.railh &&
                            !T.railh.visibility &&
                            T.showRailHr()),
                        T.istextarea &&
                        T.win.css("resize") &&
                        "none" != T.win.css("resize") &&
                        (T.view.h -= 20),
                        (T.cursorheight = Math.min(
                            T.view.h,
                            Math.round(T.view.h * (T.view.h / T.page.h))
                        )),
                        (T.cursorheight = M.cursorfixedheight ?
                            M.cursorfixedheight :
                            Math.max(
                                M.cursorminheight,
                                T.cursorheight
                            )),
                        (T.cursorwidth = Math.min(
                            T.view.w,
                            Math.round(T.view.w * (T.view.w / T.page.w))
                        )),
                        (T.cursorwidth = M.cursorfixedheight ?
                            M.cursorfixedheight :
                            Math.max(M.cursorminheight, T.cursorwidth)),
                        (T.scrollvaluemax =
                            T.view.h -
                            T.cursorheight -
                            (M.railpadding.top + M.railpadding.bottom)),
                        T.hasborderbox ||
                        (T.scrollvaluemax -=
                            T.cursor[0].offsetHeight -
                            T.cursor[0].clientHeight),
                        T.railh &&
                        ((T.railh.width =
                                T.page.maxh > 0 ?
                                T.view.w - T.rail.width :
                                T.view.w),
                            (T.scrollvaluemaxw =
                                T.railh.width -
                                T.cursorwidth -
                                (M.railpadding.left +
                                    M.railpadding.right))),
                        T.ispage || T.updateScrollBar(T.view),
                        (T.scrollratio = {
                            x: T.page.maxw / T.scrollvaluemaxw,
                            y: T.page.maxh / T.scrollvaluemax,
                        }),
                        T.getScrollTop() > T.page.maxh ?
                        T.doScrollTop(T.page.maxh) :
                        ((T.scroll.y =
                                (T.getScrollTop() / T.scrollratio.y) |
                                0),
                            (T.scroll.x =
                                (T.getScrollLeft() / T.scrollratio.x) |
                                0),
                            T.cursoractive && T.noticeCursor()),
                        T.scroll.y &&
                        0 === T.getScrollTop() &&
                        T.doScrollTo(
                            (T.scroll.y * T.scrollratio.y) | 0
                        ),
                        T)
                );
            }),
            (this.resize = T.onResize);
            var O = 0;
            (this.onscreenresize = function(e) {
                clearTimeout(O);
                var o = !T.ispage && !T.haswrapper;
                o && T.hideRails(),
                    (O = setTimeout(function() {
                        T && (o && T.showRails(), T.resize()), (O = 0);
                    }, 120));
            }),
            (this.lazyResize = function(e) {
                return (
                    clearTimeout(O),
                    (e = isNaN(e) ? 240 : e),
                    (O = setTimeout(function() {
                        T && T.resize(), (O = 0);
                    }, e)),
                    T
                );
            }),
            (this.jqbind = function(e, o, t) {
                T.events.push({ e: e, n: o, f: t, q: !0 }), n(e).on(o, t);
            }),
            (this.mousewheel = function(e, o, t) {
                var r = "jquery" in e ? e[0] : e;
                if ("onwheel" in l.createElement("div"))
                    T._bind(r, "wheel", o, t || !1);
                else {
                    var i =
                        void 0 !== l.onmousewheel ?
                        "mousewheel" :
                        "DOMMouseScroll";
                    S(r, i, o, t || !1),
                        "DOMMouseScroll" == i &&
                        S(r, "MozMousePixelScroll", o, t || !1);
                }
            });
            var Y = !1;
            if (P.haseventlistener) {
                try {
                    var H = Object.defineProperty({}, "passive", {
                        get: function() {
                            Y = !0;
                        },
                    });
                    a.addEventListener("test", null, H);
                } catch (e) {}
                (this.stopPropagation = function(e) {
                    return (!!e &&
                        ((e = e.original ? e.original : e).stopPropagation(), !1)
                    );
                }),
                (this.cancelEvent = function(e) {
                    return (
                        e.cancelable && e.preventDefault(),
                        e.stopImmediatePropagation(),
                        e.preventManipulation && e.preventManipulation(), !1
                    );
                });
            } else
                (Event.prototype.preventDefault = function() {
                    this.returnValue = !1;
                }),
                (Event.prototype.stopPropagation = function() {
                    this.cancelBubble = !0;
                }),
                (a.constructor.prototype.addEventListener =
                    l.constructor.prototype.addEventListener =
                    Element.prototype.addEventListener =
                    function(e, o, t) {
                        this.attachEvent("on" + e, o);
                    }),
                (a.constructor.prototype.removeEventListener =
                    l.constructor.prototype.removeEventListener =
                    Element.prototype.removeEventListener =
                    function(e, o, t) {
                        this.detachEvent("on" + e, o);
                    }),
                (this.cancelEvent = function(e) {
                    return (
                        (e = e || a.event) &&
                        ((e.cancelBubble = !0),
                            (e.cancel = !0),
                            (e.returnValue = !1)), !1
                    );
                }),
                (this.stopPropagation = function(e) {
                    return (e = e || a.event) && (e.cancelBubble = !0), !1;
                });
            (this.delegate = function(e, o, t, r, i) {
                var s = d[o] || !1;
                s ||
                    ((s = {
                            a: [],
                            l: [],
                            f: function(e) {
                                for (
                                    var o = s.l, t = !1, r = o.length - 1; r >= 0; r--
                                )
                                    if (!1 === (t = o[r].call(e.target, e)))
                                        return !1;
                                return t;
                            },
                        }),
                        T.bind(e, o, s.f, r, i),
                        (d[o] = s)),
                    T.ispage ?
                    ((s.a = [T.id].concat(s.a)), (s.l = [t].concat(s.l))) :
                    (s.a.push(T.id), s.l.push(t));
            }),
            (this.undelegate = function(e, o, t, r, i) {
                var s = d[o] || !1;
                if (s && s.l)
                    for (var n = 0, l = s.l.length; n < l; n++)
                        s.a[n] === T.id &&
                        (s.a.splice(n),
                            s.l.splice(n),
                            0 === s.a.length &&
                            (T._unbind(e, o, s.l.f), (d[o] = null)));
            }),
            (this.bind = function(e, o, t, r, i) {
                var s = "jquery" in e ? e[0] : e;
                T._bind(s, o, t, r || !1, i || !1);
            }),
            (this._bind = function(e, o, t, r, i) {
                T.events.push({ e: e, n: o, f: t, b: r, q: !1 }),
                    Y && i ?
                    e.addEventListener(o, t, {
                        passive: !1,
                        capture: r,
                    }) :
                    e.addEventListener(o, t, r || !1);
            }),
            (this._unbind = function(e, o, t, r) {
                d[o] ?
                    T.undelegate(e, o, t, r) :
                    e.removeEventListener(o, t, r);
            }),
            (this.unbindAll = function() {
                for (var e = 0; e < T.events.length; e++) {
                    var o = T.events[e];
                    o.q ?
                        o.e.unbind(o.n, o.f) :
                        T._unbind(o.e, o.n, o.f, o.b);
                }
            }),
            (this.showRails = function() {
                return T.showRail().showRailHr();
            }),
            (this.showRail = function() {
                return (
                    0 === T.page.maxh ||
                    (!T.ispage && "none" == T.win.css("display")) ||
                    ((T.rail.visibility = !0),
                        T.rail.css("display", "block")),
                    T
                );
            }),
            (this.showRailHr = function() {
                return (
                    T.railh &&
                    (0 === T.page.maxw ||
                        (!T.ispage && "none" == T.win.css("display")) ||
                        ((T.railh.visibility = !0),
                            T.railh.css("display", "block"))),
                    T
                );
            }),
            (this.hideRails = function() {
                return T.hideRail().hideRailHr();
            }),
            (this.hideRail = function() {
                return (
                    (T.rail.visibility = !1),
                    T.rail.css("display", "none"),
                    T
                );
            }),
            (this.hideRailHr = function() {
                return (
                    T.railh &&
                    ((T.railh.visibility = !1),
                        T.railh.css("display", "none")),
                    T
                );
            }),
            (this.show = function() {
                return (T.hidden = !1), (T.railslocked = !1), T.showRails();
            }),
            (this.hide = function() {
                return (T.hidden = !0), (T.railslocked = !0), T.hideRails();
            }),
            (this.toggle = function() {
                return T.hidden ? T.show() : T.hide();
            }),
            (this.remove = function() {
                T.stop(), T.cursortimeout && clearTimeout(T.cursortimeout);
                for (var e in T.delaylist)
                    T.delaylist[e] && h(T.delaylist[e].h);
                T.doZoomOut(),
                    T.unbindAll(),
                    P.isie9 &&
                    T.win[0].detachEvent(
                        "onpropertychange",
                        T.onAttributeChange
                    ), !1 !== T.observer && T.observer.disconnect(), !1 !== T.observerremover &&
                    T.observerremover.disconnect(), !1 !== T.observerbody && T.observerbody.disconnect(),
                    (T.events = null),
                    T.cursor && T.cursor.remove(),
                    T.cursorh && T.cursorh.remove(),
                    T.rail && T.rail.remove(),
                    T.railh && T.railh.remove(),
                    T.zoom && T.zoom.remove();
                for (var o = 0; o < T.saved.css.length; o++) {
                    var t = T.saved.css[o];
                    t[0].css(t[1], void 0 === t[2] ? "" : t[2]);
                }
                (T.saved = !1), T.me.data("__nicescroll", "");
                var r = n.nicescroll;
                r.each(function(e) {
                    if (this && this.id === T.id) {
                        delete r[e];
                        for (var o = ++e; o < r.length; o++, e++)
                            r[e] = r[o];
                        --r.length && delete r[r.length];
                    }
                });
                for (var i in T)(T[i] = null), delete T[i];
                T = null;
            }),
            (this.scrollstart = function(e) {
                return (this.onscrollstart = e), T;
            }),
            (this.scrollend = function(e) {
                return (this.onscrollend = e), T;
            }),
            (this.scrollcancel = function(e) {
                return (this.onscrollcancel = e), T;
            }),
            (this.zoomin = function(e) {
                return (this.onzoomin = e), T;
            }),
            (this.zoomout = function(e) {
                return (this.onzoomout = e), T;
            }),
            (this.isScrollable = function(e) {
                var o = e.target ? e.target : e;
                if ("OPTION" == o.nodeName) return !0;
                for (; o &&
                    1 == o.nodeType &&
                    o !== this.me[0] &&
                    !/^BODY|HTML/.test(o.nodeName);

                ) {
                    var t = n(o),
                        r =
                        t.css("overflowY") ||
                        t.css("overflowX") ||
                        t.css("overflow") ||
                        "";
                    if (/scroll|auto/.test(r))
                        return o.clientHeight != o.scrollHeight;
                    o = !!o.parentNode && o.parentNode;
                }
                return !1;
            }),
            (this.getViewport = function(e) {
                for (
                    var o = !(!e || !e.parentNode) && e.parentNode; o && 1 == o.nodeType && !/^BODY|HTML/.test(o.nodeName);

                ) {
                    var t = n(o);
                    if (/fixed|absolute/.test(t.css("position"))) return t;
                    var r =
                        t.css("overflowY") ||
                        t.css("overflowX") ||
                        t.css("overflow") ||
                        "";
                    if (
                        /scroll|auto/.test(r) &&
                        o.clientHeight != o.scrollHeight
                    )
                        return t;
                    if (t.getNiceScroll().length > 0) return t;
                    o = !!o.parentNode && o.parentNode;
                }
                return !1;
            }),
            (this.triggerScrollStart = function(e, o, t, r, i) {
                if (T.onscrollstart) {
                    var s = {
                        type: "scrollstart",
                        current: { x: e, y: o },
                        request: { x: t, y: r },
                        end: { x: T.newscrollx, y: T.newscrolly },
                        speed: i,
                    };
                    T.onscrollstart.call(T, s);
                }
            }),
            (this.triggerScrollEnd = function() {
                if (T.onscrollend) {
                    var e = T.getScrollLeft(),
                        o = T.getScrollTop(),
                        t = {
                            type: "scrollend",
                            current: { x: e, y: o },
                            end: { x: e, y: o },
                        };
                    T.onscrollend.call(T, t);
                }
            });
            var B = 0,
                X = 0,
                D = 0,
                A = 1,
                q = !1;
            if (
                ((this.onmousewheel = function(e) {
                        if (T.wheelprevented || T.locked) return !1;
                        if (T.railslocked)
                            return T.debounced("checkunlock", T.resize, 250), !1;
                        if (T.rail.drag) return T.cancelEvent(e);
                        if (
                            ("auto" === M.oneaxismousemode &&
                                0 !== e.deltaX &&
                                (M.oneaxismousemode = !1),
                                M.oneaxismousemode &&
                                0 === e.deltaX &&
                                !T.rail.scrollable)
                        )
                            return (!T.railh ||
                                !T.railh.scrollable ||
                                T.onmousewheelhr(e)
                            );
                        var o = f(),
                            t = !1;
                        if (
                            (M.preservenativescrolling &&
                                T.checkarea + 600 < o &&
                                ((T.nativescrollingarea = T.isScrollable(e)),
                                    (t = !0)),
                                (T.checkarea = o),
                                T.nativescrollingarea)
                        )
                            return !0;
                        var r = k(e, !1, t);
                        return r && (T.checkarea = 0), r;
                    }),
                    (this.onmousewheelhr = function(e) {
                        if (!T.wheelprevented) {
                            if (T.railslocked || !T.railh.scrollable) return !0;
                            if (T.rail.drag) return T.cancelEvent(e);
                            var o = f(),
                                t = !1;
                            return (
                                M.preservenativescrolling &&
                                T.checkarea + 600 < o &&
                                ((T.nativescrollingarea = T.isScrollable(e)),
                                    (t = !0)),
                                (T.checkarea = o), !!T.nativescrollingarea ||
                                (T.railslocked ? T.cancelEvent(e) : k(e, !0, t))
                            );
                        }
                    }),
                    (this.stop = function() {
                        return (
                            T.cancelScroll(),
                            T.scrollmon && T.scrollmon.stop(),
                            (T.cursorfreezed = !1),
                            (T.scroll.y = Math.round(
                                T.getScrollTop() * (1 / T.scrollratio.y)
                            )),
                            T.noticeCursor(),
                            T
                        );
                    }),
                    (this.getTransitionSpeed = function(e) {
                        return (80 + (e / 72) * M.scrollspeed) | 0;
                    }),
                    M.smoothscroll)
            )
                if (
                    T.ishwscroll &&
                    P.hastransition &&
                    M.usetransition &&
                    M.smoothscroll
                ) {
                    var j = "";
                    (this.resetTransition = function() {
                        (j = ""),
                        T.doc.css(
                            P.prefixstyle + "transition-duration",
                            "0ms"
                        );
                    }),
                    (this.prepareTransition = function(e, o) {
                        var t = o ? e : T.getTransitionSpeed(e),
                            r = t + "ms";
                        return (
                            j !== r &&
                            ((j = r),
                                T.doc.css(
                                    P.prefixstyle + "transition-duration",
                                    r
                                )),
                            t
                        );
                    }),
                    (this.doScrollLeft = function(e, o) {
                        var t = T.scrollrunning ?
                            T.newscrolly :
                            T.getScrollTop();
                        T.doScrollPos(e, t, o);
                    }),
                    (this.doScrollTop = function(e, o) {
                        var t = T.scrollrunning ?
                            T.newscrollx :
                            T.getScrollLeft();
                        T.doScrollPos(t, e, o);
                    }),
                    (this.cursorupdate = {
                        running: !1,
                        start: function() {
                            var e = this;
                            if (!e.running) {
                                e.running = !0;
                                var o = function() {
                                    e.running && u(o),
                                        T.showCursor(
                                            T.getScrollTop(),
                                            T.getScrollLeft()
                                        ),
                                        T.notifyScrollEvent(T.win[0]);
                                };
                                u(o);
                            }
                        },
                        stop: function() {
                            this.running = !1;
                        },
                    }),
                    (this.doScrollPos = function(e, o, t) {
                        var r = T.getScrollTop(),
                            i = T.getScrollLeft();
                        if (
                            (((T.newscrolly - r) * (o - r) < 0 ||
                                    (T.newscrollx - i) * (e - i) < 0) &&
                                T.cancelScroll(),
                                M.bouncescroll ?
                                (o < 0 ?
                                    (o = (o / 2) | 0) :
                                    o > T.page.maxh &&
                                    (o =
                                        (T.page.maxh +
                                            (o - T.page.maxh) / 2) |
                                        0),
                                    e < 0 ?
                                    (e = (e / 2) | 0) :
                                    e > T.page.maxw &&
                                    (e =
                                        (T.page.maxw +
                                            (e - T.page.maxw) / 2) |
                                        0)) :
                                (o < 0 ?
                                    (o = 0) :
                                    o > T.page.maxh &&
                                    (o = T.page.maxh),
                                    e < 0 ?
                                    (e = 0) :
                                    e > T.page.maxw &&
                                    (e = T.page.maxw)),
                                T.scrollrunning &&
                                e == T.newscrollx &&
                                o == T.newscrolly)
                        )
                            return !1;
                        (T.newscrolly = o), (T.newscrollx = e);
                        var s = T.getScrollTop(),
                            n = T.getScrollLeft(),
                            l = {};
                        (l.x = e - n), (l.y = o - s);
                        var a = 0 | Math.sqrt(l.x * l.x + l.y * l.y),
                            c = T.prepareTransition(a);
                        T.scrollrunning ||
                            ((T.scrollrunning = !0),
                                T.triggerScrollStart(n, s, e, o, c),
                                T.cursorupdate.start()),
                            (T.scrollendtrapped = !0),
                            P.transitionend ||
                            (T.scrollendtrapped &&
                                clearTimeout(T.scrollendtrapped),
                                (T.scrollendtrapped = setTimeout(
                                    T.onScrollTransitionEnd,
                                    c
                                ))),
                            T.setScrollTop(T.newscrolly),
                            T.setScrollLeft(T.newscrollx);
                    }),
                    (this.cancelScroll = function() {
                        if (!T.scrollendtrapped) return !0;
                        var e = T.getScrollTop(),
                            o = T.getScrollLeft();
                        return (
                            (T.scrollrunning = !1),
                            P.transitionend ||
                            clearTimeout(P.transitionend),
                            (T.scrollendtrapped = !1),
                            T.resetTransition(),
                            T.setScrollTop(e),
                            T.railh && T.setScrollLeft(o),
                            T.timerscroll &&
                            T.timerscroll.tm &&
                            clearInterval(T.timerscroll.tm),
                            (T.timerscroll = !1),
                            (T.cursorfreezed = !1),
                            T.cursorupdate.stop(),
                            T.showCursor(e, o),
                            T
                        );
                    }),
                    (this.onScrollTransitionEnd = function() {
                        if (T.scrollendtrapped) {
                            var e = T.getScrollTop(),
                                o = T.getScrollLeft();
                            if (
                                (e < 0 ?
                                    (e = 0) :
                                    e > T.page.maxh && (e = T.page.maxh),
                                    o < 0 ?
                                    (o = 0) :
                                    o > T.page.maxw && (o = T.page.maxw),
                                    e != T.newscrolly || o != T.newscrollx)
                            )
                                return T.doScrollPos(o, e, M.snapbackspeed);
                            T.scrollrunning && T.triggerScrollEnd(),
                                (T.scrollrunning = !1),
                                (T.scrollendtrapped = !1),
                                T.resetTransition(),
                                (T.timerscroll = !1),
                                T.setScrollTop(e),
                                T.railh && T.setScrollLeft(o),
                                T.cursorupdate.stop(),
                                T.noticeCursor(!1, e, o),
                                (T.cursorfreezed = !1);
                        }
                    });
                } else
                    (this.doScrollLeft = function(e, o) {
                        var t = T.scrollrunning ?
                            T.newscrolly :
                            T.getScrollTop();
                        T.doScrollPos(e, t, o);
                    }),
                    (this.doScrollTop = function(e, o) {
                        var t = T.scrollrunning ?
                            T.newscrollx :
                            T.getScrollLeft();
                        T.doScrollPos(t, e, o);
                    }),
                    (this.doScrollPos = function(e, o, t) {
                        var r = T.getScrollTop(),
                            i = T.getScrollLeft();
                        ((T.newscrolly - r) * (o - r) < 0 ||
                            (T.newscrollx - i) * (e - i) < 0) &&
                        T.cancelScroll();
                        var s = !1;
                        if (
                            ((T.bouncescroll && T.rail.visibility) ||
                                (o < 0 ?
                                    ((o = 0), (s = !0)) :
                                    o > T.page.maxh &&
                                    ((o = T.page.maxh), (s = !0))),
                                (T.bouncescroll && T.railh.visibility) ||
                                (e < 0 ?
                                    ((e = 0), (s = !0)) :
                                    e > T.page.maxw &&
                                    ((e = T.page.maxw), (s = !0))),
                                T.scrollrunning &&
                                T.newscrolly === o &&
                                T.newscrollx === e)
                        )
                            return !0;
                        (T.newscrolly = o),
                        (T.newscrollx = e),
                        (T.dst = {}),
                        (T.dst.x = e - i),
                        (T.dst.y = o - r),
                        (T.dst.px = i),
                        (T.dst.py = r);
                        var n =
                            0 |
                            Math.sqrt(
                                T.dst.x * T.dst.x + T.dst.y * T.dst.y
                            ),
                            l = T.getTransitionSpeed(n);
                        T.bzscroll = {};
                        var a = s ? 1 : 0.58;
                        (T.bzscroll.x = new R(
                            i,
                            T.newscrollx,
                            l,
                            0,
                            0,
                            a,
                            1
                        )),
                        (T.bzscroll.y = new R(
                            r,
                            T.newscrolly,
                            l,
                            0,
                            0,
                            a,
                            1
                        ));
                        f();
                        var c = function() {
                            if (T.scrollrunning) {
                                var e = T.bzscroll.y.getPos();
                                T.setScrollLeft(T.bzscroll.x.getNow()),
                                    T.setScrollTop(T.bzscroll.y.getNow()),
                                    e <= 1 ?
                                    (T.timer = u(c)) :
                                    ((T.scrollrunning = !1),
                                        (T.timer = 0),
                                        T.triggerScrollEnd());
                            }
                        };
                        T.scrollrunning ||
                            (T.triggerScrollStart(i, r, e, o, l),
                                (T.scrollrunning = !0),
                                (T.timer = u(c)));
                    }),
                    (this.cancelScroll = function() {
                        return (
                            T.timer && h(T.timer),
                            (T.timer = 0),
                            (T.bzscroll = !1),
                            (T.scrollrunning = !1),
                            T
                        );
                    });
            else
                (this.doScrollLeft = function(e, o) {
                    var t = T.getScrollTop();
                    T.doScrollPos(e, t, o);
                }),
                (this.doScrollTop = function(e, o) {
                    var t = T.getScrollLeft();
                    T.doScrollPos(t, e, o);
                }),
                (this.doScrollPos = function(e, o, t) {
                    var r = e > T.page.maxw ? T.page.maxw : e;
                    r < 0 && (r = 0);
                    var i = o > T.page.maxh ? T.page.maxh : o;
                    i < 0 && (i = 0),
                        T.synched("scroll", function() {
                            T.setScrollTop(i), T.setScrollLeft(r);
                        });
                }),
                (this.cancelScroll = function() {});
            (this.doScrollBy = function(e, o) {
                z(0, e);
            }),
            (this.doScrollLeftBy = function(e, o) {
                z(e, 0);
            }),
            (this.doScrollTo = function(e, o) {
                var t = o ? Math.round(e * T.scrollratio.y) : e;
                t < 0 ? (t = 0) : t > T.page.maxh && (t = T.page.maxh),
                    (T.cursorfreezed = !1),
                    T.doScrollTop(e);
            }),
            (this.checkContentSize = function() {
                var e = T.getContentSize();
                (e.h == T.page.h && e.w == T.page.w) || T.resize(!1, e);
            }),
            (T.onscroll = function(e) {
                T.rail.drag ||
                    T.cursorfreezed ||
                    T.synched("scroll", function() {
                        (T.scroll.y = Math.round(
                            T.getScrollTop() / T.scrollratio.y
                        )),
                        T.railh &&
                            (T.scroll.x = Math.round(
                                T.getScrollLeft() / T.scrollratio.x
                            )),
                            T.noticeCursor();
                    });
            }),
            T.bind(T.docscroll, "scroll", T.onscroll),
                (this.doZoomIn = function(e) {
                    if (!T.zoomactive) {
                        (T.zoomactive = !0), (T.zoomrestore = { style: {} });
                        var o = [
                                "position",
                                "top",
                                "left",
                                "zIndex",
                                "backgroundColor",
                                "marginTop",
                                "marginBottom",
                                "marginLeft",
                                "marginRight",
                            ],
                            t = T.win[0].style;
                        for (var r in o) {
                            var i = o[r];
                            T.zoomrestore.style[i] =
                                void 0 !== t[i] ? t[i] : "";
                        }
                        (T.zoomrestore.style.width = T.win.css("width")),
                        (T.zoomrestore.style.height = T.win.css("height")),
                        (T.zoomrestore.padding = {
                            w: T.win.outerWidth() - T.win.width(),
                            h: T.win.outerHeight() - T.win.height(),
                        }),
                        P.isios4 &&
                            ((T.zoomrestore.scrollTop = c.scrollTop()),
                                c.scrollTop(0)),
                            T.win.css({
                                position: P.isios4 ? "absolute" : "fixed",
                                top: 0,
                                left: 0,
                                zIndex: s + 100,
                                margin: 0,
                            });
                        var n = T.win.css("backgroundColor");
                        return (
                            ("" === n ||
                                /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(
                                    n
                                )) &&
                            T.win.css("backgroundColor", "#fff"),
                            T.rail.css({ zIndex: s + 101 }),
                            T.zoom.css({ zIndex: s + 102 }),
                            T.zoom.css("backgroundPosition", "0 -18px"),
                            T.resizeZoom(),
                            T.onzoomin && T.onzoomin.call(T),
                            T.cancelEvent(e)
                        );
                    }
                }),
                (this.doZoomOut = function(e) {
                    if (T.zoomactive)
                        return (
                            (T.zoomactive = !1),
                            T.win.css("margin", ""),
                            T.win.css(T.zoomrestore.style),
                            P.isios4 && c.scrollTop(T.zoomrestore.scrollTop),
                            T.rail.css({ "z-index": T.zindex }),
                            T.zoom.css({ "z-index": T.zindex }),
                            (T.zoomrestore = !1),
                            T.zoom.css("backgroundPosition", "0 0"),
                            T.onResize(),
                            T.onzoomout && T.onzoomout.call(T),
                            T.cancelEvent(e)
                        );
                }),
                (this.doZoom = function(e) {
                    return T.zoomactive ? T.doZoomOut(e) : T.doZoomIn(e);
                }),
                (this.resizeZoom = function() {
                    if (T.zoomactive) {
                        var e = T.getScrollTop();
                        T.win.css({
                                width: c.width() - T.zoomrestore.padding.w + "px",
                                height: c.height() - T.zoomrestore.padding.h + "px",
                            }),
                            T.onResize(),
                            T.setScrollTop(Math.min(T.page.maxh, e));
                    }
                }),
                this.init(),
                n.nicescroll.push(this);
        },
        y = function(e) {
            var o = this;
            (this.nc = e),
            (this.lastx = 0),
            (this.lasty = 0),
            (this.speedx = 0),
            (this.speedy = 0),
            (this.lasttime = 0),
            (this.steptime = 0),
            (this.snapx = !1),
            (this.snapy = !1),
            (this.demulx = 0),
            (this.demuly = 0),
            (this.lastscrollx = -1),
            (this.lastscrolly = -1),
            (this.chkx = 0),
            (this.chky = 0),
            (this.timer = 0),
            (this.reset = function(e, t) {
                o.stop(),
                    (o.steptime = 0),
                    (o.lasttime = f()),
                    (o.speedx = 0),
                    (o.speedy = 0),
                    (o.lastx = e),
                    (o.lasty = t),
                    (o.lastscrollx = -1),
                    (o.lastscrolly = -1);
            }),
            (this.update = function(e, t) {
                var r = f();
                (o.steptime = r - o.lasttime), (o.lasttime = r);
                var i = t - o.lasty,
                    s = e - o.lastx,
                    n = o.nc.getScrollTop() + i,
                    l = o.nc.getScrollLeft() + s;
                (o.snapx = l < 0 || l > o.nc.page.maxw),
                (o.snapy = n < 0 || n > o.nc.page.maxh),
                (o.speedx = s),
                (o.speedy = i),
                (o.lastx = e),
                (o.lasty = t);
            }),
            (this.stop = function() {
                o.nc.unsynched("domomentum2d"),
                    o.timer && clearTimeout(o.timer),
                    (o.timer = 0),
                    (o.lastscrollx = -1),
                    (o.lastscrolly = -1);
            }),
            (this.doSnapy = function(e, t) {
                var r = !1;
                t < 0 ?
                    ((t = 0), (r = !0)) :
                    t > o.nc.page.maxh &&
                    ((t = o.nc.page.maxh), (r = !0)),
                    e < 0 ?
                    ((e = 0), (r = !0)) :
                    e > o.nc.page.maxw &&
                    ((e = o.nc.page.maxw), (r = !0)),
                    r ?
                    o.nc.doScrollPos(e, t, o.nc.opt.snapbackspeed) :
                    o.nc.triggerScrollEnd();
            }),
            (this.doMomentum = function(e) {
                var t = f(),
                    r = e ? t + e : o.lasttime,
                    i = o.nc.getScrollLeft(),
                    s = o.nc.getScrollTop(),
                    n = o.nc.page.maxh,
                    l = o.nc.page.maxw;
                (o.speedx = l > 0 ? Math.min(60, o.speedx) : 0),
                (o.speedy = n > 0 ? Math.min(60, o.speedy) : 0);
                var a = r && t - r <= 60;
                (s < 0 || s > n || i < 0 || i > l) && (a = !1);
                var c = !(!o.speedy || !a) && o.speedy,
                    d = !(!o.speedx || !a) && o.speedx;
                if (c || d) {
                    var u = Math.max(16, o.steptime);
                    if (u > 50) {
                        var h = u / 50;
                        (o.speedx *= h), (o.speedy *= h), (u = 50);
                    }
                    (o.demulxy = 0),
                    (o.lastscrollx = o.nc.getScrollLeft()),
                    (o.chkx = o.lastscrollx),
                    (o.lastscrolly = o.nc.getScrollTop()),
                    (o.chky = o.lastscrolly);
                    var p = o.lastscrollx,
                        m = o.lastscrolly,
                        g = function() {
                            var e = f() - t > 600 ? 0.04 : 0.02;
                            o.speedx &&
                                ((p = Math.floor(
                                        o.lastscrollx -
                                        o.speedx * (1 - o.demulxy)
                                    )),
                                    (o.lastscrollx = p),
                                    (p < 0 || p > l) && (e = 0.1)),
                                o.speedy &&
                                ((m = Math.floor(
                                        o.lastscrolly -
                                        o.speedy * (1 - o.demulxy)
                                    )),
                                    (o.lastscrolly = m),
                                    (m < 0 || m > n) && (e = 0.1)),
                                (o.demulxy = Math.min(1, o.demulxy + e)),
                                o.nc.synched("domomentum2d", function() {
                                    if (o.speedx) {
                                        o.nc.getScrollLeft();
                                        (o.chkx = p), o.nc.setScrollLeft(p);
                                    }
                                    if (o.speedy) {
                                        o.nc.getScrollTop();
                                        (o.chky = m), o.nc.setScrollTop(m);
                                    }
                                    o.timer ||
                                        (o.nc.hideCursor(),
                                            o.doSnapy(p, m));
                                }),
                                o.demulxy < 1 ?
                                (o.timer = setTimeout(g, u)) :
                                (o.stop(),
                                    o.nc.hideCursor(),
                                    o.doSnapy(p, m));
                        };
                    g();
                } else o.doSnapy(o.nc.getScrollLeft(), o.nc.getScrollTop());
            });
        },
        x = e.fn.scrollTop;
    (e.cssHooks.pageYOffset = {
        get: function(e, o, t) {
            var r = n.data(e, "__nicescroll") || !1;
            return r && r.ishwscroll ? r.getScrollTop() : x.call(e);
        },
        set: function(e, o) {
            var t = n.data(e, "__nicescroll") || !1;
            return (
                t && t.ishwscroll ? t.setScrollTop(parseInt(o)) : x.call(e, o),
                this
            );
        },
    }),
    (e.fn.scrollTop = function(e) {
        if (void 0 === e) {
            var o = !!this[0] && (n.data(this[0], "__nicescroll") || !1);
            return o && o.ishwscroll ? o.getScrollTop() : x.call(this);
        }
        return this.each(function() {
            var o = n.data(this, "__nicescroll") || !1;
            o && o.ishwscroll ?
                o.setScrollTop(parseInt(e)) :
                x.call(n(this), e);
        });
    });
    var S = e.fn.scrollLeft;
    (n.cssHooks.pageXOffset = {
        get: function(e, o, t) {
            var r = n.data(e, "__nicescroll") || !1;
            return r && r.ishwscroll ? r.getScrollLeft() : S.call(e);
        },
        set: function(e, o) {
            var t = n.data(e, "__nicescroll") || !1;
            return (
                t && t.ishwscroll ? t.setScrollLeft(parseInt(o)) : S.call(e, o),
                this
            );
        },
    }),
    (e.fn.scrollLeft = function(e) {
        if (void 0 === e) {
            var o = !!this[0] && (n.data(this[0], "__nicescroll") || !1);
            return o && o.ishwscroll ? o.getScrollLeft() : S.call(this);
        }
        return this.each(function() {
            var o = n.data(this, "__nicescroll") || !1;
            o && o.ishwscroll ?
                o.setScrollLeft(parseInt(e)) :
                S.call(n(this), e);
        });
    });
    var z = function(e) {
        var o = this;
        if (
            ((this.length = 0),
                (this.name = "nicescrollarray"),
                (this.each = function(e) {
                    return n.each(o, e), o;
                }),
                (this.push = function(e) {
                    (o[o.length] = e), o.length++;
                }),
                (this.eq = function(e) {
                    return o[e];
                }),
                e)
        )
            for (var t = 0; t < e.length; t++) {
                var r = n.data(e[t], "__nicescroll") || !1;
                r && ((this[this.length] = r), this.length++);
            }
        return this;
    };
    !(function(e, o, t) {
        for (var r = 0, i = o.length; r < i; r++) t(e, o[r]);
    })(
        z.prototype, [
            "show",
            "hide",
            "toggle",
            "onResize",
            "resize",
            "remove",
            "stop",
            "doScrollPos",
        ],
        function(e, o) {
            e[o] = function() {
                var e = arguments;
                return this.each(function() {
                    this[o].apply(this, e);
                });
            };
        }
    ),
    (e.fn.getNiceScroll = function(e) {
        return void 0 === e ?
            new z(this) :
            (this[e] && n.data(this[e], "__nicescroll")) || !1;
    }),
    ((e.expr.pseudos || e.expr[":"]).nicescroll = function(e) {
        return void 0 !== n.data(e, "__nicescroll");
    }),
    (n.fn.niceScroll = function(e, o) {
        void 0 !== o ||
            "object" != typeof e ||
            "jquery" in e ||
            ((o = e), (e = !1));
        var t = new z();
        return (
            this.each(function() {
                var r = n(this),
                    i = n.extend({}, o);
                if (e) {
                    var s = n(e);
                    (i.doc = s.length > 1 ? n(e, r) : s), (i.win = r);
                }!("doc" in i) || "win" in i || (i.win = r);
                var l = r.data("__nicescroll") || !1;
                l ||
                    ((i.doc = i.doc || r),
                        (l = new b(i, r)),
                        r.data("__nicescroll", l)),
                    t.push(l);
            }),
            1 === t.length ? t[0] : t
        );
    }),
    (a.NiceScroll = {
        getjQuery: function() {
            return e;
        },
    }),
    n.nicescroll || ((n.nicescroll = new z()), (n.nicescroll.options = g));
});
/*! countdown */
!(function(e) {
    e.fn.downCount = function(t, n) {
        var r = e.extend({ date: null, offset: null }, t);
        r.date || e.error("Date is not defined."),
            Date.parse(r.date) ||
            e.error(
                "Incorrect date format, it should look like this, 12/24/2012 12:00:00."
            );
        var o = this,
            f = function() {
                var e = new Date(),
                    t = e.getTime() + 6e4 * e.getTimezoneOffset();
                return new Date(t + 36e5 * r.offset);
            };
        var i = setInterval(function() {
            var e = new Date(r.date) - f();
            if (e < 0)
                return (
                    clearInterval(i), void(n && "function" == typeof n && n())
                );
            var t = 36e5,
                a = Math.floor(e / 864e5),
                d = Math.floor((e % 864e5) / t),
                s = Math.floor((e % t) / 6e4),
                u = Math.floor((e % 6e4) / 1e3);
            (a = String(a).length >= 2 ? a : "0" + a),
            (d = String(d).length >= 2 ? d : "0" + d),
            (s = String(s).length >= 2 ? s : "0" + s),
            (u = String(u).length >= 2 ? u : "0" + u);
            var l = 1 === a ? "day" : "days",
                h = 1 === d ? "hour" : "hours",
                c = 1 === s ? "minute" : "minutes",
                g = 1 === u ? "second" : "seconds";
            o.find(".days").text(a),
                o.find(".hours").text(d),
                o.find(".minutes").text(s),
                o.find(".seconds").text(u),
                o.find(".days_ref").text(l),
                o.find(".hours_ref").text(h),
                o.find(".minutes_ref").text(c),
                o.find(".seconds_ref").text(g);
        }, 10);
    };
})(jQuery);
/*! vivus - JavaScript library to make drawing animation on SVG */
("use strict");
!(function(t, e) {
    function r(r) {
        if ("undefined" == typeof r)
            throw new Error(
                'Pathformer [constructor]: "element" parameter is required'
            );
        if (r.constructor === String && ((r = e.getElementById(r)), !r))
            throw new Error(
                'Pathformer [constructor]: "element" parameter is not related to an existing ID'
            );
        if (!(
                r.constructor instanceof t.SVGElement ||
                /^svg$/i.test(r.nodeName)
            ))
            throw new Error(
                'Pathformer [constructor]: "element" parameter must be a string or a SVGelement'
            );
        (this.el = r), this.scan(r);
    }

    function n(t, e, r) {
        (this.isReady = !1),
        this.setElement(t, e),
            this.setOptions(e),
            this.setCallback(r),
            this.isReady && this.init();
    }
    (r.prototype.TYPES = [
        "line",
        "ellipse",
        "circle",
        "polygon",
        "polyline",
        "rect",
    ]),
    (r.prototype.ATTR_WATCH = [
        "cx",
        "cy",
        "points",
        "r",
        "rx",
        "ry",
        "x",
        "x1",
        "x2",
        "y",
        "y1",
        "y2",
    ]),
    (r.prototype.scan = function(t) {
        for (
            var e,
                r,
                n,
                i,
                a = t.querySelectorAll(this.TYPES.join(",")),
                o = 0; o < a.length; o++
        )
            (r = a[o]),
            (e = this[r.tagName.toLowerCase() + "ToPath"]),
            (n = e(this.parseAttr(r.attributes))),
            (i = this.pathMaker(r, n)),
            r.parentNode.replaceChild(i, r);
    }),
    (r.prototype.lineToPath = function(t) {
        var e = {};
        return (e.d = "M" + t.x1 + "," + t.y1 + "L" + t.x2 + "," + t.y2), e;
    }),
    (r.prototype.rectToPath = function(t) {
        var e = {},
            r = parseFloat(t.x) || 0,
            n = parseFloat(t.y) || 0,
            i = parseFloat(t.width) || 0,
            a = parseFloat(t.height) || 0;
        return (
            (e.d = "M" + r + " " + n + " "),
            (e.d += "L" + (r + i) + " " + n + " "),
            (e.d += "L" + (r + i) + " " + (n + a) + " "),
            (e.d += "L" + r + " " + (n + a) + " Z"),
            e
        );
    }),
    (r.prototype.polylineToPath = function(t) {
        var e,
            r,
            n = {},
            i = t.points.trim().split(" ");
        if (-1 === t.points.indexOf(",")) {
            var a = [];
            for (e = 0; e < i.length; e += 2) a.push(i[e] + "," + i[e + 1]);
            i = a;
        }
        for (r = "M" + i[0], e = 1; e < i.length; e++)
            -
            1 !== i[e].indexOf(",") && (r += "L" + i[e]);
        return (n.d = r), n;
    }),
    (r.prototype.polygonToPath = function(t) {
        var e = r.prototype.polylineToPath(t);
        return (e.d += "Z"), e;
    }),
    (r.prototype.ellipseToPath = function(t) {
        var e = t.cx - t.rx,
            r = t.cy,
            n = parseFloat(t.cx) + parseFloat(t.rx),
            i = t.cy,
            a = {};
        return (
            (a.d =
                "M" +
                e +
                "," +
                r +
                "A" +
                t.rx +
                "," +
                t.ry +
                " 0,1,1 " +
                n +
                "," +
                i +
                "A" +
                t.rx +
                "," +
                t.ry +
                " 0,1,1 " +
                e +
                "," +
                i),
            a
        );
    }),
    (r.prototype.circleToPath = function(t) {
        var e = {},
            r = t.cx - t.r,
            n = t.cy,
            i = parseFloat(t.cx) + parseFloat(t.r),
            a = t.cy;
        return (
            (e.d =
                "M" +
                r +
                "," +
                n +
                "A" +
                t.r +
                "," +
                t.r +
                " 0,1,1 " +
                i +
                "," +
                a +
                "A" +
                t.r +
                "," +
                t.r +
                " 0,1,1 " +
                r +
                "," +
                a),
            e
        );
    }),
    (r.prototype.pathMaker = function(t, r) {
        var n,
            i,
            a = e.createElementNS("http://www.w3.org/2000/svg", "path");
        for (n = 0; n < t.attributes.length; n++)
            (i = t.attributes[n]), -1 === this.ATTR_WATCH.indexOf(i.name) &&
            a.setAttribute(i.name, i.value);
        for (n in r) a.setAttribute(n, r[n]);
        return a;
    }),
    (r.prototype.parseAttr = function(t) {
        for (var e, r = {}, n = 0; n < t.length; n++) {
            if (
                ((e = t[n]), -1 !== this.ATTR_WATCH.indexOf(e.name) &&
                    -1 !== e.value.indexOf("%"))
            )
                throw new Error(
                    "Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into 'path' tags. Please use 'viewBox'."
                );
            r[e.name] = e.value;
        }
        return r;
    });
    var i, a, o;
    (n.LINEAR = function(t) {
        return t;
    }),
    (n.EASE = function(t) {
        return -Math.cos(t * Math.PI) / 2 + 0.5;
    }),
    (n.EASE_OUT = function(t) {
        return 1 - Math.pow(1 - t, 3);
    }),
    (n.EASE_IN = function(t) {
        return Math.pow(t, 3);
    }),
    (n.EASE_OUT_BOUNCE = function(t) {
        var e = -Math.cos(0.5 * t * Math.PI) + 1,
            r = Math.pow(e, 1.5),
            n = Math.pow(1 - t, 2),
            i = -Math.abs(Math.cos(2.5 * r * Math.PI)) + 1;
        return 1 - n + i * n;
    }),
    (n.prototype.setElement = function(r, n) {
        if ("undefined" == typeof r)
            throw new Error(
                'Vivus [constructor]: "element" parameter is required'
            );
        if (r.constructor === String && ((r = e.getElementById(r)), !r))
            throw new Error(
                'Vivus [constructor]: "element" parameter is not related to an existing ID'
            );
        if (((this.parentEl = r), n && n.file)) {
            var i = e.createElement("object");
            i.setAttribute("type", "image/svg+xml"),
                i.setAttribute("data", n.file),
                i.setAttribute("built-by-vivus", "true"),
                r.appendChild(i),
                (r = i);
        }
        switch (r.constructor) {
            case t.SVGSVGElement:
            case t.SVGElement:
                (this.el = r), (this.isReady = !0);
                break;
            case t.HTMLObjectElement:
                var a, o;
                (o = this),
                (a = function(t) {
                    if (!o.isReady) {
                        if (
                            ((o.el =
                                r.contentDocument &&
                                r.contentDocument.querySelector("svg")), !o.el && t)
                        )
                            throw new Error(
                                "Vivus [constructor]: object loaded does not contain any SVG"
                            );
                        return o.el ?
                            (r.getAttribute("built-by-vivus") &&
                                (o.parentEl.insertBefore(o.el, r),
                                    o.parentEl.removeChild(r),
                                    o.el.setAttribute("width", "100%"),
                                    o.el.setAttribute("height", "100%")),
                                (o.isReady = !0),
                                o.init(), !0) :
                            void 0;
                    }
                }),
                a() || r.addEventListener("load", a);
                break;
            default:
                throw new Error(
                    'Vivus [constructor]: "element" parameter is not valid (or miss the "file" attribute)'
                );
        }
    }),
    (n.prototype.setOptions = function(e) {
        var r = [
                "delayed",
                "async",
                "oneByOne",
                "scenario",
                "scenario-sync",
            ],
            i = ["inViewport", "manual", "autostart"];
        if (void 0 !== e && e.constructor !== Object)
            throw new Error(
                'Vivus [constructor]: "options" parameter must be an object'
            );
        if (((e = e || {}), e.type && -1 === r.indexOf(e.type)))
            throw new Error(
                "Vivus [constructor]: " +
                e.type +
                " is not an existing animation `type`"
            );
        if (
            ((this.type = e.type || r[0]),
                e.start && -1 === i.indexOf(e.start))
        )
            throw new Error(
                "Vivus [constructor]: " +
                e.start +
                " is not an existing `start` option"
            );
        if (
            ((this.start = e.start || i[0]),
                (this.isIE = -1 !== t.navigator.userAgent.indexOf("MSIE") ||
                    -1 !== t.navigator.userAgent.indexOf("Trident/") ||
                    -1 !== t.navigator.userAgent.indexOf("Edge/")),
                (this.duration = o(e.duration, 120)),
                (this.delay = o(e.delay, null)),
                (this.dashGap = o(e.dashGap, 1)),
                (this.forceRender = e.hasOwnProperty("forceRender") ?
                    !!e.forceRender :
                    this.isIE),
                (this.selfDestroy = !!e.selfDestroy),
                (this.onReady = e.onReady),
                (this.frameLength =
                    this.currentFrame =
                    this.map =
                    this.delayUnit =
                    this.speed =
                    this.handle =
                    null),
                (this.ignoreInvisible = e.hasOwnProperty("ignoreInvisible") ?
                    !!e.ignoreInvisible :
                    !1),
                (this.animTimingFunction = e.animTimingFunction || n.LINEAR),
                (this.pathTimingFunction = e.pathTimingFunction || n.LINEAR),
                this.delay >= this.duration)
        )
            throw new Error(
                "Vivus [constructor]: delay must be shorter than duration"
            );
    }),
    (n.prototype.setCallback = function(t) {
        if (t && t.constructor !== Function)
            throw new Error(
                'Vivus [constructor]: "callback" parameter must be a function'
            );
        this.callback = t || function() {};
    }),
    (n.prototype.mapping = function() {
        var e, r, n, i, a, s, h, u;
        for (
            u = s = h = 0, r = this.el.querySelectorAll("path"), e = 0; e < r.length; e++
        )
            (n = r[e]),
            this.isInvisible(n) ||
            ((a = { el: n, length: Math.ceil(n.getTotalLength()) }),
                isNaN(a.length) ?
                t.console &&
                console.warn &&
                console.warn(
                    "Vivus [mapping]: cannot retrieve a path element length",
                    n
                ) :
                (this.map.push(a),
                    (n.style.strokeDasharray =
                        a.length +
                        " " +
                        (a.length + 2 * this.dashGap)),
                    (n.style.strokeDashoffset =
                        a.length + this.dashGap),
                    (a.length += this.dashGap),
                    (s += a.length),
                    this.renderPath(e)));
        for (
            s = 0 === s ? 1 : s,
            this.delay =
            null === this.delay ? this.duration / 3 : this.delay,
            this.delayUnit =
            this.delay / (r.length > 1 ? r.length - 1 : 1),
            e = 0; e < this.map.length; e++
        ) {
            switch (((a = this.map[e]), this.type)) {
                case "delayed":
                    (a.startAt = this.delayUnit * e),
                    (a.duration = this.duration - this.delay);
                    break;
                case "oneByOne":
                    (a.startAt = (h / s) * this.duration),
                    (a.duration = (a.length / s) * this.duration);
                    break;
                case "async":
                    (a.startAt = 0), (a.duration = this.duration);
                    break;
                case "scenario-sync":
                    (n = r[e]),
                    (i = this.parseAttr(n)),
                    (a.startAt =
                        u + (o(i["data-delay"], this.delayUnit) || 0)),
                    (a.duration = o(i["data-duration"], this.duration)),
                    (u =
                        void 0 !== i["data-async"] ?
                        a.startAt :
                        a.startAt + a.duration),
                    (this.frameLength = Math.max(
                        this.frameLength,
                        a.startAt + a.duration
                    ));
                    break;
                case "scenario":
                    (n = r[e]),
                    (i = this.parseAttr(n)),
                    (a.startAt =
                        o(i["data-start"], this.delayUnit) || 0),
                    (a.duration = o(i["data-duration"], this.duration)),
                    (this.frameLength = Math.max(
                        this.frameLength,
                        a.startAt + a.duration
                    ));
            }
            (h += a.length),
            (this.frameLength = this.frameLength || this.duration);
        }
    }),
    (n.prototype.drawer = function() {
        var t = this;
        (this.currentFrame += this.speed),
        this.currentFrame <= 0 ?
            (this.stop(), this.reset(), this.callback(this)) :
            this.currentFrame >= this.frameLength ?
            (this.stop(),
                (this.currentFrame = this.frameLength),
                this.trace(),
                this.selfDestroy && this.destroy(),
                this.callback(this)) :
            (this.trace(),
                (this.handle = i(function() {
                    t.drawer();
                })));
    }),
    (n.prototype.trace = function() {
        var t, e, r, n;
        for (
            n =
            this.animTimingFunction(
                this.currentFrame / this.frameLength
            ) * this.frameLength,
            t = 0; t < this.map.length; t++
        )
            (r = this.map[t]),
            (e = (n - r.startAt) / r.duration),
            (e = this.pathTimingFunction(Math.max(0, Math.min(1, e)))),
            r.progress !== e &&
            ((r.progress = e),
                (r.el.style.strokeDashoffset = Math.floor(
                    r.length * (1 - e)
                )),
                this.renderPath(t));
    }),
    (n.prototype.renderPath = function(t) {
        if (this.forceRender && this.map && this.map[t]) {
            var e = this.map[t],
                r = e.el.cloneNode(!0);
            e.el.parentNode.replaceChild(r, e.el), (e.el = r);
        }
    }),
    (n.prototype.init = function() {
        (this.frameLength = 0),
        (this.currentFrame = 0),
        (this.map = []),
        new r(this.el),
            this.mapping(),
            this.starter(),
            this.onReady && this.onReady(this);
    }),
    (n.prototype.starter = function() {
        switch (this.start) {
            case "manual":
                return;
            case "autostart":
                this.play();
                break;
            case "inViewport":
                var e = this,
                    r = function() {
                        e.isInViewport(e.parentEl, 1) &&
                            (e.play(), t.removeEventListener("scroll", r));
                    };
                t.addEventListener("scroll", r), r();
        }
    }),
    (n.prototype.getStatus = function() {
        return 0 === this.currentFrame ?
            "start" :
            this.currentFrame === this.frameLength ?
            "end" :
            "progress";
    }),
    (n.prototype.reset = function() {
        return this.setFrameProgress(0);
    }),
    (n.prototype.finish = function() {
        return this.setFrameProgress(1);
    }),
    (n.prototype.setFrameProgress = function(t) {
        return (
            (t = Math.min(1, Math.max(0, t))),
            (this.currentFrame = Math.round(this.frameLength * t)),
            this.trace(),
            this
        );
    }),
    (n.prototype.play = function(t) {
        if (t && "number" != typeof t)
            throw new Error("Vivus [play]: invalid speed");
        return (this.speed = t || 1), this.handle || this.drawer(), this;
    }),
    (n.prototype.stop = function() {
        return this.handle && (a(this.handle), (this.handle = null)), this;
    }),
    (n.prototype.destroy = function() {
        var t, e;
        for (t = 0; t < this.map.length; t++)
            (e = this.map[t]),
            (e.el.style.strokeDashoffset = null),
            (e.el.style.strokeDasharray = null),
            this.renderPath(t);
    }),
    (n.prototype.isInvisible = function(t) {
        var e,
            r = t.getAttribute("data-ignore");
        return null !== r ?
            "false" !== r :
            this.ignoreInvisible ?
            ((e = t.getBoundingClientRect()), !e.width && !e.height) :
            !1;
    }),
    (n.prototype.parseAttr = function(t) {
        var e,
            r = {};
        if (t && t.attributes)
            for (var n = 0; n < t.attributes.length; n++)
                (e = t.attributes[n]), (r[e.name] = e.value);
        return r;
    }),
    (n.prototype.isInViewport = function(t, e) {
        var r = this.scrollY(),
            n = r + this.getViewportH(),
            i = t.getBoundingClientRect(),
            a = i.height,
            o = r + i.top,
            s = o + a;
        return (e = e || 0), n >= o + a * e && s >= r;
    }),
    (n.prototype.docElem = t.document.documentElement),
    (n.prototype.getViewportH = function() {
        var e = this.docElem.clientHeight,
            r = t.innerHeight;
        return r > e ? r : e;
    }),
    (n.prototype.scrollY = function() {
        return t.pageYOffset || this.docElem.scrollTop;
    }),
    (i = (function() {
        return (
            t.requestAnimationFrame ||
            t.webkitRequestAnimationFrame ||
            t.mozRequestAnimationFrame ||
            t.oRequestAnimationFrame ||
            t.msRequestAnimationFrame ||
            function(e) {
                return t.setTimeout(e, 1e3 / 60);
            }
        );
    })()),
    (a = (function() {
        return (
            t.cancelAnimationFrame ||
            t.webkitCancelAnimationFrame ||
            t.mozCancelAnimationFrame ||
            t.oCancelAnimationFrame ||
            t.msCancelAnimationFrame ||
            function(e) {
                return t.clearTimeout(e);
            }
        );
    })()),
    (o = function(t, e) {
        var r = parseInt(t, 10);
        return r >= 0 ? r : e;
    }),
    "function" == typeof define && define.amd ?
        define([], function() {
            return n;
        }) :
        "object" == typeof exports ?
        (module.exports = n) :
        (t.Vivus = n);
})(window, document);
/*! popover */
!(function(t, e, i) {
    "use strict";
    var o;
    (o = function(i) {
        var o = "webuiPopover",
            n = "webui-popover",
            s = "webui.popover",
            h = {
                placement: "auto",
                container: null,
                width: "auto",
                height: "auto",
                trigger: "click",
                style: "",
                selector: !1,
                delay: { show: null, hide: 300 },
                async: {
                    type: "GET",
                    before: null,
                    success: null,
                    error: null,
                },
                cache: !0,
                multi: !1,
                arrow: !0,
                title: "",
                content: "",
                closeable: !1,
                padding: !0,
                url: "",
                type: "html",
                direction: "",
                animation: null,
                template: '<div class="webui-popover"><div class="webui-arrow"></div><div class="webui-popover-inner"><a href="#" class="close"></a><h3 class="webui-popover-title"></h3><div class="webui-popover-content"><i class="icon-refresh"></i> <p>&nbsp;</p></div></div></div>',
                backdrop: !1,
                dismissible: !0,
                onShow: null,
                onHide: null,
                abortXHR: !0,
                autoHide: !1,
                offsetTop: 0,
                offsetLeft: 0,
                iframeOptions: {
                    frameborder: "0",
                    allowtransparency: "true",
                    id: "",
                    name: "",
                    scrolling: "",
                    onload: "",
                    height: "",
                    width: "",
                },
                hideEmpty: !1,
            },
            r = n + "-rtl",
            a = [],
            l = i('<div class="webui-popover-backdrop"></div>'),
            c = 0,
            p = !1,
            f = -2e3,
            d = i(e),
            u = function(t, e) {
                return isNaN(t) ? e || 0 : Number(t);
            },
            g = function(t) {
                return t.data("plugin_" + o);
            },
            m = function() {
                for (var t = null, e = 0; e < a.length; e++)
                    (t = g(a[e])) && t.hide(!0);
                d.trigger("hiddenAll." + s);
            },
            v =
            "ontouchstart" in e.documentElement &&
            /Mobi/.test(navigator.userAgent),
            y = function(t) {
                var e = { x: 0, y: 0 };
                if (
                    "touchstart" === t.type ||
                    "touchmove" === t.type ||
                    "touchend" === t.type ||
                    "touchcancel" === t.type
                ) {
                    var i =
                        t.originalEvent.touches[0] ||
                        t.originalEvent.changedTouches[0];
                    (e.x = i.pageX), (e.y = i.pageY);
                } else
                    ("mousedown" !== t.type &&
                        "mouseup" !== t.type &&
                        "click" !== t.type) ||
                    ((e.x = t.pageX), (e.y = t.pageY));
                return e;
            };

        function w(t, e) {
            return (
                (this.$element = i(t)),
                e &&
                (("string" !== i.type(e.delay) &&
                        "number" !== i.type(e.delay)) ||
                    (e.delay = { show: e.delay, hide: e.delay })),
                (this.options = i.extend({}, h, e)),
                (this._defaults = h),
                (this._name = o),
                (this._targetclick = !1),
                this.init(),
                a.push(this.$element),
                this
            );
        }
        (w.prototype = {
            init: function() {
                if (
                    this.$element[0] instanceof e.constructor &&
                    !this.options.selector
                )
                    throw new Error(
                        "`selector` option must be specified when initializing " +
                        this.type +
                        " on the window.document object!"
                    );
                "manual" !== this.getTrigger() &&
                    (v ?
                        this.$element
                        .off("touchend", this.options.selector)
                        .on(
                            "touchend",
                            this.options.selector,
                            i.proxy(this.toggle, this)
                        ) :
                        "click" === this.getTrigger() ?
                        this.$element
                        .off("click", this.options.selector)
                        .on(
                            "click",
                            this.options.selector,
                            i.proxy(this.toggle, this)
                        ) :
                        "hover" === this.getTrigger() &&
                        this.$element
                        .off(
                            "mouseenter mouseleave click",
                            this.options.selector
                        )
                        .on(
                            "mouseenter",
                            this.options.selector,
                            i.proxy(this.mouseenterHandler, this)
                        )
                        .on(
                            "mouseleave",
                            this.options.selector,
                            i.proxy(this.mouseleaveHandler, this)
                        )),
                    (this._poped = !1),
                    (this._inited = !0),
                    (this._opened = !1),
                    (this._idSeed = c),
                    (this.id = o + this._idSeed),
                    (this.options.container = i(
                        this.options.container || e.body
                    ).first()),
                    this.options.backdrop &&
                    l.appendTo(this.options.container).hide(),
                    c++,
                    "sticky" === this.getTrigger() && this.show(),
                    this.options.selector &&
                    (this._options = i.extend({}, this.options, {
                        selector: "",
                    }));
            },
            destroy: function() {
                for (var t = -1, e = 0; e < a.length; e++)
                    if (a[e] === this.$element) {
                        t = e;
                        break;
                    }
                a.splice(t, 1),
                    this.hide(),
                    this.$element.data("plugin_" + o, null),
                    "click" === this.getTrigger() ?
                    this.$element.off("click") :
                    "hover" === this.getTrigger() &&
                    this.$element.off("mouseenter mouseleave"),
                    this.$target && this.$target.remove();
            },
            getDelegateOptions: function() {
                var t = {};
                return (
                    this._options &&
                    i.each(this._options, function(e, i) {
                        h[e] !== i && (t[e] = i);
                    }),
                    t
                );
            },
            hide: function(t, e) {
                if ((t || "sticky" !== this.getTrigger()) && this._opened) {
                    e && (e.preventDefault(), e.stopPropagation()),
                        this.xhr &&
                        !0 === this.options.abortXHR &&
                        (this.xhr.abort(), (this.xhr = null));
                    var o = i.Event("hide." + s);
                    if (
                        (this.$element.trigger(o, [this.$target]), this.$target)
                    ) {
                        this.$target
                            .removeClass("in")
                            .addClass(this.getHideAnimation());
                        var n = this;
                        setTimeout(function() {
                            n.$target.hide(),
                                n.getCache() || n.$target.remove();
                        }, n.getHideDelay());
                    }
                    this.options.backdrop && l.hide(),
                        (this._opened = !1),
                        this.$element.trigger("hidden." + s, [this.$target]),
                        this.options.onHide &&
                        this.options.onHide(this.$target);
                }
            },
            resetAutoHide: function() {
                var t = this,
                    e = t.getAutoHide();
                e &&
                    (t.autoHideHandler && clearTimeout(t.autoHideHandler),
                        (t.autoHideHandler = setTimeout(function() {
                            t.hide();
                        }, e)));
            },
            delegate: function(t) {
                var e = i(t).data("plugin_" + o);
                return (
                    e ||
                    ((e = new w(t, this.getDelegateOptions())),
                        i(t).data("plugin_" + o, e)),
                    e
                );
            },
            toggle: function(t) {
                var e = this;
                t &&
                    (t.preventDefault(),
                        t.stopPropagation(),
                        this.options.selector &&
                        (e = this.delegate(t.currentTarget))),
                    e[e.getTarget().hasClass("in") ? "hide" : "show"]();
            },
            hideAll: function() {
                m();
            },
            hideOthers: function() {
                !(function(t) {
                    for (var e = null, i = 0; i < a.length; i++)
                        (e = g(a[i])) && e.id !== t.id && e.hide(!0);
                    d.trigger("hiddenAll." + s);
                })(this);
            },
            show: function() {
                if (!this._opened) {
                    var t = this.getTarget()
                        .removeClass()
                        .addClass(n)
                        .addClass(this._customTargetClass);
                    if (
                        (this.options.multi || this.hideOthers(), !this.getCache() || !this._poped || "" === this.content)
                    ) {
                        if (
                            ((this.content = ""),
                                this.setTitle(this.getTitle()),
                                this.options.closeable ||
                                t.find(".close").off("click").remove(),
                                this.isAsync() ?
                                this.setContentASync(this.options.content) :
                                this.setContent(this.getContent()),
                                this.canEmptyHide() && "" === this.content)
                        )
                            return;
                        t.show();
                    }
                    this.displayContent(),
                        this.options.onShow && this.options.onShow(t),
                        this.bindBodyEvents(),
                        this.options.backdrop && l.show(),
                        (this._opened = !0),
                        this.resetAutoHide();
                }
            },
            displayContent: function() {
                var t,
                    e = this.getElementPosition(),
                    o = this.getTarget()
                    .removeClass()
                    .addClass(n)
                    .addClass(this._customTargetClass),
                    h = this.getContentElement(),
                    a = o[0].offsetWidth,
                    l = o[0].offsetHeight,
                    c = i.Event("show." + s);
                if (this.canEmptyHide()) {
                    var p = h.children().html();
                    if (null !== p && 0 === p.trim().length) return;
                }
                this.$element.trigger(c, [o]);
                var d = this.$element.data("width") || this.options.width;
                "" === d && (d = this._defaults.width),
                    "auto" !== d && o.width(d);
                var u = this.$element.data("height") || this.options.height;
                "" === u && (u = this._defaults.height),
                    "auto" !== u && h.height(u),
                    this.options.style &&
                    this.$target.addClass(n + "-" + this.options.style),
                    "rtl" !== this.options.direction ||
                    h.hasClass(r) ||
                    h.addClass(r),
                    this.options.arrow || o.find(".webui-arrow").remove(),
                    o.detach().css({ top: f, left: f, display: "block" }),
                    this.getAnimation() && o.addClass(this.getAnimation()),
                    o.appendTo(this.options.container),
                    (t = this.getPlacement(e)),
                    this.$element.trigger("added." + s),
                    this.initTargetEvents(),
                    this.options.padding ||
                    ("auto" !== this.options.height &&
                        h.css("height", h.outerHeight()),
                        this.$target.addClass("webui-no-padding")),
                    this.options.maxHeight &&
                    h.css("maxHeight", this.options.maxHeight),
                    this.options.maxWidth &&
                    h.css("maxWidth", this.options.maxWidth),
                    (a = o[0].offsetWidth),
                    (l = o[0].offsetHeight);
                var g = this.getTargetPositin(e, t, a, l);
                if (
                    (this.$target.css(g.position).addClass(t).addClass("in"),
                        "iframe" === this.options.type)
                ) {
                    var m = o.find("iframe"),
                        v = o.width(),
                        y = m.parent().height();
                    "" !== this.options.iframeOptions.width &&
                        "auto" !== this.options.iframeOptions.width &&
                        (v = this.options.iframeOptions.width),
                        "" !== this.options.iframeOptions.height &&
                        "auto" !== this.options.iframeOptions.height &&
                        (y = this.options.iframeOptions.height),
                        m.width(v).height(y);
                }
                if (
                    (this.options.arrow || this.$target.css({ margin: 0 }),
                        this.options.arrow)
                ) {
                    var w = this.$target.find(".webui-arrow");
                    w.removeAttr("style"),
                        "left" === t || "right" === t ?
                        w.css({ top: this.$target.height() / 2 }) :
                        ("top" !== t && "bottom" !== t) ||
                        w.css({ left: this.$target.width() / 2 }),
                        g.arrowOffset &&
                        (-1 === g.arrowOffset.left ||
                            -1 === g.arrowOffset.top ?
                            w.hide() :
                            w.css(g.arrowOffset));
                }
                (this._poped = !0),
                this.$element.trigger("shown." + s, [this.$target]);
            },
            isTargetLoaded: function() {
                return (
                    0 === this.getTarget().find("i.glyphicon-refresh").length
                );
            },
            getTriggerElement: function() {
                return this.$element;
            },
            getTarget: function() {
                if (!this.$target) {
                    var t = o + this._idSeed;
                    (this.$target = i(this.options.template).attr("id", t)),
                    (this._customTargetClass =
                        this.$target.attr("class") !== n ?
                        this.$target.attr("class") :
                        null),
                    this.getTriggerElement().attr("data-target", t);
                }
                return (
                    this.$target.data("trigger-element") ||
                    this.$target.data(
                        "trigger-element",
                        this.getTriggerElement()
                    ),
                    this.$target
                );
            },
            removeTarget: function() {
                this.$target.remove(),
                    (this.$target = null),
                    (this.$contentElement = null);
            },
            getTitleElement: function() {
                return this.getTarget().find("." + n + "-title");
            },
            getContentElement: function() {
                return (
                    this.$contentElement ||
                    (this.$contentElement = this.getTarget().find(
                        "." + n + "-content"
                    )),
                    this.$contentElement
                );
            },
            getTitle: function() {
                return (
                    this.$element.attr("data-title") ||
                    this.options.title ||
                    this.$element.attr("title")
                );
            },
            getUrl: function() {
                return this.$element.attr("data-url") || this.options.url;
            },
            getAutoHide: function() {
                return (
                    this.$element.attr("data-auto-hide") ||
                    this.options.autoHide
                );
            },
            getOffsetTop: function() {
                return (
                    u(this.$element.attr("data-offset-top")) ||
                    this.options.offsetTop
                );
            },
            getOffsetLeft: function() {
                return (
                    u(this.$element.attr("data-offset-left")) ||
                    this.options.offsetLeft
                );
            },
            getCache: function() {
                var t = this.$element.attr("data-cache");
                if (void 0 !== t)
                    switch (t.toLowerCase()) {
                        case "true":
                        case "yes":
                        case "1":
                            return !0;
                        case "false":
                        case "no":
                        case "0":
                            return !1;
                    }
                return this.options.cache;
            },
            getTrigger: function() {
                return (
                    this.$element.attr("data-trigger") || this.options.trigger
                );
            },
            getDelayShow: function() {
                var t = this.$element.attr("data-delay-show");
                return void 0 !== t ?
                    t :
                    0 === this.options.delay.show ?
                    0 :
                    this.options.delay.show || 100;
            },
            getHideDelay: function() {
                var t = this.$element.attr("data-delay-hide");
                return void 0 !== t ?
                    t :
                    0 === this.options.delay.hide ?
                    0 :
                    this.options.delay.hide || 100;
            },
            getAnimation: function() {
                return (
                    this.$element.attr("data-animation") ||
                    this.options.animation
                );
            },
            getHideAnimation: function() {
                var t = this.getAnimation();
                return t ? t + "-out" : "out";
            },
            setTitle: function(t) {
                var e = this.getTitleElement();
                t
                    ?
                    ("rtl" !== this.options.direction ||
                        e.hasClass(r) ||
                        e.addClass(r),
                        e.html(t)) :
                    e.remove();
            },
            hasContent: function() {
                return this.getContent();
            },
            canEmptyHide: function() {
                return this.options.hideEmpty && "html" === this.options.type;
            },
            getIframe: function() {
                var t = i("<iframe></iframe>").attr("src", this.getUrl()),
                    e = this;
                return (
                    i.each(this._defaults.iframeOptions, function(i) {
                        void 0 !== e.options.iframeOptions[i] &&
                            t.attr(i, e.options.iframeOptions[i]);
                    }),
                    t
                );
            },
            getContent: function() {
                if (this.getUrl())
                    switch (this.options.type) {
                        case "iframe":
                            this.content = this.getIframe();
                            break;
                        case "html":
                            try {
                                (this.content = i(this.getUrl())),
                                this.content.is(":visible") ||
                                    this.content.show();
                            } catch (t) {
                                throw new Error(
                                    "Unable to get popover content. Invalid selector specified."
                                );
                            }
                    }
                else if (!this.content) {
                    var t = "";
                    if (
                        ((t = i.isFunction(this.options.content) ?
                                this.options.content.apply(this.$element[0], [
                                    this,
                                ]) :
                                this.options.content),
                            (this.content =
                                this.$element.attr("data-content") || t), !this.content)
                    ) {
                        var e = this.$element.next();
                        e && e.hasClass(n + "-content") && (this.content = e);
                    }
                }
                return this.content;
            },
            setContent: function(t) {
                var e = this.getTarget(),
                    o = this.getContentElement();
                "string" == typeof t
                    ?
                    o.html(t) :
                    t instanceof i &&
                    (o.html(""),
                        this.options.cache ?
                        t.removeClass(n + "-content").appendTo(o) :
                        t
                        .clone(!0, !0)
                        .removeClass(n + "-content")
                        .appendTo(o)),
                    (this.$target = e);
            },
            isAsync: function() {
                return "async" === this.options.type;
            },
            setContentASync: function(t) {
                var e = this;
                this.xhr ||
                    (this.xhr = i.ajax({
                        url: this.getUrl(),
                        type: this.options.async.type,
                        cache: this.getCache(),
                        beforeSend: function(t, i) {
                            e.options.async.before &&
                                e.options.async.before(e, t, i);
                        },
                        success: function(o) {
                            e.bindBodyEvents(),
                                t && i.isFunction(t) ?
                                (e.content = t.apply(e.$element[0], [o])) :
                                (e.content = o),
                                e.setContent(e.content),
                                e.getContentElement().removeAttr("style"),
                                e.displayContent(),
                                e.options.async.success &&
                                e.options.async.success(e, o);
                        },
                        complete: function() {
                            e.xhr = null;
                        },
                        error: function(t, i) {
                            e.options.async.error &&
                                e.options.async.error(e, t, i);
                        },
                    }));
            },
            bindBodyEvents: function() {
                p ||
                    (this.options.dismissible && "click" === this.getTrigger() ?
                        v ?
                        d
                        .off("touchstart.webui-popover")
                        .on(
                            "touchstart.webui-popover",
                            i.proxy(this.bodyTouchStartHandler, this)
                        ) :
                        (d
                            .off("keyup.webui-popover")
                            .on(
                                "keyup.webui-popover",
                                i.proxy(this.escapeHandler, this)
                            ),
                            d
                            .off("click.webui-popover")
                            .on(
                                "click.webui-popover",
                                i.proxy(this.bodyClickHandler, this)
                            )) :
                        "hover" === this.getTrigger() &&
                        d
                        .off("touchend.webui-popover")
                        .on(
                            "touchend.webui-popover",
                            i.proxy(this.bodyClickHandler, this)
                        ));
            },
            mouseenterHandler: function(t) {
                var e = this;
                t &&
                    this.options.selector &&
                    (e = this.delegate(t.currentTarget)),
                    e._timeout && clearTimeout(e._timeout),
                    (e._enterTimeout = setTimeout(function() {
                        e.getTarget().is(":visible") || e.show();
                    }, this.getDelayShow()));
            },
            mouseleaveHandler: function() {
                var t = this;
                clearTimeout(t._enterTimeout),
                    (t._timeout = setTimeout(function() {
                        t.hide();
                    }, this.getHideDelay()));
            },
            escapeHandler: function(t) {
                27 === t.keyCode && this.hideAll();
            },
            bodyTouchStartHandler: function(t) {
                var e = this,
                    o = i(t.currentTarget);
                o.on("touchend", function(t) {
                        e.bodyClickHandler(t), o.off("touchend");
                    }),
                    o.on("touchmove", function() {
                        o.off("touchend");
                    });
            },
            bodyClickHandler: function(t) {
                p = !0;
                for (var e = !0, i = 0; i < a.length; i++) {
                    var o = g(a[i]);
                    if (o && o._opened) {
                        var n = o.getTarget().offset(),
                            s = n.left,
                            h = n.top,
                            r = n.left + o.getTarget().width(),
                            l = n.top + o.getTarget().height(),
                            c = y(t);
                        if (c.x >= s && c.x <= r && c.y >= h && c.y <= l) {
                            e = !1;
                            break;
                        }
                    }
                }
                e && m();
            },
            initTargetEvents: function() {
                "hover" === this.getTrigger() &&
                    this.$target
                    .off("mouseenter mouseleave")
                    .on("mouseenter", i.proxy(this.mouseenterHandler, this))
                    .on(
                        "mouseleave",
                        i.proxy(this.mouseleaveHandler, this)
                    ),
                    this.$target
                    .find(".close")
                    .off("click")
                    .on("click", i.proxy(this.hide, this, !0));
            },
            getPlacement: function(t) {
                var e,
                    i = this.options.container,
                    o = i.innerWidth(),
                    n = i.innerHeight(),
                    s = i.scrollTop(),
                    h = i.scrollLeft(),
                    r = Math.max(0, t.left - h),
                    a = Math.max(0, t.top - s),
                    l =
                    "horizontal" ===
                    (e =
                        "function" == typeof this.options.placement ?
                        this.options.placement.call(
                            this,
                            this.getTarget()[0],
                            this.$element[0]
                        ) :
                        this.$element.data("placement") ||
                        this.options.placement),
                    c = "vertical" === e;
                return (
                    "auto" === e || l || c ?
                    (e =
                        r < o / 3 ?
                        a < n / 3 ?
                        l ?
                        "right-bottom" :
                        "bottom-right" :
                        a < (2 * n) / 3 ?
                        c ?
                        a <= n / 2 ?
                        "bottom-right" :
                        "top-right" :
                        "right" :
                        l ?
                        "right-top" :
                        "top-right" :
                        r < (2 * o) / 3 ?
                        a < n / 3 ?
                        l ?
                        r <= o / 2 ?
                        "right-bottom" :
                        "left-bottom" :
                        "bottom" :
                        a < (2 * n) / 3 ?
                        l ?
                        r <= o / 2 ?
                        "right" :
                        "left" :
                        a <= n / 2 ?
                        "bottom" :
                        "top" :
                        l ?
                        r <= o / 2 ?
                        "right-top" :
                        "left-top" :
                        "top" :
                        a < n / 3 ?
                        l ?
                        "left-bottom" :
                        "bottom-left" :
                        a < (2 * n) / 3 ?
                        c ?
                        a <= n / 2 ?
                        "bottom-left" :
                        "top-left" :
                        "left" :
                        l ?
                        "left-top" :
                        "top-left") :
                    "auto-top" === e ?
                    (e =
                        r < o / 3 ?
                        "top-right" :
                        r < (2 * o) / 3 ?
                        "top" :
                        "top-left") :
                    "auto-bottom" === e ?
                    (e =
                        r < o / 3 ?
                        "bottom-right" :
                        r < (2 * o) / 3 ?
                        "bottom" :
                        "bottom-left") :
                    "auto-left" === e ?
                    (e =
                        a < n / 3 ?
                        "left-top" :
                        a < (2 * n) / 3 ?
                        "left" :
                        "left-bottom") :
                    "auto-right" === e &&
                    (e =
                        a < n / 3 ?
                        "right-bottom" :
                        a < (2 * n) / 3 ?
                        "right" :
                        "right-top"),
                    e
                );
            },
            getElementPosition: function() {
                var t = this.$element[0].getBoundingClientRect(),
                    o = this.options.container,
                    n = o.css("position");
                if (o.is(e.body) || "static" === n)
                    return i.extend({}, this.$element.offset(), {
                        width: this.$element[0].offsetWidth || t.width,
                        height: this.$element[0].offsetHeight || t.height,
                    });
                if ("fixed" === n) {
                    var s = o[0].getBoundingClientRect();
                    return {
                        top: t.top - s.top + o.scrollTop(),
                        left: t.left - s.left + o.scrollLeft(),
                        width: t.width,
                        height: t.height,
                    };
                }
                return "relative" === n ?
                    {
                        top: this.$element.offset().top - o.offset().top,
                        left: this.$element.offset().left - o.offset().left,
                        width: this.$element[0].offsetWidth || t.width,
                        height: this.$element[0].offsetHeight || t.height,
                    } :
                    void 0;
            },
            getTargetPositin: function(t, i, o, n) {
                var s = t,
                    h = this.options.container,
                    r = this.$element.outerWidth(),
                    a = this.$element.outerHeight(),
                    l = e.documentElement.scrollTop + h.scrollTop(),
                    c = e.documentElement.scrollLeft + h.scrollLeft(),
                    p = {},
                    d = null,
                    u = this.options.arrow ? 20 : 0,
                    g = r < u + 10 ? u : 0,
                    m = a < u + 10 ? u : 0,
                    v = 0,
                    y = e.documentElement.clientHeight + l,
                    w = e.documentElement.clientWidth + c,
                    b = s.left + s.width / 2 - g > 0,
                    $ = s.left + s.width / 2 + g < w,
                    T = s.top + s.height / 2 - m > 0,
                    C = s.top + s.height / 2 + m < y;
                switch (i) {
                    case "bottom":
                        p = {
                            top: s.top + s.height,
                            left: s.left + s.width / 2 - o / 2,
                        };
                        break;
                    case "top":
                        p = {
                            top: s.top - n,
                            left: s.left + s.width / 2 - o / 2,
                        };
                        break;
                    case "left":
                        p = {
                            top: s.top + s.height / 2 - n / 2,
                            left: s.left - o,
                        };
                        break;
                    case "right":
                        p = {
                            top: s.top + s.height / 2 - n / 2,
                            left: s.left + s.width,
                        };
                        break;
                    case "top-right":
                        (p = { top: s.top - n, left: b ? s.left - g : 10 }),
                        (d = { left: b ? Math.min(r, o) / 2 + g : f });
                        break;
                    case "top-left":
                        (v = $ ? g : -10),
                        (p = {
                            top: s.top - n,
                            left: s.left - o + s.width + v,
                        }),
                        (d = { left: $ ? o - Math.min(r, o) / 2 - g : f });
                        break;
                    case "bottom-right":
                        (p = {
                            top: s.top + s.height,
                            left: b ? s.left - g : 10,
                        }),
                        (d = { left: b ? Math.min(r, o) / 2 + g : f });
                        break;
                    case "bottom-left":
                        (v = $ ? g : -10),
                        (p = {
                            top: s.top + s.height,
                            left: s.left - o + s.width + v,
                        }),
                        (d = { left: $ ? o - Math.min(r, o) / 2 - g : f });
                        break;
                    case "right-top":
                        (v = C ? m : -10),
                        (p = {
                            top: s.top - n + s.height + v,
                            left: s.left + s.width,
                        }),
                        (d = { top: C ? n - Math.min(a, n) / 2 - m : f });
                        break;
                    case "right-bottom":
                        (p = {
                            top: T ? s.top - m : 10,
                            left: s.left + s.width,
                        }),
                        (d = { top: T ? Math.min(a, n) / 2 + m : f });
                        break;
                    case "left-top":
                        (v = C ? m : -10),
                        (p = {
                            top: s.top - n + s.height + v,
                            left: s.left - o,
                        }),
                        (d = { top: C ? n - Math.min(a, n) / 2 - m : f });
                        break;
                    case "left-bottom":
                        (p = { top: T ? s.top - m : 10, left: s.left - o }),
                        (d = { top: T ? Math.min(a, n) / 2 + m : f });
                }
                return (
                    (p.top += this.getOffsetTop()),
                    (p.left += this.getOffsetLeft()), { position: p, arrowOffset: d }
                );
            },
        }),
        (i.fn[o] = function(t, e) {
            var n = [],
                s = this.each(function() {
                    var s = i.data(this, "plugin_" + o);
                    s
                        ?
                        "destroy" === t ?
                        s.destroy() :
                        "string" == typeof t && n.push(s[t]()) :
                        (t ?
                            "string" == typeof t ?
                            "destroy" !== t &&
                            (e ||
                                ((s = new w(this, null)),
                                    n.push(s[t]()))) :
                            "object" == typeof t &&
                            (s = new w(this, t)) :
                            (s = new w(this, null)),
                            i.data(this, "plugin_" + o, s));
                });
            return n.length ? n : s;
        });
        var b = {
            show: function(t, e) {
                e
                    ?
                    i(t).webuiPopover(e).webuiPopover("show") :
                    i(t).webuiPopover("show");
            },
            hide: function(t) {
                i(t).webuiPopover("hide");
            },
            create: function(t, e) {
                (e = e || {}), i(t).webuiPopover(e);
            },
            isCreated: function(t) {
                var e = !0;
                return (
                    i(t).each(function(t, n) {
                        e = e && void 0 !== i(n).data("plugin_" + o);
                    }),
                    e
                );
            },
            hideAll: function() {
                m();
            },
            updateContent: function(t, e) {
                var n = i(t).data("plugin_" + o);
                if (n) {
                    var s = n.getCache();
                    (n.options.cache = !1),
                    (n.options.content = e),
                    n._opened ?
                        ((n._opened = !1), n.show()) :
                        n.isAsync() ?
                        n.setContentASync(e) :
                        n.setContent(e),
                        (n.options.cache = s);
                }
            },
            updateContentAsync: function(t, e) {
                var n = i(t).data("plugin_" + o);
                if (n) {
                    var s = n.getCache(),
                        h = n.options.type;
                    (n.options.cache = !1),
                    (n.options.url = e),
                    n._opened ?
                        ((n._opened = !1), n.show()) :
                        ((n.options.type = "async"),
                            n.setContentASync(n.content)),
                        (n.options.cache = s),
                        (n.options.type = h);
                }
            },
            setDefaultOptions: function(t) {
                h = i.extend({}, h, t);
            },
        };
        t.WebuiPopovers = b;
    }),
    "function" == typeof define && define.amd ?
        define(["jquery"], o) :
        "object" == typeof exports ?
        (module.exports = o(require("jquery"))) :
        o(t.jQuery);
})(window, document);
/*! fancyBox  */
!(function(t, e, n, o) {
    "use strict";

    function i(t) {
        var e = t.currentTarget,
            o = t.data ? t.data.options : {},
            i = o.selector ? n(o.selector) : t.data ? t.data.items : [],
            a = n(e).attr("data-fancybox") || "",
            s = 0,
            r = n.fancybox.getInstance();
        t.preventDefault(),
            (r && r.current.opts.$orig.is(e)) ||
            (a ?
                ((i = i.length ?
                        i.filter('[data-fancybox="' + a + '"]') :
                        n('[data-fancybox="' + a + '"]')),
                    (s = i.index(e)),
                    s < 0 && (s = 0)) :
                (i = [e]),
                n.fancybox.open(i, o, s));
    }
    if (n) {
        if (n.fn.fancybox) return void n.error("fancyBox already initialized");
        var a = {
                loop: !1,
                margin: [44, 0],
                gutter: 50,
                keyboard: !0,
                arrows: !0,
                infobar: !1,
                toolbar: !0,
                buttons: ["slideShow", "fullScreen", "thumbs", "close"],
                idleTime: 4,
                smallBtn: "auto",
                protect: !1,
                modal: !1,
                image: { preload: "auto" },
                ajax: { settings: { data: { fancybox: !0 } } },
                iframe: {
                    tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',
                    preload: !0,
                    css: {},
                    attr: { scrolling: "auto" },
                },
                animationEffect: "zoom",
                animationDuration: 366,
                zoomOpacity: "auto",
                transitionEffect: "fade",
                transitionDuration: 366,
                slideClass: "",
                baseClass: "",
                baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><button data-fancybox-prev title="{{PREV}}" class="fancybox-button fancybox-button--left"></button><div class="fancybox-infobar__body"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><button data-fancybox-next title="{{NEXT}}" class="fancybox-button fancybox-button--right"></button></div><div class="fancybox-toolbar">{{BUTTONS}}</div><div class="fancybox-navigation"><button data-fancybox-prev title="{{PREV}}" class="fancybox-arrow fancybox-arrow--left" /><button data-fancybox-next title="{{NEXT}}" class="fancybox-arrow fancybox-arrow--right" /></div><div class="fancybox-stage"></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div></div>',
                spinnerTpl: '<div class="fancybox-loading"></div>',
                errorTpl: '<div class="fancybox-error"><p>{{ERROR}}<p></div>',
                btnTpl: {
                    slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"></button>',
                    fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
                    thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"></button>',
                    close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',
                    smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>',
                },
                parentEl: "body",
                autoFocus: !0,
                backFocus: !0,
                trapFocus: !0,
                fullScreen: { autoStart: !1 },
                touch: { vertical: !0, momentum: !0 },
                hash: null,
                media: {},
                slideShow: { autoStart: !1, speed: 4e3 },
                thumbs: { autoStart: !1, hideOnClose: !0 },
                onInit: n.noop,
                beforeLoad: n.noop,
                afterLoad: n.noop,
                beforeShow: n.noop,
                afterShow: n.noop,
                beforeClose: n.noop,
                afterClose: n.noop,
                onActivate: n.noop,
                onDeactivate: n.noop,
                clickContent: function(t, e) {
                    return "image" === t.type && "zoom";
                },
                clickSlide: "close",
                clickOutside: "close",
                dblclickContent: !1,
                dblclickSlide: !1,
                dblclickOutside: !1,
                mobile: {
                    clickContent: function(t, e) {
                        return "image" === t.type && "toggleControls";
                    },
                    clickSlide: function(t, e) {
                        return "image" === t.type ? "toggleControls" : "close";
                    },
                    dblclickContent: function(t, e) {
                        return "image" === t.type && "zoom";
                    },
                    dblclickSlide: function(t, e) {
                        return "image" === t.type && "zoom";
                    },
                },
                lang: "en",
                i18n: {
                    en: {
                        CLOSE: "Close",
                        NEXT: "Next",
                        PREV: "Previous",
                        ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                        PLAY_START: "Start slideshow",
                        PLAY_STOP: "Pause slideshow",
                        FULL_SCREEN: "Full screen",
                        THUMBS: "Thumbnails",
                    },
                    de: {
                        CLOSE: "Schliessen",
                        NEXT: "Weiter",
                        PREV: "Zurück",
                        ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",
                        PLAY_START: "Diaschau starten",
                        PLAY_STOP: "Diaschau beenden",
                        FULL_SCREEN: "Vollbild",
                        THUMBS: "Vorschaubilder",
                    },
                },
            },
            s = n(t),
            r = n(e),
            c = 0,
            l = function(t) {
                return t && t.hasOwnProperty && t instanceof n;
            },
            u = (function() {
                return (
                    t.requestAnimationFrame ||
                    t.webkitRequestAnimationFrame ||
                    t.mozRequestAnimationFrame ||
                    t.oRequestAnimationFrame ||
                    function(e) {
                        return t.setTimeout(e, 1e3 / 60);
                    }
                );
            })(),
            d = (function() {
                var t,
                    n = e.createElement("fakeelement"),
                    i = {
                        transition: "transitionend",
                        OTransition: "oTransitionEnd",
                        MozTransition: "transitionend",
                        WebkitTransition: "webkitTransitionEnd",
                    };
                for (t in i)
                    if (n.style[t] !== o) return i[t];
            })(),
            f = function(t) {
                return t && t.length && t[0].offsetHeight;
            },
            h = function(t, o, i) {
                var s = this;
                (s.opts = n.extend(!0, { index: i }, a, o || {})),
                o && n.isArray(o.buttons) && (s.opts.buttons = o.buttons),
                    (s.id = s.opts.id || ++c),
                    (s.group = []),
                    (s.currIndex = parseInt(s.opts.index, 10) || 0),
                    (s.prevIndex = null),
                    (s.prevPos = null),
                    (s.currPos = 0),
                    (s.firstRun = null),
                    s.createGroup(t),
                    s.group.length &&
                    ((s.$lastFocus = n(e.activeElement).blur()),
                        (s.slides = {}),
                        s.init(t));
            };
        n.extend(h.prototype, {
                init: function() {
                    var t,
                        e,
                        o,
                        i = this,
                        a = i.group[i.currIndex].opts;
                    (i.scrollTop = r.scrollTop()),
                    (i.scrollLeft = r.scrollLeft()),
                    n.fancybox.getInstance() ||
                        n.fancybox.isMobile ||
                        "hidden" === n("body").css("overflow") ||
                        ((t = n("body").width()),
                            n("html").addClass("fancybox-enabled"),
                            (t = n("body").width() - t),
                            t > 1 &&
                            n("head").append(
                                '<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar, .fancybox-enabled body { margin-right: ' +
                                t +
                                "px; }</style>"
                            )),
                        (o = ""),
                        n.each(a.buttons, function(t, e) {
                            o += a.btnTpl[e] || "";
                        }),
                        (e = n(i.translate(i, a.baseTpl.replace("{{BUTTONS}}", o)))
                            .addClass("fancybox-is-hidden")
                            .attr("id", "fancybox-container-" + i.id)
                            .addClass(a.baseClass)
                            .data("FancyBox", i)
                            .prependTo(a.parentEl)),
                        (i.$refs = { container: e }), [
                            "bg",
                            "inner",
                            "infobar",
                            "toolbar",
                            "stage",
                            "caption",
                        ].forEach(function(t) {
                            i.$refs[t] = e.find(".fancybox-" + t);
                        }),
                        (!a.arrows || i.group.length < 2) &&
                        e.find(".fancybox-navigation").remove(),
                        a.infobar || i.$refs.infobar.remove(),
                        a.toolbar || i.$refs.toolbar.remove(),
                        i.trigger("onInit"),
                        i.activate(),
                        i.jumpTo(i.currIndex);
                },
                translate: function(t, e) {
                    var n = t.opts.i18n[t.opts.lang];
                    return e.replace(/\{\{(\w+)\}\}/g, function(t, e) {
                        var i = n[e];
                        return i === o ? t : i;
                    });
                },
                createGroup: function(t) {
                    var e = this,
                        i = n.makeArray(t);
                    n.each(i, function(t, i) {
                        var a,
                            s,
                            r,
                            c,
                            l = {},
                            u = {},
                            d = [];
                        n.isPlainObject(i) ?
                            ((l = i), (u = i.opts || i)) :
                            "object" === n.type(i) && n(i).length ?
                            ((a = n(i)),
                                (d = a.data()),
                                (u = "options" in d ? d.options : {}),
                                (u = "object" === n.type(u) ? u : {}),
                                (l.src =
                                    "src" in d ? d.src : u.src || a.attr("href")), [
                                    "width",
                                    "height",
                                    "thumb",
                                    "type",
                                    "filter",
                                ].forEach(function(t) {
                                    t in d && (u[t] = d[t]);
                                }),
                                "srcset" in d && (u.image = { srcset: d.srcset }),
                                (u.$orig = a),
                                l.type || l.src || ((l.type = "inline"), (l.src = i))) :
                            (l = { type: "html", src: i + "" }),
                            (l.opts = n.extend(!0, {}, e.opts, u)),
                            n.fancybox.isMobile &&
                            (l.opts = n.extend(!0, {}, l.opts, l.opts.mobile)),
                            (s = l.type || l.opts.type),
                            (r = l.src || ""), !s &&
                            r &&
                            (r.match(
                                    /(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i
                                ) ?
                                (s = "image") :
                                r.match(/\.(pdf)((\?|#).*)?$/i) ?
                                (s = "pdf") :
                                "#" === r.charAt(0) && (s = "inline")),
                            (l.type = s),
                            (l.index = e.group.length),
                            l.opts.$orig &&
                            !l.opts.$orig.length &&
                            delete l.opts.$orig, !l.opts.$thumb &&
                            l.opts.$orig &&
                            (l.opts.$thumb = l.opts.$orig.find("img:first")),
                            l.opts.$thumb &&
                            !l.opts.$thumb.length &&
                            delete l.opts.$thumb,
                            "function" === n.type(l.opts.caption) ?
                            (l.opts.caption = l.opts.caption.apply(i, [e, l])) :
                            "caption" in d && (l.opts.caption = d.caption),
                            (l.opts.caption =
                                l.opts.caption === o ? "" : l.opts.caption + ""),
                            "ajax" === s &&
                            ((c = r.split(/\s+/, 2)),
                                c.length > 1 &&
                                ((l.src = c.shift()),
                                    (l.opts.filter = c.shift()))),
                            "auto" == l.opts.smallBtn &&
                            (n.inArray(s, ["html", "inline", "ajax"]) > -1 ?
                                ((l.opts.toolbar = !1),
                                    (l.opts.smallBtn = !0)) :
                                (l.opts.smallBtn = !1)),
                            "pdf" === s &&
                            ((l.type = "iframe"), (l.opts.iframe.preload = !1)),
                            l.opts.modal &&
                            (l.opts = n.extend(!0, l.opts, {
                                infobar: 0,
                                toolbar: 0,
                                smallBtn: 0,
                                keyboard: 0,
                                slideShow: 0,
                                fullScreen: 0,
                                thumbs: 0,
                                touch: 0,
                                clickContent: !1,
                                clickSlide: !1,
                                clickOutside: !1,
                                dblclickContent: !1,
                                dblclickSlide: !1,
                                dblclickOutside: !1,
                            })),
                            e.group.push(l);
                    });
                },
                addEvents: function() {
                    var o = this;
                    o.removeEvents(),
                        o.$refs.container
                        .on(
                            "click.fb-close",
                            "[data-fancybox-close]",
                            function(t) {
                                t.stopPropagation(),
                                    t.preventDefault(),
                                    o.close(t);
                            }
                        )
                        .on(
                            "click.fb-prev touchend.fb-prev",
                            "[data-fancybox-prev]",
                            function(t) {
                                t.stopPropagation(),
                                    t.preventDefault(),
                                    o.previous();
                            }
                        )
                        .on(
                            "click.fb-next touchend.fb-next",
                            "[data-fancybox-next]",
                            function(t) {
                                t.stopPropagation(),
                                    t.preventDefault(),
                                    o.next();
                            }
                        ),
                        s.on("orientationchange.fb resize.fb", function(t) {
                            t &&
                                t.originalEvent &&
                                "resize" === t.originalEvent.type ?
                                u(function() {
                                    o.update();
                                }) :
                                (o.$refs.stage.hide(),
                                    setTimeout(function() {
                                        o.$refs.stage.show(), o.update();
                                    }, 500));
                        }),
                        r.on("focusin.fb", function(t) {
                            var i = n.fancybox ? n.fancybox.getInstance() : null;
                            i.isClosing ||
                                !i.current ||
                                !i.current.opts.trapFocus ||
                                n(t.target).hasClass("fancybox-container") ||
                                n(t.target).is(e) ||
                                (i &&
                                    "fixed" !== n(t.target).css("position") &&
                                    !i.$refs.container.has(t.target).length &&
                                    (t.stopPropagation(),
                                        i.focus(),
                                        s
                                        .scrollTop(o.scrollTop)
                                        .scrollLeft(o.scrollLeft)));
                        }),
                        r.on("keydown.fb", function(t) {
                            var e = o.current,
                                i = t.keyCode || t.which;
                            if (
                                e &&
                                e.opts.keyboard &&
                                !n(t.target).is("input") &&
                                !n(t.target).is("textarea")
                            )
                                return 8 === i || 27 === i ?
                                    (t.preventDefault(), void o.close(t)) :
                                    37 === i || 38 === i ?
                                    (t.preventDefault(), void o.previous()) :
                                    39 === i || 40 === i ?
                                    (t.preventDefault(), void o.next()) :
                                    void o.trigger("afterKeydown", t, i);
                        }),
                        o.group[o.currIndex].opts.idleTime &&
                        ((o.idleSecondsCounter = 0),
                            r.on(
                                "mousemove.fb-idle mouseenter.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",
                                function() {
                                    (o.idleSecondsCounter = 0),
                                    o.isIdle && o.showControls(),
                                        (o.isIdle = !1);
                                }
                            ),
                            (o.idleInterval = t.setInterval(function() {
                                o.idleSecondsCounter++,
                                    o.idleSecondsCounter >=
                                    o.group[o.currIndex].opts.idleTime &&
                                    ((o.isIdle = !0),
                                        (o.idleSecondsCounter = 0),
                                        o.hideControls());
                            }, 1e3)));
                },
                removeEvents: function() {
                    var e = this;
                    s.off("orientationchange.fb resize.fb"),
                        r.off("focusin.fb keydown.fb .fb-idle"),
                        this.$refs.container.off(".fb-close .fb-prev .fb-next"),
                        e.idleInterval &&
                        (t.clearInterval(e.idleInterval),
                            (e.idleInterval = null));
                },
                previous: function(t) {
                    return this.jumpTo(this.currPos - 1, t);
                },
                next: function(t) {
                    return this.jumpTo(this.currPos + 1, t);
                },
                jumpTo: function(t, e, i) {
                    var a,
                        s,
                        r,
                        c,
                        l,
                        u,
                        d,
                        h = this,
                        p = h.group.length;
                    if (!(
                            h.isSliding ||
                            h.isClosing ||
                            (h.isAnimating && h.firstRun)
                        )) {
                        if (
                            ((t = parseInt(t, 10)),
                                (s = h.current ? h.current.opts.loop : h.opts.loop), !s && (t < 0 || t >= p))
                        )
                            return !1;
                        if (
                            ((a = h.firstRun = null === h.firstRun), !(p < 2 && !a && h.isSliding))
                        ) {
                            if (
                                ((c = h.current),
                                    (h.prevIndex = h.currIndex),
                                    (h.prevPos = h.currPos),
                                    (r = h.createSlide(t)),
                                    p > 1 &&
                                    ((s || r.index > 0) && h.createSlide(t - 1),
                                        (s || r.index < p - 1) && h.createSlide(t + 1)),
                                    (h.current = r),
                                    (h.currIndex = r.index),
                                    (h.currPos = r.pos),
                                    h.trigger("beforeShow", a),
                                    h.updateControls(),
                                    (u = n.fancybox.getTranslate(r.$slide)),
                                    (r.isMoved =
                                        (0 !== u.left || 0 !== u.top) &&
                                        !r.$slide.hasClass("fancybox-animated")),
                                    (r.forcedDuration = o),
                                    n.isNumeric(e) ?
                                    (r.forcedDuration = e) :
                                    (e =
                                        r.opts[
                                            a ?
                                            "animationDuration" :
                                            "transitionDuration"
                                        ]),
                                    (e = parseInt(e, 10)),
                                    a)
                            )
                                return (
                                    r.opts.animationEffect &&
                                    e &&
                                    h.$refs.container.css(
                                        "transition-duration",
                                        e + "ms"
                                    ),
                                    h.$refs.container.removeClass(
                                        "fancybox-is-hidden"
                                    ),
                                    f(h.$refs.container),
                                    h.$refs.container.addClass("fancybox-is-open"),
                                    r.$slide.addClass("fancybox-slide--current"),
                                    h.loadSlide(r),
                                    void h.preload()
                                );
                            n.each(h.slides, function(t, e) {
                                    n.fancybox.stop(e.$slide);
                                }),
                                r.$slide
                                .removeClass(
                                    "fancybox-slide--next fancybox-slide--previous"
                                )
                                .addClass("fancybox-slide--current"),
                                r.isMoved ?
                                ((l = Math.round(r.$slide.width())),
                                    n.each(h.slides, function(t, o) {
                                        var i = o.pos - r.pos;
                                        n.fancybox.animate(
                                            o.$slide, {
                                                top: 0,
                                                left: i * l + i * o.opts.gutter,
                                            },
                                            e,
                                            function() {
                                                o.$slide
                                                    .removeAttr("style")
                                                    .removeClass(
                                                        "fancybox-slide--next fancybox-slide--previous"
                                                    ),
                                                    o.pos === h.currPos &&
                                                    ((r.isMoved = !1),
                                                        h.complete());
                                            }
                                        );
                                    })) :
                                h.$refs.stage.children().removeAttr("style"),
                                r.isLoaded ? h.revealContent(r) : h.loadSlide(r),
                                h.preload(),
                                c.pos !== r.pos &&
                                ((d =
                                        "fancybox-slide--" +
                                        (c.pos > r.pos ? "next" : "previous")),
                                    c.$slide.removeClass(
                                        "fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous"
                                    ),
                                    (c.isComplete = !1),
                                    e &&
                                    (r.isMoved || r.opts.transitionEffect) &&
                                    (r.isMoved ?
                                        c.$slide.addClass(d) :
                                        ((d =
                                                "fancybox-animated " +
                                                d +
                                                " fancybox-fx-" +
                                                r.opts.transitionEffect),
                                            n.fancybox.animate(
                                                c.$slide,
                                                d,
                                                e,
                                                function() {
                                                    c.$slide
                                                        .removeClass(d)
                                                        .removeAttr("style");
                                                }
                                            ))));
                        }
                    }
                },
                createSlide: function(t) {
                    var e,
                        o,
                        i = this;
                    return (
                        (o = t % i.group.length),
                        (o = o < 0 ? i.group.length + o : o), !i.slides[t] &&
                        i.group[o] &&
                        ((e = n('<div class="fancybox-slide"></div>').appendTo(
                                i.$refs.stage
                            )),
                            (i.slides[t] = n.extend(!0, {}, i.group[o], {
                                pos: t,
                                $slide: e,
                                isLoaded: !1,
                            })),
                            i.updateSlide(i.slides[t])),
                        i.slides[t]
                    );
                },
                scaleToActual: function(t, e, i) {
                    var a,
                        s,
                        r,
                        c,
                        l,
                        u = this,
                        d = u.current,
                        f = d.$content,
                        h = parseInt(d.$slide.width(), 10),
                        p = parseInt(d.$slide.height(), 10),
                        g = d.width,
                        b = d.height;
                    "image" != d.type ||
                        d.hasError ||
                        !f ||
                        u.isAnimating ||
                        (n.fancybox.stop(f),
                            (u.isAnimating = !0),
                            (t = t === o ? 0.5 * h : t),
                            (e = e === o ? 0.5 * p : e),
                            (a = n.fancybox.getTranslate(f)),
                            (c = g / a.width),
                            (l = b / a.height),
                            (s = 0.5 * h - 0.5 * g),
                            (r = 0.5 * p - 0.5 * b),
                            g > h &&
                            ((s = a.left * c - (t * c - t)),
                                s > 0 && (s = 0),
                                s < h - g && (s = h - g)),
                            b > p &&
                            ((r = a.top * l - (e * l - e)),
                                r > 0 && (r = 0),
                                r < p - b && (r = p - b)),
                            u.updateCursor(g, b),
                            n.fancybox.animate(
                                f, { top: r, left: s, scaleX: c, scaleY: l },
                                i || 330,
                                function() {
                                    u.isAnimating = !1;
                                }
                            ),
                            u.SlideShow && u.SlideShow.isActive && u.SlideShow.stop());
                },
                scaleToFit: function(t) {
                    var e,
                        o = this,
                        i = o.current,
                        a = i.$content;
                    "image" != i.type ||
                        i.hasError ||
                        !a ||
                        o.isAnimating ||
                        (n.fancybox.stop(a),
                            (o.isAnimating = !0),
                            (e = o.getFitPos(i)),
                            o.updateCursor(e.width, e.height),
                            n.fancybox.animate(
                                a, {
                                    top: e.top,
                                    left: e.left,
                                    scaleX: e.width / a.width(),
                                    scaleY: e.height / a.height(),
                                },
                                t || 330,
                                function() {
                                    o.isAnimating = !1;
                                }
                            ));
                },
                getFitPos: function(t) {
                    var e,
                        o,
                        i,
                        a,
                        r,
                        c = this,
                        l = t.$content,
                        u = t.width,
                        d = t.height,
                        f = t.opts.margin;
                    return (!(!l || !l.length || (!u && !d)) &&
                        ("number" === n.type(f) && (f = [f, f]),
                            2 == f.length && (f = [f[0], f[1], f[0], f[1]]),
                            s.width() < 800 && (f = [0, 0, 0, 0]),
                            (e = parseInt(c.$refs.stage.width(), 10) - (f[1] + f[3])),
                            (o = parseInt(c.$refs.stage.height(), 10) - (f[0] + f[2])),
                            (i = Math.min(1, e / u, o / d)),
                            (a = Math.floor(i * u)),
                            (r = Math.floor(i * d)), {
                                top: Math.floor(0.5 * (o - r)) + f[0],
                                left: Math.floor(0.5 * (e - a)) + f[3],
                                width: a,
                                height: r,
                            })
                    );
                },
                update: function() {
                    var t = this;
                    n.each(t.slides, function(e, n) {
                        t.updateSlide(n);
                    });
                },
                updateSlide: function(t) {
                    var e = this,
                        o = t.$content;
                    o &&
                        (t.width || t.height) &&
                        (n.fancybox.stop(o),
                            n.fancybox.setTranslate(o, e.getFitPos(t)),
                            t.pos === e.currPos && e.updateCursor()),
                        t.$slide.trigger("refresh"),
                        e.trigger("onUpdate", t);
                },
                updateCursor: function(t, e) {
                    var n,
                        i = this,
                        a = i.$refs.container.removeClass(
                            "fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut"
                        );
                    i.current &&
                        !i.isClosing &&
                        (i.isZoomable() ?
                            (a.addClass("fancybox-is-zoomable"),
                                (n =
                                    t !== o && e !== o ?
                                    t < i.current.width && e < i.current.height :
                                    i.isScaledDown()),
                                n ?
                                a.addClass("fancybox-can-zoomIn") :
                                i.current.opts.touch ?
                                a.addClass("fancybox-can-drag") :
                                a.addClass("fancybox-can-zoomOut")) :
                            i.current.opts.touch &&
                            a.addClass("fancybox-can-drag"));
                },
                isZoomable: function() {
                    var t,
                        e = this,
                        o = e.current;
                    if (o && !e.isClosing)
                        return !!(
                            "image" === o.type &&
                            o.isLoaded &&
                            !o.hasError &&
                            ("zoom" === o.opts.clickContent ||
                                (n.isFunction(o.opts.clickContent) &&
                                    "zoom" === o.opts.clickContent(o))) &&
                            ((t = e.getFitPos(o)),
                                o.width > t.width || o.height > t.height)
                        );
                },
                isScaledDown: function() {
                    var t = this,
                        e = t.current,
                        o = e.$content,
                        i = !1;
                    return (
                        o &&
                        ((i = n.fancybox.getTranslate(o)),
                            (i = i.width < e.width || i.height < e.height)),
                        i
                    );
                },
                canPan: function() {
                    var t = this,
                        e = t.current,
                        n = e.$content,
                        o = !1;
                    return (
                        n &&
                        ((o = t.getFitPos(e)),
                            (o =
                                Math.abs(n.width() - o.width) > 1 ||
                                Math.abs(n.height() - o.height) > 1)),
                        o
                    );
                },
                loadSlide: function(t) {
                    var e,
                        o,
                        i,
                        a = this;
                    if (!t.isLoading && !t.isLoaded) {
                        switch (
                            ((t.isLoading = !0),
                                a.trigger("beforeLoad", t),
                                (e = t.type),
                                (o = t.$slide),
                                o
                                .off("refresh")
                                .trigger("onReset")
                                .addClass("fancybox-slide--" + (e || "unknown"))
                                .addClass(t.opts.slideClass),
                                e)
                        ) {
                            case "image":
                                a.setImage(t);
                                break;
                            case "iframe":
                                a.setIframe(t);
                                break;
                            case "html":
                                a.setContent(t, t.src || t.content);
                                break;
                            case "inline":
                                n(t.src).length ?
                                    a.setContent(t, n(t.src)) :
                                    a.setError(t);
                                break;
                            case "ajax":
                                a.showLoading(t),
                                    (i = n.ajax(
                                        n.extend({}, t.opts.ajax.settings, {
                                            url: t.src,
                                            success: function(e, n) {
                                                "success" === n &&
                                                    a.setContent(t, e);
                                            },
                                            error: function(e, n) {
                                                e && "abort" !== n && a.setError(t);
                                            },
                                        })
                                    )),
                                    o.one("onReset", function() {
                                        i.abort();
                                    });
                                break;
                            default:
                                a.setError(t);
                        }
                        return !0;
                    }
                },
                setImage: function(e) {
                    var o,
                        i,
                        a,
                        s,
                        r = this,
                        c = e.opts.image.srcset;
                    if (c) {
                        (a = t.devicePixelRatio || 1),
                        (s = t.innerWidth * a),
                        (i = c.split(",").map(function(t) {
                            var e = {};
                            return (
                                t
                                .trim()
                                .split(/\s+/)
                                .forEach(function(t, n) {
                                    var o = parseInt(
                                        t.substring(0, t.length - 1),
                                        10
                                    );
                                    return 0 === n ?
                                        (e.url = t) :
                                        void(
                                            o &&
                                            ((e.value = o),
                                                (e.postfix = t[t.length - 1]))
                                        );
                                }),
                                e
                            );
                        })),
                        i.sort(function(t, e) {
                            return t.value - e.value;
                        });
                        for (var l = 0; l < i.length; l++) {
                            var u = i[l];
                            if (
                                ("w" === u.postfix && u.value >= s) ||
                                ("x" === u.postfix && u.value >= a)
                            ) {
                                o = u;
                                break;
                            }
                        }!o && i.length && (o = i[i.length - 1]),
                            o &&
                            ((e.src = o.url),
                                e.width &&
                                e.height &&
                                "w" == o.postfix &&
                                ((e.height = (e.width / e.height) * o.value),
                                    (e.width = o.value)));
                    }
                    (e.$content = n('<div class="fancybox-image-wrap"></div>')
                        .addClass("fancybox-is-hidden")
                        .appendTo(e.$slide)),
                    e.opts.preload !== !1 &&
                        e.opts.width &&
                        e.opts.height &&
                        (e.opts.thumb || e.opts.$thumb) ?
                        ((e.width = e.opts.width),
                            (e.height = e.opts.height),
                            (e.$ghost = n("<img />")
                                .one("error", function() {
                                    n(this).remove(),
                                        (e.$ghost = null),
                                        r.setBigImage(e);
                                })
                                .one("load", function() {
                                    r.afterLoad(e), r.setBigImage(e);
                                })
                                .addClass("fancybox-image")
                                .appendTo(e.$content)
                                .attr(
                                    "src",
                                    e.opts.thumb || e.opts.$thumb.attr("src")
                                ))) :
                        r.setBigImage(e);
                },
                setBigImage: function(t) {
                    var e = this,
                        o = n("<img />");
                    (t.$image = o
                        .one("error", function() {
                            e.setError(t);
                        })
                        .one("load", function() {
                            clearTimeout(t.timouts),
                                (t.timouts = null),
                                e.isClosing ||
                                ((t.width = this.naturalWidth),
                                    (t.height = this.naturalHeight),
                                    t.opts.image.srcset &&
                                    o
                                    .attr("sizes", "100vw")
                                    .attr("srcset", t.opts.image.srcset),
                                    e.hideLoading(t),
                                    t.$ghost ?
                                    (t.timouts = setTimeout(function() {
                                        (t.timouts = null), t.$ghost.hide();
                                    }, Math.min(
                                        300,
                                        Math.max(1e3, t.height / 1600)
                                    ))) :
                                    e.afterLoad(t));
                        })
                        .addClass("fancybox-image")
                        .attr("src", t.src)
                        .appendTo(t.$content)),
                    (o[0].complete || "complete" == o[0].readyState) &&
                    o[0].naturalWidth &&
                        o[0].naturalHeight ?
                        o.trigger("load") :
                        o[0].error ?
                        o.trigger("error") :
                        (t.timouts = setTimeout(function() {
                            o[0].complete || t.hasError || e.showLoading(t);
                        }, 100));
                },
                setIframe: function(t) {
                    var e,
                        i = this,
                        a = t.opts.iframe,
                        s = t.$slide;
                    (t.$content = n(
                            '<div class="fancybox-content' +
                            (a.preload ? " fancybox-is-hidden" : "") +
                            '"></div>'
                        )
                        .css(a.css)
                        .appendTo(s)),
                    (e = n(a.tpl.replace(/\{rnd\}/g, new Date().getTime()))
                        .attr(a.attr)
                        .appendTo(t.$content)),
                    a.preload ?
                        (i.showLoading(t),
                            e.on("load.fb error.fb", function(e) {
                                (this.isReady = 1),
                                t.$slide.trigger("refresh"),
                                    i.afterLoad(t);
                            }),
                            s.on("refresh.fb", function() {
                                var n,
                                    i,
                                    s,
                                    r = t.$content,
                                    c = a.css.width,
                                    l = a.css.height;
                                if (1 === e[0].isReady) {
                                    try {
                                        (i = e.contents()), (s = i.find("body"));
                                    } catch (t) {}
                                    s &&
                                        s.length &&
                                        (c === o &&
                                            ((n =
                                                    e[0].contentWindow.document
                                                    .documentElement.scrollWidth),
                                                (c = Math.ceil(
                                                    s.outerWidth(!0) + (r.width() - n)
                                                )),
                                                (c +=
                                                    r.outerWidth() - r.innerWidth())),
                                            l === o &&
                                            ((l = Math.ceil(s.outerHeight(!0))),
                                                (l +=
                                                    r.outerHeight() -
                                                    r.innerHeight())),
                                            c && r.width(c),
                                            l && r.height(l)),
                                        r.removeClass("fancybox-is-hidden");
                                }
                            })) :
                        this.afterLoad(t),
                        e.attr("src", t.src),
                        t.opts.smallBtn === !0 &&
                        t.$content.prepend(
                            i.translate(t, t.opts.btnTpl.smallBtn)
                        ),
                        s.one("onReset", function() {
                            try {
                                n(this)
                                    .find("iframe")
                                    .hide()
                                    .attr("src", "//about:blank");
                            } catch (t) {}
                            n(this).empty(), (t.isLoaded = !1);
                        });
                },
                setContent: function(t, e) {
                    var o = this;
                    o.isClosing ||
                        (o.hideLoading(t),
                            t.$slide.empty(),
                            l(e) && e.parent().length ?
                            (e
                                .parent(".fancybox-slide--inline")
                                .trigger("onReset"),
                                (t.$placeholder = n("<div></div>")
                                    .hide()
                                    .insertAfter(e)),
                                e.css("display", "inline-block")) :
                            t.hasError ||
                            ("string" === n.type(e) &&
                                ((e = n("<div>").append(n.trim(e)).contents()),
                                    3 === e[0].nodeType && (e = n("<div>").html(e))),
                                t.opts.filter &&
                                (e = n("<div>").html(e).find(t.opts.filter))),
                            t.$slide.one("onReset", function() {
                                t.$placeholder &&
                                    (t.$placeholder.after(e.hide()).remove(),
                                        (t.$placeholder = null)),
                                    t.$smallBtn &&
                                    (t.$smallBtn.remove(), (t.$smallBtn = null)),
                                    t.hasError || (n(this).empty(), (t.isLoaded = !1));
                            }),
                            (t.$content = n(e).appendTo(t.$slide)),
                            t.opts.smallBtn &&
                            !t.$smallBtn &&
                            (t.$smallBtn = n(
                                o.translate(t, t.opts.btnTpl.smallBtn)
                            ).appendTo(t.$content.filter("div").first())),
                            this.afterLoad(t));
                },
                setError: function(t) {
                    (t.hasError = !0),
                    t.$slide.removeClass("fancybox-slide--" + t.type),
                        this.setContent(t, this.translate(t, t.opts.errorTpl));
                },
                showLoading: function(t) {
                    var e = this;
                    (t = t || e.current),
                    t &&
                        !t.$spinner &&
                        (t.$spinner = n(e.opts.spinnerTpl).appendTo(t.$slide));
                },
                hideLoading: function(t) {
                    var e = this;
                    (t = t || e.current),
                    t && t.$spinner && (t.$spinner.remove(), delete t.$spinner);
                },
                afterLoad: function(t) {
                    var e = this;
                    e.isClosing ||
                        ((t.isLoading = !1),
                            (t.isLoaded = !0),
                            e.trigger("afterLoad", t),
                            e.hideLoading(t),
                            t.opts.protect &&
                            t.$content &&
                            !t.hasError &&
                            (t.$content.on("contextmenu.fb", function(t) {
                                    return 2 == t.button && t.preventDefault(), !0;
                                }),
                                "image" === t.type &&
                                n(
                                    '<div class="fancybox-spaceball"></div>'
                                ).appendTo(t.$content)),
                            e.revealContent(t));
                },
                revealContent: function(t) {
                    var e,
                        i,
                        a,
                        s,
                        r,
                        c = this,
                        l = t.$slide,
                        u = !1;
                    return (
                        (e =
                            t.opts[
                                c.firstRun ? "animationEffect" : "transitionEffect"
                            ]),
                        (a =
                            t.opts[
                                c.firstRun ?
                                "animationDuration" :
                                "transitionDuration"
                            ]),
                        (a = parseInt(
                            t.forcedDuration === o ? a : t.forcedDuration,
                            10
                        )),
                        (!t.isMoved && t.pos === c.currPos && a) || (e = !1),
                        "zoom" !== e ||
                        (t.pos === c.currPos &&
                            a &&
                            "image" === t.type &&
                            !t.hasError &&
                            (u = c.getThumbPos(t))) ||
                        (e = "fade"),
                        "zoom" === e ?
                        ((r = c.getFitPos(t)),
                            (r.scaleX = r.width / u.width),
                            (r.scaleY = r.height / u.height),
                            delete r.width,
                            delete r.height,
                            (s = t.opts.zoomOpacity),
                            "auto" == s &&
                            (s =
                                Math.abs(
                                    t.width / t.height - u.width / u.height
                                ) > 0.1),
                            s && ((u.opacity = 0.1), (r.opacity = 1)),
                            n.fancybox.setTranslate(
                                t.$content.removeClass("fancybox-is-hidden"),
                                u
                            ),
                            f(t.$content),
                            void n.fancybox.animate(
                                t.$content,
                                r,
                                a,
                                function() {
                                    c.complete();
                                }
                            )) :
                        (c.updateSlide(t),
                            e ?
                            (n.fancybox.stop(l),
                                (i =
                                    "fancybox-animated fancybox-slide--" +
                                    (t.pos > c.prevPos ? "next" : "previous") +
                                    " fancybox-fx-" +
                                    e),
                                l
                                .removeAttr("style")
                                .removeClass(
                                    "fancybox-slide--current fancybox-slide--next fancybox-slide--previous"
                                )
                                .addClass(i),
                                t.$content.removeClass("fancybox-is-hidden"),
                                f(l),
                                void n.fancybox.animate(
                                    l,
                                    "fancybox-slide--current",
                                    a,
                                    function(e) {
                                        l.removeClass(i).removeAttr("style"),
                                            t.pos === c.currPos && c.complete();
                                    }, !0
                                )) :
                            (f(l),
                                t.$content.removeClass("fancybox-is-hidden"),
                                void(t.pos === c.currPos && c.complete())))
                    );
                },
                getThumbPos: function(o) {
                    var i,
                        a = this,
                        s = !1,
                        r = function(e) {
                            for (
                                var o,
                                    i = e[0],
                                    a = i.getBoundingClientRect(),
                                    s = []; null !== i.parentElement;

                            )
                                ("hidden" !== n(i.parentElement).css("overflow") &&
                                    "auto" !==
                                    n(i.parentElement).css("overflow")) ||
                                s.push(i.parentElement.getBoundingClientRect()),
                                (i = i.parentElement);
                            return (
                                (o = s.every(function(t) {
                                    var e =
                                        Math.min(a.right, t.right) -
                                        Math.max(a.left, t.left),
                                        n =
                                        Math.min(a.bottom, t.bottom) -
                                        Math.max(a.top, t.top);
                                    return e > 0 && n > 0;
                                })),
                                o &&
                                a.bottom > 0 &&
                                a.right > 0 &&
                                a.left < n(t).width() &&
                                a.top < n(t).height()
                            );
                        },
                        c = o.opts.$thumb,
                        l = c ? c.offset() : 0;
                    return (
                        l &&
                        c[0].ownerDocument === e &&
                        r(c) &&
                        ((i = a.$refs.stage.offset()),
                            (s = {
                                top: l.top -
                                    i.top +
                                    parseFloat(c.css("border-top-width") || 0),
                                left: l.left -
                                    i.left +
                                    parseFloat(c.css("border-left-width") || 0),
                                width: c.width(),
                                height: c.height(),
                                scaleX: 1,
                                scaleY: 1,
                            })),
                        s
                    );
                },
                complete: function() {
                    var t = this,
                        o = t.current,
                        i = {};
                    o.isMoved ||
                        !o.isLoaded ||
                        o.isComplete ||
                        ((o.isComplete = !0),
                            o.$slide.siblings().trigger("onReset"),
                            f(o.$slide),
                            o.$slide.addClass("fancybox-slide--complete"),
                            n.each(t.slides, function(e, o) {
                                o.pos >= t.currPos - 1 && o.pos <= t.currPos + 1 ?
                                    (i[o.pos] = o) :
                                    o &&
                                    (n.fancybox.stop(o.$slide),
                                        o.$slide.off().remove());
                            }),
                            (t.slides = i),
                            t.updateCursor(),
                            t.trigger("afterShow"),
                            (n(e.activeElement).is("[disabled]") ||
                                (o.opts.autoFocus &&
                                    "image" != o.type &&
                                    "iframe" !== o.type)) &&
                            t.focus());
                },
                preload: function() {
                    var t,
                        e,
                        n = this;
                    n.group.length < 2 ||
                        ((t = n.slides[n.currPos + 1]),
                            (e = n.slides[n.currPos - 1]),
                            t && "image" === t.type && n.loadSlide(t),
                            e && "image" === e.type && n.loadSlide(e));
                },
                focus: function() {
                    var t,
                        e = this.current;
                    this.isClosing ||
                        (e &&
                            e.isComplete &&
                            ((t = e.$slide.find(
                                    "input[autofocus]:enabled:visible:first"
                                )),
                                t.length ||
                                (t = e.$slide
                                    .find("button,:input,[tabindex],a")
                                    .filter(":enabled:visible:first"))),
                            (t = t && t.length ? t : this.$refs.container),
                            t.focus());
                },
                activate: function() {
                    var t = this;
                    n(".fancybox-container").each(function() {
                            var e = n(this).data("FancyBox");
                            e &&
                                e.uid !== t.uid &&
                                !e.isClosing &&
                                e.trigger("onDeactivate");
                        }),
                        t.current &&
                        (t.$refs.container.index() > 0 &&
                            t.$refs.container.prependTo(e.body),
                            t.updateControls()),
                        t.trigger("onActivate"),
                        t.addEvents();
                },
                close: function(t, e) {
                    var o,
                        i,
                        a,
                        s,
                        r,
                        c,
                        l = this,
                        f = l.current,
                        h = function() {
                            l.cleanUp(t);
                        };
                    return (!l.isClosing &&
                        ((l.isClosing = !0),
                            l.trigger("beforeClose", t) === !1 ?
                            ((l.isClosing = !1),
                                u(function() {
                                    l.update();
                                }), !1) :
                            (l.removeEvents(),
                                f.timouts && clearTimeout(f.timouts),
                                (a = f.$content),
                                (o = f.opts.animationEffect),
                                (i = n.isNumeric(e) ?
                                    e :
                                    o ?
                                    f.opts.animationDuration :
                                    0),
                                f.$slide
                                .off(d)
                                .removeClass(
                                    "fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"
                                ),
                                f.$slide.siblings().trigger("onReset").remove(),
                                i &&
                                l.$refs.container
                                .removeClass("fancybox-is-open")
                                .addClass("fancybox-is-closing"),
                                l.hideLoading(f),
                                l.hideControls(),
                                l.updateCursor(),
                                "zoom" !== o ||
                                (t !== !0 &&
                                    a &&
                                    i &&
                                    "image" === f.type &&
                                    !f.hasError &&
                                    (c = l.getThumbPos(f))) ||
                                (o = "fade"),
                                "zoom" === o ?
                                (n.fancybox.stop(a),
                                    (r = n.fancybox.getTranslate(a)),
                                    (r.width = r.width * r.scaleX),
                                    (r.height = r.height * r.scaleY),
                                    (s = f.opts.zoomOpacity),
                                    "auto" == s &&
                                    (s =
                                        Math.abs(
                                            f.width / f.height -
                                            c.width / c.height
                                        ) > 0.1),
                                    s && (c.opacity = 0),
                                    (r.scaleX = r.width / c.width),
                                    (r.scaleY = r.height / c.height),
                                    (r.width = c.width),
                                    (r.height = c.height),
                                    n.fancybox.setTranslate(f.$content, r),
                                    n.fancybox.animate(f.$content, c, i, h), !0) :
                                (o && i ?
                                    t === !0 ?
                                    setTimeout(h, i) :
                                    n.fancybox.animate(
                                        f.$slide.removeClass(
                                            "fancybox-slide--current"
                                        ),
                                        "fancybox-animated fancybox-slide--previous fancybox-fx-" +
                                        o,
                                        i,
                                        h
                                    ) :
                                    h(), !0)))
                    );
                },
                cleanUp: function(t) {
                    var e,
                        o = this;
                    o.current.$slide.trigger("onReset"),
                        o.$refs.container.empty().remove(),
                        o.trigger("afterClose", t),
                        o.$lastFocus &&
                        o.current.opts.backFocus &&
                        o.$lastFocus.focus(),
                        (o.current = null),
                        (e = n.fancybox.getInstance()),
                        e ?
                        e.activate() :
                        (s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft),
                            n("html").removeClass("fancybox-enabled"),
                            n("#fancybox-style-noscroll").remove());
                },
                trigger: function(t, e) {
                    var o,
                        i = Array.prototype.slice.call(arguments, 1),
                        a = this,
                        s = e && e.opts ? e : a.current;
                    return (
                        s ? i.unshift(s) : (s = a),
                        i.unshift(a),
                        n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)),
                        o === !1 ?
                        o :
                        void("afterClose" === t ?
                            r.trigger(t + ".fb", i) :
                            a.$refs.container.trigger(t + ".fb", i))
                    );
                },
                updateControls: function(t) {
                    var e = this,
                        o = e.current,
                        i = o.index,
                        a = o.opts,
                        s = a.caption,
                        r = e.$refs.caption;
                    o.$slide.trigger("refresh"),
                        (e.$caption = s && s.length ? r.html(s) : null),
                        e.isHiddenControls || e.showControls(),
                        n("[data-fancybox-count]").html(e.group.length),
                        n("[data-fancybox-index]").html(i + 1),
                        n("[data-fancybox-prev]").prop(
                            "disabled", !a.loop && i <= 0
                        ),
                        n("[data-fancybox-next]").prop(
                            "disabled", !a.loop && i >= e.group.length - 1
                        );
                },
                hideControls: function() {
                    (this.isHiddenControls = !0),
                    this.$refs.container.removeClass(
                        "fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav"
                    );
                },
                showControls: function() {
                    var t = this,
                        e = t.current ? t.current.opts : t.opts,
                        n = t.$refs.container;
                    (t.isHiddenControls = !1),
                    (t.idleSecondsCounter = 0),
                    n
                        .toggleClass(
                            "fancybox-show-toolbar", !(!e.toolbar || !e.buttons)
                        )
                        .toggleClass(
                            "fancybox-show-infobar", !!(e.infobar && t.group.length > 1)
                        )
                        .toggleClass(
                            "fancybox-show-nav", !!(e.arrows && t.group.length > 1)
                        )
                        .toggleClass("fancybox-is-modal", !!e.modal),
                        t.$caption ?
                        n.addClass("fancybox-show-caption ") :
                        n.removeClass("fancybox-show-caption");
                },
                toggleControls: function() {
                    this.isHiddenControls ?
                        this.showControls() :
                        this.hideControls();
                },
            }),
            (n.fancybox = {
                version: "3.1.28",
                defaults: a,
                getInstance: function(t) {
                    var e = n(
                            '.fancybox-container:not(".fancybox-is-closing"):first'
                        ).data("FancyBox"),
                        o = Array.prototype.slice.call(arguments, 1);
                    return (
                        e instanceof h &&
                        ("string" === n.type(t) ?
                            e[t].apply(e, o) :
                            "function" === n.type(t) && t.apply(e, o),
                            e)
                    );
                },
                open: function(t, e, n) {
                    return new h(t, e, n);
                },
                close: function(t) {
                    var e = this.getInstance();
                    e && (e.close(), t === !0 && this.close());
                },
                destroy: function() {
                    this.close(!0), r.off("click.fb-start");
                },
                isMobile: e.createTouch !== o &&
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
                        navigator.userAgent
                    ),
                use3d: (function() {
                    var n = e.createElement("div");
                    return (
                        t.getComputedStyle &&
                        t.getComputedStyle(n).getPropertyValue("transform") &&
                        !(e.documentMode && e.documentMode < 11)
                    );
                })(),
                getTranslate: function(t) {
                    var e;
                    if (!t || !t.length) return !1;
                    if (
                        ((e = t.eq(0).css("transform")),
                            e && e.indexOf("matrix") !== -1 ?
                            ((e = e.split("(")[1]),
                                (e = e.split(")")[0]),
                                (e = e.split(","))) :
                            (e = []),
                            e.length)
                    )
                        (e =
                            e.length > 10 ?
                            [e[13], e[12], e[0], e[5]] :
                            [e[5], e[4], e[0], e[3]]),
                        (e = e.map(parseFloat));
                    else {
                        e = [0, 0, 1, 1];
                        var n = /\.*translate\((.*)px,(.*)px\)/i,
                            o = n.exec(t.eq(0).attr("style"));
                        o &&
                            ((e[0] = parseFloat(o[2])),
                                (e[1] = parseFloat(o[1])));
                    }
                    return {
                        top: e[0],
                        left: e[1],
                        scaleX: e[2],
                        scaleY: e[3],
                        opacity: parseFloat(t.css("opacity")),
                        width: t.width(),
                        height: t.height(),
                    };
                },
                setTranslate: function(t, e) {
                    var n = "",
                        i = {};
                    if (t && e)
                        return (
                            (e.left === o && e.top === o) ||
                            ((n =
                                    (e.left === o ?
                                        t.position().left :
                                        e.left) +
                                    "px, " +
                                    (e.top === o ? t.position().top : e.top) +
                                    "px"),
                                (n = this.use3d ?
                                    "translate3d(" + n + ", 0px)" :
                                    "translate(" + n + ")")),
                            e.scaleX !== o &&
                            e.scaleY !== o &&
                            (n =
                                (n.length ? n + " " : "") +
                                "scale(" +
                                e.scaleX +
                                ", " +
                                e.scaleY +
                                ")"),
                            n.length && (i.transform = n),
                            e.opacity !== o && (i.opacity = e.opacity),
                            e.width !== o && (i.width = e.width),
                            e.height !== o && (i.height = e.height),
                            t.css(i)
                        );
                },
                animate: function(t, e, i, a, s) {
                    var r = d || "transitionend";
                    n.isFunction(i) && ((a = i), (i = null)),
                        n.isPlainObject(e) || t.removeAttr("style"),
                        t.on(r, function(i) {
                            (!i ||
                                !i.originalEvent ||
                                (t.is(i.originalEvent.target) &&
                                    "z-index" !=
                                    i.originalEvent.propertyName)) &&
                            (t.off(r),
                                n.isPlainObject(e) ?
                                e.scaleX !== o &&
                                e.scaleY !== o &&
                                (t.css("transition-duration", "0ms"),
                                    (e.width = Math.round(
                                        t.width() * e.scaleX
                                    )),
                                    (e.height = Math.round(
                                        t.height() * e.scaleY
                                    )),
                                    (e.scaleX = 1),
                                    (e.scaleY = 1),
                                    n.fancybox.setTranslate(t, e)) :
                                s !== !0 && t.removeClass(e),
                                n.isFunction(a) && a(i));
                        }),
                        n.isNumeric(i) &&
                        t.css("transition-duration", i + "ms"),
                        n.isPlainObject(e) ?
                        n.fancybox.setTranslate(t, e) :
                        t.addClass(e),
                        t.data(
                            "timer",
                            setTimeout(function() {
                                t.trigger("transitionend");
                            }, i + 16)
                        );
                },
                stop: function(t) {
                    clearTimeout(t.data("timer")), t.off(d);
                },
            }),
            (n.fn.fancybox = function(t) {
                var e;
                return (
                    (t = t || {}),
                    (e = t.selector || !1),
                    e ?
                    n("body")
                    .off("click.fb-start", e)
                    .on("click.fb-start", e, { options: t }, i) :
                    this.off("click.fb-start").on(
                        "click.fb-start", { items: this, options: t },
                        i
                    ),
                    this
                );
            }),
            r.on("click.fb-start", "[data-fancybox]", i);
    }
})(window, document, window.jQuery || jQuery),
(function(t) {
    "use strict";
    var e = function(e, n, o) {
            if (e)
                return (
                    (o = o || ""),
                    "object" === t.type(o) && (o = t.param(o, !0)),
                    t.each(n, function(t, n) {
                        e = e.replace("$" + t, n || "");
                    }),
                    o.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + o),
                    e
                );
        },
        n = {
            youtube: {
                matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
                params: {
                    autoplay: 1,
                    autohide: 1,
                    fs: 1,
                    rel: 0,
                    hd: 1,
                    wmode: "transparent",
                    enablejsapi: 1,
                    html5: 1,
                },
                paramPlace: 8,
                type: "iframe",
                url: "//www.youtube.com/embed/$4",
                thumb: "//img.youtube.com/vi/$4/hqdefault.jpg",
            },
            vimeo: {
                matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
                params: {
                    autoplay: 1,
                    hd: 1,
                    show_title: 1,
                    show_byline: 1,
                    show_portrait: 0,
                    fullscreen: 1,
                    api: 1,
                },
                paramPlace: 3,
                type: "iframe",
                url: "//player.vimeo.com/video/$2",
            },
            metacafe: {
                matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/,
                type: "iframe",
                url: "//www.metacafe.com/embed/$1/?ap=1",
            },
            dailymotion: {
                matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
                params: { additionalInfos: 0, autoStart: 1 },
                type: "iframe",
                url: "//www.dailymotion.com/embed/video/$1",
            },
            vine: {
                matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,
                type: "iframe",
                url: "//vine.co/v/$1/embed/simple",
            },
            instagram: {
                matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
                type: "image",
                url: "//$1/p/$2/media/?size=l",
            },
            gmap_place: {
                matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
                type: "iframe",
                url: function(t) {
                    return (
                        "//maps.google." +
                        t[2] +
                        "/?ll=" +
                        (t[9] ?
                            t[9] +
                            "&z=" +
                            Math.floor(t[10]) +
                            (t[12] ? t[12].replace(/^\//, "&") : "") :
                            t[12]) +
                        "&output=" +
                        (t[12] && t[12].indexOf("layer=c") > 0 ?
                            "svembed" :
                            "embed")
                    );
                },
            },
            gmap_search: {
                matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
                type: "iframe",
                url: function(t) {
                    return (
                        "//maps.google." +
                        t[2] +
                        "/maps?q=" +
                        t[5].replace("query=", "q=").replace("api=1", "") +
                        "&output=embed"
                    );
                },
            },
        };
    t(document).on("onInit.fb", function(o, i) {
        t.each(i.group, function(o, i) {
            var a,
                s,
                r,
                c,
                l,
                u,
                d,
                f = i.src || "",
                h = !1;
            i.type ||
                ((a = t.extend(!0, {}, n, i.opts.media)),
                    t.each(a, function(n, o) {
                        if (((r = f.match(o.matcher)), (u = {}), (d = n), r)) {
                            if (
                                ((h = o.type), o.paramPlace && r[o.paramPlace])
                            ) {
                                (l = r[o.paramPlace]),
                                "?" == l[0] && (l = l.substring(1)),
                                    (l = l.split("&"));
                                for (var a = 0; a < l.length; ++a) {
                                    var p = l[a].split("=", 2);
                                    2 == p.length &&
                                        (u[p[0]] = decodeURIComponent(
                                            p[1].replace(/\+/g, " ")
                                        ));
                                }
                            }
                            return (
                                (c = t.extend(!0, {}, o.params, i.opts[n], u)),
                                (f =
                                    "function" === t.type(o.url) ?
                                    o.url.call(this, r, c, i) :
                                    e(o.url, r, c)),
                                (s =
                                    "function" === t.type(o.thumb) ?
                                    o.thumb.call(this, r, c, i) :
                                    e(o.thumb, r)),
                                "vimeo" === d && (f = f.replace("&%23", "#")), !1
                            );
                        }
                    }),
                    h ?
                    ((i.src = f),
                        (i.type = h),
                        i.opts.thumb ||
                        (i.opts.$thumb && i.opts.$thumb.length) ||
                        (i.opts.thumb = s),
                        "iframe" === h &&
                        (t.extend(!0, i.opts, {
                                iframe: {
                                    preload: !1,
                                    attr: { scrolling: "no" },
                                },
                            }),
                            (i.contentProvider = d),
                            (i.opts.slideClass +=
                                " fancybox-slide--" +
                                ("gmap_place" == d || "gmap_search" == d ?
                                    "map" :
                                    "video")))) :
                    (i.type = "image"));
        });
    });
})(window.jQuery),
(function(t, e, n) {
    "use strict";
    var o = (function() {
            return (
                t.requestAnimationFrame ||
                t.webkitRequestAnimationFrame ||
                t.mozRequestAnimationFrame ||
                t.oRequestAnimationFrame ||
                function(e) {
                    return t.setTimeout(e, 1e3 / 60);
                }
            );
        })(),
        i = (function() {
            return (
                t.cancelAnimationFrame ||
                t.webkitCancelAnimationFrame ||
                t.mozCancelAnimationFrame ||
                t.oCancelAnimationFrame ||
                function(e) {
                    t.clearTimeout(e);
                }
            );
        })(),
        a = function(e) {
            var n = [];
            (e = e.originalEvent || e || t.e),
            (e =
                e.touches && e.touches.length ?
                e.touches :
                e.changedTouches && e.changedTouches.length ?
                e.changedTouches :
                [e]);
            for (var o in e)
                e[o].pageX ?
                n.push({ x: e[o].pageX, y: e[o].pageY }) :
                e[o].clientX &&
                n.push({ x: e[o].clientX, y: e[o].clientY });
            return n;
        },
        s = function(t, e, n) {
            return e && t ?
                "x" === n ?
                t.x - e.x :
                "y" === n ?
                t.y - e.y :
                Math.sqrt(
                    Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)
                ) :
                0;
        },
        r = function(t) {
            if (
                t.is("a,button,input,select,textarea,label") ||
                n.isFunction(t.get(0).onclick) ||
                t.data("selectable")
            )
                return !0;
            for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++)
                if ("data-fancybox-" === o[e].nodeName.substr(0, 14))
                    return !0;
            return !1;
        },
        c = function(e) {
            var n = t.getComputedStyle(e)["overflow-y"],
                o = t.getComputedStyle(e)["overflow-x"],
                i =
                ("scroll" === n || "auto" === n) &&
                e.scrollHeight > e.clientHeight,
                a =
                ("scroll" === o || "auto" === o) &&
                e.scrollWidth > e.clientWidth;
            return i || a;
        },
        l = function(t) {
            for (var e = !1;;) {
                if ((e = c(t.get(0)))) break;
                if (
                    ((t = t.parent()), !t.length ||
                        t.hasClass("fancybox-stage") ||
                        t.is("body"))
                )
                    break;
            }
            return e;
        },
        u = function(t) {
            var e = this;
            (e.instance = t),
            (e.$bg = t.$refs.bg),
            (e.$stage = t.$refs.stage),
            (e.$container = t.$refs.container),
            e.destroy(),
                e.$container.on(
                    "touchstart.fb.touch mousedown.fb.touch",
                    n.proxy(e, "ontouchstart")
                );
        };
    (u.prototype.destroy = function() {
        this.$container.off(".fb.touch");
    }),
    (u.prototype.ontouchstart = function(o) {
        var i = this,
            c = n(o.target),
            u = i.instance,
            d = u.current,
            f = d.$content,
            h = "touchstart" == o.type;
        if (
            (h && i.$container.off("mousedown.fb.touch"), !d || i.instance.isAnimating || i.instance.isClosing)
        )
            return o.stopPropagation(), void o.preventDefault();
        if (
            (!o.originalEvent || 2 != o.originalEvent.button) &&
            c.length &&
            !r(c) &&
            !r(c.parent()) &&
            !(
                o.originalEvent.clientX >
                c[0].clientWidth + c.offset().left
            ) &&
            ((i.startPoints = a(o)),
                i.startPoints && !(i.startPoints.length > 1 && u.isSliding))
        ) {
            if (
                ((i.$target = c),
                    (i.$content = f),
                    (i.canTap = !0),
                    n(e).off(".fb.touch"),
                    n(e).on(
                        h ?
                        "touchend.fb.touch touchcancel.fb.touch" :
                        "mouseup.fb.touch mouseleave.fb.touch",
                        n.proxy(i, "ontouchend")
                    ),
                    n(e).on(
                        h ? "touchmove.fb.touch" : "mousemove.fb.touch",
                        n.proxy(i, "ontouchmove")
                    ),
                    (!u.current.opts.touch && !u.canPan()) ||
                    (!c.is(i.$stage) && !i.$stage.find(c).length))
            )
                return void(c.is("img") && o.preventDefault());
            o.stopPropagation(),
                (n.fancybox.isMobile &&
                    (l(i.$target) || l(i.$target.parent()))) ||
                o.preventDefault(),
                (i.canvasWidth = Math.round(d.$slide[0].clientWidth)),
                (i.canvasHeight = Math.round(d.$slide[0].clientHeight)),
                (i.startTime = new Date().getTime()),
                (i.distanceX = i.distanceY = i.distance = 0),
                (i.isPanning = !1),
                (i.isSwiping = !1),
                (i.isZooming = !1),
                (i.sliderStartPos = i.sliderLastPos || {
                    top: 0,
                    left: 0,
                }),
                (i.contentStartPos = n.fancybox.getTranslate(
                    i.$content
                )),
                (i.contentLastPos = null),
                1 !== i.startPoints.length ||
                i.isZooming ||
                ((i.canTap = !u.isSliding),
                    "image" === d.type &&
                    (i.contentStartPos.width > i.canvasWidth + 1 ||
                        i.contentStartPos.height > i.canvasHeight + 1) ?
                    (n.fancybox.stop(i.$content),
                        i.$content.css("transition-duration", "0ms"),
                        (i.isPanning = !0)) :
                    (i.isSwiping = !0),
                    i.$container.addClass(
                        "fancybox-controls--isGrabbing"
                    )),
                2 !== i.startPoints.length ||
                u.isAnimating ||
                d.hasError ||
                "image" !== d.type ||
                (!d.isLoaded && !d.$ghost) ||
                ((i.isZooming = !0),
                    (i.isSwiping = !1),
                    (i.isPanning = !1),
                    n.fancybox.stop(i.$content),
                    i.$content.css("transition-duration", "0ms"),
                    (i.centerPointStartX =
                        0.5 *
                        (i.startPoints[0].x + i.startPoints[1].x) -
                        n(t).scrollLeft()),
                    (i.centerPointStartY =
                        0.5 *
                        (i.startPoints[0].y + i.startPoints[1].y) -
                        n(t).scrollTop()),
                    (i.percentageOfImageAtPinchPointX =
                        (i.centerPointStartX - i.contentStartPos.left) /
                        i.contentStartPos.width),
                    (i.percentageOfImageAtPinchPointY =
                        (i.centerPointStartY - i.contentStartPos.top) /
                        i.contentStartPos.height),
                    (i.startDistanceBetweenFingers = s(
                        i.startPoints[0],
                        i.startPoints[1]
                    )));
        }
    }),
    (u.prototype.ontouchmove = function(t) {
        var e = this;
        if (
            ((e.newPoints = a(t)),
                n.fancybox.isMobile &&
                (l(e.$target) || l(e.$target.parent())))
        )
            return t.stopPropagation(), void(e.canTap = !1);
        if (
            (e.instance.current.opts.touch || e.instance.canPan()) &&
            e.newPoints &&
            e.newPoints.length &&
            ((e.distanceX = s(e.newPoints[0], e.startPoints[0], "x")),
                (e.distanceY = s(e.newPoints[0], e.startPoints[0], "y")),
                (e.distance = s(e.newPoints[0], e.startPoints[0])),
                e.distance > 0)
        ) {
            if (!e.$target.is(e.$stage) &&
                !e.$stage.find(e.$target).length
            )
                return;
            t.stopPropagation(),
                t.preventDefault(),
                e.isSwiping ?
                e.onSwipe() :
                e.isPanning ?
                e.onPan() :
                e.isZooming && e.onZoom();
        }
    }),
    (u.prototype.onSwipe = function() {
        var e,
            a = this,
            s = a.isSwiping,
            r = a.sliderStartPos.left || 0;
        s === !0 ?
            Math.abs(a.distance) > 10 &&
            ((a.canTap = !1),
                a.instance.group.length < 2 &&
                a.instance.opts.touch.vertical ?
                (a.isSwiping = "y") :
                a.instance.isSliding ||
                a.instance.opts.touch.vertical === !1 ||
                ("auto" === a.instance.opts.touch.vertical &&
                    n(t).width() > 800) ?
                (a.isSwiping = "x") :
                ((e = Math.abs(
                        (180 * Math.atan2(a.distanceY, a.distanceX)) /
                        Math.PI
                    )),
                    (a.isSwiping = e > 45 && e < 135 ? "y" : "x")),
                (a.instance.isSliding = a.isSwiping),
                (a.startPoints = a.newPoints),
                n.each(a.instance.slides, function(t, e) {
                    n.fancybox.stop(e.$slide),
                        e.$slide.css("transition-duration", "0ms"),
                        (e.inTransition = !1),
                        e.pos === a.instance.current.pos &&
                        (a.sliderStartPos.left =
                            n.fancybox.getTranslate(e.$slide).left);
                }),
                a.instance.SlideShow &&
                a.instance.SlideShow.isActive &&
                a.instance.SlideShow.stop()) :
            ("x" == s &&
                (a.distanceX > 0 &&
                    (a.instance.group.length < 2 ||
                        (0 === a.instance.current.index &&
                            !a.instance.current.opts.loop)) ?
                    (r += Math.pow(a.distanceX, 0.8)) :
                    a.distanceX < 0 &&
                    (a.instance.group.length < 2 ||
                        (a.instance.current.index ===
                            a.instance.group.length - 1 &&
                            !a.instance.current.opts.loop)) ?
                    (r -= Math.pow(-a.distanceX, 0.8)) :
                    (r += a.distanceX)),
                (a.sliderLastPos = {
                    top: "x" == s ? 0 : a.sliderStartPos.top + a.distanceY,
                    left: r,
                }),
                a.requestId && (i(a.requestId), (a.requestId = null)),
                (a.requestId = o(function() {
                    a.sliderLastPos &&
                        (n.each(a.instance.slides, function(t, e) {
                                var o = e.pos - a.instance.currPos;
                                n.fancybox.setTranslate(e.$slide, {
                                    top: a.sliderLastPos.top,
                                    left: a.sliderLastPos.left +
                                        o * a.canvasWidth +
                                        o * e.opts.gutter,
                                });
                            }),
                            a.$container.addClass("fancybox-is-sliding"));
                })));
    }),
    (u.prototype.onPan = function() {
        var t,
            e,
            a,
            s = this;
        (s.canTap = !1),
        (t =
            s.contentStartPos.width > s.canvasWidth ?
            s.contentStartPos.left + s.distanceX :
            s.contentStartPos.left),
        (e = s.contentStartPos.top + s.distanceY),
        (a = s.limitMovement(
            t,
            e,
            s.contentStartPos.width,
            s.contentStartPos.height
        )),
        (a.scaleX = s.contentStartPos.scaleX),
        (a.scaleY = s.contentStartPos.scaleY),
        (s.contentLastPos = a),
        s.requestId && (i(s.requestId), (s.requestId = null)),
            (s.requestId = o(function() {
                n.fancybox.setTranslate(s.$content, s.contentLastPos);
            }));
    }),
    (u.prototype.limitMovement = function(t, e, n, o) {
        var i,
            a,
            s,
            r,
            c = this,
            l = c.canvasWidth,
            u = c.canvasHeight,
            d = c.contentStartPos.left,
            f = c.contentStartPos.top,
            h = c.distanceX,
            p = c.distanceY;
        return (
            (i = Math.max(0, 0.5 * l - 0.5 * n)),
            (a = Math.max(0, 0.5 * u - 0.5 * o)),
            (s = Math.min(l - n, 0.5 * l - 0.5 * n)),
            (r = Math.min(u - o, 0.5 * u - 0.5 * o)),
            n > l &&
            (h > 0 &&
                t > i &&
                (t = i - 1 + Math.pow(-i + d + h, 0.8) || 0),
                h < 0 &&
                t < s &&
                (t = s + 1 - Math.pow(s - d - h, 0.8) || 0)),
            o > u &&
            (p > 0 &&
                e > a &&
                (e = a - 1 + Math.pow(-a + f + p, 0.8) || 0),
                p < 0 &&
                e < r &&
                (e = r + 1 - Math.pow(r - f - p, 0.8) || 0)), { top: e, left: t }
        );
    }),
    (u.prototype.limitPosition = function(t, e, n, o) {
        var i = this,
            a = i.canvasWidth,
            s = i.canvasHeight;
        return (
            n > a ?
            ((t = t > 0 ? 0 : t), (t = t < a - n ? a - n : t)) :
            (t = Math.max(0, a / 2 - n / 2)),
            o > s ?
            ((e = e > 0 ? 0 : e), (e = e < s - o ? s - o : e)) :
            (e = Math.max(0, s / 2 - o / 2)), { top: e, left: t }
        );
    }),
    (u.prototype.onZoom = function() {
        var e = this,
            a = e.contentStartPos.width,
            r = e.contentStartPos.height,
            c = e.contentStartPos.left,
            l = e.contentStartPos.top,
            u = s(e.newPoints[0], e.newPoints[1]),
            d = u / e.startDistanceBetweenFingers,
            f = Math.floor(a * d),
            h = Math.floor(r * d),
            p = (a - f) * e.percentageOfImageAtPinchPointX,
            g = (r - h) * e.percentageOfImageAtPinchPointY,
            b =
            (e.newPoints[0].x + e.newPoints[1].x) / 2 -
            n(t).scrollLeft(),
            m =
            (e.newPoints[0].y + e.newPoints[1].y) / 2 -
            n(t).scrollTop(),
            y = b - e.centerPointStartX,
            v = m - e.centerPointStartY,
            x = c + (p + y),
            w = l + (g + v),
            $ = {
                top: w,
                left: x,
                scaleX: e.contentStartPos.scaleX * d,
                scaleY: e.contentStartPos.scaleY * d,
            };
        (e.canTap = !1),
        (e.newWidth = f),
        (e.newHeight = h),
        (e.contentLastPos = $),
        e.requestId && (i(e.requestId), (e.requestId = null)),
            (e.requestId = o(function() {
                n.fancybox.setTranslate(e.$content, e.contentLastPos);
            }));
    }),
    (u.prototype.ontouchend = function(t) {
        var o = this,
            s = Math.max(new Date().getTime() - o.startTime, 1),
            r = o.isSwiping,
            c = o.isPanning,
            l = o.isZooming;
        return (
            (o.endPoints = a(t)),
            o.$container.removeClass("fancybox-controls--isGrabbing"),
            n(e).off(".fb.touch"),
            o.requestId && (i(o.requestId), (o.requestId = null)),
            (o.isSwiping = !1),
            (o.isPanning = !1),
            (o.isZooming = !1),
            o.canTap ?
            o.onTap(t) :
            ((o.speed = 366),
                (o.velocityX = (o.distanceX / s) * 0.5),
                (o.velocityY = (o.distanceY / s) * 0.5),
                (o.speedX = Math.max(
                    0.5 * o.speed,
                    Math.min(
                        1.5 * o.speed,
                        (1 / Math.abs(o.velocityX)) * o.speed
                    )
                )),
                void(c ?
                    o.endPanning() :
                    l ?
                    o.endZooming() :
                    o.endSwiping(r)))
        );
    }),
    (u.prototype.endSwiping = function(t) {
        var e = this,
            o = !1;
        (e.instance.isSliding = !1),
        (e.sliderLastPos = null),
        "y" == t && Math.abs(e.distanceY) > 50 ?
            (n.fancybox.animate(
                    e.instance.current.$slide, {
                        top: e.sliderStartPos.top +
                            e.distanceY +
                            150 * e.velocityY,
                        opacity: 0,
                    },
                    150
                ),
                (o = e.instance.close(!0, 300))) :
            "x" == t &&
            e.distanceX > 50 &&
            e.instance.group.length > 1 ?
            (o = e.instance.previous(e.speedX)) :
            "x" == t &&
            e.distanceX < -50 &&
            e.instance.group.length > 1 &&
            (o = e.instance.next(e.speedX)),
            o !== !1 ||
            ("x" != t && "y" != t) ||
            e.instance.jumpTo(e.instance.current.index, 150),
            e.$container.removeClass("fancybox-is-sliding");
    }),
    (u.prototype.endPanning = function() {
        var t,
            e,
            o,
            i = this;
        i.contentLastPos &&
            (i.instance.current.opts.touch.momentum === !1 ?
                ((t = i.contentLastPos.left),
                    (e = i.contentLastPos.top)) :
                ((t = i.contentLastPos.left + i.velocityX * i.speed),
                    (e = i.contentLastPos.top + i.velocityY * i.speed)),
                (o = i.limitPosition(
                    t,
                    e,
                    i.contentStartPos.width,
                    i.contentStartPos.height
                )),
                (o.width = i.contentStartPos.width),
                (o.height = i.contentStartPos.height),
                n.fancybox.animate(i.$content, o, 330));
    }),
    (u.prototype.endZooming = function() {
        var t,
            e,
            o,
            i,
            a = this,
            s = a.instance.current,
            r = a.newWidth,
            c = a.newHeight;
        a.contentLastPos &&
            ((t = a.contentLastPos.left),
                (e = a.contentLastPos.top),
                (i = {
                    top: e,
                    left: t,
                    width: r,
                    height: c,
                    scaleX: 1,
                    scaleY: 1,
                }),
                n.fancybox.setTranslate(a.$content, i),
                r < a.canvasWidth && c < a.canvasHeight ?
                a.instance.scaleToFit(150) :
                r > s.width || c > s.height ?
                a.instance.scaleToActual(
                    a.centerPointStartX,
                    a.centerPointStartY,
                    150
                ) :
                ((o = a.limitPosition(t, e, r, c)),
                    n.fancybox.setTranslate(
                        a.content,
                        n.fancybox.getTranslate(a.$content)
                    ),
                    n.fancybox.animate(a.$content, o, 150)));
    }),
    (u.prototype.onTap = function(t) {
        var e,
            o = this,
            i = n(t.target),
            s = o.instance,
            r = s.current,
            c = (t && a(t)) || o.startPoints,
            l = c[0] ? c[0].x - o.$stage.offset().left : 0,
            u = c[0] ? c[0].y - o.$stage.offset().top : 0,
            d = function(e) {
                var i = r.opts[e];
                if ((n.isFunction(i) && (i = i.apply(s, [r, t])), i))
                    switch (i) {
                        case "close":
                            s.close(o.startEvent);
                            break;
                        case "toggleControls":
                            s.toggleControls(!0);
                            break;
                        case "next":
                            s.next();
                            break;
                        case "nextOrClose":
                            s.group.length > 1 ?
                                s.next() :
                                s.close(o.startEvent);
                            break;
                        case "zoom":
                            "image" == r.type &&
                                (r.isLoaded || r.$ghost) &&
                                (s.canPan() ?
                                    s.scaleToFit() :
                                    s.isScaledDown() ?
                                    s.scaleToActual(l, u) :
                                    s.group.length < 2 &&
                                    s.close(o.startEvent));
                    }
            };
        if (!(
                (t.originalEvent && 2 == t.originalEvent.button) ||
                s.isSliding ||
                l > i[0].clientWidth + i.offset().left
            )) {
            if (
                i.is(
                    ".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"
                )
            )
                e = "Outside";
            else if (i.is(".fancybox-slide")) e = "Slide";
            else {
                if (!s.current.$content ||
                    !s.current.$content.has(t.target).length
                )
                    return;
                e = "Content";
            }
            if (o.tapped) {
                if (
                    (clearTimeout(o.tapped),
                        (o.tapped = null),
                        Math.abs(l - o.tapX) > 50 ||
                        Math.abs(u - o.tapY) > 50 ||
                        s.isSliding)
                )
                    return this;
                d("dblclick" + e);
            } else
                (o.tapX = l),
                (o.tapY = u),
                r.opts["dblclick" + e] &&
                r.opts["dblclick" + e] !== r.opts["click" + e] ?
                (o.tapped = setTimeout(function() {
                    (o.tapped = null), d("click" + e);
                }, 300)) :
                d("click" + e);
            return this;
        }
    }),
    n(e).on("onActivate.fb", function(t, e) {
            e && !e.Guestures && (e.Guestures = new u(e));
        }),
        n(e).on("beforeClose.fb", function(t, e) {
            e && e.Guestures && e.Guestures.destroy();
        });
})(window, document, window.jQuery),
(function(t, e) {
    "use strict";
    var n = function(t) {
        (this.instance = t), this.init();
    };
    e.extend(n.prototype, {
            timer: null,
            isActive: !1,
            $button: null,
            speed: 3e3,
            init: function() {
                var t = this;
                (t.$button = t.instance.$refs.toolbar
                    .find("[data-fancybox-play]")
                    .on("click", function() {
                        t.toggle();
                    })),
                (t.instance.group.length < 2 ||
                    !t.instance.group[t.instance.currIndex].opts
                    .slideShow) &&
                t.$button.hide();
            },
            set: function() {
                var t = this;
                t.instance &&
                    t.instance.current &&
                    (t.instance.current.opts.loop ||
                        t.instance.currIndex < t.instance.group.length - 1) ?
                    (t.timer = setTimeout(function() {
                        t.instance.next();
                    }, t.instance.current.opts.slideShow.speed || t.speed)) :
                    (t.stop(),
                        (t.instance.idleSecondsCounter = 0),
                        t.instance.showControls());
            },
            clear: function() {
                var t = this;
                clearTimeout(t.timer), (t.timer = null);
            },
            start: function() {
                var t = this,
                    e = t.instance.current;
                t.instance &&
                    e &&
                    (e.opts.loop || e.index < t.instance.group.length - 1) &&
                    ((t.isActive = !0),
                        t.$button
                        .attr("title", e.opts.i18n[e.opts.lang].PLAY_STOP)
                        .addClass("fancybox-button--pause"),
                        e.isComplete && t.set());
            },
            stop: function() {
                var t = this,
                    e = t.instance.current;
                t.clear(),
                    t.$button
                    .attr("title", e.opts.i18n[e.opts.lang].PLAY_START)
                    .removeClass("fancybox-button--pause"),
                    (t.isActive = !1);
            },
            toggle: function() {
                var t = this;
                t.isActive ? t.stop() : t.start();
            },
        }),
        e(t).on({
            "onInit.fb": function(t, e) {
                e && !e.SlideShow && (e.SlideShow = new n(e));
            },
            "beforeShow.fb": function(t, e, n, o) {
                var i = e && e.SlideShow;
                o
                    ?
                    i && n.opts.slideShow.autoStart && i.start() :
                    i && i.isActive && i.clear();
            },
            "afterShow.fb": function(t, e, n) {
                var o = e && e.SlideShow;
                o && o.isActive && o.set();
            },
            "afterKeydown.fb": function(n, o, i, a, s) {
                var r = o && o.SlideShow;
                !r ||
                    !i.opts.slideShow ||
                    (80 !== s && 32 !== s) ||
                    e(t.activeElement).is("button,a,input") ||
                    (a.preventDefault(), r.toggle());
            },
            "beforeClose.fb onDeactivate.fb": function(t, e) {
                var n = e && e.SlideShow;
                n && n.stop();
            },
        }),
        e(t).on("visibilitychange", function() {
            var n = e.fancybox.getInstance(),
                o = n && n.SlideShow;
            o && o.isActive && (t.hidden ? o.clear() : o.set());
        });
})(document, window.jQuery),
(function(t, e) {
    "use strict";
    var n = (function() {
        var e,
            n,
            o,
            i = [
                [
                    "requestFullscreen",
                    "exitFullscreen",
                    "fullscreenElement",
                    "fullscreenEnabled",
                    "fullscreenchange",
                    "fullscreenerror",
                ],
                [
                    "webkitRequestFullscreen",
                    "webkitExitFullscreen",
                    "webkitFullscreenElement",
                    "webkitFullscreenEnabled",
                    "webkitfullscreenchange",
                    "webkitfullscreenerror",
                ],
                [
                    "webkitRequestFullScreen",
                    "webkitCancelFullScreen",
                    "webkitCurrentFullScreenElement",
                    "webkitCancelFullScreen",
                    "webkitfullscreenchange",
                    "webkitfullscreenerror",
                ],
                [
                    "mozRequestFullScreen",
                    "mozCancelFullScreen",
                    "mozFullScreenElement",
                    "mozFullScreenEnabled",
                    "mozfullscreenchange",
                    "mozfullscreenerror",
                ],
                [
                    "msRequestFullscreen",
                    "msExitFullscreen",
                    "msFullscreenElement",
                    "msFullscreenEnabled",
                    "MSFullscreenChange",
                    "MSFullscreenError",
                ],
            ],
            a = {};
        for (n = 0; n < i.length; n++)
            if (((e = i[n]), e && e[1] in t)) {
                for (o = 0; o < e.length; o++) a[i[0][o]] = e[o];
                return a;
            }
        return !1;
    })();
    if (!n)
        return void(
            e &&
            e.fancybox &&
            (e.fancybox.defaults.btnTpl.fullScreen = !1)
        );
    var o = {
        request: function(e) {
            (e = e || t.documentElement),
            e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT);
        },
        exit: function() {
            t[n.exitFullscreen]();
        },
        toggle: function(e) {
            (e = e || t.documentElement),
            this.isFullscreen() ? this.exit() : this.request(e);
        },
        isFullscreen: function() {
            return Boolean(t[n.fullscreenElement]);
        },
        enabled: function() {
            return Boolean(t[n.fullscreenEnabled]);
        },
    };
    e(t).on({
            "onInit.fb": function(t, e) {
                var n,
                    i = e.$refs.toolbar.find("[data-fancybox-fullscreen]");
                e && !e.FullScreen && e.group[e.currIndex].opts.fullScreen ?
                    ((n = e.$refs.container),
                        n.on(
                            "click.fb-fullscreen",
                            "[data-fancybox-fullscreen]",
                            function(t) {
                                t.stopPropagation(),
                                    t.preventDefault(),
                                    o.toggle(n[0]);
                            }
                        ),
                        e.opts.fullScreen &&
                        e.opts.fullScreen.autoStart === !0 &&
                        o.request(n[0]),
                        (e.FullScreen = o)) :
                    i.hide();
            },
            "afterKeydown.fb": function(t, e, n, o, i) {
                e &&
                    e.FullScreen &&
                    70 === i &&
                    (o.preventDefault(),
                        e.FullScreen.toggle(e.$refs.container[0]));
            },
            "beforeClose.fb": function(t) {
                t && t.FullScreen && o.exit();
            },
        }),
        e(t).on(n.fullscreenchange, function() {
            var t = e.fancybox.getInstance();
            t.current &&
                "image" === t.current.type &&
                t.isAnimating &&
                (t.current.$content.css("transition", "none"),
                    (t.isAnimating = !1),
                    t.update(!0, !0, 0)),
                t.trigger("onFullscreenChange", o.isFullscreen());
        });
})(document, window.jQuery),
(function(t, e) {
    "use strict";
    var n = function(t) {
        (this.instance = t), this.init();
    };
    e.extend(n.prototype, {
            $button: null,
            $grid: null,
            $list: null,
            isVisible: !1,
            init: function() {
                var t = this,
                    e = t.instance.group[0],
                    n = t.instance.group[1];
                (t.$button = t.instance.$refs.toolbar.find(
                    "[data-fancybox-thumbs]"
                )),
                t.instance.group.length > 1 &&
                    t.instance.group[t.instance.currIndex].opts.thumbs &&
                    ("image" == e.type || e.opts.thumb || e.opts.$thumb) &&
                    ("image" == n.type || n.opts.thumb || n.opts.$thumb) ?
                    (t.$button.on("click", function() {
                            t.toggle();
                        }),
                        (t.isActive = !0)) :
                    (t.$button.hide(), (t.isActive = !1));
            },
            create: function() {
                var t,
                    n,
                    o = this.instance;
                (this.$grid = e('<div class="fancybox-thumbs"></div>').appendTo(
                    o.$refs.container
                )),
                (t = "<ul>"),
                e.each(o.group, function(e, o) {
                        (n =
                            o.opts.thumb ||
                            (o.opts.$thumb ? o.opts.$thumb.attr("src") : null)),
                        n || "image" !== o.type || (n = o.src),
                            n &&
                            n.length &&
                            (t +=
                                '<li data-index="' +
                                e +
                                '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' +
                                n +
                                '" /></li>');
                    }),
                    (t += "</ul>"),
                    (this.$list = e(t)
                        .appendTo(this.$grid)
                        .on("click", "li", function() {
                            o.jumpTo(e(this).data("index"));
                        })),
                    this.$list
                    .find("img")
                    .hide()
                    .one("load", function() {
                        var t,
                            n,
                            o,
                            i,
                            a = e(this)
                            .parent()
                            .removeClass("fancybox-thumbs-loading"),
                            s = a.outerWidth(),
                            r = a.outerHeight();
                        (t = this.naturalWidth || this.width),
                        (n = this.naturalHeight || this.height),
                        (o = t / s),
                        (i = n / r),
                        o >= 1 &&
                            i >= 1 &&
                            (o > i ?
                                ((t /= i), (n = r)) :
                                ((t = s), (n /= o))),
                            e(this)
                            .css({
                                width: Math.floor(t),
                                height: Math.floor(n),
                                "margin-top": Math.min(
                                    0,
                                    Math.floor(0.3 * r - 0.3 * n)
                                ),
                                "margin-left": Math.min(
                                    0,
                                    Math.floor(0.5 * s - 0.5 * t)
                                ),
                            })
                            .show();
                    })
                    .each(function() {
                        this.src = e(this).data("src");
                    });
            },
            focus: function() {
                this.instance.current &&
                    this.$list
                    .children()
                    .removeClass("fancybox-thumbs-active")
                    .filter(
                        '[data-index="' + this.instance.current.index + '"]'
                    )
                    .addClass("fancybox-thumbs-active")
                    .focus();
            },
            close: function() {
                this.$grid.hide();
            },
            update: function() {
                this.instance.$refs.container.toggleClass(
                        "fancybox-show-thumbs",
                        this.isVisible
                    ),
                    this.isVisible ?
                    (this.$grid || this.create(),
                        this.instance.trigger("onThumbsShow"),
                        this.focus()) :
                    this.$grid && this.instance.trigger("onThumbsHide"),
                    this.instance.update();
            },
            hide: function() {
                (this.isVisible = !1), this.update();
            },
            show: function() {
                (this.isVisible = !0), this.update();
            },
            toggle: function() {
                (this.isVisible = !this.isVisible), this.update();
            },
        }),
        e(t).on({
            "onInit.fb": function(t, e) {
                e && !e.Thumbs && (e.Thumbs = new n(e));
            },
            "beforeShow.fb": function(t, e, n, o) {
                var i = e && e.Thumbs;
                if (i && i.isActive) {
                    if (n.modal) return i.$button.hide(), void i.hide();
                    o && n.opts.thumbs.autoStart === !0 && i.show(),
                        i.isVisible && i.focus();
                }
            },
            "afterKeydown.fb": function(t, e, n, o, i) {
                var a = e && e.Thumbs;
                a &&
                    a.isActive &&
                    71 === i &&
                    (o.preventDefault(), a.toggle());
            },
            "beforeClose.fb": function(t, e) {
                var n = e && e.Thumbs;
                n &&
                    n.isVisible &&
                    e.opts.thumbs.hideOnClose !== !1 &&
                    n.close();
            },
        });
})(document, window.jQuery),
(function(t, e, n) {
    "use strict";

    function o() {
        var t = e.location.hash.substr(1),
            n = t.split("-"),
            o =
            n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) ?
            parseInt(n.pop(-1), 10) || 1 :
            1,
            i = n.join("-");
        return o < 1 && (o = 1), { hash: t, index: o, gallery: i };
    }

    function i(t) {
        var e;
        "" !== t.gallery &&
            ((e = n(
                    "[data-fancybox='" + n.escapeSelector(t.gallery) + "']"
                ).eq(t.index - 1)),
                e.length || (e = n("#" + n.escapeSelector(t.gallery))),
                e.length && ((s = !1), e.trigger("click")));
    }

    function a(t) {
        var e;
        return (!!t &&
            ((e = t.current ? t.current.opts : t.opts),
                e.hash || (e.$orig ? e.$orig.data("fancybox") : ""))
        );
    }
    n.escapeSelector ||
        (n.escapeSelector = function(t) {
            var e = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
                n = function(t, e) {
                    return e ?
                        "\0" === t ?
                        "�" :
                        t.slice(0, -1) +
                        "\\" +
                        t.charCodeAt(t.length - 1).toString(16) +
                        " " :
                        "\\" + t;
                };
            return (t + "").replace(e, n);
        });
    var s = !0,
        r = null,
        c = null;
    n(function() {
        setTimeout(function() {
            n.fancybox.defaults.hash !== !1 &&
                (n(t).on({
                        "onInit.fb": function(t, e) {
                            var n, i;
                            e.group[e.currIndex].opts.hash !== !1 &&
                                ((n = o()),
                                    (i = a(e)),
                                    i &&
                                    n.gallery &&
                                    i == n.gallery &&
                                    (e.currIndex = n.index - 1));
                        },
                        "beforeShow.fb": function(n, o, i) {
                            var l;
                            i &&
                                i.opts.hash !== !1 &&
                                ((l = a(o)),
                                    l &&
                                    "" !== l &&
                                    (e.location.hash.indexOf(l) < 0 &&
                                        (o.opts.origHash = e.location.hash),
                                        (r =
                                            l +
                                            (o.group.length > 1 ?
                                                "-" + (i.index + 1) :
                                                "")),
                                        "replaceState" in e.history ?
                                        (c && clearTimeout(c),
                                            (c = setTimeout(function() {
                                                e.history[
                                                        s ?
                                                        "pushState" :
                                                        "replaceState"
                                                    ]({},
                                                        t.title,
                                                        e.location.pathname +
                                                        e.location.search +
                                                        "#" +
                                                        r
                                                    ),
                                                    (c = null),
                                                    (s = !1);
                                            }, 300))) :
                                        (e.location.hash = r)));
                        },
                        "beforeClose.fb": function(o, i, s) {
                            var l, u;
                            c && clearTimeout(c),
                                s.opts.hash !== !1 &&
                                ((l = a(i)),
                                    (u =
                                        i && i.opts.origHash ?
                                        i.opts.origHash :
                                        ""),
                                    l &&
                                    "" !== l &&
                                    ("replaceState" in history ?
                                        e.history.replaceState({},
                                            t.title,
                                            e.location.pathname +
                                            e.location.search +
                                            u
                                        ) :
                                        ((e.location.hash = u),
                                            n(e)
                                            .scrollTop(i.scrollTop)
                                            .scrollLeft(i.scrollLeft))),
                                    (r = null));
                        },
                    }),
                    n(e).on("hashchange.fb", function() {
                        var t = o();
                        n.fancybox.getInstance() ?
                            !r ||
                            r === t.gallery + "-" + t.index ||
                            (1 === t.index && r == t.gallery) ||
                            ((r = null), n.fancybox.close()) :
                            "" !== t.gallery && i(t);
                    }),
                    i(o()));
        }, 50);
    });
})(document, window, window.jQuery);