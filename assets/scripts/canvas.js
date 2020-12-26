cc.Class({
    extends: cc.Component,

    properties: {
        graph: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {
        this.lineList = [];
        this.nodeList = [];
        this.graphics = this.graph.getComponent("graphics");
        cc.macro.ENABLE_MULTI_TOUCH = false;
        this.graphics.lineWidth = 2;
        this.node.on('touchend', this.onClick, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.graphics.strokeColor = new cc.Color().fromHEX('#000000');
    },

    start() {

    },

    draw() {
        if (this.nodeList.length !== 0) {
            this.drawPoint(this.nodeList[0]["x"], this.nodeList[0]["y"]);
        }
        this.graphics.strokeColor = new cc.Color().fromHEX('#0000ff');
        this.nodeList.sort(function (a, b) {
            if (a === undefined || b === undefined) return 0;
            return a["y"] - b["y"];
        });
        this.lineList.sort(function (a, b) {
            if (a === undefined || b === undefined) return 0;
            return a["nodeLow"] - b["nodeLow"];
        });
        this.nowLines = [];
        for (let node of this.nodeList) {
            if (node["lowList"].length + node["highList"].length !== 2) {
                cc.log("Error");
                cc.log(node);
            }
            for (let item of node["lowList"]) {
                this.nowLines.push(item);
            }
            for (let item of node["highList"]) {
                let pos = this.nowLines.indexOf(item);
                if (pos === -1) {
                    cc.log("Error");
                    cc.log(node);
                }
                this.nowLines.splice(pos, 1);
            }
        }
    },

    onKeyDown(event) {
        cc.log(event);
        if (event.keyCode !== cc.macro.KEY.space) return;
        this.draw();
    },

    onClick(event) {
        this.drawPoint(event.getLocationX(), event.getLocationY());
    },


    drawPoint(x, y) {
        let node = [];
        node["x"] = x;
        node["y"] = y;
        node["highList"] = [];
        node["lowList"] = [];
        if (this.nodeList.length !== 0) {
            let line = [];
            let preNode = this.nodeList[this.nodeList.length - 1];
            let high = preNode["y"] > node["y"] ? preNode : node;
            let low = preNode["y"] > node["y"] ? node : preNode;
            line["nodeHigh"] = high;
            line["nodeLow"] = low;
            high["highList"].push(line);
            low["lowList"].push(line);
            this.lineList.push(line);
            this.graphics.lineTo(node["x"], node["y"]);
        } else {
            this.graphics.moveTo(node["x"], node["y"]);
        }
        this.nodeList.push(node);
    },

    drawLine(from, to) {
        this.graphics.moveTo(from["x"], from["y"]);
        this.graphics.lineTo(to["x"], to["y"]);
    }
});