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

module.exports.getCoverUrl = async (musicTag) => {
  const query = makeQuery(musicTag);
  const result = await scraper.scrape(query, 1);
  console.log(result[0].url);
  return result[0].url;
};

const makeQuery = (musicTag) => {
  const query = musicTag.artistTag + "+" + musicTag.titleTag + musicTag.albumTag + "+cover+art";
  return query.replace(/\s/g, "+");
}
