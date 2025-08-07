# Prompt: Landing Page moderna para Axio (React + TypeScript + Tailwind CSS)

## Descripción general

Quiero que me ayudes a crear una landing page moderna y profesional para una empresa llamada **Axio**. Esta empresa ofrece soluciones tecnológicas y soporte IT para negocios. La página debe reflejar una identidad visual clara, moderna y minimalista, con diseño responsive y buen rendimiento.

## Stack requerido

- **React** con **TypeScript**
- **Tailwind CSS** para todo el diseño (sin Bootstrap ni otros frameworks)
- El proyecto debe estar organizado por componentes reutilizables

## Contenido de la página

La landing debe incluir las siguientes secciones:

### 1. Navbar
- Logo de Axio (puede ser texto por ahora)
- Menú de navegación con enlaces: Inicio, Servicios, Nosotros, Contacto
- Debe ser responsive: colapsable en móviles

### 2. Hero principal
- Título fuerte: “Soluciones tecnológicas para tu negocio”
- Subtítulo: breve descripción del enfoque de Axio
- Botón CTA que abre un enlace a WhatsApp con mensaje precargado (por ejemplo: `https://wa.me/549XXXXXXXXXX?text=Hola,%20quiero%20más%20información`)

### 3. Sección de servicios
- Tres o más tarjetas o bloques con íconos y texto:
  - Desarrollo web
  - Soporte IT
  - Consultoría tecnológica

### 4. Sobre nosotros
- Texto institucional con una imagen o ilustración relacionada
- Enfocado en transmitir confianza y experiencia

### 5. Contacto
- Dirección, email, redes sociales (placeholder por ahora)
- Segundo botón de WhatsApp
- (Opcional) formulario de contacto simple

### 6. Footer
- Copyright © Axio
- Enlaces rápidos
- Logo o nombre

## Requisitos técnicos

- Usar solo **Tailwind CSS** para estilos (sin Bootstrap, ni CSS puro).
- Componentes deben estar separados (`/components`, `/pages`, etc.).
- El botón de WhatsApp debe funcionar tanto en desktop como en celular.
- Todo debe ser **responsive**.
- Usar buenas prácticas con `props` tipadas y reutilización de componentes.
- Preparado para desplegar fácilmente en **Vercel** o **Netlify**.

## Instrucciones solicitadas

Copilot debe:
- Generar el proyecto con toda la estructura base (Vite + React + Tailwind + TS recomendado).
- Explicar cómo correrlo localmente paso a paso.
- Explicar cómo cambiar textos, imágenes, íconos y enlaces.
- Dar sugerencias para mejoras visuales o de accesibilidad si detecta algo.

## Contexto del usuario

- Tengo conocimientos generales de informática pero no de programación frontend.
- Necesito guía paso a paso, explicaciones claras y ejemplos visuales si es posible.
- Puedo proporcionar imágenes de referencia más adelante.

---

## Ejemplo de botón de WhatsApp

```tsx
<a
  href="https://wa.me/549XXXXXXXXXX?text=Hola,%20quiero%20más%20información"
  className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
  target="_blank"
  rel="noopener noreferrer"
>
  Contactanos por WhatsApp
</a>
