import {
  DateResolver,
  EmailAddressResolver,
  URLResolver,
} from "graphql-scalars";

export const customResolverMap = {
  Date: DateResolver,
  EmailAddress: EmailAddressResolver,
  URL: URLResolver,
};
