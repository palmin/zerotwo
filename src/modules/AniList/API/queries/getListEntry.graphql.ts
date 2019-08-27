export default `
query GetByMediaId($mediaId: Int!) {
  media: Media(id: $mediaId) {
    mediaListEntry {
      id
      progress
      score
      status
      updatedAt
    }
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
    genres
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
