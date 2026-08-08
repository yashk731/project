import { useState } from 'react';
import type { OrgNode } from '../types';

interface OrgChartProps {
  nodes: OrgNode[];
}

interface TreeNode extends OrgNode {
  children: TreeNode[];
}

function buildTree(nodes: OrgNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  nodes.forEach(n => map.set(n.id, { ...n, children: [] }));
  const roots: TreeNode[] = [];
  map.forEach(node => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function NodeCard({ node, onToggle, collapsed, depth }: { node: TreeNode; onToggle: (id: string) => void; collapsed: Set<string>; depth: number }) {
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed.has(node.id);

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        className="relative group cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={() => hasChildren && onToggle(node.id)}
      >
        <div
          className="rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-[#cc0000]/30 transition-all duration-300 overflow-hidden"
          style={{ width: '180px' }}
        >
          {/* Photo circle */}
          <div className="flex justify-center pt-5 pb-2">
            <div className="relative">
              <div
                className="rounded-full overflow-hidden border-4 border-white shadow-md"
                style={{ width: '80px', height: '80px' }}
              >
                {node.photo ? (
                  <img src={node.photo} alt={node.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#cc0000] to-[#990000] flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {node.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {depth === 0 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#cc0000] border-2 border-white flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12l-3 3h6l-3-3zM4 7h12v2H4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          {/* Name + role */}
          <div className="px-3 pb-4 pt-1 text-center">
            <p className="font-bold text-gray-800 text-sm leading-tight">{node.name}</p>
            <p className="text-[#cc0000] font-semibold text-xs mt-0.5">{node.role}</p>
            {node.location && (
              <p className="text-gray-400 text-[10px] mt-1 flex items-center justify-center gap-1">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 016 6c0 4.5-6 10-6 10S4 12.5 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {node.location}
              </p>
            )}
          </div>
        </div>
        {/* Expand/collapse button */}
        {hasChildren && (
          <button
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#cc0000] text-[#cc0000] flex items-center justify-center shadow-sm hover:bg-[#cc0000] hover:text-white transition-colors duration-200 z-10"
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          >
            <svg className="w-3 h-3 transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <>
          {/* Vertical line down */}
          <div className="w-px h-6 bg-gray-200"></div>
          {/* Children row */}
          <div className="flex items-start gap-6 relative">
            {/* Horizontal connector */}
            {node.children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-200" style={{ left: '50%', right: '50%', width: 'auto' }}></div>
            )}
            {node.children.map((child, idx) => (
              <div key={child.id} className="flex flex-col items-center relative">
                {/* Connector to child */}
                <div className="w-px h-6 bg-gray-200"></div>
                <NodeCard node={child} onToggle={onToggle} collapsed={collapsed} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgChart({ nodes }: OrgChartProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const tree = buildTree(nodes);

  const toggle = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (tree.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="min-w-fit flex justify-center">
        <div className="flex flex-col items-center gap-0">
          {tree.map((root, idx) => (
            <div key={root.id} className={idx > 0 ? 'mt-12' : ''}>
              <NodeCard node={root} onToggle={toggle} collapsed={collapsed} depth={0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
