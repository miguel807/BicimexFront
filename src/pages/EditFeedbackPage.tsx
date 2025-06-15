import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ApiService from "../services/api";
import { rutes } from "../../config/rutes";
import { useToast } from "../libs/toastProvider";


const EditFeedbackPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useToast();
  const location = useLocation(); 
  const apiService = new ApiService();
  const feedback = location?.state?.feedback;
 
  const [isLoading,setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: feedback?.title || "",
    category: feedback?.category || "feature",
    status: feedback?.status || "suggestion",
    description: feedback?.description || "",
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const categories = ["feature", "ui", "ux", "enhancement", "bug"];
  const statusOptions = ["suggestion", "planned", "in-progress", "live"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault();
    if (!feedback) return;
    
    const updatedFeedback = {
      ...feedback,
      ...formData,
      upvotes: feedback.upvotes || 0,
    };
    apiService
    .patch(`${rutes.data.feedback}${id}/`, updatedFeedback) 
    .then(() => {
      showToast("success", "Feedback Updated Successfully");
    })
    .catch((error) => {
      console.error("Error submitting feedback:", error);
    })
    .finally(() => {setIsLoading(false)});
  
  };

  const handleDelete = async () => {
    if (!feedback) return;
    
    setIsLoading(true);
    try {
      apiService
    .delete(`${rutes.data.feedback}${id}/`) 
      showToast("success", "Feedback deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      showToast("error", "Failed to delete feedback");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-screen min-h-screen bg-[#F7F8FD]">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-transparent text-[#647196] font-bold hover:text-[#3A4374]"
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
        </div>

        {/* Contenedor principal */}
        <div className="bg-white rounded-lg shadow-md p-8 relative">
          {/* Icono de edición */}
          <div className="absolute -top-5 left-6 bg-gradient-to-r from-[#ED5174] to-[#AD1FEA] text-white rounded-full w-10 h-10 flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#3A4374] mb-6">
            Editing '{feedback.title}'
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
                name="title"
                disabled={isLoading}
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-[#3A4374] focus:border-[#4661E6] focus:ring-1 focus:ring-[#4661E6]"
                required
              />
            </div>

            {/* Sección de Categoría */}
            <div className="mb-6">
              <label className="block text-[#3A4374] font-bold mb-2">
                Category
                <span className="text-[#647196] font-normal block text-sm mt-1">
                  Choose a category for your feedback
                </span>
              </label>
              <div className="relative">
                <button
                 disabled={isLoading}
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full p-3 border border-gray-300 bg-white rounded-md text-left flex justify-between items-center"
                >
                  <span className="capitalize text-[#3A4374]">
                    {formData.category}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#4661E6] transition-transform ${
                      isCategoryOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                      disabled={isLoading}
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category: cat });
                          setIsCategoryOpen(false);
                        }}
                        className={` bg-white flex justify-between items-center w-full text-left px-4 py-3 capitalize ${
                          formData.category === cat
                            ? "text-[#AD1FEA] font-medium"
                            : "text-[#647196]"
                        } hover:bg-[#F2F4FF]`}
                      >
                        <span>{cat}</span>
                        {formData.category === cat && (
                          <svg
                            className="w-5 h-5 text-[#AD1FEA]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Estado */}
            <div className="mb-6">
              <label className="block text-[#3A4374] font-bold mb-2">
                Update Status
                <span className="text-[#647196] font-normal block text-sm mt-1">
                  Change feedback state
                </span>
              </label>
              <div className="relative">
                <button
                 disabled={isLoading}
                  type="button"
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="w-full p-3 border border-gray-300 bg-white rounded-md text-left flex justify-between items-center"
                >
                  <span className="capitalize text-[#3A4374]">
                    {formData.status === "in-progress"
                      ? "In Progress"
                      : formData.status}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#4661E6] transition-transform ${
                      isStatusOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isStatusOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, status });
                          setIsStatusOpen(false);
                        }}
                        className={` bg-white flex justify-between items-center w-full text-left px-4 py-3 capitalize ${
                          formData.status === status
                            ? "text-[#AD1FEA] font-medium"
                            : "text-[#647196]"
                        } hover:bg-[#F2F4FF]`}
                      >
                        <span>
                          {status === "in-progress" ? "In Progress" : status}
                        </span>
                        {formData.status === status && (
                          <svg
                            className="w-5 h-5 text-[#AD1FEA]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Detalle */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-[#3A4374] font-bold mb-2"
              >
                Feedback Detail
                <span className="text-[#647196] font-normal block text-sm mt-1">
                  Include any specific comments on what should be improved,
                  added, etc.
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                disabled={isLoading}
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-[#3A4374] focus:border-[#4661E6] focus:ring-1 focus:ring-[#4661E6]"
                required
              />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-3">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading }
                    className="bg-[#D73737] hover:bg-[#E98888] text-white font-bold py-2 px-4 rounded-md flex items-center justify-center min-w-[100px]"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : 'Delete'}
                  </button>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled = {isLoading}
                  className="bg-[#3A4374] hover:bg-[#656EA3] text-white font-bold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#AD1FEA] hover:bg-[#C75AF6] text-white font-bold py-2 px-4 rounded-md flex items-center justify-center min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFeedbackPage;
