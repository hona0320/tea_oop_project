"use client";
import { useState, useEffect } from "react";

// 클래스 구조 유지
class Tea { constructor(public name: string, public tea_type: string, public stock: number) {} }
class GreenTea extends Tea { constructor(name: string, stock: number) { super(name, "녹차", stock); } }
class BlackTea extends Tea { constructor(name: string, stock: number) { super(name, "홍차", stock); } }
class HerbTea extends Tea { constructor(name: string, stock: number) { super(name, "허브차", stock); } }

export default function TeaPage() {
  const [teas, setTeas] = useState<Tea[]>([]);

  useEffect(() => {
    setTeas([
      new GreenTea("세작", 5), new GreenTea("우전", 2), new GreenTea("용정차", 4), new GreenTea("말차", 0),
      new BlackTea("얼그레이", 8), new BlackTea("다즐링", 0), new BlackTea("아쌈", 6), new BlackTea("실론", 3),
      new HerbTea("페퍼민트", 7), new HerbTea("캐모마일", 1), new HerbTea("루이보스", 5), new HerbTea("히비스커스", 0)
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Premium Tea Lounge
        </h1>
        <p className="text-neutral-500">객체 지향으로 관리되는 차별화된 티 컬렉션</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {teas.map((t, i) => (
          <div key={i} className="group relative p-4 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-emerald-500 transition-all duration-300">
            <h3 className="font-bold text-lg mb-1">{t.name}</h3>
            <p className="text-xs text-neutral-500 mb-3">{t.tea_type}</p>
            <div className={`text-xs font-mono font-bold ${t.stock > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
              {t.stock > 0 ? `재고 ${t.stock}개` : "품절"}
            </div>
            <div className="mt-4 h-1 w-0 bg-emerald-500 group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}