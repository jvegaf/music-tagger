const Scraper = require('electron-images-scraper');

const scraper = new Scraper({
  puppeteer: {
    //headless: false,
  },
  tbs: {
    isz: "m", // medium size
    iar: "s", // square format
    ift: "jpg" // ift: "png"
  },
});

console.log(scraper);


module.exports.findCovers = async (musicTag) => {
  const query = makeQuery(musicTag);
  return await scraper.scrape(query, 4);
};

const makeQuery = (musicTag) => {
  const query = musicTag.artistTag + "+" + musicTag.titleTag + "+cover+art";
  return query.replace(/\s/g, "+");
}
