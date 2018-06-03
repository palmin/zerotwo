export default `query Search($query: String!, $page: Int, $perPage: Int) {
  results: Page(page: $page, perPage: $perPage) {
    media(search: $query, type: ANIME) {
      id
      title {
        romaji
        english
        native
        userPreferred
      }
      description(asHtml: false)
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      season
      status
      format
      type
      episodes
      isLicensed
      coverImage {
        medium
      }
      synonyms
      averageScore
      favourites
      isAdult
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
        mediaId
      }
      streamingEpisodes {
        title
        thumbnail
        url
        site
      }
    }
  }
}`;
