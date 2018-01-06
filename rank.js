/* Developed by Alice Madona */
var Ranking = Facebook.Feed.extend({
    initialize: function (a, b, c) {
        this.options = c;
        this.stats = {};
        this.withPost().withComment().withReaction().withShare();
        this.on("post", function (a) {
            this.addStats(a.from, "post")
        }, this);
        this.on("comment", function (a, b) {
            this.addStats(a.from, "comment");
            this.addStats(b.from, "commented")
        }, this);
        this.on("reaction", function (a, b) {
            this.addStats(a, "reaction");
            this.addStats(b.from, "reacted")
        }, this);
        this.on("share", function (a, b) {
                this.addStats(a.from, "share");
                this.addStats(b.from, "shared")
            },
            this);
        this.api.on("complete", this._complete, this)
    }, rank: function () {
        this.run()
    }, addStats: function (a, b, c) {
        a && (this.initUser(a), c = c || 1, a = a.id, this.stats[a][b] = this.stats[a][b] ? this.stats[a][b] + c : c)
    }, initUser: function (a) {
        var b = a.id;
        this.stats[b] || (this.stats[b] = {
            post: 0,
            comment: 0,
            reaction: 0,
            commented: 0,
            reacted: 0,
            shared: 0,
            share: 0,
            spam: 0,
            id: b
        });
        this.stats[b].name || a.name && (this.stats[b].name = a.name)
    }, _complete: function () {
        var a = this.options || {}, b = a.points_per_post || 0, c = a.points_per_comment || 0,
            d = a.points_per_commented ||
                0, e = a.points_per_reaction || 0, f = a.points_per_reacted || 0, g = a.points_per_spam || 0;
        _.each(this.stats, function (a) {
            a.points = b * a.post + c * a.comment + d * a.commented + e * a.reaction + f * a.reacted + g * a.spam
        });
        this.stats = _.chain(this.stats).sortBy("points").reverse().each(function (a, b) {
            a.rank = b + 1
        }).value();
        this.$complete(this.stats)
    }, done: function (a) {
        this.$complete = a;
        return this
    }
});
