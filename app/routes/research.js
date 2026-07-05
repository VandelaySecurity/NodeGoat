const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');
const { URL } = require('url');

function ResearchHandler (db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {
        
        if (req.query.symbol) {
            const url = req.query.url+req.query.symbol; 
            
            // Validate URL to prevent SSRF
            let parsedUrl;
            try {
                parsedUrl = new URL(url);
            } catch (e) {
                return res.status(400).send('Invalid URL format');
            }

            // Allowlist of permitted stock data API hosts
            const allowedHosts = [
                'api.example-stock-service.com',
                'stockdata.example.com'
                // Add actual legitimate stock API domains here
            ];

            // Check protocol is HTTPS only
            if (parsedUrl.protocol !== 'https:') {
                return res.status(400).send('Only HTTPS URLs are allowed');
            }

            // Check hostname is in allowlist
            if (!allowedHosts.includes(parsedUrl.hostname)) {
                return res.status(400).send('URL host not permitted');
            }

            // Block private IP ranges and localhost
            const hostname = parsedUrl.hostname;
            if (hostname === 'localhost' || 
                hostname === '127.0.0.1' || 
                hostname === '::1' ||
                hostname.match(/^10\./) ||
                hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
                hostname.match(/^192\.168\./) ||
                hostname.match(/^169\.254\./)) {
                return res.status(400).send('Private IP addresses not allowed');
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
