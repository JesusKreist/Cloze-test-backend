import {
  DateResolver,
  TimeResolver,
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
  ISBNResolver,
} from "graphql-scalars";

export const customResolverMap = {
  Date: DateResolver,
  Time: TimeResolver,
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  URL: URLResolver,
  ISBN: ISBNResolver,
};
