# Elementos a documentar con JSDoc en `frontend`

## 1. Componentes React complejos

- [x] `src/components/Navbar.tsx`
  - `Navbar`

- [x] `src/components/KudoForm.tsx`
  - `KudoForm`

- [ ] `src/components/common/ErrorBoundary.tsx`
  - `ErrorBoundary`

- [ ] `src/components/common/FormErrorBoundary.tsx`
  - `FormErrorBoundary`

- [ ] `src/components/common/GlobalErrorBoundary.tsx`
  - `GlobalErrorBoundary`

- [ ] `src/components/common/CustomButton.tsx`
  - `CustomButton`

- [ ] `src/components/common/CustomInput.tsx`
  - `CustomInput`

- [ ] `src/components/landing/LandingHero.tsx`
  - `LandingHero`

- [ ] `src/components/landing/LandingHowItWorks.tsx`
  - `LandingHowItWorks`

- [ ] `src/components/landing/LandingTech.tsx`
  - `LandingTech`

- [ ] `src/components/landing/LandingAbout.tsx`
  - `LandingAbout`

- [ ] `src/components/landing/LandingFooter.tsx`
  - `LandingFooter`

## 2. Hooks personalizados

- [ ] `src/hooks/useApp.ts`
  - `useApp`

- [ ] `src/hooks/forms/useKudoForm.ts`
  - `useKudoForm`

- [ ] `src/hooks/forms/useKudoFormLogic.ts`
  - `useKudoFormLogic`

- [ ] `src/hooks/data/useUsers.ts`
  - `useUsers`

- [ ] `src/hooks/landing/useArchitectureAnimation.ts`
  - `useArchitectureAnimation`

- [ ] `src/hooks/landing/useInfiniteScroll.ts`
  - `useInfiniteScroll`

- [ ] `src/hooks/landing/useLaunchSlider.ts`
  - `useLaunchSlider`

- [ ] `src/hooks/ui/useAvatarPreview.ts`
  - `useAvatarPreview`

- [ ] `src/hooks/ui/useSlider.ts`
  - `useSlider`

## 3. Servicios / API clients

- [ ] `src/services/api/client.ts`
  - `apiClient` (instancia/configuración principal)
  - Cualquier función helper exportada (por ejemplo, para configurar headers, interceptores, etc.)

- [ ] `src/services/api/kudosService.ts`
  - `kudosService`
  - Métodos públicos utilizados desde hooks/componentes (por ejemplo: `sendKudo`, `getKudos`, `getKudosByUser`, etc.)

## 4. Stores (Zustand)

- [ ] `src/store/appStore.ts`
  - `useAppStore` (estado, acciones principales)

- [ ] `src/store/userStore.ts`
  - `useUserStore` (estado, acciones principales)

## 5. Utilidades puras

- [ ] `src/utils/errorMapper.ts`
  - Funciones exportadas para mapear errores de API a errores de UI/mensajes de usuario
