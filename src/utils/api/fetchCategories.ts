//trafiklap api for categories
const CATEGORIES_API = import.meta.env.VITE_CATEGORIES_API;

export const fetchCategories = async () => {
  try {
    const response = await fetch(CATEGORIES_API);
    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();

    if (!data || !data.data) {
      console.error('No data received from API');
      return [];
    }

    const mainCategories = data.data.filter(
      (category: any) => category.parent === 1
    );

    const formattedCategories = mainCategories.map((category: any) => ({
      id: category.id,
      label: category.title,
      subCategory: category.children?.map((child: any) => child.title) || [],
    }));

    return formattedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
