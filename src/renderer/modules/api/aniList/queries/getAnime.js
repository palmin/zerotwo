export default `query GetAnime($page: Int!, $perPage: Int!) {
  Page(page: $page, perPage: $perPage) {
    media {
      id
      title {
        romaji
        english
        native
        userPreferred
      }
      description(asHtml: false)
      startDate
      endDate
      season
      status
      format
      type
      episodes
      isLicensed
      updatedAt
      coverImage
      synonyms
      averageScore
      favourites
      isAdult
      nextAiringEpisode
      streamingEpisodes
    }
  }
}`;
