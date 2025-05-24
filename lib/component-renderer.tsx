"use client"

import type { DesignElement, TableColumn } from "./types"

export function renderComponentPreview(element: DesignElement, isDarkMode: boolean) {
  const { type, properties } = element

  switch (type) {
    case "button":
      return renderButton(properties, isDarkMode)
    case "textField":
      return renderTextField(properties, isDarkMode)
    case "card":
      return renderCard(properties, isDarkMode)
    case "list":
      return renderList(properties, isDarkMode)
    case "icon":
      return renderIcon(properties)
    case "container":
      return renderContainer(properties, isDarkMode)
    case "row":
      return renderRow(properties, isDarkMode)
    case "column":
      return renderColumn(properties, isDarkMode)
    case "stack":
      return renderStack(properties, isDarkMode)
    case "switch":
      return renderSwitch(properties)
    case "checkbox":
      return renderCheckbox(properties)
    case "radio":
      return renderRadio(properties)
    case "chatInput":
      return renderChatInput(properties, isDarkMode)
    case "chatMessage":
      return renderChatMessage(properties, isDarkMode)
    case "dropdown":
      return renderDropdown(properties, isDarkMode)
    case "inputWithLabel":
      return renderInputWithLabel(properties, isDarkMode)
    case "switchWithLabel":
      return renderSwitchWithLabel(properties, isDarkMode)
    case "radioWithLabel":
      return renderRadioWithLabel(properties, isDarkMode)
    case "checkboxWithLabel":
      return renderCheckboxWithLabel(properties, isDarkMode)
    case "dynamicTable":
      return renderDynamicTable(properties, isDarkMode)
    default:
      return <div className="h-full w-full bg-gray-200" />
  }
}

function renderButton(properties: Record<string, any>, isDarkMode: boolean) {
  const { text, variant, rounded, color, textColor, padding, navigateTo } = properties

  let className = "flex items-center justify-center h-full w-full"

  if (variant === "primary") {
    className += ` bg-[${color}] text-[${textColor}]`
  } else if (variant === "outline") {
    className += ` border-2 border-[${color}] text-[${color}] bg-transparent`
  } else {
    className += ` bg-gray-200 text-gray-800`
  }

  if (rounded) {
    className += " rounded-full"
  } else {
    className += " rounded-md"
  }

  // Add navigation indicator if this button navigates to a screen
  const hasNavigation = navigateTo && navigateTo !== ""

  return (
    <div className={className} style={{ padding: `${padding}px` }}>
      <div className="flex items-center">
        {text}
        {hasNavigation && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </div>
    </div>
  )
}

function renderTextField(properties: Record<string, any>, isDarkMode: boolean) {
  const { hint, label, hasIcon, icon, validation } = properties

  return (
    <div className="flex h-full w-full flex-col">
      {label && (
        <label className={`mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{label}</label>
      )}
      <div
        className={`flex flex-1 items-center rounded-md border ${validation ? "border-red-500" : isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300"}`}
      >
        {hasIcon && (
          <div className="pl-3 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        )}
        <div className={`flex-1 px-3 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{hint}</div>
      </div>
      {validation && <p className="mt-1 text-xs text-red-500">Please enter a valid value</p>}
    </div>
  )
}

function renderCard(properties: Record<string, any>, isDarkMode: boolean) {
  const { elevation, borderRadius, color, padding } = properties

  return (
    <div
      className="h-full w-full"
      style={{
        backgroundColor: color,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.1)`,
      }}
    >
      <div className={`h-8 w-3/4 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
      <div className={`mt-2 h-4 w-1/2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
      <div className={`mt-4 h-20 w-full rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
    </div>
  )
}

function renderList(properties: Record<string, any>, isDarkMode: boolean) {
  const { direction, scrollable, itemCount, itemHeight } = properties

  const items = Array.from({ length: itemCount }, (_, i) => i)

  return (
    <div className={`h-full w-full overflow-auto ${direction === "horizontal" ? "flex" : "flex flex-col"}`}>
      {items.map((i) => (
        <div
          key={i}
          className={`flex items-center ${
            direction === "horizontal" ? "h-full w-40 flex-shrink-0" : "h-12 w-full flex-shrink-0"
          } ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} border-b border-${isDarkMode ? "gray-700" : "gray-100"} p-2`}
        >
          <div className={`h-6 w-6 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
          <div className={`ml-2 h-4 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
        </div>
      ))}
    </div>
  )
}

function renderIcon(properties: Record<string, any>) {
  const { name, color, size } = properties

  return (
    <div className="flex h-full w-full items-center justify-center" style={{ color }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </div>
  )
}

function renderContainer(properties: Record<string, any>, isDarkMode: boolean) {
  const { color, padding, margin, borderRadius } = properties

  return (
    <div
      className="h-full w-full"
      style={{
        backgroundColor: color,
        padding: `${padding}px`,
        margin: `${margin}px`,
        borderRadius: `${borderRadius}px`,
      }}
    >
      <div
        className={`h-full w-full rounded border ${isDarkMode ? "border-gray-700" : "border-gray-300"} border-dashed`}
      />
    </div>
  )
}

function renderRow(properties: Record<string, any>, isDarkMode: boolean) {
  const { mainAxisAlignment, crossAxisAlignment, padding } = properties

  let justifyContent = "flex-start"
  if (mainAxisAlignment === "center") justifyContent = "center"
  if (mainAxisAlignment === "end") justifyContent = "flex-end"
  if (mainAxisAlignment === "spaceBetween") justifyContent = "space-between"
  if (mainAxisAlignment === "spaceAround") justifyContent = "space-around"
  if (mainAxisAlignment === "spaceEvenly") justifyContent = "space-evenly"

  let alignItems = "flex-start"
  if (crossAxisAlignment === "center") alignItems = "center"
  if (crossAxisAlignment === "end") alignItems = "flex-end"
  if (crossAxisAlignment === "stretch") alignItems = "stretch"

  return (
    <div
      className="flex h-full w-full border border-dashed border-gray-400"
      style={{
        justifyContent,
        alignItems,
        padding: `${padding}px`,
      }}
    >
      <div className={`h-8 w-8 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
      <div className={`h-8 w-8 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
      <div className={`h-8 w-8 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
    </div>
  )
}

function renderColumn(properties: Record<string, any>, isDarkMode: boolean) {
  const { mainAxisAlignment, crossAxisAlignment, padding } = properties

  let justifyContent = "flex-start"
  if (mainAxisAlignment === "center") justifyContent = "center"
  if (mainAxisAlignment === "end") justifyContent = "flex-end"
  if (mainAxisAlignment === "spaceBetween") justifyContent = "space-between"
  if (mainAxisAlignment === "spaceAround") justifyContent = "space-around"
  if (mainAxisAlignment === "spaceEvenly") justifyContent = "space-evenly"

  let alignItems = "flex-start"
  if (crossAxisAlignment === "center") alignItems = "center"
  if (crossAxisAlignment === "end") alignItems = "flex-end"
  if (crossAxisAlignment === "stretch") alignItems = "stretch"

  return (
    <div
      className="flex h-full w-full flex-col border border-dashed border-gray-400"
      style={{
        justifyContent,
        alignItems,
        padding: `${padding}px`,
      }}
    >
      <div className={`h-8 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
      <div className={`mt-2 h-8 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
      <div className={`mt-2 h-8 w-24 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
    </div>
  )
}

function renderStack(properties: Record<string, any>, isDarkMode: boolean) {
  const { alignment, padding } = properties

  let alignItems = "flex-start"
  let justifyContent = "flex-start"

  if (alignment === "center") {
    alignItems = "center"
    justifyContent = "center"
  } else if (alignment === "topCenter") {
    alignItems = "center"
    justifyContent = "flex-start"
  } else if (alignment === "topRight") {
    alignItems = "flex-end"
    justifyContent = "flex-start"
  } else if (alignment === "centerLeft") {
    alignItems = "flex-start"
    justifyContent = "center"
  } else if (alignment === "centerRight") {
    alignItems = "flex-end"
    justifyContent = "center"
  } else if (alignment === "bottomLeft") {
    alignItems = "flex-start"
    justifyContent = "flex-end"
  } else if (alignment === "bottomCenter") {
    alignItems = "center"
    justifyContent = "flex-end"
  } else if (alignment === "bottomRight") {
    alignItems = "flex-end"
    justifyContent = "flex-end"
  }

  return (
    <div
      className="relative flex h-full w-full border border-dashed border-gray-400"
      style={{
        padding: `${padding}px`,
      }}
    >
      <div
        className={`absolute h-16 w-16 rounded ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}
        style={{
          top: alignment.includes("top") ? "0" : alignment.includes("bottom") ? "auto" : "50%",
          bottom: alignment.includes("bottom") ? "0" : "auto",
          left: alignment.includes("Left") ? "0" : alignment.includes("Right") ? "auto" : "50%",
          right: alignment.includes("Right") ? "0" : "auto",
          transform:
            alignment === "center"
              ? "translate(-50%, -50%)"
              : alignment === "topCenter"
                ? "translateX(-50%)"
                : alignment === "centerLeft"
                  ? "translateY(-50%)"
                  : alignment === "centerRight"
                    ? "translateY(-50%)"
                    : alignment === "bottomCenter"
                      ? "translateX(-50%)"
                      : "none",
        }}
      />
      <div
        className={`absolute h-12 w-12 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
        style={{
          top: alignment.includes("top") ? "10px" : alignment.includes("bottom") ? "auto" : "calc(50% + 10px)",
          bottom: alignment.includes("bottom") ? "10px" : "auto",
          left: alignment.includes("Left") ? "10px" : alignment.includes("Right") ? "auto" : "calc(50% + 10px)",
          right: alignment.includes("Right") ? "10px" : "auto",
          transform:
            alignment === "center"
              ? "translate(-50%, -50%)"
              : alignment === "topCenter"
                ? "translateX(-50%)"
                : alignment === "centerLeft"
                  ? "translateY(-50%)"
                  : alignment === "centerRight"
                    ? "translateY(-50%)"
                    : alignment === "bottomCenter"
                      ? "translateX(-50%)"
                      : "none",
        }}
      />
    </div>
  )
}

function renderSwitch(properties: Record<string, any>) {
  const { value, activeColor, inactiveColor } = properties

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative h-6 w-12 rounded-full transition-colors duration-200"
        style={{ backgroundColor: value ? activeColor : inactiveColor }}
        onClick={(e) => e.preventDefault()}
      >
        <div
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
          style={{ left: value ? "calc(100% - 20px - 2px)" : "2px" }}
        />
      </div>
    </div>
  )
}

function renderCheckbox(properties: Record<string, any>) {
  const { value, activeColor } = properties

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded border ${
          value ? `bg-[${activeColor}] border-[${activeColor}]` : "border-gray-400 bg-white"
        }`}
        onClick={(e) => e.preventDefault()}
      >
        {value && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
    </div>
  )
}

function renderRadio(properties: Record<string, any>) {
  const { value, activeColor } = properties

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          value ? `border-[${activeColor}]` : "border-gray-400"
        }`}
        onClick={(e) => e.preventDefault()}
      >
        {value && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: activeColor }} />}
      </div>
    </div>
  )
}

function renderChatInput(properties: Record<string, any>, isDarkMode: boolean) {
  const { placeholder, buttonText, buttonColor } = properties

  return (
    <div className="flex h-full w-full items-center space-x-2 rounded-lg border p-2">
      <div
        className={`flex-1 rounded-md px-3 py-2 ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}
      >
        {placeholder || "Type a message..."}
      </div>
      <button className="rounded-md px-3 py-2 text-white" style={{ backgroundColor: buttonColor || "#2196F3" }}>
        {buttonText || "Send"}
      </button>
    </div>
  )
}

function renderChatMessage(properties: Record<string, any>, isDarkMode: boolean) {
  const { text, isUser, avatar, timestamp } = properties

  const messageText = text || "This is a sample message"
  const messageTime = "12:34 PM"

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[80%]">
        {!isUser && avatar && <div className="mr-2 h-8 w-8 flex-shrink-0 rounded-full bg-gray-300"></div>}
        <div>
          <div
            className={`rounded-lg p-3 ${
              isUser
                ? "rounded-tr-none bg-blue-500 text-white"
                : isDarkMode
                  ? "rounded-tl-none bg-gray-700 text-white"
                  : "rounded-tl-none bg-gray-200 text-gray-800"
            }`}
          >
            {messageText}
          </div>
          {timestamp && <div className="mt-1 text-xs text-gray-500">{messageTime}</div>}
        </div>
        {isUser && avatar && <div className="ml-2 h-8 w-8 flex-shrink-0 rounded-full bg-blue-300"></div>}
      </div>
    </div>
  )
}

function renderDropdown(properties: Record<string, any>, isDarkMode: boolean) {
  const {
    label,
    placeholder,
    options = [],
    value,
    required,
    disabled,
    borderColor = "#d1d5db",
    backgroundColor = isDarkMode ? "#1f2937" : "#ffffff",
  } = properties

  const parsedOptions =
    typeof options === "string"
      ? JSON.parse(options)
      : Array.isArray(options)
        ? options
        : [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" },
          ]

  return (
    <div className="flex h-full w-full flex-col">
      {label && (
        <label className={`mb-1 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div
        className={`relative flex w-full items-center rounded-md border ${disabled ? "opacity-60" : ""}`}
        style={{
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        }}
      >
        <select
          className={`w-full appearance-none rounded-md border-none bg-transparent px-3 py-2 pr-8 text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
          disabled={disabled}
          defaultValue={value || ""}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {parsedOptions.map((option: any, index: number) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  )
}

function renderInputWithLabel(properties: Record<string, any>, isDarkMode: boolean) {
  const {
    label,
    placeholder,
    value,
    type = "text",
    required,
    disabled,
    borderColor = "#d1d5db",
    labelColor = isDarkMode ? "#d1d5db" : "#374151",
  } = properties

  return (
    <div className="flex h-full w-full flex-col">
      <label className="mb-1 text-sm font-medium" style={{ color: labelColor }}>
        {label || "Label"}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder || "Enter text..."}
        defaultValue={value || ""}
        disabled={disabled}
        className={`w-full rounded-md border px-3 py-2 text-sm ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
        } ${disabled ? "opacity-60" : ""}`}
        style={{ borderColor: borderColor }}
        readOnly
      />
    </div>
  )
}

function renderSwitchWithLabel(properties: Record<string, any>, isDarkMode: boolean) {
  const {
    label,
    value,
    activeColor = "#2196F3",
    inactiveColor = "#9E9E9E",
    labelPosition = "right",
    disabled,
    labelColor = isDarkMode ? "#d1d5db" : "#374151",
  } = properties

  const switchElement = (
    <div
      className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${disabled ? "opacity-60" : ""}`}
      style={{ backgroundColor: value ? activeColor : inactiveColor }}
      onClick={(e) => e.preventDefault()}
    >
      <div
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ left: value ? "calc(100% - 20px - 2px)" : "2px" }}
      />
    </div>
  )

  return (
    <div className="flex h-full w-full items-center">
      {labelPosition === "left" && (
        <label className="mr-3 text-sm font-medium" style={{ color: labelColor }}>
          {label || "Label"}
        </label>
      )}

      {switchElement}

      {labelPosition === "right" && (
        <label className="ml-3 text-sm font-medium" style={{ color: labelColor }}>
          {label || "Label"}
        </label>
      )}
    </div>
  )
}

function renderRadioWithLabel(properties: Record<string, any>, isDarkMode: boolean) {
  const {
    label,
    value,
    activeColor = "#2196F3",
    labelPosition = "right",
    disabled,
    labelColor = isDarkMode ? "#d1d5db" : "#374151",
  } = properties

  const radioElement = (
    <div
      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
        value ? `border-[${activeColor}]` : "border-gray-400"
      } ${disabled ? "opacity-60" : ""}`}
      onClick={(e) => e.preventDefault()}
    >
      {value && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: activeColor }} />}
    </div>
  )

  return (
    <div className="flex h-full w-full items-center">
      {labelPosition === "left" && (
        <label className="mr-3 text-sm font-medium" style={{ color: labelColor }}>
          {label || "Radio option"}
        </label>
      )}

      {radioElement}

      {labelPosition === "right" && (
        <label className="ml-3 text-sm font-medium" style={{ color: labelColor }}>
          {label || "Radio option"}
        </label>
      )}
    </div>
  )
}

function renderCheckboxWithLabel(properties: Record<string, any>, isDarkMode: boolean) {
  const {
    label,
    value,
    activeColor = "#2196F3",
    labelPosition = "right",
    disabled,
    labelColor = isDarkMode ? "#d1d5db" : "#374151",
  } = properties

  const checkboxElement = (
    <div
      className={`flex h-5 w-5 items-center justify-center rounded border ${
        value ? `bg-[${activeColor}] border-[${activeColor}]` : "border-gray-400 bg-white"
      } ${disabled ? "opacity-60" : ""}`}
      onClick={(e) => e.preventDefault()}
    >
      {value && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  )

  return (
    <div className="flex h-full w-full items-center">
      {labelPosition === "left" && (
        <label className="mr-3 text-sm font-medium" style={{ color: labelColor }}>
          {label || "Checkbox option"}
        </label>
      )}

      {checkboxElement}

      {labelPosition === "right" && (
        <label className="ml-3 text-sm font-medium" style={{ color: labelColor }}>
          {label || "Checkbox option"}
        </label>
      )}
    </div>
  )
}

function renderDynamicTable(properties: Record<string, any>, isDarkMode: boolean) {
  const {
    title,
    columns = [],
    rowCount = 3,
    showHeader = true,
    showBorder = true,
    striped = true,
    headerColor = isDarkMode ? "#1f2937" : "#f3f4f6",
    borderColor = "#e5e7eb",
    evenRowColor = isDarkMode ? "#1f2937" : "#ffffff",
    oddRowColor = isDarkMode ? "#111827" : "#f9fafb",
  } = properties

  // Parse columns if it's a string
  const parsedColumns: TableColumn[] =
    typeof columns === "string"
      ? JSON.parse(columns)
      : Array.isArray(columns)
        ? columns
        : [
            { id: "col1", title: "Column 1", width: 100 },
            { id: "col2", title: "Column 2", width: 100 },
            { id: "col3", title: "Column 3", width: 100 },
          ]

  // Generate rows
  const rows = Array.from({ length: rowCount }, (_, rowIndex) => {
    return parsedColumns.map((col, colIndex) => `Cell ${rowIndex + 1}-${colIndex + 1}`)
  })

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {title && (
        <div className={`px-3 py-2 font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{title}</div>
      )}

      <div className="flex-1 overflow-auto">
        <table
          className={`w-full ${showBorder ? "border-collapse" : "border-separate border-spacing-0"}`}
          style={{ borderColor: borderColor }}
        >
          {showHeader && (
            <thead>
              <tr style={{ backgroundColor: headerColor }}>
                {parsedColumns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-3 py-2 text-left text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } ${showBorder ? "border" : ""}`}
                    style={{
                      width: `${column.width}px`,
                      borderColor: borderColor,
                    }}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  backgroundColor: striped
                    ? rowIndex % 2 === 0
                      ? evenRowColor
                      : oddRowColor
                    : isDarkMode
                      ? "#1f2937"
                      : "#ffffff",
                }}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-3 py-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } ${showBorder ? "border" : ""}`}
                    style={{ borderColor: borderColor }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
