var PinsSimulators = require('PinsSimulators');

var configure = exports.configure = function(configuration) {
	this.pinsSimulator = shell.delegate("addSimulatorPart", {
			header : { 
				label : "Speaker", 
				name : "Digital Output", 
				iconVariant : PinsSimulators.SENSOR_BUTTON 
			},
			axes : [
				new PinsSimulators.DigitalOutputAxisDescription(
					{
						valueLabel : "Speaker",
						valueID : "speakValue",
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
	this.pinsSimulator.delegate("setValue", "speakValue", value);
}

exports.pins = {
	speaker : { type: "Digital", direction: "output" }
};