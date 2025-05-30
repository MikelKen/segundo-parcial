import { ComponentType } from "./types";

// Get default width based on component type
export const getDefaultWidth = (type: ComponentType): number => {
  switch (type) {
    case "button":
      return 120;
    case "textField":
      return 200;
    case "card":
      return 300;
    case "list":
      return 300;
    case "icon":
      return 24;
    case "container":
      return 200;
    case "row":
      return 300;
    case "column":
      return 200;
    case "stack":
      return 200;
    case "switch":
      return 60;
    case "checkbox":
      return 24;
    case "radio":
      return 24;
    case "chatInput":
      return 300;
    case "chatMessage":
      return 250;
    case "dropdown":
      return 200;
    case "inputWithLabel":
      return 200;
    case "switchWithLabel":
      return 200;
    case "radioWithLabel":
      return 200;
    case "checkboxWithLabel":
      return 200;
    case "dynamicTable":
      return 350;
    default:
      return 100;
  }
};

// Get default height based on component type
export const getDefaultHeight = (type: ComponentType): number => {
  switch (type) {
    case "button":
      return 40;
    case "textField":
      return 56;
    case "card":
      return 200;
    case "list":
      return 300;
    case "icon":
      return 24;
    case "container":
      return 200;
    case "row":
      return 50;
    case "column":
      return 200;
    case "stack":
      return 200;
    case "switch":
      return 24;
    case "checkbox":
      return 24;
    case "radio":
      return 24;
    case "chatInput":
      return 50;
    case "chatMessage":
      return 80;
    case "dropdown":
      return 70;
    case "inputWithLabel":
      return 70;
    case "switchWithLabel":
      return 40;
    case "radioWithLabel":
      return 40;
    case "checkboxWithLabel":
      return 40;
    case "dynamicTable":
      return 200;
    default:
      return 50;
  }
};

// Get default properties based on component type
export const getDefaultProperties = (type: ComponentType) => {
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
      };
    case "textField":
      return {
        hint: "Enter text",
        label: "Label",
        hasIcon: false,
        icon: "search",
        validation: false,
        validationMessage: "Please enter a valid value",
      };
    case "card":
      return {
        elevation: 2,
        borderRadius: 8,
        color: "#FFFFFF",
        padding: 16,
        title: "Card Title",
        subtitle: "Card Subtitle",
        content: "This is the main content of the card. You can add any text or description here.",
        showImage: true,
        imageHeight: 120,
      };
    case "list":
      return {
        direction: "vertical",
        scrollable: true,
        itemCount: 5,
        itemHeight: 50,
        data: JSON.stringify([
          { title: "Item 1", subtitle: "Description 1", icon: "star" },
          { title: "Item 2", subtitle: "Description 2", icon: "favorite" },
          { title: "Item 3", subtitle: "Description 3", icon: "home" },
          { title: "Item 4", subtitle: "Description 4", icon: "settings" },
          { title: "Item 5", subtitle: "Description 5", icon: "person" },
        ]),
      };
    case "icon":
      return {
        name: "star",
        color: "#000000",
        size: 24,
      };
    case "container":
      return {
        color: "#E0E0E0",
        padding: 16,
        margin: 8,
        borderRadius: 0,
      };
    case "row":
      return {
        mainAxisAlignment: "start",
        crossAxisAlignment: "center",
        padding: 8,
      };
    case "column":
      return {
        mainAxisAlignment: "start",
        crossAxisAlignment: "center",
        padding: 8,
      };
    case "stack":
      return {
        alignment: "center",
        padding: 8,
      };
    case "switch":
      return {
        value: false,
        activeColor: "#2196F3",
        inactiveColor: "#9E9E9E",
      };
    case "checkbox":
      return {
        value: false,
        activeColor: "#2196F3",
      };
    case "radio":
      return {
        value: false,
        activeColor: "#2196F3",
        groupValue: "option1",
      };
    case "chatInput":
      return {
        placeholder: "Type a message...",
        buttonText: "Send",
        buttonColor: "#2196F3",
      };
    case "chatMessage":
      return {
        text: "Hello! This is a sample message.",
        isUser: true,
        avatar: true,
        timestamp: true,
      };
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
      };
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
      };
    case "switchWithLabel":
      return {
        label: "Toggle Switch",
        value: false,
        activeColor: "#2196F3",
        inactiveColor: "#9E9E9E",
        labelPosition: "right",
        disabled: false,
        labelColor: "#374151",
      };
    case "radioWithLabel":
      return {
        label: "Radio Option",
        value: false,
        activeColor: "#2196F3",
        groupValue: "option1",
        labelPosition: "right",
        disabled: false,
        labelColor: "#374151",
      };
    case "checkboxWithLabel":
      return {
        label: "Checkbox Option",
        value: false,
        activeColor: "#2196F3",
        labelPosition: "right",
        disabled: false,
        labelColor: "#374151",
      };
    case "dynamicTable":
      return {
        title: "Data Table",
        columns: JSON.stringify([
          { id: "name", title: "Name", width: 120 },
          { id: "email", title: "Email", width: 180 },
          { id: "role", title: "Role", width: 100 },
        ]),
        data: JSON.stringify([
          { name: "John Doe", email: "john@example.com", role: "Admin" },
          { name: "Jane Smith", email: "jane@example.com", role: "User" },
          { name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
        ]),
        showHeader: true,
        showBorder: true,
        striped: true,
        headerColor: "#f3f4f6",
        borderColor: "#e5e7eb",
        evenRowColor: "#ffffff",
        oddRowColor: "#f9fafb",
        sortable: true,
      };
    default:
      return {};
  }
};
