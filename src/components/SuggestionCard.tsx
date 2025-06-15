import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import { rutes } from "../../config/rutes";
import { useToast } from "../libs/toastProvider";

interface CardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotes?: number;
  comments?: number;
}

const SuggestionCard: React.FC<CardProps> = ({
  id,
  title,
  description,
  category,
  upvotes = 0,
  comments = 0,
}) => {
  const navigate = useNavigate();
  const apiService = new ApiService();
  const showToast = useToast();
  const [upvote, setUpvotes] = useState(upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async (e: React.MouseEvent, feedbackId: any) => {
    e.stopPropagation(); 

    try {
      const response = await apiService.post(
        `${rutes.data.feedback}${feedbackId}/upvote/`,
        {}
      );

      setUpvotes(response.upvotes);
      setHasUpvoted(true);

      showToast("success", response.message || "Vote updated!");
    } catch (error) {
      console.error("Error al votar:", error);
      showToast("error", "Could not update vote");
    }
  };
  return (
    <div className="max-w-full mr-3 cursor-pointer bg-white rounded-lg py-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
      <div className="flex items-start gap-4">
     
        <div
          onClick={(e) => {
            handleUpvote(e, id);
          }}
          className={`ml-1 px-3 py-2 rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
            hasUpvoted 
              ? 'bg-[#4661E6] text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-[#3A4374]'
          }`}  >
          <svg
            className={`w-3 h-3 ${hasUpvoted ? 'text-white' : 'text-[#4661E6]'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className={`font-bold text-sm mt-1 ${
            hasUpvoted ? 'text-white' : 'text-[#3A4374]'
          }`}>
            {upvote}
          </span>
        </div>

       
        <div className="flex-1" onClick={() => navigate(`/feedback/${id}`)}>
          <h3 className="font-bold text-lg text-[#3A4374] mb-1">{title}</h3>
          <p className="text-[#647196] text-sm mb-3">{description}</p>

          <div className="flex justify-between items-center">
           
            <span className="bg-blue-100 text-[#4661E6] text-xs font-medium px-3 py-1 rounded-full">
              {category}
            </span>

            <div className="flex items-center gap-1 mr-8">
              <div className="transform hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-4 h-4 text-gray-400"
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
              </div>
              <span className="text-[#3A4374] text-sm font-bold">
                {comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
