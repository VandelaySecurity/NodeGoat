const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require('needle');

function ResearchHandler (db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {
        
        if (req.query.symbol) {
            const url = req.query.url+req.query.symbol; 

            if (!/^https?:\/\//.test(req.query.url)) {
                return res.status(400).send("Invalid URL");
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
