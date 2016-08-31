cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        xMaxSpeed: 0,
        yMaxSpeed: 0,
        comboNext: 0,
        state: "stand",
        controller: {
            default: null,
            type: cc.Node
        },
        joypadPanel: {
            default: null,
            type: cc.Node
        },
        joypad: {
            default: null,
            type: cc.Node
        },
    },
    
    action: function (ani) {
        if(!this.anim.currentClip || this.anim.currentClip.name != ani) {
            this.anim.play(ani);
        }
    },

    moveOffset: function(offset) {
        // 动画偏移修正
        if(this.node.scaleX < 0) {
            offset *= -1;
        }
        this.node.x += offset;
    },

    combo: function () {
        this.statePool("combo" + this.comboNext);
        this.comboNext ++;
        if(this.comboNext === 4) {
            this.comboNext = 0;
        }
    },

    comboEnd: function () {
        this.comboNext = 0;
        this.statePool("stand");
    },

    commandPool: function () {
        // 指令池

    },

    statePool: function(s) {
        if(this.state == s) return;
        // 状态池
        this.state = s;
        if(!this.anim.getAnimationState("athena-c0").isPlaying) {
            this.comboNext = 0;
            this.anim.play("athena-stand");
        }
        switch(s) {
            case "combo0":
                this.anim.play("athena-c0");
            break;
            case "combo1":
                this.anim.play("athena-c1");
            break;
            case "combo2":
                this.anim.play("athena-c2");
            break;
            case "combo3":
                this.anim.play("athena-c3");
            break;
            case "walk":
                if(this.comboNext == 0)
                this.anim.play("athena-walk");
            break;
            case "stand":
            default:
                if(this.comboNext == 0)
                this.anim.play("athena-stand");
        }
    },

    setInputControl: function () {

        var self = this;

        var controller = this.controller;

        var joypad = this.joypad;
        var joypadPanel = this.joypadPanel;
        var walk = false;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.xSpeed = - self.xMaxSpeed;
                        self.statePool("walk");
                        if(self.node.scaleX > 0) {
                            self.node.scaleX *= -1;
                        }
                        break;
                    case cc.KEY.d:
                        self.xSpeed = self.xMaxSpeed;
                        self.statePool("walk");
                        if(self.node.scaleX < 0) {
                            self.node.scaleX *= -1;
                        }
                        break;
                    case cc.KEY.w:
                        self.ySpeed = self.yMaxSpeed;
                        self.statePool("walk");
                        break;
                    case cc.KEY.s:
                        self.ySpeed = - self.yMaxSpeed;
                        self.statePool("walk");
                        break;
                }
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
        var XtouchMove,YtouchMove;
        var listener = {
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                // self.combo()
                Xtouch = touches[0].getLocationX();
                Ytouch = touches[0].getLocationY();

                if(Xtouch > 80 && Xtouch < 220 && Ytouch > 50 && Ytouch < 190) {
                    // 摇杆
                    walk = true;
                    joypadPanel.x = Xtouch;
                    joypadPanel.y = Ytouch;
                }

                return true;
            },
            onTouchesMoved: function (touches, event) {
                if(!walk) return;
                self.statePool("walk");
                XtouchMove = touches[0].getLocationX();
                YtouchMove = touches[0].getLocationY();
                if(XtouchMove > Xtouch) {
                    self.xSpeed = self.xMaxSpeed;
                    self.node.scaleX = 2;
                } else if(XtouchMove < Xtouch) {
                    self.xSpeed = - self.xMaxSpeed;
                    self.node.scaleX = -2;
                }

                if(YtouchMove > Ytouch) {
                    self.ySpeed = self.yMaxSpeed;
                } else if (YtouchMove < Ytouch) {
                    self.ySpeed = - self.yMaxSpeed;
                }

                joypad.x = Math.min(40, Math.max((XtouchMove - Xtouch) * 0.5, -40));
                joypad.y = Math.min(40, Math.max((YtouchMove - Ytouch) * 0.5, -40));
            },
            onTouchesEnded: function (touches, event) {
                self.xSpeed = 0;
                self.ySpeed = 0;
                self.statePool("stand");
                walk = false;
            },
            onTouchesCancelled: function (touches, event) {
                self.xSpeed = 0;
                self.ySpeed = 0;
                self.statePool("stand");
                walk = false;
            }
        }
        // 绑定多点触摸事件
        cc.eventManager.addListener(listener, joypadPanel);
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
        if(this.comboNext == 0) {
            this.node.x += this.xSpeed * dt;
            this.node.y += this.ySpeed * dt;
        }
    },
});
