import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  getItinerary,
  createItineraryItem,
  deleteItineraryItem,
  reorderItinerary,
} from '../../api/trips.api.js';
import toast from 'react-hot-toast';

const ITEM_TYPES = ['activity', 'meal', 'transport', 'accommodation', 'other'];
const TYPE_ICONS = { activity: '🎯', meal: '🍽️', transport: '🚗', accommodation: '🏨', other: '📌' };

const SortableItem = ({ item, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item._id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="itinerary-item"
    >
      <span className="drag-handle" {...attributes} {...listeners}>⠿</span>
      <span className="item-time">{item.time || '--:--'}</span>
      <span className="item-type-icon">{TYPE_ICONS[item.type] || '📌'}</span>
      <div className="item-details">
        <strong>{item.title}</strong>
        {item.location && <span className="text-muted"> • 📍 {item.location}</span>}
        {item.description && <p className="item-desc text-muted">{item.description}</p>}
      </div>
      <button className="btn btn-danger btn-xs" onClick={() => onDelete(item._id)}>✕</button>
    </div>
  );
};

const ItineraryTab = ({ tripId, trip }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', time: '', location: '', description: '', type: 'activity' });
  const [submitting, setSubmitting] = useState(false);

  const totalDays = trip?.startDate && trip?.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : 7;

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchItems = async () => {
    try {
      const { data } = await getItinerary(tripId);
      setItems(data.items);
    } catch { toast.error('Failed to load itinerary'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, [tripId]);

  const dayItems = items.filter((i) => i.day === selectedDay).sort((a, b) => a.order - b.order);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = dayItems.findIndex((i) => i._id === active.id);
    const newIdx = dayItems.findIndex((i) => i._id === over.id);
    const reordered = arrayMove(dayItems, oldIdx, newIdx).map((item, idx) => ({ ...item, order: idx }));
    setItems((prev) => [...prev.filter((i) => i.day !== selectedDay), ...reordered]);
    try {
      await reorderItinerary(tripId, reordered.map(({ _id, order }) => ({ _id, order })));
    } catch { toast.error('Reorder failed'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createItineraryItem(tripId, { ...form, day: selectedDay, order: dayItems.length });
      toast.success('Added!');
      setShowForm(false);
      setForm({ title: '', time: '', location: '', description: '', type: 'activity' });
      fetchItems();
    } catch { toast.error('Failed to add item'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteItineraryItem(tripId, itemId);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <motion.div className="tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="tab-header">
        <h2>Itinerary</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)} id="add-itinerary-btn">
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Day tabs */}
      <div className="day-tabs">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
          <button
            key={d}
            className={`day-tab ${selectedDay === d ? 'active' : ''}`}
            onClick={() => setSelectedDay(d)}
          >
            Day {d}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            className="card itinerary-form"
            onSubmit={handleCreate}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="form-row">
              <input id="itin-title" type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <input id="itin-time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="form-row">
              <input id="itin-location" type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <select id="itin-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {ITEM_TYPES.map((t) => <option key={t} value={t}>{TYPE_ICONS[t]} {t}</option>)}
              </select>
            </div>
            <input id="itin-desc" type="text" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : `Add to Day ${selectedDay}`}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {dayItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🗓</span>
          <p>No activities for Day {selectedDay} yet. Add something!</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dayItems.map((i) => i._id)} strategy={verticalListSortingStrategy}>
            <div className="itinerary-list">
              {dayItems.map((item) => (
                <SortableItem key={item._id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </motion.div>
  );
};

export default ItineraryTab;
