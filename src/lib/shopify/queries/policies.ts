export const POLICIES_QUERY = /* GraphQL */ `
  fragment policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policies {
    shop {
      privacyPolicy { ...policy }
      refundPolicy { ...policy }
      shippingPolicy { ...policy }
      termsOfService { ...policy }
    }
  }
`;
