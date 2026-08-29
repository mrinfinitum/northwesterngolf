export const MENU_QUERY = /* GraphQL */ `
  query Menu($handle: String!) {
    menu(handle: $handle) {
      handle
      id
      items {
        id
        title
        type
        url
        items {
          id
          title
          type
          url
          items { id title type url }
        }
      }
      title
    }
  }
`;
