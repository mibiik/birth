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
  "#FFB366" // Turuncu
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
  })
  const [isDrawing, setIsDrawing] = useState(false)
  const [decorationSize, setDecorationSize] = useState(20)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)

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

    // Pasta katmanlarını çiz
    const layerHeight = 40
    const maxWidth = 200
    const minWidth = 120

    for (let i = 0; i < cakeState.layers; i++) {
      const y = canvas.height - 100 - i * layerHeight
      const width = maxWidth - (maxWidth - minWidth) * (i / (cakeState.layers - 1))

      ctx.fillStyle = cakeState.baseColor
      ctx.beginPath()
      ctx.ellipse(canvas.width / 2, y, width / 2, layerHeight / 3, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillRect(canvas.width / 2 - width / 2, y - layerHeight, width, layerHeight)

      ctx.fillStyle = cakeState.baseColor
      ctx.beginPath()
      ctx.ellipse(canvas.width / 2, y - layerHeight, width / 2, layerHeight / 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // Süslemeleri çiz
    cakeState.decorations.forEach((dec) => {
      decorations[dec.type].draw(ctx, dec.x, dec.y, dec.size, dec.color)
    })

    // Metni çiz
    if (cakeState.text) {
      ctx.fillStyle = "#FF66B2"
      ctx.font = "16px Arial"
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

    // Yeni süsleme ekle
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

  // Pastayı sıfırla
  const resetCake = () => {
    setCakeState({
      baseColor: cakeColors[0],
      layers: 3,
      decorations: [],
      text: "Doğum Günün Kutlu Olsun Defne!",
    })
  }

  // Canvas'ı güncelle
  useEffect(() => {
    drawCake()
  }, [cakeState])

  return (
    <div className="flex flex-col items-center">
      <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg w-full max-w-md">
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
            <TabsList className="grid grid-cols-3 mb-4">
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
            </TabsList>

            <TabsContent value="base" className="space-y-4">
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

              <p className="text-sm text-gray-500 italic">Süslemeleri eklemek için pastaya tıklayın</p>
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
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="flex-1" onClick={resetCake}>
              Sıfırla
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
