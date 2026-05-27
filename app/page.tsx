"use client";

import { useState, useEffect } from "react";

// ==========================================
// 1. 클래스 설계 (Python 원본 코드 100% 유지)
// ==========================================

class Tea {
  name: string;
  tea_type: string;
  stock: number;

  constructor(name: string, tea_type: string, stock: number) {
    this.name = name;
    this.tea_type = tea_type;
    this.stock = stock;
  }

  choice(): boolean {
    if (this.stock === 0) return false;
    return true;
  }

  reduce_stock(): void {
    if (this.stock > 0) {
      this.stock -= 1;
    }
  }

  brew_Tea(): string {
    this.reduce_stock();
    return `<${this.name} 완성>\n남은 재고: ${this.stock}개`;
  }
}

class GreenTea extends Tea {
  constructor(name: string, stock: number = 0) {
    super(name, "녹차", stock);
  }
  brew_Tea(): string {
    const parentResult = super.brew_Tea();
    return `80도의 물에서 2분간 우려냅니다. 너무 뜨거운 물에 우리면 떫은 맛이 납니다.\n${parentResult}`;
  }
}

class BlackTea extends Tea {
  constructor(name: string, stock: number = 0) {
    super(name, "홍차", stock);
  }
  brew_Tea(): string {
    const parentResult = super.brew_Tea();
    return `100도의 물에서 4분간 우려냅니다.\n${parentResult}`;
  }
}

class HerbTea extends Tea {
  constructor(name: string, stock: number = 0) {
    super(name, "허브차", stock);
  }
  brew_Tea(): string {
    const parentResult = super.brew_Tea();
    return `90도의 물에서 5분간 우려냅니다. 기호에 따라 5분 이상 우려도 됩니다.\n${parentResult}`;
  }
}

// ==========================================
// 2. UI 컴포넌트 (가산점 UX 기능 추가)
// ==========================================

export default function PremiumTeaApp() {
  const [teas, setTeas] = useState<Tea[]>([]);
  const [activeInstance, setActiveInstance] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ lines: string[], type: string } | null>(null);
  const [showImmersiveView, setShowImmersiveView] = useState(false);
  const [brewingTea, setBrewingTea] = useState<Tea | null>(null);

  const [bgError, setBgError] = useState(false);
  const [imgError, setImgError] = useState(false);

  // ✨ 가산점 UX 1: 품절 숨기기 상태
  const [hideSoldOut, setHideSoldOut] = useState(false);
  
  // ✨ 가산점 UX 2: 주문 내역(History) 상태
  const [orderHistory, setOrderHistory] = useState<{name: string, time: string}[]>([]);

  useEffect(() => {
    setTeas([
      new GreenTea("세작", 5),
      new GreenTea("우전", 2),
      new GreenTea("용정차", 4),
      new GreenTea("말차", 0),
      new BlackTea("얼그레이", 8),
      new BlackTea("다즐링", 0),
      new BlackTea("아쌈", 6),
      new BlackTea("실론", 3),
      new HerbTea("페퍼민트", 7),
      new HerbTea("캐모마일", 1),
      new HerbTea("루이보스", 5),
      new HerbTea("히비스커스", 0),
    ]);
  }, []);

  const handleOrder = (index: number) => {
    const newTeas = [...teas];
    const selectedTea = newTeas[index];

    if (selectedTea.choice()) {
      setBgError(false);
      setImgError(false);
      setActiveInstance(selectedTea.name);
      setBrewingTea(selectedTea); 
      
      const resultMessage = selectedTea.brew_Tea();
      
      // ✨ 주문 내역 업데이트 로직
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setOrderHistory(prev => [{ name: selectedTea.name, time: currentTime }, ...prev].slice(0, 5)); // 최신 5개만 유지
      
      setTeas(newTeas);
      setNotification({
        lines: resultMessage.split('\n'),
        type: selectedTea.tea_type
      });

      setShowImmersiveView(true);

      setTimeout(() => {
        setNotification(null);
        setActiveInstance(null);
        setShowImmersiveView(false);
        setBrewingTea(null);
      }, 4000);
    }
  };

  const getTeaImageUrl = (type: string | undefined): string => {
    switch (type) {
      case '녹차': return '/green.jpg';
      case '홍차': return '/black.jpg';
      case '허브차': return '/herb.jpg';
      default: return '';
    }
  };

  const groupedTeas = {
    "GreenTea Class": teas.filter(t => t instanceof GreenTea),
    "BlackTea Class": teas.filter(t => t instanceof BlackTea),
    "HerbTea Class": teas.filter(t => t instanceof HerbTea),
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-neutral-800 font-sans p-6 md:p-12 relative overflow-x-hidden">
      
      {/* 헤더 및 컨트롤 패널 */}
      <header className="max-w-6xl mx-auto mb-10 text-center relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-2">
          OOP 계층형 아키텍처
        </h1>
        <p className="text-neutral-500 font-medium mb-6">
          ADT ➔ Base ➔ Class ➔ Instance 구조 및 다형성 시각화
        </p>

        {/* ✨ UX 기능: 품절 메뉴 숨기기 토글 */}
        <div className="flex items-center justify-center gap-3 bg-white inline-flex px-5 py-3 rounded-full shadow-sm border border-neutral-200">
          <span className="text-sm font-bold text-neutral-600">품절(Sold Out) 숨기기</span>
          <button 
            onClick={() => setHideSoldOut(!hideSoldOut)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${hideSoldOut ? 'bg-neutral-800' : 'bg-neutral-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${hideSoldOut ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto relative z-10 pb-20">
        {/* ADT & Base Class 시각화 */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="border-2 border-dashed border-neutral-400 bg-neutral-100 px-10 py-3 rounded-xl text-center shadow-sm">
            <h2 className="font-bold text-neutral-600 tracking-wide text-lg">Tea ADT Class</h2>
            <p className="text-xs text-neutral-500 mt-1 font-mono">Abstract Property & Method</p>
          </div>
          <div className="w-px h-6 bg-neutral-400"></div>
          <div className="border-2 border-neutral-800 bg-neutral-800 text-white px-12 py-4 rounded-xl text-center shadow-lg">
            <h2 className="font-bold tracking-wide text-xl">Tea Base Class</h2>
            <p className="text-xs text-neutral-300 mt-1 font-mono">name, stock, brew_Tea(), choice() ...</p>
          </div>
          <div className="w-px h-8 bg-neutral-800"></div>
          <div className="w-[80%] md:w-[66%] h-1 bg-neutral-800 rounded-t-full"></div>
        </div>

        {/* 자식 클래스 및 객체 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(groupedTeas).map(([className, instances]) => {
            const classColor = 
              className.includes("Green") ? "border-green-500 bg-green-50/50" : 
              className.includes("Black") ? "border-red-500 bg-red-50/50" : 
              "border-blue-500 bg-blue-50/50";
            const icon = className.includes("Green") ? "🍵" : className.includes("Black") ? "☕" : "🌿";

            return (
              <div key={className} className="relative flex flex-col items-center">
                <div className="w-1 h-6 bg-neutral-800 rounded-b-full mb-2"></div>
                <div className={`w-full flex flex-col bg-white rounded-3xl border-t-8 shadow-lg p-6 ${classColor}`}>
                  <div className="text-center mb-6 border-b border-neutral-200 pb-4">
                    <div className="text-5xl mb-3">{icon}</div>
                    <h2 className="text-2xl font-black text-neutral-800 tracking-wide">{className}</h2>
                    <p className="text-xs text-neutral-500 mt-2 font-mono">extends Tea Base</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1 px-1">
                      Instances
                    </h3>
                    
                    {instances.map((tea) => {
                      const realIndex = teas.findIndex(t => t.name === tea.name);
                      const isSoldOut = tea.stock === 0;
                      const isBrewing = activeInstance === tea.name;

                      // ✨ UX 기능: 품절 숨기기가 켜져있고 재고가 0이면 렌더링하지 않음
                      if (hideSoldOut && isSoldOut) return null;

                      return (
                        <button
                          key={tea.name}
                          onClick={() => handleOrder(realIndex)}
                          disabled={isSoldOut || activeInstance !== null}
                          className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                            ${isSoldOut 
                              ? "bg-neutral-100 border-neutral-200 opacity-60 cursor-not-allowed grayscale" 
                              : "bg-white border-neutral-200 hover:border-neutral-800 hover:shadow-md cursor-pointer"}
                            ${isBrewing ? "ring-2 ring-neutral-800 bg-neutral-50 scale-[1.02]" : ""}
                          `}
                        >
                          <div className="text-left">
                            <div className="font-bold text-neutral-800">{tea.name}</div>
                            <div className="text-[10px] text-neutral-500 mt-1">{tea.tea_type} 인스턴스</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isSoldOut && (
                              <span className="text-[9px] font-black bg-neutral-800 text-white px-2 py-1 rounded-md">
                                SOLD OUT
                              </span>
                            )}
                            <div className="text-right w-8">
                              <div className={`text-lg font-black ${isSoldOut ? "text-neutral-400" : "text-neutral-900"}`}>
                                {tea.stock}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ✨ UX 기능: 사이드 주문 내역 영수증 패널 */}
      {orderHistory.length > 0 && (
        <div className="fixed bottom-6 right-6 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200 p-4 z-40 animate-fade-in hidden md:block">
          <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-2">
            <span className="text-lg">🧾</span>
            <h3 className="font-bold text-neutral-800 text-sm">실시간 주문 내역</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {orderHistory.map((order, idx) => (
              <li key={idx} className="flex justify-between items-center text-xs">
                <span className={`font-semibold ${idx === 0 ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  {order.name} 추출
                </span>
                <span className="text-neutral-400 font-mono">{order.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 몰입형 찻집 뷰 (Glassmorphism + Fallback Emoji) */}
      {showImmersiveView && notification && brewingTea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 animate-fade-in">
          <div 
            className={`absolute inset-0 transition-colors duration-500 ${bgError ? 'bg-gradient-to-br from-stone-800 to-stone-900' : 'bg-cover bg-center'}`}
            style={bgError ? {} : { backgroundImage: "url('/bg.jpg')" }}
          >
            <img src="/bg.jpg" className="hidden" onError={() => setBgError(true)} alt="background check"/>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          </div>

          <div className="relative z-10 overflow-hidden bg-white/20 backdrop-blur-xl px-10 py-10 rounded-[3rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col md:flex-row items-center gap-10 max-w-5xl w-full animate-scale-in">
            <div className={`absolute top-0 left-0 h-2 animate-progress-bar
              ${notification.type === '녹차' ? 'bg-gradient-to-r from-green-300 to-emerald-500' : 
                notification.type === '홍차' ? 'bg-gradient-to-r from-red-300 to-orange-500' : 
                'bg-gradient-to-r from-blue-300 to-teal-500'}
            `}></div>

            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="relative p-2 bg-white/30 rounded-full border border-white/40 shadow-inner flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
                {!imgError ? (
                  <img 
                    src={getTeaImageUrl(notification.type)} 
                    alt={brewingTea.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-full shadow-2xl animate-tea-image-in border-4 border-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-full shadow-2xl animate-tea-image-in border-4 border-white bg-white/40 backdrop-blur-md flex items-center justify-center text-9xl">
                    {notification.type === '녹차' ? '🍵' : notification.type === '홍차' ? '☕' : '🌿'}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-white/10 pointer-events-none"></div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-5 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                    ${notification.type === '녹차' ? 'bg-green-300' : notification.type === '홍차' ? 'bg-red-300' : 'bg-blue-300'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 
                    ${notification.type === '녹차' ? 'bg-green-400' : notification.type === '홍차' ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                </span>
                <span className="text-xs font-black tracking-widest text-white/70 uppercase">
                  Polymorphism System Check
                </span>
              </div>

              <div className="text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                {notification.lines[0]}
              </div>

              <div className="bg-neutral-900/40 rounded-2xl p-5 border border-neutral-800/50 mt-2 backdrop-blur-md">
                <div className="text-[11px] text-neutral-300 font-bold mb-1.5 font-mono uppercase tracking-wider">
                  ↳ super.brew_Tea() Result
                </div>
                <div className="text-base font-semibold text-neutral-100">
                  {notification.lines[1]}
                </div>
                <div className="text-xl md:text-2xl font-black text-white mt-1.5">
                  {notification.lines[2]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
          
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          
          @keyframes teaImageIn { from { opacity: 0; transform: scale(0.5) rotate(-15deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
          .animate-tea-image-in { animation: teaImageIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s; }

          @keyframes progress { 0% { width: 100%; } 100% { width: 0%; } }
          .animate-progress-bar { animation: progress 4s linear forwards; }
        `
      }} />
    </div>
  );
}