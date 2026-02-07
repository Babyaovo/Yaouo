import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HomePage, 
  SelectCharPage, 
  GeneratingPage, 
  ViewingPage,
  ArchiveListPage,
  ArchiveDetailPage 
} from './vestige/VestigePages';

interface VestigeProps {
  onClose: () => void;
  appState: any;
  onUpdate: (updates: any) => void;
}

export type Phase = 'I' | 'II' | 'III';
export type MediaType = 'torn_note' | 'inscribed_photo' | 'voice_memo' | 'journal_entry' | 'letter_to_user' | 'letter_to_other' | 'letter_received';

export interface Artifact {
  id: string;
  charId: string;
  charName: string;
  phase: Phase;
  mediaType: MediaType;
  content: any;
  createdAt: number;
}

export const mediaLabels: Record<MediaType, string> = {
  torn_note: '撕下的笔记',
  inscribed_photo: '附言的照片',
  voice_memo: '独白的录音',
  journal_entry: '日记本',
  letter_to_user: '写给你的信',
  letter_to_other: '写给他人的信',
  letter_received: '收到的信'
};

export function Vestige({ onClose, appState, onUpdate }: VestigeProps) {
  const [view, setView] = useState<'home' | 'select-char' | 'generating' | 'viewing' | 'archive-list' | 'archive-detail'>('home');
  const [selectedChar, setSelectedChar] = useState<any>(null);
  const [currentArtifact, setCurrentArtifact] = useState<Artifact | null>(null);
  const [archiveChar, setArchiveChar] = useState<any>(null);
  const [archiveView, setArchiveView] = useState<'timeline' | 'category'>('timeline');
  const [archiveFilter, setArchiveFilter] = useState<MediaType | null>(null);

  const contacts = appState.contacts || [];
  const artifacts: Artifact[] = appState.vestigeArtifacts || [];

  const generateArtifact = async () => {
    if (!selectedChar) return;
    setView('generating');

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));

    const phases: Phase[] = ['I', 'II', 'III'];
    const mediaTypes: MediaType[] = [
      'torn_note',
      'inscribed_photo',
      'voice_memo',
      'journal_entry',
      'letter_to_user',
      'letter_to_other',
      'letter_received'
    ];

    const phase = phases[Math.floor(Math.random() * phases.length)];
    const mediaType = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];

    // TODO: 替换为真实API调用
    // const response = await fetch('/api/generate-vestige', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     character: selectedChar,
    //     phase,
    //     mediaType
    //   })
    // });
    // const content = await response.json();

    const { generateContentBasedOnCharacter } = await import('./vestige/ContentGenerator');
    
    const artifact: Artifact = {
      id: Date.now().toString(),
      charId: selectedChar.id,
      charName: selectedChar.charName || selectedChar.name,
      phase,
      mediaType,
      content: generateContentBasedOnCharacter(mediaType, phase, selectedChar),
      createdAt: Date.now()
    };

    setCurrentArtifact(artifact);
    setView('viewing');
  };

  const saveArtifact = () => {
    if (!currentArtifact) return;
    const existing = artifacts.find(a => a.id === currentArtifact.id);
    if (existing) return;

    onUpdate({
      vestigeArtifacts: [...artifacts, currentArtifact]
    });
  };

  const deleteArtifact = (id: string) => {
    onUpdate({
      vestigeArtifacts: artifacts.filter(a => a.id !== id)
    });
  };

  const isSaved = currentArtifact && artifacts.some(a => a.id === currentArtifact.id);

  const contactsWithArtifacts = contacts
    .map((c: any) => ({
      contact: c,
      count: artifacts.filter(a => a.charId === c.id).length
    }))
    .filter(item => item.count > 0);

  const currentContactArtifacts = archiveChar
    ? artifacts.filter(a => a.charId === archiveChar.id)
    : [];

  let displayArtifacts = currentContactArtifacts;
  if (archiveView === 'category' && archiveFilter) {
    displayArtifacts = currentContactArtifacts.filter(a => a.mediaType === archiveFilter);
  }

  const sortedArtifacts = [...displayArtifacts].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <HomePage
              onClose={onClose}
              onGenerate={() => setView('select-char')}
              onArchive={() => setView('archive-list')}
              artifactCount={artifacts.length}
              appState={appState}
            />
          </motion.div>
        )}

        {view === 'select-char' && (
          <motion.div
            key="select-char"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <SelectCharPage
              contacts={contacts}
              onBack={() => setView('home')}
              onSelect={(char) => {
                setSelectedChar(char);
                generateArtifact();
              }}
              appState={appState}
            />
          </motion.div>
        )}

        {view === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <GeneratingPage charName={selectedChar?.charName || selectedChar?.name} />
          </motion.div>
        )}

        {view === 'viewing' && currentArtifact && (
          <motion.div
            key="viewing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ViewingPage
              artifact={currentArtifact}
              isSaved={isSaved}
              onSave={saveArtifact}
              onNext={generateArtifact}
              onBack={() => {
                setCurrentArtifact(null);
                setSelectedChar(null);
                setView('home');
              }}
            />
          </motion.div>
        )}

        {view === 'archive-list' && (
          <motion.div
            key="archive-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ArchiveListPage
              contactsWithArtifacts={contactsWithArtifacts}
              onBack={() => setView('home')}
              onSelectContact={(char) => {
                setArchiveChar(char);
                setArchiveView('timeline');
                setArchiveFilter(null);
                setView('archive-detail');
              }}
            />
          </motion.div>
        )}

        {view === 'archive-detail' && archiveChar && (
          <motion.div
            key="archive-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <ArchiveDetailPage
              char={archiveChar}
              artifacts={sortedArtifacts}
              archiveView={archiveView}
              archiveFilter={archiveFilter}
              mediaLabels={mediaLabels}
              onBack={() => {
                setArchiveChar(null);
                setArchiveView('timeline');
                setArchiveFilter(null);
                setView('archive-list');
              }}
              onViewModeChange={setArchiveView}
              onFilterChange={setArchiveFilter}
              onView={(artifact) => {
                setCurrentArtifact(artifact);
                setSelectedChar(archiveChar);
                setView('viewing');
              }}
              onDelete={deleteArtifact}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}