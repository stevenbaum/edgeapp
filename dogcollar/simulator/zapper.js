var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Zapper", 
				name : "Digital Output", 
				iconVariant : PinsSimulators.SENSOR_BUTTON 
			},
			axes : [
				new PinsSimulators.DigitalOutputAxisDescription(
					{
						valueLabel : "Zap",
						valueID : "zapValue",
					}
				),
			]
		});
}

exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

exports.turnOn = function() {
	this.setValue(1);
}

exports.turnOff = function() {
	this.setValue(0);
}

exports.setValue = function(value) {
	this.pinsSimulator.delegate("setValue", "zapValue", value);
}

exports.pins = {
	zapper : { type: "Digital", direction: "output" }
};