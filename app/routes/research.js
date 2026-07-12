const { URL } = require('url');
const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');

function ResearchHandler (db) {
    "use strict";

    const ALLOWED_RESEARCH_HOSTS = [
        'api.stockprovider.com',
        'data.financialservice.com'
    ];

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {
        
        if (req.query.symbol) {
            const url = req.query.url+req.query.symbol; 
            
            let parsedUrl;
            try {
                parsedUrl = new URL(url);
            } catch (e) {
                res.status(400);
                return res.send('Invalid URL format');
            }
            
            if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
                res.status(400);
                return res.send('Only HTTP/HTTPS protocols are allowed');
            }
            
            if (!ALLOWED_RESEARCH_HOSTS.includes(parsedUrl.hostname)) {
                res.status(403);
                return res.send('Access to this host is not permitted');
            }
            
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
