export default `
mutation addEntry($mediaId: Int!, $status: MediaListStatus!) {
  response: SaveMediaListEntry(mediaId: $mediaId, status: $status) {
    media {
      title {
        userPreferred
      }
    }
  }
}
`;
