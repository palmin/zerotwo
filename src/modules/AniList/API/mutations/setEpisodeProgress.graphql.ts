export default `
mutation setEpisodeProgress($entryId: Int!, $progress: Int!) {
  SaveMediaListEntry(id: $entryId, progress: $progress) {
    media {
      title {
        userPreferred
      }
    }
    progress
  }
}
`;
