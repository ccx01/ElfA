cc.Class({
    extends: cc.Component,

    properties: {
        athena: {
            default: null,
            type: cc.Node
        },
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.athena.x = Math.min(Math.max(this.athena.x, -400), 400);
        this.athena.y = Math.min(Math.max(this.athena.y, -170), -30);
    },
});
