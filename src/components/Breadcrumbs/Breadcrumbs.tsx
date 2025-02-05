import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  link?: string;
}

interface BreadCrumbsProps {
  crumbs: Crumb[];
}

const BreadCrumbs = memo(({ crumbs }: BreadCrumbsProps) => {
  const breadcrumbItems = useMemo(
    () =>
      crumbs.map((crumb, index) => (
        <span key={index} className="flex items-center space-x-1">
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
            <span className="breadcrumb-separator text-gray-400">/</span>
          )}
        </span>
      )),
    [crumbs]
  );

  return (
    <nav
      className="breadcrumbs flex justify-center items-center space-x-2 text-sm"
      aria-label="Breadcrumb"
    >
      {breadcrumbItems}
    </nav>
  );
});

export default BreadCrumbs;
