"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import confetti from "canvas-confetti"

export default function BirthdayWishForm() {
  const [wish, setWish] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)

  // İstemci tarafında olduğumuzu kontrol et
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wish.trim()) {
      setError("Lütfen bir dilek yazın")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Firestore bağlantısını kontrol et
      if (typeof window === "undefined" || !db) {
        throw new Error("Firebase bağlantısı kurulamadı")
      }

      await addDoc(collection(db, "birthdayWishes"), {
        wish,
        createdAt: serverTimestamp(),
      })

      setIsSubmitted(true)
      setWish("")

      // Konfeti efekti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } catch (error) {
      console.error("Error adding wish:", error)
      setError("Dilek kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // İstemci tarafında değilsek, yükleniyor göster
  if (!isClient) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
        <h2 className="text-xl font-semibold text-pink-600 mb-4">Doğum Günü Dileğin</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
      <h2 className="text-xl font-semibold text-pink-600 mb-4">DİLEK TUTT</h2>

      {isSubmitted ? (
        <div className="text-center py-4">
          <p className="text-green-600 font-medium mb-2">Dileğin en yakın zamanda gerçekleşecek Defneciğim! ✨</p>
          <p className="text-gray-600">Yeni bir dilek??</p>
          <Button className="mt-4" onClick={() => setIsSubmitted(false)}>
            Bir Dilek Daha
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Dileğini buraya yaz..."
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            className="mb-4 min-h-[100px]"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Dileği Gönder"}
          </Button>
        </form>
      )}
    </Card>
  )
}
