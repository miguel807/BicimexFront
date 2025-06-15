import type { User } from "./user";

export default  interface Reply {
    content: string;
    replyingTo: string;
    user: User;
  }