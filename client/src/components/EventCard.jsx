import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { removeEvent } from "../redux/eventsSlice";
import { clearEventFeedback } from "../redux/feedbackSlice";
import FeedbackForm from "./FeedbackForm";
import FeedbackList from "./FeedbackList";

const eventImages = {
  training: [
    "photo-1552674605-db6ffd4facb5",
    "photo-1476480862126-209bfaa8edc8",
  ],
  marathon: [
    "photo-1461896836934-ffe607ba8211",
    "photo-1530137073520-4f4f3f5b5f",
  ],
  trail: [
    "photo-1473448912268-2022ce9509d8",
    "photo-1502904550040-7534597429ae",
  ],
  "10K": [
    "photo-1461896836934-ffe607ba8211",
    "photo-1552674605-db6ffd4facb5",
  ],
};

// Pick a consistent image for the event type and title.
function getEventImage(event) {
  const images = eventImages[event.type] || eventImages.training;
  const titleValue = Array.from(event.title || "").reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const imageId = images[titleValue % images.length];

  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=80`;
}

export default function EventCard({ event }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState("");
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const feedbackItems = useSelector((state) => state.feedback.items);

  const eventId = String(event._id);
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  const authorId = event.author?._id || event.author;
  const isOwner = user && String(authorId) === String(user.id);
  const formattedDate = Number.isNaN(eventDate.getTime())
    ? "Date to be announced"
    : eventDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  const eventFeedback = feedbackItems.filter(
    (feedback) => String(feedback.event?._id || feedback.event) === eventId,
  );
  const averageRating =
    eventFeedback.length === 0
      ? null
      : (
          eventFeedback.reduce((total, feedback) => total + feedback.rating, 0) /
          eventFeedback.length
        ).toFixed(1);

  // Ask the API to check ownership, then remove the event and its feedback locally.
  async function handleDelete() {
    setError("");

    try {
      await axiosClient.delete(`/events/${eventId}`);
      dispatch(removeEvent(eventId));
      dispatch(clearEventFeedback(eventId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete the event.");
    }
  }

  return (
    <article className="event-card">
      <div className={`event-card-image ${imageUnavailable ? "image-unavailable" : ""}`}>
        {!imageUnavailable && (
          <img
            src={event.imageUrl || getEventImage(event)}
            alt={`${event.type} running event`}
            loading="lazy"
            onError={() => setImageUnavailable(true)}
          />
        )}
        <span className={`event-status ${isUpcoming ? "upcoming" : "past"}`}>
          {isUpcoming ? "Upcoming" : "Past"}
        </span>
        <span className="event-type">{event.type}</span>
      </div>

      <div className="event-card-content">
        <div className="event-card-heading">
          <h2>{event.title}</h2>
          <span className="event-distance">{event.distanceKm} km</span>
        </div>

        <p className="event-meta">
          <span aria-hidden="true">⌖</span> {event.location}
        </p>
        <p className="event-meta">
          <span aria-hidden="true">◷</span> {formattedDate}
        </p>
        {event.description && <p className="event-description">{event.description}</p>}

        <div className="event-card-footer">
          <span className="event-organizer">
            With {event.author?.name || "your running club"}
          </span>
          <span className="event-rating">
            <span aria-hidden="true">★</span>{" "}
            {averageRating ? averageRating : "New"}
          </span>
        </div>

        {error && <p role="alert">{error}</p>}

        <div className="event-actions">
          <button
            className="button-secondary"
            type="button"
            aria-expanded={showFeedback}
            onClick={() => setShowFeedback(!showFeedback)}
          >
            {showFeedback ? "Hide reviews" : "Member reviews"}
          </button>

          {isOwner && (
            <button className="button-danger" type="button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>

        {showFeedback && user && <FeedbackForm eventId={eventId} />}
        <div hidden={!showFeedback}>
          <FeedbackList eventId={eventId} />
        </div>
      </div>
    </article>
  );
}
