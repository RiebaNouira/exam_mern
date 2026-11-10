import { useState } from "react";
import { useDispatch } from "react-redux";
import axiosClient from "../api/axiosClient";
import { addEvent } from "../redux/eventsSlice";

const initialForm = {
  title: "",
  type: "training",
  date: "",
  location: "",
  distanceKm: "",
  description: "",
};

export default function EventForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  // Keep each input in sync with React state as the member types.
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // Send the event to the API, then add its response to the Redux list.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await axiosClient.post("/events", {
        ...form,
        date: new Date(form.date).toISOString(),
        distanceKm: Number(form.distanceKm),
      });
      dispatch(addEvent(response.data));
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not create the event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Add an event</h2>
      {error && <p role="alert">{error}</p>}

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <label>
        Type
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="training">Training</option>
          <option value="marathon">Marathon</option>
          <option value="trail">Trail</option>
          <option value="10K">10K</option>
        </select>
      </label>

      <label>
        Date and time
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Location
        <input name="location" value={form.location} onChange={handleChange} required />
      </label>

      <label>
        Distance (km)
        <input
          name="distanceKm"
          type="number"
          min="0"
          step="0.1"
          value={form.distanceKm}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add event"}
      </button>
    </form>
  );
}
