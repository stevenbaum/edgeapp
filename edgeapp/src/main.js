// KPR Script file
// Content organization and Button Template used from Kinoma tutorial
var THEME = require('themes/flat/theme');
var BUTTONS = require('controls/buttons');

// Testing Skins / Styles
var labelStyle = new Style( { font: "bold 30px", color:"white" } );
var buttonText = new Style( { font: "18px", color: "black" } );

var topTexture = new Texture("assets/home/home_top.png");
var topSkin = new Skin({
	width: 330,
	height: 55,
	fill: "black",
	texture: topTexture
});

var bodyTexture = new Texture("assets/home/home_data.png");
var bodySkin = new Skin({
	width: 330,
	height: 500,
	fill: "white",
	texture: bodyTexture,
});

// Button Template
var menuButton = Container.template(function($){ return {
	left: 0, right: 0, active: true,
	contents:[
		new Picture({ left: 0, right:0, width: 55, height:55, url: $.pictureURL, name: "buttonPic" })
	],
	behavior: Behavior({
		onCreate: function(content){
			this.normalPicture = $.pictureURL;
			this.selectedPicture = $.pictureSelectedURL;
			
			//nextScreen is passed into the template and specifies a constructor used to generate a new screen 
			//this.nextScreen = $.nextScreen;
		},
		onTouchBegan: function(content){
			content.buttonPic.url = this.selectedPicture;
		},
		onTouchEnded: function(content){
			content.buttonPic.url = this.normalPicture;
			mainColumn.appContent.appPicture.url = $.appBody;
			mainColumn.topBar.url = $.barURL;
			/*application.remove(currentScreen); //remove the old screen from the application
			
			currentScreen = new this.nextScreen; //make the new screen based on this.nextScreen
			application.add(currentScreen); //add the new screen to the application */
		},
	}),
}});

// App Containers
var mainColumn = new Column ({
	left: 0, right: 0, top: 0, bottom: 0,
	contents : [
		new Picture({ left: 0, right: 0, height: 55, url: "assets/home/home_top.png", name: "topBar" }),
		new Line ({ left: 0, right: 0, height: 0, name: "mapButtons",
			contents: [
			],
		}),
		new Line ({ left: 0, right: 0, name: "appContent",
			contents: [
				new Picture({ left: 0, right: 0, height: 415, url: "assets/home/home_data.png", name:"appPicture" })
			]
		}),
		new Line ({ left: 0, right: 0, bottom: 0, height: 55, name: "menuButtons",
			contents: [
				new menuButton({ pictureURL: "assets/home/home.png", pictureSelectedURL: "assets/home/home_activated.png",
						appBody: "assets/home/home_data.png", barURL: "assets/home/home_top.png" }),
				new menuButton({ pictureURL: "assets/location/location.png", pictureSelectedURL: "assets/location/location_activated.png",
						appBody: "assets/location/map_data.png", barURL: "assets/location/location_top.png" }),
				new menuButton({ pictureURL: "assets/camera/camera.png", pictureSelectedURL: "assets/camera/camera_activated.png",
						appBody: "assets/camera/camera_data.png", barURL: "assets/camera/camera_top.png" }),
				new menuButton({ pictureURL: "assets/log/log.png", pictureSelectedURL: "assets/log/log_activated.png",
						appBody: "assets/log/log_data.png", barURL: "assets/log/log_top.png" }),
				new menuButton({ pictureURL: "assets/settings/settings.png", pictureSelectedURL: "assets/settings/settings_activated.png",
						appBody: "assets/settings/settings_data.png", barURL: "assets/settings/settings_top.png" }),
			]
		}),
	]

});

// Handler bindings & behavior
Handler.bind("/delay", Behavior({
	onInvoke: function(handler, message) {
		handler.wait(3000);
	},
	onComplete: function(handler, message) {
		handler.invoke(new Message("/update"));
	}
}));

application.add(mainColumn);