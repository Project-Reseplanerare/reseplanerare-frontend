import React from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  link?: string;
}

interface BreadCrumbsProps {
  crumbs: Crumb[];
}

function BreadCrumbs({ crumbs }: BreadCrumbsProps) {
  return (
    <nav
      className="breadcrumbs flex justify-center items-center space-x-2 text-sm "
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb: Crumb, index: number) => (
        <React.Fragment key={index}>
          {crumb.link ? (
            <Link
              to={crumb.link}
              className="breadcrumb-link text-gray-500 hover:text-blue-600 transition duration-200"
            >
              {crumb.label}
            </Link>
          ) : (
            <span
              className="breadcrumb-current font-semibold text-blue-700"
              aria-current="page"
            >
              {crumb.label}
            </span>
          )}
          {index < crumbs.length - 1 && (
            <span className="breadcrumb-separator text-gray-400">{'/'}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default BreadCrumbs;
