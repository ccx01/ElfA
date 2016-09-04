cc.Class({
    extends: cc.Component,

    properties: {
        damage: 0,
    },

    onCollisionEnter: function (other, self) {
        if(Math.abs(other.node.zIndex - self.node.parent.zIndex) < 20) {
            // z轴判定，超出范围不进行碰撞
            var face = - Math.abs(self.node.parent.scaleX) / self.node.parent.scaleX;
            other.node.getComponent("enemy").hurt(face);
            self.node.parent.getComponent("player").hitEffectPrefabShow();
        }
    },

    onCollisionStay: function (other, self) {
        // console.log('on collision stay');
    },

    onCollisionExit: function (other, self) {
        // console.log('on collision exit');
    }

});
