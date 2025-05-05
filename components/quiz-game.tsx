"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import confetti from "canvas-confetti"

// Quiz soruları
const quizQuestions = [
  {
    question: "Defne'nin en sevdiği renk hangisidir?",
    options: ["Mavi", "Pembe", "Mor", "Yeşil"],
    correctAnswer: 1, // Pembe (index 1)
  },
  {
    question: "Defne hangi burçtur?",
    options: ["Koç", "Boğa", "İkizler", "Yengeç"],
    correctAnswer: 1, // Boğa (index 1)
  },
  {
    question: "Defne'nin doğum tarihi nedir?",
    options: ["6 Mayıs 2004", "5 Mayıs 2004", "6 Mayıs 2003", "7 Mayıs 2004"],
    correctAnswer: 0, // 6 Mayıs 2004 (index 0)
  },
  {
    question: "Defne'nin en sevdiği mevsim hangisidir?",
    options: ["İlkbahar", "Yaz", "Sonbahar", "Kış"],
    correctAnswer: 1, // Yaz (index 1)
  },
  {
    question: "Defne'nin en sevdiği yemek hangisidir?",
    options: ["Pizza", "Makarna", "Hamburger", "Mantı"],
    correctAnswer: 0, // Mantı (index 3)
  },
]

export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    // Cevabı kaydet
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedOption!
    setAnswers(newAnswers)

    // Doğru cevap kontrolü
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    // Sonraki soruya geç veya sonuçları göster
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      setShowResult(true)

      // Yüksek skor için konfeti
      if (score >= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
    setAnswers([])
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
      <CardContent className="p-6">
        {showResult ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Quiz Sonucu</h2>
            <p className="text-xl mb-4">
              Toplam Puanın: <span className="font-bold">{score}</span> / {quizQuestions.length}
            </p>

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-pink-600">Cevapların:</h3>
              {quizQuestions.map((q, index) => (
                <div key={index} className="text-left border-b pb-2">
                  <p className="font-medium">{q.question}</p>
                  <p className={answers[index] === q.correctAnswer ? "text-green-600" : "text-red-600"}>
                    Senin cevabın: {q.options[answers[index]]}
                    {answers[index] !== q.correctAnswer && (
                      <span className="block text-green-600">Doğru cevap: {q.options[q.correctAnswer]}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Button onClick={resetQuiz}>Quizi Tekrar Başlat</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Soru {currentQuestion + 1}/{quizQuestions.length}
              </span>
              <span className="text-sm text-gray-500">Puan: {score}</span>
            </div>

            <h2 className="text-xl font-semibold text-pink-600 mb-4">{quizQuestions[currentQuestion].question}</h2>

            <RadioGroup value={selectedOption?.toString()} className="space-y-3 mb-6">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    onClick={() => handleOptionSelect(index)}
                  />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button onClick={handleNextQuestion} disabled={selectedOption === null} className="w-full">
              {currentQuestion < quizQuestions.length - 1 ? "Sonraki Soru" : "Sonuçları Göster"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
