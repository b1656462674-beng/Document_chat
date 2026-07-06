/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MainFrame } from './components/MainFrame';
import { Contact, FavoriteItem, NotepadNote, AdminConfig } from './types';
import { INITIAL_CONTACTS, INITIAL_FAVORITES, INITIAL_NOTEPAD, DEFAULT_ADMIN_CONFIG } from './mockData';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(INITIAL_FAVORITES);
  const [notes, setNotes] = useState<NotepadNote[]>(INITIAL_NOTEPAD);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);

  return (
    <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center p-2 lg:p-6 text-slate-100">
      <MainFrame
        contacts={contacts}
        favorites={favorites}
        notes={notes}
        adminConfig={adminConfig}
        onUpdateContacts={setContacts}
        onUpdateFavorites={setFavorites}
        onUpdateNotes={setNotes}
        onUpdateAdminConfig={setAdminConfig}
      />
    </div>
  );
}
