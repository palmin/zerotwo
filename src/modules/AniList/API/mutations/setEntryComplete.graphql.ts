export default `
mutation setEntryComplete($entryId: Int!, $progress: Int!, $date: FuzzyDateInput!) {
  SaveMediaListEntry(id: $entryId, progress: $progress, status: COMPLETED, completedAt: $date) {
    media {
      title {
        userPreferred
      }
    }
    progress
    status
    completedAt
  }
}
`;
