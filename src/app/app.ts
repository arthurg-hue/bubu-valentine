import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  imgDefault =
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp6bmZ6bmZ6bmZ6bmZ6bmZ6bmZ6bmZ6bmZ6bmZ6bmZ6bmZ6bmZ6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCBjdXN0b21fZXZlbnQmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif';
  imgVictory =
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM285anoybXg0aWc4djNreTJzdDdkcHE2eGN0ZzQ3bmg3Nzk4ODBuOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VJ0bWcKR30lecNIdbK/giphy.gif';

  sadImages = [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG1nZzFjaWRyczhnNzhraGtqeGU0MXZzOGk3M3gxaW04ZHI1dTY3eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/abZ5exGrse0W4/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXNnaTJhbjFlanNzYWZqdGc4Zno5cjdjc2U3YmkweHAwN3l6NHRwaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2rtQMJvhzOnRe/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXQ4b2JtNjVkZmZtYW13YzMwaWhmMHE0azhvdzQ2ZmFiMm9wY296MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7p3e2WCM0VEnm/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHc4a3NrcTMya3dlNm5kZjQ2b2x0ZG1pYmx0MWdzc29seDhzdGNtbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ffzhLUixCtlsc/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHh0Z3dnaWNrY2Ftcm1iNG9hb2tvc280NzhzeXNxMW51ajhteG0zNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u5bupNx8SxmiQ/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDRtdDZncGt4YWhjY3IxNDZnc3BlcHVsdmc2dTNxcHdwd3d0enE2NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BEob5qwFkSJ7G/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnkzOWQ1djY4eXJoaHlpdG05MHJjbGU0d21pb25vbHh2eDl5ZnE3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12Bpme5pTzGmg8/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3Nzc3NrNjcwMGNkbG1uOWVtdGc5cTRseHoxaDZocjJoaHE1ZWIzbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/K8Fv8azXDpbN73EfDP/giphy.gif',
  ];

  currentGif = this.imgDefault;
  accepted = false;
  yesButtonSize = 20;
  noButtonText = 'ไม่';
  noButtonStyle: any = { position: 'relative', 'z-index': '999' };
  private lastMoveTime = 0;

  // Gestion Audio (Déclarées mais pas initialisées ici)
  private bgMusic?: HTMLAudioElement;
  private victoryMusic?: HTMLAudioElement;
  private musicStarted = false;
  private isBrowser: boolean;

  messages = [
    'แน่ใจเหรอ?',
    'จริงๆ เหรอ??',
    'ลองคิดดูอีกทีนะ...',
    'โอกาสสุดท้ายแล้วนะ!',
    'ระวังจะเสียใจน้า...',
    'ใจดีกับเราหน่อยสิ 🥺',
    'ใจร้ายที่สุด...',
    'นะนะนะนะ... ได้โปรดดด!',
  ];
  messageIndex = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    // Vérification de la plateforme
    this.isBrowser = isPlatformBrowser(platformId);

    // On n'initialise l'audio que si on est sur un navigateur
    if (this.isBrowser) {
      this.bgMusic = new Audio('waiting.mp3');
      this.victoryMusic = new Audio('celeb.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.volume = 1;
      this.bgMusic.onloadeddata = () => console.log('Musique de fond chargée avec succès !');
      this.bgMusic.onerror = (e) =>
        console.error('Échec du chargement audio. Vérifiez le nom du fichier dans src/assets/', e);
    }
  }

  private startBackgroundMusic() {
    if (this.isBrowser && this.bgMusic && !this.musicStarted) {
      this.bgMusic.play().catch((e) => console.log('Audio play deferred'));
      this.musicStarted = true;
    }
  }

  moveButton(event: PointerEvent) {
    if (this.accepted) return;
    this.startBackgroundMusic();

    event.preventDefault();
    event.stopPropagation();
    this.lastMoveTime = Date.now();

    const sadIndex = this.messageIndex % this.sadImages.length;
    this.currentGif = this.sadImages[sadIndex];

    this.yesButtonSize += 25;
    this.noButtonText = this.messages[this.messageIndex];
    this.messageIndex = (this.messageIndex + 1) % this.messages.length;

    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 80);

    this.noButtonStyle = {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      'z-index': '9999',
      'touch-action': 'none',
      transition: 'none',
    };

    this.cdr.detectChanges();

    setTimeout(() => {
      if (!this.accepted) {
        this.currentGif = this.imgDefault;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  onYesClick() {
    const now = Date.now();
    if (now - this.lastMoveTime < 300) return;

    this.accepted = true;
    this.currentGif = this.imgVictory;

    if (this.isBrowser) {
      this.bgMusic?.pause();
      this.victoryMusic?.play().catch((e) => console.log('Victory audio error'));
    }

    this.launchConfetti();
    this.cdr.detectChanges();
  }

  launchConfetti() {
    const end = Date.now() + 3000;
    const colors = ['#ff69b4', '#ff1493', '#ffffff'];
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }
}
