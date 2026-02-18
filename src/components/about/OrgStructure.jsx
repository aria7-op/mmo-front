// OrgStructure.jsx
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import "./OrgStructure.css";

// Use existing services and utilities
import { getOrganizationProfile } from "../../services/organizationProfile.service";
import { formatMultilingualContent } from "../../utils/apiUtils";

const OrganizationStructure = () => {
  const { t } = useTranslation();
  const [collapsedBranches, setCollapsedBranches] = useState(new Set());

  // Fetch team members data
  const { data: teamData, isLoading: teamLoading, error: teamError } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const response = await fetch('https://khwanzay.school/bak/team-members');
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      throw new Error('Failed to fetch team members');
    },
    staleTime: 5 * 60 * 1000,
  });

  // Toggle branch collapse
  const toggleBranch = useCallback((nodeId) => {
    setCollapsedBranches((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Loading State
  if (teamLoading) {
    return (
      <section className="org-structure-sec">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">
              {t("organization.structure.title", "Organization Structure")}
            </h2>
          </div>
          <div className="org-tree-container">
            <TreeSkeleton />
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (teamError) {
    return (
      <section className="org-structure-sec">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">
              {t("organization.structure.title", "Organization Structure")}
            </h2>
          </div>
          <div className="org-tree-container">
            <div className="tree-empty-state">
              <div className="tree-empty-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3 className="tree-empty-title">
                {t("common.error", "Error Loading Data")}
              </h3>
              <p className="tree-empty-text">{teamError.message}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Transform team members to tree structure
  const transformTeamToTree = (members) => {
    if (!members || members.length === 0) return null;

    // Create CEO/Executive level
    const executives = members.filter(m => m.role === 'Executive' || m.role === 'Board');
    
    // Build tree structure
    const rootNode = {
      id: 'ceo',
      name: executives.length > 0 ? getLocalizedField(executives[0], 'name') : 'Leadership',
      position: executives.length > 0 ? getLocalizedField(executives[0], 'position') : 'Executive Director',
      icon: 'fa-crown',
      image: executives.length > 0 ? (executives[0].image?.url || executives[0].imageUrl) : null,
      children: []
    };

    // Group by roles directly (skip departments)
    const roles = {};
    members.forEach(member => {
      const role = member.role || 'Staff';
      if (!roles[role]) {
        roles[role] = [];
      }
      roles[role].push(member);
    });

    // Add role groups directly under CEO
    Object.keys(roles).forEach(roleName => {
      const roleMembers = roles[roleName];
      const roleNode = {
        id: `role-${roleName}`,
        name: roleName,
        position: `${roleMembers.length} members`,
        icon: getRoleIcon(roleName),
        memberCount: roleMembers.length,
        children: roleMembers.map(member => ({
          id: member._id,
          name: getLocalizedField(member, 'name'),
          position: getLocalizedField(member, 'position'),
          image: member.image?.url || member.imageUrl,
          email: member.email,
          phone: member.phone,
          bio: getLocalizedField(member, 'bio'),
          status: member.active ? 'active' : 'inactive'
        }))
      };
      rootNode.children.push(roleNode);
    });

    return rootNode;
  };

  const getLocalizedField = (obj, field) => {
    if (!obj || !field) return '';
    const lang = t('currentLanguage', 'en') === 'dr' ? 'per' : (t('currentLanguage', 'en') === 'ps' ? 'ps' : 'en');
    return obj[field]?.[lang] || obj[field]?.en || '';
  };

  const getRoleIcon = (role) => {
    const icons = {
      'Board': 'fa-users-gear',
      'Executive': 'fa-crown',
      'Management': 'fa-briefcase',
      'Staff': 'fa-users',
      'Volunteer': 'fa-hand-holding-heart'
    };
    return icons[role] || 'fa-user';
  };

  const getDepartmentIcon = (department) => {
    const icons = {
      'Board': 'fa-chess-board',
      'Executive Office': 'fa-building',
      'Programs': 'fa-project-diagram',
      'Finance': 'fa-chart-line',
      'Operations': 'fa-cogs',
      'Communications': 'fa-bullhorn',
      'Field': 'fa-map-marked-alt'
    };
    return icons[department] || 'fa-sitemap';
  };

  const treeData = transformTeamToTree(teamData);

  // Empty State
  if (!treeData) {
    return (
      <section className="org-structure-sec">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">
              {t("organization.structure.title", "Organization Structure")}
            </h2>
          </div>
          <div className="org-tree-container">
            <div className="tree-empty-state">
              <div className="tree-empty-icon">
                <i className="fas fa-sitemap"></i>
              </div>
              <h3 className="tree-empty-title">
                {t("organization.structure.empty", "No Structure Available")}
              </h3>
              <p className="tree-empty-text">
                {t(
                  "organization.structure.emptyDesc",
                  "The organizational structure has not been set up yet."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="org-structure-sec">
      <div className="container">
        <div className="section-header text-center mb-5">
          <h2 className="section-title">
            {t("organization.structure.title", "Organization Structure")}
          </h2>
          <p className="section-subtitle">
            {t(
              "organization.structure.subtitle",
              "Our hierarchical organization"
            )}
          </p>
        </div>

        <div className="org-tree-container">
          <div className="tree animate-lines">
            <ul>
              <TreeNode
                node={treeData}
                level={0}
                collapsedBranches={collapsedBranches}
                toggleBranch={toggleBranch}
                t={t}
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TREE NODE COMPONENT (Recursive)
// ============================================
const TreeNode = ({ node, level, collapsedBranches, toggleBranch, t }) => {
  if (!node) return null;

  const nodeId = node.id || `node-${level}-${node.name || Math.random()}`;
  const isCollapsed = collapsedBranches.has(nodeId);
  const hasChildren = node.children && node.children.length > 0;

  const getNodeClasses = () => {
    const classes = ["tree-node", `level-${Math.min(level, 5)}`];
    if (level === 0) classes.push("ceo-node");
    if (hasChildren) classes.push("collapsible-branch");
    if (isCollapsed) classes.push("branch-collapsed");
    if (node.highlighted) classes.push("highlighted");
    if (node.selected) classes.push("selected");
    return classes.join(" ");
  };

  return (
    <li>
      <div className={getNodeClasses()}>
        {/* Collapse Toggle Button */}
        {hasChildren && (
          <button
            className="collapse-toggle"
            onClick={() => toggleBranch(nodeId)}
            aria-label={
              isCollapsed
                ? t("common.expand", "Expand")
                : t("common.collapse", "Collapse")
            }
            aria-expanded={!isCollapsed}
          >
            <i className={`fas fa-${isCollapsed ? "plus" : "minus"}`}></i>
          </button>
        )}

        {/* Node Card */}
        <div className="node-card">
          {/* Status Indicator */}
          {node.status && <span className={`node-status ${node.status}`}></span>}

          {/* Badge */}
          {node.badge && <span className="node-badge">{node.badge}</span>}

          {/* Icon/Avatar */}
          <NodeIcon node={node} level={level} />

          {/* Title */}
          <NodeTitle node={node} level={level} />

          {/* Subtitle/Position */}
          {node.position && (
            <p
              className={`node-subtitle level-${Math.min(level, 5)} ${
                level === 0
                  ? "ceo-position"
                  : level === 1
                  ? "department-head"
                  : level === 2
                  ? "team-lead"
                  : "member-role"
              }`}
            >
              {node.position}
            </p>
          )}

          {/* Meta Info */}
          {node.meta && (
            <span className={`node-meta level-${Math.min(level, 5)}`}>
              {node.meta}
            </span>
          )}

          {/* Member Count */}
          {node.memberCount !== undefined && node.memberCount !== null && (
            <span className="node-count">
              <i className="fas fa-users"></i> {node.memberCount}{" "}
              {t("common.members", "members")}
            </span>
          )}
        </div>

        {/* Tooltip */}
        {node.tooltip && <div className="node-tooltip">{node.tooltip}</div>}
      </div>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <ul>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id || `${nodeId}-child-${index}`}
              node={child}
              level={level + 1}
              collapsedBranches={collapsedBranches}
              toggleBranch={toggleBranch}
              t={t}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// ============================================
// NODE ICON COMPONENT
// ============================================
const NodeIcon = ({ node, level }) => {
  const iconClass =
    level === 0
      ? "ceo-icon"
      : level === 1
      ? "department-icon"
      : level === 2
      ? "team-icon"
      : "member-avatar";

  // If node has an image
  if (node.image) {
    return (
      <div className={`node-icon level-${Math.min(level, 5)} ${iconClass}`}>
        <img src={node.image} alt={node.name || ""} />
      </div>
    );
  }

  // If node has initials
  if (node.initials) {
    return (
      <div className={`node-icon level-${Math.min(level, 5)} ${iconClass}`}>
        {node.initials}
      </div>
    );
  }

  // Default icon based on level or type
  const getDefaultIcon = () => {
    if (node.icon) return node.icon;

    switch (level) {
      case 0:
        return "fa-crown";
      case 1:
        return "fa-briefcase";
      case 2:
        return "fa-users";
      case 3:
        return "fa-user";
      default:
        return "fa-user";
    }
  };

  return (
    <div className={`node-icon level-${Math.min(level, 5)} ${iconClass}`}>
      <i className={`fas ${getDefaultIcon()}`}></i>
    </div>
  );
};

// ============================================
// NODE TITLE COMPONENT
// ============================================
const NodeTitle = ({ node, level }) => {
  const titleClass =
    level === 0
      ? "ceo-title"
      : level === 1
      ? "department-title"
      : level === 2
      ? "team-title"
      : "member-name";

  const Tag =
    level <= 1 ? "h3" : level === 2 ? "h4" : level === 3 ? "h5" : "p";

  return (
    <Tag className={`node-title level-${Math.min(level, 5)} ${titleClass}`}>
      {node.name || node.title}
    </Tag>
  );
};

// ============================================
// LOADING SKELETON
// ============================================
const TreeSkeleton = () => {
  return (
    <div className="tree tree-skeleton">
      <ul>
        <li>
          <div className="tree-node level-0 ceo-node">
            <div className="node-card">
              <div className="node-icon level-0 ceo-icon skeleton-box"></div>
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-subtitle"></div>
            </div>
          </div>
          <ul>
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <div className="tree-node level-1">
                  <div className="node-card">
                    <div className="node-icon level-1 skeleton-box"></div>
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-subtitle"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default OrganizationStructure;