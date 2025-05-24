"use client"

import type { DesignElement, DeviceType } from "@/lib/types"
import { renderComponentPreview } from "@/lib/component-renderer"

interface PreviewPanelProps {
  elements: DesignElement[]
  device: DeviceType
  isDarkMode: boolean
  onDeviceChange: (device: DeviceType) => void
}

export default function PreviewPanel({ elements, device, isDarkMode, onDeviceChange }: PreviewPanelProps) {
  const devices = [
    { id: "iphone13", label: "iPhone 13", width: 390, height: 844 },
    { id: "pixel6", label: "Pixel 6", width: 412, height: 915 },
    { id: "samsungs21", label: "Samsung S21", width: 360, height: 800 },
  ]

  const currentDevice = devices.find((d) => d.id === device) || devices[0]

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="device-select" className="text-sm font-medium text-gray-700">
            Device:
          </label>
          <select
            id="device-select"
            value={device}
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
          className="relative shadow-xl"
          style={{
            width: `${currentDevice.width / 2 + 20}px`,
            height: `${currentDevice.height / 2 + 40}px`,
          }}
        >
          {/* Phone frame */}
          <div className="absolute inset-0 rounded-[20px] bg-gray-800"></div>

          {/* Phone notch (for iPhone) */}
          {device === "iphone13" && (
            <div className="absolute left-1/2 top-0 h-3 w-16 -translate-x-1/2 rounded-b-xl bg-gray-800"></div>
          )}

          {/* Phone screen */}
          <div
            className="absolute inset-[5px] overflow-hidden rounded-[15px]"
            style={{
              backgroundColor: isDarkMode ? "#121212" : "#ffffff",
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: `${element.x / 2}px`,
                    top: `${element.y / 2}px`,
                    width: `${element.width / 2}px`,
                    height: `${element.height / 2}px`,
                    transform: "scale(0.5)",
                    transformOrigin: "top left",
                  }}
                >
                  {renderComponentPreview(element, isDarkMode)}
                </div>
              ))}
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-1.5 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
