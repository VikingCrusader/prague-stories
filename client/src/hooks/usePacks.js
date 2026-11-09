import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { packAPI } from '../services/api';

// The card packs with this player's progress. `refresh`: fetch again when it
// changes (a page passing its count of collected cards). Empty until loaded,
// and on a failure the pack parts of a page just stay away.
export function usePacks(refresh = 0) {
  const { user } = useAuth();
  const userId = user?._id;
  const [packs, setPacks] = useState([]);
  useEffect(() => {
    let live = true;
    packAPI.getAll().then(res => { if (live) setPacks(res.data); }).catch(() => {});
    return () => { live = false; };
  }, [userId, refresh]);
  return packs;
}
