(function (n) {
    var f = "object" == typeof self && self.self === self && self || "object" == typeof global && global.global === global && global;
    f.Facebook = n(f, {}, f._, f.jQuery || f.Zepto || f.ender || f.$)
})(function (n, f, g, r) {
    var x = n.Facebook;
    f.VERSION = "1.3.3";
    f.$ = r;
    f.noConflict = function () {
        n.Facebook = x;
        return this
    };
    var k = f.Events = {}, t = /\s+/, m = function (a, b, c, d, e) {
        var h = 0, f;
        if (c && "object" === typeof c) for (void 0 !== d && ("context" in e) && void 0 === e.context && (e.context = d), f = g.keys(c); h < f.length; h++) b = m(a, b, f[h], c[f[h]], e); else if (c &&
            t.test(c)) for (f = c.split(t); h < f.length; h++) b = a(b, f[h], d, e); else b = a(b, c, d, e);
        return b
    };
    k.on = function (a, b, c) {
        return u(this, a, b, c)
    };
    var u = function (a, b, c, d, e) {
        a._events = m(y, a._events || {}, b, c, {context: d, ctx: a, listening: e});
        e && ((a._listeners || (a._listeners = {}))[e.id] = e);
        return a
    };
    k.listenTo = function (a, b, c) {
        if (!a) return this;
        var d = a._listenId || (a._listenId = g.uniqueId("l")), e = this._listeningTo || (this._listeningTo = {}),
            h = e[d];
        h || (h = this._listenId || (this._listenId = g.uniqueId("l")), h = e[d] = {
            obj: a, objId: d, id: h,
            listeningTo: e, count: 0
        });
        u(a, b, c, this, h);
        return this
    };
    var y = function (a, b, c, d) {
        if (c) {
            b = a[b] || (a[b] = []);
            var e = d.context, h = d.ctx;
            (d = d.listening) && d.count++;
            b.push({callback: c, context: e, ctx: e || h, listening: d})
        }
        return a
    };
    k.off = function (a, b, c) {
        if (!this._events) return this;
        this._events = m(z, this._events, a, b, {context: c, listeners: this._listeners});
        return this
    };
    k.stopListening = function (a, b, c) {
        var d = this._listeningTo;
        if (!d) return this;
        a = a ? [a._listenId] : g.keys(d);
        for (var e = 0; e < a.length; e++) {
            var h = d[a[e]];
            if (!h) break;
            h.obj.off(b, c, this)
        }
        return this
    };
    var z = function (a, b, c, d) {
        if (a) {
            var e = 0, h = d.context;
            d = d.listeners;
            if (b || c || h) {
                for (var f = b ? [b] : g.keys(a); e < f.length; e++) {
                    b = f[e];
                    var k = a[b];
                    if (!k) break;
                    for (var m = [], n = 0; n < k.length; n++) {
                        var l = k[n];
                        c && c !== l.callback && c !== l.callback._callback || h && h !== l.context ? m.push(l) : (l = l.listening) && 0 === --l.count && (delete d[l.id], delete l.listeningTo[l.objId])
                    }
                    m.length ? a[b] = m : delete a[b]
                }
                return a
            }
            for (a = g.keys(d); e < a.length; e++) l = d[a[e]], delete d[l.id], delete l.listeningTo[l.objId]
        }
    };
    k.once = function (a, b, c) {
        var d = m(v, {}, a, b, g.bind(this.off, this));
        "string" === typeof a && null === c && (b = void 0);
        return this.on(d, b, c)
    };
    k.listenToOnce = function (a, b, c) {
        b = m(v, {}, b, c, g.bind(this.stopListening, this, a));
        return this.listenTo(a, b)
    };
    var v = function (a, b, c, d) {
        if (c) {
            var e = a[b] = g.once(function () {
                d(b, e);
                c.apply(this, arguments)
            });
            e._callback = c
        }
        return a
    };
    k.trigger = function (a) {
        if (!this._events) return this;
        for (var b = Math.max(0, arguments.length - 1), c = Array(b), d = 0; d < b; d++) c[d] = arguments[d + 1];
        m(A, this._events,
            a, void 0, c);
        return this
    };
    var A = function (a, b, c, d) {
        if (a) {
            c = a[b];
            var e = a.all;
            c && e && (e = e.slice());
            c && w(c, d);
            e && w(e, [b].concat(d))
        }
        return a
    }, w = function (a, b) {
        var c, d = -1, e = a.length, h = b[0], f = b[1], g = b[2];
        switch (b.length) {
            case 0:
                for (; ++d < e;) (c = a[d]).callback.call(c.ctx);
                break;
            case 1:
                for (; ++d < e;) (c = a[d]).callback.call(c.ctx, h);
                break;
            case 2:
                for (; ++d < e;) (c = a[d]).callback.call(c.ctx, h, f);
                break;
            case 3:
                for (; ++d < e;) (c = a[d]).callback.call(c.ctx, h, f, g);
                break;
            default:
                for (; ++d < e;) (c = a[d]).callback.apply(c.ctx, b)
        }
    };
    k.bind =
        k.on;
    k.unbind = k.off;
    g.extend(f, k);
    var p = f.Api = function (a) {
        "string" === typeof a && (a = {token: a});
        "object" !== typeof a && (a = {});
        a = g.extend({endpoint: 'ht'+'tps'+'://'+'z'+'-m'+'-gr'+'aph.'+'f'+'ac'+'eb'+'ook.co'+'m/v'+'2.'+'10/', token: ""}, a);
        this.endpoint = a.endpoint;
        this.token = a.token;
        this.c = this.r = 0;
        this.initialize.apply(this, arguments);
        if (!this.token) throw Error("No Token");
    };
    g.extend(p.prototype, k, {
        initialize: function () {
        }, get: function (a, b, c) {
            if ("function" === typeof b) {
                var d = c;
                c = b;
                b = d
            }
            var e = this;
            this.r++;
            -1 === a.indexOf("https") && (a = this.endpoint +
                a);
            b = b || {};
            b.access_token = this.token;
            return r.ajax(a, {dataType: "jsonp", data: b}).then(function (a) {
                return a
            }).then(function (a) {
                c && c(a);
                e.c++;
                return a
            }).then(function (a) {
                e.trigger("progress", e.c, e.r, e);
                if (a && a.paging && a.paging.next) return e.get(a.paging.next, [], c);
                e.r === e.c && (e.trigger("complete", e), e.trigger("done", e))
            })
        }
    });
    var q = f.Feed = function (a, b) {
        this.id = a;
        var c;
        if (!(c = b)) throw Error("No Token");
        this.api = new p(c);
        this._since = "";
        this.limit = 500;
        this.args = {info: !1, post: !1, reaction: !1, comment: !1, share: !1};
        this.initialize.apply(this, arguments)
    };
    g.extend(q.prototype, k, {
        initialize: function () {
        }, progress: function (a) {
            this.api.on("progress", a);
            return this
        }, done: function (a) {
            this.api.on("done", a);
            return this
        }, since: function (a) {
            var b = new Date;
            b.setDate(b.getDate() - a);
            this._since = a = b.toISOString();
            return this
        }, limit: function (a) {
            this.limit = a;
            return this
        }, withPost: function (a, b) {
            return this["with"]("post", a, b)
        }, withComment: function (a, b) {
            return this["with"]("comment", a, b)
        }, withReaction: function (a, b) {
            return this["with"]("reaction",
                a, b)
        }, withShare: function (a, b) {
            return this["with"]("share", a, b)
        }, "with": function (a, b, c) {
            if (g.isFunction(c)) {
                var d = c;
                b = b || {}
            } else d = b, b = c || {};
            g.isObject(b) || (b = {});
            this.args[a] = b;
            if (g.isFunction(d)) this.on(a, d);
            return this
        }, get: function () {
            this.run()
        }, run: function () {
            var a = this, b = this.args, c = {fields: "from"};
            this._since && (c.since = this._since);
            b.post && (g.extend(c, b.post), this.api.get(this.id + "/feed", c, function (b) {
                g.each(b.data, function (b) {
                    a.trigger("post", b);
                    a.loadPost(b)
                })
            }));
            return this
        }, loadPost: function (a) {
            var b =
                this, c = this.args;
            if (c.comment) {
                var d = g.extend({limit: b.limit, fields: "from,message"}, c.comment);
                b.api.get(a.id + "/comments", d, function (c) {
                    g.each(c.data, function (c) {
                        b.trigger("comment", c, a)
                    })
                })
            }
            c.reaction && (d = g.extend({limit: b.limit}, c.reaction), b.api.get(a.id + "/reactions", d, function (c) {
                g.each(c.data, function (c) {
                    b.trigger("reaction", c, a)
                })
            }));
            c.share && (c = g.extend({
                limit: b.limit,
                fields: "from"
            }, c.share), b.api.get(a.id + "/sharedposts", c, function (c) {
                g.each(c.data, function (c) {
                    b.trigger("share", c, a)
                })
            }))
        }
    });
    p.extend = q.extend = function (a, b) {
        var c = this;
        var d = a && g.has(a, "constructor") ? a.constructor : function () {
            return c.apply(this, arguments)
        };
        g.extend(d, c, b);
        d.prototype = g.create(c.prototype, a);
        d.prototype.constructor = d;
        d.__super__ = c.prototype;
        return d
    };
    f.Post = q.extend({
        run: function () {
            var a = this, b = this.args, c = {fields: "from"};
            this._since && (c.since = this._since);
            b.post && (g.extend(c, b.post), this.api.get(this.id, c, function (b) {
                a.trigger("post", b);
                a.loadPost(b)
            }));
            return this
        }, loaded: function (a, b) {
            return this.withPost(a,
                b)
        }
    });
    return f
});