import { useState, useEffect } from "react";
import { rutes } from "../../config/rutes";
import ApiService from "../services/api";
import type Feedback from "../types/feedback";
import { useNavigate } from "react-router-dom";
import RoadmapMobile from "./RoadmapMobile";

const RoadmapPage = () => {
  const [roadmapData, setRoadmapData] = useState({
    planned: [] as Feedback[],
    inProgress: [] as Feedback[],
    live: [] as Feedback[],
    learningPaths: [] as Feedback[],
    bookmarkChallenges: [] as Feedback[]
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        const response = await new ApiService().get(rutes.data.feedback);
        setRoadmapData({
          
          planned: response.filter((item: Feedback) => item.status === 'planned')
          //@ts-ignore
                           .sort((a, b) => b.upvotes - a.upvotes),
          inProgress: response.filter((item: Feedback) => item.status === 'in-progress')
          //@ts-ignore
                             .sort((a, b) => b.upvotes - a.upvotes),
          live: response.filter((item: Feedback) => item.status === 'live')
          //@ts-ignore
                       .sort((a, b) => b.upvotes - a.upvotes),
          learningPaths: response.filter((item: Feedback) => item.category === 'learning-paths')
          //@ts-ignore
                              .sort((a, b) => b.upvotes - a.upvotes),
          bookmarkChallenges: response.filter((item: Feedback) => item.title.includes('Bookmark challenges'))
          //@ts-ignore
                                  .sort((a, b) => b.upvotes - a.upvotes)
        });
      } catch (error) {
        console.error('Error fetching roadmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, []);

  if (loading) {
    return (
 
       <div className="w-screen min-h-screen bg-[#F7F8FD]"></div>
   
    );
  }

  return (
    <> {/* Versión Mobile */}
    <div className="md:hidden">
      <RoadmapMobile 
        planned={roadmapData.planned}
        inProgress={roadmapData.inProgress}
        live={roadmapData.live}
      />
    </div>
    <div className="hidden md:block w-screen min-h-screen bg-[#F7F8FD]">
      <div className="h-20 p-4 flex justify-between items-center bg-[#373F68] rounded-md">
        <div className="ml-10 mb-3 mt-3">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center text-white font-bold text-sm bg-transparent"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
        <h3 className="font-bold text-xl ml-5 pb-2">Roadmap</h3>
        </div>
        <button
          onClick={() => navigate('/create-feedback')}
          className="bg-[#AD1FEA]  mr-8 hover:bg-[#C75AF6] text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + Add Feedback
        </button>
      </div>
    <div className="max-w-6xl mx-auto px-4 py-8">
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Section
          title="Planned"
          count={roadmapData.planned.length}
          subtitle="Ideas prioritized for research"
          items={roadmapData.planned}
          borderColor="border-t-[#F49F85]"
        />
        <Section
          title="In Progress"
          count={roadmapData.inProgress.length}
          subtitle="Currently being developed"
          items={roadmapData.inProgress}
          borderColor="border-t-[#AD1FEA]"
        />
        <Section
          title="Live"
          count={roadmapData.live.length}
          subtitle="Released features"
          items={roadmapData.live}
          borderColor="border-t-[#62BCFA]"
        />
      </div>
    </div>
    </div>
    </>
  );
};

// Sección por columna
const Section = ({
  title,
  count,
  subtitle,
  items,
  borderColor
}: {
  title: string;
  count: number;
  subtitle: string;
  items: Feedback[];
  borderColor: string;
}) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">
      {title} <span className="text-gray-500">({count})</span>
    </h2>
    <p className="text-gray-500 text-sm mb-6">{subtitle}</p>

    {items.map((item) => (
      <div key={item.id} className={`mb-6 bg-white p-5 rounded-lg shadow-sm border-t-4 ${borderColor}`}>
        <RoadmapItem item={item} />
      </div>
    ))}
  </div>
);

// Componente para cada ítem del roadmap
const RoadmapItem = ({ item }: { item: Feedback }) => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer"
    
    >
      <div   onClick={() => navigate(`/feedback/${item.id}`)}>
      <div className="mb-2 flex items-center space-x-2">
        <span className={`w-2 h-2 rounded-full ${
          item.status === 'planned' ? 'bg-[#F49F85]' :
          item.status === 'in-progress' ? 'bg-[#AD1FEA]' :
          'bg-[#62BCFA]'
        }`}></span>
        <span className="capitalize text-sm text-gray-600 font-medium">{item.status}</span>
      </div>
      <h3 className="text-base font-bold text-[#3A4374] hover:text-[#4661E6] mb-2">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{item.description}</p>
      <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded mb-4">
        {item.category || "Feature"}
      </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center bg-[#F2F4FE] px-3 py-1 rounded-lg text-sm font-semibold text-[#3A4374] hover:bg-[#CFD7FF] rounded-lg">
          <svg className="w-3 h-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {item.upvotes}
        </div>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          {/* @ts-ignore */}
          {item.comments?.length | 0}
          
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
