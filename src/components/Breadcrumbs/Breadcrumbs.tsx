import React from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  link?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs flex justify-center items-center space-x-2 text-sm mb-6">
      {crumbs.map((crumb: Crumb, index: number) => (
        <React.Fragment key={index}>
          {crumb.link ? (
            <Link
              to={crumb.link}
              className="breadcrumb-link text-gray-400 hover:text-blue-700 transition"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="breadcrumb-current font-bold text-blue-700">
              {crumb.label}
            </span>
          )}
          {index < crumbs.length - 1 && (
            <span className="breadcrumb-separator text-gray-400">{'>'}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
