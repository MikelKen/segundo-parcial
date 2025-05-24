import type { DesignElement } from "./types"

export function generateFlutterCode(elements: DesignElement[], isDarkMode: boolean): string {
  const imports = generateImports()
  const themeData = generateThemeData(isDarkMode)
  const widgetCode = generateWidgetCode(elements)

  return `
import 'package:flutter/material.dart';
${imports}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter UI App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        ${themeData}
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key}) : super(key: key);

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter UI App'),
      ),
      body: Stack(
        children: [
          ${widgetCode}
        ],
      ),
    );
  }
}
`
}

function generateImports(): string {
  return `
import 'package:flutter/cupertino.dart';
import 'package:google_fonts/google_fonts.dart';
`
}

function generateThemeData(isDarkMode: boolean): string {
  return isDarkMode
    ? `
        brightness: Brightness.dark,
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: const Color(0xFF121212),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E1E1E),
          elevation: 0,
        ),
      `
    : `
        brightness: Brightness.light,
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
      `
}

function generateWidgetCode(elements: DesignElement[]): string {
  if (elements.length === 0) {
    return "// No elements added yet"
  }

  return elements
    .map((element) => {
      const positionedWidget = `
Positioned(
  left: ${element.x.toFixed(1)},
  top: ${element.y.toFixed(1)},
  width: ${element.width.toFixed(1)},
  height: ${element.height.toFixed(1)},
  child: ${generateElementWidget(element)},
),`
      return positionedWidget
    })
    .join("\n")
}

function generateElementWidget(element: DesignElement): string {
  const { type, properties } = element

  switch (type) {
    case "button":
      return generateButtonWidget(properties)
    case "textField":
      return generateTextFieldWidget(properties)
    case "card":
      return generateCardWidget(properties)
    case "list":
      return generateListWidget(properties)
    case "icon":
      return generateIconWidget(properties)
    case "container":
      return generateContainerWidget(properties)
    case "row":
      return generateRowWidget(properties)
    case "column":
      return generateColumnWidget(properties)
    case "stack":
      return generateStackWidget(properties)
    case "switch":
      return generateSwitchWidget(properties)
    case "checkbox":
      return generateCheckboxWidget(properties)
    case "radio":
      return generateRadioWidget(properties)
    default:
      return "Container()"
  }
}

function generateButtonWidget(properties: Record<string, any>): string {
  const { text, variant, rounded, color, textColor, padding } = properties

  if (variant === "outline") {
    return `
OutlinedButton(
  onPressed: () {},
  style: OutlinedButton.styleFrom(
    foregroundColor: Color(${hexToArgb(color)}),
    side: BorderSide(color: Color(${hexToArgb(color)})),
    shape: ${rounded ? "const StadiumBorder()" : "RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0))"},
    padding: EdgeInsets.all(${padding.toFixed(1)}),
  ),
  child: Text(
    '${text}',
    style: TextStyle(color: Color(${hexToArgb(color)})),
  ),
)`
  } else {
    return `
ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    backgroundColor: Color(${hexToArgb(color)}),
    foregroundColor: Color(${hexToArgb(textColor)}),
    shape: ${rounded ? "const StadiumBorder()" : "RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0))"},
    padding: EdgeInsets.all(${padding.toFixed(1)}),
  ),
  child: Text('${text}'),
)`
  }
}

function generateTextFieldWidget(properties: Record<string, any>): string {
  const { hint, label, hasIcon, icon, validation } = properties

  return `
TextField(
  decoration: InputDecoration(
    labelText: '${label}',
    hintText: '${hint}',
    ${hasIcon ? `prefixIcon: const Icon(Icons.${icon || "search"}),` : ""}
    ${validation ? "errorText: 'Please enter a valid value'," : ""}
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
    ),
  ),
)`
}

function generateCardWidget(properties: Record<string, any>): string {
  const { elevation, borderRadius, color, padding } = properties

  return `
Card(
  elevation: ${elevation.toFixed(1)},
  color: Color(${hexToArgb(color)}),
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(${borderRadius.toFixed(1)}),
  ),
  child: Padding(
    padding: EdgeInsets.all(${padding.toFixed(1)}),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          height: 20.0,
          width: 150.0,
          color: Colors.grey.shade300,
        ),
        const SizedBox(height: 8.0),
        Container(
          height: 12.0,
          width: 100.0,
          color: Colors.grey.shade300,
        ),
        const SizedBox(height: 16.0),
        Container(
          height: 100.0,
          color: Colors.grey.shade300,
        ),
      ],
    ),
  ),
)`
}

function generateListWidget(properties: Record<string, any>): string {
  const { direction, scrollable, itemCount, itemHeight } = properties

  if (direction === "horizontal") {
    return `
SizedBox(
  height: ${itemHeight.toFixed(1)},
  child: ListView.builder(
    scrollDirection: Axis.horizontal,
    itemCount: ${itemCount},
    itemBuilder: (context, index) {
      return Container(
        width: 150.0,
        margin: const EdgeInsets.only(right: 8.0),
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(8.0),
        ),
        child: Row(
          children: [
            const SizedBox(width: 8.0),
            Container(
              width: 24.0,
              height: 24.0,
              decoration: const BoxDecoration(
                color: Colors.grey,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8.0),
            Container(
              width: 80.0,
              height: 16.0,
              color: Colors.grey.shade300,
            ),
          ],
        ),
      );
    },
  ),
)`
  } else {
    return `
ListView.builder(
  itemCount: ${itemCount},
  itemBuilder: (context, index) {
    return Container(
      height: ${itemHeight.toFixed(1)},
      margin: const EdgeInsets.only(bottom: 8.0),
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Row(
        children: [
          const SizedBox(width: 16.0),
          Container(
            width: 24.0,
            height: 24.0,
            decoration: const BoxDecoration(
              color: Colors.grey,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 16.0),
          Container(
            width: 120.0,
            height: 16.0,
            color: Colors.grey.shade300,
          ),
        ],
      ),
    );
  },
)`
  }
}

function generateIconWidget(properties: Record<string, any>): string {
  const { name, color, size } = properties

  return `
Icon(
  Icons.${name || "star"},
  color: Color(${hexToArgb(color)}),
  size: ${size.toFixed(1)},
)`
}

function generateContainerWidget(properties: Record<string, any>): string {
  const { color, padding, margin, borderRadius } = properties

  return `
Container(
  padding: EdgeInsets.all(${padding.toFixed(1)}),
  margin: EdgeInsets.all(${margin.toFixed(1)}),
  decoration: BoxDecoration(
    color: Color(${hexToArgb(color)}),
    borderRadius: BorderRadius.circular(${borderRadius.toFixed(1)}),
  ),
)`
}

function generateRowWidget(properties: Record<string, any>): string {
  const { mainAxisAlignment, crossAxisAlignment, padding } = properties

  let mainAxisAlignmentValue = "MainAxisAlignment.start"
  if (mainAxisAlignment === "center") mainAxisAlignmentValue = "MainAxisAlignment.center"
  if (mainAxisAlignment === "end") mainAxisAlignmentValue = "MainAxisAlignment.end"
  if (mainAxisAlignment === "spaceBetween") mainAxisAlignmentValue = "MainAxisAlignment.spaceBetween"
  if (mainAxisAlignment === "spaceAround") mainAxisAlignmentValue = "MainAxisAlignment.spaceAround"
  if (mainAxisAlignment === "spaceEvenly") mainAxisAlignmentValue = "MainAxisAlignment.spaceEvenly"

  let crossAxisAlignmentValue = "CrossAxisAlignment.start"
  if (crossAxisAlignment === "center") crossAxisAlignmentValue = "CrossAxisAlignment.center"
  if (crossAxisAlignment === "end") crossAxisAlignmentValue = "CrossAxisAlignment.end"
  if (crossAxisAlignment === "stretch") crossAxisAlignmentValue = "CrossAxisAlignment.stretch"

  return `
Padding(
  padding: EdgeInsets.all(${padding.toFixed(1)}),
  child: Row(
    mainAxisAlignment: ${mainAxisAlignmentValue},
    crossAxisAlignment: ${crossAxisAlignmentValue},
    children: [
      Container(
        width: 30.0,
        height: 30.0,
        color: Colors.grey.shade300,
      ),
      const SizedBox(width: 8.0),
      Container(
        width: 30.0,
        height: 30.0,
        color: Colors.grey.shade300,
      ),
      const SizedBox(width: 8.0),
      Container(
        width: 30.0,
        height: 30.0,
        color: Colors.grey.shade300,
      ),
    ],
  ),
)`
}

function generateColumnWidget(properties: Record<string, any>): string {
  const { mainAxisAlignment, crossAxisAlignment, padding } = properties

  let mainAxisAlignmentValue = "MainAxisAlignment.start"
  if (mainAxisAlignment === "center") mainAxisAlignmentValue = "MainAxisAlignment.center"
  if (mainAxisAlignment === "end") mainAxisAlignmentValue = "MainAxisAlignment.end"
  if (mainAxisAlignment === "spaceBetween") mainAxisAlignmentValue = "MainAxisAlignment.spaceBetween"
  if (mainAxisAlignment === "spaceAround") mainAxisAlignmentValue = "MainAxisAlignment.spaceAround"
  if (mainAxisAlignment === "spaceEvenly") mainAxisAlignmentValue = "MainAxisAlignment.spaceEvenly"

  let crossAxisAlignmentValue = "CrossAxisAlignment.start"
  if (crossAxisAlignment === "center") crossAxisAlignmentValue = "CrossAxisAlignment.center"
  if (crossAxisAlignment === "end") crossAxisAlignmentValue = "CrossAxisAlignment.end"
  if (crossAxisAlignment === "stretch") crossAxisAlignmentValue = "CrossAxisAlignment.stretch"

  return `
Padding(
  padding: EdgeInsets.all(${padding.toFixed(1)}),
  child: Column(
    mainAxisAlignment: ${mainAxisAlignmentValue},
    crossAxisAlignment: ${crossAxisAlignmentValue},
    children: [
      Container(
        width: 100.0,
        height: 30.0,
        color: Colors.grey.shade300,
      ),
      const SizedBox(height: 8.0),
      Container(
        width: 100.0,
        height: 30.0,
        color: Colors.grey.shade300,
      ),
      const SizedBox(height: 8.0),
      Container(
        width: 100.0,
        height: 30.0,
        color: Colors.grey.shade300,
      ),
    ],
  ),
)`
}

function generateStackWidget(properties: Record<string, any>): string {
  const { alignment, padding } = properties

  let alignmentValue = "Alignment.topLeft"
  if (alignment === "center") alignmentValue = "Alignment.center"
  if (alignment === "topCenter") alignmentValue = "Alignment.topCenter"
  if (alignment === "topRight") alignmentValue = "Alignment.topRight"
  if (alignment === "centerLeft") alignmentValue = "Alignment.centerLeft"
  if (alignment === "centerRight") alignmentValue = "Alignment.centerRight"
  if (alignment === "bottomLeft") alignmentValue = "Alignment.bottomLeft"
  if (alignment === "bottomCenter") alignmentValue = "Alignment.bottomCenter"
  if (alignment === "bottomRight") alignmentValue = "Alignment.bottomRight"

  return `
Padding(
  padding: EdgeInsets.all(${padding.toFixed(1)}),
  child: Stack(
    alignment: ${alignmentValue},
    children: [
      Container(
        width: 60.0,
        height: 60.0,
        color: Colors.grey.shade200,
      ),
      Container(
        width: 40.0,
        height: 40.0,
        color: Colors.grey.shade300,
      ),
    ],
  ),
)`
}

function generateSwitchWidget(properties: Record<string, any>): string {
  const { value, activeColor, inactiveColor } = properties

  return `
Switch(
  value: ${value},
  activeColor: Color(${hexToArgb(activeColor)}),
  inactiveTrackColor: Color(${hexToArgb(inactiveColor)}),
  onChanged: (value) {},
)`
}

function generateCheckboxWidget(properties: Record<string, any>): string {
  const { value, activeColor } = properties

  return `
Checkbox(
  value: ${value},
  activeColor: Color(${hexToArgb(activeColor)}),
  onChanged: (value) {},
)`
}

function generateRadioWidget(properties: Record<string, any>): string {
  const { value, activeColor, groupValue } = properties

  return `
Radio<String>(
  value: '${value ? "option1" : "option2"}',
  groupValue: '${groupValue}',
  activeColor: Color(${hexToArgb(activeColor)}),
  onChanged: (value) {},
)`
}

// Helper function to convert hex color to ARGB integer for Flutter
function hexToArgb(hex: string): string {
  if (!hex || !hex.startsWith("#")) {
    return "0xFF000000"
  }

  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  return `0xFF${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}
