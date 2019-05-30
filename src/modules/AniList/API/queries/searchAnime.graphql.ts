export default `
query searchAnime({0}) {
  page: Page {
    media({1}) {
      id
      title {
        romaji
        english
        native
      }
      averageScore
      coverImage {
        extraLarge
      }
      episodes
      isAdult
      mediaListEntry {
        status
        score
        progress
      }
    }
  }
}
`;
