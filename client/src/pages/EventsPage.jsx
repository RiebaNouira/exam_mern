import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../api/axiosClient";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";
import { useAuth } from "../context/AuthContext";
import {
  setEvents,
  setEventsError,
  setEventsLoading,
} from "../redux/eventsSlice";

export default function EventsPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: events, loading, error } = useSelector((state) => state.events);
  const [selectedType, setSelectedType] = useState("all");

  // Fetch public events when the page loads.
  useEffect(() => {
    let isCurrent = true;

    async function loadEvents() {
      dispatch(setEventsError(null));
      dispatch(setEventsLoading(true));

      try {
        const response = await axiosClient.get("/events");
        if (isCurrent) {
          dispatch(setEvents(response.data));
        }
      } catch (requestError) {
        if (isCurrent) {
          dispatch(
            setEventsError(
              requestError.response?.data?.message || "Could not load events.",
            ),
          );
        }
      }
    }

    loadEvents();

    return () => {
      isCurrent = false;
    };
  }, [dispatch]);

  // Apply the selected event type without changing the saved Redux list.
  const filteredEvents =
    selectedType === "all"
      ? events
      : events.filter((event) => event.type === selectedType);

  return (
    <main className="page-container">
      <header className="page-heading">
        <div className="page-heading-copy">
          <p className="eyebrow">Good miles. Great people.</p>
          <h1>Your next finish line starts here.</h1>
          <p>Find a run, meet your people, and make every mile count.</p>
          <a className="hero-link" href="#club-events">
            Explore club events <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-note">
          <span className="hero-note-icon" aria-hidden="true">✦</span>
          <span>Every pace belongs.</span>
        </div>
      </header>

      {user && <EventForm />}

      <section className="events-section" id="club-events">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Make a plan</p>
            <h2>Runs worth getting up for</h2>
            <p>Pick your next adventure from {events.length} club events.</p>
          </div>

          <label>
            Filter by type
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="all">All types</option>
              <option value="training">Training</option>
              <option value="marathon">Marathon</option>
              <option value="trail">Trail</option>
              <option value="10K">10K</option>
            </select>
          </label>
        </div>

        {loading && <p>Loading events...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="empty-events">
            <span aria-hidden="true">🏃</span>
            <h3>No runs on this route yet</h3>
            <p>Try another event type, or check back soon for new club plans.</p>
          </div>
        )}

        <div className="event-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
