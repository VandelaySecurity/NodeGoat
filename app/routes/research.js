const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');

function ResearchHandler (db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {
        
        const ALLOWED_STOCK_API_BASES = [
            'https://api.example-stock-service.com/quote/',
            'https://finance.trusted-provider.com/stock/'
        ];
        
        if (req.query.symbol) {
            const requestedBase = req.query.url;
            let isAllowed = false;
            for (const allowedBase of ALLOWED_STOCK_API_BASES) {
                if (requestedBase === allowedBase) {
                    isAllowed = true;
                    break;
                }
            }
            if (!isAllowed) {
                res.status(400);
                return res.send('Invalid stock API endpoint');
            }
            const url = requestedBase + encodeURIComponent(req.query.symbol);
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
