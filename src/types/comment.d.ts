import type { Reply } from "./reply";
import type { User } from "./user";

export default interface Comment {
    id: number;
    content: string;
    user: User;
    replies?: Reply[];
  }