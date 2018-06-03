export default `
mutation ($id: Int) {
  DeleteMediaListEntry(id: $id) {
    deleted
  }
}
`;
