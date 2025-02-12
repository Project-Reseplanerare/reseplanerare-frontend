const CATEGORIES_API = "https://turid.visitvarmland.com/api/v8/categories";

export const fetchCategories = async () => {
    try {
        const response = await fetch(CATEGORIES_API);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        console.log("API Response:", data);

        if (!data || !data.data) {
            console.error("No data received from API");
            return [];
        }

        const mainCategories = data.data.filter((category: any) => category.parent === 1);

        const formattedCategories = mainCategories.map((category: any) => ({
            id: category.id,
            label: category.title,
            subItems: category.children?.map((child: any) => child.title) || []
        }));

        console.log("Formatted Categories:", formattedCategories); 
        return formattedCategories;
    } 
    catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};