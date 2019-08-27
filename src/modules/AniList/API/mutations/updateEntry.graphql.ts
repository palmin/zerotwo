export default `
mutation setEntryComplete($entryId: Int!, $progress: Int!, $score: Float!, $status: MediaListStatus!) {
  SaveMediaListEntry(id: $entryId, progress: $progress, status: $status, score: $score) {
    media {
      title {
        userPreferred
      }
    }
    progress
    status
    score
  }
}
`;
