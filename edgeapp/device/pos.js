//@module

exports.pins = {
    xPos: { type: "A2D" },
    yPos: { type: "A2D" },
    zPos: { type: "A2D" }
};

exports.configure = function(){
	this.xPos.init();
  this.yPos.init();
  this.zPos.init();
}

exports.read = function() {
    return { xPos: this.xPos.read(), yPos: this.yPos.read(), zPos: this.zPos.read() };
}


