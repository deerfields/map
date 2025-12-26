import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, Blob, FunctionDeclaration } from '@google/genai';
import { Unit } from '../types';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  isArabic: boolean;
  onNavigate: (unitId: string) => void;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose, units, isArabic, onNavigate }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      if ((sessionRef.current as any)._videoInterval) {
        clearInterval((sessionRef.current as any)._videoInterval);
      }
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) inputAudioCtxRef.current.close().catch(() => {});
    if (outputAudioCtxRef.current) outputAudioCtxRef.current.close().catch(() => {});
    setIsConnecting(false);
    setStatus('idle');
  }, []);

  const startSession = async () => {
    if (!process.env.API_KEY) {
      onClose();
      return;
    }

    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { width: 640, height: 480, frameRate: 10 } 
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const storeKnowledge = units.map(u => ({ 
        id: u.id, 
        name: isArabic ? u.nameAr : u.nameEn, 
        floor: u.floor,
        type: u.type,
        category: u.category
      }));

      const navTool: FunctionDeclaration = {
        name: 'setDestination',
        parameters: {
          type: Type.OBJECT,
          description: 'Starts navigation to a mall store or amenity.',
          properties: {
            storeId: { type: Type.STRING },
            storeName: { type: Type.STRING }
          },
          required: ['storeId', 'storeName']
        }
      };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          tools: [{ functionDeclarations: [navTool] }],
          systemInstruction: `You are the Deerfields Mall Live Concierge. Respond in ${isArabic ? 'Arabic' : 'English'}.`
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setStatus('listening');

            const source = inputAudioCtxRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioCtxRef.current!.destination);

            const interval = setInterval(() => {
              if (!canvasRef.current || !videoRef.current) return;
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, 320, 240);
                canvasRef.current.toBlob(async (blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.6);
              }
            }, 1000);
            (sessionRef.current as any)._videoInterval = interval;
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                if (fc.name === 'setDestination') {
                  onNavigate((fc.args as any).storeId);
                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "ok" } }
                  }));
                }
              }
            }
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioCtxRef.current) {
              setStatus('speaking');
              const buffer = await decodeAudioData(decode(audioData), outputAudioCtxRef.current, 24000);
              const source = outputAudioCtxRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outputAudioCtxRef.current.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioCtxRef.current.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
            }
          },
          onclose: () => stopSession(),
          onerror: () => stopSession()
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      stopSession();
    }
  };

  useEffect(() => {
    if (isOpen) startSession();
    return () => stopSession();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative w-full max-w-4xl h-[85vh] bg-white/5 border border-white/10 rounded-[4rem] flex flex-col items-center justify-center overflow-hidden animate-in zoom-in duration-500">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-white/20 overflow-hidden shadow-2xl mb-12">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          <canvas ref={canvasRef} className="hidden" width="320" height="240" />
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-12">
          {isConnecting ? (isArabic ? 'اتصال...' : 'Connecting...') : (isArabic ? 'المساعد مباشر' : 'Live Guide')}
        </h2>
        <button onClick={onClose} className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-white/10">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default VoiceAssistant;