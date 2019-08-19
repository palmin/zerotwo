export default `
query GetListByUsername($userName: String!, $type: MediaType!) {
  list: MediaListCollection(userName: $userName, type: $type, forceSingleCompletedList: true) {
    lists {
      status
      entries {
        id
        progress
        score
        status
        updatedAt
        media {
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
            medium
            large
            extraLarge
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
    }
  }
}
`;
