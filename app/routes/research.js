const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');

function ResearchHandler (db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {
        
        if (req.query.symbol) {
            const baseUrl = 'https://trusted-stock-service.com/api?symbol=';
            const symbol = req.query.symbol;
            // Validate symbol to allow only alphanumeric characters
            if (!/^[a-zA-Z0-9]+$/.test(symbol)) {
                return res.status(400).send('Invalid symbol parameter');
            }
            const url = baseUrl + encodeURIComponent(symbol);
            return needle.get(url, (error, newResponse) => {
                if (!error && newResponse.statusCode == 200)
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write('<h1>The following is the stock information you requested.</h1>\n\n');
                    res.write('\n\n');
                    res.write(newResponse.body);
                    return res.end();
            });
        }
        
        return res.render("research");
    };

}

module.exports = ResearchHandler;
