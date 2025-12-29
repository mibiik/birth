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
    correctAnswer: 3, // Mantı (index 3)
  },
]

export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [feedback, setFeedback] = useState<{correct: boolean, message: string} | null>(null)

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    // Cevabı kaydet
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedOption!
    setAnswers(newAnswers)
  
    // Doğru cevap kontrolü ve konfeti efekti
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
      setFeedback({correct: true, message: "Doğru cevap!" })
      // Her doğru cevapta küçük bir konfeti
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FF69B4', '#FFB6C1', '#FF1493']
      })
    } else {
      setFeedback({correct: false, message: `Yanlış cevap! Doğru cevap: ${quizQuestions[currentQuestion].options[quizQuestions[currentQuestion].correctAnswer]}` })
    }
    
    // Kısa bir süre sonra geri bildirimi temizle ve sonraki soruya geç
    setTimeout(() => {
      setFeedback(null)
      
      // Sonraki soruya geç veya sonuçları göster
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        setShowResult(true)
    
        // Quiz bitiminde büyük konfeti gösterisi
        const duration = 2000
        const end = Date.now() + duration
    
        const frame = () => {
          confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#DB7093']
          })
          
          confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#DB7093']
          })
    
          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        }
        frame()
      }
    }, 1500) // 1.5 saniye sonra geri bildirimi temizle ve sonraki soruya geç
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
    setAnswers([])
    setFeedback(null)
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
                <div key={index} className="text-left border border-pink-100 rounded-lg p-4 transition-all hover:shadow-md">
                  <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                  <div className={`p-3 rounded-lg ${answers[index] === q.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`flex items-center gap-2 ${answers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                      {answers[index] === q.correctAnswer ? (
                        <>
                          <span className="text-lg">✨</span>
                          <span>Doğru cevap! {q.options[answers[index]]}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">❌</span>
                          <span>Senin cevabın: {q.options[answers[index]]}</span>
                          <span className="block mt-2 text-green-600 font-medium">
                            <span className="text-lg">✅</span>
                            Doğru cevap: {q.options[q.correctAnswer]}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
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

            {feedback && (
              <div className={`p-3 mb-4 rounded-lg ${feedback.correct ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <p className="flex items-center gap-2">
                  <span className="text-lg">{feedback.correct ? '✨' : '❌'}</span>
                  <span>{feedback.message}</span>
                </p>
              </div>
            )}

            <RadioGroup key={currentQuestion} value={selectedOption?.toString()} className="space-y-3 mb-6">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${selectedOption === index ? 'bg-pink-100 shadow-sm' : 'hover:bg-pink-50'}`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${currentQuestion}-${index}`}
                    onClick={() => handleOptionSelect(index)}
                    className="border-pink-400 text-pink-600"
                  />
                  <Label htmlFor={`option-${currentQuestion}-${index}`} className="cursor-pointer w-full">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button onClick={handleNextQuestion} disabled={selectedOption === null || feedback !== null} className="w-full">
              {feedback ? "Lütfen bekleyin..." : currentQuestion < quizQuestions.length - 1 ? "Sonraki Soru" : "Sonuçları Göster"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
