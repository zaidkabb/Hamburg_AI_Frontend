'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

type MessageRole = 'user' | 'assistant' | 'error';

interface Message {
    role: MessageRole;
    content: string;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatResponse = (text: string): string => {
        let formatted = text;
        formatted = formatted.replace(/#{1,6}\s+/g, '');
        formatted = formatted.replace(/\*\*/g, '');
        formatted = formatted.replace(/^[•\-]\s+/gm, '');
        formatted = formatted.replace(/\n{3,}/g, '\n\n');
        return formatted.trim();
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
             const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'https://hamburg-ai-backend.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: 'web-session'
                })
            });

            const data = await response.json();
            const formattedResponse = formatResponse(data.response);
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: formattedResponse
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'error',
                content: 'Unable to connect. Please ensure the backend is running.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] font-inter">
            {/* Hero Section with Hamburg Background */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <div 
                        className="w-full h-full bg-cover bg-center opacity-30"
                        style={{
                            backgroundImage: 'url(/mnt/user-data/uploads/92675-town-hamburg-horizon-landmark-city-1920x1080.jpg)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/95 to-[#141414]/50" />
                </div>

                {/* Content */}
                <div className="container relative z-10 px-6 lg:px-12 py-20 mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <p className="text-[#D4AF37] text-sm font-inter tracking-wider uppercase mb-6 animate-fade-in">
                            Dein KI-gestützter Reiseführer
                        </p>
                        
                        <h1 className="font-playfair text-5xl md:text-7xl mb-8 leading-tight text-white animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <span className="italic">Entdecke</span><br />
                            <span className="font-bold">Hamburg</span>
                        </h1>

                        <p className="text-gray-400 text-lg mb-10 leading-relaxed animate-fade-in font-inter max-w-2xl" style={{ animationDelay: '0.2s' }}>
                            Dein intelligenter Assistent für Wetter, Sehenswürdigkeiten, Wegbeschreibungen und Events in Hamburg. 
                            Powered by KI mit Echtzeitdaten und lokalem Wissen.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            {[
                                { icon: '🌤️', label: 'Wetter' },
                                { icon: '📍', label: 'Orte' },
                                { icon: '🗺️', label: 'Richtungen' },
                                { icon: '🎉', label: 'Events' }
                            ].map((feature, index) => (
                                <div 
                                    key={index}
                                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 text-center hover:border-[#D4AF37]/50 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="text-3xl mb-2">{feature.icon}</div>
                                    <div className="text-sm text-gray-300 font-medium">{feature.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-[#D4AF37]/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-[#D4AF37] rounded-full" />
                    </div>
                </div>
            </section>

            {/* Floating Chat Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full shadow-2xl bg-[#D4AF37] hover:bg-[#C4A137] hover:scale-110 transition-all duration-300 group flex items-center justify-center"
                aria-label="Hamburg AI Chat öffnen"
            >
                {isChatOpen ? (
                    <X className="h-6 w-6 text-[#141414]" />
                ) : (
                    <MessageCircle className="h-6 w-6 text-[#141414] group-hover:animate-pulse" />
                )}
            </button>

            {/* Chat Window */}
            {isChatOpen && (
                <div className="fixed bottom-28 right-8 z-40 w-[450px] h-[600px] bg-[#1a1a1a] border-2 border-[#D4AF37] rounded-2xl shadow-2xl animate-scale-in overflow-hidden flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#C4A137] p-6">
                        <h3 className="font-playfair text-2xl font-bold text-[#141414] mb-1">
                            Hamburg AI Assistant
                        </h3>
                        <p className="text-[#141414]/80 text-sm font-inter">
                            Frag mich alles über Hamburg
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#141414' }}>
                        {messages.length === 0 && (
                            <div className="text-center py-12">
                                <MessageCircle className="w-16 h-16 text-[#D4AF37]/30 mx-auto mb-4" />
                                <p className="text-gray-500 font-inter text-sm">
                                    Starte ein Gespräch...
                                </p>
                                <div className="mt-6 space-y-2">
                                    {[
                                        'Wie ist das Wetter?',
                                        'Finde Restaurants',
                                        'Was kann ich heute tun?'
                                    ].map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInput(suggestion)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-[#D4AF37] hover:bg-[#1a1a1a] rounded-lg transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                        message.role === 'user'
                                            ? 'bg-[#D4AF37] text-[#141414]'
                                            : message.role === 'error'
                                                ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                                                : 'bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]'
                                    }`}
                                >
                                    <div 
                                        className="text-[15px] leading-relaxed whitespace-pre-wrap"
                                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <span className="text-sm text-gray-500">Denke nach...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-[#2a2a2a] p-4 bg-[#1a1a1a]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Schreibe eine Nachricht..."
                                disabled={isLoading}
                                className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="bg-[#D4AF37] text-[#141414] p-3 rounded-xl font-medium hover:bg-[#C4A137] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center justify-center min-w-[50px]"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="border-t border-[#2a2a2a] py-8 px-6 lg:px-12 bg-[#141414]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm font-inter">
                            © 2024 Hamburg AI Assistant. Alle Rechte vorbehalten.
                        </p>
                        <p className="font-playfair text-lg text-white">
                            Powered by <span className="text-[#D4AF37]">DeepSeek AI</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }

                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');

                .font-playfair {
                    font-family: 'Playfair Display', serif;
                }

                .font-inter {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
        </div>
    );
}