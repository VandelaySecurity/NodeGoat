const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');

function ResearchHandler (db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    const isAllowedStockApiUrl = (urlString) => {
        try {
            const url = new URL(urlString);
            
            // Check protocol is http or https
            if (url.protocol !== 'https:' && url.protocol !== 'http:') {
                return false;
            }
            
            // Allowlist of permitted stock API domains
            const allowedDomains = ['api.example-stock-service.com', 'quotes.trusted-provider.com'];
            if (!allowedDomains.includes(url.hostname)) {
                return false;
            }
            
            // Reject localhost and loopback
            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1') {
                return false;
            }
            
            // Reject private IP ranges
            if (url.hostname.startsWith('10.') || 
                url.hostname.startsWith('192.168.') ||
                (url.hostname.startsWith('172.') && 
                 parseInt(url.hostname.split('.')[1]) >= 16 && 
                 parseInt(url.hostname.split('.')[1]) <= 31)) {
                return false;
            }
            
            // Reject cloud metadata endpoints
            if (url.hostname === '169.254.169.254' || url.hostname === 'fd00:ec2::254') {
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    };

    this.displayResearch = (req, res) => {
        
        if (req.query.symbol) {
            const url = req.query.url+req.query.symbol; 
            if (!isAllowedStockApiUrl(url)) {
                res.status(400);
                return res.send('Invalid stock API URL');
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
