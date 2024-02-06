const VARIANTS = [
  { name: 'SM', value: 60 },
  { name: 'MD', value: 100 },
  { name: 'LG', value: 160 },
];

async function createVariants() {
  figma.notify('Creating variants, please wait...');

  // Get frame elements inside selection.
  const frame = figma.currentPage.selection[0];

  if (!frame || frame.type !== 'FRAME') {
    figma.notify('Please select a frame to create variants.');
    return;
  }

  for (const icon of frame.children) {
    if (icon.type !== 'FRAME') continue;

    // For each frame, take name, width and height.
    const { name, width, height } = icon;

    // Take the highest value and expand all frames to that value. (resizing the other dimension proportionally)
    const variantValue = VARIANTS[0].value;
    icon.resize(variantValue, variantValue * (height / width));
  }

  // Center the content inside the frame.
  // Create component.
  // Create new variant for each size.

  figma.notify('Variants created successfully.');
  figma.closePlugin();
}

figma.on('run', createVariants);
