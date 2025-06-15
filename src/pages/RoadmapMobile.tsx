import { FiArrowLeft, FiMessageSquare, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type Feedback from "../types/feedback";
import { useState } from "react";

interface RoadmapMobileProps {
  planned: Feedback[];
  inProgress: Feedback[];
  live: Feedback[];
}

const RoadmapMobile = ({ planned, inProgress, live }: RoadmapMobileProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"planned" | "inProgress" | "live">(
    "inProgress"
  );

  return (
    <div className="md:hidden bg-[#F7F8FD] min-h-screen">
      {/* Header */}
      <div className="bg-[#373F68] text-white p-4">
        <div className="flex justify-between items-center mb-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center font-bold text-sm bg-transparent"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/create-feedback")}
            className="bg-[#AD1FEA] hover:bg-[#C75AF6] text-white px-4 py-0 rounded-lg text-md h-10 mt-0 font-semibold"
          >
            + Add Feedback
          </button>
        </div>

        <h1 className="text-xl font-bold ml-4">Roadmap</h1>
      </div>

      {/* Pestañas */}
      <div>
        {[
          {
            id: "planned",
            label: "Planned",
            count: planned.length,
            color: "text-[#F49F85]",
          },
          {
            id: "inProgress",
            label: "In-Progress",
            count: inProgress.length,
            color: "text-[#AD1FEA]",
          },
          {
            id: "live",
            label: "Live",
            count: live.length,
            color: "text-[#62BCFA]",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`ml-3 flex-1 py-4 font-bold text-center relative bg-transparent focus:outline-none focus:ring-0 focus:border-none hover:ring-0 hover:outline-none hover:border-none ${
              activeTab === tab.id
                ? `text-[#3A4374] ${tab.color} after:content-[''] after:absolute after:bottom-3 after:left-1/4 after:w-1/2 after:h-1 after:bg-current after:rounded-full`
                : "text-[#3A4374]/40"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-[#3A4374] mb-1">
          {activeTab === "planned"
            ? "Planned"
            : activeTab === "inProgress"
            ? "In-Progress"
            : "Live"}{" "}
          (
          {activeTab === "planned"
            ? planned.length
            : activeTab === "inProgress"
            ? inProgress.length
            : live.length}
          )
        </h2>
        <p className="text-[#647196] mb-6">
          {activeTab === "planned"
            ? "Ideas prioritized for research"
            : activeTab === "inProgress"
            ? "Features currently being developed"
            : "Released features"}
        </p>

        {(activeTab === "planned"
          ? planned
          : activeTab === "inProgress"
          ? inProgress
          : live
        ).map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-6 mb-4 relative">
            <div
              className={`absolute top-0 left-0 w-full h-1 rounded-t-lg ${
                activeTab === "planned"
                  ? "bg-[#F49F85]"
                  : activeTab === "inProgress"
                  ? "bg-[#AD1FEA]"
                  : "bg-[#62BCFA]"
              }`}
            ></div>
            <div className="mt-2">
              <h3 className="font-bold text-[#3A4374]">{item.title}</h3>
              <p className="text-[#647196] my-2">{item.description}</p>
              <span className="inline-block bg-[#F2F4FF] text-[#4661E6] px-4 py-1 rounded-lg text-sm font-semibold mb-4">
                {item.category || "Feature"}
              </span>

              <div className="flex justify-between items-center">
                <button className="bg-[#F2F4FF] text-[#3A4374] font-bold px-4 py-2 rounded-lg flex items-center gap-1">
                  <FiChevronUp /> {item.upvotes}
                </button>
                <div className="flex items-center gap-1 text-[#3A4374] font-bold">
                  <FiMessageSquare /> {item.comments?.length || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapMobile;
