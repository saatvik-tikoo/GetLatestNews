const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise')
var cors = require('cors')

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const API_KEY_GUARDIAN = 'c500dba6-3a09-4c78-a1c9-2a09646ee973';
const API_KEY_NYTIMES = 'AJPeLrtxSFYfyySA37ZivaCvgKoN0YLZ';

// Add restful services  

// Get Guardian Sections
app.get('/api/guardian/', cors(), function (req, res) {
    let section = '';
    let sectionsList = ['sport', 'business', 'technology', 'politics', 'world'];
    if (req.query.section === 'home') {
        section = 'sport|business|technology|politics|world';
    } else if (sectionsList.indexOf(req.query.section) >= 0) {
        section = req.query.section;
    } else {
        res.status(400).json({ "message": "Wrong URL" });
        return;
    }
    url = 'https://content.guardianapis.com/search?api-key=' + API_KEY_GUARDIAN + '&section=' + section +
        '&show-blocks=main,body:latest:1&page-size=20';

    request(url)
        .then((json) => {
            let data = JSON.parse(json).response.results;
            let response = [];
            let color = {
                'world': '#7C4EFC',
                'politics': '#409487',
                'business': '#4595EC',
                'technology': '#CEDC39',
                'sport': '#F6C144'
            };
            let font = {
                'technology': '#000000',
                'sport': '#000000'
            }
            for (let i = 0; i < data.length && response.length < 10; i++) {
                let news = data[i];
                if (news.webTitle && news.sectionId && news.webPublicationDate && news.id &&
                    news.blocks.requestedBodyBlocks['body:latest:1'][0].bodyTextSummary && news.webUrl) {
                    let main = news.blocks.main;
                    let img;
                    if (main && main.elements[0] && main.elements[0].assets[news.blocks.main.elements[0].assets.length - 1]) {
                        img = main.elements[0].assets[news.blocks.main.elements[0].assets.length - 1].file;
                    }
                    response.push({
                        'ID': news.id,
                        'Title': news.webTitle,
                        'Image': img ? img : 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png',
                        'Section': news.sectionId,
                        'Color': news.sectionId.toLowerCase() in color ? color[news.sectionId.toLowerCase()] : '#6E757C',
                        'FontColor': news.sectionId.toLowerCase() in font ? font[news.sectionId.toLowerCase()] : '#ffffff',
                        'Date': news.webPublicationDate,
                        'Description': news.blocks.requestedBodyBlocks['body:latest:1'][0].bodyTextSummary,
                        'Link': news.webUrl
                    });
                }
            }
            res.json({
                "message": "success",
                "response": JSON.parse(JSON.stringify(response)),
                "total": response.length
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ "message": error });
        })
});

// Get NewYorkTimes Sections
app.get('/api/nytimes/', cors(), function (req, res) {
    sectionsList = ['home', 'sports', 'business', 'technology', 'politics', 'world'];
    if (sectionsList.indexOf(req.query.section) < 0) {
        res.status(400).json({ "message": "Wrong URL" });
        return;
    }
    url = 'https://api.nytimes.com/svc/topstories/v2/' + req.query.section + '.json' + '?api-key=' +
        API_KEY_NYTIMES;
console.log(url)
    request(url)
        .then((json) => {
            let data = JSON.parse(json).results
            let response = [];
            let color = {
                'world': '#7C4EFC',
                'politics': '#409487',
                'business': '#4595EC',
                'technology': '#CEDC39',
                'sports': '#F6C144'
            };
            let font = {
                'technology': '#000000',
                'sports': '#000000'
            }
            for (let i = 0; i < data.length && response.length < 10; i++) {
                let news = data[i];
                if (news.title && news.section && news.published_date && news.abstract && news.url) {
                    let img;
                    if (news.multimedia && news.multimedia.length > 0) {
                        let images = news.multimedia
                        for (let idx = 0; idx < images.length; idx++) {
                            if (images[idx].width && images[idx].width >= 2000) {
                                img = images[idx].url;
                            }
                        }
                    }
                    
                    if (img && img.substring(0, 4) !== 'http') {
                        img = 'https://nyt.com/' + img
                    }
                    response.push({
                        'ID': news.url,
                        'Title': news.title,
                        'Image': img ? img : 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg',
                        'Section': news.section,
                        'Color': news.section.toLowerCase() in color ? color[news.section.toLowerCase()] : '#6E757C',
                        'FontColor': news.section.toLowerCase() in font ? font[news.section.toLowerCase()] : '#ffffff',
                        'Date': news.published_date,
                        'Description': news.abstract,
                        'Link': news.url
                    });
                }
            }
            res.json({
                "message": "success",
                "response": JSON.parse(JSON.stringify(response)),
                "total": response.length
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ "message": error });
        })
});

// Get Guardian Detailed Article
app.get('/api/guardian/article', cors(), function (req, res) {
    url = 'https://content.guardianapis.com/' + req.query.id + '?api-key=' + API_KEY_GUARDIAN + '&show-blocks=all';
    request(url)
        .then((json) => {
            let data = JSON.parse(json).response.content;
            let color = {
                'world': '#7C4EFC',
                'politics': '#409487',
                'business': '#4595EC',
                'technology': '#CEDC39',
                'sport': '#F6C144'
            };
            let font = {
                'technology': '#000000',
                'sport': '#000000'
            }
            let img;
            if (data.blocks.main.elements.length > 0 && data.blocks.main.elements[0].assets &&
                data.blocks.main.elements[0].assets.length > 0 &&
                data.blocks.main.elements[0].assets[data.blocks.main.elements[0].assets.length - 1]) {
                img = data.blocks.main.elements[0].assets[data.blocks.main.elements[0].assets.length - 1].file
            }
            let response = {
                'ID': data.id,
                'Title': data.webTitle,
                'Image': img ? img : 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png',
                'Date': data.webPublicationDate,
                'Description': data.blocks.body[0].bodyTextSummary,
                'Section': data.sectionId,
                'Color': data.sectionId.toLowerCase() in color ? color[data.sectionId.toLowerCase()] : '#6E757C',
                'FontColor': data.sectionId.toLowerCase() in font ? font[data.sectionId.toLowerCase()] : '#ffffff',
                'Type': 'GUARDIAN',
                'Type_color': '#13284A',
                'Type_FontColor': '#ffffff',
                'Link': data.webUrl
            };
            res.json({
                "message": "success",
                "response": JSON.parse(JSON.stringify(response)),
                "total": response.length
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ "message": error });
        })
});

// Get NewYorkTimes Detailed Article
app.get('/api/nytimes/article', cors(), function (req, res) {
    url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + req.query.id +
        '")&api-key=' + API_KEY_NYTIMES;
    request(url)
        .then((json) => {
            let data = JSON.parse(json).response.docs[0]
            let color = {
                'world': '#7C4EFC',
                'politics': '#409487',
                'business': '#4595EC',
                'technology': '#CEDC39',
                'sports': '#F6C144'
            };
            let font = {
                'technology': '#000000',
                'sports': '#000000'
            }
            let img;
            if (data.multimedia && data.multimedia.length > 0) {
                let images = data.multimedia
                for (let idx = 0; idx < images.length; idx++) {
                    if (images[idx].width && images[idx].width >= 2000) {
                        img = images[idx].url;
                    }
                }
            }
            
            if (img && img.substring(0, 4) !== 'http') {
                img = 'https://nyt.com/' + img
            }
            let response = {
                'ID': data.web_url,
                'Title': data.headline.main,
                'Image': img ? img : 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg',
                'Date': data.pub_date,
                'Description': data.abstract,
                'Section': data.section_name,
                'Color': data.section_name.toLowerCase() in color ? color[data.section_name.toLowerCase()] : '#6E757C',
                'FontColor': data.section_name.toLowerCase() in font ? font[data.section_name.toLowerCase()] : '#ffffff',
                'Type': 'NYTIMES',
                'Type_color': '#DDDDDD',
                'Type_FontColor': '#000000',
                'Link': data.web_url
            };
            res.json({
                "message": "success",
                "response": JSON.parse(JSON.stringify(response)),
                "total": response.length
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ "message": error });
        })
});

// Get Guardian Search Results
app.get('/api/guardian/search', cors(), function (req, res) {
    url = 'https://content.guardianapis.com/search?q=' + req.query.q + '&api-key=' + API_KEY_GUARDIAN +
        '&show-blocks=main,body:latest:1&page-size=7';

    request(url)
        .then((json) => {
            let data = JSON.parse(json).response.results;
            let response = [];
            let color = {
                'world': '#7C4EFC',
                'politics': '#409487',
                'business': '#4595EC',
                'technology': '#CEDC39',
                'sport': '#F6C144'
            };
            let font = {
                'technology': '#000000',
                'sport': '#000000'
            }
            for (let i = 0; i < data.length && response.length < 5; i++) {
                let news = data[i];
                if (news.webTitle && news.sectionId && news.webPublicationDate && news.id &&
                    news.blocks.requestedBodyBlocks['body:latest:1'][0].bodyTextSummary && news.webUrl) {
                    let main = news.blocks.main;
                    let img;
                    if (main && main.elements[0] && main.elements[0].assets[news.blocks.main.elements[0].assets.length - 1]) {
                        img = main.elements[0].assets[news.blocks.main.elements[0].assets.length - 1].file;
                    }
                    response.push({
                        'ID': news.id,
                        'Title': news.webTitle,
                        'Image': img ? img : 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png',
                        'Section': news.sectionId,
                        'Color': news.sectionId.toLowerCase() in color ? color[news.sectionId.toLowerCase()] : '#6E757C',
                        'FontColor': news.sectionId.toLowerCase() in font ? font[news.sectionId.toLowerCase()] : '#ffffff',
                        'Date': news.webPublicationDate,
                        'Link': news.webUrl
                    });
                }
            }
            res.json({
                "message": "success",
                "response": JSON.parse(JSON.stringify(response)),
                "total": response.length
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ "message": error });
        })
});

// Get NewYorkTimes Search Results
app.get('/api/nytimes/search', cors(), function (req, res) {
    url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + req.query.q + '&api-key=' +
        API_KEY_NYTIMES;

    request(url)
        .then((json) => {
            let data = JSON.parse(json).response.docs
            let response = [];
            let color = {
                'world': '#7C4EFC',
                'politics': '#409487',
                'business': '#4595EC',
                'technology': '#CEDC39',
                'sports': '#F6C144'
            };
            let font = {
                'technology': '#000000',
                'sports': '#000000'
            }
            for (let i = 0; i < data.length && response.length < 5; i++) {
                let news = data[i];
                if (news.web_url && news.headline.main && news.section_name && news.pub_date) {
                    let img;
                    if (news.multimedia && news.multimedia.length > 0) {
                        let images = news.multimedia
                        for (let idx = 0; idx < images.length; idx++) {
                            if (images[idx].width && images[idx].width >= 2000) {
                                img = images[idx].url;
                            }
                        }
                    }
                    if (img && img.substring(0, 4) !== 'http') {
                        img = 'https://nyt.com/' + img
                    }
                    response.push({
                        'ID': news.web_url,
                        'Title': news.headline.main,
                        'Image': img ? img : 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg',
                        'Date': news.pub_date,
                        'Section': news.section_name,
                        'Color': news.section_name.toLowerCase() in color ? color[news.section_name.toLowerCase()] : '#6E757C',
                        'FontColor': news.section_name.toLowerCase() in font ? font[news.section_name.toLowerCase()] : '#ffffff',
                        'Link': news.web_url
                    });
                }
            }
            res.json({
                "message": "success",
                "response": JSON.parse(JSON.stringify(response)),
                "total": response.length
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ "message": error });
        })
});

// Serve static files   
app.listen(8000);