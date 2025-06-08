import React, { useState, forwardRef, useEffect, useContext, createContext } from 'react';

// --- UTILIDADES Y CONFIGURACIÓN ---
function cn(...inputs) { return inputs.filter(Boolean).join(' '); }
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const todayISO = () => new Date().toISOString().split("T")[0];
// NOTA: Deberías reemplazar la clave de la API por una variable de entorno segura en producción.
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';

// --- ICONOS (Corregidos) ---
const LogoIcon = ({ className }) => ( <svg className={cn("w-8 h-8", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h20"/><path d="M17.5 12a5.5 5.5 0 1 0-11 0"/></svg> );
const BotIcon = ({ className }) => ( <svg className={cn("h-8 w-8", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="m8 18-2 2"/><path d="m16 18 2 2"/><path d="M12 6V4"/><path d="M12 12v2"/></svg> );
const CalendarIcon = ({ className }) => ( <svg className={cn("h-8 w-8", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> );
const ChartIcon = ({ className }) => ( <svg className={cn("h-8 w-8", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> );
const BedIcon = ({ className }) => ( <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16h20V4H2z"/><path d="M2 10h20"/><path d="M8 14v-4"/><path d="M16 14v-4"/></svg> );
const LogoutIcon = ({ className }) => ( <svg className={cn("w-5 h-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> );
const PackageIcon = ({ className }) => ( <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> );
const PlusCircleIcon = ({ className }) => ( <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> );
const MessageIcon = ({ className }) => ( <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);
const SparklesIcon = ({ className }) => ( <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.45 4.1-4.1 1.45 4.1 1.45L12 14l1.45-4.1 4.1-1.45-4.1-1.45z"/><path d="M12 3v.01"/><path d="M3 12h.01"/><path d="M21 12h.01"/><path d="M12 21v-.01"/><path d="m4.22 4.22.01.01"/><path d="m19.78 4.22-.01.01"/><path d="m4.22 19.78.01-.01"/><path d="m19.78 19.78-.01-.01"/></svg> );
const WandIcon = ({ className }) => ( <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.71 0L11.29 9.71a1.21 1.21 0 0 0 0 1.71l8.29 8.29a1.21 1.21 0 0 0 1.71 0l1.28-1.28a1.21 1.21 0 0 0 0-1.71L15.12 9.42"/><path d="m19.5 6.5-4 4"/><path d="m14 2-1-1"/><path d="m21 9-1-1"/><path d="M3 15l4 4"/><path d="M9 21l-1-1"/><path d="M3 9l4 4"/></svg> );
const EditIcon = ({ className }) => ( <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg> );
const TrashIcon = ({ className }) => ( <svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );
const SpinnerIcon = ({ className }) => (<svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const CheckCircleIcon = ({ className }) => (<svg className={cn(className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);
const CreditCardIcon = ({ className }) => (<svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>);
const BankIcon = ({ className }) => (<svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7v2h20V7L12 2z"/><path d="M6 11v6H4v-6h2zm6 0v6h-2v-6h2zm6 0v6h-2v-6h2z"/><path d="M4 22h16"/></svg>);
const BtcIcon = ({ className }) => (<svg className={cn(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5v15M8.5 8H14a2.5 2.5 0 1 1 0 5H8.5m0 3H15a2.5 2.5 0 1 0 0-5H8.5M5.5 14v-4m13 4v-4"/></svg>);

// --- COMPONENTES DE UI Y MODALES GENÉRICOS ---
const Button = forwardRef(({ className, variant, size, children, ...props }, ref) => { const variants = { default: "bg-teal-500 text-white hover:bg-teal-600", destructive: "bg-red-500 text-white hover:bg-red-600/90", outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 hover:border-slate-400", secondary: "bg-orange-500 text-white hover:bg-orange-600", ghost: "text-slate-700 hover:bg-teal-500/10 shadow-none hover:shadow-none" }; const sizes = { default: "h-10 px-4", sm: "h-9 rounded-md px-3", lg: "h-12 rounded-lg px-8 text-base", icon: "h-10 w-10 shrink-0" }; return <button className={cn("inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 transform hover:-translate-y-px active:translate-y-0 shadow-sm hover:shadow-md", variants[variant || 'default'], sizes[size || 'default'], className)} ref={ref} {...props}>{children}</button>; });
const Input = forwardRef(({ className, ...props }, ref) => ( <input className={cn("flex h-10 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-base ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400", className)} ref={ref} {...props} /> ));
const Textarea = forwardRef(({ className, ...props }, ref) => ( <textarea className={cn("flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-base ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400", className)} ref={ref} {...props} /> ));
const Label = forwardRef(({ className, ...props }, ref) => ( <label ref={ref} className={cn("block text-sm font-medium text-slate-700 mb-1", className)} {...props} /> ));
const Select = forwardRef(({ className, children, ...props }, ref) => ( <select className={cn("flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-teal-400", className)} ref={ref} {...props}>{children}</select> ));
const Modal = ({ isOpen, onClose, title, children }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}><div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scaleIn" onClick={(e) => e.stopPropagation()}><div className="p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-slate-800">{title}</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl font-light">&times;</button></div>{children}</div></div></div> ); };
const Badge = ({ variant, className, ...props }) => { const variants = { default: "bg-slate-100 text-slate-600", confirmed: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700" }; return <span className={cn("px-2 py-1 text-xs font-semibold rounded-full", variants[variant || 'default'], className)} {...props} />; };

// --- GESTIÓN DE ESTADO (CONTEXT API) ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
    // --- DATOS SIMULADOS INICIALES ---
    const [rooms, setRooms] = useState([ { id: 1, name: "Dormitorio 'Patagonia'", type: 'Compartida', capacity: 8, gender: 'Mixto', occupancy: 7 }, { id: 2, name: "Privada 'Aconcagua'", type: 'Privada', capacity: 2, gender: 'Mixto', occupancy: 2 }, { id: 3, name: "Dormitorio 'Selva'", type: 'Compartida', capacity: 6, gender: 'Femenino', occupancy: 3 }, ]);
    const [reservations, setReservations] = useState([ { id: 101, guestName: "Laura Gómez", checkIn: "2025-06-08", checkOut: "2025-06-12", roomId: 3, roomName: "Dormitorio 'Selva'", status: 'confirmada' }, { id: 102, guestName: "John Smith", checkIn: "2025-06-09", checkOut: "2025-06-11", roomId: 1, roomName: "Dormitorio 'Patagonia'", status: 'confirmada' }, { id: 103, guestName: "Maria Schmidt (Bot)", checkIn: "2025-06-10", checkOut: "2025-06-15", roomId: 1, roomName: "Dormitorio 'Patagonia'", status: 'pendiente' }, ]);
    const [products, setProducts] = useState([ {id: 1, name: 'Cerveza Patagonia 473ml', category: 'Bebidas', stock: 24}, {id: 2, name: 'Agua sin gas 500ml', category: 'Bebidas', stock: 8}, {id: 3, name: 'Papas Fritas Lays 85g', category: 'Snacks', stock: 15}, ]);
    const [threads, setThreads] = useState([ {id: 1, guestName: 'Ana de España', messages: [{sender: 'guest', text: 'Hola! Tienen lockers?'}]}, {id: 2, guestName: 'Paul de Francia', messages: [{sender: 'host', text:'Sí, tenemos toallas para alquilar.'}, {sender:'guest', text: 'Ok, gracias! Ya hago la reserva'}]}, ]);
    const [aiRules, setAiRules] = useState([ {id: 1, keyword: 'mascotas', reply: 'Lo siento, por el momento no aceptamos mascotas en el hostel.'}, {id: 2, keyword: 'check-in', reply: 'El check-in es a partir de las 14:00hs.'}, {id: 3, keyword: 'wifi', reply: '¡Sí! Tenemos WiFi gratis en todas las áreas del hostel.'} ]);

    // --- ESTADO GENERAL DE LA APP ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [view, setView] = useState('landing'); // 'landing', 'register', 'dashboard'
    const [activePanel, setActivePanel] = useState('resumen');
    
    // --- ESTADO DE MODALES Y SUGERENCIAS ---
    const [modalState, setModalState] = useState({ addRoom: false, addReservation: false, addRule: false, geminiSuggestion: false, login: false });
    const [ruleToEdit, setRuleToEdit] = useState(null);
    const [suggestionState, setSuggestionState] = useState({ isLoading: false, text: '' });

    // --- LÓGICA DE MANEJO DE ESTADO Y DATOS ---
    const handleAddRoom = (newRoom) => setRooms(prev => [...prev, { ...newRoom, id: Date.now(), occupancy: 0 }]);
    const handleAddReservation = (newReservation) => { const room = rooms.find(r => r.id === newReservation.roomId); if (room && room.occupancy < room.capacity) { const roomName = room.name; setReservations(prev => [{ ...newReservation, id: Date.now(), roomName, status: 'confirmada' }, ...prev]); setRooms(prev => prev.map(r => r.id === newReservation.roomId ? { ...r, occupancy: r.occupancy + 1 } : r)); } };
    const handleRejectReservation = (reservationId) => setReservations(prev => prev.filter(r => r.id !== reservationId));
    const handleConfirmReservation = (reservationId) => {
        const reservation = reservations.find(r => r.id === reservationId);
        if (!reservation) return;
        const room = rooms.find(r => r.id === reservation.roomId);
        if (room && room.occupancy < room.capacity) {
            setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'confirmada' } : r));
            setRooms(prev => prev.map(r => r.id === reservation.roomId ? { ...r, occupancy: r.occupancy + 1 } : r));
        }
    };
    const handleNewMessage = (threadId, message, triggerBot) => {
        setThreads(prev => prev.map(t => t.id === threadId ? { ...t, messages: [...t.messages, message] } : t));
        if (triggerBot) {
            // Lógica simulada de respuesta del bot
            setTimeout(() => {
                const botReply = { sender: 'bot', text: 'Recibido. ¿En qué más puedo ayudarte?' };
                setThreads(prev => prev.map(t => t.id === threadId ? { ...t, messages: [...t.messages, botReply] } : t));
            }, 1500);
        }
    };
    const handleSaveRule = (rule) => {
        if (rule.id) {
            setAiRules(prev => prev.map(r => r.id === rule.id ? rule : r));
        } else {
            setAiRules(prev => [...prev, { ...rule, id: Date.now() }]);
        }
    };
    const handleDeleteRule = (ruleId) => setAiRules(prev => prev.filter(r => r.id !== ruleId));

    // --- LÓGICA DE LA IA (GEMINI) ---
    const callGeminiAPI = async (prompt) => {
        setSuggestionState({ isLoading: true, text: '' });
        handleOpenModal('geminiSuggestion');
        try {
            const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setSuggestionState({ isLoading: false, text: result.candidates[0].content.parts[0].text });
            } else {
                setSuggestionState({ isLoading: false, text: 'No se pudieron generar sugerencias en este momento.' });
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setSuggestionState({ isLoading: false, text: 'Ocurrió un error al contactar al servicio de IA.' });
        }
    };
    
    const handleSuggestCombos = () => {
        const productList = products.map(p => `${p.name} (Stock: ${p.stock})`).join(', ');
        const prompt = `Soy el dueño de un hostel y tengo los siguientes productos en mi inventario: ${productList}. Sugiere 3 combos o promociones creativas que podría ofrecer a mis huéspedes para aumentar las ventas. Sé breve y directo, usando viñetas.`;
        callGeminiAPI(prompt);
    };

    const handleGenerateWelcomeMessage = (reservation) => {
        const prompt = `Como "Fedebot", el asistente de un hostel, redacta un mensaje de bienvenida corto y amable para un huésped llamado ${reservation.guestName}. El check-in es el ${formatDate(reservation.checkIn)} y se quedará en la habitación "${reservation.roomName}". Mi manager se llama Emi.`;
        callGeminiAPI(prompt);
    };
    
    const handleSuggestReply = async (activeThread) => {
        const lastGuestMessage = activeThread.messages.filter(m => m.sender === 'guest').pop();
        if (!lastGuestMessage) return "";
        const prompt = `Como asistente de un hostel, redacta una respuesta amable, profesional y **breve** para la siguiente consulta de un huésped. **No incluyas opciones ni placeholders.** Pregunta: "${lastGuestMessage.text}"`;
        try {
            const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.candidates[0]?.content?.parts[0]?.text.trim() || "No pude generar una sugerencia.";
        } catch (error) {
            console.error("Error in handleSuggestReply:", error);
            return "Error al contactar la IA.";
        }
    };
    
    // --- NAVEGACIÓN Y AUTENTICACIÓN ---
    const handleLogout = () => { setIsLoggingOut(true); setTimeout(() => { setIsLoggedIn(false); setView('landing'); setIsLoggingOut(false); }, 2500); };
    const handleLoginSuccess = () => { setIsLoggedIn(true); setView('dashboard'); handleCloseModal('login'); };
    const handleRegistrationSuccess = () => { setIsLoggedIn(true); setView('dashboard'); };
    const handleLoginClick = () => handleOpenModal('login');
    const handleStartTrialClick = () => setView('register');
    const handleBackToHome = () => setView('landing');

    // --- MANEJO DE MODALES ---
    const handleOpenModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: true }));
    const handleCloseModal = (modalName) => { setModalState(prev => ({ ...prev, [modalName]: false })); if(modalName === 'addRule') setRuleToEdit(null); };
    const handleEditRuleClick = (rule) => { setRuleToEdit(rule); handleOpenModal('addRule'); };
    const handleAddRuleFromMessage = (messageText) => { setRuleToEdit(messageText); handleOpenModal('addRule'); };

    const value = {
        // Estado
        isLoggedIn, isLoggingOut, view, rooms, reservations, products, threads, aiRules, activePanel, modalState, ruleToEdit, suggestionState,
        // Funciones de datos
        handleAddRoom, handleAddReservation, handleRejectReservation, handleConfirmReservation, handleNewMessage, handleSaveRule, handleDeleteRule,
        // Funciones de IA
        handleSuggestCombos, handleGenerateWelcomeMessage, handleSuggestReply,
        // Funciones de UI/Navegación
        handleLogout, handleLoginSuccess, handleRegistrationSuccess, handleLoginClick, handleStartTrialClick, handleBackToHome, setActivePanel,
        // Funciones de modales
        handleOpenModal, handleCloseModal, handleEditRuleClick, handleAddRuleFromMessage,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook personalizado para usar el contexto
const useAppContext = () => useContext(AppContext);

// --- COMPONENTES DE UI MENORES ---
function Header({ onLoginClick, onStartTrialClick }) { return ( <header className="fixed top-0 left-0 w-full bg-[#FBF9F7]/80 backdrop-blur-lg z-40 border-b border-slate-200/80"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-20"><a href="#" className="text-2xl font-bold text-slate-800 flex items-center"><LogoIcon className="mr-2 text-teal-500" /><span>Fedebot</span></a><nav className="hidden md:flex items-center space-x-8"><a href="#features" className="text-slate-600 hover:text-teal-500 transition-colors">Características</a></nav><div className="hidden md:flex items-center space-x-3"><Button variant="ghost" onClick={onLoginClick}>Ingresar</Button><Button onClick={onStartTrialClick}>Empezar Gratis</Button></div></div></div></header> );}
function LoginModal({ isOpen, onClose, onLoginSuccess }) { const [pin, setPin] = useState(''); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState(''); const handleSubmit = (e) => { e.preventDefault(); setError(''); setIsLoading(true); setTimeout(() => { if (pin === '1234') { onLoginSuccess(); } else { setError('El PIN es incorrecto. Probá con "1234".'); setIsLoading(false); setPin(''); } }, 1000); }; return ( <Modal isOpen={isOpen} onClose={onClose} title="Acceso al Panel"><form onSubmit={handleSubmit}><div className="space-y-4"><div><Label htmlFor="pin">PIN de 4 dígitos</Label><Input id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" required maxLength="4" /></div></div>{error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}<Button type="submit" className="w-full mt-6" disabled={isLoading}>{isLoading ? 'Verificando...' : 'Ingresar'}</Button></form></Modal> ); }
function LogoutNotification({ isVisible }) { const [status, setStatus] = useState('closing'); useEffect(() => { if (isVisible) { setStatus('closing'); const timer = setTimeout(() => { setStatus('closed'); }, 1200); return () => clearTimeout(timer); } }, [isVisible]); if (!isVisible) return null; return ( <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center animate-fadeIn"><div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4 w-64">{status === 'closing' ? (<><SpinnerIcon className="w-12 h-12 text-teal-500" /><p className="text-slate-700 font-semibold text-lg">Cerrando sesión...</p></>) : (<><CheckCircleIcon className="w-12 h-12 text-green-500 animate-scaleIn" /><p className="text-slate-700 font-semibold text-lg">¡Hasta pronto!</p></>)}</div></div> );}
function HeroSection({ onStartTrialClick }) { return ( <section className="relative flex items-center justify-center h-screen pt-20 text-center bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1522881193467-ce24de4fa454?q=80&w=2070&auto=format&fit=crop)'}}><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div><div className="relative z-10 px-4 text-white"><h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight drop-shadow-lg">Recuperá tu tiempo.<br /><span className="text-teal-400">Reencontrate con tus huéspedes.</span></h1><p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-200 drop-shadow-md">Fedebot es el asistente con IA que automatiza tu hostel para que vos te dediques a lo que realmente importa.</p><div className="mt-10"><Button onClick={onStartTrialClick} size="lg" className="bg-teal-500 hover:bg-teal-400">Probar 15 días gratis</Button></div></div></section> );}
function FeaturesSection() { const features = [ { icon: <BotIcon className="text-teal-500"/>, title: "Atención 24/7", description: "Tu asistente de IA responde consultas y toma reservas por WhatsApp, liberando a tu equipo." }, { icon: <CalendarIcon className="text-orange-500"/>, title: "Gestión Centralizada", description: "Administrá todas tus reservas, camas y disponibilidad desde un panel de control único e intuitivo." }, { icon: <ChartIcon className="text-teal-500"/>, title: "Decisiones Inteligentes", description: "Obtené reportes de ocupación e ingresos para optimizar tu negocio basándote en datos reales." } ]; return ( <section id="features" className="py-24 bg-[#FBF9F7]"><div className="container mx-auto px-4"><div className="text-center max-w-3xl mx-auto"><h2 className="text-4xl font-bold text-slate-800">Tu hostel, en piloto automático</h2><p className="mt-4 text-lg text-slate-600">Menos planillas, más charlas. Menos estrés, más experiencias.</p></div><div className="mt-16 grid md:grid-cols-3 gap-10">{features.map((feature, i) => ( <div key={i} className="text-center p-6 bg-white rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-2"><div className="inline-block p-4 bg-teal-500/10 rounded-full">{feature.icon}</div><h3 className="mt-4 text-xl font-bold text-slate-800">{feature.title}</h3><p className="mt-2 text-slate-600">{feature.description}</p></div> ))}</div></div></section> );}
const StatCard = ({ title, value, icon, onClick }) => ( <button onClick={onClick} disabled={!onClick} className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between text-left w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-75 disabled:transform-none disabled:cursor-not-allowed"> <div className="flex-1"> <p className="text-sm font-medium text-slate-500">{title}</p> <p className="text-3xl font-bold text-slate-800">{value}</p> </div> <div className="p-3 bg-teal-500/10 rounded-full">{icon}</div> </button> );

// --- PANELES DEL DASHBOARD ---
const ResumenPanel = () => {
    const { rooms, reservations, threads, setActivePanel } = useAppContext();
    const dashboardStats = {
        occupancy: Math.round(rooms.reduce((acc, r) => acc + r.occupancy, 0) / rooms.reduce((acc, r) => acc + r.capacity, 1) * 100) || 0,
        pendingReservations: reservations.filter(r => r.status === 'pendiente').length,
        pendingCheckins: reservations.filter(r => r.status === 'confirmada' && new Date(r.checkIn).toDateString() === new Date().toDateString()).length,
        unreadMessages: threads.length,
    };
    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-slate-800">Resumen General</h1>
            <p className="text-slate-500 mt-1">Así está tu hostel hoy, {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <StatCard title="Ocupación General" value={`${dashboardStats.occupancy}%`} icon={<ChartIcon className="text-teal-500 h-7 w-7" />} onClick={() => setActivePanel('habitaciones')}/>
                <StatCard title="Reservas Pendientes" value={dashboardStats.pendingReservations} icon={<CalendarIcon className="text-orange-500 h-7 w-7"/>} onClick={() => setActivePanel('reservas')}/>
                <StatCard title="Check-ins de Hoy" value={dashboardStats.pendingCheckins} icon={<BedIcon className="text-teal-500 h-7 w-7"/>} onClick={() => setActivePanel('reservas')}/>
                <StatCard title="Mensajes sin leer" value={dashboardStats.unreadMessages} icon={<MessageIcon className="h-7 w-7 text-blue-500"/>} onClick={() => setActivePanel('mensajes')}/>
            </div>
        </div>
    );
};
const ReservasPanel = () => {
    const { reservations, rooms, handleConfirmReservation, handleRejectReservation, handleOpenModal, handleGenerateWelcomeMessage } = useAppContext();
    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-slate-800">Gestión de Reservas</h1><p className="text-slate-500 mt-1">Las reservas manuales se confirman automáticamente. Las del bot, aquí.</p></div>
                <Button onClick={() => handleOpenModal('addReservation')}><PlusCircleIcon className="mr-2"/>Añadir Reserva</Button>
            </div>
            <div className="mt-8 bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-4 font-semibold">Huésped</th><th className="p-4 font-semibold">Check-in</th><th className="p-4 font-semibold">Habitación</th><th className="p-4 font-semibold">Estado</th><th className="p-4 font-semibold">Acciones</th></tr></thead>
                    <tbody>
                        {reservations.sort((a, b) => a.status === 'pendiente' ? -1 : 1).map(r => {
                            const room = rooms.find(room => room.id === r.roomId);
                            const roomIsFull = room ? room.occupancy >= room.capacity : true;
                            return (
                                <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="p-4 font-medium">{r.guestName}</td>
                                    <td className="p-4">{formatDate(r.checkIn)}</td>
                                    <td className="p-4">{r.roomName}</td>
                                    <td className="p-4"><Badge variant={r.status === 'confirmada' ? 'confirmed' : 'pending'}>{r.status}</Badge></td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {r.status === 'pendiente' && (
                                                <>
                                                    <Button size="sm" onClick={() => handleConfirmReservation(r.id)} disabled={roomIsFull} title={roomIsFull ? "Habitación llena para confirmar" : "Confirmar"}>Confirmar</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleRejectReservation(r.id)}>Rechazar</Button>
                                                </>
                                            )}
                                            {r.status === 'confirmada' && <Button size="sm" variant="ghost" onClick={() => handleGenerateWelcomeMessage(r)}>✨ Mensaje</Button>}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const CircularProgressBar = ({ percentage }) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const color = percentage >= 100 ? 'stroke-orange-500' : 'stroke-teal-500';

    return (
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
            <circle stroke="#e6e6e6" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
            <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={cn("transition-all duration-1000 ease-out", color)}
            />
        </svg>
    );
};
const HabitacionesPanel = () => {
    const { rooms, handleOpenModal } = useAppContext();
    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-slate-800">Tus Habitaciones</h1><p className="text-slate-500 mt-1">Gestioná tus habitaciones y su disponibilidad.</p></div>
                <Button onClick={() => handleOpenModal('addRoom')}><PlusCircleIcon className="mr-2"/>Añadir Habitación</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {rooms.map(room => {
                    const percentage = room.capacity > 0 ? (room.occupancy / room.capacity) * 100 : 0;
                    return (
                        <div key={room.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h3 className="font-bold text-slate-800">{room.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{room.type} | {room.gender}</p>
                            <div className="relative flex items-center justify-center h-20 w-20">
                                <CircularProgressBar percentage={percentage} />
                                <div className="absolute flex flex-col items-center">
                                     <span className="text-xl font-bold text-slate-700">{`${room.occupancy}/${room.capacity}`}</span>
                                     <span className="text-xs text-slate-500">Camas</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
const MercaderiaPanel = () => {
    const { products, handleSuggestCombos } = useAppContext();
    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-slate-800">Inventario y Mercadería</h1><p className="text-slate-500 mt-1">Controlá el stock de tu bar y kiosco.</p></div>
                <div className="flex gap-2">
                    <Button onClick={handleSuggestCombos} variant="secondary"><SparklesIcon className="mr-2"/>Sugerir Combos</Button>
                    <Button><PlusCircleIcon className="mr-2"/>Añadir Producto</Button>
                </div>
            </div>
            <div className="mt-8 bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-4 font-semibold">Producto</th><th className="p-4 font-semibold">Categoría</th><th className="p-4 font-semibold">Stock</th><th className="p-4 font-semibold">Acciones</th></tr></thead>
                    <tbody>{products.map(p => (<tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="p-4">{p.name}</td>
                        <td className="p-4">{p.category}</td>
                        <td className={cn("p-4 font-bold", p.stock < 10 ? 'text-red-500' : 'text-slate-700')}>{p.stock}</td>
                        <td className="p-4"><Button variant="ghost" size="sm"><EditIcon className="w-4 h-4"/></Button></td>
                    </tr>))}</tbody>
                </table>
            </div>
        </div>
    );
}

const MensajesPanel = () => {
    const { threads, handleNewMessage, handleAddRuleFromMessage, handleSuggestReply } = useAppContext();
    const [activeThreadId, setActiveThreadId] = useState(threads.length > 0 ? threads[0].id : null);
    const [messageInput, setMessageInput] = useState("");
    const [isBotThinking, setIsBotThinking] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const activeThread = threads.find(t => t.id === activeThreadId);

    const handleSuggest = async () => {
        if (!activeThread) return;
        setIsSuggesting(true);
        const suggestedText = await handleSuggestReply(activeThread);
        setMessageInput(suggestedText);
        setIsSuggesting(false);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeThreadId) return;
        const userMessage = { sender: 'host', text: messageInput };
        handleNewMessage(activeThreadId, userMessage, true); // True to trigger bot response
        setMessageInput("");
        setIsBotThinking(true);
    };
    
    useEffect(() => {
        if (activeThread) {
            const lastMessage = activeThread.messages[activeThread.messages.length - 1];
            if (lastMessage && lastMessage.sender !== 'host') {
                setIsBotThinking(false);
            }
        }
    }, [activeThread]);

    if (!activeThread) {
        return (
            <div className="animate-fadeIn">
                <h1 className="text-3xl font-bold text-slate-800">Mensajes</h1>
                <div className="mt-8 bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-slate-500">No hay conversaciones para mostrar.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fadeIn h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div><h1 className="text-3xl font-bold text-slate-800">Mensajes</h1><p className="text-slate-500 mt-1">Respondé consultas o dejá que el bot lo haga por vos.</p></div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-md flex overflow-hidden min-h-[60vh]">
                <aside className="w-1/3 border-r overflow-y-auto bg-slate-50/50">
                    {threads.map(t => (
                        <button key={t.id} onClick={() => setActiveThreadId(t.id)} className={cn("w-full text-left p-4 border-b hover:bg-slate-100 transition-colors", activeThread.id === t.id && 'bg-teal-100/50')}>
                            <p className="font-semibold">{t.guestName}</p>
                            <p className="text-sm text-slate-500 truncate">{t.messages[t.messages.length - 1].text}</p>
                        </button>
                    ))}
                </aside>
                <main className="w-2/3 flex flex-col">
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        {activeThread.messages.map((m, i) => (
                            <div key={i} className={cn("flex items-end gap-2 group", m.sender !== 'guest' ? 'justify-end' : 'justify-start')}>
                                {m.sender === 'bot' && <BotIcon className="h-6 w-6 text-slate-700 mb-1"/>}
                                <div className={cn("p-3 rounded-lg max-w-sm relative shadow-sm", m.sender === 'guest' ? 'bg-slate-200' : 'bg-teal-500 text-white', m.sender === 'bot' && 'bg-slate-700 text-white')}>
                                    {m.text}
                                    {m.sender === 'guest' && (
                                        <button onClick={() => handleAddRuleFromMessage(m.text)} className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" title="✨ Crear regla desde este mensaje">
                                            <WandIcon className="w-4 h-4 text-orange-500"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isBotThinking && (
                            <div className="flex justify-start items-end gap-2">
                                <BotIcon className="h-6 w-6 text-slate-700 mb-1"/>
                                <div className="p-3 rounded-lg bg-slate-200 shadow-sm">
                                    <SpinnerIcon className="w-5 h-5 text-slate-500"/>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t bg-slate-50 flex gap-2">
                        <Input value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Escribí tu respuesta..." />
                        <Button type="button" variant="ghost" size="icon" onClick={handleSuggest} disabled={isSuggesting} title="Sugerir respuesta con IA">
                            {isSuggesting ? <SpinnerIcon className="h-5 w-5"/> : <SparklesIcon className="h-5 w-5 text-orange-500"/>}
                        </Button>
                        <Button type="submit">Enviar</Button>
                    </form>
                </main>
            </div>
        </div>
    );
};

const AsistentePanel = () => {
    const { aiRules, handleOpenModal, handleDeleteRule, handleEditRuleClick } = useAppContext();
    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-slate-800">Asistente IA</h1><p className="text-slate-500 mt-1">Entrená a tu bot para que responda automáticamente.</p></div>
                <Button onClick={() => handleOpenModal('addRule')}><PlusCircleIcon className="mr-2"/>Añadir Regla</Button>
            </div>
            <div className="mt-8 grid gap-4">
                {aiRules.map(rule => (
                    <div key={rule.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-slate-500">Si preguntan por <span className="text-teal-600 font-bold">"{rule.keyword}"</span></p>
                            <p className="text-slate-800 mt-1">El bot responde: "{rule.reply}"</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditRuleClick(rule)}><EditIcon className="w-4 h-4"/></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)} className="text-red-500 hover:bg-red-50"><TrashIcon className="w-4 h-4"/></Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Sidebar = () => {
    const { activePanel, setActivePanel, handleLogout } = useAppContext();
    const navItems = [
        { id: 'resumen', name: 'Resumen', icon: <ChartIcon className="w-5 h-5"/> },
        { id: 'reservas', name: 'Reservas', icon: <CalendarIcon className="w-5 h-5"/> },
        { id: 'habitaciones', name: 'Habitaciones', icon: <BedIcon /> },
        { id: 'mercaderia', name: 'Mercadería', icon: <PackageIcon /> },
        { id: 'mensajes', name: 'Mensajes', icon: <MessageIcon /> },
        { id: 'asistente', name: 'Asistente IA', icon: <SparklesIcon /> }
    ];
    return (
        <aside className="w-64 bg-white flex flex-col flex-shrink-0 border-r border-slate-200">
            <div className="h-20 flex items-center px-6 border-b border-slate-200">
                <a href="#" className="text-xl font-bold text-slate-800 flex items-center"><LogoIcon className="mr-2 text-teal-500" /><span>Fedebot 2.0</span></a>
            </div>
            <nav className="flex-1 px-4 py-6">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActivePanel(item.id)} className={cn("w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-colors", activePanel === item.id ? "bg-teal-500/10 text-teal-600" : "text-slate-600 hover:bg-slate-100")}>
                        {item.icon}<span>{item.name}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-200">
                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-500/10 hover:text-red-600 font-semibold transition-colors">
                    <LogoutIcon /><span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}

// --- MODALES ESPECÍFICOS ---
const AddRoomModal = () => {
    const { modalState, handleCloseModal, handleAddRoom } = useAppContext();
    const [name, setName] = useState('');
    const [type, setType] = useState('Compartida');
    const [capacity, setCapacity] = useState(4);
    const [gender, setGender] = useState('Mixto');

    useEffect(() => {
        if (!modalState.addRoom) {
            setName('');
            setType('Compartida');
            setCapacity(4);
            setGender('Mixto');
        }
    }, [modalState.addRoom]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddRoom({ name, type, capacity: parseInt(capacity), gender });
        handleCloseModal('addRoom');
    };

    return (
        <Modal isOpen={modalState.addRoom} onClose={() => handleCloseModal('addRoom')} title="Añadir Nueva Habitación">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="room-name">Nombre</Label><Input id="room-name" value={name} onChange={e => setName(e.target.value)} required /></div>
                    <div><Label htmlFor="room-type">Tipo</Label><Select id="room-type" value={type} onChange={e => setType(e.target.value)}><option>Compartida</option><option>Privada</option></Select></div>
                    <div><Label htmlFor="room-capacity">Capacidad (camas)</Label><Input id="room-capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required min="1" /></div>
                    <div><Label htmlFor="room-gender">Género</Label><Select id="room-gender" value={gender} onChange={e => setGender(e.target.value)}><option>Mixto</option><option>Femenino</option></Select></div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline" onClick={() => handleCloseModal('addRoom')}>Cancelar</Button>
                    <Button type="submit">Guardar Habitación</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddReservationModal = () => {
    const { modalState, handleCloseModal, handleAddReservation, rooms } = useAppContext();
    const [guestName, setGuestName] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [error, setError] = useState('');
    const availableRooms = rooms.filter(r => r.occupancy < r.capacity);
    const [roomId, setRoomId] = useState('');
    
    useEffect(() => {
        if(availableRooms.length > 0 && !roomId) {
            setRoomId(availableRooms[0].id)
        }
    }, [availableRooms, roomId])

    useEffect(() => {
        if (!modalState.addReservation) {
            setGuestName('');
            setCheckIn('');
            setCheckOut('');
            setError('');
            if (availableRooms.length > 0) {
                setRoomId(availableRooms[0].id);
            }
        }
    }, [modalState.addReservation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (new Date(checkOut) <= new Date(checkIn)) {
            setError('La fecha de egreso debe ser posterior a la de ingreso.');
            return;
        }
        handleAddReservation({ guestName, checkIn, checkOut, roomId: parseInt(roomId) });
        handleCloseModal('addReservation');
    };

    return (
        <Modal isOpen={modalState.addReservation} onClose={() => handleCloseModal('addReservation')} title="Añadir Nueva Reserva">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div><Label htmlFor="res-name">Nombre del Huésped</Label><Input id="res-name" value={guestName} onChange={e => setGuestName(e.target.value)} required /></div>
                    <div>
                        <Label htmlFor="res-room">Habitación</Label>
                        <Select id="res-room" value={roomId} onChange={e => setRoomId(e.target.value)} disabled={availableRooms.length === 0}>
                            {availableRooms.length > 0 ? (
                                availableRooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity - r.occupancy} libres)</option>)
                            ) : (
                                <option>No hay habitaciones disponibles</option>
                            )}
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label htmlFor="res-checkin">Check-in</Label><Input id="res-checkin" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required min={todayISO()} /></div>
                        <div><Label htmlFor="res-checkout">Check-out</Label><Input id="res-checkout" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0] : todayISO()} /></div>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline" onClick={() => handleCloseModal('addReservation')}>Cancelar</Button>
                    <Button type="submit" disabled={availableRooms.length === 0}>Guardar Reserva</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddRuleModal = () => {
    const { modalState, handleCloseModal, handleSaveRule, ruleToEdit } = useAppContext();
    const [keyword, setKeyword] = useState(''); 
    const [reply, setReply] = useState(''); 
    const [isImproving, setIsImproving] = useState(false);
    
    useEffect(() => {
        if (modalState.addRule) {
            if (ruleToEdit) {
                if (typeof ruleToEdit === 'string') {
                     const words = ruleToEdit.toLowerCase().replace(/[^a-z0-9\s]/gi, '').split(' ');
                     const commonWords = new Set(['y', 'que', 'es', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'a', 'en', 'con', 'se', 'puede', 'tienen', 'hay', 'sobre', 'mi', 'tu', 'su', 'para']);
                     const meaningfulWords = words.filter(w => !commonWords.has(w) && w.length > 2);
                     setKeyword(meaningfulWords.join(' '));
                     setReply('');
                } else {
                    setKeyword(ruleToEdit.keyword);
                    setReply(ruleToEdit.reply);
                }
            } else {
                setKeyword('');
                setReply('');
            }
        }
    }, [ruleToEdit, modalState.addRule]);
    
    const handleImproveWithAI = async () => {
        if (!reply.trim()) return;
        setIsImproving(true);
        const prompt = `Re-escribe la siguiente respuesta para un huésped de hostel en un tono profesional, amable y servicial, al estilo europeo. No seas demasiado efusivo. Respuesta original: "${reply}"`;
        try {
            const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setReply(result.candidates[0].content.parts[0].text);
            }
        } catch (error) { console.error("Error calling Gemini API:", error); }
        setIsImproving(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSaveRule({ id: (typeof ruleToEdit !== 'string') ? ruleToEdit?.id : null, keyword, reply });
        handleCloseModal('addRule');
    }; 
    
    return (
        <Modal isOpen={modalState.addRule} onClose={() => handleCloseModal('addRule')} title={ruleToEdit && typeof ruleToEdit !== 'string' ? "Editar Regla" : "Añadir Regla al Asistente"}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="rule-keyword">Si la pregunta contiene estas palabras clave...</Label>
                        <Input id="rule-keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Ej: mascotas, pileta, check-in" required />
                    </div>
                    <div>
                        <Label htmlFor="rule-reply">El bot responderá esto:</Label>
                        <Textarea id="rule-reply" value={reply} onChange={e => setReply(e.target.value)} placeholder="Ej: No aceptamos mascotas." required rows="4" />
                        <Button type="button" variant="ghost" size="sm" onClick={handleImproveWithAI} disabled={isImproving || !reply} className="mt-2 text-teal-600">
                            <SparklesIcon className="mr-2"/>
                            {isImproving ? "Mejorando..." : "✨ Mejorar Tono con IA"}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline" onClick={() => handleCloseModal('addRule')}>Cancelar</Button>
                    <Button type="submit">Guardar Regla</Button>
                </div>
            </form>
        </Modal>
    );
};

const GeminiSuggestionModal = () => {
    const { modalState, handleCloseModal, suggestionState } = useAppContext();
    return (
        <Modal isOpen={modalState.geminiSuggestion} onClose={() => handleCloseModal('geminiSuggestion')} title="✨ Sugerencia de la IA">
            <div className="min-h-[200px]">
                {suggestionState.isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <SpinnerIcon className="w-10 h-10 text-teal-500" />
                        <p className="mt-4 text-slate-500">Generando ideas...</p>
                    </div>
                ) : (
                    <div className="text-slate-700 whitespace-pre-wrap">{suggestionState.text}</div>
                )}
            </div>
            <div className="flex justify-end mt-6">
                <Button onClick={() => handleCloseModal('geminiSuggestion')}>Cerrar</Button>
            </div>
        </Modal>
    );
};


// --- VISTAS PRINCIPALES (LANDING, REGISTER, DASHBOARD) ---
function LandingPage() {
    const { handleLoginClick, handleStartTrialClick } = useAppContext();
    return (
        <div style={{ background: 'radial-gradient(circle at 10% 20%, hsla(30, 40%, 96%, 0.5) 0px, transparent 50%), radial-gradient(circle at 80% 90%, hsla(200, 30%, 96%, 0.3) 0px, transparent 50%)', backgroundColor: '#FBF9F7' }}>
            <Header onLoginClick={handleLoginClick} onStartTrialClick={handleStartTrialClick} />
            <main>
                <HeroSection onStartTrialClick={handleStartTrialClick} />
                <FeaturesSection />
            </main>
        </div>
    );
}

function Dashboard() {
    const { activePanel } = useAppContext();
    const renderPanel = () => {
        switch (activePanel) {
            case 'resumen': return <ResumenPanel />;
            case 'reservas': return <ReservasPanel />;
            case 'habitaciones': return <HabitacionesPanel />;
            case 'mercaderia': return <MercaderiaPanel />;
            case 'mensajes': return <MensajesPanel />;
            case 'asistente': return <AsistentePanel />;
            default: return <ResumenPanel />;
        }
    };
    
    return (
        <div className="flex h-screen bg-[#FBF9F7]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">{renderPanel()}</main>
        </div>
    );
}

function RegistrationPage() {
    const { handleBackToHome, handleRegistrationSuccess } = useAppContext();
    const [step, setStep] = useState(1);

    const handleNextStep = () => setStep(s => s + 1);
    const handlePrevStep = () => setStep(s => s - 1);

    const Step1_Account = ({ onNext }) => ( <div className="bg-white p-8 rounded-xl shadow-md animate-fadeIn"> <h2 className="text-2xl font-bold mb-1">Creá tu cuenta</h2> <p className="text-slate-500 mb-6">Empecemos con tus datos de acceso.</p> <form onSubmit={(e) => { e.preventDefault(); onNext(); }}> <div className="grid md:grid-cols-2 gap-4"> <div><Label>Email</Label><Input type="email" placeholder="tu@email.com" required /></div> <div><Label>Contraseña</Label><Input type="password" required /></div> </div> <div className="mt-6 text-right"><Button type="submit">Siguiente</Button></div> </form> </div> );
    const Step2_HostelInfo = ({ onNext, onBack }) => ( <div className="bg-white p-8 rounded-xl shadow-md animate-fadeIn"> <h2 className="text-2xl font-bold mb-1">Contanos sobre tu hostel</h2> <p className="text-slate-500 mb-6">Esta información nos ayudará a configurar tu asistente.</p> <form onSubmit={(e) => { e.preventDefault(); onNext(); }}> <div className="grid md:grid-cols-2 gap-4"> <div><Label>Nombre del Hostel</Label><Input type="text" placeholder="Mi Hostel increíble" required /></div> <div><Label>País</Label><Input type="text" value="Argentina" readOnly /></div> <div className="md:col-span-2"><Label>WhatsApp del Hostel</Label><Input type="tel" placeholder="+549..." required /></div> </div> <div className="mt-6 flex justify-between"> <Button type="button" variant="ghost" onClick={onBack}>Atrás</Button> <Button type="submit">Ir al Pago</Button> </div> </form> </div> );
    const Step3_Payment = ({ onBack, onComplete }) => {
        const [paymentMethod, setPaymentMethod] = useState('card');
        return ( <div className="bg-white p-8 rounded-xl shadow-md animate-fadeIn"> <h2 className="text-2xl font-bold mb-1">Último paso: Suscripción</h2> <p className="text-slate-500 mb-6">Completá el pago para activar tu prueba de 15 días.</p> <div className="border rounded-lg overflow-hidden"> <div className="flex"> {['card', 'transfer', 'btc'].map(method => ( <button key={method} onClick={() => setPaymentMethod(method)} className={cn("flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2", paymentMethod === method ? "bg-teal-500 text-white" : "bg-slate-100 hover:bg-slate-200")}> {method === 'card' && <CreditCardIcon className="w-5 h-5"/>} {method === 'transfer' && <BankIcon className="w-5 h-5"/>} {method === 'btc' && <BtcIcon className="w-5 h-5"/>} <span>{method === 'card' ? 'Tarjeta' : method === 'transfer' ? 'Transferencia' : 'Bitcoin'}</span> </button> ))} </div> <div className="p-6"> {paymentMethod === 'card' && <div className="space-y-4 animate-fadeIn"><Input placeholder="Número de Tarjeta" /><div className="grid grid-cols-2 gap-4"><Input placeholder="MM/YY" /><Input placeholder="CVC" /></div><Input placeholder="Titular de la tarjeta" /></div>} {paymentMethod === 'transfer' && <div className="animate-fadeIn"><p className="text-sm text-slate-600">Por favor, transferí a la siguiente cuenta:</p><p className="font-mono bg-slate-100 p-2 rounded-md mt-2">CBU: 0001112223334445556667</p></div>} {paymentMethod === 'btc' && <div className="animate-fadeIn"><p className="text-sm text-slate-600">Por favor, enviá BTC a la siguiente dirección:</p><p className="font-mono bg-slate-100 p-2 rounded-md mt-2 break-all">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p></div>} </div> </div> <div className="mt-6 flex justify-between"> <Button type="button" variant="ghost" onClick={onBack}>Atrás</Button> <Button onClick={onComplete}>Completar Suscripción</Button> </div> </div> );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-2xl">
                <a href="#" onClick={(e) => { e.preventDefault(); handleBackToHome(); }} className="text-2xl font-bold text-slate-800 flex items-center justify-center mb-8">
                    <LogoIcon className="mr-2 text-teal-500" /><span>Fedebot</span>
                </a>
                {step === 1 && <Step1_Account onNext={handleNextStep} />}
                {step === 2 && <Step2_HostelInfo onNext={handleNextStep} onBack={handlePrevStep} />}
                {step === 3 && <Step3_Payment onBack={handlePrevStep} onComplete={handleRegistrationSuccess} />}
             </div>
        </div>
    );
}


// --- COMPONENTE PRINCIPAL Y RENDERIZADOR ---
function AppContent() {
    const { view, isLoggedIn, modalState, handleCloseModal, handleLoginSuccess, isLoggingOut } = useAppContext();
  
    const renderView = () => {
        if (!isLoggedIn) {
             switch(view) {
                case 'register': return <RegistrationPage />;
                case 'landing':
                default:
                    return <LandingPage />;
            }
        }
        return <Dashboard />;
    }
  
    return (
        <div className="bg-[#FBF9F7] text-slate-800" style={{ fontFamily: "'Inter', sans-serif"}}>
            {renderView()}

            <LoginModal 
                isOpen={modalState.login && !isLoggedIn}
                onClose={() => handleCloseModal('login')}
                onLoginSuccess={handleLoginSuccess}
            />
            <LogoutNotification isVisible={isLoggingOut} />
            
            {/* Modales globales del Dashboard */}
            {isLoggedIn && (
                <>
                    <AddRoomModal />
                    <AddReservationModal />
                    <AddRuleModal />
                    <GeminiSuggestionModal />
                </>
            )}
            
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap'); @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; } .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }`}</style>
        </div>
    );
}

// El componente App ahora solo envuelve todo en el Provider.
export { AppProvider, useAppContext, AppContent };
