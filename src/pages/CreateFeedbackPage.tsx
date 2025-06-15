import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import { rutes } from "../../config/rutes";
import { toast } from "react-toastify/unstyled";
import { useToast } from "../libs/toastProvider";

const categories = ["Feature", "UI", "UX", "Enhancement", "Bug"];

const CreateFeedbackPage = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Feature");
  const [detail, setDetail] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    detail: "",
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const apiService = new ApiService();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // Limpiar error al escribir
    if (errors.title) setErrors({ ...errors, title: "" });
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetail(e.target.value);
    // Limpiar error al escribir
    if (errors.detail) setErrors({ ...errors, detail: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", detail: "" };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    } else if (title.trim().length < 10) {
      newErrors.title = "Title should be at least 10 characters";
      valid = false;
    }

    if (!detail.trim()) {
      newErrors.detail = "Detail is required";
      valid = false;
    } else if (detail.trim().length < 20) {
      newErrors.detail = "Detail should be at least 20 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const feedbackData = {
        title,
        description: detail,
        category: category.toLowerCase(),
        status: "suggestion", 
      };
      apiService
        .post(rutes.data.feedback, feedbackData) 
        .then(() => {
          showToast("success", "Feedback Created Successfully");
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
        })
        .finally(() => {});
      console.log({ title, category, detail });
      setTitle("");
      setDetail("");
      setCategory("Feature");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#F7F8FD]">
      <div className="max-w-2xl mx-auto pt-4 rounded-lg">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center bg-transparent text-[#647196] font-bold hover:text-[#3A4374] transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 "
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
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mt-10 relative">
          <div
            style={{
              background:
                "linear-gradient(210deg,rgba(232, 77, 112, 1) 0%, rgba(163, 55, 246, 1) 53%, rgba(40, 167, 237, 1) 100%)",
            }}
            className="absolute -top-5 left-6 bg-gradient-to-r from-[#ED5174] to-[#AD1FEA] text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            <span className="text-2xl">+</span>
          </div>

          <h1 className="text-2xl font-bold text-[#3A4374] mb-6 mt-2">
            Create New Feedback
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Sección de Título */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-[#3A4374] font-bold mb-2"
              >
                Feedback Title
                <span className="text-[#647196] font-normal block text-sm mt-1">
                  Add a short, descriptive headline
                </span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className={`w-full p-3 border rounded-md bg-white text-[#3A4374] ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Sección de Categoría (Select personalizado) */}
            <div className="mb-6">
              <label className="block text-[#3A4374] font-bold mb-2">
                Category
                <span className="text-[#647196] font-normal block text-sm mt-1">
                  Choose a category for your feedback
                </span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full p-3 border border-gray-300 bg-white rounded-md text-left flex justify-between items-center"
                >
                  <span className="text-[#3A4374]">{category}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isCategoryOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 font-normal bg-white hover:bg-gray-100 ${
                          category === cat
                            ? "text-[#AD1FEA] font-medium"
                            : "text-[#647196]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Detalle */}
            <div className="mb-6">
              <label
                htmlFor="detail"
                className="block text-[#3A4374] font-bold mb-2"
              >
                Feedback Detail
                <span className="text-[#647196] font-normal block text-sm mt-1">
                  Include any specific comments on what should be improved,
                  added, etc.
                </span>
              </label>
              <textarea
                id="detail"
                value={detail}
                onChange={handleDetailChange}
                rows={4}
                className={`w-full p-3 border rounded-md bg-white text-[#3A4374] ${
                  errors.detail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.detail && (
                <p className="text-red-500 text-sm mt-1">{errors.detail}</p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#AD1FEA] hover:bg-[#C75AF6] text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Add Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedbackPage;
