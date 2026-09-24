import confetti from 'canvas-confetti';
import { sound } from './audio';

// Pre-create emoji shapes for high-performance reuse
let crystalShape: confetti.Shape | null = null;
let starShape: confetti.Shape | null = null;
let sparkleShape: confetti.Shape | null = null;
let coinShape: confetti.Shape | null = null;
let greenGemShape: confetti.Shape | null = null;

try {
  if (typeof confetti.shapeFromText === 'function') {
    crystalShape = confetti.shapeFromText({ text: '💎', scalar: 2 });
    starShape = confetti.shapeFromText({ text: '⭐', scalar: 1.8 });
    sparkleShape = confetti.shapeFromText({ text: '✨', scalar: 1.8 });
    coinShape = confetti.shapeFromText({ text: '🪙', scalar: 2 });
    greenGemShape = confetti.shapeFromText({ text: '💚', scalar: 1.8 });
  }
} catch {
  // Fallback if environment doesn't support Canvas text measurement
}

interface ParticleOrigin {
  x: number;
  y: number;
}

class ParticleManager {
  /**
   * Helper to compute normalized 0..1 coordinates from an HTML element
   */
  getElementOrigin(element?: HTMLElement | null): ParticleOrigin {
    if (!element) {
      return { x: 0.5, y: 0.5 };
    }
    const rect = element.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (rect.left + rect.width / 2) / window.innerWidth)),
      y: Math.max(0, Math.min(1, (rect.top + rect.height / 2) / window.innerHeight)),
    };
  }

  /**
   * Magical Crystal Collection Particle Burst
   * Explodes crystals, diamonds, glowing stars, and emerald / gold sparkles
   */
  crystalCollect(targetElementOrOrigin?: HTMLElement | ParticleOrigin | null, crystalType: string = 'forest') {
    sound.playSfx('crystal');

    const origin = targetElementOrOrigin && 'x' in targetElementOrOrigin
      ? targetElementOrOrigin
      : this.getElementOrigin(targetElementOrOrigin as HTMLElement);

    // Color palette based on crystal type
    let primaryColors = ['#10b981', '#34d399', '#6ee7b7', '#fef08a', '#38bdf8'];
    if (crystalType === 'addition') {
      primaryColors = ['#f59e0b', '#fbbf24', '#fde68a', '#fb7185', '#38bdf8'];
    } else if (crystalType === 'time') {
      primaryColors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#38bdf8', '#fef08a'];
    }

    // Wave 1: Immediate radial flash of stars and sparkles
    confetti({
      particleCount: 35,
      spread: 80,
      startVelocity: 30,
      origin,
      colors: primaryColors,
      shapes: ['star', 'circle'],
      scalar: 1.2,
      ticks: 150,
      gravity: 0.7,
      zIndex: 9999,
    });

    // Wave 2: Crystal and Gem emoji burst with floaty gravity
    const customShapes: confetti.Shape[] = [];
    if (crystalShape) customShapes.push(crystalShape);
    if (sparkleShape) customShapes.push(sparkleShape);
    if (greenGemShape && crystalType === 'forest') customShapes.push(greenGemShape);
    if (starShape) customShapes.push(starShape);

    if (customShapes.length > 0) {
      setTimeout(() => {
        confetti({
          particleCount: 16,
          spread: 100,
          startVelocity: 35,
          origin,
          shapes: customShapes,
          ticks: 180,
          gravity: 0.6,
          drift: 0,
          scalar: 2.2,
          zIndex: 9999,
        });
      }, 80);
    }

    // Wave 3: Glittering dust fallout
    setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 120,
        startVelocity: 25,
        origin,
        colors: ['#ffffff', '#fde047', '#a7f3d0', '#67e8f9'],
        shapes: ['circle'],
        scalar: 0.8,
        ticks: 200,
        gravity: 0.9,
        zIndex: 9999,
      });
    }, 180);
  }

  /**
   * Quest Victory Grand Show:
   * Multi-stage fireworks and cannons with stars, confetti, and sparkles
   */
  questVictory() {
    sound.playSfx('fanfare');

    // Left cannon
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#a855f7'],
      shapes: ['star', 'circle', 'square'],
      scalar: 1.2,
      zIndex: 9999,
    });

    // Right cannon
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#a855f7'],
      shapes: ['star', 'circle', 'square'],
      scalar: 1.2,
      zIndex: 9999,
    });

    // Center burst with crystals and stars after 250ms
    setTimeout(() => {
      const victoryShapes: confetti.Shape[] = ['star', 'circle'];
      if (crystalShape) victoryShapes.push(crystalShape);
      if (starShape) victoryShapes.push(starShape);
      if (sparkleShape) victoryShapes.push(sparkleShape);

      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        shapes: victoryShapes,
        colors: ['#fbbf24', '#10b981', '#38bdf8', '#f43f5e'],
        scalar: 1.5,
        zIndex: 9999,
      });
    }, 280);

    // Final confetti shower after 600ms
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 140,
        origin: { x: 0.5, y: 0.3 },
        colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6'],
        gravity: 0.8,
        ticks: 240,
        zIndex: 9999,
      });
    }, 600);
  }

  /**
   * Correct Answer / Good Job pop
   * Small, crisp explosion of stars around a specific answer button
   */
  correctPop(targetElementOrOrigin?: HTMLElement | ParticleOrigin | null) {
    const origin = targetElementOrOrigin && 'x' in targetElementOrOrigin
      ? targetElementOrOrigin
      : this.getElementOrigin(targetElementOrOrigin as HTMLElement);

    const shapes: confetti.Shape[] = ['star', 'circle'];
    if (starShape) shapes.push(starShape);
    if (sparkleShape) shapes.push(sparkleShape);

    confetti({
      particleCount: 24,
      spread: 60,
      startVelocity: 22,
      origin,
      colors: ['#fbbf24', '#34d399', '#38bdf8', '#ffffff'],
      shapes,
      scalar: 1.1,
      ticks: 120,
      gravity: 0.9,
      zIndex: 9999,
    });
  }

  /**
   * Golden Coin Spill
   * When earning coins or buying items
   */
  coinSpill(targetElementOrOrigin?: HTMLElement | ParticleOrigin | null) {
    sound.playSfx('coin');

    const origin = targetElementOrOrigin && 'x' in targetElementOrOrigin
      ? targetElementOrOrigin
      : this.getElementOrigin(targetElementOrOrigin as HTMLElement);

    const shapes: confetti.Shape[] = ['circle'];
    if (coinShape) shapes.push(coinShape);
    if (starShape) shapes.push(starShape);

    confetti({
      particleCount: 22,
      spread: 70,
      startVelocity: 25,
      origin,
      colors: ['#f59e0b', '#fbbf24', '#fef08a', '#d97706'],
      shapes,
      scalar: 1.6,
      ticks: 150,
      gravity: 1.1,
      zIndex: 9999,
    });
  }

  /**
   * Boss Hit Sparks
   * Sparks emitted when attacking or solving a boss riddle
   */
  bossHitSparks(targetElementOrOrigin?: HTMLElement | ParticleOrigin | null) {
    const origin = targetElementOrOrigin && 'x' in targetElementOrOrigin
      ? targetElementOrOrigin
      : this.getElementOrigin(targetElementOrOrigin as HTMLElement);

    confetti({
      particleCount: 25,
      spread: 80,
      startVelocity: 28,
      origin,
      colors: ['#ef4444', '#f97316', '#fbbf24', '#ffffff'],
      shapes: ['star', 'circle'],
      scalar: 1.1,
      ticks: 100,
      gravity: 1,
      zIndex: 9999,
    });
  }

  /**
   * Heart Pet Feed Reaction
   */
  petLove(targetElementOrOrigin?: HTMLElement | ParticleOrigin | null) {
    const origin = targetElementOrOrigin && 'x' in targetElementOrOrigin
      ? targetElementOrOrigin
      : this.getElementOrigin(targetElementOrOrigin as HTMLElement);

    confetti({
      particleCount: 20,
      spread: 60,
      startVelocity: 20,
      origin,
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a'],
      shapes: ['circle', 'star'],
      scalar: 1.3,
      ticks: 130,
      gravity: 0.7,
      zIndex: 9999,
    });
  }
}

export const particles = new ParticleManager();
