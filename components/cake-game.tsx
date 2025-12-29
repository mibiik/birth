"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cake, Sparkles, Type } from "lucide-react"
import confetti from "canvas-confetti"

// Pasta renkleri
const cakeColors = [
  "#FF9999", // Açık pembe
  "#FFCCCC", // Çok açık pembe
  "#FF66B2", // Koyu pembe
  "#FFCC99", // Şeftali
  "#FFFFCC", // Açık sarı
  "#CCFFCC", // Açık yeşil
  "#99CCFF", // Açık mavi
  "#CC99FF", // Açık mor
  "#FFFFFF", // Beyaz
  "#FFD700", // Altın
  "#E6B3FF", // Lila
  "#FFB366", // Turuncu
  "#8B0000", // Koyu kırmızı
  "#006400", // Koyu yeşil
  "#00008B", // Koyu mavi
  "#4B0082", // Indigo
  "#800080", // Mor
  "#8B4513", // Kahverengi
  "#2F4F4F", // Koyu gri
  "#000000"  // Siyah
]

// Süslemeler
const decorations = [
  {
    name: "Kalp",
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color
      ctx.beginPath()
      const topCurveHeight = size * 0.3
      ctx.moveTo(x, y + topCurveHeight)
      // Sol üst kavis
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight)
      // Sol alt kavis
      ctx.bezierCurveTo(x - size / 2, y + size * 0.7, x, y + size, x, y + size)
      // Sağ alt kavis
      ctx.bezierCurveTo(x, y + size, x + size / 2, y + size * 0.7, x + size / 2, y + topCurveHeight)
      // Sağ üst kavis
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight)
      ctx.fill()
    },
  },
  {
    name: "Yıldız",
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color
      ctx.beginPath()
      const spikes = 5
      const outerRadius = size
      const innerRadius = size / 2

      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (Math.PI / spikes) * i
        const pointX = x + Math.cos(angle) * radius
        const pointY = y + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(pointX, pointY)
        } else {
          ctx.lineTo(pointX, pointY)
        }
      }

      ctx.closePath()
      ctx.fill()
    },
  },
  {
    name: "Daire",
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    },
  },
  {
    name: "Mum",
    draw: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      // Mum gövdesi
      ctx.fillStyle = color
      ctx.fillRect(x - size / 4, y - size, size / 2, size)

      // Mum alevi
      ctx.fillStyle = "#FFCC00"
      ctx.beginPath()
      ctx.ellipse(x, y - size - size / 3, size / 3, size / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    },
  },
]

export default function CakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState("base")
  const [selectedColor, setSelectedColor] = useState(cakeColors[0])
  const [selectedDecoration, setSelectedDecoration] = useState(0)
  const [cakeState, setCakeState] = useState({
    baseColor: cakeColors[0],
    layers: 3,
    decorations: [] as { type: number; x: number; y: number; size: number; color: string }[],
    text: "Doğum Günün Kutlu Olsun Defne!",
    textColor: "#FF66B2",
    textSize: 16,
    cakeShape: "round", // round, square, heart
    backgroundColor: "#FFFFFF"
  })
  const [isDrawing, setIsDrawing] = useState(false)
  const [decorationSize, setDecorationSize] = useState(20)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [selectedDecorationIndex, setSelectedDecorationIndex] = useState<number | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [introAnimationComplete, setIntroAnimationComplete] = useState(false)

  // Canvas boyutları
  const canvasWidth = 300
  const canvasHeight = 400

  // Canvas'ı temizle ve pastayı çiz
  const drawCake = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Arka plan rengini çiz
    ctx.fillStyle = cakeState.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Pasta katmanlarını çiz
    const layerHeight = 40
    const maxWidth = 200
    const minWidth = 120

    for (let i = 0; i < cakeState.layers; i++) {
      const y = canvas.height - 100 - i * layerHeight
      const width = maxWidth - (maxWidth - minWidth) * (i / (cakeState.layers - 1))

      ctx.fillStyle = cakeState.baseColor
      
      if (cakeState.cakeShape === "round") {
        // Yuvarlak pasta
        ctx.beginPath()
        ctx.ellipse(canvas.width / 2, y, width / 2, layerHeight / 3, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillRect(canvas.width / 2 - width / 2, y - layerHeight, width, layerHeight)

        ctx.beginPath()
        ctx.ellipse(canvas.width / 2, y - layerHeight, width / 2, layerHeight / 3, 0, 0, Math.PI * 2)
        ctx.fill()
      } else if (cakeState.cakeShape === "square") {
        // Kare pasta
        ctx.fillRect(canvas.width / 2 - width / 2, y - layerHeight, width, layerHeight)
        ctx.fillRect(canvas.width / 2 - width / 2, y - layerHeight - layerHeight / 3, width, layerHeight / 3)
        ctx.fillRect(canvas.width / 2 - width / 2, y, width, layerHeight / 3)
      } else if (cakeState.cakeShape === "heart") {
        // Kalp şeklinde pasta
        const centerX = canvas.width / 2
        const heartWidth = width
        const heartHeight = layerHeight * 1.2
        
        ctx.fillStyle = cakeState.baseColor
        ctx.beginPath()
        ctx.moveTo(centerX, y - layerHeight / 2)
        ctx.bezierCurveTo(
          centerX - heartWidth / 2, y - layerHeight - heartHeight / 2,
          centerX - heartWidth, y - heartHeight / 4,
          centerX, y
        )
        ctx.bezierCurveTo(
          centerX + heartWidth, y - heartHeight / 4,
          centerX + heartWidth / 2, y - layerHeight - heartHeight / 2,
          centerX, y - layerHeight / 2
        )
        ctx.fill()
      }
    }

    // Süslemeleri çiz
    cakeState.decorations.forEach((dec, index) => {
      decorations[dec.type].draw(ctx, dec.x, dec.y, dec.size, dec.color)
      
      // Seçili süslemeyi vurgula
      if (selectedDecorationIndex === index) {
        ctx.strokeStyle = "#FF0000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(dec.x, dec.y, dec.size + 5, 0, Math.PI * 2)
        ctx.stroke()
      }
    })

    // Metni çiz
    if (cakeState.text) {
      ctx.fillStyle = cakeState.textColor
      ctx.font = `${cakeState.textSize}px Arial`
      ctx.textAlign = "center"
      ctx.fillText(cakeState.text, canvas.width / 2, canvas.height - 50)
    }
  }

  // Canvas'a tıklama olayı
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab !== "decorations") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Önce tıklanan bir süsleme var mı kontrol et
    const clickedDecorationIndex = cakeState.decorations.findIndex(dec => {
      const distance = Math.sqrt(Math.pow(dec.x - x, 2) + Math.pow(dec.y - y, 2))
      return distance <= dec.size
    })

    if (clickedDecorationIndex !== -1) {
      // Süsleme seçildi
      setSelectedDecorationIndex(clickedDecorationIndex)
      return
    }
    
    // Seçili süsleme yoksa yeni süsleme ekle
    if (selectedDecorationIndex === null) {
      const newDecorations = [
        ...cakeState.decorations,
        {
          type: selectedDecoration,
          x,
          y,
          size: decorationSize,
          color: selectedColor,
        },
      ]

      setCakeState({
        ...cakeState,
        decorations: newDecorations,
      })
    } else {
      // Seçili süslemeyi taşı
      const newDecorations = [...cakeState.decorations]
      newDecorations[selectedDecorationIndex] = {
        ...newDecorations[selectedDecorationIndex],
        x,
        y
      }
      
      setCakeState({
        ...cakeState,
        decorations: newDecorations,
      })
    }
  }

  // Pastayı tamamla
  const completeCake = () => {
    setShowCompletionMessage(true)

    // Konfeti efekti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // 3 saniye sonra mesajı gizle
    setTimeout(() => {
      setShowCompletionMessage(false)
    }, 3000)
  }

  // Seçili süslemeyi sil
  const deleteSelectedDecoration = () => {
    if (selectedDecorationIndex !== null) {
      const newDecorations = [...cakeState.decorations]
      newDecorations.splice(selectedDecorationIndex, 1)
      
      setCakeState({
        ...cakeState,
        decorations: newDecorations,
      })
      
      setSelectedDecorationIndex(null)
    }
  }
  
  // Rastgele süslemeler ekle
  const addRandomDecorations = () => {
    const newDecorations = [...cakeState.decorations]
    const count = Math.floor(Math.random() * 5) + 5 // 5-10 arası rastgele süsleme
    
    for (let i = 0; i < count; i++) {
      const type = Math.floor(Math.random() * decorations.length)
      const x = Math.random() * (canvasWidth - 40) + 20
      const y = Math.random() * (canvasHeight - 100) + 20
      const size = Math.floor(Math.random() * 20) + 10 // 10-30 arası boyut
      const colorIndex = Math.floor(Math.random() * cakeColors.length)
      
      newDecorations.push({
        type,
        x,
        y,
        size,
        color: cakeColors[colorIndex],
      })
    }
    
    setCakeState({
      ...cakeState,
      decorations: newDecorations,
    })
  }
  
  // Pastayı sıfırla
  const resetCake = () => {
    setCakeState({
      baseColor: cakeColors[0],
      layers: 3,
      decorations: [],
      text: "Doğum Günün Kutlu Olsun Defne!",
      textColor: "#FF66B2",
      textSize: 16,
      cakeShape: "round",
      backgroundColor: "#FFFFFF"
    })
    setSelectedDecorationIndex(null)
  }

  // Canvas'ı güncelle
  useEffect(() => {
    drawCake()
  }, [cakeState])
  
  // Giriş animasyonu
  useEffect(() => {
    if (showIntro) {
      // Giriş konfeti efekti
      confetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0 },
        colors: ['#FF9999', '#FF66B2', '#CC99FF', '#FFD700', '#FFCC99'],
        startVelocity: 30,
        gravity: 0.5,
        ticks: 300,
        shapes: ['circle', 'square']
      })
      
      // 2.5 saniye sonra intro'yu kapat
      const timer = setTimeout(() => {
        setShowIntro(false)
        setIntroAnimationComplete(true)
      }, 2500)
      
      return () => clearTimeout(timer)
    }
  }, [showIntro])

  return (
    <div className="flex flex-col items-center">
      {showIntro && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-r from-pink-100 to-purple-100 animate-fadeIn">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-pink-500 mb-4 animate-bounce">Pasta Yapma Zamanı!</h1>
            <p className="text-xl text-purple-600 animate-pulse">Harika bir pasta tasarlamaya hazır mısın?</p>
          </div>
        </div>
      )}
      <Card 
        className={`bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg w-full max-w-md ${introAnimationComplete ? 'animate-slideDown' : 'opacity-0'}`}
        style={{
          animation: introAnimationComplete ? 'slideDown 0.5s ease-out forwards' : 'none'
        }}>
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="cake-canvas"
              onClick={handleCanvasClick}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="base" className="flex items-center gap-2">
                <Cake size={16} />
                <span>Pasta</span>
              </TabsTrigger>
              <TabsTrigger value="decorations" className="flex items-center gap-2">
                <Sparkles size={16} />
                <span>Süslemeler</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type size={16} />
                <span>Yazı</span>
              </TabsTrigger>
              <TabsTrigger value="background" className="flex items-center gap-2">
                <span>Arka Plan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="base" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Pasta Şekli</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={cakeState.cakeShape === "round" ? "default" : "outline"}
                    onClick={() => setCakeState({ ...cakeState, cakeShape: "round" })}
                  >
                    Yuvarlak
                  </Button>
                  <Button
                    variant={cakeState.cakeShape === "square" ? "default" : "outline"}
                    onClick={() => setCakeState({ ...cakeState, cakeShape: "square" })}
                  >
                    Kare
                  </Button>
                  <Button
                    variant={cakeState.cakeShape === "heart" ? "default" : "outline"}
                    onClick={() => setCakeState({ ...cakeState, cakeShape: "heart" })}
                  >
                    Kalp
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Pasta Rengi</h3>
                <div className="grid grid-cols-5 gap-2">
                  {cakeColors.map((color, index) => (
                    <div
                      key={index}
                      className={`cake-tool ${cakeState.baseColor === color ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCakeState({ ...cakeState, baseColor: color })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Pasta Katmanları</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCakeState({ ...cakeState, layers: Math.max(1, cakeState.layers - 1) })}
                    disabled={cakeState.layers <= 1}
                  >
                    -
                  </Button>
                  <span>{cakeState.layers}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCakeState({ ...cakeState, layers: Math.min(5, cakeState.layers + 1) })}
                    disabled={cakeState.layers >= 5}
                  >
                    +
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="decorations" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Süsleme Türü</h3>
                <div className="grid grid-cols-4 gap-2">
                  {decorations.map((dec, index) => (
                    <Button
                      key={index}
                      variant={selectedDecoration === index ? "default" : "outline"}
                      className="h-10"
                      onClick={() => setSelectedDecoration(index)}
                    >
                      {dec.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Süsleme Rengi</h3>
                <div className="grid grid-cols-5 gap-2">
                  {cakeColors.map((color, index) => (
                    <div
                      key={index}
                      className={`cake-tool ${selectedColor === color ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Süsleme Boyutu</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDecorationSize(Math.max(10, decorationSize - 5))}
                    disabled={decorationSize <= 10}
                  >
                    -
                  </Button>
                  <span>{decorationSize}px</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDecorationSize(Math.min(40, decorationSize + 5))}
                    disabled={decorationSize >= 40}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={deleteSelectedDecoration}
                  disabled={selectedDecorationIndex === null}
                >
                  Süslemeyi Sil
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={addRandomDecorations}
                >
                  Rastgele Süsle
                </Button>
              </div>

              <p className="text-sm text-gray-500 italic">
                {selectedDecorationIndex === null 
                  ? "Süslemeleri eklemek için pastaya tıklayın" 
                  : "Süslemeyi taşımak için pastada başka bir yere tıklayın"}
              </p>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Pasta Yazısı</h3>
                <textarea
                  value={cakeState.text}
                  onChange={(e) => setCakeState({ ...cakeState, text: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows={2}
                  maxLength={50}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Yazı Rengi</h3>
                <div className="grid grid-cols-5 gap-2">
                  {cakeColors.map((color, index) => (
                    <div
                      key={index}
                      className={`cake-tool ${cakeState.textColor === color ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCakeState({ ...cakeState, textColor: color })}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Yazı Boyutu</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCakeState({ ...cakeState, textSize: Math.max(12, cakeState.textSize - 2) })}
                    disabled={cakeState.textSize <= 12}
                  >
                    -
                  </Button>
                  <span>{cakeState.textSize}px</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCakeState({ ...cakeState, textSize: Math.min(24, cakeState.textSize + 2) })}
                    disabled={cakeState.textSize >= 24}
                  >
                    +
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="background" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Arka Plan Rengi</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[...cakeColors, "#FFFFFF", "#F5F5F5", "#FFF0F5", "#F0F8FF"].map((color, index) => (
                    <div
                      key={index}
                      className={`cake-tool ${cakeState.backgroundColor === color ? "active" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCakeState({ ...cakeState, backgroundColor: color })}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-50px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 1s ease-in-out;
            }
            .animate-slideDown {
              animation: slideDown 0.5s ease-out forwards;
            }
            .animate-bounce {
              animation: bounce 1s infinite;
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .animate-pulse {
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}</style>

          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="flex-1" onClick={resetCake}>
              Sıfırla
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => {
              const canvas = canvasRef.current;
              if (canvas) {
                const link = document.createElement('a');
                link.download = 'pasta-tasarımı.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              }
            }}>
              İndir
            </Button>
            <Button className="flex-1" onClick={completeCake}>
              Tamamla
            </Button>
          </div>

          {showCompletionMessage && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md text-center">
              Harika bir pasta yaptın! 🎂
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}