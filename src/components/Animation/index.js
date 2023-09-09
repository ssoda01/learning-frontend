// 主场景
var Layer = function () {
    Tiny.Container.call(this);

    var FPS_ENUM = [10, 20, 30, 40, 50, 60];

    // 创建并添加已设置帧率的显示对象
    var txt = new Tiny.Text('已设置帧率：60', {
        fill: 'yellow',
    });
    txt.setAnchor(0.5, 0);
    txt.setPosition(Tiny.WIN_SIZE.width / 2, 200);
    // @ts-ignore
    this.addChild(txt);

    // 创建并添加当前真实帧率的显示对象
    var currentFPS = new Tiny.Text('当前帧率：60', {
        fill: 'yellow',
    });
    currentFPS.setAnchor(0.5, 0);
    currentFPS.setPosition(Tiny.WIN_SIZE.width / 2, 250);
    // @ts-ignore
    this.addChild(currentFPS);

    // 创建图形，方面查看帧率变化后图形绘制的速度变化
    var count = 0;
    var g = new Tiny.Graphics();
    g.setPosition(Tiny.WIN_SIZE.width / 2, 400);
    // @ts-ignore
    this.addChild(g);

    // 创建并添加时间显示对象
    FPS_ENUM.forEach((fps, i) => {
        var btn = new Tiny.Text('帧率：' + fps, {
            fill: 'white',
        });
        btn.setPositionY(40 * i);
        btn.setEventEnabled(true);
        btn.on('pointerdown', function () {
            count = 0;
            // @ts-ignore
            Tiny.Application.FPS = fps;
            // @ts-ignore
            txt.text = '已设置帧率：' + Tiny.Application.FPS;
        });
        // @ts-ignore
        this.addChild(btn);
    });

    var updateHandler = function () {
        // @ts-ignore
        currentFPS.text = '当前帧率：' + Tiny.app.getCurrentFPS().toFixed(1);

        if (count <= 360) {
            count += 1;
            g.clear();
            g.lineStyle(30, 0x5da761, 1);
            g.arc(0, 0, 100, 0, Tiny.deg2radian(count), false);
        }
    };

    // @ts-ignore
    Tiny.app.offUpdate(updateHandler);
    // @ts-ignore
    Tiny.app.onUpdate(updateHandler);

    // 此处用来恢复帧率
    // @ts-ignore
    this.on('removed', function () {
        // @ts-ignore
        Tiny.Application.FPS = Tiny.settings.TARGET_FPMS * 1000;
    });
};

// constructor
Layer.prototype = Object.create(Tiny.Container.prototype);
Layer.prototype.constructor = Layer;
