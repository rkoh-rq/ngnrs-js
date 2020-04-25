// Problem 2
// Task: Implement a datasource connector to abstract away data retrieval and manipulation from the `ViewControllers`.  
// Your solution shall use only [Vanilla JavaScript](http://vanilla-js.com).  

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function PItem(list){
    this.pair = list.pair;
    this.mid = function(){
         return (list.buy+list.sell)/200;
    }
    this.quote = function(){
        return list.pair.slice(3, 6);
    }
}

Datasource = class {
    getPrices(){
        var request = new XMLHttpRequest();
        request.open("GET", 'https://static.ngnrs.io/test/prices');
        request.send();

        var promise = new Promise(function(resolve, reject) {
            request.onreadystatechange = function () {

                // Only run if the request is complete
                if (this.readyState !== 4) return;
                // Process the response
                if (this.status >= 200 && this.status < 300) {
                    // If successful, parse JSON into object PItem
                    var myArr = JSON.parse(this.responseText).data.prices.map(list => new PItem(list));
                    //myArr.forEach (p => console.log(p))
                    resolve(myArr);
                } else {
                    // If failed
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
          });
        return promise
    }
}

let ds = new Datasource();
ds.getPrices()
    .then(prices => {
        prices.forEach(price => {
            console.log(`Mid price for ${ price.pair } is ${ price.mid() } ${ price.quote() }.`);
        });
    }).catch(error => {
        console.error(error);
    });