"use client";

import type React from "react";
import { useDrop } from "react-dnd";
import type { ComponentType, DesignElement, DeviceType, Screen } from "@/lib/types";
import CanvasElement from "./canvas-element";

interface DesignCanvasProps {
  elements: DesignElement[];
  selectedElement: DesignElement | null;
  onSelectElement: (element: DesignElement | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onRemoveElement: (id: string) => void;
  isDarkMode: boolean;
  onAddElement: (type: ComponentType, x: number, y: number) => void;
  deviceType: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  currentScreen: Screen;
  onNavigate?: (screenId: string) => void;
}

export default function DesignCanvas(props: DesignCanvasProps) {
  const { deviceType, onDeviceChange, currentScreen, onNavigate } = props;
  const { elements, selectedElement, onSelectElement, onUpdateElement, onRemoveElement, isDarkMode, onAddElement } =
    props;

  const devices = [
    { id: "iphone13", label: "iPhone 13", width: 390, height: 844 },
    { id: "pixel6", label: "Pixel 6", width: 412, height: 915 },
    { id: "samsungs21", label: "Samsung S21", width: 360, height: 800 },
  ];

  const currentDevice = devices.find((d) => d.id === deviceType) || devices[0];

  const handleDrop = (item: { type: string }, monitor: any) => {
    const offset = monitor.getClientOffset();
    if (offset && onAddElement) {
      const phoneContainer = document.getElementById("phone-container")?.getBoundingClientRect();
      const phoneScreen = document.getElementById("phone-screen")?.getBoundingClientRect();

      if (phoneContainer && phoneScreen) {
        // Calculate position relative to the phone screen
        const x = Math.round((offset.x - phoneScreen.left) / 20) * 20;
        const y = Math.round((offset.y - phoneScreen.top) / 20) * 20;

        // Only add if within phone screen bounds
        if (x >= 0 && x <= phoneScreen.width && y >= 0 && y <= phoneScreen.height) {
          onAddElement(item.type as any, x, y);
        }
      }
    }
    return undefined;
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas, not on an element
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  // Handle button clicks for navigation
  const handleElementClick = (element: DesignElement) => {
    if (element.type === "button" && element.properties.navigateTo && onNavigate) {
      onNavigate(element.properties.navigateTo);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Design Canvas</h2>
          <span className="ml-2 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            Screen: {currentScreen.name}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="device-select-canvas" className="text-sm font-medium text-gray-700">
            Device:
          </label>
          <select
            id="device-select-canvas"
            value={deviceType}
            onChange={(e) => onDeviceChange(e.target.value as DeviceType)}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div
          id="phone-container"
          className="relative"
          style={{
            width: `${currentDevice.width + 40}px`,
            height: `${currentDevice.height + 80}px`,
          }}
        >
          {/* Phone frame */}
          <div className="absolute inset-0 rounded-[40px] bg-gray-800 shadow-xl"></div>

          {/* Phone notch (for iPhone) */}
          {deviceType === "iphone13" && (
            <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-800"></div>
          )}

          {/* Phone screen */}
          <div
            id="phone-screen"
            ref={drop}
            className={`absolute inset-[10px] overflow-hidden rounded-[30px] ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } ${isOver ? "bg-blue-50" : ""}`}
            onClick={handleCanvasClick}
            style={{
              backgroundImage: isDarkMode
                ? "none"
                : "linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <div className="relative h-full w-full">
              {elements.map((element) => (
                <div
                  key={element.id}
                  onClick={() => handleElementClick(element)}
                  className={element.type === "button" && element.properties.navigateTo ? "cursor-pointer" : ""}
                >
                  <CanvasElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    onSelect={() => onSelectElement(element)}
                    onUpdate={(updates) => onUpdateElement(element.id, updates)}
                    onRemove={() => onRemoveElement(element.id)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Home indicator (for modern phones) */}
          <div className="absolute bottom-3 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
