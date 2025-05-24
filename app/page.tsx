import DesignerWorkspace from "@/components/designer-workspace"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Flutter UI Designer</h1>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/yourusername/flutter-ui-designer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>
      <DesignerWorkspace />
    </main>
  )
}
