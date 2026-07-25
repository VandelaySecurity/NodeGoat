const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');
const he = require('he');

function ResearchHandler (db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);
    const ALLOWED_BASE_URLS = ['https://api.trustedstockprovider.com/', 'https://finance.trustedsite.com/'];

    this.displayResearch = (req, res) => {
        
        if (req.query.symbol) {
            if (!req.query.url || !ALLOWED_BASE_URLS.some(allowed => req.query.url.startsWith(allowed))) {
                return res.status(400).send('Invalid URL parameter');
            }
            const url = req.query.url+req.query.symbol; 
            return needle.get(url, (error, newResponse) => {
                if (!error && newResponse.statusCode == 200)
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<h1>The following is the stock information you requested.</h1>\n\n');
                    res.write('\n\n');
                    res.write(he.encode(newResponse.body));
                    return res.end();
            });
        }
        
        return res.render("research");
    };

}

module.exports = ResearchHandler;
