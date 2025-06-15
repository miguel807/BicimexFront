import type { Comment } from "./comment";

export default  interface ProductRequest {
    id: number;
    title: string;
    category: 'feature' | 'enhancement' | 'bug';
    upvotes: number;
    status: 'suggestion' | 'planned' | 'in-progress' | 'live';
    description: string;
    comments?: Comment[];
  }