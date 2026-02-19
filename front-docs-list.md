# Elementos a documentar con JSDoc en `frontend`

## 1. Componentes React complejos

- [x] `src/components/Navbar.tsx`
  - `Navbar`

- [x] `src/components/KudoForm.tsx`
  - `KudoForm`

- [x] `src/components/common/ErrorBoundary.tsx`
  - `ErrorBoundary`

- [x] `src/components/common/FormErrorBoundary.tsx`
  - `FormErrorBoundary`

- [x] `src/components/common/GlobalErrorBoundary.tsx`
  - `GlobalErrorBoundary`

- [x] `src/components/common/CustomButton.tsx`
  - `CustomButton`

- [x] `src/components/common/CustomInput.tsx`
  - `CustomInput`

- [x] `src/components/landing/LandingHero.tsx`
  - `LandingHero`

- [x] `src/components/landing/LandingHowItWorks.tsx`
  - `LandingHowItWorks`

- [x] `src/components/landing/LandingTech.tsx`
  - `LandingTech`

- [x] `src/components/landing/LandingAbout.tsx`
  - `LandingAbout`

- [x] `src/components/landing/LandingFooter.tsx`
  - `LandingFooter`

## 2. Hooks personalizados

- [x] `src/hooks/useApp.ts`
  - `useApp`

- [x] `src/hooks/forms/useKudoForm.ts`
  - `useKudoForm`

- [x] `src/hooks/forms/useKudoFormLogic.ts`
  - `useKudoFormLogic`

- [x] `src/hooks/data/useUsers.ts`
  - `useUsers`

- [x] `src/hooks/landing/useArchitectureAnimation.ts`
  - `useArchitectureAnimation`

- [x] `src/hooks/landing/useInfiniteScroll.ts`
  - `useInfiniteScroll`

- [x] `src/hooks/landing/useLaunchSlider.ts`
  - `useLaunchSlider`

- [x] `src/hooks/ui/useAvatarPreview.ts`
  - `useAvatarPreview`

- [x] `src/hooks/ui/useSlider.ts`
  - `useSlider`

## 3. Servicios / API clients

- [x] `src/services/api/client.ts`
  - `apiClient` (instancia/configuración principal)
  - Cualquier función helper exportada (por ejemplo, para configurar headers, interceptores, etc.)

- [x] `src/services/api/kudosService.ts`
  - `kudosService`
  - Métodos públicos utilizados desde hooks/componentes (por ejemplo: `sendKudo`, `getKudos`, `getKudosByUser`, etc.)

## 4. Stores (Zustand)

- [x] `src/store/appStore.ts`
  - `useAppStore` (estado, acciones principales)

- [x] `src/store/userStore.ts`
  - `useUserStore` (estado, acciones principales)

## 5. Utilidades puras

- [x] `src/utils/errorMapper.ts`
  - Funciones exportadas para mapear errores de API a errores de UI/mensajes de usuario
