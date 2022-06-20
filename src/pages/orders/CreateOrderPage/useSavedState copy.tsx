import { useState } from "react";

export type SaveStatus = 
    'unsaved'  // New state (Not saved before)
  | 'draft'    // Saved before, but with changes
  | 'saved';   // All changes saved

export type useSaveStatusConfig = {
  initialStatus?: SaveStatus,
}

const defaultConfig: useSaveStatusConfig = {
  initialStatus: 'unsaved',
}

export const useSaveStatus = (config: useSaveStatusConfig = defaultConfig) => {
  const [status, setStatus] = useState(config.initialStatus);
  const onSave = () => setStatus('saved');
  const onDraft = () => setStatus('draft');

  return {
    status,
    onSave,
    onDraft
  };
}