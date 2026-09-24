/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile, ActiveScreen, WorldRegion } from './types/game';
import { storage, DEFAULT_PROFILE } from './services/storage';
import { sound } from './services/audio';
import { WORLDS } from './services/curriculum';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CinematicIntro } from './components/CinematicIntro';
import { WorldMap } from './components/WorldMap';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import { DataQuestEngine } from './components/quest/DataQuestEngine';
import { MathQuestRunner } from './components/quest/MathQuestRunner';
import { PlayerHome } from './components/PlayerHome';
import { PetRoom } from './components/PetRoom';
import { ParentDashboard } from './components/ParentDashboard';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => storage.loadProfile());
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('map');
  const [activeWorld, setActiveWorld] = useState<WorldRegion | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);

  // Play timer tracker
  useEffect(() => {
    const timer = setInterval(() => {
      storage.incrementPlayTime(1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if first-time player
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('mathia_intro_seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('mathia_intro_seen', 'true');
    setShowIntro(false);
    sound.startPlayfulBgm();
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectWorld = (world: WorldRegion) => {
    setActiveWorld(world);
    setCurrentScreen('quest');
  };

  const handleReturnToMap = () => {
    setActiveWorld(null);
    setCurrentScreen('map');
  };

  const handleResetProgress = () => {
    const fresh = { ...DEFAULT_PROFILE, id: 'hero_' + Date.now() };
    setProfile(fresh);
    storage.saveProfile(fresh);
    setCurrentScreen('map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100 flex flex-col justify-between select-none">
      {/* Cinematic Opening Modal */}
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      {/* Hero Avatar Customizer Modal */}
      {showAvatarCustomizer && (
        <AvatarCustomizer
          currentAvatar={profile.avatar}
          currentName={profile.name}
          onSave={(avatar, name) => {
            const updated = { ...profile, avatar, name };
            setProfile(updated);
            storage.saveProfile(updated);
            setShowAvatarCustomizer(false);
          }}
          onClose={() => setShowAvatarCustomizer(false)}
        />
      )}

      {/* Parent Dashboard Overlay */}
      {showParentDashboard && (
        <ParentDashboard
          profile={profile}
          onClose={() => setShowParentDashboard(false)}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* Sticky Top Status Bar */}
      <Navbar
        profile={profile}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenParentGate={() => setShowParentDashboard(true)}
        onOpenAvatarCustomizer={() => setShowAvatarCustomizer(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-start">
        {currentScreen === 'map' && (
          <WorldMap profile={profile} onSelectWorld={handleSelectWorld} />
        )}

        {currentScreen === 'quest' && activeWorld && (
          activeWorld.id === 'forest' ? (
            <DataQuestEngine
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile(updated);
                storage.saveProfile(updated);
              }}
              onReturnToMap={handleReturnToMap}
            />
          ) : (
            <MathQuestRunner
              world={activeWorld}
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile(updated);
                storage.saveProfile(updated);
              }}
              onReturnToMap={handleReturnToMap}
            />
          )
        )}

        {currentScreen === 'home' && (
          <PlayerHome
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              storage.saveProfile(updated);
            }}
          />
        )}

        {currentScreen === 'pets' && (
          <PetRoom
            profile={profile}
            onUpdateProfile={(updated) => {
              setProfile(updated);
              storage.saveProfile(updated);
            }}
          />
        )}
      </main>

      {/* Bottom Navigation for Children */}
      {currentScreen !== 'quest' && (
        <BottomNav
          currentScreen={currentScreen}
          onSelectScreen={(screen) => setCurrentScreen(screen)}
        />
      )}
    </div>
  );
}
