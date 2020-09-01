import G6 from "@antv/g6";
const kubernetes = require('@/assets/kubernetes.svg')
// The symbols for the marker inside the combo
const collapseIcon = (x, y, r) => {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
  ];
};
const expandIcon = (x, y, r) => {
  return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
    ['L', x - r + 2 * r - 4, y],
    ['M', x - r + r, y - r + 4],
    ['L', x, y + r - 4],
  ];
};

G6.registerCombo(
  'kubernetes',
  {
    drawShape: function drawShape(cfg, group) {
      const self = this;
      const r = 2;
      const color = cfg.error ? '#316CE6' : '#316CE6';
      // Get the padding from the configuration
      cfg.padding = cfg.padding || [50, 20, 20, 20];
      // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
      const style = self.getShapeStyle(cfg);
      const x = -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2;
      const y = -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2;
      // Add a rect shape as the keyShape which is the same as the extended rect Combo
      const rect = group.addShape('rect', {
        attrs: {
          ...style,
          x: x,
          y: y,
          width: style.width,
          height: style.height,
          radius: r
        },
        draggable: true,
        name: 'combo-keyShape',
      });
      group.addShape('rect', {
        attrs: {
          x: x,
          y: y,
          width: style.width,
          height: 30,
          fill: color,
          radius: [r, r, 0, 0],
        },
        name: 'title-box',
        draggable: true,
      });
      // left icon
      group.addShape('image', {
        attrs: {
          x: x + 4,
          y: y + 2,
          height: 26,
          width: 26,
          cursor: 'pointer',
          img: kubernetes,

        },
        name: 'node-icon',
      });

      // title text
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: y + 10,
          x: x + 40,
          lineHeight: 20,
          text: cfg.name,
          fill: '#fff',
        },
        name: 'title',
      });
    
      return rect;
    },
    
  },
  'rect',
);