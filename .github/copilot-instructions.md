This is a React application built with Vite, we can only use ES module imports instead of CommonJS require statements. Avoid require.
Use lucide-react icons to provide some iconography to the app.

For logging:
print informative console messages with stage prefixes, timestampts and colors.
when you handle errors, don't just print the error, print out the state of the relevant variables that led to the error.

For Typescript:
Keep the main (App.tsx) file clean and free of logic. Move all logic to separate files. It must be small and readable.
Try to separate types into a types.ts file.
Try to separate small functional utilities into a utils.ts file if it makes sense.
Try to separate large classes into their own files.
Try to keep the components small and focused on a single task.


Follow these rules:

Use simple control flows, no recursion.
All loops must have a fixed upper bound.
Keep functions under 60 lines.
Use TypeScript types and runtime checks. Use the assert library and insert runtime checks.
Prefer block-scoped variables.
Always catch Promise rejections, handle errors and validate parameters.
Avoid overly clever Typescript features.
Minimize complex callback chains.