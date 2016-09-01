cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        xMaxSpeed: 0,
        yMaxSpeed: 0,
        canMove: true,
        comboNext: 0,
        comboLock: false,
        state: "stand",
        skillPool: [],
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

    moveOffset: function(offset) {
        // 动画偏移修正
        if(this.node.scaleX < 0) {
            offset *= -1;
        }
        this.node.x += offset;
    },

    combo: function () {
        // 指令输入
        this.skillPool.push("combo" + this.comboNext);

        this.comboNext++;
        if(this.comboNext === 4) {
            this.comboNext = 0;
        }
        this.skill();
    },

    comboEnd: function () {
        this.skillPool = [];
    },

    skill: function () {
        // 技能指令
        if(this.comboLock) return;
        this.xSpeed = 0;
        this.ySpeed = 0;
        if(this.skillPool.length > 0) {
            this.canMove = false;
            this.comboLock = true;
            this.statePool(this.skillPool[0]);
            this.skillPool.shift();
        } else {
            this.canMove = true;
            this.comboNext = 0;
            this.comboLock = false;
            this.statePool("stand");
        }
    },

    move: function(xs, ys) {
        // 移动指令
        if(this.canMove) {
            this.xSpeed = xs;
            this.ySpeed = ys;
            if(xs == 0 && ys == 0) {
                this.statePool("stand");
            } else {
                if(xs > 0) {
                    this.node.scaleX = Math.abs(this.node.scaleX);
                } else {
                    this.node.scaleX = -Math.abs(this.node.scaleX);
                }
                this.statePool("walk");
            }
        } else {
            this.xSpeed = 0;
            this.ySpeed = 0;
        }
    },

    statePool: function(s) {
        if(this.state == s) return;
        // 状态池
        this.state = s;
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
            case "stand":
                this.anim.play("athena-stand");
            break;
            case "walk":
                this.anim.play("athena-walk");
            break;
        }
    },

    stateBuffer: function() {
        // 状态缓冲区
    },

    setInputControl: function () {
        var self = this;

        var controller = this.controller;

        var joypad = this.joypad;
        var joypadPanel = this.joypadPanel;
        var mousemove = false;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.xSpeed = - self.xMaxSpeed;
                        break;
                    case cc.KEY.d:
                        self.xSpeed = self.xMaxSpeed;
                        break;
                    case cc.KEY.w:
                        self.ySpeed = self.yMaxSpeed;
                        break;
                    case cc.KEY.s:
                        self.ySpeed = - self.yMaxSpeed;
                        break;
                }
                self.move(self.xSpeed, self.ySpeed);
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
                self.move(self.xSpeed, self.ySpeed);
            }
        }, self.node);
        
        var Xtouch,Ytouch;
        var XtouchMove,YtouchMove;
        var xs, ys;
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                if(mousemove) return;
                Xtouch = touch.getLocationX();
                Ytouch = touch.getLocationY();

                if(Xtouch > 0 && Xtouch < 300 && Ytouch > 0 && Ytouch < 300) {
                    // 摇杆
                    mousemove = true;
                    joypadPanel.x = Xtouch;
                    joypadPanel.y = Ytouch;
                }

                return true;
            },
            onTouchMoved: function (touch, event) {
                if(!mousemove) return;
                XtouchMove = touch.getLocationX();
                YtouchMove = touch.getLocationY();
                if(XtouchMove > Xtouch) {
                    xs = self.xMaxSpeed;
                } else if(XtouchMove < Xtouch) {
                    xs = - self.xMaxSpeed;
                }

                if(YtouchMove > Ytouch) {
                    ys = self.yMaxSpeed;
                } else if (YtouchMove < Ytouch) {
                    ys = - self.yMaxSpeed;
                }

                xs = xs || 0;
                ys = ys || 0;
                self.move(xs, ys);

                joypad.x = Math.min(40, Math.max((XtouchMove - Xtouch) * 0.5, -40));
                joypad.y = Math.min(40, Math.max((YtouchMove - Ytouch) * 0.5, -40));
            },
            onTouchEnded: function (touch, event) {
                self.move(0, 0);
                mousemove = false;
            },
            onTouchCancelled: function (touch, event) {
                self.move(0, 0);
                mousemove = false;
            },
        }
        // 绑定单点触摸事件
        cc.eventManager.addListener(listener, this.node);


        /*var listener = {
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                // self.combo()
                Xtouch = touches[0].getLocationX();
                Ytouch = touches[0].getLocationY();

                if(Xtouch > 0 && Xtouch < 300 && Ytouch > 0 && Ytouch < 300) {
                    // 摇杆
                    mousemove = true;
                    joypadPanel.x = Xtouch;
                    joypadPanel.y = Ytouch;
                }

                return true;
            },
            onTouchesMoved: function (touches, event) {
                if(!mousemove) return;
                XtouchMove = touches[0].getLocationX();
                YtouchMove = touches[0].getLocationY();
                if(XtouchMove > Xtouch) {
                    xs = self.xMaxSpeed;
                } else if(XtouchMove < Xtouch) {
                    xs = - self.xMaxSpeed;
                }

                if(YtouchMove > Ytouch) {
                    ys = self.yMaxSpeed;
                } else if (YtouchMove < Ytouch) {
                    ys = - self.yMaxSpeed;
                }

                xs = xs || 0;
                ys = ys || 0;
                self.move(xs, ys);

                joypad.x = Math.min(40, Math.max((XtouchMove - Xtouch) * 0.5, -40));
                joypad.y = Math.min(40, Math.max((YtouchMove - Ytouch) * 0.5, -40));
            },
            onTouchesEnded: function (touches, event) {
                self.move(0, 0);
                mousemove = false;
            },
            onTouchesCancelled: function (touches, event) {
                self.move(0, 0);
                mousemove = false;
            }
        }
        cc.eventManager.addListener(listener, joypadPanel);*/
    },
    
    // use this for initialization
    onLoad: function () {
        this.xSpeed = 0;
        this.ySpeed = 0;
        // 初始化键盘输入监听
        this.setInputControl();

        this.anim.on('finished',  function() {
            this.comboLock = false;
            this.skill();
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    
    update: function (dt) {
        this.node.x += this.xSpeed * dt;
        this.node.y += this.ySpeed * dt;
    },
});
