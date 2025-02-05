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
              className="breadcrumb-link text-darkDark dark:text-lightLight hover:text-darkLight dark:hover:text-lightDark transition duration-200"
            >
              {crumb.label}
            </Link>
          ) : (
            <span
              className="breadcrumb-current font-semibold text-darkDark dark:text-lightLight"
              aria-current="page"
            >
              {crumb.label}
            </span>
          )}
          {index < crumbs.length - 1 && (
            <span className="breadcrumb-separator text-darkDark dark:text-lightLight">
              /
            </span>
          )}
        </span>
      )),
    [crumbs]
  );

  return (
    <nav
      className="breadcrumbs flex justify-center items-center space-x-2 text-sm text-darkDark dark:text-lightLight"
      aria-label="Breadcrumb"
    >
      {breadcrumbItems}
    </nav>
  );
});

export default BreadCrumbs;
