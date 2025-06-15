import { useNavigate } from "react-router-dom";
import NotFoundSvg from "../svg/notFound";

const EmptyFeedback = () => {
  const navigate = useNavigate();
    return (
      <div className=" rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        <NotFoundSvg/>
        </div>
        <h3 className="text-xl font-bold text-[#3A4374] mb-3">
          There is no feedback yet.
        </h3>
        <p className="text-[#647196] mb-6 max-w-md mx-auto">
          Got a suggestion? Found a bug that needs to be squashed?<br />
          We love hearing about new ideas to improve our app.
        </p>
        <button onClick={()=>navigate('/create-feedback')} className="bg-[#AD1FEA] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#C75AF6]">
          + Add Feedback
        </button>
      </div>
    );
  };

  export default EmptyFeedback;