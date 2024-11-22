'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface LineBlockProps {
  treeData: TreeNode;
}

const LineBlock: React.FC<LineBlockProps> = ({ treeData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<
    { node: TreeNode; x: number; y: number; width: number; height: number }[]
  >([]);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        blocksRef.current = [];
        drawTree(ctx, treeData, 20, canvas.height / 2, 150, 100);
      }
    }
  }, [treeData]);

  const drawTree = (
    ctx: CanvasRenderingContext2D,
    node: TreeNode,
    x: number,
    y: number,
    xOffset: number,
    yOffset: number
  ) => {
    const boxWidth = 100;
    const boxHeight = 40;
    const padding = 10; // 左右内边距
    const horizontalLineLength = 20; // 水平线长度

    // 绘制矩形方框
    ctx.strokeRect(x, y - boxHeight / 2, boxWidth, boxHeight);

    // 保存当前绘图状态
    ctx.save();

    // 限制文本绘制区域
    ctx.beginPath();
    ctx.rect(x, y - boxHeight / 2, boxWidth, boxHeight);
    ctx.clip();

    // 设置文本对齐方式
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 绘制文本
    const text = node.name;
    const maxWidth = boxWidth - 2 * padding;
    let displayText = text;
    let textWidth = ctx.measureText(displayText).width;

    // 如果文本宽度超过最大宽度，进行裁剪并添加省略号
    if (textWidth > maxWidth) {
      while (textWidth > maxWidth && displayText.length > 0) {
        displayText = displayText.slice(0, -1);
        textWidth = ctx.measureText(displayText + '...').width;
      }
      displayText += '...';
    }

    ctx.fillText(displayText, x + boxWidth / 2, y);

    // 恢复绘图状态
    ctx.restore();

    // 保存块的位置信息
    blocksRef.current.push({
      node,
      x,
      y: y - boxHeight / 2,
      width: boxWidth,
      height: boxHeight,
    });

    if (node.children) {
      node.children.forEach((child, index) => {
        const childX = x + xOffset;
        const childY = y + (index - (node.children!.length - 1) / 2) * yOffset;

        // 绘制横线
        ctx.beginPath();
        ctx.moveTo(x + boxWidth, y);
        ctx.lineTo(x + boxWidth + horizontalLineLength, y);
        ctx.lineTo(x + boxWidth + horizontalLineLength, childY);
        ctx.lineTo(childX, childY);
        ctx.stroke();

        drawTree(ctx, child, childX, childY, xOffset, yOffset);
      });
    }
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 检查鼠标位置是否在某个块的范围内
      for (const block of blocksRef.current) {
        if (
          x >= block.x &&
          x <= block.x + block.width &&
          y >= block.y &&
          y <= block.y + block.height
        ) {
          setTooltip({
            visible: true,
            x: event.clientX - 180, // 调整偏移量以更接近鼠标
            y: event.clientY - 160, // 调整偏移量以更接近鼠标
            content: block.node.name,
          });
          return;
        }
      }
      setTooltip({ visible: false, x: 0, y: 0, content: '' });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseMove={handleCanvasMouseMove}
      ></canvas>
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '5px',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)', // 中心对齐
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default LineBlock;
