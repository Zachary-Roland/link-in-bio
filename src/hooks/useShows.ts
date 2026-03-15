import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, firebaseConfigured } from "../lib/firebase";

export interface Show {
  id: string;
  date: Timestamp;
  venue: string;
  city: string;
  ticketUrl?: string;
  createdAt: Timestamp;
}

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "shows"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Show[];
      setShows(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const upcomingShows = shows.filter(
    (show) => show.date.toDate() >= new Date()
  );

  return { shows, upcomingShows, loading };
}
