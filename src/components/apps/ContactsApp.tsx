import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactsPage } from '../pages/ContactsPage';
import { ContactDetailPage } from '../pages/ContactDetailPage';
import { EditContactPage } from '../pages/EditContactPage';

interface ContactsAppProps {
  appState: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onStartChat?: (contactId: string) => void;
  onViewContact?: (contactId: string) => void;
}

export function ContactsApp({ appState, onUpdate, onClose, onStartChat, onViewContact }: ContactsAppProps) {
  const [subPage, setSubPage] = useState<'list' | 'detail' | 'edit'>('list');
  const [currentContactId, setCurrentContactId] = useState<string | null>(null);

  // 监听从外部传入的currentContactId，自动打开详情页
  useEffect(() => {
    if (appState.currentContactId) {
      setCurrentContactId(appState.currentContactId);
      setSubPage('detail');
    }
  }, [appState.currentContactId]);

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

  const handleStartChat = (contactId: string) => {
    if (onStartChat) {
      onStartChat(contactId);
    }
  };

  const handleViewContact = (contactId: string) => {
    if (onViewContact) {
      onViewContact(contactId);
    }
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
              onClose={backToList}
              onEdit={() => openEdit(currentContactId || undefined)}
              onStartChat={handleStartChat}
              onViewContact={handleViewContact}
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