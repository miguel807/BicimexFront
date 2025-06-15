import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

interface MobileDrawerProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  statusCounts: {
    planned: number;
    inProgress: number;
    live: number;
  };
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  selectedTag,
  onSelectTag,
  statusCounts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const tags = ["All", "UI", "UX", "Enhancement", "Bug", "Feature"];

  return (
    <div className="md:hidden lg:hidden">
      <div className="w-full h-20 flex items-center justify-center">
        <div className="pr-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 text-2xl bg-transparent focus:outline-none focus:ring-0"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 mt-20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
      mt-20
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="space-y-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onSelectTag(tag);
                      setIsOpen(false);
                    }}
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-[#3A4374]">Roadmap</h2>
                <button
                  onClick={() => {
                    navigate("/roadmap");
                    setIsOpen(false);
                  }}
                  className="text-[#4661E6] text-sm bg-white font-medium hover:underline"
                >
                  View
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Planned",
                    count: statusCounts.planned,
                    color: "bg-[#F49F85]",
                  },
                  {
                    label: "In-Progress",
                    count: statusCounts.inProgress,
                    color: "bg-[#AD1FEA]",
                  },
                  {
                    label: "Live",
                    count: statusCounts.live,
                    color: "bg-[#62BCFA]",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${item.color} mr-4`}
                      />
                      <span className="text-[#647196]">{item.label}</span>
                    </div>
                    <span className="font-bold text-[#647196]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
