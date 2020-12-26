cc.Class({
    extends: cc.Component,

    properties: {
        graph: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {
        this.graphics = this.graph.getComponent(cc.Graphics);
        cc.macro.ENABLE_MULTI_TOUCH = false;
        this.graphics.lineWidth = 2;
        this.node.on('touchend', this.onClick, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.drew = true;
        this.isdrawing = false;
    },

    start() {

    },

    draw() {
        this.isdrawing = true;
        if (this.nodeList.length !== 0) {
            this.drawPoint(this.nodeList[0], true);
        }
        cc.log(this.nodeList);
        cc.log(this.lineList);
        this.graphics.strokeColor = new cc.Color().fromHEX('#19ffe6');
        this.nodeList.sort((a, b) => a["y"] - b["y"]);
        this.lineList.sort((a, b) => a["nodeLow"] - b["nodeLow"]);
        this.nowLines = [];
        for (let i = 0; i < this.nodeList.length; i++) {
            let node = this.nodeList[i];
            if (node["lowList"].length + node["highList"].length !== 2) {
                cc.log("Error");
                cc.log(node);
            }
            // cc.log(i, this.nowLines);
            for (let item of node["lowList"]) {
                item["scanning"] = item["nodeLow"]["x"];
                this.nowLines.push(item);
            }
            // cc.log(i, this.nowLines);
            for (let item of node["highList"]) {
                let pos = this.nowLines.indexOf(item);
                if (pos === -1) {
                    cc.log("Error");
                    cc.log(node);
                }
                this.nowLines.splice(pos, 1);
            }
            // cc.log(i, this.nowLines);
            if (i !== this.nodeList.length - 1) {
                this.drawRange(node["y"], this.nodeList[i + 1]["y"]);
            }
        }
        this.drew = true;
        this.isdrawing = false;
    },

    drawRange(yLow, yHigh) {
        // cc.log(yLow, yHigh);
        for (let i = yLow; i < yHigh; i++) {
            // cc.log(i);
            // 我也想冒泡，但是js的交换需要手动写tamp，不好调整
            this.nowLines.sort((a, b) => a["scanning"] - b["scanning"]);
            for (let j = 0; j < this.nowLines.length; j++) {
                if (j & 1) {
                    this.graphics.lineTo(this.nowLines[j]["scanning"] - 1, i);
                } else {
                    this.graphics.moveTo(this.nowLines[j]["scanning"] + 1, i);
                }
                if (isNaN(this.nowLines[j]["delta"])) {
                    this.nowLines[j]["scanning"] = this.nowLines[j]["nodeHigh"]["x"];
                } else {
                    // cc.log(this.nowLines[j]["id"], this.nowLines[j]["scanning"], this.nowLines[j]["delta"]);
                    this.nowLines[j]["scanning"] += this.nowLines[j]["delta"];
                    // cc.log("222", this.nowLines[j]["scanning"], this.nowLines[j]["delta"]);
                }
            }
            this.graphics.stroke();
        }
    },

    onKeyDown(event) {
        cc.log(event);
        if (this.isdrawing) return;
        if (event.keyCode !== cc.macro.KEY.space) return;
        this.draw();
    },

    onClick(event) {
        if (this.isdrawing) return;
        let node = [];
        node["type"] = "node";
        node["id"] = this.nodeCnt++;
        node["x"] = event.getLocationX() - this.node.width / 2;
        node["y"] = event.getLocationY() - this.node.height / 2;
        node["highList"] = [];
        node["lowList"] = [];
        this.drawPoint(node, false);
    },


    drawPoint(node, isOld) {
        // cc.log(this.drew);
        if (this.drew) {
            this.graphics.clear();
            this.drew = false;
            this.graphics.strokeColor = new cc.Color().fromHEX('#000000');
            this.lineCnt = 0;
            this.nodeCnt = 0;
            this.nodeList = [];
            this.lineList = [];
        }
        if (this.nodeList.length !== 0) {
            let line = [];
            let preNode = this.nodeList[this.nodeList.length - 1];
            let high = preNode["y"] > node["y"] ? preNode : node;
            let low = preNode["y"] > node["y"] ? node : preNode;
            line["id"] = this.lineCnt++;
            line["type"] = "line";
            line["nodeHigh"] = high;
            line["nodeLow"] = low;
            line["degree"] = Math.atan2(high["x"] - low["x"], high["y"] - low["y"]);
            line["delta"] = (high["x"] - low["x"]) / (high["y"] - low["y"]);
            // cc.log(line);
            high["highList"].push(line);
            low["lowList"].push(line);
            this.lineList.push(line);
            this.graphics.lineTo(node["x"], node["y"]);
            this.graphics.stroke();
        } else {
            this.graphics.moveTo(node["x"], node["y"]);
        }
        if (!isOld) this.nodeList.push(node);
        // cc.log(this.nodeList);
    }
});