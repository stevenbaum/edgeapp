//@program

var blueSkin = new Skin ( { fill: "#1E90FF" } );
var labelStyle = new Style( { font: "bold 30px", color:"black", horizontal: 'null', vertical: 'null' } );

var zapper = "OFF";
var currlat = 0;
var currlng = 0;
var currTemp = 0;
var speaker = "OFF";
var barking = "NO";

var zapLabel = new Label({left:0, right:0, top: 0, bottom: 0, string:"Zap: OFF", style: labelStyle, skin: blueSkin});
var speakLabel = new Label({left:0, right:0, top: 0, bottom: 0, string:"Speaker: OFF", style: labelStyle, skin: blueSkin});

application.invoke(new MessageWithObject( "pins:configure", {
		    zapper: {
		        require: "zapper",
		        pins: {
		            zapper: {pin: 3}
		        }
		    },
		    location: {
		    	require: "location",
		    	pins: {
		    		lat: {pin: 12},
		    		lng: {pin: 13},
	    		}
    		},
		    speaker: {
		    	require: "speaker",
		 	  	pins: {
		    		speaker: {pin: 6}
		    	}
		    },
		    barkstatus: {
		    	require: "barkstatus",
		    	pins: {
		    		bark: {pin: 5}
	    		}
		    }
}));

Handler.bind("/gotLocation", Object.create(Behavior.prototype, {
	onInvoke: { value: 
		function(handler, message) {
                var result = message.requestObject;  
        		application.distribute( "onLocationChanged", result );
		},
	},
}));

var LocationContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, contents: [
	Label($, { left: 0, right: 0, top: 0, bottom: 0,
	style: labelStyle, 
	behavior: Object.create((LocationContainer.behaviors[0]).prototype), string: '- - -', }),
], }});
LocationContainer.behaviors = new Array(1); 	
LocationContainer.behaviors[0] = Behavior.template({
	onLocationChanged: function(content,result) {
					content.string = result.latValue + " lat, " + result.lngValue + " lng"
					currlat = result.latValue;
					currlng = result.lngValue;
	},
})

var BarkContainer = Container.template(function($) { return { left: 0, right: 0, top: 0, bottom: 0, skin: blueSkin, contents: [
	Label($, { left: 0, right: 0, top: 0, bottom: 0,
	style: labelStyle, 
	behavior: Object.create((BarkContainer.behaviors[0]).prototype), string: '- - -', }),
], }});
BarkContainer.behaviors = new Array(1); 	
BarkContainer.behaviors[0] = Behavior.template({
	onBarkChanged: function(content,result) {
					if(result > 75) {
						content.string = "Bark: YES"
						barking = "YES"
					} else {
						content.string = "Bark: NO"
						barking = "NO"
					}
						
	},
})

application.invoke( new MessageWithObject( "pins:/location/read?" + 
	serializeQuery( {       
		repeat: "on",
		interval: 20,
		callback: "/gotLocation"
} ) ) );

Handler.bind("/gotBarkStatus", Object.create(Behavior.prototype, {
	onInvoke: { value: 
		function(handler, message) {
                var result = message.requestObject;  
        		application.distribute( "onBarkChanged", result );
		},
	},
}));


application.invoke( new MessageWithObject( "pins:/barkstatus/read?" + 
	serializeQuery( {       
		repeat: "on",
		interval: 20,
		callback: "/gotBarkStatus"
} ) ) );


Handler.bind("/turnZapperOFF", Behavior({
	onInvoke: function(handler, message){
		application.invoke( new MessageWithObject( "pins:/zapper/turnOff" ) );
		zapLabel.string = "Zap: OFF";
		zapper = "OFF"
	}
}));

Handler.bind("/turnZapperON", Behavior({
	onInvoke: function(handler, message){
		application.invoke( new MessageWithObject( "pins:/zapper/turnOn" ) );
		zapLabel.string = "Zap: ON";
		zapper = "ON"
	}
}));

Handler.bind("/turnSpeakerOFF", Behavior({
	onInvoke: function(handler, message){
		application.invoke( new MessageWithObject( "pins:/speaker/turnOff" ) );
		speakLabel.string = "Speaker: OFF";
		speaker = "OFF"
	}
}));

Handler.bind("/turnSpeakerON", Behavior({
	onInvoke: function(handler, message){
		application.invoke( new MessageWithObject( "pins:/speaker/turnOn" ) );
		speakLabel.string = "Speaker: ON";
		speaker = "ON"
	}
}));

Handler.bind("/getLocation", Behavior({
	onInvoke: function(handler, message){
		response = { 'lat': currlat, 'lng': currlng };
		message.responseText = JSON.stringify(response);
		//NEED THIS TO BE JSON
		message.status = 200;
		return
	},
}));

Handler.bind("/getBarkStatus", Behavior({
	onInvoke: function(handler, message){
		message.responseText = barking
		message.status = 200;
	},
}));

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, active: true, skin: blueSkin,
	contents: [
		new LocationContainer(),
		zapLabel,
		speakLabel,
		new BarkContainer(),
	],
});
//application.add(new LocationContainer())
application.add(mainColumn)
