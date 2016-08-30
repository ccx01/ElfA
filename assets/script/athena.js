cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        xMaxSpeed: 0,
        yMaxSpeed: 0,
        comboNext: 0,
    },
    
    action: function (ani) {
        if(!this.anim.currentClip || this.anim.currentClip.name != ani) {
            this.anim.play(ani);
        }
    },

    actionMove: function(offset) {
        offset = parseInt(offset);
        // 动画偏移修正
        if(this.node.scaleX < 0) {
            offset *= -1;
        }
        this.node.x += offset;
        console.log(this.node.x)
    },

    combo: function () {
        if(this.comboNext === 4) {
            this.comboNext = 0;
        }
        this.action("athena-c" + this.comboNext);
        this.comboNext++;
        console.log(this.node.x)
        // this.action("athena-c1")
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
                self.comboNext = 0;
            },
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
        
        var Xtouch,Ytouch;
        var listener = {
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                self.combo()
                Xtouch = touches[0].getLocationX();
                Ytouch = touches[0].getLocationY();
                // self.action("athena-walk");
                return true;
            },
            onTouchesMoved: function (touches, event) {

                if(touches[0].getLocationX() > Xtouch) {
                    self.xSpeed = self.xMaxSpeed;
                    self.node.scaleX = 2;
                } else if(touches[0].getLocationX() < Xtouch) {
                    self.xSpeed = - self.xMaxSpeed;
                    self.node.scaleX = -2;
                }

                if(touches[0].getLocationY() > Ytouch) {
                    self.ySpeed = self.yMaxSpeed;
                } else if (touches[0].getLocationY() < Ytouch) {
                    self.ySpeed = - self.yMaxSpeed;
                }
            },
            /*onTouchesEnded: function (touches, event) {
                self.xSpeed = 0;
                self.ySpeed = 0;
                self.action("athena-stand");
            },
            onTouchesCancelled: function (touches, event) {
                self.xSpeed = 0;
                self.ySpeed = 0;
                self.action("athena-stand");
            }*/
        }
        // 绑定多点触摸事件
        cc.eventManager.addListener(listener, this.node);
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
