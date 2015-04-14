#@program
whiteSkin = new Skin(fill: 'white')
labelStyle = new Style(
  font: 'bold 18px'
  color: 'black')
Handler.bind '/getCount', Behavior(onInvoke: (handler, message) ->
  count++
  counterLabel.string = count
  message.responseText = JSON.stringify(count: count)
  message.status = 200
  return
)
Handler.bind '/reset', Behavior(onInvoke: (handler, message) ->
  count = 0
  counterLabel.string = '0'
  message.responseText = JSON.stringify(count: '0')
  message.status = 200
  return
)

DRAGON = {}
DATA = {}
DATA['numFired'] = 0
DATA['numTreats'] = 20

roundToOnePlace = (num) ->
  +(Math.round(num + "e+1")  + "e-1")

Handler.bind '/posSense', Behavior(onInvoke: (handler, message) ->
  data = message.requestObject
  DRAGON.x = data.xPos
  DRAGON.y = data.yPos
  DRAGON.z = data.zPos
  xLabel.string = roundToOnePlace(DRAGON.x) + ' ft'
  yLabel.string = roundToOnePlace(DRAGON.y) + ' ft'
  zLabel.string = roundToOnePlace(DRAGON.z) + ' ft'
  message.status = 200
  return
)


Handler.bind '/foodSense', Behavior(onInvoke: (handler, message) ->
  data = message.requestObject
  DATA['numTreats'] = Math.floor data.foodWeight/2
  numTreatsLabel.string = DATA['numTreats']
  message.status = 200
  return
)

Handler.bind '/happySense', Behavior(onInvoke: (handler, message) ->
  data = message.requestObject
  DATA['happy'] = data.happy
  #numTreatsLabel.string = DATA['numTreats']
  message.status = 200
  return
)

Handler.bind '/getHappy', Behavior(onInvoke: (handler, message) ->
  # seriously just get happy
  message.responseText = JSON.stringify(happy: DATA['happy'])
  message.status = 200
  return
)

Handler.bind '/fire', Behavior(onInvoke: (handler, message) ->
  incrementNumFired()
  message.status = 200
  return
)

incrementNumFired = () ->
  DATA['numFired'] += 1
  numFiredLabel.string = DATA['numFired']

Handler.bind '/update', Behavior(onInvoke: (handler, message) ->
  reqData = JSON.parse message.requestText
  for k,v of reqData
    switch k
      when 'pitch' then pitchLabel.string = v
      when 'yaw' then yawLabel.string = v
      when 'power' then powerLabel.string = v
  message.status = 200
  return
)


Handler.bind '/getDragonPos', Behavior(onInvoke: (handler, message) ->
  message.responseText = JSON.stringify(DRAGON)
  message.status = 200
  return
)

Handler.bind '/getNumTreats', Behavior(onInvoke: (handler, message) ->
  message.responseText = JSON.stringify(numTreats: DATA['numTreats'])
  message.status = 200
  return
)


SimpleNum = Label.template(($) ->
  left: 0
  right: 0
  height: 40
  string: '0'
  style: labelStyle
)

SimpleLabel = Label.template(($) ->
  top: 0
  left: 0
  right: 0
  bottom: 0
  height: 40
  string: $.title
  style: labelStyle
)

SimpleLine = Line.template(($) ->
  top: 0, right: 0, bottom: 0, left: 0
  height: 40
  contents: $.contents
)

pitchLabel = new SimpleNum()
pitchLabel.string = '80'
yawLabel = new SimpleNum()
yawLabel.string = '120'
powerLabel = new SimpleNum()
powerLabel.string = '90'
xLabel = new SimpleNum()
yLabel = new SimpleNum()
zLabel = new SimpleNum()
numTreatsLabel = new SimpleNum()
numTreatsLabel.string = DATA['numTreats']
numFiredLabel = new SimpleNum()
numFiredLabel.string = DATA['numFired']

mainColumn = new Column(
  left: 0
  right: 0
  top: 0
  bottom: 0
  skin: whiteSkin
  contents: [
    new SimpleLine( contents: [
      new SimpleLabel( title: 'relative x pos' ),
      xLabel
    ]),
    new SimpleLine( contents: [
      new SimpleLabel( title: 'relative y pos' ),
      yLabel
    ]),
    new SimpleLine( contents: [
      new SimpleLabel( title: 'relative z pos' ),
      zLabel
    ]),
    new SimpleLine( contents: [
      new SimpleLabel( title: 'pitch' ),
      pitchLabel
    ]),
    new SimpleLine( contents: [
      new SimpleLabel( title: 'yaw' ),
      yawLabel
    ]),
    new SimpleLine( contents: [
      new SimpleLabel( title: 'power' ),
      powerLabel
    ]),
    new SimpleLine( contents: [
      new SimpleLabel( title: 'num treats' ),
      numTreatsLabel
    ]),
    new SimpleLine( contents: [
      new SimpleLabel( title: 'times fired' ),
      numFiredLabel
    ]),
  ])
ApplicationBehavior = Behavior.template(
  onLaunch: (application) ->
    application.shared = true
    return
  onQuit: (application) ->
    application.shared = false
    return
)
count = 0
application.add mainColumn
application.behavior = new ApplicationBehavior

application.invoke new MessageWithObject('pins:configure',
  pos:
    require: 'pos'
    pins:
      xPos: pin: 64
      yPos: pin: 53
      zPos: pin: 48
  food:
    require: 'food'
    pins:
      foodWeight: pin: 64
  happy:
    require: 'happy'
    pins:
      happy: pin: 64
)


application.invoke( new MessageWithObject( "pins:/pos/read?repeat=on&callback=/posSense&interval=100" ) )
application.invoke( new MessageWithObject( "pins:/food/read?repeat=on&callback=/foodSense&interval=1000" ) )
application.invoke( new MessageWithObject( "pins:/happy/read?repeat=on&callback=/happySense&interval=1000" ) )

