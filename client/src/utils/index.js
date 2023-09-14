function convertColorToRGBA(bgColor) {
  if (!bgColor) return "";

  const red = bgColor.red != null ? Math.round(bgColor.red * 255) : 0;
  const green = bgColor.green != null ? Math.round(bgColor.green * 255) : 0;
  const blue = bgColor.blue != null ? Math.round(bgColor.blue * 255) : 0;
  const alpha = bgColor.alpha != null ? bgColor.alpha : 1;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export { convertColorToRGBA };
