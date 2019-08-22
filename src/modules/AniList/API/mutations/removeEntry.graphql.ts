export default `
mutation ($entryId: Int) {
  DeleteMediaListEntry(id: $entryId) {
    deleted
  }
}
`;
