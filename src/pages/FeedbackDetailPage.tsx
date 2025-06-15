import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../services/api";
import { rutes } from "../../config/rutes";
import { useToast } from "../libs/toastProvider";

const data = {
  currentUser: {
    image: "../../public/user-images/image-zena.jpg",
    name: "Zena Kelley",
    username: "velvetround",
  },
};
interface User {
  image: string;
  name: string;
  username: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  replies?: Reply[];
}

interface Reply {
  content: string;
  replyingTo: string;
  user: User;
}

interface Feedback {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments?: Comment[];
}

const FeedbackDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const showToast = useToast();

  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState<{
    commentId: number;
    text: string;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    username: string;
    commentId: number;
  } | null>(null);
  const apiService = new ApiService();

  const fetchFeedback = async () => {
    console.log(loading)
    setLoading(true);
    try {
      const response = await apiService.get(`${rutes.data.feedback}${id}/`);

      const organizedComments = response.comments
        //@ts-ignore
        .filter((comment) => comment.parent_comment === null)
        .map((comment: any) => ({
          ...comment,
          replies: response.comments
            .filter((reply: any) => reply.parent_comment === comment.id)
            //@ts-ignore
            .sort(
              (a: any, b: any) =>
               //@ts-ignore
                new Date(a.created_at) - new Date(b.created_at)
            ),
        }))
        //@ts-ignore
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      setFeedback({
        ...response,
        comments: organizedComments,
      });
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFeedback();
    }
  }, [id]);

  if (!feedback) {
    return <div className="w-screen min-h-screen bg-[#F7F8FD]"></div>;
  }

  const handleReply = (username: string, commentId: number) => {
    setReplyingTo({ username, commentId });
    setNewReply({ commentId, text: "" }); // Inicializa el texto de respuesta
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      showToast("error", "You must write something in this field.");
      return;
    }
    if (newComment.length >= 250) {
      showToast("error", "Too long");
      return;
    }

    try {
      await apiService.post(`${rutes.data.comments}`, {
        content: newComment,
        feedback: id,
      });
      showToast("success", "Comment posted");
      setNewComment("");
      await fetchFeedback();
    } catch (error) {
      console.error("Error submitting comment:", error);
      showToast("error", "Error posting comment");
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (!newReply?.text.trim()) {
      showToast("error", "You must write something in this field.");
      return;
    }

    try {
      await apiService.post(`${rutes.data.comments}`, {
        content: newReply.text,
        feedback: id,
        parent_comment: commentId,
        replying_to: replyingTo?.username,
      });
      showToast("success", "Reply posted");
      setNewReply(null);
      setReplyingTo(null);
      await fetchFeedback();
    } catch (error) {
      console.error("Error submitting reply:", error);
      showToast("error", "Error posting reply");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#F7F8FD]">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-[#647196] font-bold hover:text-[#3A4374] bg-transparent"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
          <button
            onClick={() =>
              navigate(`/feedback/${feedback.id}/edit`, { state: { feedback } })
            }
            className="bg-[#4661E6] hover:bg-[#7C91F9] text-white font-normal py-2 px-4 rounded-lg"
          >
            Edit Feedback
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-transform duration-300 hover:scale-[1.02]">
          <div className="flex items-start">
            <button className="bg-[#F2F4FF] hover:bg-[#CFD7FF] text-[#3A4374] font-bold py-2 px-3 rounded-md flex flex-col items-center mr-8">
              <svg
                className="w-3 h-2 mb-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {feedback.upvotes}
            </button>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#3A4374] mb-2">
                {feedback.title}
              </h2>
              <p className="text-[#647196] mb-4">{feedback.description}</p>
              <span className="inline-block bg-[#F2F4FF] text-[#4661E6] text-sm font-bold px-4 py-1 rounded-md">
                {feedback.category}
              </span>
            </div>

            <div className="flex items-center text-[#647196] font-bold">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {feedback.comments
                ? feedback.comments.length +
                  feedback.comments.flatMap((c) => c.replies || []).length
                : 0}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-[#3A4374] mb-6">
            {feedback.comments?.reduce(
              (total, comment) => total + 1 + (comment.replies?.length || 0),
              0
            )}{" "}
            Comments
          </h3>

          {feedback.comments?.map((comment) => (
            <div key={comment.id} className="mb-8">
              {/* Comentario principal */}
              <div className="flex items-start mb-4 transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src={comment.user.image}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-[#3A4374]">
                        {comment.user.name}
                      </h4>
                      <p className="text-[#647196]">@{comment.user.username}</p>
                    </div>
                    <button
                      onClick={() =>
                        handleReply(comment.user.username, comment.id)
                      }
                      className="text-[#4661E6] bg-transparent font-semibold hover:underline"
                    >
                      Reply
                    </button>
                  </div>
                  <p className="text-[#647196] mb-4">{comment.content}</p>
                </div>
              </div>

              {/* Sección de respuestas */}
              {/* @ts-ignore */}
              {comment.replies?.length > 0 && (
                <div className="ml-8 pl-6 border-l-2 border-[#F2F4FF]">
                  {/* @ts-ignore */}
                  {comment?.replies.map((reply) => (
                     //@ts-ignore
                    <div key={reply?.id} className="mb-6 pt-4">
                      <div className="flex items-start">
                        <img
                          src={reply.user.image}
                          alt={reply.user.name}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h4 className="font-bold text-[#3A4374]">
                                {reply.user.name}
                              </h4>
                              <p className="text-[#647196]">
                                @{reply.user.username}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                 //@ts-ignore
                                handleReply(reply.user.username, reply?.id)
                              }
                              className="text-[#4661E6] bg-transparent font-semibold hover:underline"
                            >
                              Reply
                            </button>
                          </div>
                          <p className="text-[#647196]">
                            <span className="font-bold text-[#AD1FEA]">
                              {/*@ts-ignore*/}
                              @{reply?.replying_to?.username}
                            </span>{" "}
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo?.commentId === comment.id && (
                <div className="ml-14 mt-2 mb-6">
                  <div className="flex items-start">
                    <img
                      src={data.currentUser.image}
                      alt={data.currentUser.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newReply?.text || ""}
                        onChange={(e) =>
                          setNewReply({
                            commentId: replyingTo.commentId,
                            text: e.target.value,
                          })
                        }
                        placeholder={`Replying to @${replyingTo.username}`}
                        className="w-full p-4 border text-[#3A4374] border-gray-300 rounded-md bg-[#F7F8FD] focus:border-[#4661E6] focus:ring-1 focus:ring-[#4661E6]"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="bg-[#AD1FEA] hover:bg-[#C75AF6] text-white font-bold py-2 px-4 rounded-md"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-[#3A4374] mb-6">Add Comment</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here"
            className="w-full p-4 border text-[#3A4374] border-gray-300 rounded-md bg-[#F7F8FD] focus:border-[#4661E6] focus:ring-1 focus:ring-[#4661E6]"
            rows={4}
          />
          <div className="flex justify-between items-center mt-4">
            <p
              className={`text-sm ${
                newComment.length > 250 ? "text-[#D73737]" : "text-[#647196]"
              }`}
            >
              {Math.max(0, 250 - newComment.length)} Characters left
            </p>
            <button
              onClick={handleAddComment}
              disabled={newComment.length > 250 || newComment.length === 0}
              className={`bg-[#AD1FEA] text-white font-bold py-2 px-4 rounded-md ${
                newComment.length > 250 || newComment.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#C75AF6]"
              }`}
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailPage;
