
module.exports.findCovers = async (scraper, musicTag) => {
  const query = makeQuery(musicTag);
  return await scraper.scrape(query, 4);
};

const makeQuery = (musicTag) => {
  const query = musicTag.artistTag + "+" + musicTag.titleTag + "+cover+art";
  return query.replace(/\s/g, "+");
}
