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

const handlers = {
    'LaunchRequest': function () {
        this.emit('UKHighway');
    },
    'GetUKHighwayIntent': function () {
        this.emit('UKHighway');
    },

    'UKHighway': function () {

        const url = 'http://api.hatrafficinfo.dft.gov.uk/datexphase2/dtxRss.aspx?srcUrl=http://hatrafficinfo.dft.gov.uk/feeds/rss/UnplannedEvents.xml&justToday=Y&sortfield=road&sortorder=up';
        var road = this.event.request.intent.slots.road.value.toLocaleLowerCase();
        console.log('Road is '+ road);
        if(!road || road == undefined || road == "" || road.length == 0){
            var CANTFINDROAD ='Sorry I dont have any information about this road';
            this.emit(':tellWithCard', CANTFINDROAD,'UKHighway', CANTFINDROAD);
            return;
        }
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



                this.emit(':tellWithCard', speechOutput,'UKHighway', speechOutput);

            }.bind(this))
            .catch(function(error) {console.error('error: ', error)});


    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.

    alexa.registerHandlers(handlers);
    alexa.execute();
};

