cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        xMaxSpeed: 0,
        yMaxSpeed: 0,
    },
    
    action: function (ani) {
        if(!this.anim.currentClip || this.anim.currentClip.name != ani) {
            this.anim.play(ani);
        }
    },

    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.j:
                        self.xSpeed = 0;
                        self.ySpeed = 0;
                        self.action("athena-atk");
                        break;
                }
                switch(keyCode) {
                    case cc.KEY.a:
                        self.xSpeed = - self.xMaxSpeed;
                        self.action("athena-walk");
                        if(self.node.scaleX > 0) {
                            self.node.scaleX *= -1;
                        }
                        break;
                    case cc.KEY.d:
                        self.xSpeed = self.xMaxSpeed;
                        self.action("athena-walk");
                        if(self.node.scaleX < 0) {
                            self.node.scaleX *= -1;
                        }
                        break;
                    case cc.KEY.w:
                        self.ySpeed = self.yMaxSpeed;
                        self.action("athena-walk");
                        break;
                    case cc.KEY.s:
                        self.ySpeed = - self.yMaxSpeed;
                        self.action("athena-walk");
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.d:
                        self.xSpeed = 0;
                        break;
                    case cc.KEY.w:
                    case cc.KEY.s:
                        self.ySpeed = 0;
                        break;
                }
                if(self.xSpeed === 0 && self.ySpeed === 0) {
                    self.action("athena-stand");
                }
            }
        }, self.node);
    },
    
    // use this for initialization
    onLoad: function () {
        this.xSpeed = 0;
        this.ySpeed = 0;
        // 初始化键盘输入监听
        this.setInputControl();
    },

    // called every frame, uncomment this function to activate update callback
    
    update: function (dt) {
        this.node.x += this.xSpeed * dt;
        this.node.y += this.ySpeed * dt;
    },
});