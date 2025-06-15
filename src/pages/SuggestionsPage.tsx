import { useEffect, useState } from "react";
import { rutes } from "../../config/rutes";
import FeedbackBoard from "../components/FeedBackBoard";
import SuggestionCard from "../components/SuggestionCard";
import Header from "../components/UI/header";
import ApiService from "../services/api";

import SpinnerTable from "../components/UI/SpinnerTable";
import EmptyFeedback from "../components/EmptyFeedback";
import MobileDrawer from "../components/MobileDrawer";

const SuggestionsPage = () => {
  const apiService = new ApiService();
  const [data, setData] = useState<any>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [sortOption, setSortOption] = useState("Most Upvotes");
  const [statusCounts, setStatusCounts] = useState({
    planned: 0,
    inProgress: 0,
    live: 0,
  });

  useEffect(() => {
    fetchData(selectedTag);
  }, [selectedTag]);

  useEffect(() => {
    applySorting();
  }, [data, sortOption]);

  const applySorting = () => {
    let sortedData = [...data];

    switch (sortOption) {
      case "Most Upvotes":
        sortedData.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "Least Upvotes":
        sortedData.sort((a, b) => a.upvotes - b.upvotes);
        break;
      case "Most Comments":
        sortedData.sort(
          (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
        );
        break;
      case "Least Comments":
        sortedData.sort(
          (a, b) => (a.comments?.length || 0) - (b.comments?.length || 0)
        );
        break;
      default:
        break;
    }

    setFilteredData(sortedData);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const fetchData = (tag: string) => {
    setLoading(true);
    const query = tag === "All" ? "" : `?category=${tag.toLowerCase()}`;
    apiService
      .get(`${rutes.data.feedback}${query}`)
      .then((res) => {
        setData(res);

        calculateStatusCounts(res);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateStatusCounts = (feedbacks: any[]) => {
    const counts = {
      planned: feedbacks.filter((f) => f.status === "planned").length,
      inProgress: feedbacks.filter((f) => f.status === "in-progress").length,
      live: feedbacks.filter((f) => f.status === "live").length,
    };
    setStatusCounts(counts);
  };
  return (
    <div className="w-screen min-h-screen bg-[#F7F8FD]">
      <div className="flex flex-col lg:flex-row w-full px-0 md:px-0 lg:px-0">
        <div className="hidden md:block lg:hidden mb-6">
          <FeedbackBoard
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            statusCounts={statusCounts}
          />
        </div>

        <div className="hidden lg:block lg:w-1/4 lg:pr-8">
          <FeedbackBoard
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            statusCounts={statusCounts}
          />
        </div>

        <div
          style={{
            background:
              "linear-gradient(210deg,rgba(232, 77, 112, 1) 0%, rgba(163, 55, 246, 1) 53%, rgba(40, 167, 237, 1) 100%)",
          }}
          className=" w-full flex row justify-between h-20 md:hidden lg:hidden pl-5 pt-4"
        >
          <div>
            <h1 className="text-xl font-bold text-white">Frontend Mentor</h1>
            <h2 className="text-md font-normal text-white">Feedback Board</h2>
          </div>
          <MobileDrawer
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            statusCounts={statusCounts}
          />
        </div>

        <div className="w-full  lg:w-3/4">
          <Header
            size={data.length}
            onSortChange={handleSortChange}
            currentSort={sortOption}
          />

          <div className="space-y-4 mt-5">
            {loading ? (
              <SpinnerTable />
            ) : filteredData.length > 0 ? (
              filteredData.map((feedback: any) => (
                <SuggestionCard
                  key={feedback.id}
                  id={feedback.id}
                  title={feedback.title}
                  description={feedback.description}
                  category={feedback.category}
                  upvotes={feedback.upvotes}
                  comments={feedback.comments?.length || 0}
                />
              ))
            ) : (
              <EmptyFeedback />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SuggestionsPage;
