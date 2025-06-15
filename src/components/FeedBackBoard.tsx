import React from "react";
import { useNavigate } from "react-router-dom";

interface StatusCounts {
  planned: number;
  inProgress: number;
  live: number;
}

interface FeedbackBoardProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  statusCounts: StatusCounts;
}

const FeedbackBoard: React.FC<FeedbackBoardProps> = ({
  selectedTag,
  onSelectTag,
  statusCounts,
}) => {
  const navigate = useNavigate();
  const tags = ["All", "UI", "UX", "Enhancement", "Bug", "Feature"];

  return (
    <div className="hidden sm:flex flex-col md:flex-row lg:flex-col gap-6 w-full">
      {/* Card 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-1/3 lg:w-full">
        <div
          className="h-36 flex flex-col justify-end p-6 rounded-lg"
          style={{
            background:
              "linear-gradient(210deg,rgba(232, 77, 112, 1) 0%, rgba(163, 55, 246, 1) 53%, rgba(40, 167, 237, 1) 100%)",
          }}
        >
          <h2 className="text-2xl font-bold text-white">Frontend Mentor</h2>
          <h1 className="text-xl font-normal text-white">Feedback Board</h1>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/3 lg:w-full">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedTag === tag
                  ? "bg-[#4661E6] text-white"
                  : "bg-[#F2F4FF] text-[#4661E6] hover:bg-[#CFD7FF]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/3 lg:w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-[#3A4374]">Roadmap</h2>
          <button
            onClick={() => navigate("/roadmap")}
            className="text-[#4661E6] text-sm font-medium hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            View
          </button>
        </div>

        <div className="space-y-3">
          {[
            { label: "Planned", count: statusCounts.planned, color: "bg-[#F49F85]" },
            { label: "In-Progress", count: statusCounts.inProgress, color: "bg-[#AD1FEA]" },
            { label: "Live", count: statusCounts.live, color: "bg-[#62BCFA]" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${item.color} mr-4`} />
                <span className="text-[#647196]">{item.label}</span>
              </div>
              <span className="font-bold text-[#647196]">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackBoard;
