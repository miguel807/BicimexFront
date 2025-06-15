import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "../components/UI/Spinner";

const SuggestionsPage = lazy(() => import("../pages/SuggestionsPage"));
const FeedbackDetailPage = lazy(() => import("../pages/FeedbackDetailPage"));
const CreateFeedbackPage = lazy(() => import("../pages/CreateFeedbackPage"));
const EditFeedbackPage = lazy(() => import("../pages/EditFeedbackPage"));
const RoadmapPage = lazy(() => import("../pages/RoadmapPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<SuggestionsPage />} />
          <Route path="/feedback/:id" element={<FeedbackDetailPage />} />
          <Route path="/create-feedback" element={<CreateFeedbackPage />} />
          <Route path="/feedback/:id/edit" element={<EditFeedbackPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
