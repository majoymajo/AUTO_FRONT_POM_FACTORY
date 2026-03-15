# ⚛️ Frontend Standards (React + Vite)

## 🧱 Component Structure

Adhere to the following folder structure:

```
src/
  ├── components/       # Shared/Generic UI components (Buttons, Inputs)
  ├── features/         # Feature-based modules (e.g., /kudos, /users)
  │     ├── components/ # Components specific to this feature
  │     ├── hooks/      # Hooks specific to this feature
  │     └── api/        # API calls specific to this feature
  ├── layouts/          # Page layouts
  └── pages/            # Route entry points
```

## 🎣 Hooks & State

- **Custom Hooks**: Extract complex logic into custom hooks (e.g., `useKudosList()`) to keep components clean.
- **API Calls**: Do not make `fetch/axios` calls directly inside `useEffect`. Abstract them into an API service layer or use a library like **TanStack Query** (if available in dependencies).

## 🎨 Styling

- **Consistency**: Use the defined CSS variables for colors and spacing.
- **Responsive**: Always design Mobile-First.

## ✅ Testing

- **Vitest**: Use for logic and unit tests.
- **React Testing Library**: Use for Component testing.
  - _Rule_: Test behavior (user clicks button), not implementation details (state is set to X).

```javascript
// ✅ CORRECT
test("renders submit button", () => {
  render(<KudoForm />);
  expect(screen.getByRole("button", { name: /enviar/i })).toBeDefined();
});
```
