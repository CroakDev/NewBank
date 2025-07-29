"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, CreditCard } from "lucide-react"
import Image from "next/image"
import Logo from "@/assets/logo.png"
interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Como funciona o processo de validação do saque?",
    answer:
      "O processo de validação é simples e seguro. Após completar todas as pesquisas, você precisa assistir a um vídeo informativo sobre segurança financeira. Isso garante que você está ciente dos procedimentos e pode sacar com tranquilidade.",
  },
  {
    question: "Outras pessoas estão realmente recebendo?",
    answer:
      "Sim! Milhares de usuários já receberam seus pagamentos através do nosso sistema. Todos os saques são processados via PIX em até 24 horas após a validação completa do perfil.",
  },
  {
    question: "Por que preciso fazer a validação agora?",
    answer:
      "A validação é obrigatória por questões de segurança e conformidade com as regulamentações bancárias. Isso protege tanto você quanto nossa plataforma contra fraudes e garante que apenas usuários legítimos recebam os pagamentos.",
  },
  {
    question: "E se eu não gostar do programa?",
    answer:
      "Você pode sair do programa a qualquer momento! Não há compromisso ou taxas. Caso decida sair, seu saldo acumulado será mantido por 30 dias para saque, desde que tenha completado o processo de validação.",
  },
  {
    question: "Quanto posso ganhar por mês?",
    answer:
      "Os ganhos variam conforme sua participação. Em média, usuários ativos ganham entre R$ 150 a R$ 500 por mês respondendo pesquisas. Quanto mais pesquisas você completar, maior será sua remuneração.",
  },
  {
    question: "Existe risco de perder meu dinheiro?",
    answer:
      "Não há risco algum! Você não investe dinheiro próprio - apenas ganha respondendo pesquisas. Todo o saldo acumulado fica seguro em nossa plataforma até você decidir sacar via PIX.",
  },
]

interface HelpScreenProps {
  totalEarnings: number
  onBack: () => void
}

export default function HelpScreen({ totalEarnings, onBack }: HelpScreenProps) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
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

        {/* Content */}
        <div className="px-6 pt-6">
          <h1 className="text-[#8109d0] text-2xl font-bold mb-6">Perguntas Frequentes</h1>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg border-0 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 font-medium text-sm pr-4">{item.question}</span>
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-[#8109d0] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8109d0] flex-shrink-0" />
                    )}
                  </button>

                  {openItems.includes(index) && (
                    <div className="px-4 pb-4 border-t border-gray-100 animate-slide-up">
                      <p className="text-gray-600 text-sm leading-relaxed pt-3">{item.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card className="bg-gradient-to-br from-[#8109d0] to-[#7c0ac8] border-0 shadow-xl mt-8 animate-slide-up">
            <CardContent className="p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Ainda tem dúvidas?</h3>
              <p className="text-white/90 text-sm mb-4">Nossa equipe está pronta para te ajudar!</p>
              <Button
                onClick={onBack}
                className="bg-white text-[#8109d0] hover:bg-gray-100 font-bold py-2 px-6 rounded-full transform hover:scale-105 transition-all duration-200"
              >
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
