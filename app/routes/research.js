const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');

function ResearchHandler (db) {
    "use strict";

    const STOCK_API_BASE_URL = 'https://api.example-stock-service.com/quote/';

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {
        
        if (req.query.symbol) {
            const symbol = req.query.symbol;
            
            // Validate symbol contains only allowed characters for stock tickers
            if (!/^[A-Za-z0-9.\-]+$/.test(symbol)) {
                res.status(400);
                return res.send('Invalid symbol format');
            }
            
            const url = STOCK_API_BASE_URL + encodeURIComponent(symbol);
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
