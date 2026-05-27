"use client";
import { useState, useEffect } from "react";

// 1. 핵심 클래스 설계
class Tea {
  constructor(public name: string, public tea_type: string, public stock: number) {}
}

class GreenTea extends Tea { constructor(name: string, stock: number) { super(name, "녹차", stock); } }
class BlackTea extends Tea { constructor(name: string, stock: number) { super(name, "홍차", stock); } }
class HerbTea extends Tea { constructor(name: string, stock: number) { super(name, "허브차", stock); } }

export default function TeaPage() {
  const [teas, setTeas] = useState<Tea[]>([]);

  useEffect(() => {
    // 2. 전체 데이터셋 12종 모두 포함
    setTeas([
      new GreenTea("세작", 5), new GreenTea("우전", 2), new GreenTea("용정차", 4), new GreenTea("말차", 0),
      new BlackTea("얼그레이", 8), new BlackTea("다즐링", 0), new BlackTea("아쌈", 6), new BlackTea("실론", 3),
      new HerbTea("페퍼민트", 7), new HerbTea("캐모마일", 1), new HerbTea("루이보스", 5), new HerbTea("히비스커스", 0)
    ]);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">1단계: OOP 클래스 및 12종 데이터 설계</h1>
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr><th className="border p-2">이름</th><th className="border p-2">종류</th><th className="border p-2">재고</th></tr>
        </thead>
        <tbody>
          {teas.map((t, i) => (
            <tr key={i}>
              <td className="border p-2">{t.name}</td>
              <td className="border p-2">{t.tea_type}</td>
              <td className="border p-2">{t.stock}개</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}