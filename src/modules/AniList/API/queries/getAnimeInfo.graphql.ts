export default `
query GetAnime($id: Int!) {
  media: Media(id: $id) {
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
    updatedAt
    coverImage {
      extraLarge
      large
      medium
    }
    bannerImage
    synonyms
    averageScore
    favourites
    isAdult
    nextAiringEpisode {
      id
    }
    streamingEpisodes {
      title
      thumbnail
      url
      site
    }
  }
}
`;
