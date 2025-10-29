# Input Components

A comprehensive set of form input components with consistent styling, accessibility features, and error handling.

## Components

### BaseField
The foundational component that provides consistent structure for all form inputs with labels, help text, and error messages.

### TextInput
Standard text input field for single-line text entry.

### PasswordInput
Password input field with secure text entry.

### Textarea
Multi-line text input for longer content.

### Checkbox
Checkbox input for boolean selections.

### SwitchButton
Tabbed switch component for selecting one option from multiple choices with optional icons.

## Features

- **Consistent Styling**: All inputs follow the same design system
- **Accessibility**: Proper labels, ARIA attributes, and semantic markup
- **Error Handling**: Built-in error display and validation states
- **Help Text**: Optional helper text for guidance
- **Responsive**: Adapts to different screen sizes
- **Flexible**: Extensive props for customization

## API Reference

### BaseFieldProps

All input components extend these base props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Field label displayed above the input |
| `help` | `string` | `undefined` | Helper text displayed below the label |
| `error` | `string` | `undefined` | Error message to display |
| `id` | `string` | `undefined` | HTML id attribute for label association |
| `children` | `ReactNode` | Required | Input element or content |

### TextInput Props

Extends `BaseFieldProps` and all standard `input` attributes.

### PasswordInput Props

Extends `BaseFieldProps` and all standard `input` attributes. Automatically sets `type="password"`.

### Textarea Props

Extends `BaseFieldProps` and all standard `textarea` attributes.

### Checkbox Props

Extends `BaseFieldProps` and all standard `input` attributes. Automatically sets `type="checkbox"`.

### SwitchButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T` | Required | Currently selected value |
| `options` | `Array<SwitchOption<T>>` | Required | Array of options to display |
| `onChange` | `(val: T) => void` | Required | Callback when selection changes |
| `disabled` | `boolean` | `false` | Whether the switch is disabled |

### SwitchOption

| Prop | Type | Description |
|------|------|-------------|
| `value` | `T` | Option value |
| `label` | `string` | Display label |
| `icon` | `string` | Optional icon name |

## Usage

### Basic Text Input

```tsx
import { TextInput } from '@/components/Input';

function Example() {
  return (
    <TextInput
      id="name"
      label="Name"
      help="Enter your full name"
      placeholder="John Doe"
    />
  );
}
```

### Input with Error

```tsx
import { TextInput } from '@/components/Input';

function ErrorExample() {
  return (
    <TextInput
      id="email"
      label="Email"
      error="Please enter a valid email address"
      placeholder="john@example.com"
    />
  );
}
```

### Password Input

```tsx
import { PasswordInput } from '@/components/Input';

function PasswordExample() {
  return (
    <PasswordInput
      id="password"
      label="Password"
      help="Must be at least 8 characters"
      required
    />
  );
}
```

### Textarea

```tsx
import { Textarea } from '@/components/Input';

function TextareaExample() {
  return (
    <Textarea
      id="description"
      label="Description"
      help="Provide a detailed description"
      rows={4}
      placeholder="Enter description here..."
    />
  );
}
```

### Checkbox

```tsx
import { Checkbox } from '@/components/Input';

function CheckboxExample() {
  return (
    <Checkbox
      id="terms"
      label="I agree to the terms and conditions"
      help="You must accept the terms to continue"
    />
  );
}
```

### Switch Button

```tsx
import { SwitchButton } from '@/components/Input';

function SwitchExample() {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <SwitchButton
      id="plan"
      label="Billing Plan"
      value={plan}
      onChange={setPlan}
      options={[
        { value: 'monthly', label: 'Monthly', icon: 'calendar' },
        { value: 'yearly', label: 'Yearly', icon: 'award' }
      ]}
    />
  );
}
```

### Form Integration

```tsx
import { TextInput, PasswordInput, Checkbox } from '@/components/Input';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  return (
    <form>
      <TextInput
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      
      <PasswordInput
        id="password"
        label="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      
      <Checkbox
        id="remember"
        label="Remember me"
        checked={formData.remember}
        onChange={(e) => setFormData({...formData, remember: e.target.checked})}
      />
    </form>
  );
}
```

## Styling

All input components use BEM-style class names:

- `.field` - Base field container
- `.field--error` - Error state modifier
- `.field__label-container` - Label and help container
- `.field__label` - Label text
- `.field__help` - Help text
- `.field__control` - Input control container
- `.field__error` - Error message

Input-specific classes:
- `.input` - Text input base class
- `.textarea` - Textarea base class
- `.checkbox` - Checkbox base class
- `.switch` - Switch button base class

## Accessibility

- All inputs have proper label associations
- Error messages use `role="alert"`
- Switch buttons use `role="tablist"` and `role="tab"`
- Semantic HTML elements are used throughout
- Keyboard navigation is fully supported

## Dependencies

- `@/utils/bemm` - For BEM class name generation
- `@/components/Icon` - For switch button icons