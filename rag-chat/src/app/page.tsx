// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User, Loader2, ExternalLink } from 'lucide-react';

// interface Message {
//   id: string;
//   content: string;
//   role: 'user' | 'assistant';
//   timestamp: string; // Change to string to avoid Date hydration issues
//   sources?: any[];
//   searchType?: string;
// }

// export default function JioPayChatbot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Handle client-side mounting
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Initialize welcome message after component mounts
//   useEffect(() => {
//     if (mounted && messages.length === 0) {
//       const welcomeMessage: Message = {
//         id: '1',
//         content: "Hi! I'm your JioPay Business assistant. Ask me anything about JioPay services, features, or policies.",
//         role: 'assistant',
//         timestamp: getCurrentTimestamp(),
//       };
//       setMessages([welcomeMessage]);
//     }
//   }, [mounted, messages.length]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     if (mounted) {
//       scrollToBottom();
//     }
//   }, [messages, mounted]);

//   // Consistent timestamp function
//   const getCurrentTimestamp = (): string => {
//     return new Date().toLocaleTimeString('en-US', {
//       hour12: true,
//       hour: 'numeric',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading || !mounted) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: input,
//       role: 'user',
//       timestamp: getCurrentTimestamp(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: input }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const assistantMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           content: data.answer,
//           role: 'assistant',
//           timestamp: getCurrentTimestamp(),
//           sources: data.sources,
//           searchType: data.searchType,
//         };

//         setMessages(prev => [...prev, assistantMessage]);
//       } else {
//         throw new Error(data.error || 'Something went wrong');
//       }
//     } catch (error) {
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: 'Sorry, I encountered an error. Please try again.',
//         role: 'assistant',
//         timestamp: getCurrentTimestamp(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Show nothing during SSR to prevent hydration mismatch
//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
//               <Bot className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-semibold text-gray-900">JioPay Business Assistant</h1>
//               <p className="text-sm text-gray-500">Get instant help with JioPay services</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Container */}
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
          
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6">
//             {messages.length === 0 ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="flex items-center space-x-2">
//                   <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
//                   <span className="text-gray-600">Loading chat...</span>
//                 </div>
//               </div>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//                     {/* Avatar */}
//                     <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                         message.role === 'user' 
//                           ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
//                           : 'bg-gradient-to-r from-green-500 to-emerald-600'
//                       }`}>
//                         {message.role === 'user' ? (
//                           <User className="w-4 h-4 text-white" />
//                         ) : (
//                           <Bot className="w-4 h-4 text-white" />
//                         )}
//                       </div>
//                     </div>

//                     {/* Message Content */}
//                     <div className={`rounded-2xl px-4 py-3 ${
//                       message.role === 'user'
//                         ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
//                         : 'bg-gray-100 text-gray-900'
//                     }`}>
//                       <div className="text-sm leading-relaxed whitespace-pre-wrap">
//                         {message.content}
//                       </div>
                      
//                       {/* Sources */}
//                       {message.sources && message.sources.length > 0 && (
//                         <div className="mt-3 pt-3 border-t border-gray-200">
//                           <div className="text-xs text-gray-600 mb-2">
//                             Sources ({message.searchType}):
//                           </div>
//                           <div className="space-y-1">
//                             {message.sources.slice(0, 3).map((source, idx) => (
//                               <div key={idx} className="text-xs bg-white bg-opacity-50 rounded-lg p-2">
//                                 <div className="flex items-start justify-between">
//                                   <span className="text-gray-700 flex-1">
//                                     [{source.id}] {source.content}
//                                   </span>
//                                   <ExternalLink className="w-3 h-3 text-gray-500 ml-2 flex-shrink-0" />
//                                 </div>
//                                 <div className="text-gray-500 mt-1">
//                                   {source.source_type} • {source.topic}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Timestamp */}
//                       <div className={`text-xs mt-2 ${
//                         message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
//                       }`}>
//                         {message.timestamp}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}

//             {/* Loading Indicator */}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="flex mr-3">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
//                     <Bot className="w-4 h-4 text-white" />
//                   </div>
//                 </div>
//                 <div className="bg-gray-100 rounded-2xl px-4 py-3">
//                   <div className="flex items-center space-x-2">
//                     <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
//                     <span className="text-sm text-gray-500">Thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Form */}
//           <div className="border-t p-4">
//             <form onSubmit={handleSubmit} className="flex space-x-3">
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Ask about JioPay Business features, policies, or support..."
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   disabled={isLoading || !mounted}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={!input.trim() || isLoading || !mounted}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </form>
            
//             {/* Quick Suggestions */}
//             <div className="mt-3 flex flex-wrap gap-2">
//               {[
//                 "How to create collect links?",
//                 "Settlement process",
//                 "Transaction fees",
//                 "App download"
//               ].map((suggestion, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setInput(suggestion)}
//                   className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors duration-200"
//                   disabled={isLoading || !mounted}
//                 >
//                   {suggestion}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User, Loader2, ExternalLink, X, FileText, MessageSquare, Hash } from 'lucide-react';

// interface Message {
//   id: string;
//   content: string;
//   role: 'user' | 'assistant';
//   timestamp: string;
//   sources?: any[];
//   searchType?: string;
// }

// interface SourcePopupProps {
//   source: any;
//   isOpen: boolean;
//   onClose: () => void;
// }

// function SourcePopup({ source, isOpen, onClose }: SourcePopupProps) {
//   if (!isOpen) return null;

//   const getSourceIcon = (sourceType: string) => {
//     switch (sourceType?.toLowerCase()) {
//       case 'pdf':
//         return <FileText className="w-4 h-4" />;
//       case 'faq':
//         return <MessageSquare className="w-4 h-4" />;
//       default:
//         return <Hash className="w-4 h-4" />;
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
//               {getSourceIcon(source.source_type)}
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">Source Details</h3>
//               <p className="text-sm text-gray-500">{source.source_type} • {source.topic}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>
        
//         <div className="p-6 overflow-y-auto max-h-[60vh]">
//           <div className="prose prose-sm max-w-none">
//             <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
//               <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
//                 {source.content}
//               </p>
//             </div>
            
//             {source.metadata && (
//               <div className="mt-4 pt-4 border-t border-gray-100">
//                 <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <span className="text-gray-500">ID:</span>
//                     <span className="ml-2 font-mono text-gray-800">{source.id}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Type:</span>
//                     <span className="ml-2 text-gray-800">{source.source_type}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Topic:</span>
//                     <span className="ml-2 text-gray-800">{source.topic}</span>
//                   </div>
//                   {source.similarity && (
//                     <div>
//                       <span className="text-gray-500">Relevance:</span>
//                       <span className="ml-2 text-gray-800">{(source.similarity * 100).toFixed(1)}%</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JioPayChatbot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [selectedSource, setSelectedSource] = useState<any>(null);
//   const [isSourcePopupOpen, setIsSourcePopupOpen] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (mounted && messages.length === 0) {
//       const welcomeMessage: Message = {
//         id: '1',
//         content: "👋 Hi! I'm your JioPay Business assistant. Ask me anything about JioPay services, features, or policies.",
//         role: 'assistant',
//         timestamp: getCurrentTimestamp(),
//       };
//       setMessages([welcomeMessage]);
//     }
//   }, [mounted, messages.length]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     if (mounted) {
//       scrollToBottom();
//     }
//   }, [messages, mounted]);

//   const getCurrentTimestamp = (): string => {
//     return new Date().toLocaleTimeString('en-US', {
//       hour12: true,
//       hour: 'numeric',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const handleSourceClick = (source: any) => {
//     setSelectedSource(source);
//     setIsSourcePopupOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading || !mounted) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: input,
//       role: 'user',
//       timestamp: getCurrentTimestamp(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: input }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const assistantMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           content: data.answer,
//           role: 'assistant',
//           timestamp: getCurrentTimestamp(),
//           sources: data.sources,
//           searchType: data.searchType,
//         };

//         setMessages(prev => [...prev, assistantMessage]);
//       } else {
//         throw new Error(data.error || 'Something went wrong');
//       }
//     } catch (error) {
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: '❌ Sorry, I encountered an error. Please try again.',
//         role: 'assistant',
//         timestamp: getCurrentTimestamp(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Modern Header */}
//       <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-6">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Bot className="w-7 h-7 text-white" />
//               </div>
//               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">JioPay Business Assistant</h1>
//               <p className="text-gray-600">AI-powered support for all your JioPay needs</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Container */}
//       <div className="max-w-6xl mx-auto px-6 py-8">
//         <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 h-[calc(100vh-220px)] flex flex-col overflow-hidden">
          
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-8 space-y-8">
//             {messages.length === 0 ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="flex items-center space-x-3">
//                   <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//                   <span className="text-gray-600 text-lg">Initializing chat...</span>
//                 </div>
//               </div>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//                     {/* Avatar */}
//                     <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}>
//                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
//                         message.role === 'user' 
//                           ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
//                           : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
//                       }`}>
//                         {message.role === 'user' ? (
//                           <User className="w-5 h-5 text-white" />
//                         ) : (
//                           <Bot className="w-5 h-5 text-white" />
//                         )}
//                       </div>
//                     </div>

//                     {/* Message Content */}
//                     <div className={`rounded-3xl px-6 py-4 shadow-lg ${
//                       message.role === 'user'
//                         ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
//                         : 'bg-white border border-gray-100'
//                     }`}>
//                       <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
//                         message.role === 'user' ? 'text-white' : 'text-gray-800'
//                       }`}>
//                         {message.content}
//                       </div>
                      
//                       {/* Sources */}
//                       {message.sources && message.sources.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                           <div className="flex items-center space-x-2 mb-3">
//                             <ExternalLink className="w-4 h-4 text-gray-500" />
//                             <span className="text-xs font-medium text-gray-600">
//                               Sources ({message.searchType}) • Click to view details
//                             </span>
//                           </div>
//                           <div className="space-y-2">
//                             {message.sources.slice(0, 3).map((source, idx) => (
//                               <button
//                                 key={idx}
//                                 onClick={() => handleSourceClick(source)}
//                                 className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-md group"
//                               >
//                                 <div className="flex items-start justify-between">
//                                   <div className="flex-1">
//                                     <div className="flex items-center space-x-2 mb-1">
//                                       <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
//                                         [{source.id}]
//                                       </span>
//                                       <span className="text-xs text-gray-500">
//                                         {source.source_type}
//                                       </span>
//                                     </div>
//                                     <p className="text-xs text-gray-700 line-clamp-2">
//                                       {source.content}
//                                     </p>
//                                     <div className="mt-1 text-xs text-gray-500">
//                                       Topic: {source.topic}
//                                     </div>
//                                   </div>
//                                   <ExternalLink className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
//                                 </div>
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Timestamp */}
//                       <div className={`text-xs mt-3 ${
//                         message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
//                       }`}>
//                         {message.timestamp}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}

//             {/* Loading Indicator */}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="flex mr-4">
//                   <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
//                     <Bot className="w-5 h-5 text-white" />
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-3xl px-6 py-4 shadow-lg border border-gray-100">
//                   <div className="flex items-center space-x-3">
//                     <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
//                     <span className="text-sm text-gray-600">Analyzing your query...</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Form */}
//           <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm p-6">
//             <form onSubmit={handleSubmit} className="flex space-x-4">
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Ask about JioPay Business features, policies, or support..."
//                   className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-gray-800 placeholder-gray-500 text-sm"
//                   disabled={isLoading || !mounted}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={!input.trim() || isLoading || !mounted}
//                 className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </form>
            
//             {/* Quick Suggestions */}
//             <div className="mt-4 flex flex-wrap gap-2">
//               {[
//                 "How to create collect links?",
//                 "Settlement process explained",
//                 "Transaction fees structure",
//                 "Download JioPay app"
//               ].map((suggestion, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setInput(suggestion)}
//                   className="px-4 py-2 text-sm bg-white hover:bg-gray-50 rounded-full text-gray-700 border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-blue-300"
//                   disabled={isLoading || !mounted}
//                 >
//                   {suggestion}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Source Popup */}
//       <SourcePopup
//         source={selectedSource}
//         isOpen={isSourcePopupOpen}
//         onClose={() => setIsSourcePopupOpen(false)}
//       />
//     </div>
//   );
// }




// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User, Loader2, ExternalLink, X, FileText, MessageSquare, Hash, Copy, Check } from 'lucide-react';

// interface Message {
//   id: string;
//   content: string;
//   role: 'user' | 'assistant';
//   timestamp: string;
//   sources?: any[];
//   searchType?: string;
// }

// interface SourcePopupProps {
//   source: any;
//   isOpen: boolean;
//   onClose: () => void;
// }

// function SourcePopup({ source, isOpen, onClose }: SourcePopupProps) {
//   const [copied, setCopied] = useState(false);

//   if (!isOpen) return null;

//   const getSourceIcon = (sourceType: string) => {
//     switch (sourceType?.toLowerCase()) {
//       case 'pdf':
//         return <FileText className="w-4 h-4" />;
//       case 'faq':
//         return <MessageSquare className="w-4 h-4" />;
//       default:
//         return <Hash className="w-4 h-4" />;
//     }
//   };

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(source.content);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//     }
//   };

//   // Close popup when clicking outside
//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
//           <div className="flex items-center space-x-4">
//             <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
//               {getSourceIcon(source.source_type)}
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-gray-900">Source Details</h3>
//               <p className="text-sm text-gray-600 flex items-center space-x-2">
//                 <span className="font-medium">{source.source_type}</span>
//                 <span>•</span>
//                 <span>{source.topic}</span>
//                 {source.similarity && (
//                   <>
//                     <span>•</span>
//                     <span className="text-green-600 font-medium">
//                       {(source.similarity * 100).toFixed(1)}% relevant
//                     </span>
//                   </>
//                 )}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={handleCopy}
//               className="p-2 hover:bg-white/70 rounded-xl transition-colors flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600"
//               title="Copy content"
//             >
//               {copied ? (
//                 <>
//                   <Check className="w-4 h-4" />
//                   <span>Copied!</span>
//                 </>
//               ) : (
//                 <>
//                   <Copy className="w-4 h-4" />
//                   <span>Copy</span>
//                 </>
//               )}
//             </button>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/70 rounded-xl transition-colors"
//               title="Close"
//             >
//               <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
//             </button>
//           </div>
//         </div>
        
//         {/* Content */}
//         <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
//           <div className="p-6">
//             {/* Source ID Badge */}
//             <div className="mb-4">
//               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
//                 ID: {source.id}
//               </span>
//             </div>

//             {/* Main Content */}
//             <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm">
//               <div className="prose prose-sm max-w-none">
//                 <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
//                   {source.content}
//                 </div>
//               </div>
//             </div>
            
//             {/* Metadata Section */}
//             {(source.metadata || source.source_type || source.topic) && (
//               <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
//                 <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
//                   <Hash className="w-4 h-4 mr-2 text-gray-500" />
//                   Metadata
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                   <div className="flex flex-col space-y-1">
//                     <span className="text-gray-500 font-medium">Document ID</span>
//                     <span className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded text-xs">
//                       {source.id}
//                     </span>
//                   </div>
//                   <div className="flex flex-col space-y-1">
//                     <span className="text-gray-500 font-medium">Content Type</span>
//                     <span className="text-gray-800 bg-gray-100 px-2 py-1 rounded text-xs capitalize">
//                       {source.source_type}
//                     </span>
//                   </div>
//                   <div className="flex flex-col space-y-1">
//                     <span className="text-gray-500 font-medium">Topic Category</span>
//                     <span className="text-gray-800 bg-gray-100 px-2 py-1 rounded text-xs">
//                       {source.topic}
//                     </span>
//                   </div>
//                   {source.similarity && (
//                     <div className="flex flex-col space-y-1">
//                       <span className="text-gray-500 font-medium">Relevance Score</span>
//                       <div className="flex items-center space-x-2">
//                         <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-2 py-1 rounded text-xs">
//                           <span className="text-green-800 font-medium">
//                             {(source.similarity * 100).toFixed(1)}%
//                           </span>
//                         </div>
//                         <div className="flex-1 bg-gray-200 rounded-full h-2">
//                           <div 
//                             className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
//                             style={{ width: `${source.similarity * 100}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Additional metadata if exists */}
//                 {source.metadata && typeof source.metadata === 'object' && (
//                   <div className="mt-4 pt-4 border-t border-gray-100">
//                     <h5 className="font-medium text-gray-700 mb-2">Additional Information</h5>
//                     <div className="grid grid-cols-1 gap-2 text-xs">
//                       {Object.entries(source.metadata).map(([key, value]) => (
//                         <div key={key} className="flex justify-between">
//                           <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
//                           <span className="text-gray-800 font-medium">{String(value)}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
//           <p className="text-xs text-gray-500 text-center">
//             This content is sourced from JioPay Business documentation and support materials.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function JioPayChatbot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [selectedSource, setSelectedSource] = useState<any>(null);
//   const [isSourcePopupOpen, setIsSourcePopupOpen] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (mounted && messages.length === 0) {
//       const welcomeMessage: Message = {
//         id: '1',
//         content: "👋 Hi! I'm your JioPay Business assistant. Ask me anything about JioPay services, features, or policies.",
//         role: 'assistant',
//         timestamp: getCurrentTimestamp(),
//       };
//       setMessages([welcomeMessage]);
//     }
//   }, [mounted, messages.length]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     if (mounted) {
//       scrollToBottom();
//     }
//   }, [messages, mounted]);

//   const getCurrentTimestamp = (): string => {
//     return new Date().toLocaleTimeString('en-US', {
//       hour12: true,
//       hour: 'numeric',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const handleSourceClick = (source: any) => {
//     setSelectedSource(source);
//     setIsSourcePopupOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading || !mounted) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: input,
//       role: 'user',
//       timestamp: getCurrentTimestamp(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: input }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const assistantMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           content: data.answer,
//           role: 'assistant',
//           timestamp: getCurrentTimestamp(),
//           sources: data.sources,
//           searchType: data.searchType,
//         };

//         setMessages(prev => [...prev, assistantMessage]);
//       } else {
//         throw new Error(data.error || 'Something went wrong');
//       }
//     } catch (error) {
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: '❌ Sorry, I encountered an error. Please try again.',
//         role: 'assistant',
//         timestamp: getCurrentTimestamp(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Modern Header */}
//       <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-6">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Bot className="w-7 h-7 text-white" />
//               </div>
//               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">JioPay Business Assistant</h1>
//               <p className="text-gray-600">AI-powered support for all your JioPay needs</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Container */}
//       <div className="max-w-6xl mx-auto px-6 py-8">
//         <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 h-[calc(100vh-220px)] flex flex-col overflow-hidden">
          
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-8 space-y-8">
//             {messages.length === 0 ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="flex items-center space-x-3">
//                   <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//                   <span className="text-gray-600 text-lg">Initializing chat...</span>
//                 </div>
//               </div>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//                     {/* Avatar */}
//                     <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}>
//                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
//                         message.role === 'user' 
//                           ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
//                           : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
//                       }`}>
//                         {message.role === 'user' ? (
//                           <User className="w-5 h-5 text-white" />
//                         ) : (
//                           <Bot className="w-5 h-5 text-white" />
//                         )}
//                       </div>
//                     </div>

//                     {/* Message Content */}
//                     <div className={`rounded-3xl px-6 py-4 shadow-lg ${
//                       message.role === 'user'
//                         ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
//                         : 'bg-white border border-gray-100'
//                     }`}>
//                       <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
//                         message.role === 'user' ? 'text-white' : 'text-gray-800'
//                       }`}>
//                         {message.content}
//                       </div>
                      
//                       {/* Sources */}
//                       {message.sources && message.sources.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                           <div className="flex items-center space-x-2 mb-3">
//                             <ExternalLink className="w-4 h-4 text-gray-500" />
//                             <span className="text-xs font-medium text-gray-600">
//                               Sources ({message.searchType}) • Click to view full content
//                             </span>
//                           </div>
//                           <div className="space-y-2">
//                             {message.sources.slice(0, 3).map((source, idx) => (
//                               <button
//                                 key={idx}
//                                 onClick={() => handleSourceClick(source)}
//                                 className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-md group"
//                               >
//                                 <div className="flex items-start justify-between">
//                                   <div className="flex-1">
//                                     <div className="flex items-center space-x-2 mb-1">
//                                       <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
//                                         [{source.id}]
//                                       </span>
//                                       <span className="text-xs text-gray-500">
//                                         {source.source_type}
//                                       </span>
//                                     </div>
//                                     <p className="text-xs text-gray-700 line-clamp-2">
//                                       {source.content.substring(0, 120)}...
//                                     </p>
//                                     <div className="mt-1 text-xs text-gray-500">
//                                       Topic: {source.topic}
//                                     </div>
//                                   </div>
//                                   <ExternalLink className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
//                                 </div>
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Timestamp */}
//                       <div className={`text-xs mt-3 ${
//                         message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
//                       }`}>
//                         {message.timestamp}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}

//             {/* Loading Indicator */}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="flex mr-4">
//                   <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
//                     <Bot className="w-5 h-5 text-white" />
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-3xl px-6 py-4 shadow-lg border border-gray-100">
//                   <div className="flex items-center space-x-3">
//                     <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
//                     <span className="text-sm text-gray-600">Analyzing your query...</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Form */}
//           <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm p-6">
//             <form onSubmit={handleSubmit} className="flex space-x-4">
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Ask about JioPay Business features, policies, or support..."
//                   className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-gray-800 placeholder-gray-500 text-sm"
//                   disabled={isLoading || !mounted}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={!input.trim() || isLoading || !mounted}
//                 className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </form>
            
//             {/* Quick Suggestions */}
//             <div className="mt-4 flex flex-wrap gap-2">
//               {[
//                 "How to create collect links?",
//                 "Settlement process explained",
//                 "Transaction fees structure",
//                 "Download JioPay app"
//               ].map((suggestion, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setInput(suggestion)}
//                   className="px-4 py-2 text-sm bg-white hover:bg-gray-50 rounded-full text-gray-700 border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-blue-300"
//                   disabled={isLoading || !mounted}
//                 >
//                   {suggestion}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Source Popup */}
//       <SourcePopup
//         source={selectedSource}
//         isOpen={isSourcePopupOpen}
//         onClose={() => setIsSourcePopupOpen(false)}
//       />
//     </div>
//   );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ExternalLink, X, FileText, MessageSquare, Hash, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sources?: any[];
  searchType?: string;
}

interface SourcePopupProps {
  source: any;
  isOpen: boolean;
  onClose: () => void;
}

function SourcePopup({ source, isOpen, onClose }: SourcePopupProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType?.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'faq':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Close popup when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              {getSourceIcon(source.source_type)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Source Content</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="font-medium">{source.source_type}</span>
                <span>•</span>
                <span>{source.topic}</span>
                {source.similarity && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-medium">
                      {(source.similarity * 100).toFixed(1)}% relevant
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  ID: {source.id}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white/70 rounded-xl transition-colors flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600"
              title="Copy content"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/70 rounded-xl transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Content - Full height available for text */}
        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(80vh - 140px)' }}>
          <div className="p-6">
            {/* Main Content - Full display */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base font-medium">
                {source.content}
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500 text-center">
            JioPay Business Documentation • {source.source_type} • {source.topic}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JioPayChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [isSourcePopupOpen, setIsSourcePopupOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: "Hi! I'm your JioPay Business assistant. Ask me anything about JioPay services, features, or policies.",
        role: 'assistant',
        timestamp: getCurrentTimestamp(),
      };
      setMessages([welcomeMessage]);
    }
  }, [mounted, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [messages, mounted]);

  const getCurrentTimestamp = (): string => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleSourceClick = (source: any) => {
    setSelectedSource(source);
    setIsSourcePopupOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !mounted) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: getCurrentTimestamp(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.answer,
          role: 'assistant',
          timestamp: getCurrentTimestamp(),
          sources: data.sources,
          searchType: data.searchType,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '❌ Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: getCurrentTimestamp(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JioPay Business Assistant</h1>
              <p className="text-gray-600">AI-powered support for all your JioPay needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 h-[calc(100vh-220px)] flex flex-col overflow-hidden">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-gray-600 text-lg">Initializing chat...</span>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`rounded-3xl px-6 py-4 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white border border-gray-100'
                    }`}>
                      <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        message.role === 'user' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {message.content}
                      </div>
                      
                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">
                              Sources ({message.searchType}) • Click to view full content
                            </span>
                          </div>
                          <div className="space-y-2">
                            {message.sources.slice(0, 3).map((source, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSourceClick(source)}
                                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-all duration-200 hover:shadow-md group"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                        [{source.id}]
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {source.source_type}
                                      </span>
                                      {source.similarity && (
                                        <span className="text-xs text-green-600 font-medium">
                                          {(source.similarity * 100).toFixed(1)}%
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-700 line-clamp-2">
                                      {source.content.substring(0, 120)}...
                                    </p>
                                    <div className="mt-1 text-xs text-gray-500">
                                      Topic: {source.topic}
                                    </div>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className={`text-xs mt-3 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex mr-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="bg-white rounded-3xl px-6 py-4 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                    <span className="text-sm text-gray-600">Analyzing your query...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about JioPay Business features, policies, or support..."
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-gray-800 placeholder-gray-500 text-sm"
                  disabled={isLoading || !mounted}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading || !mounted}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            {/* Quick Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "How to create collect links?",
                "Settlement process explained",
                "Transaction fees structure",
                "Download JioPay app"
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 text-sm bg-white hover:bg-gray-50 rounded-full text-gray-700 border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-blue-300"
                  disabled={isLoading || !mounted}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Source Popup */}
      <SourcePopup
        source={selectedSource}
        isOpen={isSourcePopupOpen}
        onClose={() => setIsSourcePopupOpen(false)}
      />
    </div>
  );
}