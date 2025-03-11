// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);

  // サンプルプロジェクトデータ
  const projects = [
    {
      id: 1,
      title: "youtube英語→日本語要約",
      description: "Next.jsとStripeを使用したモダンなEコマースサイト",
      tags: ["Next.js", "React", "Stripe", "Tailwind CSS"],
      image: "/api/placeholder/600/400"
    },
    {
      id: 2,
      title: "AIチャットボット",
      description: "自然言語処理を活用したカスタマーサポート用チャットボット",
      tags: ["Python", "TensorFlow", "React", "Node.js"],
      image: "/api/placeholder/600/400"
    },
    {
      id: 3,
      title: "健康管理アプリ",
      description: "ユーザーの健康データを追跡・分析するモバイルアプリ",
      tags: ["React Native", "Firebase", "Redux", "Graph API"],
      image: "/api/placeholder/600/400"
    }
  ];

  // プロジェクトを自動的に切り替える
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [projects.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* ヘッダー */}
      <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            Portfolio<span className="text-blue-600">.</span>
          </Link>
          
          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            <Link href="#about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              About
            </Link>
            <Link href="#projects" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Projects
            </Link>
            <Link href="#skills" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Skills
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Contact
            </Link>
          </nav>
          
          {/* モバイルメニューボタン */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
      
      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 md:hidden">
          <div className="h-full w-full max-w-xs bg-white dark:bg-gray-900 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold">Menu</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-6">
              <Link 
                href="#about" 
                className="text-xl text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="#projects" 
                className="text-xl text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                href="#skills" 
                className="text-xl text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Skills
              </Link>
              <Link 
                href="#contact" 
                className="text-xl text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
      
      {/* ヒーローセクション */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  <span className="text-blue-600">クリエイティブ</span>な<br />
                  ポートフォリオ
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                  Webデザインとフロントエンド開発を専門とするクリエイター。モダンでユーザーフレンドリーなウェブ体験を提供します。
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="#projects">
                      プロジェクトを見る
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#contact">
                      お問い合わせ
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl p-1"
              >
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 h-96 flex items-center justify-center">
                  <img 
                    src="/api/placeholder/400/400" 
                    alt="Profile" 
                    className="w-64 h-64 rounded-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* プロジェクトセクション */}
      <section id="projects" className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            注目のプロジェクト
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* 選択されたプロジェクト */}
            <div className="md:w-2/3">
              <Card className="overflow-hidden h-full">
                <img 
                  src={projects[currentProject].image} 
                  alt={projects[currentProject].title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {projects[currentProject].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {projects[currentProject].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {projects[currentProject].tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button>
                    詳細を見る
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* プロジェクトサムネイルリスト */}
            <div className="md:w-1/3 flex flex-col gap-4">
              {projects.map((project, index) => (
                <Card 
                  key={project.id}
                  className={`cursor-pointer transition ${
                    currentProject === index 
                      ? "border-blue-500 shadow-lg" 
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setCurrentProject(index)}
                >
                  <div className="flex p-4">
                    <div className="w-16 h-16 flex-shrink-0 mr-4">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full rounded object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
              <Button asChild variant="outline" className="mt-2">
                <Link href="/projects">
                  すべてのプロジェクトを見る
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* スキルセクション */}
      <section id="skills" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            スキルとテクノロジー
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js", level: 90 },
              { name: "React", level: 85 },
              { name: "TypeScript", level: 80 },
              { name: "Tailwind CSS", level: 95 },
              { name: "Node.js", level: 75 },
              { name: "UX/UI Design", level: 85 },
              { name: "GraphQL", level: 70 },
              { name: "Firebase", level: 80 }
            ].map((skill, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {skill.name}
                </h3>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-right text-sm text-gray-500 dark:text-gray-400">
                  {skill.level}%
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* お問い合わせセクション */}
      <section id="contact" className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            お問い合わせ
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Card className="p-6 h-full">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  メッセージを送る
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  プロジェクトや質問などがありましたら、お気軽にご連絡ください。
                </p>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      お名前
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="お名前"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      メッセージ
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="メッセージを入力してください"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">
                    送信する
                  </Button>
                </form>
              </Card>
            </div>
            
            <div className="md:w-1/2">
              <Card className="p-6 h-full">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  連絡先情報
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  以下の方法でも直接ご連絡いただけます。
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Eメール
                      </h4>
                      <p className="text-gray-900 dark:text-white">
                        contact@example.com
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      ソーシャルメディア
                    </h4>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="icon" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* フッター */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-xl font-bold">
                Portfolio<span className="text-blue-400">.</span>
              </Link>
              <p className="text-gray-400 mt-2">
                &copy; {new Date().getFullYear()} All Rights Reserved
              </p>
            </div>
            
            <nav className="flex flex-wrap gap-x-8 gap-y-2">
              <Link href="#about" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="#projects" className="text-gray-300 hover:text-white">
                Projects
              </Link>
              <Link href="#skills" className="text-gray-300 hover:text-white">
                Skills
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}