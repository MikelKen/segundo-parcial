"use client"

import { useState, useCallback, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import ComponentsSidebar from "./components-sidebar"
import DesignCanvas from "./design-canvas"
import PropertiesPanel from "./properties-panel"
import PreviewPanel from "./preview-panel"
import ExportPanel from "./export-panel"
import ScreensManager from "./screens-manager"
import ChatPanel from "./chat-panel"
import type { ComponentType, DesignElement, DeviceType, Screen, ChatMessage } from "@/lib/types"
import { generateFlutterCode } from "@/lib/code-generator"

export default function DesignerWorkspace() {
  // Screens state
  const [screens, setScreens] = useState<Screen[]>([{ id: "screen-1", name: "Home", elements: [] }])
  const [currentScreenId, setCurrentScreenId] = useState("screen-1")

  // Elements state
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null)
  const [history, setHistory] = useState<Record<string, DesignElement[][]>>({
    "screen-1": [[]],
  })
  const [historyIndex, setHistoryIndex] = useState<Record<string, number>>({
    "screen-1": 0,
  })

  // Device and mode state
  const [previewDevice, setPreviewDevice] = useState<DeviceType>("iphone13")
  const [canvasDevice, setCanvasDevice] = useState<DeviceType>("iphone13")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // View state
  const [showPreview, setShowPreview] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-message",
      text: "Welcome to the chat! How can I help you with your design?",
      sender: "assistant",
      timestamp: Date.now(),
    },
  ])

  // Get current screen elements
  const getCurrentScreenElements = useCallback(() => {
    const currentScreen = screens.find((s) => s.id === currentScreenId)
    return currentScreen ? currentScreen.elements : []
  }, [screens, currentScreenId])

  // Update current screen elements
  const updateCurrentScreenElements = useCallback(
    (elements: DesignElement[]) => {
      setScreens((prevScreens) =>
        prevScreens.map((screen) => (screen.id === currentScreenId ? { ...screen, elements } : screen)),
      )
    },
    [currentScreenId],
  )

  // Add current state to history
  const addToHistory = useCallback(
    (newElements: DesignElement[]) => {
      setHistory((prevHistory) => {
        const screenHistory = prevHistory[currentScreenId] || [[]]
        const screenHistoryIndex = historyIndex[currentScreenId] || 0

        // Remove any future history if we're not at the end
        const newScreenHistory = screenHistory.slice(0, screenHistoryIndex + 1)
        newScreenHistory.push([...newElements])

        // Limit history to prevent memory issues (keep last 50 states)
        if (newScreenHistory.length > 50) {
          newScreenHistory.shift()
          setHistoryIndex((prevIndices) => ({
            ...prevIndices,
            [currentScreenId]: Math.max(0, (prevIndices[currentScreenId] || 0) - 1),
          }))
        }

        return {
          ...prevHistory,
          [currentScreenId]: newScreenHistory,
        }
      })

      setHistoryIndex((prevIndices) => ({
        ...prevIndices,
        [currentScreenId]: Math.min(49, (prevIndices[currentScreenId] || 0) + 1),
      }))
    },
    [currentScreenId, historyIndex],
  )

  // Add element to the canvas
  const addElement = useCallback(
    (type: ComponentType, x: number, y: number) => {
      const newElement: DesignElement = {
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        x,
        y,
        width: getDefaultWidth(type),
        height: getDefaultHeight(type),
        properties: getDefaultProperties(type),
        children: [],
      }

      const currentElements = getCurrentScreenElements()
      const newElements = [...currentElements, newElement]

      // Update elements immediately
      updateCurrentScreenElements(newElements)

      // Set the new element as selected
      setSelectedElement(newElement)

      // Add to history without setTimeout to avoid race conditions
      addToHistory(newElements)
    },
    [addToHistory, getCurrentScreenElements, updateCurrentScreenElements],
  )

  // Update element properties
  const updateElement = useCallback(
    (id: string, updates: Partial<DesignElement>) => {
      const currentElements = getCurrentScreenElements()
      const newElements = currentElements.map((el) => (el.id === id ? { ...el, ...updates } : el))

      // Update elements immediately
      updateCurrentScreenElements(newElements)

      // Update selected element if it's the one being updated
      setSelectedElement((prevSelected) => {
        if (prevSelected && prevSelected.id === id) {
          return { ...prevSelected, ...updates }
        }
        return prevSelected
      })

      // Add to history without setTimeout
      addToHistory(newElements)
    },
    [addToHistory, getCurrentScreenElements, updateCurrentScreenElements],
  )

  // Remove element from canvas
  const removeElement = useCallback(
    (id: string) => {
      const currentElements = getCurrentScreenElements()
      const newElements = currentElements.filter((el) => el.id !== id)

      // Update elements immediately
      updateCurrentScreenElements(newElements)

      // Clear selection if the removed element was selected
      setSelectedElement((prevSelected) => {
        if (prevSelected && prevSelected.id === id) {
          return null
        }
        return prevSelected
      })

      // Add to history without setTimeout
      addToHistory(newElements)
    },
    [addToHistory, getCurrentScreenElements, updateCurrentScreenElements],
  )

  // Undo action
  const undo = useCallback(() => {
    const screenHistoryIndex = historyIndex[currentScreenId] || 0
    const screenHistory = history[currentScreenId] || [[]]

    if (screenHistoryIndex > 0) {
      const newIndex = screenHistoryIndex - 1

      setHistoryIndex((prevIndices) => ({
        ...prevIndices,
        [currentScreenId]: newIndex,
      }))

      updateCurrentScreenElements([...screenHistory[newIndex]])
      setSelectedElement(null)
    }
  }, [history, historyIndex, currentScreenId, updateCurrentScreenElements])

  // Redo action
  const redo = useCallback(() => {
    const screenHistoryIndex = historyIndex[currentScreenId] || 0
    const screenHistory = history[currentScreenId] || [[]]

    if (screenHistoryIndex < screenHistory.length - 1) {
      const newIndex = screenHistoryIndex + 1

      setHistoryIndex((prevIndices) => ({
        ...prevIndices,
        [currentScreenId]: newIndex,
      }))

      updateCurrentScreenElements([...screenHistory[newIndex]])
      setSelectedElement(null)
    }
  }, [history, historyIndex, currentScreenId, updateCurrentScreenElements])

  // Generate Flutter code
  const generateCode = useCallback(() => {
    return generateFlutterCode(getCurrentScreenElements(), isDarkMode)
  }, [getCurrentScreenElements, isDarkMode])

  // Toggle preview panel
  const togglePreview = useCallback(() => {
    setShowPreview((prev) => !prev)
    setShowExport(false)
    setShowChat(false)
  }, [])

  // Toggle export panel
  const toggleExport = useCallback(() => {
    setShowExport((prev) => !prev)
    setShowPreview(false)
    setShowChat(false)
  }, [])

  // Toggle chat panel
  const toggleChat = useCallback(() => {
    setShowChat((prev) => !prev)
    setShowPreview(false)
    setShowExport(false)
  }, [])

  // Clear all elements
  const clearCanvas = useCallback(() => {
    const emptyElements: DesignElement[] = []
    updateCurrentScreenElements(emptyElements)
    setSelectedElement(null)
    addToHistory(emptyElements)
  }, [addToHistory, updateCurrentScreenElements])

  // Screen management functions
  const addScreen = useCallback((name: string) => {
    const newScreenId = `screen-${Date.now()}`

    setScreens((prevScreens) => [...prevScreens, { id: newScreenId, name, elements: [] }])

    setHistory((prevHistory) => ({
      ...prevHistory,
      [newScreenId]: [[]],
    }))

    setHistoryIndex((prevIndices) => ({
      ...prevIndices,
      [newScreenId]: 0,
    }))

    setCurrentScreenId(newScreenId)
  }, [])

  const renameScreen = useCallback((id: string, name: string) => {
    setScreens((prevScreens) => prevScreens.map((screen) => (screen.id === id ? { ...screen, name } : screen)))
  }, [])

  const deleteScreen = useCallback(
    (id: string) => {
      if (screens.length <= 1) return // Don't delete the last screen

      const newScreens = screens.filter((screen) => screen.id !== id)
      setScreens(newScreens)

      // Update current screen if the deleted one was selected
      if (id === currentScreenId) {
        setCurrentScreenId(newScreens[0].id)
      }

      // Clean up history
      setHistory((prevHistory) => {
        const newHistory = { ...prevHistory }
        delete newHistory[id]
        return newHistory
      })

      setHistoryIndex((prevIndices) => {
        const newIndices = { ...prevIndices }
        delete newIndices[id]
        return newIndices
      })
    },
    [screens, currentScreenId],
  )

  // Handle navigation between screens
  const navigateToScreen = useCallback(
    (screenId: string) => {
      if (screens.some((screen) => screen.id === screenId)) {
        setCurrentScreenId(screenId)
      }
    },
    [screens],
  )

  // Chat functions
  const sendChatMessage = useCallback((text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender: "user",
      timestamp: Date.now(),
    }

    setChatMessages((prev) => [...prev, userMessage])

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: `I received your message: "${text}". This is a simulated response.`,
        sender: "assistant",
        timestamp: Date.now(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }, [])

  // Get default width based on component type
  const getDefaultWidth = (type: ComponentType): number => {
    switch (type) {
      case "button":
        return 120
      case "textField":
        return 200
      case "card":
        return 300
      case "list":
        return 300
      case "icon":
        return 24
      case "container":
        return 200
      case "row":
        return 300
      case "column":
        return 200
      case "stack":
        return 200
      case "switch":
        return 60
      case "checkbox":
        return 24
      case "radio":
        return 24
      case "chatInput":
        return 300
      case "chatMessage":
        return 250
      case "dropdown":
        return 200
      case "inputWithLabel":
        return 200
      case "switchWithLabel":
        return 200
      case "radioWithLabel":
        return 200
      case "checkboxWithLabel":
        return 200
      case "dynamicTable":
        return 350
      default:
        return 100
    }
  }

  // Get default height based on component type
  const getDefaultHeight = (type: ComponentType): number => {
    switch (type) {
      case "button":
        return 40
      case "textField":
        return 56
      case "card":
        return 200
      case "list":
        return 300
      case "icon":
        return 24
      case "container":
        return 200
      case "row":
        return 50
      case "column":
        return 200
      case "stack":
        return 200
      case "switch":
        return 24
      case "checkbox":
        return 24
      case "radio":
        return 24
      case "chatInput":
        return 50
      case "chatMessage":
        return 80
      case "dropdown":
        return 70
      case "inputWithLabel":
        return 70
      case "switchWithLabel":
        return 40
      case "radioWithLabel":
        return 40
      case "checkboxWithLabel":
        return 40
      case "dynamicTable":
        return 200
      default:
        return 50
    }
  }

  // Get default properties based on component type
  const getDefaultProperties = (type: ComponentType) => {
    switch (type) {
      case "button":
        return {
          text: "Button",
          variant: "primary",
          rounded: true,
          color: "#2196F3",
          textColor: "#FFFFFF",
          padding: 16,
          navigateTo: "",
        }
      case "textField":
        return {
          hint: "Enter text",
          label: "Label",
          hasIcon: false,
          icon: "search",
          validation: false,
          validationMessage: "Please enter a valid value",
        }
      case "card":
        return {
          elevation: 2,
          borderRadius: 8,
          color: "#FFFFFF",
          padding: 16,
        }
      case "list":
        return {
          direction: "vertical",
          scrollable: true,
          itemCount: 5,
          itemHeight: 50,
        }
      case "icon":
        return {
          name: "star",
          color: "#000000",
          size: 24,
        }
      case "container":
        return {
          color: "#E0E0E0",
          padding: 16,
          margin: 8,
          borderRadius: 0,
        }
      case "row":
        return {
          mainAxisAlignment: "start",
          crossAxisAlignment: "center",
          padding: 8,
        }
      case "column":
        return {
          mainAxisAlignment: "start",
          crossAxisAlignment: "center",
          padding: 8,
        }
      case "stack":
        return {
          alignment: "center",
          padding: 8,
        }
      case "switch":
        return {
          value: false,
          activeColor: "#2196F3",
          inactiveColor: "#9E9E9E",
        }
      case "checkbox":
        return {
          value: false,
          activeColor: "#2196F3",
        }
      case "radio":
        return {
          value: false,
          activeColor: "#2196F3",
          groupValue: "option1",
        }
      case "chatInput":
        return {
          placeholder: "Type a message...",
          buttonText: "Send",
          buttonColor: "#2196F3",
        }
      case "chatMessage":
        return {
          text: "Hello! This is a sample message.",
          isUser: true,
          avatar: true,
          timestamp: true,
        }
      case "dropdown":
        return {
          label: "Select an option",
          placeholder: "Choose...",
          options: JSON.stringify([
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" },
          ]),
          value: "",
          required: false,
          disabled: false,
          borderColor: "#d1d5db",
          backgroundColor: "#ffffff",
        }
      case "inputWithLabel":
        return {
          label: "Input Label",
          placeholder: "Enter text...",
          value: "",
          type: "text",
          required: false,
          disabled: false,
          borderColor: "#d1d5db",
          labelColor: "#374151",
        }
      case "switchWithLabel":
        return {
          label: "Toggle Switch",
          value: false,
          activeColor: "#2196F3",
          inactiveColor: "#9E9E9E",
          labelPosition: "right",
          disabled: false,
          labelColor: "#374151",
        }
      case "radioWithLabel":
        return {
          label: "Radio Option",
          value: false,
          activeColor: "#2196F3",
          groupValue: "option1",
          labelPosition: "right",
          disabled: false,
          labelColor: "#374151",
        }
      case "checkboxWithLabel":
        return {
          label: "Checkbox Option",
          value: false,
          activeColor: "#2196F3",
          labelPosition: "right",
          disabled: false,
          labelColor: "#374151",
        }
      case "dynamicTable":
        return {
          title: "Data Table",
          columns: JSON.stringify([
            { id: "col1", title: "Column 1", width: 100 },
            { id: "col2", title: "Column 2", width: 100 },
            { id: "col3", title: "Column 3", width: 100 },
          ]),
          rowCount: 3,
          showHeader: true,
          showBorder: true,
          striped: true,
          headerColor: "#f3f4f6",
          borderColor: "#e5e7eb",
          evenRowColor: "#ffffff",
          oddRowColor: "#f9fafb",
        }
      default:
        return {}
    }
  }

  // Get current screen
  const currentScreen = screens.find((s) => s.id === currentScreenId) || screens[0]

  // Reset selected element when changing screens
  useEffect(() => {
    setSelectedElement(null)
  }, [currentScreenId])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={!historyIndex[currentScreenId] || historyIndex[currentScreenId] === 0}
              className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              title="Undo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7v6h6"></path>
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={
                !history[currentScreenId] ||
                !historyIndex[currentScreenId] ||
                historyIndex[currentScreenId] === history[currentScreenId].length - 1
              }
              className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              title="Redo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 7v6h-6"></path>
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path>
              </svg>
            </button>
            <div className="h-4 w-px bg-gray-300" />
            <button onClick={clearCanvas} className="rounded p-1 text-gray-600 hover:bg-gray-100" title="Clear Canvas">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
            <span className="text-sm text-gray-500">Elements: {getCurrentScreenElements().length}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={togglePreview}
              className={`rounded px-3 py-1 text-sm ${showPreview ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Preview
            </button>
            <button
              onClick={toggleExport}
              className={`rounded px-3 py-1 text-sm ${showExport ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Export
            </button>
            <button
              onClick={toggleChat}
              className={`rounded px-3 py-1 text-sm ${showChat ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Chat
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        <ScreensManager
          screens={screens}
          currentScreenId={currentScreenId}
          onAddScreen={addScreen}
          onRenameScreen={renameScreen}
          onDeleteScreen={deleteScreen}
          onSelectScreen={setCurrentScreenId}
        />

        <div className="flex flex-1 overflow-hidden">
          <ComponentsSidebar onAddElement={addElement} />

          <div className="flex flex-1 flex-col">
            {showPreview ? (
              <PreviewPanel
                elements={getCurrentScreenElements()}
                device={previewDevice}
                isDarkMode={isDarkMode}
                onDeviceChange={(device) => {
                  setPreviewDevice(device)
                  setCanvasDevice(device)
                }}
              />
            ) : showExport ? (
              <ExportPanel code={generateCode()} elements={getCurrentScreenElements()} />
            ) : showChat ? (
              <ChatPanel messages={chatMessages} onSendMessage={sendChatMessage} />
            ) : (
              <DesignCanvas
                elements={getCurrentScreenElements()}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onUpdateElement={updateElement}
                onRemoveElement={removeElement}
                isDarkMode={isDarkMode}
                onAddElement={addElement}
                deviceType={canvasDevice}
                onDeviceChange={setCanvasDevice}
                currentScreen={currentScreen}
                onNavigate={navigateToScreen}
              />
            )}
          </div>

          {!showPreview && !showExport && !showChat && (
            <PropertiesPanel
              selectedElement={selectedElement}
              onUpdateElement={updateElement}
              onRemoveElement={removeElement}
              screens={screens}
            />
          )}
        </div>
      </div>
    </DndProvider>
  )
}
