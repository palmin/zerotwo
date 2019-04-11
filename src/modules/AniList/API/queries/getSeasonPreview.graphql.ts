export default `
query getSeasonAnime($seasonYear: Int, $season: MediaSeason) {
  page: Page {
    media(season: $season, seasonYear: $seasonYear, type: ANIME) {
      id
      title {
        userPreferred
      }
      startDate {
        year
        month
        day
      }
      episodes
      streamingEpisodes {
        title
        url
      }
      coverImage {
        extraLarge
      }
      bannerImage
      genres
      nextAiringEpisode {
        episode
        timeUntilAiring
      }
      isAdult
      isLocked
      description
    }
  }
}
`;
