/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.echo-sdk-ams.app.3dde646d-d3b0-4f82-b459-d0d5f94e29ef';

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var http = require('http');

/**
 * CanIGiveMyDog is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var CanIGiveMyDog = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
CanIGiveMyDog.prototype = Object.create(AlexaSkill.prototype);
CanIGiveMyDog.prototype.constructor = CanIGiveMyDog;

CanIGiveMyDog.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("CanIGiveMyDog onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

CanIGiveMyDog.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("CanIGiveMyDog onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "What would you like to give your dog?";
    var repromptText = "You can say an apple";
    response.ask(speechOutput, repromptText);
};

CanIGiveMyDog.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("CanIGiveMyDog onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

CanIGiveMyDog.prototype.intentHandlers = {
    // register custom intent handlers
    "CanIGiveMyDogIntent": function (intent, session, response) {
      var food = intent.slots.Food.value.toLowerCase();

      console.log("The food was: ", food);

      http.get('http://canigivemydog-api.herokuapp.com?q=' + food, function(res) {
        var reply = '';

        res.on('data', function(data) {
          reply += data;
        })

        res.on('end', function() {
          console.log("The resp was: ", reply);
          var answer = JSON.parse(reply);

          response.tell(answer.err ? "Sorry, food not found. Try asking again a different way" : answer.question + answer.answer);
        });
      });

        // response.tellWithCard("Hello World!", "Greeter", "Hello World!");
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say an apple", "You can say an apple");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the CanIGiveMyDog skill.
    var canIGiveMyDog = new CanIGiveMyDog();
    canIGiveMyDog.execute(event, context);
};
