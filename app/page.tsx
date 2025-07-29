"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Logo from "@/assets/logo.png"
import LogoS from "@/assets/logotw.png"
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Home,
  HelpCircle,
  Banknote,
  X,
  Mail,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Phone,
  User,
  Key,
  Play,
  Pause,
  Volume2,
} from "lucide-react"
import HelpScreen from "@/components/help-screen"

interface Question {
  id: string
  question: string
  options: string[]
  reward: number
}

const questions: Question[] = [
  {
    id: "1",
    question: "Qual recurso você mais utiliza no NuBank?",
    options: ["PIX", "Cartão de crédito", "Cartão de débito"],
    reward: 33.0,
  },
  {
    id: "2",
    question: "Com que frequência você usa o app do NuBank?",
    options: ["Diariamente", "Semanalmente", "Mensalmente"],
    reward: 25.5,
  },
  {
    id: "3",
    question: "Qual funcionalidade você gostaria de ver no app?",
    options: ["Investimentos", "Empréstimos", "Cashback"],
    reward: 40.0,
  },
  {
    id: "4",
    question: "Como você avalia o atendimento do NuBank?",
    options: ["Excelente", "Bom", "Regular"],
    reward: 28.75,
  },
  {
    id: "5",
    question: "Você recomendaria o NuBank para amigos?",
    options: ["Definitivamente sim", "Talvez", "Não"],
    reward: 35.0,
  },
  {
    id: "6",
    question: "Qual é sua faixa etária?",
    options: ["18-25 anos", "26-35 anos", "36+ anos"],
    reward: 22.5,
  },
  {
    id: "7",
    question: "Qual seu principal objetivo financeiro?",
    options: ["Economizar", "Investir", "Quitar dívidas"],
    reward: 31.25,
  },
  {
    id: "8",
    question: "Como você conheceu o NuBank?",
    options: ["Indicação", "Redes sociais", "Publicidade"],
    reward: 27.0,
  },
  {
    id: "9",
    question: "Qual produto financeiro mais te interessa?",
    options: ["Conta digital", "Cartão sem anuidade", "Rendimento automático"],
    reward: 38.5,
  },
  {
    id: "10",
    question: "O que mais valoriza em um banco digital?",
    options: ["Praticidade", "Segurança", "Taxas baixas"],
    reward: 42.0,
  },
]

export default function NuBankApp() {
  const [currentScreen, setCurrentScreen] = useState<"splash" | "register" | "main">("splash")
  const [email, setEmail] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [totalEarnings, setTotalEarnings] = useState(250.0)
  const [completedSurveys, setCompletedSurveys] = useState(0)
  const [todaySurveys, setTodaySurveys] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("home")
  const [allSurveysCompleted, setAllSurveysCompleted] = useState(false)

  // Saque states
  const [saqueStep, setSaqueStep] = useState<"options" | "form" | "loading" | "error" | "video">("options")
  const [selectedPixType, setSelectedPixType] = useState<string>("")
  const [pixKey, setPixKey] = useState("")
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoWatched, setVideoWatched] = useState(false)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(50) // 50 seconds
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const remainingSurveys = questions.length - completedSurveys
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("register")
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const calculatedProgress = (completedSurveys / questions.length) * 100
    setProgress(calculatedProgress)

    if (completedSurveys === questions.length) {
      setAllSurveysCompleted(true)
    }
  }, [completedSurveys])

  // Video timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isVideoPlaying && showVideoModal) {
      interval = setInterval(() => {
        setVideoCurrentTime((prev) => {
          const newTime = prev + 1
          if (newTime >= videoDuration) {
            setVideoWatched(true)
            setIsVideoPlaying(false)
            return videoDuration
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isVideoPlaying, showVideoModal, videoDuration])

  // Auto-redirect from error to video modal
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (saqueStep === "error") {
      timer = setTimeout(() => {
        setShowVideoModal(true)
        setSaqueStep("video")
      }, 2000) // Redireciona após 2 segundos
    }
    return () => clearTimeout(timer)
  }, [saqueStep])

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setCurrentScreen("main")
    }
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)

    setTimeout(() => {
      setShowRewardModal(true)
      setTotalEarnings((prev) => prev + currentQuestion.reward)
      setCompletedSurveys((prev) => prev + 1)
      setTodaySurveys((prev) => prev + 1)
    }, 500)
  }

  const handleContinue = () => {
    setShowRewardModal(false)
    setSelectedOption(null)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setAllSurveysCompleted(true)
    }
  }

  const handleGoToSaque = () => {
    setShowRewardModal(false)
    setActiveTab("saque")
  }

  const handleCloseModal = () => {
    setShowRewardModal(false)
    setSelectedOption(null)
  }

  const handlePixTypeSelect = (type: string) => {
    setSelectedPixType(type)
    setSaqueStep("form")
  }

  const handlePixSubmit = () => {
    if (pixKey.trim()) {
      setSaqueStep("loading")

      // Simulate loading for 3 seconds, then show error
      setTimeout(() => {
        setSaqueStep("error")
      }, 3000)
    }
  }

  const handleErrorContinue = () => {
    // Auto redirect after 3 seconds
    setTimeout(() => {
      setShowVideoModal(true)
      setSaqueStep("video")
    }, 3000)
  }

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
  }

  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  }

  const handleVideoUnlock = () => {
    // Redirect to external site
    window.open("https://www.nubank.com.br", "_blank")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Splash Screen
  if (currentScreen === "splash") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] flex items-center justify-center">
        <div className="text-center animate-fade-in">
           <Image src={LogoS} alt="Nu" style={{maxWidth: '132px', marginBottom: '41px'}}/>
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  // Register Screen
  if (currentScreen === "register") {
    return (
      <div className="min-h-screen bg-gray-100 relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] px-6 py-8 relative">
          <div className="flex items-center justify-center space-x-1">
           <Image src={Logo} alt="Nu" style={{maxWidth: '118px'}}/>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8109d0] rounded-full opacity-20 -translate-x-16 translate-y-16"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-[#8109d0] rounded-full opacity-15 translate-x-12"></div>
          <div className="absolute bottom-20 right-0 w-40 h-40 bg-[#8109d0] rounded-full opacity-10 translate-x-20 translate-y-20"></div>

          <Card className="w-full max-w-sm bg-white shadow-2xl border-0 animate-slide-up">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-black mb-2">Bem-vindo(a) ao</h1>
              <h1 className="text-2xl font-bold text-black mb-6">NubankOpina</h1>

              <p className="text-gray-600 mb-8">Insira seu e-mail para prosseguir</p>

              <div className="space-y-6">
                <div className="text-left">
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 text-base border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#8109d0] focus:bg-white transition-all"
                  />
                </div>

                <Button
                  onClick={handleEmailSubmit}
                  disabled={!email.trim()}
                  className="w-full bg-[#8109d0] hover:bg-[#7c0ac8] text-white font-bold py-4 text-lg rounded-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Iniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center pb-8 px-6">
          <p className="text-gray-500 text-sm mb-2">2025 Nubank LLC</p>
          <p className="text-gray-500 text-sm">Termos e política de Privacidade</p>
        </div>
      </div>
    )
  }

  // Saque Screen
  if (activeTab === "saque") {
    return (
      <>
        <div className="min-h-screen bg-gray-100 pb-36">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] px-6 py-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image src={Logo} alt="Nu" style={{maxWidth: '94px'}}/>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold">R${totalEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saque Content */}
            <div className="px-6 pt-6">
              <h1 className="text-[#8109d0] text-2xl font-bold mb-6">Meus Saques</h1>

              {/* Balance Card */}
              <Card className="bg-white shadow-lg border-0 mb-6 animate-slide-up">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Seu Saldo</p>
                      <p className="text-[#8109d0] text-3xl font-bold">R$ {totalEarnings.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-[#8109d0] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Surveys Progress - Block saque if not completed */}
              <Card className="bg-white shadow-lg border-0 mb-6 animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        completedSurveys === questions.length ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {completedSurveys === questions.length ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <X className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">
                        Pesquisas completadas: {completedSurveys}/{questions.length}
                      </p>
                      {completedSurveys < questions.length && (
                        <p className="text-red-500 text-xs font-semibold">Complete todas para liberar o saque!</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Block saque options if surveys not completed */}
              {completedSurveys < questions.length && (
                <Card className="bg-red-50 border border-red-200 shadow-lg mb-6 animate-slide-up">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700 font-semibold text-sm">
                      Você precisa completar todas as {questions.length} pesquisas para poder sacar!
                    </p>
                    <p className="text-red-600 text-xs mt-1">Restam {questions.length - completedSurveys} pesquisas</p>
                    <Button
                      onClick={() => setActiveTab("home")}
                      className="mt-3 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-lg"
                    >
                      Ir para Pesquisas
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* PIX Options - Only show if all surveys completed */}
              {saqueStep === "options" && completedSurveys === questions.length && (
                <div className="grid grid-cols-2 gap-4 animate-slide-up">
                  <Card
                    className="bg-white shadow-lg border-0 cursor-pointer transform hover:scale-105 transition-all duration-200"
                    onClick={() => handlePixTypeSelect("cpf")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-[#8109d0] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-lg">CPF</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-white shadow-lg border-0 cursor-pointer transform hover:scale-105 transition-all duration-200"
                    onClick={() => handlePixTypeSelect("telefone")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-[#8109d0] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-lg">Telefone</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-white shadow-lg border-0 cursor-pointer transform hover:scale-105 transition-all duration-200"
                    onClick={() => handlePixTypeSelect("email")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-[#8109d0] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-lg">E-mail</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-white shadow-lg border-0 cursor-pointer transform hover:scale-105 transition-all duration-200"
                    onClick={() => handlePixTypeSelect("aleatoria")}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-[#8109d0] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-lg">Chave Aleatória</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* PIX Form */}
              {saqueStep === "form" && (
                <Card className="bg-white shadow-lg border-0 animate-slide-up">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Insira sua chave PIX ({selectedPixType})</h3>
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder={`Digite sua ${selectedPixType}`}
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full p-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8109d0] transition-all"
                      />
                      <div className="flex space-x-3">
                        <Button
                          onClick={handlePixSubmit}
                          disabled={!pixKey.trim()}
                          className="flex-1 bg-[#8109d0] hover:bg-[#7c0ac8] text-white font-bold py-3 rounded-lg disabled:opacity-50"
                        >
                          Solicitar Saque
                        </Button>
                        <Button
                          onClick={() => setSaqueStep("options")}
                          variant="outline"
                          className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Voltar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-[#8109d0] rounded-full px-8 py-4 shadow-2xl">
              <div className="flex items-center space-x-10">
                <button
                  onClick={() => setActiveTab("saque")}
                  className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                    activeTab === "saque" ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs font-medium">Saque</span>
                </button>
                <button
                  onClick={() => setActiveTab("home")}
                  className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                    activeTab === "home" ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-xs font-medium">Início</span>
                </button>
                <button
                  onClick={() => setActiveTab("ajuda")}
                  className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                    activeTab === "ajuda" ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-xs font-medium">Ajuda</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Modal */}
        {saqueStep === "loading" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-sm bg-white shadow-2xl border-0 animate-modal-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 border-4 border-[#8109d0]/30 border-t-[#8109d0] rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Efetuando Saque</h2>
                <p className="text-gray-600 text-sm">
                  Estamos processando sua solicitação de saque. Por favor, aguarde...
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Modal with auto redirect */}
        {saqueStep === "error" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-sm bg-white shadow-2xl border-0 animate-modal-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Erro no Saque</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Não foi possível processar seu saque devido ao seguinte erro:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <p className="text-red-600 font-medium">Banco não verificado</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-[#8109d0]/30 border-t-[#8109d0] rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Redirecionando automaticamente...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Video Modal - Mobile Optimized */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50">
            <Card className="w-full max-w-sm bg-white shadow-2xl border-0 animate-modal-in overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-[#8109d0] px-4 py-3 text-center">
                <h2 className="text-white font-bold text-xs">ASSISTA O VÍDEO ABAIXO</h2>
                <p className="text-white/90 text-xs">PARA LIBERAR SEU SAQUE E ACESSO VITALÍCIO</p>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#8109d0] rounded-full flex items-center justify-center">
                      <DollarSign className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">SALDO</p>
                      <p className="text-[#8109d0] font-bold text-sm">R$ {totalEarnings.toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-[#8109d0] font-bold text-center mb-2 text-sm">DESBLOQUEIO DE SALDO</h3>
                <p className="text-gray-600 text-xs text-center mb-4">
                  Veja como liberar seu saque assistindo ao vídeo.
                </p>

                {/* Video Player - Mobile Optimized */}
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-black text-center p-4">
                    <div>
                      <div className="text-white text-2xl font-bold mb-2">panda v</div>
                      <div className="text-white text-xs bg-black/50 px-2 py-1 rounded mb-1">
                        JR DASHBOARD FOR IMPORT
                      </div>
                      <div className="text-white text-xs">SEU DASHBOARD PARA MEL</div>
                    </div>
                  </div>

                  {/* Video Controls - Mobile Optimized */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={isVideoPlaying ? handleVideoPause : handleVideoPlay}
                        className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        {isVideoPlaying ? (
                          <Pause className="w-3 h-3 text-white" />
                        ) : (
                          <Play className="w-3 h-3 text-white ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 bg-white/20 rounded-full h-1">
                        <div
                          className="bg-white h-1 rounded-full transition-all duration-300"
                          style={{ width: `${(videoCurrentTime / videoDuration) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-xs">
                        {formatTime(videoCurrentTime)}/{formatTime(videoDuration)}
                      </span>
                      <Volume2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={videoWatched ? handleVideoUnlock : undefined}
                  disabled={!videoWatched}
                  className={`w-full font-bold py-3 text-xs rounded-lg transition-all duration-200 ${
                    videoWatched
                      ? "bg-green-500 hover:bg-green-600 text-white transform hover:scale-105"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {videoWatched
                    ? "DESBLOQUEAR AGORA"
                    : `ASSISTA O VÍDEO TODO (${formatTime(videoDuration - videoCurrentTime)})`}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    )
  }

  // Other tabs
  if (activeTab === "ajuda") {
    return (
      <>
        <HelpScreen totalEarnings={totalEarnings} onBack={() => setActiveTab("home")} />

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#8109d0] rounded-full px-8 py-4 shadow-2xl">
            <div className="flex items-center space-x-10">
              <button
                onClick={() => setActiveTab("saque")}
                className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === "saque" ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-medium">Saque</span>
              </button>
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === "home" ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium">Início</span>
              </button>
              <button
                onClick={() => setActiveTab("ajuda")}
                className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === "ajuda" ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-xs font-medium">Ajuda</span>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={`min-h-screen bg-gray-100 transition-all duration-300 ${showRewardModal ? "blur-sm" : ""}`}>
        <div className="max-w-md mx-auto relative min-h-screen pb-36">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] px-6 py-4 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                 <Image src={Logo} alt="Nu" style={{maxWidth: '94px'}}/>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold">R${totalEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pt-6 relative z-20">
            {/* Title */}
            <h1 className="text-[#8109d0] text-2xl font-bold mb-6 animate-fade-in">NuBank Avalia</h1>

            {/* User Email Card */}
            <Card className="bg-white shadow-lg border-0 mb-6 transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Usuário logado</p>
                    <p className="text-black font-bold text-base">{email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-white shadow-lg border-0 transform hover:scale-105 transition-all duration-300 animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#58f0a4] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Saldo Atual</p>
                      <p className="text-black font-bold text-lg">{totalEarnings.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 transform hover:scale-105 transition-all duration-300 animate-slide-up">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#8109d0] rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Pesquisas</p>
                      <p className="text-black font-bold text-lg">{todaySurveys}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Remaining Surveys Card */}
            <Card className="bg-white shadow-lg border-0 mb-6 transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#d0095f] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Pesquisas Restantes</p>
                      <p className="text-black font-bold text-lg">{remainingSurveys}</p>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] rounded-full opacity-20" />
                </div>
              </CardContent>
            </Card>

            {/* All Surveys Completed Message */}
            {allSurveysCompleted && (
              <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-xl mb-6 animate-slide-up">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-white mx-auto mb-3" />
                  <h2 className="text-white text-lg font-bold mb-2">Todas as pesquisas concluídas!</h2>
                  <p className="text-white/90 text-sm mb-4">Você pode sacar seu saldo disponível agora.</p>
                  <Button
                    onClick={() => setActiveTab("saque")}
                    className="bg-white text-green-600 hover:bg-gray-100 font-bold py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-200"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Ir para Saque
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Progress */}
            {!allSurveysCompleted && (
              <div className="mb-6 animate-slide-up">
                <div className="flex justify-between items-center mb-2">
                  <div className="w-16 h-1 bg-white rounded-full" />
                  <span className="text-gray-600 text-sm">Progresso: {Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Rewards Section */}
            {!allSurveysCompleted && (
              <div className="mb-6 animate-slide-up">
                <h2 className="text-[#8109d0] text-xl font-bold mb-4 text-center">Responda e ganhe recompensas</h2>

                <Card className="bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex justify-center">
                      <img
                        src="https://www.datocms-assets.com/120597/1746628806-app-na-home-e-cartao-nubank-em-superficie-geometrica-quadrada-ptbr-conteudo-dinamico-02-mobile-jpg.jpg?auto=format&crop=focalpoint&dpr=1&fit=crop&q=60"
                        alt="NuBank App Screens"
                        className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Survey Question */}
            {currentQuestion && !allSurveysCompleted && (
              <div className="mb-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-black text-lg font-bold">{currentQuestion.question}</h3>
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={option}
                      variant="outline"
                      disabled={selectedOption !== null}
                      className={`w-full p-4 h-auto text-[#8109d0] font-semibold text-base border-2 border-[#8109d0] hover:bg-[#8109d0] hover:text-white transform hover:scale-105 transition-all duration-300 animate-slide-up ${
                        selectedOption === option ? "bg-[#8109d0] text-white" : "bg-white"
                      }`}
                      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {selectedOption === option && (
                        <div className="mr-2 w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                      )}
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#8109d0] rounded-full px-8 py-4 shadow-2xl">
            <div className="flex items-center space-x-10">
              <button
                onClick={() => setActiveTab("saque")}
                className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === "saque" ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-medium">Saque</span>
              </button>
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === "home" ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium">Início</span>
              </button>
              <button
                onClick={() => setActiveTab("ajuda")}
                className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === "ajuda" ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-xs font-medium">Ajuda</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full animate-modal-in overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] px-6 py-4 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center space-x-2">
               <Image src={Logo} alt="Nu" style={{maxWidth: '94px'}}/>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 text-center">
              <h2 className="text-[#8109d0] text-3xl font-bold mb-4 animate-bounce-in">
                {isLastQuestion ? "Missão Completa!" : "Parabéns!"}
              </h2>

              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                {isLastQuestion
                  ? "Você completou todas as pesquisas e ganhou:"
                  : "Você completou sua pesquisa e ganhou:"}
              </p>

              <div className="text-[#8109d0] text-5xl font-bold mb-6 animate-scale-in">
                R$ {currentQuestion?.reward.toFixed(2)}
              </div>

              {isLastQuestion ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Todas as pesquisas foram concluídas! Seu saldo total é de{" "}
                    <strong>R$ {(totalEarnings + currentQuestion.reward).toFixed(2)}</strong> e está disponível para
                    saque.
                  </p>

                  <div className="space-y-3">
                    <Button
                      onClick={handleGoToSaque}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-2xl transform hover:scale-105 transition-all duration-200"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      IR PARA SAQUE
                    </Button>

                    <Button
                      onClick={handleContinue}
                      variant="outline"
                      className="w-full border-2 border-[#8109d0] text-[#8109d0] font-bold py-4 text-lg rounded-2xl hover:bg-[#8109d0] hover:text-white transform hover:scale-105 transition-all duration-200 bg-transparent"
                    >
                      VER RESUMO
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                    Continue avaliando mais perguntas para aumentar seus ganhos.
                  </p>

                  <Button
                    onClick={handleContinue}
                    className="w-full bg-[#8109d0] hover:bg-[#7c0ac8] text-white font-bold py-4 text-lg rounded-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    CONTINUAR AVALIANDO
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
