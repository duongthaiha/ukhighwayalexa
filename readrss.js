(function () {
    var items =[];


    var request = require('request'); // for fetching the feed
    const feedparser = require('feedparser-promised');

    const url = 'http://api.hatrafficinfo.dft.gov.uk/datexphase2/dtxRss.aspx?srcUrl=http://hatrafficinfo.dft.gov.uk/feeds/rss/UnplannedEvents.xml&justToday=Y&sortfield=road&sortorder=up';

    feedparser.parse(url)
        .then(function (items, self) {
            console.log('ReadItem length'+items.length);

            const speechOutput ='outerItems has ' +items.length +' items';
            this.emit(':tellWithCard', speechOutput,'UKHighway', speechOutput);
        }.bind(this))
        .catch(function(error) {console.error('error: ', error)});
    // // Get a random space fact from the space facts list
    // // Use this.t() to get corresponding language data
    // const factArr = this.t('FACTS');
    // const factIndex = Math.floor(Math.random() * factArr.length);
    // const randomFact = factArr[factIndex];



    // feedparser.on('readable', function () {
    //     // This is where the action is!
    //     var stream = this; // `this` is `feedparser`, which is a stream
    //     var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    //     var item;
    //
    //     while (item = stream.read()) {
    //         //console.log(item);
    //         items.push(item);
    //
    //     }
    //
    // });
    // feedparser.on('end', function () {
    //     console.log(items.length);
    //     const speechOutput ='Item has ' +items.length +' items';
    //     this.emit(':tellWithCard', speechOutput,'UKHighway', speechOutput);
    // });
    // var req = request
    //     .get('http://api.hatrafficinfo.dft.gov.uk/datexphase2/dtxRss.aspx?srcUrl=http://hatrafficinfo.dft.gov.uk/feeds/rss/UnplannedEvents.xml&justToday=Y&sortfield=road&sortorder=up')
    //     .on('error', function (error) {
    //         // handle any request errors
    //     })
    //     .on('response', function (res) {
    //         var stream = this; // `this` is `req`, which is a stream
    //
    //         if (res.statusCode !== 200) {
    //             this.emit('error', new Error('Bad status code'));
    //         }
    //         else {
    //             stream.pipe(feedparser);
    //         }
    //     });

})();
