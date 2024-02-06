const VARIANTS = [
  { name: 'SM', value: 60 },
  { name: 'MD', value: 100 },
  { name: 'LG', value: 160 },
];

async function createIconComponents() {
  figma.notify('Creating variants, please wait...');

  // Get frame elements inside selection.
  const frame = figma.currentPage.selection[0];

  if (!frame || frame.type !== 'FRAME') {
    figma.notify('Please select a frame to create variants.');
    figma.closePlugin();
    return;
  }

  // Create frame for output.
  const outputFrame = figma.createFrame();
  outputFrame.name = 'Components ' + new Date().toISOString();
  outputFrame.layoutMode = 'HORIZONTAL';
  outputFrame.itemSpacing = 100;
  outputFrame.primaryAxisSizingMode = 'AUTO';
  outputFrame.counterAxisSizingMode = 'AUTO';
  outputFrame.verticalPadding = 100;
  outputFrame.horizontalPadding = 100;

  for (const icon of frame.children) {
    if (icon.type !== 'FRAME') continue;
    // Create component variants.
    const components = VARIANTS.map((variant) => {
      const clone = icon.clone();
      const component = figma.createComponent();
      component.name = `size=${variant.name}`;
      component.resizeWithoutConstraints(variant.value, variant.value);
      component.appendChild(clone);
      clone.x = 0;
      clone.y = component.height;
      resizeAndCenter(clone, variant.value);
      figma.ungroup(clone);
      return component;
    });

    // Create component set.
    const componentSet = figma.combineAsVariants(components, outputFrame);
    componentSet.name = icon.name;
    componentSet.layoutMode = 'VERTICAL';
    componentSet.counterAxisAlignItems = 'CENTER';
    componentSet.itemSpacing = 50;
  }

  figma.notify('Variants created successfully.');
  figma.closePlugin();
}

figma.on('run', createIconComponents);

function resizeAndCenter(icon: FrameNode, variantValue: number) {
  // For each frame, take name, width and height.
  const { width, height } = icon;

  // Take the highest value and expand all frames to that value. (resizing the other dimension proportionally)
  if (width > height) {
    icon.resize(variantValue, height * (variantValue / width));
  } else {
    icon.resize(width * (variantValue / height), variantValue);
  }

  // Expand the lowest value to the variant value without resizing the other dimension.
  if (width < height) {
    icon.resizeWithoutConstraints(variantValue, variantValue);
  } else {
    icon.resizeWithoutConstraints(variantValue, variantValue);
  }

  // Get all icon's children, group them and center them inside the frame.
  // (this is necessary to center all the vectors and not each one individually)
  const childrenGroup = figma.group(icon.children, icon);
  childrenGroup.x = icon.width / 2 - childrenGroup.width / 2;
  childrenGroup.y = icon.height / 2 - childrenGroup.height / 2;
  // Un-group the children.
  figma.ungroup(childrenGroup);
}
