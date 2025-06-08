import React, { useState, forwardRef, useEffect, useContext, createContext } from 'react';

// --- UTILIDADES Y CONFIGURACIÓN ---
function cn(...inputs) { return inputs.filter(Boolean).join(' '); }
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const todayISO = () => new Date().toISOString().split("T")[0];
// NOTA: Deberías reemplazar la clave de la API por una variable de entorno segura en producción.
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';

// --- ICONOS (Corregidos) ---
const LogoIcon = ({ className }) => ( <svg className={cn("w-8 h-8", className)} viewBox="0 0 24 24" ...> /* etc. */ </svg> );
// (La lista completa de iconos y componentes sigue igual)
// ...
// El componente App ahora solo envuelve todo en el Provider.
export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
