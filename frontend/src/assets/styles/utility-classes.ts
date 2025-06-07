/**
 * Reusable Tailwind Utility Class Collections
 * Use these pre-defined class strings for consistent styling
 */

// Layout & Container Classes - EXACT MATCHES
export const layout = {
  // Original: .dashboard-container
  dashboardContainer: "min-h-screen w-full p-8 bg-[#1a1b26]",
  // Original: .dashboard  
  dashboard: "w-full max-w-6xl mx-auto relative",
  // Original: .register-content
  registerContent: "w-full max-w-lg mx-auto",
  // Original: .settings-page
  settingsPage: "min-h-screen p-8 text-white flex flex-col items-center",
  centeredContainer: "flex items-center justify-center min-h-screen",
} as const;

// Card & Container Classes - EXACT MATCHES
export const cards = {
  // Original: .players-management
  playersManagement: "p-6 mb-8 rounded-2xl bg-white/5",
  // Original: .register-section
  registerSection: "p-8 rounded-2xl bg-white/5",
  // Original: .settings-container
  settingsContainer: "w-full max-w-4xl p-8 rounded-2xl bg-white/5 border border-white/10",
  // Original: .settings-section
  settingsSection: "mb-8 p-6 rounded-xl bg-white/[0.03] border border-white/5",
} as const;

// Form Classes - EXACT MATCHES
export const forms = {
  // Original: .form-group
  group: "w-full mb-6",
  // Original: .form-group input (Register)
  input: "w-full text-base text-white transition-all duration-300 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/40 focus:bg-white/[0.15] placeholder:text-white/50 disabled:opacity-70 disabled:cursor-not-allowed",
  // Original: .form-group label
  label: "block mb-2 text-gray-800",
  // Original: .form-group input (Settings variant)
  settingsInput: "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-base transition-all duration-200 focus:outline-none focus:border-white/20 focus:bg-white/8",
} as const;

// Button Classes - EXACT MATCHES
export const buttons = {
  // Original: .submit-button
  submit: "w-full p-3 border-none text-white text-base font-semibold cursor-pointer transition-all duration-300 mt-4 rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(74,144,226,0.3)] disabled:opacity-70 disabled:cursor-not-allowed",
  // Original: .create-player-button  
  createPlayer: "flex items-center cursor-pointer text-white font-medium rounded-xl border border-white/10 transition-all duration-200 gap-3 px-5 py-3 text-[0.95rem] bg-gradient-to-r from-[#2C3E50] to-[#1A2634] shadow-[0_2px_10px_rgba(44,62,80,0.2)] hover:bg-gradient-to-r hover:from-[#34495E] hover:to-[#2C3E50] hover:shadow-[0_4px_15px_rgba(44,62,80,0.3)] hover:-translate-y-0.5",
  // Original: .settings-button
  settings: "text-white p-3 text-base font-medium cursor-pointer transition-all duration-200 flex items-center justify-center rounded-lg gap-2 bg-white/10 border border-white/10 px-6 py-3 hover:bg-white/[0.15] hover:-translate-y-px active:translate-y-0",
  // Original: .settings-button.delete
  settingsDelete: "text-white p-3 text-base font-medium cursor-pointer transition-all duration-200 flex items-center justify-center rounded-lg gap-2 px-6 py-3 bg-[rgba(228,74,74,0.1)] border border-[rgba(228,74,74,0.2)] text-[#E44A4A] hover:bg-[rgba(228,74,74,0.15)]",
  // Original: .google-button
  google: "w-full flex items-center justify-center mt-4 p-3 text-white text-base cursor-pointer transition-all duration-300 gap-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/[0.15] hover:border-white/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed",
} as const;

// Avatar Classes
export const avatars = {
  small: "w-10 h-10 rounded-full border-2 border-white/20 object-cover",
  medium: "w-16 h-16 rounded-full border-2 border-white/20 object-cover",
  large: "w-20 h-20 rounded-full border-2 border-white/20 object-cover",
  extraLarge: "w-24 h-24 rounded-full border-2 border-white/20 object-cover",
} as const;

// Player & User Classes - EXACT MATCHES  
export const players = {
  // Original: .player-item
  item: "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.06] hover:-translate-y-0.5",
  // Original: .player-item.active
  itemActive: "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border border-[rgba(44,62,80,0.3)] bg-[rgba(44,62,80,0.2)]",
  // Original: .player-item-avatar
  avatar: "w-10 h-10 rounded-full",
  // Original: .player-item-info
  info: "flex flex-col gap-1",
  // Original: .player-item-name
  name: "text-white font-medium",
  // Original: .player-item-points
  points: "text-sm text-white/60",
} as const;

// Match & Game Classes
export const matches = {
  card: "bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-6 bg-slate-700/50 border-white/5 shadow-lg backdrop-blur-lg",
  players: "flex items-center justify-between gap-6 p-4 bg-white/5 rounded-lg",
  vsIndicator: "text-white/30 text-sm font-medium uppercase px-3 py-2 bg-white/5 rounded",
  score: "text-2xl font-bold text-white",
  status: "text-sm text-white/70",
} as const;

// Status Classes
export const status = {
  online: "inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm",
  offline: "inline-flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-gray-400 text-sm",
  playing: "inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm",
  waiting: "inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm",
} as const;

// Message Classes - EXACT MATCHES
export const messages = {
  // Original: .error-message
  error: "p-4 rounded-lg mb-4 text-center bg-[rgba(229,62,62,0.1)] border border-[rgba(229,62,62,0.2)] text-[#FFA5A5]",
  // Original: .success-message  
  success: "p-4 rounded-lg mb-4 text-center bg-[rgba(72,187,120,0.1)] border border-[rgba(72,187,120,0.2)] text-[#9AE6B4]",
} as const;

// Grid Layout Classes
export const grids = {
  players: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  matches: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  stats: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  responsive2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  responsive3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
} as const;

// Tournament Classes
export const tournament = {
  bracket: "flex flex-col gap-8",
  semifinals: "grid grid-cols-1 lg:grid-cols-2 gap-8",
  championCard: "bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-8 text-center bg-slate-700/70 border-green-400/20 max-w-md mx-auto",
  matchCard: "bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-6 bg-slate-700/50 border-white/5 shadow-lg backdrop-blur-lg",
} as const;

// Modal Classes
export const modals = {
  overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50",
  content: "bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-8 max-w-md w-full bg-[#1E1E2E] border-white/20",
  header: "flex items-center justify-between mb-6",
  title: "text-xl font-semibold text-white",
  actions: "flex gap-4 mt-6",
} as const;

// Typography Classes
export const typography = {
  heading1: "text-3xl font-bold text-white",
  heading2: "text-2xl font-semibold text-white", 
  heading3: "text-xl font-medium text-white",
  body: "text-base text-white/90",
  caption: "text-sm text-white/70",
  label: "text-sm font-medium text-white/80",
} as const;

// Animation Classes
export const animations = {
  fadeIn: "animate-fade-in",
  slideDown: "animate-slide-down",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
} as const;

// Spacing Classes (for consistent margins/paddings)
export const spacing = {
  section: "mb-8",
  element: "mb-4", 
  small: "mb-2",
  large: "mb-12",
  gap: "gap-4",
  gapSmall: "gap-2",
  gapLarge: "gap-6",
} as const;

// Usage Example:
// import { cards, buttons, players } from './utility-classes';
// 
// <div className={cards.medium}>
//   <button className={buttons.primary}>Click me</button>
//   <div className={players.card}>Player info</div>
// </div> 