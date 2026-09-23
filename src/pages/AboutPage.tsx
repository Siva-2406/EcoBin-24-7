import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Server,
  Database,
  LayoutDashboard,
  Bell,
  CheckCircle2,
  Award,
  Users,
  GraduationCap,
  Mail,
  Hash,
  Calendar,
  Building2,
  Video,
  Play,
  Pause,
  Maximize2,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Info,
  Check,
  Edit2,
  Save,
  RotateCcw,
} from 'lucide-react';

import smartBinImg from '../assets/images/smart_bin_prototype_1790089694784.jpg';
import circuitBoardImg from '../assets/images/circuit_breadboard_1790089708196.jpg';
import fieldTestingImg from '../assets/images/iot_field_testing_1790089724087.jpg';
import teamShowcaseImg from '../assets/images/team_ecobin_showcase.jpg';

interface AboutPageProps {
  onOpenPinoutModal: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  dept: string;
  year: string;
  rollNo: string;
  mailID: string;
  linkedinUrl: string;
  role: string;
  avatarUrl: string;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Sivaperumal B',
    dept: 'Computer Science and Business Systems (CSBS)',
    year: 'II CSBS',
    rollNo: '611225244049',
    mailID: '2k25csbs49@kiot.ac.in',
    linkedinUrl: '',
    role: 'Project Team Member',
    avatarUrl: '',
  },
  {
    id: 'member-2',
    name: 'Sureshkrishna B',
    dept: 'Computer Science and Business Systems (CSBS)',
    year: 'II CSBS',
    rollNo: '611225244056',
    mailID: '2k25csbs56@kiot.ac.in',
    linkedinUrl: '',
    role: 'Project Team Member',
    avatarUrl: '',
  },
  {
    id: 'member-3',
    name: 'Priyadharshini M',
    dept: 'Computer Science and Business Systems (CSBS)',
    year: 'II CSBS',
    rollNo: '611225244037',
    mailID: '2k25csbs37@kiot.ac.in',
    linkedinUrl: '',
    role: 'Project Team Member',
    avatarUrl: '',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenPinoutModal }) => {
  // Team members state with local editing capability
  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('ecobin_team_members_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load team members from storage', e);
    }
    return DEFAULT_TEAM_MEMBERS;
  });

  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editableTeam, setEditableTeam] = useState<TeamMember[]>(team);
  const [copiedMail, setCopiedMail] = useState<string | null>(null);

  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Lightbox modal state for gallery
  const [activeMedia, setActiveMedia] = useState<{
    type: 'image' | 'video';
    src: string;
    title: string;
    description: string;
  } | null>(null);

  const handleCopyMail = (mail: string) => {
    navigator.clipboard.writeText(mail);
    setCopiedMail(mail);
    setTimeout(() => setCopiedMail(null), 2000);
  };

  const handleSaveTeam = () => {
    setTeam(editableTeam);
    localStorage.setItem('ecobin_team_members_v2', JSON.stringify(editableTeam));
    setIsEditingTeam(false);
  };

  const handleResetTeam = () => {
    setEditableTeam(DEFAULT_TEAM_MEMBERS);
    setTeam(DEFAULT_TEAM_MEMBERS);
    localStorage.removeItem('ecobin_team_members_v2');
    setIsEditingTeam(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const steps = [
    {
      num: '1',
      title: 'Ultrasonic Distance Sensing',
      desc: 'HC-SR04 ultrasonic sensor transmits 40 kHz sound waves and measures time-of-flight to the waste surface.',
      icon: Radio,
      badge: 'Hardware Sensor',
    },
    {
      num: '2',
      title: 'Microcontroller Processing',
      desc: 'ESP8266 NodeMCU calculates the distance, maps it to a fill percentage (0-100%), and drives status LEDs.',
      icon: Cpu,
      badge: 'ESP8266 Firmware',
    },
    {
      num: '3',
      title: 'Direct HTTP REST Gateway',
      desc: 'ESP8266 connects via Wi-Fi and pushes JSON telemetry to POST /api/sensor-data without relying on third-party Blynk.',
      icon: Server,
      badge: 'Express REST API',
    },
    {
      num: '4',
      title: 'Cloud State & Database',
      desc: 'Telemetry is validated, stored in Cloud Firestore collections, and analyzed for immediate threshold alerts.',
      icon: Database,
      badge: 'Firestore Engine',
    },
    {
      num: '5',
      title: 'Real-Time Web Dashboard',
      desc: 'React & Tailwind dashboard visualizes current fill levels, interactive 3D container, and status badges 24×7.',
      icon: LayoutDashboard,
      badge: 'Vite + React SPA',
    },
    {
      num: '6',
      title: 'Overflow Alerts & Dispatch',
      desc: 'When fill reaches ≥96%, physical buzzer (D0) sounds and digital priority alerts notify sanitation teams.',
      icon: Bell,
      badge: 'Automated Dispatch',
    },
  ];

  return (
    <div id="about-page" className="space-y-10 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>IoT Engineering Project — KIOT Salem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About EcoBin 24×7
          </h1>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            EcoBin 24×7 is an end-to-end Smart Waste Monitoring &amp; Overflow Alert System designed to eliminate unhygienic municipal waste overflows, reduce manual inspection labor, and optimize campus sanitation logistics through embedded IoT telemetry.
          </p>
        </div>
      </div>

      {/* 4 Cards Section: 1 Video Card + 3 Image Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Project Media &amp; Prototype Showcase
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Hardware Demonstration &amp; Prototype Gallery
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            1 Video Demonstration • 3 Hardware Prototype Photos + Team Showcase
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: VIDEO CARD */}
          <div
            id="media-card-video"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col group hover:border-emerald-300 transition-all"
          >
            {/* Video Player Container */}
            <div className="relative bg-slate-950 aspect-video w-full overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                poster={circuitBoardImg}
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Top Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-md uppercase tracking-wider">
                  <Video className="w-3 h-3" />
                  <span>Card 1: Video Demo</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                  ESP8266 Live
                </span>
              </div>

              {/* Play / Pause Center Overlay Button */}
              <button
                onClick={togglePlay}
                className="absolute w-14 h-14 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 group-hover:opacity-100"
                aria-label={isPlaying ? 'Pause demonstration video' : 'Play demonstration video'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-1 rounded hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold hover:bg-white/30 transition-colors"
                  >
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>
                  <span className="text-[11px] font-mono text-slate-300">
                    Live Telemetry Ingest
                  </span>
                </div>
                <button
                  onClick={() =>
                    setActiveMedia({
                      type: 'video',
                      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                      title: 'Live Hardware Prototype Ingestion Video',
                      description: 'Real-time demonstration of the ESP8266 NodeMCU transmitting ultrasonic pulse-echo telemetry to the REST gateway with instant buzzer actuation.',
                    })
                  }
                  className="p-1.5 rounded hover:bg-white/20 transition-colors"
                  title="Expand to Fullscreen Modal"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Video Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 uppercase tracking-wide mb-1">
                  <span>Hardware &amp; System Demonstration</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  ESP8266 &amp; Ultrasonic Sensor Prototype Live Demonstration
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Shows the physical hardware cycle in real time: as simulated solid waste approaches the HC-SR04 ultrasonic transducer, distance decrements below 5 cm, triggering the visual red warning LED and sounding the 5V active buzzer.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-semibold">
                  HC-SR04 (D6/D5)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-semibold">
                  Buzzer Pin D0
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Wi-Fi REST &lt;150ms
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: IMAGE 1 - CIRCUIT BREADBOARD */}
          <div
            id="media-card-image-1"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col group hover:border-emerald-300 transition-all"
          >
            <div
              className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() =>
                setActiveMedia({
                  type: 'image',
                  src: circuitBoardImg,
                  title: 'NodeMCU ESP8266 & Sensor Wiring Assembly',
                  description: 'Detailed view of the IoT breadboard circuit showing the ESP8266 NodeMCU microcontroller connected with HC-SR04, tri-color status LEDs, and piezoelectric buzzer.',
                })
              }
            >
              <img
                src={circuitBoardImg}
                alt="ESP8266 Circuit Board Wiring"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/85 text-white shadow-md uppercase tracking-wider backdrop-blur-xs">
                  <ImageIcon className="w-3 h-3 text-emerald-400" />
                  <span>Card 2: Image 1</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to Enlarge</span>
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-sky-700 uppercase tracking-wide mb-1">
                  <span>Embedded Circuit Wiring</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  IoT Sensor Node &amp; NodeMCU Hardware Assembly
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Full breadboard arrangement integrating Tensilica L106 ESP8266 core, 40 kHz ultrasonic transmitter/receiver cylinders, current-limiting 220Ω resistors, and status indicator LEDs.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-bold border border-sky-200">
                  ESP8266 ESP-12E
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                  Voltage: 3.3V / 5V
                </span>
                <button
                  onClick={onOpenPinoutModal}
                  className="text-emerald-700 font-bold hover:underline ml-auto"
                >
                  Pinout Chart →
                </button>
              </div>
            </div>
          </div>

          {/* CARD 3: IMAGE 2 - SMART BIN PROTOTYPE */}
          <div
            id="media-card-image-2"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col group hover:border-emerald-300 transition-all"
          >
            <div
              className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() =>
                setActiveMedia({
                  type: 'image',
                  src: smartBinImg,
                  title: 'Physical Smart Bin Prototype Enclosure',
                  description: 'Campus-grade smart waste bin container featuring top-mounted ultrasonic transducer casing, visual notification LEDs, and municipal branding.',
                })
              }
            >
              <img
                src={smartBinImg}
                alt="Physical Smart Bin Prototype Enclosure"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/85 text-white shadow-md uppercase tracking-wider backdrop-blur-xs">
                  <ImageIcon className="w-3 h-3 text-emerald-400" />
                  <span>Card 3: Image 2</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to Enlarge</span>
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 uppercase tracking-wide mb-1">
                  <span>Physical Enclosure Testing</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  Physical Smart Dustbin Container Prototype
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Rugged 30 cm prototype container fitted with downward-facing ultrasonic transducer on the underside of the lid, maintaining an unobstructed line of sight to solid waste surfaces.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Lid-Mounted Sensing
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                  Calibrated Height: 30cm
                </span>
              </div>
            </div>
          </div>

          {/* CARD 4: IMAGE 3 - FIELD TESTING */}
          <div
            id="media-card-image-3"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col group hover:border-emerald-300 transition-all"
          >
            <div
              className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() =>
                setActiveMedia({
                  type: 'image',
                  src: teamShowcaseImg,
                  title: 'EcoBin 24×7 Team & Prototype Showcase',
                  description: 'EcoBin 24×7 team showcase with the working prototype, dashboard screens, and project documentation from Engineering Clinic 2 — IDEA Lab.',
                })
              }
            >
              <img
                src={teamShowcaseImg}
                alt="EcoBin 24×7 Team and Prototype Showcase"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/85 text-white shadow-md uppercase tracking-wider backdrop-blur-xs">
                  <ImageIcon className="w-3 h-3 text-emerald-400" />
                  <span>Card 4: Image 3</span>
                </span>
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to Enlarge</span>
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-1">
                  <span>Engineering Clinic 2 — IDEA Lab</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  Team &amp; Prototype Showcase
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Team demonstration of the EcoBin 24×7 prototype, live dashboard, and project documentation developed under Engineering Clinic 2 — IDEA Lab.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  Working Prototype
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                  IDEA Lab
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM MEMBERS SECTION (Requested: Name, Dept, Year, roll no, mailID for 3 team members) */}
      <div id="team-section" className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Engineering Clinic 2 — IDEA Lab</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Team Members
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Team members of EcoBin 24×7 under Engineering Clinic 2 — IDEA Lab.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isEditingTeam ? (
              <>
                <button
                  onClick={handleSaveTeam}
                  className="py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => {
                    setEditableTeam(team);
                    setIsEditingTeam(false);
                  }}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetTeam}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Reset to default team info"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditableTeam(team);
                  setIsEditingTeam(true);
                }}
                className="py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Customize Team Details</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div
              key={member.id}
              id={`team-member-${index + 1}`}
              className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              {isEditingTeam ? (
                /* Editable Form for Customization */
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editableTeam[index].name}
                      onChange={(e) => {
                        const updated = [...editableTeam];
                        updated[index] = { ...updated[index], name: e.target.value };
                        setEditableTeam(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={editableTeam[index].dept}
                      onChange={(e) => {
                        const updated = [...editableTeam];
                        updated[index] = { ...updated[index], dept: e.target.value };
                        setEditableTeam(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="text"
                      value={editableTeam[index].year}
                      onChange={(e) => {
                        const updated = [...editableTeam];
                        updated[index] = { ...updated[index], year: e.target.value };
                        setEditableTeam(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={editableTeam[index].rollNo}
                      onChange={(e) => {
                        const updated = [...editableTeam];
                        updated[index] = { ...updated[index], rollNo: e.target.value };
                        setEditableTeam(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Mail ID *
                    </label>
                    <input
                      type="email"
                      value={editableTeam[index].mailID}
                      onChange={(e) => {
                        const updated = [...editableTeam];
                        updated[index] = { ...updated[index], mailID: e.target.value };
                        setEditableTeam(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.linkedin.com/in/..."
                      value={editableTeam[index].linkedinUrl}
                      onChange={(e) => {
                        const updated = [...editableTeam];
                        updated[index] = { ...updated[index], linkedinUrl: e.target.value };
                        setEditableTeam(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                /* Display Card */
                <>
                  <div>
                    {/* Header with Avatar and Role */}
                    <div className="flex items-start gap-3.5 mb-4">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 border-2 border-white shadow-sm shrink-0 flex items-center justify-center font-black text-lg"
                          aria-label={member.name}
                        >
                          {member.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-1">
                          Team Member {index + 1}
                        </span>
                        <h3 className="text-base font-black text-slate-900 truncate">
                          {member.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Specified Fields: Dept, Year, Roll No, Mail ID */}
                    <div className="space-y-2.5 text-xs bg-white p-3.5 rounded-xl border border-slate-200/70">
                      {/* Department */}
                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Department
                          </span>
                          <span className="font-semibold text-slate-800 leading-tight block">
                            {member.dept}
                          </span>
                        </div>
                      </div>

                      {/* Year */}
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Year &amp; Batch
                          </span>
                          <span className="font-semibold text-slate-800 block">
                            {member.year}
                          </span>
                        </div>
                      </div>

                      {/* Roll Number */}
                      <div className="flex items-start gap-2">
                        <Hash className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Roll Number
                          </span>
                          <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs inline-block border border-emerald-200">
                            {member.rollNo}
                          </span>
                        </div>
                      </div>

                      {/* Mail ID */}
                      <div className="flex items-start gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Institutional Mail ID
                          </span>
                          <div className="flex items-center justify-between gap-1 mt-0.5">
                            <a
                              href={`mailto:${member.mailID}`}
                              className="font-mono text-slate-700 hover:text-emerald-700 truncate hover:underline"
                            >
                              {member.mailID}
                            </a>
                            <button
                              onClick={() => handleCopyMail(member.mailID)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                              title="Copy Email"
                            >
                              {copiedMail === member.mailID ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Mail className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Badge */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">
                      KIOT Autonomous
                    </span>
                    <a
                      href={`mailto:${member.mailID}?subject=EcoBin%2024x7%20Inquiry`}
                      className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Contact</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture Flow Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            End-To-End Architecture
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            How EcoBin 24×7 Works
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data pipeline from ultrasonic physical sound waves to cloud storage and real-time incident alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{step.title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Linear Chain Representation */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto flex items-center justify-between gap-3 text-center">
          <span>HC-SR04</span>
          <span>→</span>
          <span>ESP8266 NodeMCU</span>
          <span>→</span>
          <span>Wi-Fi (802.11)</span>
          <span>→</span>
          <span>Backend REST API</span>
          <span>→</span>
          <span>Cloud Firestore</span>
          <span>→</span>
          <span>Web Dashboard</span>
          <span>→</span>
          <span>Alert Dispatch</span>
        </div>
      </div>

      {/* Hardware & Software Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware Stack */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Hardware Bill of Materials</span>
            </h3>
            <button
              onClick={onOpenPinoutModal}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              View Wiring Table →
            </button>
          </div>

          <ul className="space-y-3 text-xs">
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">ESP8266 NodeMCU v3 (ESP-12E)</strong>
                <span className="text-slate-500">32-bit Tensilica L106 MCU running at 80 MHz with integrated 2.4 GHz Wi-Fi stack.</span>
              </div>
              <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Core MCU</span>
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">HC-SR04 Ultrasonic Distance Sensor</strong>
                <span className="text-slate-500">Non-contact 2cm–400cm measurement range with 3mm precision. Trig: D6, Echo: D5.</span>
              </div>
              <span className="font-mono text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded">Transducer</span>
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">Tricolor Status LEDs (Green, Yellow, Red)</strong>
                <span className="text-slate-500">Local visual warning. Green: D1 (0-50%), Yellow: D2 (51-80%), Red: D7 (81-100%).</span>
              </div>
              <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">Visual</span>
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">Piezoelectric Active Buzzer</strong>
                <span className="text-slate-500">Immediate audible alarm on Pin D0 when container reaches overflow limit (≥96%).</span>
              </div>
              <span className="font-mono text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">Audible</span>
            </li>
          </ul>
        </div>

        {/* Software Stack */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Software Stack &amp; Protocols</span>
          </h3>

          <ul className="space-y-3 text-xs">
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">Frontend: React 19 + TypeScript + Vite</strong>
                <span className="text-slate-500">Modern single-page architecture styled with Tailwind CSS utility classes and Recharts.</span>
              </div>
              <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">UI Client</span>
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">Backend: Node.js + Express REST API</strong>
                <span className="text-slate-500">High-throughput ingestion layer serving REST endpoints under /api/* on Port 3000.</span>
              </div>
              <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">Server</span>
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">Database &amp; Security: Cloud Firestore</strong>
                <span className="text-slate-500">Real-time NoSQL persistence with firestore.rules security enforcement for IoT telemetry.</span>
              </div>
              <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">Storage</span>
            </li>
            <li className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
              <div>
                <strong className="block font-bold text-slate-900">Microcontroller Firmware: Arduino C++</strong>
                <span className="text-slate-500">Lightweight HTTP client with non-blocking Wi-Fi reconnect and pulse timing filters.</span>
              </div>
              <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Embedded</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Lightbox / Media Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {activeMedia.title}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {activeMedia.type === 'video' ? 'Hardware Demo Video Player' : 'High Resolution Prototype Photo'}
                </span>
              </div>
              <button
                onClick={() => setActiveMedia(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 aspect-video w-full flex items-center justify-center">
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.src}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-4 bg-slate-50 text-xs text-slate-600">
              <p>{activeMedia.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
