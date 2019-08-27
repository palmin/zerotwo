export default `
mutation addEntry($mediaId: Int!, $status: MediaListStatus!, $progress: Int, $score: Float) {
  response: SaveMediaListEntry(mediaId: $mediaId, status: $status, score: $score, progress: $progress) {
    media {
      title {
        userPreferred
      }
    }
  }
}
`;
