cc.Class({
    extends: cc.Component,

    properties: {},

    start() {

    },

    setNodeData(node1, node2) {
        this.oldNode = node1;
        this.newNode = node2;
        this.deltaX = Math.abs(node1.x - node2.x);
        this.deltaY = Math.abs(node1.y - node2.y);

    }
});
