import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { 
  Truck, 
  Ship, 
  Train, 
  Plane, 
  Search, 
  MessageSquare, 
  X, 
  Send, 
  Lock, 
  LayoutDashboard, 
  Package, 
  Users, 
  Plus, 
  Trash2, 
  RefreshCw, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  LogOut, 
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  Menu,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Shield
} from 'lucide-react';

import { Magnet } from './components/Magnet';

// Client-side Session State keys
const SESSION_TOKEN_KEY = 'delflow_token';
const SESSION_USER_KEY = 'delflow_user';
const ANONYMOUS_CHAT_KEY = 'delflow_anonymous_session_id';

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "tracking-latency",
    category: "Supply Chain",
    title: "How Real-time Tracking Decreases Logistics Latency",
    excerpt: "Discover how AI-powered sensor tracking keeps fleets perfectly synced with delivery terminals.",
    image: "https://i.pinimg.com/736x/73/79/ed/7379ed2cab8e357793330c6311284d75.jpg",
    date: "June 25, 2026",
    author: "Elena Rostov, Head of Logistics Tech",
    content: [
      "In the fast-paced world of global logistics, latency is the ultimate efficiency killer. Traditional tracking methods—relying on manual updates at major transit hubs—often leave both logistics managers and clients in the dark for hours, if not days. This lack of transparency can result in missed connections, idle port personnel, and costly delays.",
      "With the integration of real-time AI-powered sensor tracking, Delflow has pioneered a paradigm shift. High-precision IoT beacons and smart sensors embedded within cargo containers continuously transmit precise coordinates, temperature, humidity, and vibration metrics.",
      "By feeding this continuous stream of data into predictive routing models, our logistics software can predict congestion at port terminals up to 12 hours before arrival. This allows us to dynamically reroute cargo or reschedule land connections, cutting down waiting times and reducing operational latency by up to 34%."
    ]
  },
  {
    id: "green-shipping",
    category: "Ocean Cargo",
    title: "Ocean Freighting in 2026: Green Shipping Regulations",
    excerpt: "Analyzing new environmental frameworks governing trans-Pacific and trans-Atlantic ocean shipments.",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=400&auto=format&fit=crop",
    date: "May 18, 2026",
    author: "Marcus Vance, Director of Maritime Compliance",
    content: [
      "As maritime trade continues to serve as the backbone of global commerce, international regulatory bodies have introduced landmark environmental frameworks aimed at achieving net-zero carbon emissions by 2050. The latest 2026 mandates require all trans-oceanic vessels to reduce overall greenhouse gas emissions by 20% compared to previous baselines.",
      "Delflow is actively embracing these sustainability protocols. Our maritime partners have integrated hybrid eco-fuels and air-lubrication systems that decrease friction between the ship's hull and sea water, significantly reducing fuel consumption.",
      "Furthermore, our advanced route-optimization algorithms analyze ocean currents, weather patterns, and waves to determine the most energy-efficient trajectories. These 'Green Corridors' not only ensure compliance with strict international laws but also translate directly into more stable, predictable pricing for our global enterprise clients."
    ]
  },
  {
    id: "customs-optimization",
    category: "Dispatch",
    title: "Customs Clearance Optimization for Air Freights",
    excerpt: "Three important declarations you must perfect to pass international airport cargo security instantly.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop",
    date: "April 12, 2026",
    author: "Siddharth Mehta, Chief Customs Officer",
    content: [
      "Air freight is chosen for its speed, yet customs clearance bottlenecks at major international airports can quickly erase this time advantage. Ensuring your documentation matches regulatory expectations is key to preventing airport holds.",
      "To optimize customs clearance speed, shippers must master three essential elements: precise HS (Harmonized System) classification codes, comprehensive commercial invoices, and proper packing lists detailing exact weight distribution.",
      "At Delflow, we leverage automated pre-clearance protocols. By electronically transmitting verified shipping data and safety compliance credentials to border authorities while the aircraft is still in transit, we achieve instant clearance upon landing, facilitating immediate last-mile dispatch."
    ]
  }
];

const SERVICE_DETAILS_DATA = {
  road: {
    title: "Premium Road Transport",
    category: "Land Logistics",
    icon: Truck,
    image: "https://i.pinimg.com/736x/73/79/ed/7379ed2cab8e357793330c6311284d75.jpg",
    tagline: "Flexible, secure, and fast door-to-door domestic trucking solutions.",
    description: "Delflow manages a highly modern, temperature-monitored continental fleet equipped with intelligent telematics, electronic security seals, and climate-controlled cabins. We offer comprehensive Full Truckload (FTL) and Less Than Truckload (LTL) regional distributions, ensuring that your high-value, fragile, or temperature-sensitive cargo arrives with absolute structural integrity, bypassing primary port congestion entirely.",
    stats: [
      { label: "Transit Window", value: "1 - 3 Business Days" },
      { label: "Service Coverage", value: "Continental Hubs & Regional Zones" },
      { label: "Fleet Capacity", value: "12,500+ Smart Reefers & Flatbeds" },
      { label: "Eco Rating", value: "Euro 6 Low-Emission Class" },
    ],
    highlights: [
      {
        title: "Smart Telematics & IoT Tracking",
        desc: "Every truck is tracked continuously with high-fidelity GPS, active door-open sensors, and real-time internal cargo temperature reporting."
      },
      {
        title: "FTL & LTL Optimization",
        desc: "Whether you need a dedicated single reefer or consolidated partial loads, our dynamic cargo pooling algorithms save up to 25% on shipping fees."
      },
      {
        title: "Direct Door-to-Door Dispatch",
        desc: "Zero intermediate handling. Your shipment is loaded directly at your facility and delivered straight to the destination with no transfer risk."
      }
    ],
    technicalSpecs: {
      weightLimit: "Up to 45,000 lbs (20,400 kg) per container unit",
      securityStandard: "Level 1 Active Perimeter & Remote Engine Interlocks",
      temperatureRange: "-20°C to +25°C with dual-compressor backup systems",
      idealFor: "Consumer Goods, Fresh Produce, High-Value Retail, and Construction Equipment"
    }
  },
  ocean: {
    title: "Global Ocean Cargo Freight",
    category: "Maritime Logistics",
    icon: Ship,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop",
    tagline: "Economical and high-volume worldwide containerized cargo solutions.",
    description: "Delflow operates as a leading Non-Vessel Operating Common Carrier (NVOCC) linking global maritime trade lanes. We manage deep-sea logistics across all major global container ports, coordinating with top-tier steamship alliances. Our priority allocation contracts guarantee container slots even during peak shipping seasons, allowing you to move heavy bulk cargo on predictable, optimized schedules with minimal friction.",
    stats: [
      { label: "Transit Window", value: "12 - 25 Business Days" },
      { label: "Service Coverage", value: "All Major Global Sea Ports" },
      { label: "Standard Options", value: "FCL (Full) & LCL (Shared) Containers" },
      { label: "Green Alternative", value: "Bio-fuel maritime lanes & slow steaming" },
    ],
    highlights: [
      {
        title: "Optimized Container Logistics",
        desc: "Full Container Load (FCL) for high-volume exclusive shipments, and Less than Container Load (LCL) consolidated containers for cost efficiency."
      },
      {
        title: "HS Customs Classification pre-clearance",
        desc: "Electronic manifest transfer to port authorities prior to vessel arrival ensures rapid customs release at the destination docks."
      },
      {
        title: "Strategic Port Alliances",
        desc: "Immediate berthing and transfer rights across premium marine terminals globally, minimizing port detention and demurrage risks."
      }
    ],
    technicalSpecs: {
      weightLimit: "Standard 20ft & 40ft Dry/Reefer containers (Up to 30 tons)",
      securityStandard: "C-TPAT High-Security ISO 17712 Bolt Seals",
      temperatureRange: "Reefer containers supporting -30°C to +30°C",
      idealFor: "Bulk Industrial Raw Materials, Finished Auto Parts, Electronics, and Heavy Commodities"
    }
  },
  train: {
    title: "Continental Railway Freight",
    category: "Intermodal Logistics",
    icon: Train,
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop",
    tagline: "Ecological, secure, and highly reliable block train freight systems.",
    description: "Delflow operates comprehensive rail corridors connecting major industrial belts. Railway shipping is the perfect middle-ground between the rapid speeds of air freight and the cost-efficiencies of ocean transport. With strictly scheduled block-train lines and containerized multi-modal terminals, we move raw materials, industrial machinery, and finished products securely with a 70% lower carbon footprint than road transport.",
    stats: [
      { label: "Transit Window", value: "6 - 12 Business Days" },
      { label: "Service Coverage", value: "Primary Industrial Belt Rail Networks" },
      { label: "Carbon Reduction", value: "70% lower emissions vs. Road transport" },
      { label: "Terminal Type", value: "Automated dry-port container transfer" },
    ],
    highlights: [
      {
        title: "Block-Train Scheduling Precision",
        desc: "Dedicated weekly departures with guaranteed timetables that bypass traditional border-crossing rail congestion and bottlenecks."
      },
      {
        title: "Intermodal Connectivity",
        desc: "Seamless transfers between sea, rail, and road using standardized ISO shipping containers for continuous flow."
      },
      {
        title: "Highly Weather-Resistant",
        desc: "Unlike air or ocean freight, rail logistics are virtually unaffected by adverse meteorological events, ensuring ultra-stable schedules."
      }
    ],
    technicalSpecs: {
      weightLimit: "Double-stack flatcars handling up to 70 tons per platform",
      securityStandard: "Continuous automated railway track telemetry & geo-fenced cars",
      temperatureRange: "Insulated and heated/cooled boxcars with remote logs",
      idealFor: "Automotive, Industrial Machinery, Bulk Minerals, Timber, and Heavy Chemicals"
    }
  },
  air: {
    title: "High-Priority Air Freight Dispatch",
    category: "Express Aviation Logistics",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
    tagline: "Top-tier rapid aviation shipping with integrated customs pre-clearance.",
    description: "When time is the ultimate constraint, Delflow’s High-Priority Express Air Freight guarantees next-flight-out allocations. We partner with leading commercial and cargo airlines to offer express connections between every major international airport. Our integrated customs pre-clearance network processes electronic declarations while your shipment is in mid-air, allowing for near-instant release upon runway arrival.",
    stats: [
      { label: "Transit Window", value: "1 - 3 Business Days Globally" },
      { label: "Service Coverage", value: "150+ Countries with Dedicated Air Hubs" },
      { label: "Priority Level", value: "Next Flight Out (NFO) & Charters" },
      { label: "Special Service", value: "On-Board Courier (OBC) Hand-carry" },
    ],
    highlights: [
      {
        title: "Guaranteed Next-Flight-Out",
        desc: "Top priority boarding status across partner airlines guarantees cargo dispatch, even in peak global holiday seasons."
      },
      {
        title: "End-to-End Cold Chain Integrity",
        desc: "Active temperature-controlled Envirotainer systems keep biopharmaceuticals and vaccines completely stable throughout transit."
      },
      {
        title: "White-Glove Courier Delivery",
        desc: "Includes on-board courier capabilities for extremely sensitive microchips, emergency aerospace parts, or vital documents."
      }
    ],
    technicalSpecs: {
      weightLimit: "ULD Air Containers & Custom Charter Planes",
      securityStandard: "X-Ray Screening, Explosive Detection, & Locked Vaults",
      temperatureRange: "Cryogenic (-150°C), Deep Frozen, Refrigerated, & Ambient",
      idealFor: "Biopharmaceuticals, Semiconductor Electronics, Urgent Aerospace Parts, and Luxury Goods"
    }
  }
};

const GLOBAL_HUBS = [
  { name: 'New York (HQ)', x: '25%', y: '35%', country: 'United States', code: 'JFK', processing: '1.8h', fleet: 240, color: '#F97316' },
  { name: 'Rotterdam Hub', x: '48%', y: '28%', country: 'Netherlands', code: 'RTM', processing: '2.1h', fleet: 185, color: '#3B82F6' },
  { name: 'Dubai Hub', x: '62%', y: '42%', country: 'United Arab Emirates', code: 'DXB', processing: '1.5h', fleet: 140, color: '#10B981' },
  { name: 'Shanghai Hub', x: '82%', y: '40%', country: 'China', code: 'PVG', processing: '2.5h', fleet: 310, color: '#EF4444' },
  { name: 'Singapore Hub', x: '80%', y: '58%', country: 'Singapore', code: 'SIN', processing: '1.2h', fleet: 220, color: '#8B5CF6' }
];

function WordsPullUp({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const letters = Array.from(text);
  
  return (
    <span ref={ref} className={`inline-flex relative ${className}`} style={{ color: '#E1E0CC' }}>
      {letters.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden relative">
          <motion.span
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block relative"
          >
            {char}
            {i === letters.length - 1 && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] font-medium">
                *
              </span>
            )}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function DelflowLogo({ className = "w-7 h-7 text-white" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10 H60 C75 10 75 40 50 65 L25 85 C21 88 15 83 10 70 V10 Z M22 22 H50 C52 22 45 35 32 50 L22 62 V22 Z" fill="currentColor" fillRule="evenodd" />
        <path d="M55 90 C45 90 44 76 56 60 L78 28 C84 18 92 23 92 36 C92 60 78 90 55 90 Z" fill="currentColor" />
      </svg>
      <span className="font-sans font-bold text-xl tracking-tight text-white">Delflow</span>
    </div>
  );
}

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'services' | 'blog' | 'contact' | 'admin' | 'service-detail'>('home');
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<'road' | 'ocean' | 'train' | 'air' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [activeHub, setActiveHub] = useState<any>(GLOBAL_HUBS[0]);
  const [aboutFaqOpen, setAboutFaqOpen] = useState<number | null>(null);
  const [servicesFaqOpen, setServicesFaqOpen] = useState<number | null>(null);
  const [contactFaqOpen, setContactFaqOpen] = useState<number | null>(null);

  // Scroll and floating widget animation states
  const [scrolledBeyondHero, setScrolledBeyondHero] = useState(false);
  const [isScrollingMobile, setIsScrollingMobile] = useState(false);

  // Contact Form States
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Scroll listener for floating bubbles (with self-minimizing & bubble slides)
  useEffect(() => {
    let scrollTimeout: any;

    const handleScroll = () => {
      // 1. If not on home page, there's no hero, so floating buttons should always show
      if (currentView !== 'home') {
        setScrolledBeyondHero(true);
      } else {
        // Hero is full height; show widgets only when scrolled beyond 300px
        setScrolledBeyondHero(window.scrollY > 300);
      }

      // 2. Dock to sides (bubble-move) on mobile scroll with auto-reset after 350ms of quiet
      if (window.innerWidth < 768) {
        setIsScrollingMobile(true);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsScrollingMobile(false);
        }, 350);
      } else {
        setIsScrollingMobile(false);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentView]);

  // Auth States
  const [token, setToken] = useState<string | null>(localStorage.getItem(SESSION_TOKEN_KEY));
  const latestTokenRef = useRef<string | null>(token);

  // Sync token ref with token state
  useEffect(() => {
    latestTokenRef.current = token;
  }, [token]);

  const [user, setUser] = useState<any | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);

  // Tracking States
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingService, setTrackingService] = useState('Road Transport');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Live Chat States (Public Widget)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [anonymousSessionId, setAnonymousSessionId] = useState<string>('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Admin Dashboard States
  const [adminTab, setAdminTab] = useState<'dashboard' | 'parcels' | 'chat' | 'roles'>('dashboard');
  const [adminSidebarCollapsedDesktop, setAdminSidebarCollapsedDesktop] = useState(false);
  const [adminMenuOpenMobile, setAdminMenuOpenMobile] = useState(false);
  const [parcels, setParcels] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [adminChatInput, setAdminChatInput] = useState('');
  const [stats, setStats] = useState({ activeShipments: 0, pendingChats: 0 });

  // Staff Invitation state variables
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Super Admin' | 'Admin' | 'Support Agent'>('Admin');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [invitedUserCredentials, setInvitedUserCredentials] = useState<{
    email: string;
    role: string;
    password?: string;
    mockEmailBody?: string;
  } | null>(null);

  // Parcel CRUD Modal/Form state
  const [parcelModalOpen, setParcelModalOpen] = useState(false);
  const [parcelSenderName, setParcelSenderName] = useState('');
  const [parcelSenderEmail, setParcelSenderEmail] = useState('');
  const [parcelReceiverName, setParcelReceiverName] = useState('');
  const [parcelReceiverEmail, setParcelReceiverEmail] = useState('');
  const [parcelOrigin, setParcelOrigin] = useState('');
  const [parcelDestination, setParcelDestination] = useState('');
  const [parcelCurrentStatus, setParcelCurrentStatus] = useState<'Registered' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception'>('Registered');
  const [parcelEstimatedDelivery, setParcelEstimatedDelivery] = useState('');
  const [parcelChooseServices, setParcelChooseServices] = useState('Road Transport');
  const [parcelLocation, setParcelLocation] = useState('');
  const [parcelDescription, setParcelDescription] = useState('');
  const [isSubmittingParcel, setIsSubmittingParcel] = useState(false);

  // Parcel Update Status state
  const [statusUpdateOpen, setStatusUpdateOpen] = useState<string | null>(null);
  const [updateStatusVal, setUpdateStatusVal] = useState<'Registered' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception'>('In Transit');
  const [updateLocation, setUpdateLocation] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');

  // UI Quote Request State
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const adminChatEndRef = useRef<HTMLDivElement>(null);

  // Initialize and check user auth on mount
  useEffect(() => {
    // Generate/retrieve anonymous session ID for support chat
    let anonId = localStorage.getItem(ANONYMOUS_CHAT_KEY);
    if (!anonId) {
      anonId = 'anon_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(ANONYMOUS_CHAT_KEY, anonId);
    }
    setAnonymousSessionId(anonId);

    if (token) {
      fetchCurrentUser();
    } else {
      checkFirstAdminSetup();
    }
  }, [token]);

  // Handle active admin tab data loading
  useEffect(() => {
    if (currentView === 'admin' && token) {
      if (adminTab === 'dashboard') {
        fetchParcels();
        fetchActiveChats();
      } else if (adminTab === 'parcels') {
        fetchParcels();
      } else if (adminTab === 'chat') {
        fetchActiveChats();
      } else if (adminTab === 'roles') {
        fetchAdminUsers();
      }
    }
  }, [currentView, adminTab, token]);

  // Public live chat real-time polling (every 3.5 seconds)
  useEffect(() => {
    let interval: any;
    if (chatOpen && anonymousSessionId) {
      fetchChatHistory();
      interval = setInterval(() => {
        fetchChatHistory();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [chatOpen, anonymousSessionId]);

  // Admin chat inbox real-time polling (every 3.5 seconds)
  useEffect(() => {
    let interval: any;
    if (currentView === 'admin' && adminTab === 'chat' && token) {
      interval = setInterval(() => {
        fetchActiveChats();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [currentView, adminTab, token]);

  // Keep track of active chats stats
  useEffect(() => {
    if (parcels.length > 0 || activeChats.length > 0) {
      const activeShipments = parcels.filter(p => p.currentStatus !== 'Delivered').length;
      const pendingChats = activeChats.filter(c => c.messages && c.messages[c.messages.length - 1]?.senderType === 'user').length;
      setStats({ activeShipments, pendingChats });
    }
  }, [parcels, activeChats]);

  // Scroll chat boxes to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatOpen]);

  useEffect(() => {
    adminChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  // Fetch functions
  const checkFirstAdminSetup = async () => {
    try {
      const res = await fetch('/api/auth/has-admin');
      if (res.ok) {
        const data = await res.json();
        setIsFirstAdmin(!data.hasAdmin);
      } else {
        setIsFirstAdmin(false);
      }
    } catch (e) {
      console.error(e);
      setIsFirstAdmin(false);
    }
  };

  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (token !== latestTokenRef.current) {
        return; // Ignore stale request
      }
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token stale
        logout();
      }
    } catch (e) {
      if (token === latestTokenRef.current) {
        console.error(e);
      }
    }
  };

  const fetchParcels = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/parcels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (token !== latestTokenRef.current) return;
      if (res.ok) {
        const data = await res.json();
        setParcels(data);
      }
    } catch (e) {
      if (token === latestTokenRef.current) {
        console.error(e);
      }
    }
  };

  const fetchAdminUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (token !== latestTokenRef.current) return;
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data);
      }
    } catch (e) {
      if (token === latestTokenRef.current) {
        console.error(e);
      }
    }
  };

  const fetchActiveChats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/chat/active-sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (token !== latestTokenRef.current) return;
      if (res.ok) {
        const data = await res.json();
        setActiveChats(data);
        
        // Sync selected chat messages if one is selected
        if (selectedChat) {
          const updated = data.find((c: any) => c.id === selectedChat.id);
          if (updated) {
            setSelectedChat(updated);
          }
        }
      }
    } catch (e) {
      if (token === latestTokenRef.current) {
        console.error(e);
      }
    }
  };

  const fetchChatHistory = async () => {
    if (!anonymousSessionId) return;
    try {
      const res = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymousSessionId })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const endpoint = (isFirstAdmin || !isLoginView) ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      
      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(`Authentication failed: Server returned non-JSON response with status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem(SESSION_TOKEN_KEY, data.token);
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthSuccess((isFirstAdmin || !isLoginView) ? 'Super Admin account registered successfully!' : 'Welcome back!');
      
      // Reset inputs
      setAuthEmail('');
      setAuthPassword('');
      setIsFirstAdmin(false);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const logout = async () => {
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
    setToken(null);
    setUser(null);
    setSelectedChat(null);
    setAdminTab('dashboard');
  };

  // Tracking Action
  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingResult(null);

    // Smooth scroll to tracking section immediately to show the loading state or result
    setTimeout(() => {
      const trackSection = document.getElementById('tracking-section');
      if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      const res = await fetch(`/api/parcels/track/${trackingCode}`);
      
      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(`Tracking failed: Server returned non-JSON response with status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Tracking number not found');
      }

      setTrackingResult(data);
    } catch (err: any) {
      setTrackingError(err.message);
    } finally {
      setTrackingLoading(false);
      // Ensure it's scrolled correctly again after state is updated
      setTimeout(() => {
        const trackSection = document.getElementById('tracking-section');
        if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  // Public Live Chat Submit
  const handleSendPublicMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const textToSend = chatInput;
    setChatInput('');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: anonymousSessionId,
          senderType: 'user',
          senderId: anonymousSessionId,
          senderName: 'Client',
          text: textToSend
        })
      });

      if (res.ok) {
        fetchChatHistory();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Live Chat Submit
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim() || !selectedChat) return;

    const textToSend = adminChatInput;
    setAdminChatInput('');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedChat.id,
          senderType: 'agent',
          senderId: user.email,
          senderName: user.role === 'Super Admin' ? 'Super Admin' : 'Agent',
          text: textToSend
        })
      });

      if (res.ok) {
        // Refresh chats instantly
        fetchActiveChats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Close Support Chat Session
  const handleCloseChatSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/close`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSelectedChat(null);
        fetchActiveChats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Role (Super Admin only)
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchAdminUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update role');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Invite/Grant Admin Status to Staff Member
  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    setInviteError(null);
    setInvitedUserCredentials(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole
        })
      });

      const data = await res.json();
      if (res.ok) {
        setInvitedUserCredentials({
          email: data.user.email,
          role: data.user.role,
          password: data.generatedPassword,
          mockEmailBody: data.mockEmailSent.body
        });
        setInviteEmail('');
        fetchAdminUsers();
      } else {
        setInviteError(data.error || 'Failed to grant admin status.');
      }
    } catch (err: any) {
      console.error(err);
      setInviteError('An unexpected error occurred while granting authority.');
    } finally {
      setInviteLoading(false);
    }
  };

  // Revoke Staff Member Access
  const handleRevokeStaff = async (userId: string, userEmail: string) => {
    if (!window.confirm(`Are you sure you want to revoke administrative access for ${userEmail}?\nThis action is immediate and will log them out.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        if (userId === user?.id) {
          logout();
        } else {
          fetchAdminUsers();
        }
      } else {
        alert(data.error || 'Failed to revoke staff access.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while revoking staff access.');
    }
  };

  // Delete Parcel
  const handleDeleteParcel = async (parcelId: string) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;
    try {
      const res = await fetch(`/api/parcels/${parcelId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchParcels();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Status Form Submit
  const handleStatusUpdateSubmit = async (e: React.FormEvent, parcelId: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/parcels/${parcelId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentStatus: updateStatusVal,
          location: updateLocation,
          description: updateDescription
        })
      });
      if (res.ok) {
        setStatusUpdateOpen(null);
        setUpdateLocation('');
        setUpdateDescription('');
        fetchParcels();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Parcel Submit
  const handleCreateParcelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingParcel(true);

    try {
      const res = await fetch('/api/parcels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senderName: parcelSenderName,
          senderEmail: parcelSenderEmail,
          receiverName: parcelReceiverName,
          receiverEmail: parcelReceiverEmail,
          origin: parcelOrigin,
          destination: parcelDestination,
          currentStatus: parcelCurrentStatus,
          estimatedDelivery: parcelEstimatedDelivery,
          chooseServices: parcelChooseServices,
          historyLocation: parcelLocation,
          historyDescription: parcelDescription
        })
      });

      if (res.ok) {
        setParcelModalOpen(false);
        // Reset state
        setParcelSenderName('');
        setParcelSenderEmail('');
        setParcelReceiverName('');
        setParcelReceiverEmail('');
        setParcelOrigin('');
        setParcelDestination('');
        setParcelCurrentStatus('Registered');
        setParcelEstimatedDelivery('');
        setParcelLocation('');
        setParcelDescription('');
        fetchParcels();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create shipment');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingParcel(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      
      {/* ----------------- NAVBAR ----------------- */}
      {currentView !== 'home' && (
        <nav id="nav-delflow" className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo */}
              <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
                <DelflowLogo className="w-8 h-8 text-orange-500" />
              </div>

              {/* Navigation links - Desktop */}
              <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-medium">
                <button 
                  id="btn-nav-home" 
                  onClick={() => { setCurrentView('home'); setSelectedBlogId(null); }} 
                  className={`transition-colors py-1 ${currentView === 'home' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-300 hover:text-white'}`}>
                  Home
                </button>
                <button 
                  id="btn-nav-about" 
                  onClick={() => { setCurrentView('about'); setSelectedBlogId(null); }} 
                  className={`transition-colors py-1 ${currentView === 'about' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-300 hover:text-white'}`}>
                  About
                </button>
                <button 
                  id="btn-nav-services" 
                  onClick={() => { setCurrentView('services'); setSelectedBlogId(null); }} 
                  className={`transition-colors py-1 ${currentView === 'services' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-300 hover:text-white'}`}>
                  Services
                </button>
                <button 
                  id="btn-nav-blog" 
                  onClick={() => { setCurrentView('blog'); setSelectedBlogId(null); }} 
                  className={`transition-colors py-1 ${currentView === 'blog' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-300 hover:text-white'}`}>
                  Blog
                </button>
                <button 
                  id="btn-nav-contact" 
                  onClick={() => { setCurrentView('contact'); setSelectedBlogId(null); }} 
                  className={`transition-colors py-1 ${currentView === 'contact' ? 'text-orange-500 border-b-2 border-orange-500 font-bold' : 'text-slate-300 hover:text-white'}`}>
                  Contact
                </button>
                <button 
                  id="btn-nav-track" 
                  onClick={() => {
                    setSelectedBlogId(null);
                    const trackSection = document.getElementById('tracking-section');
                    if (trackSection) {
                      trackSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setCurrentView('home');
                      setTimeout(() => {
                        const el = document.getElementById('tracking-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }} 
                  className="transition-colors py-1 text-slate-300 hover:text-white">
                  Track
                </button>
              </div>

              {/* Quote Action button & Admin link */}
              <div className="hidden md:flex items-center space-x-4">
                {token && (
                  <button 
                    id="btn-admin-panel" 
                    onClick={() => setCurrentView('admin')} 
                    className={`text-xs px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${currentView === 'admin' ? 'bg-orange-600 text-white font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
                    <Lock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Admin Panel</span>
                  </button>
                )}
                
                <button 
                  id="btn-quote-header" 
                  onClick={() => {
                    setQuoteSubmitted(false);
                    const trackSection = document.getElementById('tracking-section');
                    if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
                    else setCurrentView('home');
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  Track Your Parcel
                </button>
              </div>

              {/* Mobile Hamburger Button */}
              <div className="md:hidden flex items-center space-x-2">
                {token && (
                  <button 
                    id="btn-admin-panel-mobile" 
                    onClick={() => setCurrentView('admin')} 
                    className="p-1.5 text-slate-400 hover:text-white">
                    <Lock className="w-5 h-5 text-orange-500" />
                  </button>
                )}
                <button 
                  id="btn-mobile-menu" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className="p-2 text-slate-400 hover:text-white">
                  <Menu className="w-6 h-6" />
                </button>
              </div>

            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div id="mobile-menu-container" className="md:hidden bg-slate-900 border-t border-slate-800 py-3 px-4 space-y-2">
              <button 
                onClick={() => { setCurrentView('home'); setSelectedBlogId(null); setMobileMenuOpen(false); }} 
                className="block w-full text-left py-2 px-3 rounded text-slate-300 hover:bg-slate-800 hover:text-white">
                Home
              </button>
              <button 
                onClick={() => { setCurrentView('about'); setSelectedBlogId(null); setMobileMenuOpen(false); }} 
                className="block w-full text-left py-2 px-3 rounded text-slate-300 hover:bg-slate-800 hover:text-white">
                About
              </button>
              <button 
                onClick={() => { setCurrentView('services'); setSelectedBlogId(null); setMobileMenuOpen(false); }} 
                className="block w-full text-left py-2 px-3 rounded text-slate-300 hover:bg-slate-800 hover:text-white">
                Services
              </button>
              <button 
                onClick={() => { setCurrentView('blog'); setSelectedBlogId(null); setMobileMenuOpen(false); }} 
                className="block w-full text-left py-2 px-3 rounded text-slate-300 hover:bg-slate-800 hover:text-white">
                Blog
              </button>
              <button 
                onClick={() => { setCurrentView('contact'); setSelectedBlogId(null); setMobileMenuOpen(false); }} 
                className="block w-full text-left py-2 px-3 rounded text-slate-300 hover:bg-slate-800 hover:text-white">
                Contact
              </button>
              <button 
                onClick={() => { 
                  setSelectedBlogId(null);
                  setMobileMenuOpen(false);
                  const trackSection = document.getElementById('tracking-section');
                  if (trackSection) {
                    trackSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCurrentView('home');
                    setTimeout(() => {
                      const el = document.getElementById('tracking-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }} 
                className="block w-full text-center py-2 rounded bg-orange-500 text-white font-semibold">
                Track
              </button>
            </div>
          )}
        </nav>
      )}

      {/* ----------------- CORE INTERFACES ----------------- */}
      <main className="flex-grow">
        
        {/* PUBLIC INTERFACE (No Auth Required) */}
        {currentView === 'home' && (
          <div id="public-landing-view">
            
            {/* 1. HERO SECTION */}
            <section id="hero-section" className="relative h-screen w-full bg-[#0B0D12] overflow-hidden">
              <div className="relative w-full h-full overflow-hidden bg-slate-900 flex flex-col justify-between">
                
                {/* Background Video */}
                <video
                  src="https://cdn.wanxai.com/wanx/3731175797956652942/image_to_video/bdc12385855248d99e47f36a0c354ef9.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Noise overlay */}
                <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none z-10" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />

                {/* Navbar Pill */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
                  <div className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-3 md:px-8 md:py-4 flex items-center justify-center gap-3 sm:gap-6 md:gap-12 lg:gap-14 shadow-2xl border-x border-b border-white/10">
                    {[
                      { label: 'Home', action: 'home' },
                      { label: 'About', action: 'about' },
                      { label: 'Services', action: 'services' },
                      { label: 'Blog', action: 'blog' },
                      { label: 'Contact', action: 'contact' },
                      { label: 'Track', action: 'tracking' }
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setSelectedBlogId(null);
                          if (item.action === 'home') {
                            setCurrentView('home');
                          } else if (item.action === 'about') {
                            setCurrentView('about');
                          } else if (item.action === 'services') {
                            setCurrentView('services');
                          } else if (item.action === 'blog') {
                            setCurrentView('blog');
                          } else if (item.action === 'contact') {
                            setCurrentView('contact');
                          } else {
                            const trackSection = document.getElementById('tracking-section');
                            if (trackSection) {
                              trackSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                        className="text-[10px] sm:text-xs md:text-sm font-medium tracking-wide transition-colors hover:text-[#E1E0CC] cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Content (bottom-aligned) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 pb-8 sm:pb-12 md:pb-16 z-20 w-full">
                  <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-end">
                    
                    {/* Left 8 columns: Heading */}
                    <div className="col-span-1 md:col-span-8 flex items-end">
                      <WordsPullUp 
                        text="Delflow" 
                        className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[18vw] font-medium leading-[0.85] tracking-[-0.07em]" 
                      />
                    </div>

                    {/* Right 4 columns: Text + Button */}
                    <div className="col-span-1 md:col-span-4 space-y-4 sm:space-y-6 text-left">
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.5,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        style={{ color: 'rgba(225, 224, 204, 0.7)' }}
                        className="text-xs sm:text-sm md:text-base leading-[1.2]"
                      >
                        Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.7,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      >
                        <button
                          onClick={() => {
                            const trackSection = document.getElementById('tracking-section');
                            if (trackSection) {
                              trackSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          style={{ backgroundColor: '#E1E0CC' }}
                          className="group inline-flex items-center gap-2 hover:gap-3 bg-primary text-black font-medium text-sm sm:text-base pl-6 pr-1.5 py-1.5 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
                        >
                          <span>Track Shipment</span>
                          <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <ArrowRight className="w-4 h-4 text-[#E1E0CC]" />
                          </div>
                        </button>
                      </motion.div>
                    </div>

                  </div>
                </div>

              </div>
            </section>


            {/* 2. SERVICES SECTION ("We Are Optimists Who Love To Work Together") */}
            <section id="services-section" className="bg-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Title */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Capabilities</span>
                  <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.05em] text-slate-900 leading-tight">
                    We Are Optimists Who Love To Work Together.
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-[1.2]">
                    Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                  </p>
                </div>

                {/* 4-Column Grid of Service Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  
                  {/* Road Transport */}
                  <div id="service-card-road" className="group bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://i.pinimg.com/736x/73/79/ed/7379ed2cab8e357793330c6311284d75.jpg" 
                        alt="Road Transport" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlapping circle icon */}
                      <div className="absolute -bottom-6 left-6 bg-slate-900 text-white p-3 rounded-full border-4 border-white shadow-md z-10">
                        <Truck className="w-5 h-5 text-orange-500" />
                      </div>
                    </div>
                    
                    <div className="p-6 pt-10 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-900">Road Transport</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Flexible and fast delivery systems for land. We handle regional full-truckload (FTL) and less-than-truckload (LTL) freights perfectly.
                        </p>
                      </div>
                      <button 
                        onClick={() => { setSelectedServiceDetail('road'); setCurrentView('service-detail'); }} 
                        className="inline-flex items-center text-xs font-bold text-orange-500 hover:text-orange-600 group-hover:underline">
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Ocean Freight */}
                  <div id="service-card-ocean" className="group bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=400&auto=format&fit=crop" 
                        alt="Ocean Freight" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlapping circle icon */}
                      <div className="absolute -bottom-6 left-6 bg-slate-900 text-white p-3 rounded-full border-4 border-white shadow-md z-10">
                        <Ship className="w-5 h-5 text-orange-500" />
                      </div>
                    </div>
                    
                    <div className="p-6 pt-10 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-900">Ocean Freight</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Worldwide cargo distribution via major ports. Cost-efficient containerized cargo management for massive intercontinental freights.
                        </p>
                      </div>
                      <button 
                        onClick={() => { setSelectedServiceDetail('ocean'); setCurrentView('service-detail'); }} 
                        className="inline-flex items-center text-xs font-bold text-orange-500 hover:text-orange-600 group-hover:underline">
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Train Freight */}
                  <div id="service-card-train" className="group bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=400&auto=format&fit=crop" 
                        alt="Train Freight" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlapping circle icon */}
                      <div className="absolute -bottom-6 left-6 bg-slate-900 text-white p-3 rounded-full border-4 border-white shadow-md z-10">
                        <Train className="w-5 h-5 text-orange-500" />
                      </div>
                    </div>
                    
                    <div className="p-6 pt-10 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-900">Train Freight</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Environmentally conscious and robust railway shipment. The perfect link connecting logistics terminals and industrial warehouses.
                        </p>
                      </div>
                      <button 
                        onClick={() => { setSelectedServiceDetail('train'); setCurrentView('service-detail'); }} 
                        className="inline-flex items-center text-xs font-bold text-orange-500 hover:text-orange-600 group-hover:underline">
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Air Freight */}
                  <div id="service-card-air" className="group bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop" 
                        alt="Air Freight" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlapping circle icon */}
                      <div className="absolute -bottom-6 left-6 bg-slate-900 text-white p-3 rounded-full border-4 border-white shadow-md z-10">
                        <Plane className="w-5 h-5 text-orange-500" />
                      </div>
                    </div>
                    
                    <div className="p-6 pt-10 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-900">Air Freight</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          High-priority express global flight delivery. Safe, speedy and highly reliable distribution of critical lightweight parcels.
                        </p>
                      </div>
                      <button 
                        onClick={() => { setSelectedServiceDetail('air'); setCurrentView('service-detail'); }} 
                        className="inline-flex items-center text-xs font-bold text-orange-500 hover:text-orange-600 group-hover:underline">
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* 3. TRACKING & QUOTE SECTION ("We Provide Full Range Of Transportation") */}
            <section id="tracking-section" className="relative bg-slate-900 text-white py-24 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85)), url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop")' }}>
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center">
                
                {/* Left Side Info */}
                <div className="md:col-span-6 space-y-6">
                  <span className="text-orange-400 font-bold uppercase tracking-wider text-xs">Full Range of Services</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.05em] text-white leading-tight">
                    We Provide Full Range <br/>Of Transportation.
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-[1.2] max-w-lg">
                    Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                  </p>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start space-x-3">
                      <div className="bg-orange-500/15 text-orange-400 p-2 rounded-lg border border-orange-500/20">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Full-Carrier Network</h4>
                        <p className="text-xs text-slate-400">Road, sea, train, and air logistics are seamlessly synchronized.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-orange-500/15 text-orange-400 p-2 rounded-lg border border-orange-500/20">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Real-Time Dispatch</h4>
                        <p className="text-xs text-slate-400">Timestamps and status updates synchronize with zero lag.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Tracking Input or Visual Timeline Stepper (The overlapping card) */}
                <div className="md:col-span-6">
                  <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative z-10">
                    
                    {!trackingResult ? (
                      // 3.1 FORM VIEW
                      <form id="form-tracking" onSubmit={handleTrackShipment} className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="text-xl font-extrabold text-slate-900">Track Your Shipment</h3>
                          <p className="text-xs text-slate-500">Enter your custom tracking code to receive instant shipping milestones.</p>
                        </div>

                        {trackingError && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-center space-x-1.5">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>{trackingError}</span>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Shipment Code</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Search className="w-4 h-4" />
                              </span>
                              <input 
                                id="input-tracking-code"
                                type="text" 
                                required
                                placeholder="e.g. DF-874291" 
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm placeholder-slate-400"
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Try the demo shipment code: <span className="font-semibold text-slate-600">DF-874291</span></p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Choose Services</label>
                            <select 
                              id="select-tracking-service"
                              value={trackingService}
                              onChange={(e) => setTrackingService(e.target.value)}
                              className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-slate-700 bg-white">
                              <option>Road Transport</option>
                              <option>Ocean Freight</option>
                              <option>Train Freight</option>
                              <option>Air Freight</option>
                            </select>
                          </div>
                        </div>

                        <button 
                          id="btn-track-now"
                          type="submit"
                          disabled={trackingLoading}
                          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3.5 px-4 rounded-lg shadow-md hover:shadow-orange-500/10 transition-all flex items-center justify-center space-x-2">
                          {trackingLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Locating Parcel...</span>
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4" />
                              <span>Track Now</span>
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      // 3.2 TIMELINE STEPPER VIEW (Successfully tracked)
                      <div id="tracking-timeline-view" className="space-y-6">
                        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                          <div>
                            <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">
                              {trackingResult.parcel.chooseServices}
                            </span>
                            <h3 className="text-lg font-black text-slate-900 mt-1">
                              {trackingResult.parcel.trackingNumber}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Estimated Delivery: <span className="font-semibold text-slate-700">{trackingResult.parcel.estimatedDelivery}</span>
                            </p>
                          </div>
                          <button 
                            id="btn-tracking-reset"
                            onClick={() => { setTrackingResult(null); setTrackingCode(''); }}
                            className="text-slate-400 hover:text-slate-600 p-1 bg-slate-100 hover:bg-slate-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Shipment Quick Info Panel */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                          <div>
                            <p className="text-slate-400 uppercase font-bold text-[10px]">Origin</p>
                            <p className="font-semibold text-slate-800">{trackingResult.parcel.origin}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Sender: {trackingResult.parcel.senderName}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 uppercase font-bold text-[10px]">Destination</p>
                            <p className="font-semibold text-slate-800">{trackingResult.parcel.destination}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Receiver: {trackingResult.parcel.receiverName}</p>
                          </div>
                        </div>

                        {/* Visual Step Timeline */}
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Transit Checkpoints</p>
                          
                          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                            {trackingResult.history.map((step: any, index: number) => {
                              const isLatest = index === 0;
                              return (
                                <div key={step.id} className="relative text-sm">
                                  {/* Dot */}
                                  <span className={`absolute -left-[20px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${isLatest ? 'bg-orange-500 border-orange-200 animate-pulse scale-110' : 'bg-slate-300 border-white'}`}></span>
                                  
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className={`font-bold ${isLatest ? 'text-orange-500' : 'text-slate-800'}`}>
                                        {step.status}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(step.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">{step.location}</p>
                                    <p className="text-xs text-slate-600 mt-1 italic">{step.description}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <button 
                          id="btn-track-another"
                          onClick={() => { setTrackingResult(null); setTrackingCode(''); }}
                          className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg text-xs transition-colors">
                          Track Another Shipment
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </section>


            {/* BRANDS BAR (Matches Template logo banner) */}
            <section className="bg-slate-100 py-10 border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">2500+ Customer Worldwide</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
                  <span className="text-lg font-black tracking-tight text-slate-800">TRUCKING</span>
                  <span className="text-lg font-black tracking-tight text-slate-800">Mondi</span>
                  <span className="text-lg font-black tracking-tight text-slate-800">Duragas</span>
                  <span className="text-lg font-black tracking-tight text-slate-800">TravelGood</span>
                  <span className="text-lg font-black tracking-tight text-slate-800">Logistics</span>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ----------------- ABOUT US VIEW ----------------- */}
        {currentView === 'about' && (
          <div id="about-us-view" className="py-16 bg-white animate-fadeIn">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Who We Are</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.05em] text-slate-900 leading-tight">About Delflow Shipping</h2>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-[1.2]">
                  Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                </p>
              </div>

              {/* Interactive Global Transit Map */}
              <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5 gap-4 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Interactive Global Transit Network</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Select or click on any shipping terminal node to view real-time fleet activity and processing logs.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {GLOBAL_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        onClick={() => setActiveHub(hub)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg transition-all ${activeHub.name === hub.name ? 'bg-orange-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                      >
                        {hub.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Styled Interactive SVG Map Canvas */}
                  <div className="lg:col-span-8 relative bg-slate-950/80 border border-slate-800/60 rounded-xl h-[300px] sm:h-[350px] overflow-hidden select-none">
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 800 450" fill="none">
                      {/* Grid background */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Global routes as bezier curves */}
                      <path d="M 200 157 Q 300 100 384 126" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                      <path d="M 384 126 Q 440 150 496 189" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                      <path d="M 496 189 Q 580 180 656 180" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                      <path d="M 656 180 Q 650 220 640 261" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                      <path d="M 200 157 Q 400 300 640 261" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5" />
                    </svg>

                    {/* Markers */}
                    {GLOBAL_HUBS.map((hub) => {
                      const isActive = activeHub.name === hub.name;
                      return (
                        <button
                          key={hub.name}
                          onClick={() => setActiveHub(hub)}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all"
                          style={{ left: hub.x, top: hub.y }}
                        >
                          {/* Pulsing glow for active hub */}
                          {isActive && (
                            <span className="absolute -inset-4 rounded-full bg-orange-500/20 animate-ping pointer-events-none" />
                          )}
                          <span className={`block w-3.5 h-3.5 rounded-full border-2 transition-transform duration-300 ${isActive ? 'bg-orange-500 border-white scale-125' : 'bg-slate-800 border-slate-500 group-hover:bg-orange-400 group-hover:scale-110'}`} />
                          
                          {/* Code tooltip label */}
                          <span className={`absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors ${isActive ? 'bg-orange-500 text-white' : 'bg-slate-950 text-slate-400'}`}>
                            {hub.code}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Hub Details Panel */}
                  <div className="lg:col-span-4 bg-slate-950 border border-slate-800/60 p-5 rounded-xl space-y-5">
                    <div className="border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        {activeHub.country}
                      </span>
                      <h4 className="text-lg font-bold mt-0.5">{activeHub.name}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/30">
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Avg Processing</span>
                        <p className="text-sm font-bold text-white mt-1">{activeHub.processing}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/30">
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Active Fleet</span>
                        <p className="text-sm font-bold text-white mt-1">{activeHub.fleet} Carriers</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-2">
                      <p className="font-semibold text-slate-300">Terminal Operational Details:</p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                        <li>Dynamic pre-clearance with local customs</li>
                        <li>Automated sorters handling {activeHub.code === 'JFK' ? '50,000+' : '25,000+'} parcels/day</li>
                        <li>Direct ocean and air freight channels active</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center pt-6">
                <div>
                  <img 
                    src="https://i.pinimg.com/736x/73/79/ed/7379ed2cab8e357793330c6311284d75.jpg" 
                    alt="Warehouse Logistics" 
                    className="rounded-xl shadow-lg object-cover h-[350px] w-full"
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">Our Core Vision</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    We believe the backbone of international retail and industrial growth lies in frictionless logistics. Our mission is to combine automated real-time tracking pipelines with reliable transport carriers to give shippers supreme comfort.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg">
                      <p className="text-3xl font-black text-orange-500">100%</p>
                      <p className="text-xs text-slate-500 font-bold mt-1 uppercase">Transparency</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg">
                      <p className="text-3xl font-black text-slate-900">15M+</p>
                      <p className="text-xs text-slate-500 font-bold mt-1 uppercase">Parcels Sent</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="border-t border-slate-100 pt-12 space-y-8">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Questions & Answers</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.05em] text-slate-900 leading-tight">About Delflow FAQs</h2>
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-[1.2]">
                    Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                  {[
                    {
                      q: "What makes Delflow's global network unique?",
                      a: "Delflow operates with 5 major interconnected hubs (New York, Rotterdam, Dubai, Shanghai, Singapore) spanning across 140+ countries, coupled with automated pre-clearance protocols and real-time AI-powered IoT telemetry to prevent customs hold-ups."
                    },
                    {
                      q: "How does Delflow manage end-to-end transparency?",
                      a: "Every shipment receives continuous tracking updates. Customers get high-accuracy ETAs, real-time sensor readings (including location and status logs), and instant digital receipts."
                    },
                    {
                      q: "Can I trust Delflow with high-value industrial or fragile cargo?",
                      a: "Absolutely. We employ dedicated logistics coordinators, secure tamper-proof seals, and custom climate-controlled container routing with live security audits for peace of mind."
                    }
                  ].map((faq, idx) => {
                    const isOpen = aboutFaqOpen === idx;
                    return (
                      <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                        <button
                          onClick={() => setAboutFaqOpen(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 text-sm sm:text-base hover:text-orange-500 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                        </button>
                        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-100' : 'max-h-0'}`}>
                          <p className="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SERVICES CATALOG VIEW ----------------- */}
        {currentView === 'services' && (
          <div id="services-catalog-view" className="py-16 bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Our Solutions</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.05em] text-slate-900 leading-tight">What We Offer</h2>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-[1.2]">
                  Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div className="bg-orange-500/10 text-orange-600 p-3 rounded-lg w-fit">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Premium Road Transport</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Door-to-door domestic trucking solutions utilizing temperature-monitored smart containers. Features state-of-the-art security seals and computerized logging checkpoints.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div className="bg-orange-500/10 text-orange-600 p-3 rounded-lg w-fit">
                    <Ship className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Global Ocean Cargo</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Reliable intercontinental sea freight matching full container load (FCL) and consolidated part-cargo (LCL) programs across major ports globally.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div className="bg-orange-500/10 text-orange-600 p-3 rounded-lg w-fit">
                    <Train className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Continental Railway Logistics</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    High-efficiency train freight connecting primary industrial belts. Provides an eco-friendly transport pipeline with strict time management.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div className="bg-orange-500/10 text-orange-600 p-3 rounded-lg w-fit">
                    <Plane className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">International Air Dispatch</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Top-tier urgent aviation shipping programs. Flight arrangements, customs clearance, and high security priority are managed dynamically.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="border-t border-slate-200 pt-12 space-y-8">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Questions & Answers</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.05em] text-slate-900 leading-tight">Services & Logistics FAQs</h2>
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-[1.2]">
                    Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                  {[
                    {
                      q: "How do I determine the best shipping method for my business?",
                      a: "Our team offers custom dispatch evaluations. Typically, Air Dispatch is best for urgent payloads, while Ocean or Railway freight suits high-volume cost efficiency. Road transport is perfect for final-mile regional distribution."
                    },
                    {
                      q: "What is included in Delflow's customs pre-clearance service?",
                      a: "We electronically pre-classify items with correct HS codes and transmit packing manifests to border control authorities while your cargo is in transit, facilitating instant release upon arrival."
                    },
                    {
                      q: "Are there weight or size limitations on freight shipments?",
                      a: "We handle everything from standard parcel delivery to multi-ton heavy industrial cargo. Full Container (FCL) and Less than Container (LCL) programs can be tailored dynamically."
                    }
                  ].map((faq, idx) => {
                    const isOpen = servicesFaqOpen === idx;
                    return (
                      <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => setServicesFaqOpen(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 text-sm sm:text-base hover:text-orange-500 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                        </button>
                        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-100' : 'max-h-0'}`}>
                          <p className="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SERVICE DETAIL VIEW ----------------- */}
        {currentView === 'service-detail' && (() => {
          const detail = SERVICE_DETAILS_DATA[selectedServiceDetail || 'road'];
          const ServiceIcon = detail.icon;
          return (
            <div id="service-detail-view" className="py-16 bg-slate-50 animate-fadeIn min-h-[70vh]">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Breadcrumbs and navigation */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <button onClick={() => setCurrentView('home')} className="hover:text-orange-500 transition-colors">Home</button>
                    <span>/</span>
                    <button onClick={() => { setSelectedServiceDetail(null); setCurrentView('services'); }} className="hover:text-orange-500 transition-colors">Services</button>
                    <span>/</span>
                    <span className="font-semibold text-slate-800">{detail.title}</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // Lead back to home page with design coherence
                      setCurrentView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Home Landing</span>
                  </button>
                </div>

                {/* Hero Layout */}
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Comprehensive information */}
                  <div className="md:col-span-7 space-y-8">
                    <div className="space-y-4">
                      <span className="inline-block px-3 py-1 rounded bg-orange-500/10 text-orange-600 font-bold uppercase tracking-wider text-[10px]">
                        {detail.category}
                      </span>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                        {detail.title}
                      </h1>
                      <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-4 bg-orange-500/5 py-2 rounded-r">
                        "{detail.tagline}"
                      </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-64 sm:h-80">
                      <img 
                        src={detail.image} 
                        alt={detail.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-slate-900 text-white p-3 rounded-full border border-slate-800 shadow-md">
                        <ServiceIcon className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>

                    <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                      <p>{detail.description}</p>
                      <p>
                        With Delflow's extensive worldwide reach, we ensure zero frictional delays and maximum cost efficiency. All operations are backed by seasoned logistics experts, high-frequency carrier partnerships, and pre-clearance custom networks, ensuring predictable, high-speed regional or global transit times.
                      </p>
                    </div>

                    {/* Operational Highlights */}
                    <div className="space-y-6 pt-4 border-t border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-orange-500" />
                        <span>Core Operational Highlights</span>
                      </h3>
                      
                      <div className="grid gap-6">
                        {detail.highlights.map((h, i) => (
                          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 flex items-center space-x-2">
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-black">{i + 1}</span>
                              <span>{h.title}</span>
                            </h4>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-7">
                              {h.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Specification Card and interactive Quote Request */}
                  <div className="md:col-span-5 space-y-6 lg:sticky lg:top-24">
                    
                    {/* Performance Specifications Card */}
                    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-orange-400">Operational Standard Specs</h3>
                        <p className="text-[10px] text-slate-400">Official technical baselines and capacity metrics.</p>
                      </div>

                      <div className="divide-y divide-slate-800">
                        <div className="py-3 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Weight Capacity</span>
                          <span className="font-semibold text-slate-200 text-right max-w-[180px]">{detail.technicalSpecs.weightLimit}</span>
                        </div>
                        <div className="py-3 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Security Standard</span>
                          <span className="font-semibold text-slate-200 text-right max-w-[180px]">{detail.technicalSpecs.securityStandard}</span>
                        </div>
                        <div className="py-3 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Temp Regulation</span>
                          <span className="font-semibold text-slate-200 text-right max-w-[180px]">{detail.technicalSpecs.temperatureRange}</span>
                        </div>
                        <div className="py-3 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Recommended For</span>
                          <span className="font-semibold text-slate-200 text-right max-w-[180px]">{detail.technicalSpecs.idealFor}</span>
                        </div>
                      </div>

                      {/* Stats Badges */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {detail.stats.map((s, idx) => (
                          <div key={idx} className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-center space-y-0.5">
                            <span className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-500">{s.label}</span>
                            <span className="block text-xs font-extrabold text-orange-400">{s.value}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Integrated CTA Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4 text-center">
                      <h3 className="text-base font-bold text-slate-900">Need immediate transit options?</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Get automated quotes, route optimizations, and priority booking within minutes. Our staff is standing by.
                      </p>
                      <button 
                        onClick={() => {
                          setCurrentView('contact');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-colors block text-center cursor-pointer"
                      >
                        Request Quote for {detail.title}
                      </button>
                    </div>

                    {/* Quick navigation to other services */}
                    <div className="bg-slate-100 rounded-xl p-5 border border-slate-200/60 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Explore Other Services</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(SERVICE_DETAILS_DATA)
                          .filter(([key]) => key !== selectedServiceDetail)
                          .map(([key, value]) => (
                            <button
                              key={key}
                              onClick={() => {
                                setSelectedServiceDetail(key as any);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-left p-2.5 bg-white border border-slate-200 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors truncate font-semibold text-slate-700 cursor-pointer"
                            >
                              {value.title}
                            </button>
                          ))
                        }
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          );
        })()}

        {/* ----------------- BLOG VIEW ----------------- */}
        {currentView === 'blog' && (
          <div id="blog-view" className="py-16 bg-white animate-fadeIn">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              {!selectedBlogId ? (
                <>
                  <div className="text-center max-w-3xl mx-auto space-y-4">
                    <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Logistics Insights</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.05em] text-slate-900 leading-tight">Industry News & Knowledge</h2>
                    <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-[1.2]">
                      Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                      <div 
                        key={post.id}
                        onClick={() => setSelectedBlogId(post.id)}
                        className="group border border-slate-150 rounded-xl overflow-hidden hover:shadow-xl hover:border-orange-500/20 transition-all duration-300 cursor-pointer flex flex-col h-full bg-slate-50/50"
                      >
                        <div className="overflow-hidden relative h-48 w-full bg-slate-100">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-fadeIn" 
                          />
                        </div>
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <span className="text-[10px] bg-orange-500/10 text-orange-600 font-bold uppercase px-2 py-1 rounded-md">
                              {post.category}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                            <span>{post.date}</span>
                            <span className="font-medium text-orange-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read Article <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                (() => {
                  const post = BLOG_POSTS.find(p => p.id === selectedBlogId);
                  if (!post) {
                    setSelectedBlogId(null);
                    return null;
                  }
                  const otherPosts = BLOG_POSTS.filter(p => p.id !== selectedBlogId);

                  return (
                    <div className="space-y-10 animate-fadeIn">
                      {/* Back Button */}
                      <button
                        onClick={() => setSelectedBlogId(null)}
                        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-wider bg-slate-100 hover:bg-orange-50 px-3 py-2 rounded-lg"
                      >
                        <ChevronRight className="w-4 h-4 mr-1.5 rotate-180" /> Back to Articles
                      </button>

                      {/* Article Layout */}
                      <div className="grid lg:grid-cols-12 gap-12">
                        
                        {/* Main Body */}
                        <article className="lg:col-span-8 space-y-8">
                          <div className="space-y-4">
                            <span className="text-xs bg-orange-500/10 text-orange-600 font-bold uppercase px-2.5 py-1 rounded-md">
                              {post.category}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                              {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3">
                              <div>
                                <span className="font-semibold text-slate-700">Author:</span> {post.author}
                              </div>
                              <div className="w-1 h-1 bg-slate-300 rounded-full" />
                              <div>
                                <span className="font-semibold text-slate-700">Published:</span> {post.date}
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/9] w-full bg-slate-50">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover animate-fadeIn" />
                          </div>

                          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-6">
                            {post.content.map((p, idx) => (
                              <p key={idx} className="font-normal text-slate-700 leading-relaxed">
                                {p}
                              </p>
                            ))}
                          </div>
                        </article>

                        {/* Sidebar / Recommended Articles */}
                        <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            Recommended Reads
                          </h3>
                          <div className="space-y-6">
                            {otherPosts.map((other) => (
                              <div 
                                key={other.id}
                                onClick={() => setSelectedBlogId(other.id)}
                                className="group cursor-pointer space-y-2.5 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300"
                              >
                                <div className="h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                                  <img src={other.image} alt={other.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-orange-500 uppercase">
                                    {other.category}
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors">
                                    {other.title}
                                  </h4>
                                </div>
                              </div>
                            ))}
                          </div>
                        </aside>

                      </div>
                    </div>
                  );
                })()
              )}

            </div>
          </div>
        )}

        {/* ----------------- CONTACT US VIEW ----------------- */}
        {currentView === 'contact' && (
          <div id="contact-us-view" className="py-16 bg-slate-50 animate-fadeIn">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Get In Touch</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.05em] text-slate-900 leading-tight">Contact Our Global Network</h2>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-[1.2]">
                  Delflow coordinates intercontinental shipping, smart warehousing, and end-to-end distribution with zero frictional overhead and total tracking transparency.
                </p>
              </div>

              {/* Grid: Info Left, Form Right */}
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Side: Info & Q&A */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Address, Phone, Email Cards */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Corporate Offices</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3.5">
                        <div className="bg-orange-500/10 text-orange-600 p-2.5 rounded-lg mt-0.5">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</p>
                          <p className="text-sm text-slate-700 font-medium mt-0.5">
                            900 Wilshire Blvd, Los Angeles, CA 90017
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <div className="bg-orange-500/10 text-orange-600 p-2.5 rounded-lg mt-0.5">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Hotline</p>
                          <p className="text-sm text-slate-700 font-medium mt-0.5">
                            +1 (800) 555-FLOW <span className="text-xs text-slate-400 font-normal">(9am - 6pm PST)</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <div className="bg-orange-500/10 text-orange-600 p-2.5 rounded-lg mt-0.5">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Support</p>
                          <p className="text-sm text-slate-700 font-medium mt-0.5">
                            delflow_logistics@protonmail.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ block specific to inquiries */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Quick Inquiry FAQs</h3>
                    
                    <div className="space-y-3">
                      {[
                        {
                          q: "How fast do you reply?",
                          a: "Our support coordinators operate 24/7. Live chat queries are resolved within 5 minutes, and email forms within 2 hours."
                        },
                        {
                          q: "Where can I request a heavy-cargo quote?",
                          a: "For multi-ton shipments, please use our comprehensive Quote Generator on the home page or contact our dedicated enterprise dispatch unit directly at pricing@delflow.com."
                        },
                        {
                          q: "Can I schedule a voice call with an agent?",
                          a: "Yes, once you fill out the contact form, our logistics directors can schedule a tailored consultation via Google Meet or Phone."
                        }
                      ].map((faq, idx) => {
                        const isOpen = contactFaqOpen === idx;
                        return (
                          <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                            <button
                              onClick={() => setContactFaqOpen(isOpen ? null : idx)}
                              className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-900 text-xs sm:text-sm hover:text-orange-500 transition-colors"
                            >
                              <span>{faq.q}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-100' : 'max-h-0'}`}>
                              <p className="p-4 text-xs text-slate-600 leading-relaxed bg-white">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Side: Contact Form */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-150 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Send Us an Inquiry</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Our dispatch team monitors incoming inquiries 24/7 at <span className="font-semibold text-slate-700">delflow_logistics@protonmail.com</span>. Fill out the details below to submit a formal request.
                    </p>
                  </div>

                  {contactSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center space-y-4 py-12 animate-fadeIn">
                      <div className="bg-emerald-500 text-white p-3 rounded-full w-fit mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-emerald-900">Inquiry Sent Successfully!</h4>
                        <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                          Thank you for contacting Delflow, <strong>{contactName}</strong>. Your inquiry <strong>"{contactSubject}"</strong> has been directed to <strong>delflow_logistics@protonmail.com</strong>. Our logistics coordinators will reach out to you at <strong>{contactEmail}</strong> within 2 hours.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactName('');
                          setContactEmail('');
                          setContactCompany('');
                          setContactSubject('');
                          setContactMessage('');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (contactName && contactEmail && contactSubject && contactMessage) {
                          setContactSubmitted(true);
                        }
                      }}
                      className="space-y-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Your Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Sarah Connor"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="e.g. sarah@cyberdyne.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Company / Organization</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Cyberdyne Systems"
                            value={contactCompany}
                            onChange={(e) => setContactCompany(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Subject *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Heavy Cargo Freight Quote"
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Your Message *</label>
                        <textarea 
                          rows={6}
                          required
                          placeholder="Please write down details about your shipping inquiry, cargo specifications, origins, and destinations..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-[10px] text-slate-400">
                          * Indicates required fields.
                        </p>
                        <button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-3 rounded-lg shadow-md hover:shadow-orange-500/10 transition-all flex items-center space-x-1.5 group"
                        >
                          <span>Send Inquiry Message</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </form>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}

        {/* ----------------- SECURE ADMIN PANEL ----------------- */}
        {currentView === 'admin' && (
          <div id="admin-panel-view" className="bg-slate-900 text-white min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
            
            {!token ? (
              // 4.1 AUTHENTICATION GATE
              <div id="admin-auth-container" className="w-full max-w-md mx-auto my-16 p-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
                
                {/* Logo & Title */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <DelflowLogo className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Staff Secure Access</h3>
                  <p className="text-xs text-slate-400">
                    {isFirstAdmin 
                      ? 'No users exist. Securely register to bootstrap the Super Admin role.' 
                      : 'Authenticate with your authorized credentials to manage Delflow logistics.'}
                  </p>
                </div>

                {isFirstAdmin && (
                  <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-xs text-orange-400 flex items-start space-x-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">First Admin Setup Active</p>
                      <p className="text-[10px] opacity-90 mt-0.5">The first account registered will automatically receive the **Super Admin** role.</p>
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {authError && (
                  <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                <form id="form-admin-auth" onSubmit={handleAuthSubmit} className="space-y-4 text-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                    <input 
                      id="input-auth-email"
                      type="email" 
                      required
                      placeholder="name@delflow.com" 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-lg px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                    <input 
                      id="input-auth-password"
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-lg px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <button 
                    id="btn-auth-submit"
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md transition-all text-sm mt-2">
                    {isFirstAdmin ? 'Register Super Admin' : 'Secure Login'}
                  </button>
                </form>
 
                {!isFirstAdmin && (
                  <div className="text-center pt-2">
                    <p className="text-[10.5px] text-slate-500 font-medium">
                      Public registration is disabled. Please contact your Super Admin to be granted staff access.
                    </p>
                  </div>
                )}

              </div>
            ) : (
              // 4.2 ADMIN DASHBOARD PANEL (Authenticated)
              <div id="admin-dashboard-container" className="flex flex-col md:flex-row w-full min-h-[calc(100vh-4rem)]">
                
                {/* 1. MOBILE TOP ADMIN BAR (Only on Mobile) */}
                <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between z-10 sticky top-16">
                  <div className="flex items-center space-x-3">
                    <span className="bg-orange-500 p-2 rounded-lg text-white">
                      {adminTab === 'dashboard' && <LayoutDashboard className="w-4 h-4" />}
                      {adminTab === 'parcels' && <Package className="w-4 h-4" />}
                      {adminTab === 'chat' && <MessageSquare className="w-4 h-4" />}
                      {adminTab === 'roles' && <Users className="w-4 h-4" />}
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Portal</p>
                      <h3 className="text-sm font-bold text-white capitalize">
                        {adminTab === 'roles' ? 'Staff Management' : adminTab === 'parcels' ? 'Shipments' : adminTab}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAdminMenuOpenMobile(!adminMenuOpenMobile)}
                    className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-300 transition-colors"
                  >
                    <span>Menu</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${adminMenuOpenMobile ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* MOBILE SIDE NAV DROPDOWN PANEL */}
                {adminMenuOpenMobile && (
                  <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2 animate-fadeIn z-10 sticky top-[73px]">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2 mb-1">Switch View</p>
                    
                    <button 
                      onClick={() => { setAdminTab('dashboard'); setAdminMenuOpenMobile(false); }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${adminTab === 'dashboard' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard Overview</span>
                    </button>

                    <button 
                      onClick={() => { setAdminTab('parcels'); setAdminMenuOpenMobile(false); }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${adminTab === 'parcels' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
                      <Package className="w-4 h-4" />
                      <span>Shipments (Parcels)</span>
                    </button>

                    <button 
                      onClick={() => { setAdminTab('chat'); setAdminMenuOpenMobile(false); }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${adminTab === 'chat' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
                      <MessageSquare className="w-4 h-4" />
                      <span>Support Chats</span>
                      {stats.pendingChats > 0 && (
                        <span className="ml-auto bg-orange-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                          {stats.pendingChats} pending
                        </span>
                      )}
                    </button>

                    {user?.role === 'Super Admin' && (
                      <button 
                        onClick={() => { setAdminTab('roles'); setAdminMenuOpenMobile(false); }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${adminTab === 'roles' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
                        <Users className="w-4 h-4" />
                        <span>Staff Management</span>
                      </button>
                    )}

                    <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        Logged in: <span className="font-semibold text-slate-200">{user?.email}</span>
                      </div>
                      <button 
                        onClick={() => { setAdminMenuOpenMobile(false); logout(); }}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-red-400 bg-red-950/20 hover:bg-red-950/40 transition-colors">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. DESKTOP ADMIN SIDEBAR (Collapsible, hidden on mobile) */}
                <aside 
                  id="admin-sidebar" 
                  className={`hidden md:flex flex-col justify-between bg-slate-950 border-r border-slate-800 p-6 transition-all duration-300 ${
                    adminSidebarCollapsedDesktop ? 'w-20' : 'w-64'
                  }`}
                >
                  <div className="space-y-8">
                    
                    {/* User Profile Info */}
                    <div className={`flex items-center pb-6 border-b border-slate-800 ${
                      adminSidebarCollapsedDesktop ? 'justify-center' : 'space-x-3'
                    }`}>
                      <div className="bg-orange-500 p-2.5 rounded-full text-white flex-shrink-0">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      {!adminSidebarCollapsedDesktop && (
                        <div className="overflow-hidden animate-fadeIn">
                          <p className="text-xs font-bold text-slate-400 truncate">{user?.email}</p>
                          <p className="text-[10px] text-orange-400 font-extrabold uppercase mt-0.5 tracking-wider">
                            {user?.role}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Navigation tabs */}
                    <div className="space-y-1.5">
                      {!adminSidebarCollapsedDesktop && (
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-3 mb-2 animate-fadeIn">
                          Navigation
                        </p>
                      )}
                      
                      <button 
                        onClick={() => setAdminTab('dashboard')}
                        title="Dashboard"
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          adminSidebarCollapsedDesktop ? 'justify-center' : 'space-x-3'
                        } ${
                          adminTab === 'dashboard' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                        {!adminSidebarCollapsedDesktop && <span className="animate-fadeIn">Dashboard</span>}
                      </button>

                      <button 
                        onClick={() => setAdminTab('parcels')}
                        title="Shipments"
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          adminSidebarCollapsedDesktop ? 'justify-center' : 'space-x-3'
                        } ${
                          adminTab === 'parcels' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <Package className="w-4 h-4 flex-shrink-0" />
                        {!adminSidebarCollapsedDesktop && <span className="animate-fadeIn">Shipments</span>}
                      </button>

                      <button 
                        onClick={() => setAdminTab('chat')}
                        title="Support Chats"
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          adminSidebarCollapsedDesktop ? 'justify-center' : 'space-x-3'
                        } ${
                          adminTab === 'chat' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <div className="relative">
                          <MessageSquare className="w-4 h-4 flex-shrink-0" />
                          {adminSidebarCollapsedDesktop && stats.pendingChats > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white font-extrabold text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                              {stats.pendingChats}
                            </span>
                          )}
                        </div>
                        {!adminSidebarCollapsedDesktop && (
                          <>
                            <span className="animate-fadeIn">Support Chats</span>
                            {stats.pendingChats > 0 && (
                              <span className="ml-auto bg-orange-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                                {stats.pendingChats}
                              </span>
                            )}
                          </>
                        )}
                      </button>

                      {user?.role === 'Super Admin' && (
                        <button 
                          onClick={() => setAdminTab('roles')}
                          title="Staff Management"
                          className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            adminSidebarCollapsedDesktop ? 'justify-center' : 'space-x-3'
                          } ${
                            adminTab === 'roles' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                        >
                          <Users className="w-4 h-4 flex-shrink-0" />
                          {!adminSidebarCollapsedDesktop && <span className="animate-fadeIn">Staff Management</span>}
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Sidebar Footer with Collapse Toggle and Log Out */}
                  <div className="space-y-4 pt-6 border-t border-slate-800">
                    
                    {/* Collapse Sidebar Button */}
                    <button 
                      onClick={() => setAdminSidebarCollapsedDesktop(!adminSidebarCollapsedDesktop)}
                      title={adminSidebarCollapsedDesktop ? "Expand Sidebar" : "Collapse Sidebar"}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all ${
                        adminSidebarCollapsedDesktop ? 'justify-center' : 'space-x-3'
                      }`}
                    >
                      {adminSidebarCollapsedDesktop ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <>
                          <ChevronLeft className="w-4 h-4" />
                          <span>Collapse Sidebar</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={logout}
                      title="Log Out Staff"
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-950/20 transition-all ${
                        adminSidebarCollapsedDesktop ? 'justify-center' : 'space-x-3'
                      }`}
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      {!adminSidebarCollapsedDesktop && <span className="animate-fadeIn">Log Out Staff</span>}
                    </button>
                  </div>
                </aside>

                {/* Admin Core Content Area */}
                <main className="flex-grow p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
                  
                  {/* TAB 1: OVERVIEW DASHBOARD */}
                  {adminTab === 'dashboard' && (
                    <div id="admin-tab-dashboard" className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-black">Dashboard Overview</h2>
                          <p className="text-xs text-slate-400">Real-time telemetry and operation statuses.</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => { fetchParcels(); fetchActiveChats(); }}
                            className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 text-slate-300">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stat Tiles */}
                      <div className="grid sm:grid-cols-3 gap-6">
                        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Active Shipments</span>
                            <Package className="w-5 h-5 text-orange-500" />
                          </div>
                          <p className="text-4xl font-extrabold">{stats.activeShipments}</p>
                          <p className="text-[10px] text-slate-500">Parcels currently registered or in transit.</p>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Support Conversations</span>
                            <MessageSquare className="w-5 h-5 text-orange-500" />
                          </div>
                          <p className="text-4xl font-extrabold">{activeChats.length}</p>
                          <p className="text-[10px] text-slate-500">Active anonymous sessions in Support.</p>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Pending Assistance</span>
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                          </div>
                          <p className="text-4xl font-extrabold text-orange-400">{stats.pendingChats}</p>
                          <p className="text-[10px] text-slate-500">Chats waiting for agent replies.</p>
                        </div>
                      </div>

                      {/* Quick Activity lists */}
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Latest Registered Parcels */}
                        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
                          <h4 className="font-bold border-b border-slate-800 pb-2">Latest Shipments</h4>
                          <div className="space-y-3">
                            {parcels.slice(0, 4).map((p: any) => (
                              <div key={p.id} className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                                <div>
                                  <p className="font-bold text-slate-200">{p.trackingNumber}</p>
                                  <p className="text-[10px] text-slate-500">{p.origin} → {p.destination}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${p.currentStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                  {p.currentStatus}
                                </span>
                              </div>
                            ))}
                            {parcels.length === 0 && <p className="text-xs text-slate-500 italic">No shipments registered yet.</p>}
                          </div>
                        </div>

                        {/* Urgent Pending Chats */}
                        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
                          <h4 className="font-bold border-b border-slate-800 pb-2">Active Chats</h4>
                          <div className="space-y-3">
                            {activeChats.slice(0, 4).map((c: any) => (
                              <div key={c.id} className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                                <div>
                                  <p className="font-bold text-slate-200 truncate max-w-[200px]">Session: {c.id.substring(0, 10)}...</p>
                                  <p className="text-[10px] text-slate-500">Last Active: {new Date(c.lastActiveAt).toLocaleTimeString()}</p>
                                </div>
                                <button 
                                  onClick={() => { setAdminTab('chat'); setSelectedChat(c); }}
                                  className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold px-2 py-1 rounded hover:bg-orange-500 hover:text-white transition-all">
                                  Join Chat
                                </button>
                              </div>
                            ))}
                            {activeChats.length === 0 && <p className="text-xs text-slate-500 italic">No active support conversations.</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SHIPMENTS / PARCEL CRUD */}
                  {adminTab === 'parcels' && (
                    <div id="admin-tab-parcels" className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-black">Shipments Ledger</h2>
                          <p className="text-xs text-slate-400">Create, view, update and manage Delflow shipments.</p>
                        </div>
                        <button 
                          id="btn-create-parcel-modal"
                          onClick={() => setParcelModalOpen(true)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-md transition-all flex items-center space-x-1.5">
                          <Plus className="w-4 h-4" />
                          <span>Create Parcel</span>
                        </button>
                      </div>

                      {/* Parcels Grid/Table */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
                              <tr>
                                <th className="p-4">Tracking Code</th>
                                <th className="p-4">Sender & Receiver</th>
                                <th className="p-4">Route</th>
                                <th className="p-4">Service</th>
                                <th className="p-4">Current Status</th>
                                <th className="p-4">Est. Delivery</th>
                                <th className="p-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900 text-slate-300">
                              {parcels.map((p: any) => (
                                <tr key={p.id} className="hover:bg-slate-900/50">
                                  <td className="p-4 font-bold text-white">{p.trackingNumber}</td>
                                  <td className="p-4">
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-bold text-slate-200">S: {p.senderName}</p>
                                      <p className="text-xs text-slate-400">R: {p.receiverName}</p>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <p className="text-xs">{p.origin}</p>
                                    <p className="text-[10px] text-slate-500">to {p.destination}</p>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-xs bg-slate-900 text-orange-400 border border-slate-800 px-2 py-0.5 rounded font-medium">
                                      {p.chooseServices}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                        p.currentStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                        p.currentStatus === 'In Transit' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                                        p.currentStatus === 'Out for Delivery' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                        p.currentStatus === 'Exception' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                      }`}>
                                        {p.currentStatus}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-xs font-semibold">{p.estimatedDelivery}</td>
                                  <td className="p-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <button 
                                        onClick={() => {
                                          setStatusUpdateOpen(p.id);
                                          setUpdateStatusVal(p.currentStatus);
                                        }}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded">
                                        Update Status
                                      </button>
                                      
                                      {/* Delete action (Super Admin / Admin only) */}
                                      {['Super Admin', 'Admin'].includes(user?.role) && (
                                        <button 
                                          onClick={() => handleDeleteParcel(p.id)}
                                          className="text-red-400 hover:text-red-300 p-1 bg-red-950/10 rounded">
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {parcels.length === 0 && (
                                <tr>
                                  <td colSpan={7} className="p-6 text-center italic text-slate-500">
                                    No shipments currently registered.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Inline Update Status Form Modal */}
                      {statusUpdateOpen && (
                        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
                          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-md w-full space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <h3 className="font-bold text-lg">Update Shipment Status</h3>
                              <button onClick={() => setStatusUpdateOpen(null)} className="text-slate-400 hover:text-slate-200">
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <form onSubmit={(e) => handleStatusUpdateSubmit(e, statusUpdateOpen)} className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">New Status</label>
                                <select 
                                  value={updateStatusVal}
                                  onChange={(e: any) => setUpdateStatusVal(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500">
                                  <option value="Registered">Registered</option>
                                  <option value="In Transit">In Transit</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Exception">Exception</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Checkpoint Location</label>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="e.g. Chicago Hub, IL"
                                  value={updateLocation}
                                  onChange={(e) => setUpdateLocation(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-200"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                                <textarea 
                                  required
                                  placeholder="e.g. Shipment departed processing center."
                                  value={updateDescription}
                                  onChange={(e) => setUpdateDescription(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-200 h-20"
                                />
                              </div>

                              <button 
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-2.5 rounded-lg text-sm">
                                Save Checkpoint Status
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* Create Parcel Modal */}
                      {parcelModalOpen && (
                        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
                          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-2xl w-full my-8 space-y-4 max-h-[90vh] overflow-y-auto text-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <h3 className="font-bold text-lg text-white">Create New Shipment</h3>
                              <button onClick={() => setParcelModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <form onSubmit={handleCreateParcelSubmit} className="space-y-4 text-xs">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Sender Name *</label>
                                  <input 
                                    type="text" required placeholder="John Doe" value={parcelSenderName}
                                    onChange={(e) => setParcelSenderName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Sender Email</label>
                                  <input 
                                    type="email" placeholder="john@example.com" value={parcelSenderEmail}
                                    onChange={(e) => setParcelSenderEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Receiver Name *</label>
                                  <input 
                                    type="text" required placeholder="Alice Smith" value={parcelReceiverName}
                                    onChange={(e) => setParcelReceiverName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Receiver Email</label>
                                  <input 
                                    type="email" placeholder="alice@example.com" value={parcelReceiverEmail}
                                    onChange={(e) => setParcelReceiverEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Origin Route Address *</label>
                                  <input 
                                    type="text" required placeholder="Los Angeles, CA" value={parcelOrigin}
                                    onChange={(e) => setParcelOrigin(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Destination Route Address *</label>
                                  <input 
                                    type="text" required placeholder="New York, NY" value={parcelDestination}
                                    onChange={(e) => setParcelDestination(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Initial Status</label>
                                  <select 
                                    value={parcelCurrentStatus} onChange={(e: any) => setParcelCurrentStatus(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs bg-slate-950">
                                    <option value="Registered">Registered</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Exception">Exception</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Service Category</label>
                                  <select 
                                    value={parcelChooseServices} onChange={(e) => setParcelChooseServices(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs bg-slate-950">
                                    <option>Road Transport</option>
                                    <option>Ocean Freight</option>
                                    <option>Train Freight</option>
                                    <option>Air Freight</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="block font-bold text-slate-400">Est. Delivery Date</label>
                                  <input 
                                    type="date" value={parcelEstimatedDelivery} onChange={(e) => setParcelEstimatedDelivery(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-800 space-y-3">
                                <h4 className="font-bold text-slate-300">Initial Milestone Checkpoint</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="block font-bold text-slate-400">Location</label>
                                    <input 
                                      type="text" placeholder="e.g. Origin Port facility" value={parcelLocation}
                                      onChange={(e) => setParcelLocation(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block font-bold text-slate-400">Log Description</label>
                                    <input 
                                      type="text" placeholder="e.g. Shipment sorted and registered." value={parcelDescription}
                                      onChange={(e) => setParcelDescription(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-slate-200 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>

                              <button 
                                type="submit"
                                disabled={isSubmittingParcel}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-lg text-sm mt-4">
                                {isSubmittingParcel ? 'Creating Shipment...' : 'Register Delflow Shipment'}
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 3: SUPPORT LIVE CHAT INBOX */}
                  {adminTab === 'chat' && (
                    <div id="admin-tab-chat" className="space-y-6 flex-grow flex flex-col h-[calc(100vh-10rem)]">
                      <div>
                        <h2 className="text-2xl font-black">Support live Inbox</h2>
                        <p className="text-xs text-slate-400">Reply and resolve client inquiries in real-time.</p>
                      </div>

                      <div className="flex-grow grid md:grid-cols-12 gap-6 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">
                        
                        {/* Session list (3 md:col) */}
                        <div className={`md:col-span-4 border-r border-slate-800 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest p-4 border-b border-slate-800 bg-slate-900/50">
                            Active Chats ({activeChats.length})
                          </p>
                          <div className="flex-grow overflow-y-auto divide-y divide-slate-900">
                            {activeChats.map((session) => {
                              const isUnread = session.lastMessage && session.lastMessage.senderType === 'user';
                              return (
                                <button 
                                  key={session.id}
                                  onClick={() => setSelectedChat(session)}
                                  className={`w-full text-left p-4 hover:bg-slate-900/50 transition-colors flex justify-between items-center ${selectedChat?.id === session.id ? 'bg-slate-900' : ''}`}>
                                  <div className="space-y-1 overflow-hidden pr-2">
                                    <p className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                      <span className="truncate">Session: {session.id.substring(0, 12)}...</span>
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">
                                      {session.lastMessage ? session.lastMessage.text : 'No messages yet'}
                                    </p>
                                  </div>
                                  {isUnread && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse flex-shrink-0"></span>
                                  )}
                                </button>
                              );
                            })}
                            {activeChats.length === 0 && (
                              <p className="text-xs text-slate-500 italic p-4 text-center">No active support conversations.</p>
                            )}
                          </div>
                        </div>

                        {/* Dialogue pane (8 md:col) */}
                        <div className={`md:col-span-8 flex flex-col justify-between h-full min-h-[350px] ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                          {selectedChat ? (
                            <>
                              {/* Header */}
                              <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => setSelectedChat(null)}
                                    className="md:hidden p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 mr-1 flex items-center justify-center"
                                    title="Back to list"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <div>
                                    <p className="font-bold text-slate-200">Active chat with Guest</p>
                                    <p className="text-[10px] text-slate-500">ID: {selectedChat.id}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleCloseChatSession(selectedChat.id)}
                                  className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all">
                                  Mark as Resolved
                                </button>
                              </div>

                              {/* Message threads */}
                              <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[350px]">
                                {selectedChat.messages?.map((msg: any) => {
                                  const isAgent = msg.senderType === 'agent';
                                  return (
                                    <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[80%] rounded-xl p-3 text-xs ${isAgent ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-200'}`}>
                                        <div className="flex items-center space-x-1.5 mb-1 opacity-70 text-[9px] font-bold uppercase tracking-wider">
                                          <span>{msg.senderName}</span>
                                          <span>•</span>
                                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                                <div ref={adminChatEndRef}></div>
                              </div>

                              {/* Input sender */}
                              <form onSubmit={handleSendAdminMessage} className="p-4 border-t border-slate-800 bg-slate-900/20 flex items-center space-x-2">
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Type your official support response..."
                                  value={adminChatInput}
                                  onChange={(e) => setAdminChatInput(e.target.value)}
                                  className="flex-grow bg-slate-900 border border-slate-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs text-white"
                                />
                                <button 
                                  type="submit"
                                  className="bg-orange-500 hover:bg-orange-600 p-3 rounded-lg text-white shadow-md transition-all">
                                  <Send className="w-4 h-4" />
                                </button>
                              </form>
                            </>
                          ) : (
                            <div className="hidden md:flex flex-grow flex-col items-center justify-center text-center p-8 space-y-2">
                              <MessageSquare className="w-12 h-12 text-slate-700 animate-pulse" />
                              <h4 className="font-bold text-slate-400">No Chat Selected</h4>
                              <p className="text-xs text-slate-500 max-w-sm">Choose an active Support conversation from the left sidebar to start communicating with the client.</p>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAB 4: STAFF PRIVILEGES & ROLES (Super Admin only) */}
                  {adminTab === 'roles' && user?.role === 'Super Admin' && (
                    <div id="admin-tab-roles" className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-black">Staff Privilege Settings</h2>
                        <p className="text-xs text-slate-400">Invite new administrative staff and manage existing staff privileges.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT: GRANT AUTHORITY & INVITE FORM */}
                        <div className="lg:col-span-5 space-y-6">
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                              <Plus className="w-5 h-5 text-orange-500" />
                              <h3 className="font-bold text-white text-sm">Grant Authority (Invite Staff)</h3>
                            </div>

                            <form onSubmit={handleInviteStaff} className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={inviteEmail}
                                  onChange={(e) => setInviteEmail(e.target.value)}
                                  placeholder="staff-member@delflow.com"
                                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-lg px-3 py-2 text-xs text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  Privilege Role
                                </label>
                                <select
                                  value={inviteRole}
                                  onChange={(e: any) => setInviteRole(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-lg px-3 py-2 text-xs text-orange-400"
                                >
                                  <option value="Admin">Admin (Full Shipments & Support access)</option>
                                  <option value="Support Agent">Support Agent (Support & Shipments access)</option>
                                  <option value="Super Admin">Super Admin (All settings & Staff controls)</option>
                                </select>
                              </div>

                              <button
                                type="submit"
                                disabled={inviteLoading}
                                className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                              >
                                {inviteLoading ? (
                                  <span>Authorizing...</span>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4" />
                                    <span>Grant Authority</span>
                                  </>
                                )}
                              </button>
                            </form>

                            {inviteError && (
                              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-start space-x-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{inviteError}</span>
                              </div>
                            )}
                          </div>

                          {/* BEAUTIFUL CREDENTIALS PRESENTATION */}
                          {invitedUserCredentials && (
                            <div className="bg-slate-950 border border-emerald-500/30 bg-emerald-950/5 rounded-xl p-5 space-y-4 animate-fadeIn">
                              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                                <div className="flex items-center space-x-1.5 text-emerald-400">
                                  <CheckCircle2 className="w-5 h-5" />
                                  <h4 className="font-bold text-xs uppercase tracking-wide">Authority Granted Successfully</h4>
                                </div>
                                <button
                                  onClick={() => setInvitedUserCredentials(null)}
                                  className="text-slate-400 hover:text-white text-xs p-1 bg-slate-900 rounded hover:bg-slate-800"
                                  title="Dismiss"
                                >
                                  Dismiss
                                </button>
                              </div>

                              <div className="space-y-3">
                                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Details</p>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Email:</span>
                                      <span className="font-semibold text-white">{invitedUserCredentials.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Role:</span>
                                      <span className="font-bold text-orange-400 uppercase text-[10px]">{invitedUserCredentials.role}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-lg space-y-1 text-center">
                                  <p className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest">TEMPORARY GENERATED PASSWORD</p>
                                  <p className="font-mono text-lg font-bold text-white select-all tracking-wider">{invitedUserCredentials.password}</p>
                                  <p className="text-[9px] text-slate-400 italic">Please copy and provide this password to the user. It is hashed securely in the database.</p>
                                </div>

                                <div className="border border-slate-800/80 bg-slate-900/50 p-3 rounded-lg space-y-1.5">
                                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-bold uppercase">
                                    <Mail className="w-3.5 h-3.5 text-orange-500" />
                                    <span>Simulated Email Sent</span>
                                  </div>
                                  <div className="bg-slate-950 p-2.5 rounded border border-slate-900 text-[11px] font-mono text-slate-300 whitespace-pre-wrap select-all max-h-40 overflow-y-auto leading-relaxed">
                                    {invitedUserCredentials.mockEmailBody}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT: REGISTERED STAFF & MANAGEMENT LIST */}
                        <div className="lg:col-span-7">
                          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-800 bg-slate-900/40">
                              <h3 className="font-bold text-sm text-white">Registered Administrative Staff</h3>
                              <p className="text-[10px] text-slate-500">Active profiles authorized to log in and manage the system.</p>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-900 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-800">
                                  <tr>
                                    <th className="p-3.5">Email / Profile</th>
                                    <th className="p-3.5">Role</th>
                                    <th className="p-3.5">Authorized On</th>
                                    <th className="p-3.5 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900 text-slate-300">
                                  {adminUsers.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-slate-900/50">
                                      <td className="p-3.5">
                                        <div className="font-semibold text-white truncate max-w-[200px]" title={u.email}>
                                          {u.email}
                                        </div>
                                      </td>
                                      <td className="p-3.5">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                          u.role === 'Super Admin' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                          u.role === 'Admin' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                                          u.role === 'Support Agent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                          'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                          {u.role}
                                        </span>
                                      </td>
                                      <td className="p-3.5 text-slate-400">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                      </td>
                                      <td className="p-3.5 text-right">
                                        {u.id === user.id ? (
                                          <span className="text-[10px] text-slate-500 font-bold italic pr-2">Your Account</span>
                                        ) : (
                                          <div className="flex items-center justify-end space-x-2">
                                            <select 
                                              value={u.role}
                                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                              className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[11px] text-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                              <option value="Super Admin">Super Admin</option>
                                              <option value="Admin">Admin</option>
                                              <option value="Support Agent">Support Agent</option>
                                              <option value="User">User</option>
                                            </select>

                                            <button
                                              onClick={() => handleRevokeStaff(u.id, u.email)}
                                              className="p-1.5 bg-red-950/20 hover:bg-red-950/50 text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-500/40 rounded-lg transition-all"
                                              title="Revoke Administrative Access"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </main>

              </div>
            )}

          </div>
        )}

      </main>

      {/* ----------------- FOOTER ----------------- */}
      <footer id="footer-delflow" className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-4 space-y-4">
            <DelflowLogo className="w-8 h-8 text-orange-500" />
            <p className="leading-relaxed">
              Delflow is a leading integrated logistics provider, streamlining global shipping, warehouse storage, and intercontinental supply chain management with total transparency.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-200">Our Services</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => { setSelectedServiceDetail('road'); setCurrentView('service-detail'); }} className="hover:text-white transition-colors">Road Transport</button></li>
              <li><button onClick={() => { setSelectedServiceDetail('ocean'); setCurrentView('service-detail'); }} className="hover:text-white transition-colors">Ocean Freight</button></li>
              <li><button onClick={() => { setSelectedServiceDetail('train'); setCurrentView('service-detail'); }} className="hover:text-white transition-colors">Train Freight</button></li>
              <li><button onClick={() => { setSelectedServiceDetail('air'); setCurrentView('service-detail'); }} className="hover:text-white transition-colors">Air Freight</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-200">Quick Links</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Home Landing</button></li>
              <li><button onClick={() => setCurrentView('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => setCurrentView('blog')} className="hover:text-white transition-colors">Insights Blog</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              <li>
                <button 
                  onClick={() => setCurrentView('admin')} 
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                  Staff Admin Access
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-200">Contact Us</h4>
            <p className="leading-relaxed">
              Corporate Office: <br/>
              900 Wilshire Blvd, Los Angeles, CA<br/>
              delflow_logistics@protonmail.com
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 Delflow Shipping & Logistics. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>


      {/* ----------------- WHATSAPP FLOATING BUTTON ----------------- */}
      <div 
        id="whatsapp-floating-widget" 
        className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-out origin-bottom-left ${
          scrolledBeyondHero && currentView !== 'admin'
            ? 'scale-100 opacity-100 pointer-events-auto' 
            : 'scale-0 opacity-0 pointer-events-none'
        } ${
          isScrollingMobile ? '-translate-x-12 opacity-45 scale-90 blur-[0.2px]' : 'translate-x-0'
        }`}
      >
        <a 
          href="https://wa.me/15734289779?text=hello%20delflow%2C%20i%20have%20a%20question%3F"
          target="_blank"
          rel="noopener noreferrer"
          id="btn-whatsapp-launcher"
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-115 active:scale-95 flex items-center justify-center relative group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-300 animate-ping" />
          
          <span className="absolute left-14 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>
      </div>


      {/* ----------------- 5. LIVE SUPPORT CHET FLOATING WIDGET ----------------- */}
      <div 
        id="live-chat-floating-widget" 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out origin-bottom-right ${
          scrolledBeyondHero && currentView !== 'admin'
            ? 'scale-100 opacity-100 pointer-events-auto' 
            : 'scale-0 opacity-0 pointer-events-none'
        } ${
          (isScrollingMobile && !chatOpen) ? 'translate-x-12 opacity-45 scale-90 blur-[0.2px]' : 'translate-x-0'
        }`}
      >
        
        {!chatOpen ? (
          // Chat bubble launcher
          <button 
            id="btn-chat-launcher"
            onClick={() => { setChatOpen(true); fetchChatHistory(); }}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-115 active:scale-95 flex items-center justify-center relative group">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-white"></span>
            
            <span className="absolute right-14 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Live Support Chat
            </span>
          </button>
        ) : (
          // Active chat dialog box
          <div id="chat-widget-box" className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 flex flex-col overflow-hidden transition-all duration-300 max-h-[500px]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <svg width="24" height="24" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-75 origin-left">
                  <path d="M10 20L20 10V30L10 20Z" fill="#F97316"/>
                  <path d="M22 15L32 15V25L22 25V15Z" fill="#F97316"/>
                </svg>
                <div>
                  <h4 className="font-extrabold text-sm">Delflow Live Support</h4>
                  <p className="text-[9px] text-slate-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Support Agents Online</span>
                  </p>
                </div>
              </div>
              <button 
                id="btn-chat-close"
                onClick={() => setChatOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message thread */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50 h-72">
              {chatMessages.map((msg) => {
                const isUser = msg.senderType === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs shadow-sm ${
                      isUser ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}>
                      <p className="text-[8px] font-bold uppercase tracking-wider mb-0.5 opacity-60">
                        {msg.senderName}
                      </p>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input form */}
            <form id="form-chat-send" onSubmit={handleSendPublicMessage} className="p-3 border-t border-slate-100 bg-white flex items-center space-x-1.5">
              <input 
                id="input-chat-text"
                type="text" 
                required
                placeholder="How can we assist you?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button 
                id="btn-chat-send"
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-lg shadow-md hover:shadow-orange-500/10 transition-all flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
}
