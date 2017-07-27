/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const feedparser = require('feedparser-promised');
const APP_ID = 'amzn1.ask.skill.b53fd34d-0921-414c-8242-1307f8ac7995';  // TODO replace with your app ID (OPTIONALv
const HELP_MESSAGE ='You can ask for road incident or traffic on UK highway network. What motorway do you want to know about?';
const STOP_MESSAGE ='No problem';
const CANCEL_MESSAGE ='No problem';
const ERROR_MESSAGE = 'Opss there is something wrong. We will look into this for you. Please try again'
const WELCOME_MESSAGE ='I can get latest motorway information for you.  You can ask questions like: any incident on M1?';
const MISSING_SLOT ='What motorway do you want to know about?';
const UNHANDLED = 'I am not sure how to handle this request. Try again something like:  any incident on M1';
const handlers = {
    'LaunchRequest': function () {
        console.log('In launch request');
        this.emit('UKHighway');
    },
    'GetUKHighwayIntent': function () {
        this.emit('UKHighway');
    },


    'UKHighway': function () {

        const url = 'http://api.hatrafficinfo.dft.gov.uk/datexphase2/dtxRss.aspx?srcUrl=http://hatrafficinfo.dft.gov.uk/feeds/rss/UnplannedEvents.xml&justToday=Y&sortfield=road&sortorder=up';
        console.log(this.event.request);
        if(this.event.request.intent == undefined){
            console.log("Can not find intent");
            this.emit(':ask',WELCOME_MESSAGE);
            return;
        }
        if(this.event.request.intent.slots == undefined){
            console.log("Can not find slots");
            this.emit(':ask',MISSING_SLOT);
            return;
        }

        if(this.event.request.intent.slots.road == undefined){
            console.log("Can not find road");
            this.emit(':ask',MISSING_SLOT);
            return;
        }
        console.log('Road is '+this.event.request.intent.slots.road);

        var road = this.event.request.intent.slots.road;

        if(!road || road == undefined || road == "" || road.length == 0){

            this.emit(':ask', MISSING_SLOT);
            return;


        }

        console.log('Road value is '+ this.event.request.intent.slots.road.value);
        var road = road.value;
        console.log('Current value of road variable is ' +road);
        if(!road || road == undefined || road == "" || road.length == 0){
            this.emit(':ask', MISSING_SLOT);
            return;
        }
        road = road.toLocaleLowerCase();
        feedparser.parse(url)
            .then(function (items) {

                console.log('Items length'+items.length);
                var matchedRoads = items.filter(function (item) {
                    var itemRoad = item["rss:road"]["#"].toLowerCase();
                    return itemRoad=== road.toLowerCase();
                });
                var speechOutput ='There is no incident on '+road;
                if(matchedRoads.length>0){
                    var trafficDetails = matchedRoads.map(function (matchedRoad) {

                        return matchedRoad.title.split('|')[0].toLocaleLowerCase().replace(road,'');
                    })
                    var summary ='';
                    if(matchedRoads.length==1){
                        summary = 'There is only one incident on '+road ;
                    }else{
                        summary = 'There is ' + matchedRoads.length +' incidents on ' +road;
                    }
                    speechOutput = summary + ' ' + trafficDetails.join();
                    console.log('speechOutPut '+ speechOutput);
                }



                this.emit(':tell', speechOutput);

            }.bind(this))
            .catch(function(error) {

                console.error('error: ', error);
                this.emit(':tell',ERROR_MESSAGE);
            });


    },
    'AMAZON.HelpIntent': function () {
        console.log('Help triggered');
       this.emit(':ask',HELP_MESSAGE);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', CANCEL_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'Unhandled': function() {
        console.log('Unhandler is triggered');
        this.emit(':ask',UNHANDLED);
        return;
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.

    alexa.registerHandlers(handlers);
    alexa.execute();
};

