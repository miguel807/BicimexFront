import type { CurrentUser } from "./currentUser";
import type { ProductRequest } from "./productRequest";

export default  interface ProductRequestsResponse {
    currentUser: CurrentUser;
    productRequests: ProductRequest[];
  }