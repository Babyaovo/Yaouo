import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactsPage } from '../pages/ContactsPage';
import { ContactDetailPage } from '../pages/ContactDetailPage';
import { EditContactPage } from '../pages/EditContactPage';

interface ContactsAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export function ContactsApp({ appState, onUpdate, onClose, onNavigate }: ContactsAppProps) {
  const [subPage, setSubPage] = useState<'list' | 'detail' | 'edit'>('list');
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);

  const openDetail = (contactId: string) => {
    setCurrentContactId(contactId);
    setSubPage('detail');
  };

  const openEdit = (contactId?: string) => {
    setCurrentContactId(contactId || null);
    setSubPage('edit');
  };

  const backToList = () => {
    setSubPage('list');
    setCurrentContactId(null);
  };
  
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    onClose(); // 关闭联系人app
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {subPage === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ContactsPage
              appState={appState}
              onUpdate={onUpdate}
              onClose={onClose}
              onOpenDetail={openDetail}
              onOpenEdit={openEdit}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {subPage === 'detail' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ContactDetailPage
              appState={{ ...appState, currentContactId }}
              onUpdate={onUpdate}
              onClose={backToList}
              onEdit={() => openEdit(currentContactId || undefined)}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {subPage === 'edit' && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <EditContactPage
              appState={{ ...appState, currentContactId }}
              onUpdate={onUpdate}
              onClose={backToList}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}